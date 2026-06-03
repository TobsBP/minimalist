'use client'

import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { useCart } from '@/modules/cart/hooks/use-cart'
import { useProducts } from '@/modules/products/hooks/use-products'

type Product = {
  id: number
  name: string
  price: number
  category: string
  img: string
}

const categories = ['All Objects', 'Ceramics', 'Furniture', 'Lighting', 'Textiles']

type PriceRange = { label: string; min: number; max: number }
const priceRanges: PriceRange[] = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $150', min: 50, max: 150 },
  { label: '$150 - $500', min: 150, max: 500 },
  { label: 'Over $500', min: 500, max: Number.POSITIVE_INFINITY },
]

type SortKey = 'newest' | 'price-asc' | 'price-desc'

export default function ShopPage() {
  const { products: rawProducts, loading, error } = useProducts()
  const { addItem } = useCart()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Objects')
  const [activePrice, setActivePrice] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('newest')

  const products: Product[] = rawProducts.map((p) => ({
    id: p.id,
    name: p.name.toUpperCase(),
    price: p.price,
    category: p.category.charAt(0) + p.category.slice(1).toLowerCase(),
    img: p.imageUrl,
  }))

  const filtered = useMemo(() => {
    let list = [...products]

    if (search.trim())
      list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

    if (activeCategory !== 'All Objects')
      list = list.filter((p) => p.category === activeCategory)

    if (activePrice) {
      const range = priceRanges.find((r) => r.label === activePrice)
      if (range) list = list.filter((p) => p.price >= range.min && p.price < range.max)
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)

    return list
  }, [search, activeCategory, activePrice, sort])

  const hasFilters = activeCategory !== 'All Objects' || activePrice !== null || search.trim() !== ''

  function clearFilters() {
    setSearch('')
    setActiveCategory('All Objects')
    setActivePrice(null)
    setSort('newest')
  }

  return (
    <div className="store-root min-h-screen flex flex-col" style={{ backgroundColor: '#fcf9f4' }}>
      <SiteHeader />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-10">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            {/* Category */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#21201a' }}>
                Category
              </p>
              <div className="border-b mb-4" style={{ borderColor: '#cbc6bc' }} />
              <ul className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className="text-sm text-left w-full transition-opacity hover:opacity-60"
                      style={{ color: '#21201a', fontWeight: activeCategory === cat ? 700 : 400 }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#21201a' }}>
                Price
              </p>
              <div className="border-b mb-4" style={{ borderColor: '#cbc6bc' }} />
              <ul className="flex flex-col gap-2">
                {priceRanges.map((range) => (
                  <li key={range.label}>
                    <button
                      type="button"
                      onClick={() => setActivePrice(activePrice === range.label ? null : range.label)}
                      className="text-sm text-left w-full transition-opacity hover:opacity-60"
                      style={{ color: '#21201a', fontWeight: activePrice === range.label ? 700 : 400 }}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort by */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#21201a' }}>
                Sort By
              </p>
              <div className="border-b mb-4" style={{ borderColor: '#cbc6bc' }} />
              <div className="flex flex-col gap-2">
                {(
                  [
                    { value: 'newest', label: 'Newest Arrivals' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                  ] as { value: SortKey; label: string }[]
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSort(option.value)}
                    className="text-sm text-left w-full transition-opacity hover:opacity-60"
                    style={{ color: '#21201a', fontWeight: sort === option.value ? 700 : 400 }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase transition-opacity hover:opacity-60"
                style={{ color: '#5d5f5e' }}
              >
                <X className="size-3" /> Clear filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search + count */}
            <div className="flex items-center gap-4 mb-8">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-b bg-transparent text-sm py-1.5 outline-none placeholder:text-[#9c9890] transition-colors"
                style={{ borderColor: '#cbc6bc', color: '#21201a' }}
              />
              <span className="text-[11px] font-semibold tracking-widest uppercase shrink-0" style={{ color: '#5d5f5e' }}>
                {filtered.length} {filtered.length === 1 ? 'object' : 'objects'}
              </span>
            </div>

            {error && (
              <p className="mb-6 text-sm text-destructive">{error}</p>
            )}

            {/* Grid */}
            {loading ? (
              <p className="text-base py-24 text-center text-muted-foreground">Loading…</p>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-sm" style={{ color: '#5d5f5e' }}>No objects found.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[11px] font-semibold tracking-widest uppercase underline underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: '#21201a' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {filtered.map((product) => (
                  <div key={product.id} className="group flex flex-col gap-3">
                    <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: '#ebe8e3' }}>
                      {/* biome-ignore lint/performance/noImgElement: external CDN image */}
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                      />
                    </div>
                    <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#21201a' }}>
                      {product.name}
                    </p>
                    <p className="text-sm -mt-1" style={{ color: '#5d5f5e' }}>
                      ${product.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => addItem(product.id)}
                      className="w-full border text-[10px] font-semibold tracking-widest uppercase py-2.5 transition-colors text-[#21201a] hover:bg-[#21201a] hover:text-white"
                      style={{ borderColor: '#21201a' }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
