import { UsersRepository } from '@/repositories/users-repository'
import { InvalisCredentialsErros } from './errors/invalid-credentials-erros'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

// tipos de dados recebidos
interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

// tipos de dadpos respondidos
interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  // essa função recebe email e senha do tipo:AuthenticateUseCaseRequest
  // e reponde uma promise pois ela é async do tipo: AuthenticateUseCaseResponse
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    // usa o repositorio para buscar um usuario pelo email
    const user = await this.usersRepository.findByEmail(email)

    // se o usuario nao existir entao retorne o erro da clase: InvalisCredentialsErros
    if (!user) {
      throw new InvalisCredentialsErros()
    }

    // se a senha corresponde//
    const doesPasswordMatches = await compare(password, user.password_hash)

    // se a senha nao bater entao retorne o erro da clase: InvalisCredentialsErros
    if (!doesPasswordMatches) {
      throw new InvalisCredentialsErros()
    }

    // se tudo passar entao retorne o usuario
    return { user }
  }
}
