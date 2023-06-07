import { CheckInsRepository } from '@/repositories/check-ins-repository'
// tipos de dados recebidos
interface GetUserMetricsUseCaseRequest {
  userId: string
}

// tipos de dados respondidos
interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  // essa função recebe o id do usuario e academia para realizar o checkin
  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return { checkInsCount }
  }
}
