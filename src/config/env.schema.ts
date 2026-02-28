import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000).optional(),
  STAGE: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  JWT_SECRET: z.string(),
})

export type Env = z.infer<typeof envSchema>
