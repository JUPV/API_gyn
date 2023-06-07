import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymCase } from './create-gym'

/* const usersRepository = new InMemoryUsersRepository()
const registerUserCase = new RegisterUseCase(usersRepository) */

// aqui é o repositorio que iremos usar
let gymsRepository: InMemoryGymsRepository

// aqui é o caso de uso utilizando o repositorio

let sut: CreateGymCase

describe('Register Use Case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    gymsRepository = new InMemoryGymsRepository()
    // estaciando o caso de uso
    sut = new CreateGymCase(gymsRepository)
  })

  // testes: it
  it('Teste de cadastro de academia.', async () => {
    const { gym } = await sut.execute({
      title: 'teste academia nome',
      description: null,
      phone: null,
      latitude: -23.6042004,
      longitude: -46.6988629,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
