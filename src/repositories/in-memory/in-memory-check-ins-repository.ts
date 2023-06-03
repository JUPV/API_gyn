import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: String, date: Date) {
    // Obtém o início e o fim do dia com base na data fornecida
    const atartOfTheDay = dayjs(date).startOf('date')
    const ondOfTheDay = dayjs(date).endOf('date')

    // Verifica se existe um check-in no mesmo dia e usuário
    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameData =
        checkInDate.isAfter(atartOfTheDay) && checkInDate.isBefore(ondOfTheDay)
      return checkIn.user_id === userId && isOnSameData
    })

    if (!checkInOnSameDate) {
      return null
    }
    return checkInOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    // Cria um novo check-in com os dados fornecidos
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    // Adiciona o check-in à lista de itens
    this.items.push(checkIn)

    return checkIn
  }
}
