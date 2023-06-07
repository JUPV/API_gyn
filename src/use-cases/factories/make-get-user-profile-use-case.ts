import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersUsersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersUsersRepository)
  return useCase
}
