import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { Button } from '@/components/ui/button'

const arrivals = [
  {
    name: 'Concrete Vase',
    variant: 'Grey / Medium',
    price: 45,
    href: '/shop/concrete-vase',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGOlVrZ74ZCCbV_c06Ip4zK-ysKzz7DY77_r3pC0pRixSwxNJkhdjdsVCAhQTUaMV5FjXYQjld7sN08GqbUecey-fzl6pYFiIaF5svWXeGsFGXhhGwNcIKId8IUA3j6ZWOR6ugk4dBJO4gkaAIGR77IxSiB01etrttfNKzKZwRXaDfIIEh7_4yk0ouiMibaIsSCnJTjnZ369c0vMlasAGt2tCa9B4pUN8E5yhXNZDttl1L0EmPECvg89zg6iK-BytxvHw1SjCpkE',
  },
  {
    name: 'Machined Pen',
    variant: 'Silver / Fine',
    price: 85,
    href: '/shop/machined-pen',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx7kx82sCym7yTUQIitxV9lARDaAyyAC55Bl-FU88tXynpTSfvrBDonLZNFhqLMdAHEDwOUqukxcB_ybDS1lsYfe5o_WGLa6RBxM6mthXWF9S1YoaW7avnhm5qEoLQksOwxrsT5nxZkDhrwmgimUHolMJPGrNT2Ca44Lxto_ZMwmMvTYUyuA3dJ9RDrH-2ll44FWzrNFjD5VnxjB_jAe2461bGG7JqM7XsSgVJ3ZzymzIMZqKTXQIBXrNyxmgbhcFNeHVlSsi0gSQ',
  },
  {
    name: 'Ceramic Pour-Over',
    variant: 'White / Single',
    price: 45,
    href: '/shop/ceramic-pour-over',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzWWOyQ0KhAJMIEySErEoaNpbDoamZgYhfNXjT6yqnBp6E7GB-CmPSf-Q5heDj4_yDALoOHMGu83IHpilvUpy06bPSZ4gUjHiD1wn0GjUYRaaanFP6uYG4lmyg9RvX4I49AvogZkLErGCc6Rlmk1U98ggPU4KZ2vqqVjxclBLA0fpzhFObGEjxicEnaEPsM2b4AP2IxUjOW8H_g_sRtr8-a4RJ4ekWgJHg8dCBhIpBzFp4sxSVaLchbRNdqAxuL9-au5EOpIuECa8',
  },
  {
    name: 'Archival Notebook',
    variant: 'Blank / A5',
    price: 28,
    href: '/shop/archival-notebook',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByp-9DrEDECkEo6n3MZ0HwfRZElHBwIV2qL-1ysBg61ljEbwRZLPf9J1ivJy70SS5yNVsS2taR-6y50oNBTyOVzjNrBOkvrBfmU7uiTZXEh7QpoPa3WKSM6fN0ybmom0NyvHyWF4UwhD2hrNJjSXBdMwTLIsk2GwWBP14396IrlTr4b9SanC6rU-TV0S3oeMHsq2hw_xmt17yLVENoq0ofySrLye0hYXLtKHUrhNjQ4XkZ8l7hh5icB-b4rw0KLOHGqm2CR7pjeHs',
  },
]

const categories = [
  {
    label: 'Objects',
    description: 'Functional forms for daily life',
    href: '/shop/objects',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGGOlVrZ74ZCCbV_c06Ip4zK-ysKzz7DY77_r3pC0pRixSwxNJkhdjdsVCAhQTUaMV5FjXYQjld7sN08GqbUecey-fzl6pYFiIaF5svWXeGsFGXhhGwNcIKId8IUA3j6ZWOR6ugk4dBJO4gkaAIGR77IxSiB01etrttfNKzKZwRXaDfIIEh7_4yk0ouiMibaIsSCnJTjnZ369c0vMlasAGt2tCa9B4pUN8E5yhXNZDttl1L0EmPECvg89zg6iK-BytxvHw1SjCpkE',
  },
  {
    label: 'Tools',
    description: 'Precision instruments, considered',
    href: '/shop/tools',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx7kx82sCym7yTUQIitxV9lARDaAyyAC55Bl-FU88tXynpTSfvrBDonLZNFhqLMdAHEDwOUqukxcB_ybDS1lsYfe5o_WGLa6RBxM6mthXWF9S1YoaW7avnhm5qEoLQksOwxrsT5nxZkDhrwmgimUHolMJPGrNT2Ca44Lxto_ZMwmMvTYUyuA3dJ9RDrH-2ll44FWzrNFjD5VnxjB_jAe2461bGG7JqM7XsSgVJ3ZzymzIMZqKTXQIBXrNyxmgbhcFNeHVlSsi0gSQ',
  },
  {
    label: 'Materials',
    description: 'Raw beauty, thoughtfully sourced',
    href: '/shop/materials',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6HzBexAOqbMvEZH0yNC1THKGfoMlIRi66GeT_QYSUio644iSWGK4v7Y-2gNZjib73ZSOryre7KIfVBZGCGFh9_O_e3S5oN2FraBQCP0FnL2eA8C5gl4xgV6OJ0p5We7XxkNlCGfGAEdJQPaLwAiLcqt-6MDmq4EQeYmWSJJzsPYmrGeUzS5z0mGao1QV0nt4NS59U4IpW2iKgCDXE5XAs3_W8enq5ZGKl3Dn-sK-QJbWxbeM9CB9nsg9l58KU0hLOiiU-_-a_RZY',
  },
]

