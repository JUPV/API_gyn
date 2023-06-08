import { makeGetUserMatricsUseCase } from '@/use-cases/factories/make-get-user-matrics-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMatricsUserCase = makeGetUserMatricsUseCase()
  const { checkInsCount } = await getUserMatricsUserCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
