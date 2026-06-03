'use client'

import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/modules/cart/hooks/use-cart'
import { checkout } from '@/modules/orders/service'

function formatPrice(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function CartPage() {
  const router = useRouter()
  const { cart, loading, error, updateItem, removeItem } = useCart()
  const [shippingAddress, setShippingAddress] = useState('')
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)

  const items = cart?.items ?? []
  const subtotal = cart?.total ?? 0

  async function handleCheckout() {
    if (!shippingAddress.trim()) {
      setCheckoutError('Please enter a shipping address.')
      return
    }
    setCheckoutError(null)
    setPlacing(true)
    try {
      const order = await checkout({ shippingAddress })
      router.push(`/orders?placed=${order.id}`)
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-6 py-10 md:py-16">
        <h1 className="text-2xl md:text-[32px] font-semibold tracking-tight mb-10 text-foreground">
          Your Cart
        </h1>

        {error && (
          <p className="mb-6 text-sm text-destructive">
            {error} — you may need to{' '}
            <a href="/login" className="underline">
              log in
            </a>
            .
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items column */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6 border-t border-border pt-6">
            {loading && (
              <p className="text-base py-12 text-center text-muted-foreground">
                Loading…
              </p>
            )}

            {!loading && items.length === 0 && (
              <p className="text-base py-12 text-center text-muted-foreground">
                Your cart is empty.
              </p>
            )}

            {items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-border">
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-muted">
                  {/* biome-ignore lint/performance/noImgElement: backend-provided image URL */}
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg text-foreground">{item.productName}</h3>
                    </div>
                    <span className="text-lg text-foreground">
                      ${formatPrice(item.unitPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Quantity stepper */}
                    <div className="flex items-center border border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          item.quantity <= 1
                            ? removeItem(item.id)
                            : updateItem(item.id, item.quantity - 1)
                        }
                        className="rounded-none size-8"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-sm select-none text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="rounded-none size-8"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>

                    {/* Remove */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="rounded-none text-[11px] font-semibold tracking-widest uppercase text-muted-foreground h-auto px-0 hover:bg-transparent hover:text-foreground hover:underline"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="w-full lg:w-1/3 mt-10 lg:mt-0">
            <div className="border border-border p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Summary</h2>

              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
              </div>

              <div className="flex justify-between text-lg border-t border-border pt-4 mb-6 text-foreground">
                <span>Total</span>
                <span>${formatPrice(subtotal)}</span>
              </div>

              <Input
                type="text"
                placeholder="Shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="rounded-none h-auto px-4 py-3 mb-3"
                aria-label="Shipping address"
              />

              {checkoutError && (
                <p className="mb-3 text-[11px] font-medium text-destructive">
                  {checkoutError}
                </p>
              )}

              <Button
                onClick={handleCheckout}
                disabled={placing || items.length === 0}
                className="w-full rounded-none h-auto py-3 text-base"
              >
                {placing ? 'Placing order…' : 'Checkout'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
