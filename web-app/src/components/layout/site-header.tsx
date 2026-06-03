'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/modules/auth/hooks/use-auth'

export function SiteHeader() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  return (
    <header
      className="w-full sticky top-0 z-50 border-b"
      style={{ backgroundColor: '#fcf9f4', borderColor: '#cbc6bc' }}
    >
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter"
            style={{ color: '#21201a' }}
          >
            MINIMALIST
          </Link>
          <nav className="hidden md:flex gap-6 text-base">
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Cart', href: '/cart' },
              { label: 'Orders', href: '/orders' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-opacity hover:opacity-60"
                style={{ color: '#5d5f5e' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {!loading &&
            (user ? (
              <>
                <span className="hidden sm:inline text-sm" style={{ color: '#5d5f5e' }}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm transition-opacity hover:opacity-60"
                  style={{ color: '#21201a' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm transition-opacity hover:opacity-60"
                style={{ color: '#21201a' }}
              >
                Login
              </Link>
            ))}
          <Link
            href="/cart"
            className="border-b-2 pb-0.5"
            style={{ borderColor: '#21201a', color: '#21201a' }}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
