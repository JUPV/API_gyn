import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
beforeAll(async () => {
  // para realizar o teste somente depois que o app estiver pronto
  await app.ready()
})
afterAll(async () => {
  // depois que finalizar os testes aguarde a finalização do app
  await app.close()
})
describe('Authenticate (e2e)', () => {
  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Gutemberg',
      email: 'gutembergsouzadejesus@gmail.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'gutembergsouzadejesus@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
