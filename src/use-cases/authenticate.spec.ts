import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalisCredentialsErros } from './errors/invalid-credentials-erros'

// aqui é o repositorio que iremos usar
let usersRepository: InMemoryUsersRepository

// aqui é o caso de uso utilizando o repositorio
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    usersRepository = new InMemoryUsersRepository()
    // estaciando o caso de uso
    sut = new AuthenticateUseCase(usersRepository)
  })

  // testes: it
  it('Verificar se o usuário consegue se autenticar.', async () => {
    // para realizar o teste primeiro teremos que cadastrar um usuario
    await usersRepository.create({
      name: 'Teste Autenticaçao',
      email: 'testecasodeuso586@teste.com',
      password_hash: await hash('123456', 6),
    })

    // Aqui vamos testar o usuario cadastrado
    const { user } = await sut.execute({
      email: 'testecasodeuso586@teste.com',
      password: '123456',
    })

    // Aqui eu espero um retorno de um usuario com um id string qualquer
    expect(user.id).toEqual(expect.any(String))
  })

  it('Usuário não deveria ser autenticada com o e-mail errado.', async () => {
    // Aqui vamos testar o usuario cadastrado e
    // espero um erro de email invalido pois nao existe
    await expect(() =>
      sut.execute({
        email: 'testecasodeuso586@teste.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalisCredentialsErros)
  })

  it('Usuário não deveria ser autenticada com o senha errada.', async () => {
    // para realizar o teste primeiro teremos que cadastrar um usuario
    await usersRepository.create({
      name: 'Teste Autenticaçao',
      email: 'testecasodeuso586@teste.com',
      password_hash: await hash('123456', 6),
    })

    // Aqui vamos testar o usuario cadastrado e
    // espero um erro de senha invalido pois esta incorreto
    await expect(() =>
      sut.execute({
        email: 'testecasodeuso586@teste.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalisCredentialsErros)
  })
})
