'use client'

import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface OrderItem {
  name: string
  qty: number
  price: number
  img: string
}

interface Order {
  id: string
  date: string
  status: 'pending' | 'shipped' | 'delivered'
  total: number
  items: OrderItem[]
  deliveredOn?: string
}

const orders: Order[] = [
  {
    id: '#ORD-2024-88A1',
    date: 'Oct 24, 2024',
    status: 'pending',
    total: 245,
    items: [
      {
        name: 'Ceramic Pour-Over Cone',
        qty: 1,
        price: 45,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzWWOyQ0KhAJMIEySErEoaNpbDoamZgYhfNXjT6yqnBp6E7GB-CmPSf-Q5heDj4_yDALoOHMGu83IHpilvUpy06bPSZ4gUjHiD1wn0GjUYRaaanFP6uYG4lmyg9RvX4I49AvogZkLErGCc6Rlmk1U98ggPU4KZ2vqqVjxclBLA0fpzhFObGEjxicEnaEPsM2b4AP2IxUjOW8H_g_sRtr8-a4RJ4ekWgJHg8dCBhIpBzFp4sxSVaLchbRNdqAxuL9-au5EOpIuECa8',
      },
      {
        name: 'Heavy Canvas Tote',
        qty: 2,
        price: 100,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6HzBexAOqbMvEZH0yNC1THKGfoMlIRi66GeT_QYSUio644iSWGK4v7Y-2gNZjib73ZSOryre7KIfVBZGCGFh9_O_e3S5oN2FraBQCP0FnL2eA8C5gl4xgV6OJ0p5We7XxkNlCGfGAEdJQPaLwAiLcqt-6MDmq4EQeYmWSJJzsPYmrGeUzS5z0mGao1QV0nt4NS59U4IpW2iKgCDXE5XAs3_W8enq5ZGKl3Dn-sK-QJbWxbeM9CB9nsg9l58KU0hLOiiU-_-a_RZY',
      },
    ],
  },
  {
    id: '#ORD-2024-77B2',
    date: 'Oct 18, 2024',
    status: 'shipped',
    total: 85.5,
    items: [
      {
        name: 'Archival Notebook — Blank',
        qty: 3,
        price: 85.5,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByp-9DrEDECkEo6n3MZ0HwfRZElHBwIV2qL-1ysBg61ljEbwRZLPf9J1ivJy70SS5yNVsS2taR-6y50oNBTyOVzjNrBOkvrBfmU7uiTZXEh7QpoPa3WKSM6fN0ybmom0NyvHyWF4UwhD2hrNJjSXBdMwTLIsk2GwWBP14396IrlTr4b9SanC6rU-TV0S3oeMHsq2hw_xmt17yLVENoq0ofySrLye0hYXLtKHUrhNjQ4XkZ8l7hh5icB-b4rw0KLOHGqm2CR7pjeHs',
      },
    ],
  },
  {
    id: '#ORD-2024-12C9',
    date: 'Sep 02, 2024',
    status: 'delivered',
    total: 1200,
    deliveredOn: 'Sep 05, 2024',
    items: [],
  },
]

const statusBadgeVariant: Record<Order['status'], 'secondary' | 'default' | 'outline'> = {
  pending: 'secondary',
  shipped: 'default',
  delivered: 'outline',
}

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* Page header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl md:text-[32px] font-semibold tracking-tight mb-1 text-foreground">
              Orders
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your recent activity.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-none text-[11px] font-semibold tracking-widest uppercase h-auto px-4 py-2"
            >
              Filter
            </Button>
            <Button
              type="button"
              className="rounded-none text-[11px] font-semibold tracking-widest uppercase h-auto px-4 py-2"
            >
              Help
            </Button>
          </div>
        </header>

        {/* Table */}
        <div className="w-full border border-border bg-card">
          {/* Table head (desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 border-b border-border bg-muted text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1" />
          </div>

          {orders.map((order) => {
            const isOpen = expandedId === order.id
            const dim = order.status === 'delivered'

            return (
              <div key={order.id} className="border-b border-border last:border-0">
                {/* Row */}
                <button
                  type="button"
                  className="w-full text-left grid grid-cols-1 md:grid-cols-12 gap-y-2 gap-x-2 px-4 py-4 md:py-3 items-center transition-colors hover:bg-muted/50"
                  style={{ backgroundColor: isOpen ? 'var(--color-muted)' : undefined }}
                  onClick={() => toggle(order.id)}
                >
                  <div
                    className={`col-span-1 md:col-span-3 text-base font-medium ${dim ? 'text-muted-foreground' : 'text-foreground'}`}
                  >
                    <span className="md:hidden text-[11px] font-semibold tracking-widest uppercase mr-2 text-muted-foreground">
                      ID:
                    </span>
                    {order.id}
                  </div>
                  <div className="col-span-1 md:col-span-3 text-sm text-muted-foreground">
                    <span className="md:hidden text-[11px] font-semibold tracking-widest uppercase mr-2">
                      Date:
                    </span>
                    {order.date}
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <span className="md:hidden text-[11px] font-semibold tracking-widest uppercase mr-2 text-muted-foreground">
                      Status:
                    </span>
                    <Badge
                      variant={statusBadgeVariant[order.status]}
                      className="rounded-none text-[11px] tracking-widest uppercase font-semibold"
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div
                    className={`col-span-1 md:col-span-2 text-base md:text-right ${dim ? 'text-muted-foreground' : 'text-foreground'}`}
                  >
                    <span className="md:hidden text-[11px] font-semibold tracking-widest uppercase mr-2 text-muted-foreground">
                      Total:
                    </span>
                    ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="col-span-1 flex justify-end md:justify-center text-muted-foreground">
                    <ChevronDown
                      className="size-5 transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-border p-4 md:p-6 bg-muted/50">
                    {order.status === 'delivered' ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-4">
                          Delivered on {order.deliveredOn}.
                        </p>
                        <div className="flex justify-end border-t border-border pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-none text-[11px] font-semibold tracking-widest uppercase h-auto px-4 py-2"
                          >
                            View Invoice
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-4 border-b border-border pb-1">
                          Items in Shipment
                        </h4>
                        <div className="flex flex-col gap-4">
                          {order.items.map((item) => (
                            <div key={item.name} className="flex items-start gap-4">
                              <div
                                className="w-16 h-16 shrink-0 border border-border bg-cover bg-center bg-muted"
                                style={{ backgroundImage: `url('${item.img}')` }}
                              />
                              <div className="flex-grow">
                                <div className="text-base text-foreground">
                                  {item.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Qty: {item.qty}
                                </div>
                              </div>
                              <div className="text-base text-foreground">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                        {order.status === 'pending' && (
                          <div className="flex justify-end border-t border-border mt-6 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-none text-[11px] font-semibold tracking-widest uppercase h-auto px-4 py-2"
                            >
                              Track Package
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center border-t border-border pt-4">
          <Button
            type="button"
            variant="ghost"
            disabled
            className="rounded-none text-[11px] font-semibold tracking-widest uppercase h-auto px-0 gap-1 text-muted-foreground hover:bg-transparent"
          >
            <ArrowLeft className="size-4" /> Prev
          </Button>
          <span className="text-sm text-muted-foreground">Page 1 of 4</span>
          <Button
            type="button"
            variant="ghost"
            className="rounded-none text-[11px] font-semibold tracking-widest uppercase h-auto px-0 gap-1 text-muted-foreground hover:bg-transparent"
          >
            Next <ArrowRight className="size-4" />
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
