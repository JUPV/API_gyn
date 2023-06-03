import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// tipos de dados recebidos
interface GetUserProfileUseCaseRequest {
  userId: string
}

// tipos de dadpos respondidos
interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  // essa função recebe o id do tipo:GetUserProfileUseCaseRequest
  // e reponde uma promise pois ela é async do tipo: GetUserProfileUseCaseResponse
  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    // usa o repositorio para buscar um usuario pelo id
    const user = await this.usersRepository.findById(userId)

    // se o usuario nao existir entao retorne o erro da clase: ResourceNotFoundError
    if (!user) {
      throw new ResourceNotFoundError()
    }

    // se tudo passar entao retorne o usuario
    return { user }
  }
}
