import { prisma } from '../../../lib/prisma'
import type { SubscriptionStatus } from '@prisma/client'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

export async function getAllSubscriptions() {
  logger.info('Fetching all subscriptions')
  return prisma.subscription.findMany({
    include: {
      store: { select: { id: true, name: true, slug: true } },
      package: { select: { id: true, name: true, price: true } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getSubscriptionById(id: string) {
  const sub = await prisma.subscription.findUnique({
    where: { id },
    include: {
      store: { select: { id: true, name: true, slug: true } },
      package: true,
      payments: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!sub) throw new AppError(404, 'Subscription not found')
  return sub
}

export async function updateSubscription(id: string, data: { status?: string; packageId?: string }) {
  await getSubscriptionById(id)
  logger.info({ id, ...data }, 'Updating subscription')
  return prisma.subscription.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status as SubscriptionStatus } : {}),
      ...(data.packageId ? { packageId: data.packageId } : {}),
    },
  })
}

export async function verifyPayment(paymentId: string, action: 'VERIFIED' | 'REJECTED') {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { subscription: { include: { store: true } } },
  })
  if (!payment) throw new AppError(404, 'Payment not found')

  logger.info({ paymentId, action }, 'Verifying payment')

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: action, verifiedAt: action === 'VERIFIED' ? new Date() : null },
  })

  // If payment is verified and store is inactive, activate it
  if (action === 'VERIFIED' && payment.subscription?.store?.status === 'INACTIVE') {
    await prisma.store.update({
      where: { id: payment.subscription.store.id },
      data: { status: 'ACTIVE' },
    })
    logger.info({ storeId: payment.subscription.store.id }, 'Store activated after payment verification')
  }

  return updatedPayment
}
