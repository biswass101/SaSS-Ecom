import {
  ArrowRight,
  BarChart3,
  Package,
  Store,
  Truck,
  AlertCircle,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'

const features = [
  {
    icon: Store,
    title: 'Custom Storefront',
    description:
      'Build a beautiful, branded storefront that reflects your identity. Fully customizable themes and layouts at your fingertips.',
  },
  {
    icon: Package,
    title: 'Product Management',
    description:
      'Effortlessly manage your entire catalog. Add products, organize categories, track inventory, and update pricing in seconds.',
  },
  {
    icon: Truck,
    title: 'Order Tracking',
    description:
      'Keep customers in the loop with real-time order tracking. Manage fulfillment from pending to delivered, all in one place.',
  },
  {
    icon: BarChart3,
    title: 'Sales Analytics',
    description:
      'Make data-driven decisions with detailed sales reports, revenue trends, and product performance insights.',
  },
]

const steps = [
  {
    number: 1,
    title: 'Choose a Plan',
    description:
      'Pick the plan that fits your business. From startups to enterprise, we have you covered.',
  },
  {
    number: 2,
    title: 'Create Your Store',
    description:
      'Set up your store in minutes. Add your branding, products, and start customizing.',
  },
  {
    number: 3,
    title: 'Start Selling',
    description:
      'Go live and reach customers instantly. We handle the infrastructure so you can focus on growth.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      // Not logged in - go to create store
      navigate('/create-store')
    } else if (user?.role === 'STORE_ADMIN') {
      // Store owner - go to create another store or dashboard
      navigate('/create-store')
    } else if (user?.role === 'SUPER_ADMIN') {
      // Management - show modal
      setShowLogoutModal(true)
    }
  }

  return (
    <div>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl border bg-background p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertCircle className="size-5 text-warning" />
              </div>
              <h3 className="text-lg font-semibold">Sign Out Required</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              You're logged in as a management user. To create a new store account, you need to sign out first and register with different credentials.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setShowLogoutModal(false)
                  navigate('/login')
                }}
                className="w-full"
              >
                Sign Out & Create New Store
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Launch Your Online Store{' '}
              <span className="text-primary">in Minutes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              StoreStack gives you everything you need to create, manage, and
              grow your online store. No coding required — just pick a plan, set
              up your storefront, and start selling.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button onClick={handleGetStarted} size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="size-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-80 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed to help you build, manage, and scale your
              e-commerce business from day one.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-y bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From sign-up to your first sale, we make the process seamless.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line (hidden on mobile, shown between steps) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border sm:block" />
                )}
                <div className="relative mx-auto flex size-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl bg-primary px-6 py-16 text-center sm:px-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
              Join thousands of businesses already using StoreStack to power
              their online stores. Set up yours in minutes.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="font-semibold"
              >
                <Link to="/create-store">
                  Create Your Store
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
