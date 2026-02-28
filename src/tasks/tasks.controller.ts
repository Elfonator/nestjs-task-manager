import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../auth/user.entity'
import { GetUser } from '../auth/get-user.decorator'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController')
  //this parameter will be a private property of this controller
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User) {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    )
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user)
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    this.logger.verbose(
      `User ${user.username} created task. Data: ${JSON.stringify(createTaskDto)}`,
    )
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    const { status } = updateTaskStatusDto
    return this.tasksService.updateTaskStatus(id, status, user)
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.deleteTask(id, user)
  }
}
