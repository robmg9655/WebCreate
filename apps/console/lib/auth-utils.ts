import bcrypt from 'bcrypt'
import { prisma } from './prisma'

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name?: string) {
  const passwordHash = await hashPassword(password)
  return prisma.user.create({ data: { email, passwordHash, name } })
}
