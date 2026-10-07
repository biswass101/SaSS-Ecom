import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('password123', 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@storestack.com' },
    update: {},
    create: {
      email: 'admin@storestack.com',
      name: 'Sarah Mitchell',
      passwordHash: hash,
      role: 'SUPER_ADMIN',
    },
  })

  const storeAdmin = await prisma.user.upsert({
    where: { email: 'alex@greenleaf.com' },
    update: {},
    create: {
      email: 'alex@greenleaf.com',
      name: 'Alex Rivera',
      passwordHash: hash,
      role: 'STORE_ADMIN',
    },
  })

  const storeAdmin2 = await prisma.user.upsert({
    where: { email: 'jordan@urbancraft.com' },
    update: {},
    create: {
      email: 'jordan@urbancraft.com',
      name: 'Jordan Park',
      passwordHash: hash,
      role: 'STORE_ADMIN',
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

  const growthPkg = await prisma.package.upsert({
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

  const store1 = await prisma.store.upsert({
    where: { slug: 'green-leaf' },
    update: {},
    create: {
      name: 'Green Leaf Organics',
      slug: 'green-leaf',
      description: 'Premium organic products for a sustainable lifestyle.',
      status: 'ACTIVE',
      ownerId: storeAdmin.id,
    },
  })

  const store2 = await prisma.store.upsert({
    where: { slug: 'urbancraft' },
    update: {},
    create: {
      name: 'UrbanCraft Goods',
      slug: 'urbancraft',
      description: 'Handcrafted home goods and artisan accessories.',
      status: 'ACTIVE',
      ownerId: storeAdmin2.id,
    },
  })

  await prisma.store.upsert({
    where: { slug: 'tech-haven' },
    update: {},
    create: {
      name: 'Tech Haven',
      slug: 'tech-haven',
      description: 'Latest gadgets and electronics at competitive prices.',
      status: 'INACTIVE',
      ownerId: storeAdmin.id,
    },
  })

  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 1)

  const sub1 = await prisma.subscription.upsert({
    where: { storeId: store1.id },
    update: {},
    create: {
      storeId: store1.id,
      packageId: growthPkg.id,
      status: 'ACTIVE',
      endDate,
    },
  })

  const sub2 = await prisma.subscription.upsert({
    where: { storeId: store2.id },
    update: {},
    create: {
      storeId: store2.id,
      packageId: starterPkg.id,
      status: 'ACTIVE',
      endDate,
    },
  })

  await prisma.payment.createMany({
    data: [
      {
        subscriptionId: sub1.id,
        amount: 49,
        accountNo: '1234567890',
        transactionId: 'TXN-2026-09-001',
        status: 'VERIFIED',
        verifiedAt: new Date(),
      },
      {
        subscriptionId: sub2.id,
        amount: 19,
        accountNo: '0987654321',
        transactionId: 'TXN-2026-09-015',
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  })

  const COLORS = [
    'oklch(0.7 0.15 45)',
    'oklch(0.6 0.13 150)',
    'oklch(0.75 0.12 75)',
    'oklch(0.55 0.1 250)',
    'oklch(0.65 0.18 27)',
    'oklch(0.7 0.1 330)',
  ]

  const cat1 = await prisma.category.upsert({ where: { id: 'cat_1' }, update: {}, create: { id: 'cat_1', storeId: store1.id, title: 'Fresh Produce' } })
  const cat2 = await prisma.category.upsert({ where: { id: 'cat_2' }, update: {}, create: { id: 'cat_2', storeId: store1.id, title: 'Pantry Essentials' } })
  const cat3 = await prisma.category.upsert({ where: { id: 'cat_3' }, update: {}, create: { id: 'cat_3', storeId: store1.id, title: 'Beverages' } })
  const cat4 = await prisma.category.upsert({ where: { id: 'cat_4' }, update: {}, create: { id: 'cat_4', storeId: store1.id, title: 'Snacks' } })
  const cat5 = await prisma.category.upsert({ where: { id: 'cat_5' }, update: {}, create: { id: 'cat_5', storeId: store2.id, title: 'Home Decor' } })
  const cat6 = await prisma.category.upsert({ where: { id: 'cat_6' }, update: {}, create: { id: 'cat_6', storeId: store2.id, title: 'Accessories' } })

  const products = [
    { id: 'prd_1', storeId: store1.id, categoryId: cat1.id, title: 'Organic Avocados (4-pack)', description: 'Perfectly ripe Hass avocados sourced from local organic farms.', price: 8.99, images: [COLORS[0]], stock: 45 },
    { id: 'prd_2', storeId: store1.id, categoryId: cat1.id, title: 'Heritage Tomatoes (1kg)', description: 'A vibrant mix of heirloom tomato varieties.', price: 6.49, images: [COLORS[1]], stock: 78 },
    { id: 'prd_3', storeId: store1.id, categoryId: cat1.id, title: 'Wild Blueberries (250g)', description: 'Hand-picked wild blueberries packed with antioxidants.', price: 5.99, images: [COLORS[2]], stock: 120 },
    { id: 'prd_4', storeId: store1.id, categoryId: cat2.id, title: 'Cold-Pressed Olive Oil (500ml)', description: 'Premium extra virgin olive oil from Mediterranean groves.', price: 14.99, images: [COLORS[3]], stock: 34 },
    { id: 'prd_5', storeId: store1.id, categoryId: cat2.id, title: 'Raw Wildflower Honey (350g)', description: 'Unfiltered, raw honey from local wildflower meadows.', price: 12.49, images: [COLORS[4]], stock: 56 },
    { id: 'prd_6', storeId: store1.id, categoryId: cat3.id, title: 'Matcha Green Tea (30 sachets)', description: 'Ceremonial-grade matcha from Uji, Japan.', price: 18.99, images: [COLORS[5]], stock: 89 },
    { id: 'prd_7', storeId: store1.id, categoryId: cat3.id, title: 'Organic Cold Brew Concentrate', description: 'Double-strength cold brew made from single-origin Arabica beans.', price: 11.99, images: [COLORS[0]], stock: 67 },
    { id: 'prd_8', storeId: store1.id, categoryId: cat4.id, title: 'Trail Mix - Tropical Blend (200g)', description: 'A crunchy mix of cashews, macadamias, dried mango, and coconut flakes.', price: 7.99, images: [COLORS[1]], stock: 200 },
    { id: 'prd_9', storeId: store1.id, categoryId: cat4.id, title: 'Dark Chocolate Almonds (150g)', description: '72% dark chocolate coated whole almonds.', price: 9.49, images: [COLORS[2]], stock: 143 },
    { id: 'prd_10', storeId: store1.id, categoryId: cat2.id, title: 'Quinoa Grain (1kg)', description: 'Organic white quinoa, pre-washed and ready to cook.', price: 10.99, images: [COLORS[3]], stock: 92 },
    { id: 'prd_11', storeId: store2.id, categoryId: cat5.id, title: 'Handwoven Macramé Wall Hanging', description: 'Bohemian-inspired macramé made from 100% natural cotton cord.', price: 45.00, images: [COLORS[4]], stock: 15 },
    { id: 'prd_12', storeId: store2.id, categoryId: cat5.id, title: 'Ceramic Planter Set (3-piece)', description: 'Minimalist ceramic planters in matte white, sage, and terracotta.', price: 38.00, images: [COLORS[5]], stock: 22 },
    { id: 'prd_13', storeId: store2.id, categoryId: cat6.id, title: 'Leather Tote Bag', description: 'Full-grain vegetable-tanned leather tote.', price: 89.00, images: [COLORS[0]], stock: 8 },
    { id: 'prd_14', storeId: store2.id, categoryId: cat5.id, title: 'Scented Soy Candle - Cedar & Sage', description: 'Hand-poured soy wax candle with wooden wick.', price: 28.00, images: [COLORS[1]], stock: 40 },
    { id: 'prd_15', storeId: store2.id, categoryId: cat6.id, title: 'Brass Earrings - Geometric Drop', description: 'Minimalist brass drop earrings with a brushed matte finish.', price: 24.00, images: [COLORS[2]], stock: 55 },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    })
  }

  const order1 = await prisma.order.upsert({
    where: { orderNumber: 'GL-1001' },
    update: {},
    create: {
      storeId: store1.id,
      orderNumber: 'GL-1001',
      customerName: 'Emily Chen',
      customerEmail: 'emily@example.com',
      customerPhone: '+1-555-0101',
      shippingAddress: '123 Oak Street, Portland, OR 97201',
      subtotal: 32.97,
      total: 32.97,
      status: 'DELIVERED',
    },
  })

  const order2 = await prisma.order.upsert({
    where: { orderNumber: 'GL-1002' },
    update: {},
    create: {
      storeId: store1.id,
      orderNumber: 'GL-1002',
      customerName: 'Marcus Johnson',
      customerEmail: 'marcus@example.com',
      customerPhone: '+1-555-0202',
      shippingAddress: '456 Pine Ave, Seattle, WA 98101',
      subtotal: 54.94,
      total: 54.94,
      status: 'SHIPPED',
      notes: 'Please leave at the front door.',
    },
  })

  const order3 = await prisma.order.upsert({
    where: { orderNumber: 'GL-1003' },
    update: {},
    create: {
      storeId: store1.id,
      orderNumber: 'GL-1003',
      customerName: 'Sofia Rodriguez',
      customerEmail: 'sofia@example.com',
      customerPhone: '+1-555-0303',
      shippingAddress: '789 Maple Blvd, San Francisco, CA 94102',
      subtotal: 34.47,
      total: 34.47,
      status: 'CONFIRMED',
    },
  })

  const order4 = await prisma.order.upsert({
    where: { orderNumber: 'GL-1004' },
    update: {},
    create: {
      storeId: store1.id,
      orderNumber: 'GL-1004',
      customerName: 'David Kim',
      customerEmail: 'david@example.com',
      customerPhone: '+1-555-0404',
      shippingAddress: '321 Birch Lane, Austin, TX 73301',
      subtotal: 53.44,
      total: 53.44,
      status: 'PENDING',
      notes: 'Ring the bell on arrival.',
    },
  })

  const order5 = await prisma.order.upsert({
    where: { orderNumber: 'UC-1001' },
    update: {},
    create: {
      storeId: store2.id,
      orderNumber: 'UC-1001',
      customerName: 'Lisa Thompson',
      customerEmail: 'lisa@example.com',
      customerPhone: '+1-555-0505',
      shippingAddress: '555 Cedar Court, Denver, CO 80201',
      subtotal: 101.00,
      total: 101.00,
      status: 'PROCESSING',
    },
  })

  const existingItems = await prisma.orderItem.count()
  if (existingItems === 0) {
    await prisma.orderItem.createMany({
      data: [
        { orderId: order1.id, productId: 'prd_1', productTitle: 'Organic Avocados (4-pack)', productPrice: 8.99, quantity: 2, total: 17.98 },
        { orderId: order1.id, productId: 'prd_4', productTitle: 'Cold-Pressed Olive Oil (500ml)', productPrice: 14.99, quantity: 1, total: 14.99 },
        { orderId: order2.id, productId: 'prd_6', productTitle: 'Matcha Green Tea (30 sachets)', productPrice: 18.99, quantity: 1, total: 18.99 },
        { orderId: order2.id, productId: 'prd_8', productTitle: 'Trail Mix - Tropical Blend (200g)', productPrice: 7.99, quantity: 3, total: 23.97 },
        { orderId: order2.id, productId: 'prd_3', productTitle: 'Wild Blueberries (250g)', productPrice: 5.99, quantity: 2, total: 11.98 },
        { orderId: order3.id, productId: 'prd_5', productTitle: 'Raw Wildflower Honey (350g)', productPrice: 12.49, quantity: 2, total: 24.98 },
        { orderId: order3.id, productId: 'prd_9', productTitle: 'Dark Chocolate Almonds (150g)', productPrice: 9.49, quantity: 1, total: 9.49 },
        { orderId: order4.id, productId: 'prd_10', productTitle: 'Quinoa Grain (1kg)', productPrice: 10.99, quantity: 2, total: 21.98 },
        { orderId: order4.id, productId: 'prd_7', productTitle: 'Organic Cold Brew Concentrate', productPrice: 11.99, quantity: 1, total: 11.99 },
        { orderId: order4.id, productId: 'prd_2', productTitle: 'Heritage Tomatoes (1kg)', productPrice: 6.49, quantity: 3, total: 19.47 },
        { orderId: order5.id, productId: 'prd_11', productTitle: 'Handwoven Macramé Wall Hanging', productPrice: 45.00, quantity: 1, total: 45.00 },
        { orderId: order5.id, productId: 'prd_14', productTitle: 'Scented Soy Candle - Cedar & Sage', productPrice: 28.00, quantity: 2, total: 56.00 },
      ],
    })
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
