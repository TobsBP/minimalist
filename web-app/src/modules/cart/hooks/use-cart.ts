'use client'

import { useCallback, useEffect, useState } from 'react'
import * as cartService from '../service'
import type { Cart } from '../types'

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (op: () => Promise<Cart>) => {
    setError(null)
    try {
      setCart(await op())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cart operation failed')
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    await run(cartService.getCart)
    setLoading(false)
  }, [run])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = useCallback(
    (productId: number, quantity = 1) =>
      run(() => cartService.addItem({ productId, quantity })),
    [run],
  )

  const updateItem = useCallback(
    (itemId: number, quantity: number) =>
      run(() => cartService.updateItem(itemId, quantity)),
    [run],
  )

  const removeItem = useCallback(
    (itemId: number) => run(() => cartService.removeItem(itemId)),
    [run],
  )

  const clearCart = useCallback(async () => {
    setError(null)
    try {
      await cartService.clearCart()
      setCart((prev) => (prev ? { ...prev, items: [], total: 0 } : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cart operation failed')
    }
  }, [])

  return { cart, loading, error, refresh, addItem, updateItem, removeItem, clearCart }
}
