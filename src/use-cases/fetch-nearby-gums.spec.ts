import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gums'

// aqui é o repositorio que iremos usar
let gymsRepository: InMemoryGymsRepository

// aqui é o caso de uso utilizando o repositorio
let sut: FetchNearbyGymsUseCase

describe('Fatch Nearby Gyms Use case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    gymsRepository = new InMemoryGymsRepository()

    // estaciando o caso de uso
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  // testes: it
  it('should be able to list nearby gyms', async () => {
    await gymsRepository.create({
      title: 'academia longe',
      description: null,
      phone: null,
      latitude: -23.4810365,
      longitude: -46.5096708,
    })

    await gymsRepository.create({
      title: 'academia perto',
      description: null,
      phone: null,
      latitude: -23.6451121,
      longitude: -46.7768827,
    })
    const { gyms } = await sut.execute({
      userLatitude: -23.6451121,
      userLongituide: -46.7768827,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'academia perto' })])
  })
})
