import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAnthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    // para realizar o teste somente depois que o app estiver pronto
    await app.ready()
  })
  afterAll(async () => {
    // depois que finalizar os testes aguarde a finalização do app
    await app.close()
  })
  it('should be able to validate check-in', async () => {
    const { token } = await createAnthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    // criando usando o prisma // so de exemplo
    const gym = await prisma.gym.create({
      data: {
        title: 'gugu',
        latitude: -23.6042004,
        longitude: -46.6988629,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
