import { prisma } from '../../../lib/prisma'
import { AppError } from '../../../middlewares/error-handler'
import { logger } from '../../../lib/logger'

export async function placeOrder(
  storeSlug: string,
  data: {
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: string
    notes?: string
    items: Array<{ productId: string; quantity: number }>
  },
) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } })
  if (!store) throw new AppError(404, 'Store not found')
  if (store.status !== 'ACTIVE') throw new AppError(403, 'Store is not active')

  logger.info({ storeSlug, itemCount: data.items.length }, 'Placing order')

  const order = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) }, storeId: store.id },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    const orderItems = data.items.map((item) => {
      const product = productMap.get(item.productId)
      if (!product) throw new AppError(400, `Product ${item.productId} not found`)
      if (product.stock < item.quantity) throw new AppError(400, `Insufficient stock for ${product.title}`)
      return {
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      }
    })

    const subtotal = orderItems.reduce((sum, i) => sum + i.total, 0)

    const count = await tx.order.count({ where: { storeId: store.id } })
    const prefix = store.slug.substring(0, 3).toUpperCase()
    const timestamp = Date.now().toString(36).toUpperCase()
    const orderNumber = `${prefix}-${(count + 1001).toString()}-${timestamp}`

    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return tx.order.create({
      data: {
        storeId: store.id,
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        subtotal: Math.round(subtotal * 100) / 100,
        total: Math.round(subtotal * 100) / 100,
        items: { create: orderItems },
      },
      include: { items: true },
    })
  })

  logger.info({ orderId: order.id, orderNumber }, 'Order placed successfully')
  return order
}

export async function submitPayment(data: {
  subscriptionId: string
  accountNo: string
  transactionId: string
  amount: number
}) {
  const sub = await prisma.subscription.findUnique({ where: { id: data.subscriptionId } })
  if (!sub) throw new AppError(404, 'Subscription not found')

  logger.info({ subscriptionId: data.subscriptionId }, 'Submitting payment')
  return prisma.payment.create({
    data: {
      subscriptionId: data.subscriptionId,
      accountNo: data.accountNo,
      transactionId: data.transactionId,
      amount: data.amount,
      status: 'PENDING',
    },
  })
}

export async function getPaymentChannels() {
  return prisma.paymentChannel.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
}

export async function getPackages() {
  return prisma.package.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } })
}
