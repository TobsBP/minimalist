'use client'

import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useOrders } from '@/modules/orders/hooks/use-orders'
import { getOrder } from '@/modules/orders/service'
import type { Order, OrderStatus } from '@/modules/orders/types'

const statusBadgeVariant: Record<OrderStatus, 'secondary' | 'default' | 'outline'> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  SHIPPED: 'default',
  DELIVERED: 'outline',
  CANCELLED: 'outline',
}

function formatPrice(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

function titleCase(status: OrderStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export default function OrdersPage() {
  const { orders, loading, error, cancelOrder } = useOrders()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [details, setDetails] = useState<Record<number, Order>>({})

  const toggle = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  useEffect(() => {
    if (expandedId == null || details[expandedId]) return
    getOrder(expandedId)
      .then((order) => setDetails((prev) => ({ ...prev, [expandedId]: order })))
      .catch(() => {})
  }, [expandedId, details])

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
        </header>

        {error && (
          <p className="mb-6 text-sm text-destructive">
            {error} — you may need to{' '}
            <a href="/login" className="underline">
              log in
            </a>
            .
          </p>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground py-12">Loading orders…</p>
        )}

        {!loading && orders.length === 0 && !error && (
          <p className="text-sm text-muted-foreground py-12">You have no orders yet.</p>
        )}

        {orders.length > 0 && (
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
              const detail = details[order.id]
              const dim = order.status === 'DELIVERED' || order.status === 'CANCELLED'

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
                      #{order.id}
                    </div>
                    <div className="col-span-1 md:col-span-3 text-sm text-muted-foreground">
                      <span className="md:hidden text-[11px] font-semibold tracking-widest uppercase mr-2">
                        Date:
                      </span>
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="col-span-1 md:col-span-3">
                      <span className="md:hidden text-[11px] font-semibold tracking-widest uppercase mr-2 text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={statusBadgeVariant[order.status]}
                        className="rounded-none text-[11px] tracking-widest uppercase font-semibold"
                      >
                        {titleCase(order.status)}
                      </Badge>
                    </div>
                    <div
                      className={`col-span-1 md:col-span-2 text-base md:text-right ${dim ? 'text-muted-foreground' : 'text-foreground'}`}
                    >
                      <span className="md:hidden text-[11px] font-semibold tracking-widest uppercase mr-2 text-muted-foreground">
                        Total:
                      </span>
                      ${formatPrice(order.total)}
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
                      <p className="text-sm text-muted-foreground mb-4">
                        Shipping to {order.shippingAddress}.
                      </p>

                      <h4 className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-4 border-b border-border pb-1">
                        Items
                      </h4>

                      {!detail && (
                        <p className="text-sm text-muted-foreground">Loading items…</p>
                      )}

                      <div className="flex flex-col gap-4">
                        {detail?.items.map((item) => (
                          <div key={item.id} className="flex items-start gap-4">
                            <div className="flex-grow">
                              <div className="text-base text-foreground">
                                {item.productName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </div>
                            </div>
                            <div className="text-base text-foreground">
                              ${formatPrice(item.subtotal)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <div className="flex justify-end border-t border-border mt-6 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => cancelOrder(order.id)}
                            className="rounded-none text-[11px] font-semibold tracking-widest uppercase h-auto px-4 py-2"
                          >
                            Cancel Order
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
