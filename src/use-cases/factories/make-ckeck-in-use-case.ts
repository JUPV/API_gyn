import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../ckeck-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeCkeckInUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new CheckInUseCase(checkInRepository, gymsRepository)
  return useCase
}
