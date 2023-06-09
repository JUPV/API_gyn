import { makeCkeckInUseCase } from '@/use-cases/factories/make-ckeck-in-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const ckeckInUserCase = makeCkeckInUseCase()
  await ckeckInUserCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongituide: longitude,
  })

  return reply.status(201).send()
}
