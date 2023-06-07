import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validate-error'

// aqui é o repositorio que iremos usar
let checkInsRepository: InMemoryCheckInsRepository

// aqui é o caso de uso utilizando o repositorio
let sut: ValidateCheckInUseCase

describe('Validate check-in Use Case', () => {
  // beforeEach cria a estacia do repositorio e caso de uso para cada teste separadamente
  // desta forma nao iremos reltilizar o repositorio teste e nem duplicar cada codigo em todos os teste
  beforeEach(async () => {
    // estaciando o repositorio
    checkInsRepository = new InMemoryCheckInsRepository()

    // estaciando o caso de uso
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useFakeTimers()
  })

  // testes: it
  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    // Aqui eu espero um retorno de um id cadastrado qualquer
    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'id-nao-existe',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be to validate the checkiin after 20 minutos of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
