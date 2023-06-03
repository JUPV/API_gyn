import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersUsersRepository = new PrismaUsersRepository()
  const registerUserCase = new RegisterUseCase(usersUsersRepository)
  return registerUserCase
}
