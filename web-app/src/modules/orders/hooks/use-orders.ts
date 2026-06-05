'use client'

import { useCallback, useEffect, useState } from 'react'
import * as orderService from '../service'
import type { OrderSummary } from '../types'

export function useOrders() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setOrders(await orderService.listOrders())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const cancelOrder = useCallback(async (id: number) => {
    setError(null)
    try {
      const updated = await orderService.cancelOrder(id)
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: updated.status } : o)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel order')
    }
  }, [])

  return { orders, loading, error, refresh, cancelOrder }
}
