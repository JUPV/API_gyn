import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    }
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
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
}
