import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

/* const usersRepository = new InMemoryUsersRepository()
const registerUserCase = new RegisterUseCase(usersRepository) */

// aqui é o repositorio que iremos usar
let usersRepository: InMemoryUsersRepository

// aqui é o caso de uso utilizando o repositorio
let sut: RegisterUseCase

describe('Register Use Case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    usersRepository = new InMemoryUsersRepository()
    // estaciando o caso de uso
    sut = new RegisterUseCase(usersRepository)
  })

  // testes: it
  it('Teste de cadastro de usuário normal.', async () => {
    const { user } = await sut.execute({
      name: 'Gutemberg Souza de Jesus',
      email: 'gutembergsouzadejesus@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('A senha do usuário deve virar um hash assim que entrar na aplicação.', async () => {
    const { user } = await sut.execute({
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
    const email = 'teste25696666@teste.com'

    await sut.execute({
      name: 'Gutemberg Souza de Jesus',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Gutemberg Souza de Jesus',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
