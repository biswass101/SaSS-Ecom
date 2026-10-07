export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  CREATE_STORE: '/create-store',
  STORE_LOGIN: '/store-login',
  PAYMENT: '/payment',
  LOGIN: '/login',

  MANAGEMENT: '/management',
  MANAGEMENT_PACKAGES: '/management/packages',
  MANAGEMENT_SUBSCRIPTIONS: '/management/subscriptions',
  MANAGEMENT_STORES: '/management/stores',
  MANAGEMENT_PAYMENT_CHANNELS: '/management/payment-channels',

  store: (slug: string) => `/${slug}`,
  storeProduct: (slug: string, id: string) => `/${slug}/product/${id}`,
  storeCart: (slug: string) => `/${slug}/cart`,
  storeCheckout: (slug: string) => `/${slug}/checkout`,

  storeAdmin: (slug: string) => `/${slug}/admin`,
  storeAdminCategories: (slug: string) => `/${slug}/admin/categories`,
  storeAdminProducts: (slug: string) => `/${slug}/admin/products`,
  storeAdminOrders: (slug: string) => `/${slug}/admin/orders`,
  storeAdminOrderDetail: (slug: string, id: string) => `/${slug}/admin/orders/${id}`,
  storeAdminReports: (slug: string) => `/${slug}/admin/reports`,
} as const

export const APP_NAME = 'StoreStack'

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
}

export const STORE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
}
