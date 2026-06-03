'use client'

import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { useCart } from '@/modules/cart/hooks/use-cart'

type Product = {
  id: number
  name: string
  price: number
  category: string
  img: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'MONOLITH VASE',
    price: 120,
    category: 'Ceramics',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGOlVrZ74ZCCbV_c06Ip4zK-ysKzz7DY77_r3pC0pRixSwxNJkhdjdsVCAhQTUaMV5FjXYQjld7sN08GqbUecey-fzl6pYFiIaF5svWXeGsFGXhhGwNcIKId8IUA3j6ZWOR6ugk4dBJO4gkaAIGR77IxSiB01etrttfNKzKZwRXaDfIIEh7_4yk0ouiMibaIsSCnJTjnZ369c0vMlasAGt2tCa9B4pUN8E5yhXNZDttl1L0EmPECvg89zg6iK-BytxvHw1SjCpkE',
  },
  {
    id: 2,
    name: 'ANGLE LAMP',
    price: 285,
    category: 'Lighting',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6HzBexAOqbMvEZH0yNC1THKGfoMlIRi66GeT_QYSUio644iSWGK4v7Y-2gNZjib73ZSOryre7KIfVBZGCGFh9_O_e3S5oN2FraBQCP0FnL2eA8C5gl4xgV6OJ0p5We7XxkNlCGfGAEdJQPaLwAiLcqt-6MDmq4EQeYmWSJJzsPYmrGeUzS5z0mGao1QV0nt4NS59U4IpW2iKgCDXE5XAs3_W8enq5ZGKl3Dn-sK-QJbWxbeM9CB9nsg9l58KU0hLOiiU-_-a_RZY',
  },
  {
    id: 3,
    name: 'GRID CHAIR',
    price: 850,
    category: 'Furniture',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGOlVrZ74ZCCbV_c06Ip4zK-ysKzz7DY77_r3pC0pRixSwxNJkhdjdsVCAhQTUaMV5FjXYQjld7sN08GqbUecey-fzl6pYFiIaF5svWXeGsFGXhhGwNcIKId8IUA3j6ZWOR6ugk4dBJO4gkaAIGR77IxSiB01etrttfNKzKZwRXaDfIIEh7_4yk0ouiMibaIsSCnJTjnZ369c0vMlasAGt2tCa9B4pUN8E5yhXNZDttl1L0EmPECvg89zg6iK-BytxvHw1SjCpkE',
  },
  {
    id: 4,
    name: 'CYLINDER CUP',
    price: 45,
    category: 'Ceramics',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx7kx82sCym7yTUQIitxV9lARDaAyyAC55Bl-FU88tXynpTSfvrBDonLZNFhqLMdAHEDwOUqukxcB_ybDS1lsYfe5o_WGLa6RBxM6mthXWF9S1YoaW7avnhm5qEoLQksOwxrsT5nxZkDhrwmgimUHolMJPGrNT2Ca44Lxto_ZMwmMvTYUyuA3dJ9RDrH-2ll44FWzrNFjD5VnxjB_jAe2461bGG7JqM7XsSgVJ3ZzymzIMZqKTXQIBXrNyxmgbhcFNeHVlSsi0gSQ',
  },
  {
    id: 5,
    name: 'ALU BOX',
    price: 95,
    category: 'Furniture',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByp-9DrEDECkEo6n3MZ0HwfRZElHBwIV2qL-1ysBg61ljEbwRZLPf9J1ivJy70SS5yNVsS2taR-6y50oNBTyOVzjNrBOkvrBfmU7uiTZXEh7QpoPa3WKSM6fN0ybmom0NyvHyWF4UwhD2hrNJjSXBdMwTLIsk2GwWBP14396IrlTr4b9SanC6rU-TV0S3oeMHsq2hw_xmt17yLVENoq0ofySrLye0hYXLtKHUrhNjQ4XkZ8l7hh5icB-b4rw0KLOHGqm2CR7pjeHs',
  },
  {
    id: 6,
    name: 'LINE CLOCK',
    price: 140,
    category: 'Furniture',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6HzBexAOqbMvEZH0yNC1THKGfoMlIRi66GeT_QYSUio644iSWGK4v7Y-2gNZjib73ZSOryre7KIfVBZGCGFh9_O_e3S5oN2FraBQCP0FnL2eA8C5gl4xgV6OJ0p5We7XxkNlCGfGAEdJQPaLwAiLcqt-6MDmq4EQeYmWSJJzsPYmrGeUzS5z0mGao1QV0nt4NS59U4IpW2iKgCDXE5XAs3_W8enq5ZGKl3Dn-sK-QJbWxbeM9CB9nsg9l58KU0hLOiiU-_-a_RZY',
  },
]

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
  const { addItem } = useCart()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Objects')
  const [activePrice, setActivePrice] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('newest')

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

            {/* Grid */}
            {filtered.length === 0 ? (
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
                      className="w-full border text-[10px] font-semibold tracking-widest uppercase py-2.5 transition-colors hover:bg-[#21201a] hover:text-white"
                      style={{ borderColor: '#21201a', color: '#21201a' }}
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
