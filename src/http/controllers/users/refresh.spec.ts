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
describe('Refresh Token (e2e)', () => {
  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'Gutemberg',
      email: 'gutembergsouzadejesus@gmail.com',
      password: '123456',
    })

    const autoResponse = await request(app.server).post('/sessions').send({
      email: 'gutembergsouzadejesus@gmail.com',
      password: '123456',
    })

    const cookies = autoResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
