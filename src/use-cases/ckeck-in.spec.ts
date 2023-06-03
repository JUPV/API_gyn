import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInCase } from './ckeck-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

// aqui é o repositorio que iremos usar
let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository

// aqui é o caso de uso utilizando o repositorio
let sut: CheckInCase

describe('Check-in Use Case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(() => {
    // estaciando o repositorio
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    // estaciando o caso de uso
    sut = new CheckInCase(checkInsRepository, gymsRepository)

    // criar uma academia para fin de testes
    gymsRepository.items.push({
      id: 'gymId-01',
      title: 'academia teste',
      description: '',
      phone: '',
      latitude: new Decimal(-23.6451121),
      longitude: new Decimal(-46.7768827),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useFakeTimers()
  })

  // testes: it
  it('Tentar fazer o check in', async () => {
    // para realizar o teste primeiro teremos que cadastrar um usuario
    const { checkIn } = await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -23.6451121,
      userLongituide: -46.7768827,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Não deveria fazer check in 2 vezes no mesmo dia', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    // para realizar o teste primeiro teremos que cadastrar um usuario
    await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -23.6451121,
      userLongituide: -46.7768827,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    await expect(() =>
      sut.execute({
        gymId: 'gymId-01',
        userId: 'userId-01',
        userLatitude: -23.6451121,
        userLongituide: -46.7768827,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('Teste check in com datas em dias diferentes', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    // para realizar o teste primeiro teremos que cadastrar um usuario
    await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -23.6451121,
      userLongituide: -46.7768827,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    // Aqui eu espero um retorno de um id cadastrado qualquer
    const { checkIn } = await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -23.6451121,
      userLongituide: -46.7768827,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Tentar a distancia academia / locau usuario', async () => {
    // criar uma academia para fin de testes
    gymsRepository.items.push({
      id: 'gymId-02',
      title: 'academia teste',
      description: '',
      phone: '',
      latitude: new Decimal(-23.6042004),
      longitude: new Decimal(-46.6988629),
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    await expect(() =>
      sut.execute({
        gymId: 'gymId-02',
        userId: 'userId-01',
        userLatitude: -23.6451121,
        userLongituide: -46.7768827,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
