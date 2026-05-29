export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="store-root"
      style={{ fontFamily: '"Inter Variable", Inter, sans-serif' }}
    >
      {children}
    </div>
  )
}
