import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ProductColorImage } from '@/components/shared/product-color-image'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'
import { emailSchema, phoneSchema, requiredString } from '@/lib/validators'
import { storefrontService } from '@/lib/api-services'

const checkoutSchema = z.object({
  customerName: requiredString('Customer name'),
  email: emailSchema,
  phone: phoneSchema,
  shippingAddress: requiredString('Shipping address').min(
    10,
    'Please enter a complete shipping address',
  ),
  notes: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { storeSlug = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const items = useCartStore((s) => s.getItems(storeSlug))
  const subtotal = useCartStore((s) => s.getSubtotal(storeSlug))
  const clearCart = useCartStore((s) => s.clearCart)

  const shipping = 0
  const total = subtotal + shipping

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      shippingAddress: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (items.length === 0) {
      navigate(`/${storeSlug}`, { replace: true })
    }
  }, [items.length, navigate, storeSlug])

  async function onSubmit(data: CheckoutFormValues) {
    try {
      await storefrontService.checkout(storeSlug, {
        customerName: data.customerName,
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
      await queryClient.invalidateQueries({ queryKey: ['storefront', storeSlug] })
    } catch {
      toast.error('Unable to place your order', {
        description: 'Please check your details and try again.',
      })
      return
    }
    clearCart(storeSlug)
    toast.success('Order placed successfully!', {
      description:
        'Thank you for your purchase. You will receive a confirmation email shortly.',
    })
    navigate(`/${storeSlug}`)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to={`/${storeSlug}/cart`}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-muted-foreground">
          Complete your order by filling in the details below.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left column - Form */}
            <div className="lg:col-span-3">
              <div className="space-y-6 rounded-xl border bg-card p-6">
                {/* Contact information */}
                <div>
                  <h2 className="font-display text-lg font-bold">
                    Contact Information
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We will use these details to keep you informed about your
                    order.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1-555-0123"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Shipping address */}
                <div>
                  <h2 className="font-display text-lg font-bold">
                    Shipping Address
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Where should we deliver your order?
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Main St, City, State, ZIP"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Order notes */}
                <div>
                  <h2 className="font-display text-lg font-bold">
                    Order Notes
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Any special instructions for your order? (Optional)
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Leave at the front door, ring the bell..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right column - Order summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-xl border bg-card p-6">
                <h2 className="font-display text-lg font-bold">
                  Order Summary
                </h2>
                <Separator className="my-4" />

                {/* Cart items */}
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3"
                    >
                      <div className="relative shrink-0">
                        <ProductColorImage
                          color={item.product.images[0] ?? '#ccc'}
                          title={item.product.title}
                          className="size-12 rounded-lg"
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.product.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.product.price)} each
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Free
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full gap-2"
                  disabled={form.formState.isSubmitting}
                >
                  <Lock className="size-4" />
                  Place Order
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Your personal data will be used to process your order and
                  support your experience on this store.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
