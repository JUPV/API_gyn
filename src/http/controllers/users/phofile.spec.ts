import { app } from '@/app'
import { createAnthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    // para realizar o teste somente depois que o app estiver pronto
    await app.ready()
  })
  afterAll(async () => {
    // depois que finalizar os testes aguarde a finalização do app
    await app.close()
  })
  it('should be able to profile', async () => {
    const { token } = await createAnthenticateUser(app)

    const profileReponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileReponse.statusCode).toEqual(200)
    expect(profileReponse.body.user).toEqual(
      expect.objectContaining({
        email: 'gutembergsouzadejesus@gmail.com',
      })
    )
  })
})
