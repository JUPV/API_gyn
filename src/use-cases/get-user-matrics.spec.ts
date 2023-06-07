import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-matrics'

// aqui é o repositorio que iremos usar
let checkInsRepository: InMemoryCheckInsRepository

// aqui é o caso de uso utilizando o repositorio
let sut: GetUserMetricsUseCase

describe('Get User Matrics Use case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    checkInsRepository = new InMemoryCheckInsRepository()

    // estaciando o caso de uso
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  // testes: it
  it('should be able to get check-ins count from matrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })
    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(checkInsCount).toEqual(2)
  })
})
