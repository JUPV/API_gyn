import { InvalisCredentialsErros } from '@/use-cases/errors/invalid-credentials-erros'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)
  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // se o usuario ficar 7 dias fora o usuario fica deslogado
        },
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // criptografado via https
        sameSite: true, // nao acesivel a outros sites
        httpOnly: true, // so pode ser acessado pelo beckend
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalisCredentialsErros) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
