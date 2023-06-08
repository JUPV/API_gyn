import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'crypto'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function genereteDatabaseURL(banco: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Não consegui encontrar a URL de conexão com o banco de dados SQL.'
    )
  }
  // "mysql://root:@localhost:3306/nodecrursso?KEY1=VALUE&KEY2=VALUE&KEY3=VALUE"
  const url = new URL(process.env.DATABASE_URL)

  const urlObj = new URL(url)
  urlObj.pathname = `/${banco}`
  return urlObj.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const banco = randomUUID()
    const databaseURL = genereteDatabaseURL(banco)
    process.env.DATABASE_URL = databaseURL

    await prisma.$executeRawUnsafe(`CREATE DATABASE "${banco}"`)

    execSync('npx prisma migrate deploy')
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP DATABASE IF EXISTS "${banco}" CASCADE`
        )
        await prisma.$disconnect()
      },
    }
  },
}
