'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Button } from '@/components/ui/button'

interface CartItem {
  id: number
  name: string
  variant: string
  price: number
  qty: number
  img: string
}

const seed: CartItem[] = [
  {
    id: 1,
    name: 'Concrete Vase',
    variant: 'Grey / Medium',
    price: 45,
    qty: 1,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGOlVrZ74ZCCbV_c06Ip4zK-ysKzz7DY77_r3pC0pRixSwxNJkhdjdsVCAhQTUaMV5FjXYQjld7sN08GqbUecey-fzl6pYFiIaF5svWXeGsFGXhhGwNcIKId8IUA3j6ZWOR6ugk4dBJO4gkaAIGR77IxSiB01etrttfNKzKZwRXaDfIIEh7_4yk0ouiMibaIsSCnJTjnZ369c0vMlasAGt2tCa9B4pUN8E5yhXNZDttl1L0EmPECvg89zg6iK-BytxvHw1SjCpkE',
  },
  {
    id: 2,
    name: 'Machined Pen',
    variant: 'Silver / Fine',
    price: 85,
    qty: 2,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx7kx82sCym7yTUQIitxV9lARDaAyyAC55Bl-FU88tXynpTSfvrBDonLZNFhqLMdAHEDwOUqukxcB_ybDS1lsYfe5o_WGLa6RBxM6mthXWF9S1YoaW7avnhm5qEoLQksOwxrsT5nxZkDhrwmgimUHolMJPGrNT2Ca44Lxto_ZMwmMvTYUyuA3dJ9RDrH-2ll44FWzrNFjD5VnxjB_jAe2461bGG7JqM7XsSgVJ3ZzymzIMZqKTXQIBXrNyxmgbhcFNeHVlSsi0gSQ',
  },
]

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(seed)

  const adjust = (id: number, delta: number) =>
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    )

  const remove = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id))

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-6 py-10 md:py-16">
        <h1 className="text-2xl md:text-[32px] font-semibold tracking-tight mb-10 text-foreground">
          Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items column */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6 border-t border-border pt-6">
            {items.length === 0 && (
              <p className="text-base py-12 text-center text-muted-foreground">
                Your cart is empty.
              </p>
            )}

            {items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-border">
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-muted">
                  {/* biome-ignore lint/performance/noImgElement: external Stitch CDN image */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                    </div>
                    <span className="text-lg text-foreground">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Quantity stepper */}
                    <div className="flex items-center border border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => adjust(item.id, -1)}
                        className="rounded-none size-8"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-sm select-none text-foreground">
                        {item.qty}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => adjust(item.id, 1)}
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
                      onClick={() => remove(item.id)}
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
              </div>

              <div className="flex justify-between text-lg border-t border-border pt-4 mb-8 text-foreground">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Button className="w-full rounded-none h-auto py-3 text-base">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
