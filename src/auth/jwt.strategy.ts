import {Injectable, UnauthorizedException} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersRepository } from './users.repository'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET')
    if (!secret) {
      // fail fast during application bootstrap
      throw new Error('JWT_SECRET environment variable is not set')
    }

    // Strategy options expect secretOrKey: string | Buffer (no undefined)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    })
  }

  async validate(payload: JwtPayload) {
    const { username } = payload
    const user = await this.usersRepository.findByUsername(username)

    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
