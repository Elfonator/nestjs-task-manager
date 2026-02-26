import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.usersRepository.createUser(authCredentialsDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto
    const user = await this.usersRepository.findByUsername(username)

    if (user && (await argon2.verify(user.password, password))) {
      const payload: JwtPayload = { username }
      const accessToken = this.jwtService.sign(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException('Please check your login credentials')
    }
  }
}
