import type {
  Category,
  Order,
  Package,
  Payment,
  PaymentChannel,
  Product,
  SalesReport,
  Store,
  Subscription,
  User,
} from '@/types'

export const mockUsers: User[] = [
  {
    id: 'usr_1',
    email: 'admin@storestack.com',
    name: 'Sarah Mitchell',
    role: 'SUPER_ADMIN',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'usr_2',
    email: 'alex@greenleaf.com',
    name: 'Alex Rivera',
    role: 'STORE_ADMIN',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'usr_3',
    email: 'jordan@urbancraft.com',
    name: 'Jordan Park',
    role: 'STORE_ADMIN',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
  },
]

export const mockPackages: Package[] = [
  {
    id: 'pkg_1',
    name: 'Starter',
    description: 'Perfect for small businesses just getting started with online sales.',
    price: 19,
    billingCycle: 'monthly',
    maxProducts: 50,
    maxOrders: 200,
    features: [
      'Up to 50 products',
      '200 orders/month',
      'Basic analytics',
      'Email support',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pkg_2',
    name: 'Growth',
    description: 'For growing businesses that need more capacity and advanced features.',
    price: 49,
    billingCycle: 'monthly',
    maxProducts: 500,
    maxOrders: 2000,
    features: [
      'Up to 500 products',
      '2,000 orders/month',
      'Advanced analytics',
      'Priority support',
      'Custom domain',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pkg_3',
    name: 'Enterprise',
    description: 'Unlimited capacity with premium support for established businesses.',
    price: 149,
    billingCycle: 'monthly',
    maxProducts: -1,
    maxOrders: -1,
    features: [
      'Unlimited products',
      'Unlimited orders',
      'Advanced analytics & reports',
      'Dedicated support',
      'Custom domain',
      'API access',
      'White-label branding',
    ],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

export const mockStores: Store[] = [
  {
    id: 'str_1',
    name: 'Green Leaf Organics',
    slug: 'green-leaf',
    description: 'Premium organic products for a sustainable lifestyle.',
    logoUrl: null,
    status: 'ACTIVE',
    ownerId: 'usr_2',
    owner: mockUsers[1],
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'str_2',
    name: 'UrbanCraft Goods',
    slug: 'urbancraft',
    description: 'Handcrafted home goods and artisan accessories.',
    logoUrl: null,
    status: 'ACTIVE',
    ownerId: 'usr_3',
    owner: mockUsers[2],
    createdAt: '2026-05-03T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'str_3',
    name: 'Tech Haven',
    slug: 'tech-haven',
    description: 'Latest gadgets and electronics at competitive prices.',
    logoUrl: null,
    status: 'INACTIVE',
    ownerId: 'usr_2',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
]

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    storeId: 'str_1',
    packageId: 'pkg_2',
    status: 'ACTIVE',
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-10-01T00:00:00Z',
    package: mockPackages[1],
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'sub_2',
    storeId: 'str_2',
    packageId: 'pkg_1',
    status: 'ACTIVE',
    startDate: '2026-09-15T00:00:00Z',
    endDate: '2026-10-15T00:00:00Z',
    package: mockPackages[0],
    createdAt: '2026-09-15T00:00:00Z',
    updatedAt: '2026-09-15T00:00:00Z',
  },
]

export const mockPayments: Payment[] = [
  {
    id: 'pay_1',
    subscriptionId: 'sub_1',
    amount: 49,
    accountNo: '1234567890',
    transactionId: 'TXN-2026-09-001',
    status: 'VERIFIED',
    verifiedAt: '2026-09-01T12:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'pay_2',
    subscriptionId: 'sub_2',
    amount: 19,
    accountNo: '0987654321',
    transactionId: 'TXN-2026-09-015',
    status: 'PENDING',
    verifiedAt: null,
    createdAt: '2026-09-15T14:00:00Z',
  },
]

export const mockPaymentChannels: PaymentChannel[] = [
  {
    id: 'ch_1',
    name: 'Bank Transfer - National Bank',
    type: 'bank_transfer',
    accountNumber: '1234-5678-9012-3456',
    instructions: 'Transfer to National Bank account. Include your store name as reference.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'ch_2',
    name: 'Mobile Banking - BKash',
    type: 'mobile_banking',
    accountNumber: '01712-345678',
    instructions: 'Send payment via bKash. Use "Send Money" option and include your store name.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'ch_3',
    name: 'Bank Transfer - City Bank',
    type: 'bank_transfer',
    accountNumber: '9876-5432-1098-7654',
    instructions: 'Transfer to City Bank account. Include subscription ID as reference.',
    isActive: false,
    createdAt: '2026-03-15T00:00:00Z',
  },
]

export const mockCategories: Category[] = [
  { id: 'cat_1', storeId: 'str_1', title: 'Fresh Produce', productCount: 8, createdAt: '2026-03-15T00:00:00Z', updatedAt: '2026-09-20T00:00:00Z' },
  { id: 'cat_2', storeId: 'str_1', title: 'Pantry Essentials', productCount: 6, createdAt: '2026-03-15T00:00:00Z', updatedAt: '2026-09-18T00:00:00Z' },
  { id: 'cat_3', storeId: 'str_1', title: 'Beverages', productCount: 4, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-09-10T00:00:00Z' },
  { id: 'cat_4', storeId: 'str_1', title: 'Snacks', productCount: 5, createdAt: '2026-05-01T00:00:00Z', updatedAt: '2026-09-15T00:00:00Z' },
  { id: 'cat_5', storeId: 'str_2', title: 'Home Decor', productCount: 4, createdAt: '2026-05-05T00:00:00Z', updatedAt: '2026-09-12T00:00:00Z' },
  { id: 'cat_6', storeId: 'str_2', title: 'Accessories', productCount: 3, createdAt: '2026-05-05T00:00:00Z', updatedAt: '2026-09-08T00:00:00Z' },
]

const COLORS = [
  'oklch(0.7 0.15 45)',
  'oklch(0.6 0.13 150)',
  'oklch(0.75 0.12 75)',
  'oklch(0.55 0.1 250)',
  'oklch(0.65 0.18 27)',
  'oklch(0.7 0.1 330)',
]

function productColor(index: number): string {
  return COLORS[index % COLORS.length]
}

export const mockProducts: Product[] = [
  { id: 'prd_1', storeId: 'str_1', categoryId: 'cat_1', title: 'Organic Avocados (4-pack)', description: 'Perfectly ripe Hass avocados sourced from local organic farms. Rich, creamy texture ideal for salads, toast, or guacamole.', price: 8.99, images: [productColor(0)], category: mockCategories[0], isActive: true, stock: 45, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-09-28T00:00:00Z' },
  { id: 'prd_2', storeId: 'str_1', categoryId: 'cat_1', title: 'Heritage Tomatoes (1kg)', description: 'A vibrant mix of heirloom tomato varieties. Bursting with flavor, perfect for fresh salads and cooking.', price: 6.49, images: [productColor(1)], category: mockCategories[0], isActive: true, stock: 78, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-09-25T00:00:00Z' },
  { id: 'prd_3', storeId: 'str_1', categoryId: 'cat_1', title: 'Wild Blueberries (250g)', description: 'Hand-picked wild blueberries packed with antioxidants. Smaller and more flavorful than cultivated varieties.', price: 5.99, images: [productColor(2)], category: mockCategories[0], isActive: true, stock: 120, createdAt: '2026-04-15T00:00:00Z', updatedAt: '2026-09-20T00:00:00Z' },
  { id: 'prd_4', storeId: 'str_1', categoryId: 'cat_2', title: 'Cold-Pressed Olive Oil (500ml)', description: 'Premium extra virgin olive oil from Mediterranean groves. Ideal for dressings and low-heat cooking.', price: 14.99, images: [productColor(3)], category: mockCategories[1], isActive: true, stock: 34, createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-09-18T00:00:00Z' },
  { id: 'prd_5', storeId: 'str_1', categoryId: 'cat_2', title: 'Raw Wildflower Honey (350g)', description: 'Unfiltered, raw honey from local wildflower meadows. Rich in enzymes and natural antibacterials.', price: 12.49, images: [productColor(4)], category: mockCategories[1], isActive: true, stock: 56, createdAt: '2026-04-10T00:00:00Z', updatedAt: '2026-09-22T00:00:00Z' },
  { id: 'prd_6', storeId: 'str_1', categoryId: 'cat_3', title: 'Matcha Green Tea (30 sachets)', description: 'Ceremonial-grade matcha from Uji, Japan. Smooth, umami-rich flavor with natural caffeine.', price: 18.99, images: [productColor(5)], category: mockCategories[2], isActive: true, stock: 89, createdAt: '2026-05-01T00:00:00Z', updatedAt: '2026-09-15T00:00:00Z' },
  { id: 'prd_7', storeId: 'str_1', categoryId: 'cat_3', title: 'Organic Cold Brew Concentrate', description: 'Double-strength cold brew made from single-origin Arabica beans. Smooth with chocolate notes.', price: 11.99, images: [productColor(0)], category: mockCategories[2], isActive: true, stock: 67, createdAt: '2026-05-15T00:00:00Z', updatedAt: '2026-09-10T00:00:00Z' },
  { id: 'prd_8', storeId: 'str_1', categoryId: 'cat_4', title: 'Trail Mix - Tropical Blend (200g)', description: 'A crunchy mix of cashews, macadamias, dried mango, and coconut flakes. No added sugar.', price: 7.99, images: [productColor(1)], category: mockCategories[3], isActive: true, stock: 200, createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-09-25T00:00:00Z' },
  { id: 'prd_9', storeId: 'str_1', categoryId: 'cat_4', title: 'Dark Chocolate Almonds (150g)', description: '72% dark chocolate coated whole almonds. Vegan and gluten-free.', price: 9.49, images: [productColor(2)], category: mockCategories[3], isActive: true, stock: 143, createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-09-20T00:00:00Z' },
  { id: 'prd_10', storeId: 'str_1', categoryId: 'cat_2', title: 'Quinoa Grain (1kg)', description: 'Organic white quinoa, pre-washed and ready to cook. High in protein and all nine essential amino acids.', price: 10.99, images: [productColor(3)], category: mockCategories[1], isActive: true, stock: 92, createdAt: '2026-06-15T00:00:00Z', updatedAt: '2026-09-18T00:00:00Z' },
  { id: 'prd_11', storeId: 'str_2', categoryId: 'cat_5', title: 'Handwoven Macramé Wall Hanging', description: 'Bohemian-inspired macramé made from 100% natural cotton cord. Adds warmth and texture to any room.', price: 45.00, images: [productColor(4)], category: mockCategories[4], isActive: true, stock: 15, createdAt: '2026-05-10T00:00:00Z', updatedAt: '2026-09-12T00:00:00Z' },
  { id: 'prd_12', storeId: 'str_2', categoryId: 'cat_5', title: 'Ceramic Planter Set (3-piece)', description: 'Minimalist ceramic planters in matte white, sage, and terracotta. Drainage holes included.', price: 38.00, images: [productColor(5)], category: mockCategories[4], isActive: true, stock: 22, createdAt: '2026-05-15T00:00:00Z', updatedAt: '2026-09-08T00:00:00Z' },
  { id: 'prd_13', storeId: 'str_2', categoryId: 'cat_6', title: 'Leather Tote Bag', description: 'Full-grain vegetable-tanned leather tote. Ages beautifully with use. Interior zip pocket.', price: 89.00, images: [productColor(0)], category: mockCategories[5], isActive: true, stock: 8, createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-09-05T00:00:00Z' },
  { id: 'prd_14', storeId: 'str_2', categoryId: 'cat_5', title: 'Scented Soy Candle - Cedar & Sage', description: 'Hand-poured soy wax candle with wooden wick. 50-hour burn time. Notes of cedar, sage, and bergamot.', price: 28.00, images: [productColor(1)], category: mockCategories[4], isActive: true, stock: 40, createdAt: '2026-06-10T00:00:00Z', updatedAt: '2026-09-15T00:00:00Z' },
  { id: 'prd_15', storeId: 'str_2', categoryId: 'cat_6', title: 'Brass Earrings - Geometric Drop', description: 'Minimalist brass drop earrings with a brushed matte finish. Hypoallergenic posts.', price: 24.00, images: [productColor(2)], category: mockCategories[5], isActive: true, stock: 55, createdAt: '2026-06-15T00:00:00Z', updatedAt: '2026-09-10T00:00:00Z' },
]

export const mockOrders: Order[] = [
  {
    id: 'ord_1',
    storeId: 'str_1',
    orderNumber: 'GL-1001',
    customerName: 'Emily Chen',
    customerEmail: 'emily@example.com',
    customerPhone: '+1-555-0101',
    shippingAddress: '123 Oak Street, Portland, OR 97201',
    items: [
      { id: 'oi_1', orderId: 'ord_1', productId: 'prd_1', productTitle: 'Organic Avocados (4-pack)', productPrice: 8.99, quantity: 2, total: 17.98 },
      { id: 'oi_2', orderId: 'ord_1', productId: 'prd_4', productTitle: 'Cold-Pressed Olive Oil (500ml)', productPrice: 14.99, quantity: 1, total: 14.99 },
    ],
    subtotal: 32.97,
    total: 32.97,
    status: 'DELIVERED',
    notes: null,
    createdAt: '2026-09-20T14:30:00Z',
    updatedAt: '2026-09-24T10:00:00Z',
  },
  {
    id: 'ord_2',
    storeId: 'str_1',
    orderNumber: 'GL-1002',
    customerName: 'Marcus Johnson',
    customerEmail: 'marcus@example.com',
    customerPhone: '+1-555-0202',
    shippingAddress: '456 Pine Ave, Seattle, WA 98101',
    items: [
      { id: 'oi_3', orderId: 'ord_2', productId: 'prd_6', productTitle: 'Matcha Green Tea (30 sachets)', productPrice: 18.99, quantity: 1, total: 18.99 },
      { id: 'oi_4', orderId: 'ord_2', productId: 'prd_8', productTitle: 'Trail Mix - Tropical Blend (200g)', productPrice: 7.99, quantity: 3, total: 23.97 },
      { id: 'oi_5', orderId: 'ord_2', productId: 'prd_3', productTitle: 'Wild Blueberries (250g)', productPrice: 5.99, quantity: 2, total: 11.98 },
    ],
    subtotal: 54.94,
    total: 54.94,
    status: 'SHIPPED',
    notes: 'Please leave at the front door.',
    createdAt: '2026-09-28T09:15:00Z',
    updatedAt: '2026-09-30T16:00:00Z',
  },
  {
    id: 'ord_3',
    storeId: 'str_1',
    orderNumber: 'GL-1003',
    customerName: 'Sofia Rodriguez',
    customerEmail: 'sofia@example.com',
    customerPhone: '+1-555-0303',
    shippingAddress: '789 Maple Blvd, San Francisco, CA 94102',
    items: [
      { id: 'oi_6', orderId: 'ord_3', productId: 'prd_5', productTitle: 'Raw Wildflower Honey (350g)', productPrice: 12.49, quantity: 2, total: 24.98 },
      { id: 'oi_7', orderId: 'ord_3', productId: 'prd_9', productTitle: 'Dark Chocolate Almonds (150g)', productPrice: 9.49, quantity: 1, total: 9.49 },
    ],
    subtotal: 34.47,
    total: 34.47,
    status: 'CONFIRMED',
    notes: null,
    createdAt: '2026-10-01T11:00:00Z',
    updatedAt: '2026-10-01T14:00:00Z',
  },
  {
    id: 'ord_4',
    storeId: 'str_1',
    orderNumber: 'GL-1004',
    customerName: 'David Kim',
    customerEmail: 'david@example.com',
    customerPhone: '+1-555-0404',
    shippingAddress: '321 Birch Lane, Austin, TX 73301',
    items: [
      { id: 'oi_8', orderId: 'ord_4', productId: 'prd_10', productTitle: 'Quinoa Grain (1kg)', productPrice: 10.99, quantity: 2, total: 21.98 },
      { id: 'oi_9', orderId: 'ord_4', productId: 'prd_7', productTitle: 'Organic Cold Brew Concentrate', productPrice: 11.99, quantity: 1, total: 11.99 },
      { id: 'oi_10', orderId: 'ord_4', productId: 'prd_2', productTitle: 'Heritage Tomatoes (1kg)', productPrice: 6.49, quantity: 3, total: 19.47 },
    ],
    subtotal: 53.44,
    total: 53.44,
    status: 'PENDING',
    notes: 'Ring the bell on arrival.',
    createdAt: '2026-10-05T16:20:00Z',
    updatedAt: '2026-10-05T16:20:00Z',
  },
  {
    id: 'ord_5',
    storeId: 'str_2',
    orderNumber: 'UC-1001',
    customerName: 'Lisa Thompson',
    customerEmail: 'lisa@example.com',
    customerPhone: '+1-555-0505',
    shippingAddress: '555 Cedar Court, Denver, CO 80201',
    items: [
      { id: 'oi_11', orderId: 'ord_5', productId: 'prd_11', productTitle: 'Handwoven Macramé Wall Hanging', productPrice: 45.00, quantity: 1, total: 45.00 },
      { id: 'oi_12', orderId: 'ord_5', productId: 'prd_14', productTitle: 'Scented Soy Candle - Cedar & Sage', productPrice: 28.00, quantity: 2, total: 56.00 },
    ],
    subtotal: 101.00,
    total: 101.00,
    status: 'PROCESSING',
    notes: null,
    createdAt: '2026-10-03T13:45:00Z',
    updatedAt: '2026-10-04T09:00:00Z',
  },
]

export const mockSalesReport: SalesReport = {
  period: '2026-09',
  totalOrders: 47,
  totalRevenue: 4832.50,
  averageOrderValue: 102.82,
  topProducts: [
    { productId: 'prd_1', title: 'Organic Avocados (4-pack)', quantity: 89, revenue: 800.11 },
    { productId: 'prd_6', title: 'Matcha Green Tea (30 sachets)', quantity: 54, revenue: 1025.46 },
    { productId: 'prd_8', title: 'Trail Mix - Tropical Blend (200g)', quantity: 72, revenue: 575.28 },
    { productId: 'prd_4', title: 'Cold-Pressed Olive Oil (500ml)', quantity: 38, revenue: 569.62 },
    { productId: 'prd_5', title: 'Raw Wildflower Honey (350g)', quantity: 42, revenue: 524.58 },
  ],
  dailyRevenue: [
    { date: '2026-09-01', revenue: 145.50, orders: 3 },
    { date: '2026-09-02', revenue: 89.00, orders: 1 },
    { date: '2026-09-03', revenue: 234.20, orders: 4 },
    { date: '2026-09-04', revenue: 178.30, orders: 2 },
    { date: '2026-09-05', revenue: 312.00, orders: 5 },
    { date: '2026-09-06', revenue: 67.90, orders: 1 },
    { date: '2026-09-07', revenue: 198.40, orders: 3 },
    { date: '2026-09-08', revenue: 256.70, orders: 4 },
    { date: '2026-09-09', revenue: 89.99, orders: 1 },
    { date: '2026-09-10', revenue: 345.80, orders: 5 },
    { date: '2026-09-11', revenue: 123.50, orders: 2 },
    { date: '2026-09-12', revenue: 267.30, orders: 3 },
    { date: '2026-09-13', revenue: 156.20, orders: 2 },
    { date: '2026-09-14', revenue: 78.50, orders: 1 },
    { date: '2026-09-15', revenue: 289.90, orders: 4 },
    { date: '2026-09-16', revenue: 134.60, orders: 2 },
    { date: '2026-09-17', revenue: 201.40, orders: 3 },
    { date: '2026-09-18', revenue: 167.80, orders: 2 },
    { date: '2026-09-19', revenue: 93.20, orders: 1 },
    { date: '2026-09-20', revenue: 412.50, orders: 6 },
    { date: '2026-09-21', revenue: 56.90, orders: 1 },
    { date: '2026-09-22', revenue: 189.30, orders: 3 },
    { date: '2026-09-23', revenue: 278.40, orders: 4 },
    { date: '2026-09-24', revenue: 134.70, orders: 2 },
    { date: '2026-09-25', revenue: 367.20, orders: 5 },
    { date: '2026-09-26', revenue: 98.60, orders: 1 },
    { date: '2026-09-27', revenue: 245.80, orders: 3 },
    { date: '2026-09-28', revenue: 189.50, orders: 2 },
    { date: '2026-09-29', revenue: 156.30, orders: 2 },
    { date: '2026-09-30', revenue: 234.10, orders: 3 },
  ],
}

export function getProductsByStore(storeId: string): Product[] {
  return mockProducts.filter((p) => p.storeId === storeId)
}

export function getCategoriesByStore(storeId: string): Category[] {
  return mockCategories.filter((c) => c.storeId === storeId)
}

export function getOrdersByStore(storeId: string): Order[] {
  return mockOrders.filter((o) => o.storeId === storeId)
}

export function getStoreBySlug(slug: string): Store | undefined {
  return mockStores.find((s) => s.slug === slug)
}
