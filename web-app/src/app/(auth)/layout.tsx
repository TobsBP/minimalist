export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="store-root min-h-screen flex items-center justify-center p-6"
      style={{
        fontFamily: '"Inter Variable", Inter, sans-serif',
        backgroundColor: '#fcf9f4',
        color: '#1c1c19',
      }}
    >
      {children}
    </div>
  )
}
