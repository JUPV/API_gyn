import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FatchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

// aqui é o repositorio que iremos usar
let checkInsRepository: InMemoryCheckInsRepository

// aqui é o caso de uso utilizando o repositorio
let sut: FatchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    checkInsRepository = new InMemoryCheckInsRepository()

    // estaciando o caso de uso
    sut = new FatchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  // testes: it
  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginatad check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
