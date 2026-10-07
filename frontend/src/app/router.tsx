import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { PageLoader } from '@/components/shared/loading-spinner'
import { AuthGuard } from '@/features/auth/components/auth-guard'

function lazyPage(loader: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(loader)
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

const LandingLayout = lazy(() => import('@/components/layouts/landing-layout'))
const StorefrontLayout = lazy(() => import('@/components/layouts/storefront-layout'))
const AdminLayout = lazy(() => import('@/components/layouts/admin-layout'))
const ManagementLayout = lazy(() => import('@/components/layouts/management-layout'))
const NotFound = lazy(() => import('./not-found'))

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: lazyPage(() => import('@/features/landing/pages/home-page')),
      },
      {
        path: 'pricing',
        element: lazyPage(() => import('@/features/landing/pages/pricing-page')),
      },
      {
        path: 'create-store',
        element: lazyPage(() => import('@/features/landing/pages/create-store-page')),
      },
      {
        path: 'store-login',
        element: lazyPage(() => import('@/features/landing/pages/store-login-page')),
      },
      {
        path: 'payment',
        element: lazyPage(() => import('@/features/landing/pages/payment-page')),
      },
      {
        path: 'login',
        element: lazyPage(() => import('@/features/landing/pages/login-page')),
      },
    ],
  },

  {
    path: 'management',
    element: <AuthGuard allowedRoles={['SUPER_ADMIN']} />,
    children: [
      {
        element: (
          <Suspense fallback={<PageLoader />}>
            <ManagementLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: lazyPage(() => import('@/features/management/pages/dashboard-page')),
          },
          {
            path: 'packages',
            element: lazyPage(() => import('@/features/management/pages/packages-page')),
          },
          {
            path: 'subscriptions',
            element: lazyPage(() => import('@/features/management/pages/subscriptions-page')),
          },
          {
            path: 'stores',
            element: lazyPage(() => import('@/features/management/pages/stores-page')),
          },
          {
            path: 'payment-channels',
            element: lazyPage(() => import('@/features/management/pages/payment-channels-page')),
          },
        ],
      },
    ],
  },

  {
    path: ':storeSlug',
    children: [
      {
        element: (
          <Suspense fallback={<PageLoader />}>
            <StorefrontLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: lazyPage(() => import('@/features/storefront/pages/store-home-page')),
          },
          {
            path: 'product/:productId',
            element: lazyPage(() => import('@/features/storefront/pages/product-detail-page')),
          },
          {
            path: 'cart',
            element: lazyPage(() => import('@/features/storefront/pages/cart-page')),
          },
          {
            path: 'checkout',
            element: lazyPage(() => import('@/features/storefront/pages/checkout-page')),
          },
        ],
      },
      {
        path: 'admin',
        element: <AuthGuard allowedRoles={['STORE_ADMIN', 'SUPER_ADMIN']} />,
        children: [
          {
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            ),
            children: [
              {
                index: true,
                element: lazyPage(() => import('@/features/admin/pages/dashboard-page')),
              },
              {
                path: 'categories',
                element: lazyPage(() => import('@/features/admin/pages/categories-page')),
              },
              {
                path: 'products',
                element: lazyPage(() => import('@/features/admin/pages/products-page')),
              },
              {
                path: 'orders',
                element: lazyPage(() => import('@/features/admin/pages/orders-page')),
              },
              {
                path: 'orders/:orderId',
                element: lazyPage(() => import('@/features/admin/pages/order-detail-page')),
              },
              {
                path: 'reports',
                element: lazyPage(() => import('@/features/admin/pages/reports-page')),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
])
