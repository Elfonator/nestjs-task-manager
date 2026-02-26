import { Module } from '@nestjs/common'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './task.entity'
import TasksRepository from './tasks.repository'
import { DataSource } from 'typeorm'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TasksRepository,
      useFactory: (dataSource: DataSource) => {
        const repo = dataSource.getRepository(Task)
        return new TasksRepository(repo)
      },
      inject: [DataSource],
    },
  ],
  exports: [TasksRepository, TasksService],
})
export class TasksModule {}
