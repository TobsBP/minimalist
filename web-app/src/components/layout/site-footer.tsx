import Link from 'next/link'

const links = ['Privacy', 'Terms', 'Shipping', 'Contact']

export function SiteFooter() {
  return (
    <footer
      className="w-full mt-auto border-t"
      style={{ backgroundColor: '#f6f3ee', borderColor: '#cbc6bc', color: '#5d5f5e' }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-10 max-w-[1280px] mx-auto gap-4">
        <span className="text-2xl font-bold" style={{ color: '#21201a' }}>
          MINIMALIST
        </span>
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-semibold tracking-widest uppercase">
          {links.map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              className="transition-opacity hover:opacity-60"
            >
              {label}
            </Link>
          ))}
        </div>
        <span className="text-[11px] font-semibold tracking-widest uppercase text-center">
          © 2024 Minimalist Store. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
