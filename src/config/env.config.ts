import { registerAs } from '@nestjs/config'
import { envSchema } from './env.schema'

export default registerAs('env', () => envSchema.parse(process.env))
