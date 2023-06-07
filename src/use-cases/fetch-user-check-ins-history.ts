import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

// tipos de dados recebidos
interface FatchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

// tipos de dados respondidos
interface FatchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FatchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  // essa função recebe o id do usuario e academia para realizar o checkin
  async execute({
    userId,
    page,
  }: FatchUserCheckInsHistoryUseCaseRequest): Promise<FatchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    )
    return { checkIns }
  }
}
