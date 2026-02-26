import { Injectable } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import TasksRepository from './tasks.repository'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'

@Injectable()
export class TasksService {
  //dependency injection
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto) {
    return this.tasksRepository.getTasks(filterDto)
  }

  async getTaskById(id: string) {
    return this.tasksRepository.getTaskById(id)
  }

  createTask(dto: CreateTaskDto) {
    return this.tasksRepository.createTask(dto)
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    return this.tasksRepository.updateTaskStatus(id, status)
  }

  deleteTask(id: string) {
    return this.tasksRepository.deleteTask(id)
  }
}
