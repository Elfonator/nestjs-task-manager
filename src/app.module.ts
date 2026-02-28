import { Module } from '@nestjs/common'
import { TasksModule } from './tasks/tasks.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import envConfig from './config/env.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      isGlobal: true,
      load: [envConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [envConfig.KEY],
      useFactory: (env: ConfigType<typeof envConfig>) => ({
        type: 'postgres',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        autoLoadEntities: true, // translation to schemas
        synchronize: true, // keep schema in sync
        extra: {
          max: 10, // maximum number of connections in pool
          min: 2, // minimum number of connections in pool
          idleTimeoutMillis: 30000, // close idle connections after 30 seconds
        },
      }),
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
