import { Injectable } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import TasksRepository from './tasks.repository'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { User } from '../auth/user.entity'

@Injectable()
export class TasksService {
  //dependency injection
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User) {
    return this.tasksRepository.getTasks(filterDto, user)
  }

  async getTaskById(id: string, user: User) {
    return this.tasksRepository.getTaskById(id, user)
  }

  createTask(dto: CreateTaskDto, user: User) {
    return this.tasksRepository.createTask(dto, user)
  }

  updateTaskStatus(id: string, status: TaskStatus, user: User) {
    return this.tasksRepository.updateTaskStatus(id, status, user)
  }


  deleteTask(id: string, user: User) {
    return this.tasksRepository.deleteTask(id, user)
  }
}
