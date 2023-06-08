import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAnthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    // para realizar o teste somente depois que o app estiver pronto
    await app.ready()
  })
  afterAll(async () => {
    // depois que finalizar os testes aguarde a finalização do app
    await app.close()
  })
  it('should be able to create check-in', async () => {
    const { token } = await createAnthenticateUser(app)

    // criando usando o prisma // so de exemplo
    const gym = await prisma.gym.create({
      data: {
        title: 'gugu',
        latitude: -23.6042004,
        longitude: -46.6988629,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.6042004,
        longitude: -46.6988629,
      })

    expect(response.statusCode).toEqual(201)
  })
})
