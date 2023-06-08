import { app } from '@/app'
import { createAnthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    // para realizar o teste somente depois que o app estiver pronto
    await app.ready()
  })
  afterAll(async () => {
    // depois que finalizar os testes aguarde a finalização do app
    await app.close()
  })
  it('should be able to create gym', async () => {
    const { token } = await createAnthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia Gutemberg',
        description: 'testando app',
        phone: '11958695425',
        latitude: -23.6042004,
        longitude: -46.6988629,
      })

    expect(response.statusCode).toEqual(201)
  })
})
