import { Repository } from 'typeorm'
import { Task } from './task.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { User } from '../auth/user.entity'

class TasksRepository {
  private logger = new Logger('TasksRepository') //with timestamp
  constructor(private readonly taskRepository: Repository<Task>) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User) {
    const { status, search } = filterDto
    // query build
    const query = this.taskRepository.createQueryBuilder('task')
    query.where({ user })

    if (status) {
      // custom argument -> name of variables and object with values
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR ' +
          'LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      )
    }

    try {
      return await query.getMany()
    } catch (error) {
      //log
      this.logger.error(
        `Failed to get tasks for user ${user.username}. Filters: ${JSON.stringify(filterDto)}`,
        error,
      )
      throw new InternalServerErrorException()
    }
  }

  async getTaskById(id: string, user: User) {
    const found = await this.taskRepository.findOneBy({ id, user })
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
    return found
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    })
    await this.taskRepository.save(task)
    return task
  }

  async deleteTask(id: string, user: User) {
    const result = await this.taskRepository.delete({ id, user })
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user)
    task.status = status
    await this.taskRepository.save(task)
    return task
  }
}

export default TasksRepository
