import { Repository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import {
  ConflictException,
  InternalServerErrorException, UnauthorizedException,
} from '@nestjs/common'
import * as argon2 from 'argon2'

export class UsersRepository {
  constructor(private usersRepository: Repository<User>) {}

  async findByUsername(username: string) {
    const found = await this.usersRepository.findOne({ where: { username } })
    if (!found) {
      throw new UnauthorizedException('User does not exist')
    }
    return found
  }

  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto

    const hash = await argon2.hash(password)

    const user = this.usersRepository.create({
      username,
      password: hash,
    })

    try {
      await this.usersRepository.save(user)
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
}
