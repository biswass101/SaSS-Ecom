import type {
  BillingCycle,
  OrderStatus,
  PaymentStatus,
  StoreStatus,
  SubscriptionStatus,
  UserRole,
} from './enums'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Package {
  id: string
  name: string
  description: string
  price: number
  billingCycle: BillingCycle
  maxProducts: number
  maxOrders: number
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Store {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  status: StoreStatus
  ownerId: string
  owner?: User
  subscription?: Subscription
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  storeId: string
  packageId: string
  status: SubscriptionStatus
  startDate: string
  endDate: string
  store?: Store
  package?: Package
  payments?: Payment[]
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  subscriptionId: string
  amount: number
  accountNo: string
  transactionId: string
  status: PaymentStatus
  verifiedAt: string | null
  createdAt: string
}

export interface PaymentChannel {
  id: string
  name: string
  type: string
  accountNumber: string
  instructions: string
  isActive: boolean
  createdAt: string
}

export interface Category {
  id: string
  storeId: string
  title: string
  productCount?: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  storeId: string
  categoryId: string
  title: string
  description: string
  price: number
  images: string[]
  category?: Category
  isActive: boolean
  stock: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  storeId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: OrderItem[]
  subtotal: number
  total: number
  status: OrderStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productTitle: string
  productPrice: number
  quantity: number
  total: number
}

export interface SalesReport {
  period: string
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  topProducts: Array<{
    productId: string
    title: string
    quantity: number
    revenue: number
  }>
  dailyRevenue: Array<{
    date: string
    revenue: number
    orders: number
  }>
}
