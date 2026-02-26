import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  //this parameter will be a private property of this controller
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  fetchTask(@Param('id') id: string) {
    return this.tasksService
  }

  @Post()
  createTask1(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }
  /*
  @Post()
  //retrieve entire request body, disadvantages - non-existing parameters are included
  createTask(@Body() body) {
    console.log('body', body);
  }
  */

}
