import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn, slugify } from '@/lib/utils'
import { mockPackages } from '@/mocks/data'
import type { Package } from '@/types'

const storeInfoSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Store slug must be at least 2 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only',
    ),
  description: z.string().optional(),
})

const ownerSchema = z.object({
  ownerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const fullSchema = storeInfoSchema.merge(ownerSchema).extend({
  packageId: z.string().min(1, 'Please select a package'),
})

type FormValues = z.infer<typeof fullSchema>

const stepLabels = ['Store Info', 'Choose Plan', 'Your Details']

export default function CreateStorePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      packageId: '',
      ownerName: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  const { register, watch, setValue, formState: { errors } } = form

  const watchedName = watch('name')
  const selectedPackageId = watch('packageId')

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setValue('name', name)
    setValue('slug', slugify(name))
  }

  function selectPackage(pkg: Package) {
    setValue('packageId', pkg.id, { shouldValidate: true })
  }

  async function canAdvance(): Promise<boolean> {
    if (currentStep === 0) {
      return form.trigger(['name', 'slug'])
    }
    if (currentStep === 1) {
      return form.trigger(['packageId'])
    }
    return true
  }

  async function handleNext() {
    const valid = await canAdvance()
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, stepLabels.length - 1))
    }
  }

  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  async function onSubmit(_data: FormValues) {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    toast.success('Store created successfully! Redirecting to payment...')
    navigate('/payment')
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Create Your Store
          </h1>
          <p className="mt-3 text-muted-foreground">
            Set up your online store in just a few steps.
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, index) => (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                      index < currentStep
                        ? 'border-primary bg-primary text-primary-foreground'
                        : index === currentStep
                          ? 'border-primary text-primary'
                          : 'border-muted-foreground/30 text-muted-foreground/50',
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="size-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium',
                      index <= currentStep
                        ? 'text-foreground'
                        : 'text-muted-foreground/50',
                    )}
                  >
                    {label}
                  </span>
                </div>
                {index < stepLabels.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-px flex-1 transition-colors sm:mx-4',
                      index < currentStep ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
          <div className="rounded-xl border bg-card p-6 shadow-soft sm:p-8">
            {/* Step 1: Store Info */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold">
                  Store Information
                </h2>
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Store"
                    className="mt-1.5"
                    {...register('name')}
                    onChange={handleNameChange}
                    value={watchedName}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="slug">Store Slug</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      storestack.com/
                    </span>
                    <Input
                      id="slug"
                      placeholder="my-awesome-store"
                      {...register('slug')}
                      aria-invalid={!!errors.slug}
                    />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">
                    Description{' '}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell customers what your store is about..."
                    className="mt-1.5"
                    rows={3}
                    {...register('description')}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Select Package */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold">
                  Choose Your Plan
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {mockPackages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => selectPackage(pkg)}
                        className={cn(
                          'flex flex-col rounded-xl border p-5 text-left transition-all hover:border-primary/40',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'bg-background',
                        )}
                      >
                        <span className="font-display text-base font-bold">
                          {pkg.name}
                        </span>
                        <span className="mt-1 text-2xl font-extrabold">
                          ${pkg.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /mo
                          </span>
                        </span>
                        <ul className="mt-3 flex-1 space-y-1.5">
                          {pkg.features.slice(0, 3).map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <Check className="mt-0.5 size-3 shrink-0 text-success" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {isSelected && (
                          <div className="mt-3 text-center text-xs font-semibold text-primary">
                            Selected
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                {errors.packageId && (
                  <p className="text-xs text-destructive">
                    {errors.packageId.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Owner Details */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold">
                  Your Details
                </h2>
                <div>
                  <Label htmlFor="ownerName">Full Name</Label>
                  <Input
                    id="ownerName"
                    placeholder="John Doe"
                    className="mt-1.5"
                    {...register('ownerName')}
                    aria-invalid={!!errors.ownerName}
                  />
                  {errors.ownerName && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.ownerName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1.5"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    className="mt-1.5"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={cn(currentStep === 0 && 'invisible')}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {stepLabels.length}
            </span>
            {currentStep < stepLabels.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Create Store
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
