import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

// aqui é o repositorio que iremos usar
let gymsRepository: InMemoryGymsRepository

// aqui é o caso de uso utilizando o repositorio
let sut: SearchGymsUseCase

describe('Search Gyms Use case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    gymsRepository = new InMemoryGymsRepository()

    // estaciando o caso de uso
    sut = new SearchGymsUseCase(gymsRepository)
  })

  // testes: it
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'gutemberg academia teste 02',
      description: null,
      phone: null,
      latitude: -23.6042004,
      longitude: -46.6988629,
    })

    await gymsRepository.create({
      title: 'academia teste 03',
      description: null,
      phone: null,
      latitude: -23.6042004,
      longitude: -46.6988629,
    })
    const { gyms } = await sut.execute({
      query: 'gutemberg',
      page: 1,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gutemberg academia teste 02' }),
    ])
  })

  it('should be able to fetch paginatad gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `teste gutemberg ${i}`,
        description: null,
        phone: null,
        latitude: -23.6042004,
        longitude: -46.6988629,
      })
    }

    const { gyms } = await sut.execute({
      query: 'gutemberg',
      page: 2,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'teste gutemberg 21' }),
      expect.objectContaining({ title: 'teste gutemberg 22' }),
    ])
  })
})