export default function Home() {
  return (
    <div
      className="store-root min-h-screen flex flex-col"
      style={{ backgroundColor: '#fcf9f4' }}
    >
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full border-b" style={{ borderColor: '#cbc6bc' }}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 md:py-28 flex flex-col md:flex-row gap-12 md:gap-0 items-start">
            <div className="flex-1">
              <p
                className="text-[11px] font-semibold tracking-widest uppercase mb-8"
                style={{ color: '#5d5f5e' }}
              >
                New Collection — 2024
              </p>
              <h1
                className="font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[1.06] font-light tracking-tight mb-8"
                style={{ color: '#21201a' }}
              >
                Objects that
                <br />
                earn their place.
              </h1>
              <p
                className="text-base leading-relaxed max-w-sm mb-10"
                style={{ color: '#5d5f5e' }}
              >
                Curated goods for those who buy less, but buy better. Each piece is
                selected for durability, restraint, and quiet usefulness.
              </p>
              <Button
                asChild
                className="rounded-none h-auto py-3 px-6 text-[11px] font-semibold tracking-widest uppercase gap-2"
              >
                <Link href="/shop">
                  Shop Collection <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            <div className="w-full md:w-[420px] shrink-0 aspect-[4/5] bg-muted overflow-hidden">
              {/* biome-ignore lint/performance/noImgElement: external CDN image */}
              <img
                src={arrivals[0].img}
                alt="Featured product"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-16">
          <div
            className="flex justify-between items-center mb-8 border-b pb-4"
            style={{ borderColor: '#cbc6bc' }}
          >
            <p
              className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: '#5d5f5e' }}
            >
              New Arrivals
            </p>
            <Link
              href="/shop"
              className="text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1 transition-opacity hover:opacity-60"
              style={{ color: '#21201a' }}
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {arrivals.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group flex flex-col gap-3"
              >
                <div className="aspect-square bg-muted overflow-hidden">
                  {/* biome-ignore lint/performance/noImgElement: external CDN image */}
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium" style={{ color: '#21201a' }}>
                    {product.name}
                  </p>
                  <p className="text-[11px]" style={{ color: '#5d5f5e' }}>
                    {product.variant}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#21201a' }}>
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section
          className="border-t border-b"
          style={{
            borderColor: '#cbc6bc',
            backgroundColor: '#f6f3ee',
          }}
        >
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-16">
            <p
              className="text-[11px] font-semibold tracking-widest uppercase mb-8"
              style={{ color: '#5d5f5e' }}
            >
              Shop by Category
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group relative overflow-hidden block aspect-[4/3]"
                >
                  {/* biome-ignore lint/performance/noImgElement: external CDN image */}
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-5"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(21,20,16,0.65) 0%, transparent 60%)',
                    }}
                  >
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-white/70 mb-1">
                      {cat.description}
                    </p>
                    <p className="text-lg font-semibold text-white flex items-center gap-1.5">
                      {cat.label}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Journal teaser */}
        <section>
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p
                className="text-[11px] font-semibold tracking-widest uppercase mb-4"
                style={{ color: '#5d5f5e' }}
              >
                Journal
              </p>
              <h2
                className="font-serif text-3xl md:text-4xl font-light leading-snug"
                style={{ color: '#21201a' }}
              >
                On restraint &<br />
                the objects we keep.
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-none h-auto py-3 px-6 text-[11px] font-semibold tracking-widest uppercase gap-2 shrink-0"
            >
              <Link href="/journal">
                Read more <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
