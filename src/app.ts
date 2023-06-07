import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(appRoutes)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ massage: 'Validation erro.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // enviar o erro para um apricativo de alerta ex: DataDog/NewRelic/Sentry
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})
