import { Repository } from 'typeorm'
import { Task } from './task.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import { NotFoundException } from '@nestjs/common'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'

class TasksRepository {
  constructor(private readonly taskRepository: Repository<Task>) {}

  async getTasks(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto
    // query build
    const query = this.taskRepository.createQueryBuilder('task')

    if (status) {
      // custom argument -> name of variables and object with values
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR ' +
          'LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      )
    }

    return await query.getMany()
  }

  async getTaskById(id: string) {
    const found = await this.taskRepository.findOneBy({ id })
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
    return found
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    })
    return this.taskRepository.save(task)
  }

  async deleteTask(id: string) {
    const result = await this.taskRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id)
    task.status = status
    await this.taskRepository.save(task)
    return task
  }
}

export default TasksRepository
