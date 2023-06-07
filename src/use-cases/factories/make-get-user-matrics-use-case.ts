import { GetUserMetricsUseCase } from '../get-user-matrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMatricsUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(checkInRepository)
  return useCase
}
