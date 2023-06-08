import { app } from '@/app'
import { createAnthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    // para realizar o teste somente depois que o app estiver pronto
    await app.ready()
  })
  afterAll(async () => {
    // depois que finalizar os testes aguarde a finalização do app
    await app.close()
  })
  it('Pesquisa de academia', async () => {
    const { token } = await createAnthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia Gutemberg',
        description: 'testando app',
        phone: '11958695425',
        latitude: -23.6042004,
        longitude: -46.6988629,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia Maria',
        description: 'testando app',
        phone: '11958695425',
        latitude: -23.6042004,
        longitude: -46.6988629,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Gutemberg',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Academia Gutemberg',
      }),
    ])
  })
})
