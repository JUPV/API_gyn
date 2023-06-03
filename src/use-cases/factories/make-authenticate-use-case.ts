import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersUsersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(usersUsersRepository)
  return authenticateUseCase
}
