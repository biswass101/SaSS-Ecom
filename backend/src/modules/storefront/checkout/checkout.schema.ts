import { z } from 'zod'

export const checkoutSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddress: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    }),
  ).min(1),
})

export const submitPaymentSchema = z.object({
  subscriptionId: z.string().min(1),
  accountNo: z.string().min(1),
  transactionId: z.string().min(1),
  amount: z.number().min(0),
})
