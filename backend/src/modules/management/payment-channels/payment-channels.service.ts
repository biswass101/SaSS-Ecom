import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

export async function getAllPaymentChannels() {
  logger.info('Fetching all payment channels')
  return prisma.paymentChannel.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getActivePaymentChannels() {
  return prisma.paymentChannel.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
}

export async function createPaymentChannel(data: {
  name: string
  type: string
  accountNumber: string
  instructions: string
  isActive: boolean
}) {
  logger.info({ name: data.name }, 'Creating payment channel')
  return prisma.paymentChannel.create({ data })
}

export async function updatePaymentChannel(id: string, data: Record<string, unknown>) {
  const channel = await prisma.paymentChannel.findUnique({ where: { id } })
  if (!channel) throw new AppError(404, 'Payment channel not found')
  logger.info({ id }, 'Updating payment channel')
  return prisma.paymentChannel.update({ where: { id }, data })
}

export async function deletePaymentChannel(id: string) {
  const channel = await prisma.paymentChannel.findUnique({ where: { id } })
  if (!channel) throw new AppError(404, 'Payment channel not found')
  logger.info({ id }, 'Deleting payment channel')
  return prisma.paymentChannel.delete({ where: { id } })
}
