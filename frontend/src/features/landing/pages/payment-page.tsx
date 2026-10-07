import { zodResolver } from '@hookform/resolvers/zod'
import {
  Banknote,
  Building2,
  CreditCard,
  Loader2,
  Smartphone,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { mockPaymentChannels } from '@/mocks/data'

const paymentSchema = z.object({
  accountNo: z.string().min(1, 'Account number is required'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  amount: z.string().min(1, 'Amount is required'),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

const channelIcons: Record<string, typeof Building2> = {
  bank_transfer: Building2,
  mobile_banking: Smartphone,
}

export default function PaymentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)

  const activeChannels = mockPaymentChannels.filter((ch) => ch.isActive)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      accountNo: '',
      transactionId: '',
      amount: '',
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  async function onSubmit(_data: PaymentFormValues) {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    toast.success('Payment submitted for verification')
    reset()
    setSelectedChannel(null)
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Complete Your Payment
          </h1>
          <p className="mt-3 text-muted-foreground">
            Choose a payment channel below, send your payment, then submit the
            transaction details for verification.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Payment Channels */}
          <div>
            <h2 className="font-display text-xl font-semibold">
              Payment Channels
            </h2>
            <div className="mt-4 space-y-4">
              {activeChannels.map((channel) => {
                const Icon = channelIcons[channel.type] ?? CreditCard
                const isSelected = selectedChannel === channel.id
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelectedChannel(channel.id)}
                    className={cn(
                      'flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-all hover:border-primary/40',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'bg-card',
                    )}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{channel.name}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm">
                        <Banknote className="size-3.5 text-muted-foreground" />
                        <span className="font-mono text-sm">
                          {channel.accountNumber}
                        </span>
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {channel.instructions}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="font-display text-xl font-semibold">
              Submit Payment Details
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 rounded-xl border bg-card p-6 shadow-soft"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountNo">
                    Account Number Used for Payment
                  </Label>
                  <Input
                    id="accountNo"
                    placeholder="Your account or phone number"
                    className="mt-1.5"
                    {...register('accountNo')}
                    aria-invalid={!!errors.accountNo}
                  />
                  {errors.accountNo && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.accountNo.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="TXN-XXXX-XXXX"
                    className="mt-1.5"
                    {...register('transactionId')}
                    aria-invalid={!!errors.transactionId}
                  />
                  {errors.transactionId && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.transactionId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="mt-1.5"
                    {...register('amount')}
                    aria-invalid={!!errors.amount}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Submit Payment
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Your payment will be verified within 24 hours. You will receive
                an email confirmation once verified.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
