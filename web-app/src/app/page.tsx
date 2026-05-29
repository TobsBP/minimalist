import { ArrowRight, Layers, Palette, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Layers,
    title: 'Structured by default',
    description:
      'App Router, shadcn/ui, and Tailwind v4 wired together so the scaffold never fights the work.',
  },
  {
    icon: Zap,
    title: 'Zero ceremony',
    description:
      'No boilerplate generators, no magic CLIs. Everything is readable source — extend it directly.',
  },
  {
    icon: Palette,
    title: 'Design-system ready',
    description:
      'CSS-variable theming, warm editorial typography, and a grain texture you can turn off in one line.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-8 py-6 border-b border-border animate-fade-in"
        style={{ animationDelay: '0ms' }}
      >
        <span className="font-serif text-xl font-medium tracking-tight">minimalist.</span>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </a>
          <a href="/components" className="hover:text-foreground transition-colors">
            Components
          </a>
          <Button size="sm" variant="outline">
            GitHub
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-8 pt-24 pb-20">
          <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
            <Badge
              variant="outline"
              className="mb-8 text-[11px] tracking-widest uppercase"
            >
              Now in beta
            </Badge>
          </div>

          <h1
            className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.08] font-light tracking-tight text-foreground mb-6 animate-fade-up"
            style={{ animationDelay: '160ms' }}
          >
            Think less.
            <br />
            <em className="font-light" style={{ color: 'var(--amber)' }}>
              Build more.
            </em>
          </h1>

          <p
            className="text-muted-foreground text-lg font-light leading-relaxed max-w-xl mb-10 animate-fade-up"
            style={{ animationDelay: '240ms' }}
          >
            A focused Next.js starter with shadcn/ui, Tailwind v4, and a design system
            that gets out of your way.
          </p>

          <div
            className="flex items-center gap-3 animate-fade-up"
            style={{ animationDelay: '320ms' }}
          >
            <Button size="lg" className="gap-2">
              Get started <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              View components
            </Button>
          </div>
        </section>

        {/* Divider */}
        <div
          className="max-w-4xl mx-auto px-8 animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          <div className="h-px bg-border" />
        </div>

        {/* Features */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="animate-fade-up"
                style={{ animationDelay: `${460 + i * 80}ms` }}
              >
                <div
                  className="size-9 rounded-md flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                >
                  <feature.icon className="size-4 text-foreground" />
                </div>
                <h3 className="font-medium text-sm text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Component showcase */}
        <div
          className="max-w-4xl mx-auto px-8 animate-fade-in"
          style={{ animationDelay: '700ms' }}
        >
          <div className="h-px bg-border" />
        </div>

        <section
          className="max-w-4xl mx-auto px-8 py-20 animate-fade-up"
          style={{ animationDelay: '760ms' }}
        >
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-8">
            Design tokens
          </p>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-border px-8 py-6 animate-fade-in"
        style={{ animationDelay: '900ms' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-serif text-sm">minimalist.</span>
          <span>Next.js 16 · shadcn/ui · Tailwind v4</span>
        </div>
      </footer>
    </div>
  )
}
