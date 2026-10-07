import { Check } from 'lucide-react'
import { Link } from 'react-router'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { publicService } from '@/lib/api-services'
import { useQuery } from '@tanstack/react-query'

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer:
      'Absolutely. You can upgrade or downgrade your plan at any time from your store admin dashboard. When upgrading, the price difference will be prorated for the remainder of your billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept bank transfers and mobile banking payments. After choosing your plan and creating your store, you will be directed to our payment page where you can select your preferred payment channel and submit your transaction details.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'We do not currently offer a free trial, but our Starter plan is very affordable at $19/month and gives you everything you need to get started. You can upgrade to a higher plan as your business grows.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer:
      'If you approach your product or order limits, we will notify you via email. You can then upgrade to a higher plan to accommodate your growing business. We will never shut down your store without notice.',
  },
]

export default function PricingPage() {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['public', 'packages'],
    queryFn: publicService.getPackages,
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-hero py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your business. No hidden fees, no
            surprises. Scale up as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {isLoading ? <p className="text-muted-foreground">Loading plans...</p> : packages.map((pkg) => {
              const isPopular = pkg.name === 'Growth'
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    'relative flex flex-col rounded-2xl border bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1',
                    isPopular && 'border-primary ring-2 ring-primary/20',
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="font-display text-xl font-bold">
                      {pkg.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="mb-6">
                    <span className="font-display text-4xl font-extrabold">
                      ${pkg.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="mb-8 flex-1 space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={isPopular ? 'default' : 'outline'}
                    size="lg"
                    className="w-full"
                  >
                    <Link to="/create-store">Get Started</Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            Have questions? We have answers.
          </p>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
