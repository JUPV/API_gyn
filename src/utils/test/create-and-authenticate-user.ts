import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAnthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Gutemberg',
    email: 'gutembergsouzadejesus@gmail.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'gutembergsouzadejesus@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body
  return { token }
}
