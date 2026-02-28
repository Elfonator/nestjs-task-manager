import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UsersRepository } from './users.repository'
import { DataSource } from 'typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { JwtStrategy } from './jwt.strategy'
import envConfig from '../config/env.config'
import { Env } from '../config/env.schema'

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [envConfig.KEY],
      useFactory: (env: Env) => ({
        secret: env.JWT_SECRET,
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) =>
        new UsersRepository(dataSource.getRepository(User)),
      inject: [DataSource],
    },
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
