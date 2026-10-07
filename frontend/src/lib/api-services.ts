import { api } from './api'
import type {
  ApiResponse,
  PaginatedResponse,
  Package,
  Store,
  Subscription,
  Payment,
  PaymentChannel,
  Category,
  Product,
  Order,
  SalesReport,
  User,
} from '@/types'

interface AuthResponse { token: string; user: User }
interface StoreAuthResponse extends AuthResponse { store: { id: string; slug: string; name: string } }
interface StoreCreateResponse extends StoreAuthResponse {
  store: Store & { subscription?: Subscription }
}

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => (r as unknown as ApiResponse<AuthResponse>).data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then((r) => (r as unknown as ApiResponse<AuthResponse>).data),

  storeLogin: (data: { storeSlug: string; email: string; password: string }) =>
    api.post('/auth/store-login', data).then((r) => (r as unknown as ApiResponse<StoreAuthResponse>).data),

  createStore: (data: { name: string; slug: string; description?: string; packageId: string; ownerName: string; email: string; password: string }) =>
    api.post('/auth/create-store', data).then((r) => (r as unknown as ApiResponse<StoreCreateResponse>).data),

  me: () =>
    api.get('/auth/me').then((r) => (r as unknown as ApiResponse<User>).data),
}

export const publicService = {
  getPackages: () =>
    api.get('/public/packages').then((r) => (r as unknown as ApiResponse<Package[]>).data),

  getPaymentChannels: () =>
    api.get('/public/payment-channels').then((r) => (r as unknown as ApiResponse<PaymentChannel[]>).data),

  submitPayment: (data: { subscriptionId: string; accountNo: string; transactionId: string; amount: number }) =>
    api.post('/public/payments', data).then((r) => (r as unknown as ApiResponse<Payment>).data),
}

export const managementService = {
  getPackages: () =>
    api.get('/management/packages').then((r) => (r as unknown as ApiResponse<Package[]>).data),
  createPackage: (data: Partial<Package> & { features: string[] }) =>
    api.post('/management/packages', data).then((r) => (r as unknown as ApiResponse<Package>).data),
  updatePackage: (id: string, data: Partial<Package>) =>
    api.patch(`/management/packages/${id}`, data).then((r) => (r as unknown as ApiResponse<Package>).data),
  deletePackage: (id: string) =>
    api.delete(`/management/packages/${id}`),

  getStores: () =>
    api.get('/management/stores').then((r) => (r as unknown as ApiResponse<Store[]>).data),
  createStore: (data: { name: string; slug: string; description?: string; packageId: string; ownerName: string; email: string; password: string }) =>
    api.post('/management/stores', data).then((r) => (r as unknown as ApiResponse<StoreCreateResponse>).data),
  updateStoreStatus: (id: string, status: string) =>
    api.patch(`/management/stores/${id}/status`, { status }),

  getSubscriptions: () =>
    api.get('/management/subscriptions').then((r) => (r as unknown as ApiResponse<Subscription[]>).data),
  verifyPayment: (paymentId: string, action: 'VERIFIED' | 'REJECTED') =>
    api.post(`/management/subscriptions/payments/${paymentId}/verify`, { action }),

  getPaymentChannels: () =>
    api.get('/management/payment-channels').then((r) => (r as unknown as ApiResponse<PaymentChannel[]>).data),
  createPaymentChannel: (data: Partial<PaymentChannel>) =>
    api.post('/management/payment-channels', data).then((r) => (r as unknown as ApiResponse<PaymentChannel>).data),
  updatePaymentChannel: (id: string, data: Partial<PaymentChannel>) =>
    api.patch(`/management/payment-channels/${id}`, data).then((r) => (r as unknown as ApiResponse<PaymentChannel>).data),
  deletePaymentChannel: (id: string) =>
    api.delete(`/management/payment-channels/${id}`),
}

