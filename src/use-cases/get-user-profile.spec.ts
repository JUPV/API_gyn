import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// aqui é o repositorio que iremos usar
let usersRepository: InMemoryUsersRepository

// aqui é o caso de uso utilizando o repositorio
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    usersRepository = new InMemoryUsersRepository()
    // estaciando o caso de uso
    sut = new GetUserProfileUseCase(usersRepository)
  })

  // testes: it
  it('Verificar a busca de um usuario correto.', async () => {
    // para realizar o teste primeiro teremos que cadastrar um usuario
    const crieteUser = await usersRepository.create({
      name: 'Teste Autenticaçao',
      email: 'testecasodeuso586@teste.com',
      password_hash: await hash('123456', 6),
    })

    // Aqui vamos buscar o usuario pelo id
    const { user } = await sut.execute({
      userId: crieteUser.id,
    })

    // Aqui eu espero um retorno de um usuario com um id string qualquer e nome
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Teste Autenticaçao')
  })

  it('Teste buscando o usuario que nao existe', async () => {
    // Aqui vamos testar uma busca invalida de usuario pelo id
    // espero um erro do tipo: ResourceNotFoundError
    await expect(() =>
      sut.execute({
        userId: 'usuario-nao-existe',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
