import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import dns from "node:dns"

dns.setDefaultResultOrder("ipv4first")

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  const hash = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@storestack.com' },
    update: {},
    create: {
      email: 'admin@storestack.com',
      name: 'Admin',
      passwordHash: hash,
      role: 'SUPER_ADMIN',
    },
  })

  const starterPkg = await prisma.package.upsert({
    where: { id: 'pkg_starter' },
    update: {},
    create: {
      id: 'pkg_starter',
      name: 'Starter',
      description: 'Perfect for small businesses just getting started with online sales.',
      price: 19,
      billingCycle: 'monthly',
      maxProducts: 50,
      maxOrders: 200,
      features: ['Up to 50 products', '200 orders/month', 'Basic analytics', 'Email support'],
    },
  })

  await prisma.package.upsert({
    where: { id: 'pkg_growth' },
    update: {},
    create: {
      id: 'pkg_growth',
      name: 'Growth',
      description: 'For growing businesses that need more capacity and advanced features.',
      price: 49,
      billingCycle: 'monthly',
      maxProducts: 500,
      maxOrders: 2000,
      features: ['Up to 500 products', '2,000 orders/month', 'Advanced analytics', 'Priority support', 'Custom domain'],
    },
  })

  await prisma.package.upsert({
    where: { id: 'pkg_enterprise' },
    update: {},
    create: {
      id: 'pkg_enterprise',
      name: 'Enterprise',
      description: 'Unlimited capacity with premium support for established businesses.',
      price: 149,
      billingCycle: 'monthly',
      maxProducts: -1,
      maxOrders: -1,
      features: ['Unlimited products', 'Unlimited orders', 'Advanced analytics & reports', 'Dedicated support', 'Custom domain', 'API access', 'White-label branding'],
    },
  })

  await prisma.paymentChannel.upsert({
    where: { id: 'ch_bank' },
    update: {},
    create: {
      id: 'ch_bank',
      name: 'Bank Transfer - National Bank',
      type: 'bank_transfer',
      accountNumber: '1234-5678-9012-3456',
      instructions: 'Transfer to National Bank account. Include your store name as reference.',
      isActive: true,
    },
  })

  await prisma.paymentChannel.upsert({
    where: { id: 'ch_bkash' },
    update: {},
    create: {
      id: 'ch_bkash',
      name: 'Mobile Banking - BKash',
      type: 'mobile_banking',
      accountNumber: '01712-345678',
      instructions: 'Send payment via bKash. Use "Send Money" option and include your store name.',
      isActive: true,
    },
  })

  await prisma.paymentChannel.upsert({
    where: { id: 'ch_city' },
    update: {},
    create: {
      id: 'ch_city',
      name: 'Bank Transfer - City Bank',
      type: 'bank_transfer',
      accountNumber: '9876-5432-1098-7654',
      instructions: 'Transfer to City Bank account. Include subscription ID as reference.',
      isActive: false,
    },
  })

  console.log('Seed completed successfully')
  console.log('Super Admin credentials:')
  console.log('Email: admin@storestack.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