export const adminService = {
  getCategories: (storeSlug: string) =>
    api.get(`/stores/${storeSlug}/admin/categories`).then((r) => (r as unknown as ApiResponse<Category[]>).data),
  createCategory: (storeSlug: string, data: { title: string }) =>
    api.post(`/stores/${storeSlug}/admin/categories`, data).then((r) => (r as unknown as ApiResponse<Category>).data),
  updateCategory: (storeSlug: string, id: string, data: { title: string }) =>
    api.patch(`/stores/${storeSlug}/admin/categories/${id}`, data).then((r) => (r as unknown as ApiResponse<Category>).data),
  deleteCategory: (storeSlug: string, id: string) =>
    api.delete(`/stores/${storeSlug}/admin/categories/${id}`),

  getProducts: (storeSlug: string, params?: Record<string, string>) =>
    api.get(`/stores/${storeSlug}/admin/products`, { params }).then((r) => r as unknown as PaginatedResponse<Product>),
  createProduct: (storeSlug: string, data: Partial<Product>) =>
    api.post(`/stores/${storeSlug}/admin/products`, data).then((r) => (r as unknown as ApiResponse<Product>).data),
  updateProduct: (storeSlug: string, id: string, data: Partial<Product>) =>
    api.patch(`/stores/${storeSlug}/admin/products/${id}`, data).then((r) => (r as unknown as ApiResponse<Product>).data),
  deleteProduct: (storeSlug: string, id: string) =>
    api.delete(`/stores/${storeSlug}/admin/products/${id}`),

  getOrders: (storeSlug: string, params?: Record<string, string>) =>
    api.get(`/stores/${storeSlug}/admin/orders`, { params }).then((r) => r as unknown as PaginatedResponse<Order>),
  getOrder: (storeSlug: string, id: string) =>
    api.get(`/stores/${storeSlug}/admin/orders/${id}`).then((r) => (r as unknown as ApiResponse<Order>).data),
  updateOrderStatus: (storeSlug: string, id: string, status: string) =>
    api.patch(`/stores/${storeSlug}/admin/orders/${id}/status`, { status }).then((r) => (r as unknown as ApiResponse<Order>).data),
  updateOrderPaymentStatus: (storeSlug: string, id: string, paymentStatus: string) =>
    api.patch(`/stores/${storeSlug}/admin/orders/${id}/payment-status`, { paymentStatus }).then((r) => (r as unknown as ApiResponse<Order>).data),

  getSalesReport: (storeSlug: string, period?: string) =>
    api.get(`/stores/${storeSlug}/admin/reports/sales`, { params: period ? { period } : {} }).then((r) => (r as unknown as ApiResponse<SalesReport>).data),
}

export const storefrontService = {
  getStore: (storeSlug: string) =>
    api.get(`/storefront/${storeSlug}`).then((r) => (r as unknown as ApiResponse<Store>).data),
  getCategories: (storeSlug: string) =>
    api.get(`/storefront/${storeSlug}/categories`).then((r) => (r as unknown as ApiResponse<Category[]>).data),
  getStoreInfo: (storeSlug: string) =>
    api.get(`/storefront/${storeSlug}/info`).then((r) => (r as unknown as ApiResponse<Store>).data),
  getSubscriptionStatus: (storeSlug: string) =>
    api.get(`/storefront/${storeSlug}/subscription-status`).then((r) => (r as unknown as ApiResponse<{ storeId: string; storeStatus: string; subscriptionId: string; paymentStatus: string; isPaid: boolean }>).data),
  getProducts: (storeSlug: string, params?: Record<string, string>) =>
    api.get(`/storefront/${storeSlug}/products`, { params }).then((r) => r as unknown as PaginatedResponse<Product>),
  getProduct: (storeSlug: string, id: string) =>
    api.get(`/storefront/${storeSlug}/products/${id}`).then((r) => (r as unknown as ApiResponse<Product>).data),
  checkout: (storeSlug: string, data: { customerName: string; customerEmail: string; customerPhone: string; shippingAddress: string; notes?: string; items: Array<{ productId: string; quantity: number }> }) =>
    api.post(`/storefront/${storeSlug}/checkout`, data).then((r) => (r as unknown as ApiResponse<Order>).data),
}
