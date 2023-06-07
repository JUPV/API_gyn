import { FatchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new FatchUserCheckInsHistoryUseCase(checkInRepository)
  return useCase
}
