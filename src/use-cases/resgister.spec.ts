import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('Teste de cadastro de usuário normal.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUserCase.execute({
      name: 'Gutemberg Souza de Jesus',
      email: 'gutembergsouzadejesus@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('A senha do usuário deve virar um hash assim que entrar na aplicação.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUserCase.execute({
      name: 'Gutemberg Souza de Jesus',
      email: 'gutembergsouzadejesus@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Não é possível se registar com o mesmo e-mail.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUseCase(usersRepository)

    const email = 'teste25696666@teste.com'

    await registerUserCase.execute({
      name: 'Gutemberg Souza de Jesus',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUserCase.execute({
        name: 'Gutemberg Souza de Jesus',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
