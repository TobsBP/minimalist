'use client'

import { CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useAuth } from '@/modules/auth/hooks/use-auth'

/** Format a Date as a local YYYY-MM-DD string (no timezone shift) for the backend LocalDate. */
function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const TODAY = new Date()

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

const FIELD_CLASS = 'rounded-none h-auto px-4 py-3'
const LABEL_CLASS = 'text-[11px] font-semibold tracking-widest uppercase text-foreground'

export default function SignupPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [cpf, setCpf] = useState('')
  const [dob, setDob] = useState<Date | undefined>(undefined)
  const [dobOpen, setDobOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [nationality, setNationality] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const mismatch = confirm.length > 0 && password !== confirm
  const canSubmit = !mismatch && password.length > 0 && confirm.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setSubmitting(true)
    try {
      await register({
        name,
        email,
        password,
        role: 'CUSTOMER',
        cpf: cpf.replace(/\D/g, ''),
        dateOfBirth: dob ? toISODate(dob) : '',
        phone,
        address,
        nationality,
      })
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="w-full max-w-[400px] flex flex-col gap-10 py-10">
      <header className="flex flex-col gap-2 items-center text-center">
        <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="text-base text-muted-foreground">
          Join us today. Please enter your details.
        </p>
      </header>

      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Full name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className={LABEL_CLASS}>
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className={LABEL_CLASS}>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className={LABEL_CLASS}>
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm" className={LABEL_CLASS}>
              Confirm Password
            </Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={mismatch}
              className={FIELD_CLASS}
            />
            {mismatch && (
              <p className="text-[11px] font-medium text-destructive">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* CPF */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cpf" className={LABEL_CLASS}>
              CPF
            </Label>
            <Input
              id="cpf"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              required
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          {/* Date of birth */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="dateOfBirth" className={LABEL_CLASS}>
              Date of Birth
            </Label>
            <Popover open={dobOpen} onOpenChange={setDobOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dateOfBirth"
                  type="button"
                  variant="outline"
                  className={cn(
                    FIELD_CLASS,
                    'w-full justify-between font-normal',
                    !dob && 'text-muted-foreground',
                  )}
                >
                  {dob
                    ? dob.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Select your date of birth'}
                  <CalendarIcon className="size-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={(date) => {
                    setDob(date)
                    setDobOpen(false)
                  }}
                  captionLayout="dropdown"
                  hideNavigation
                  defaultMonth={dob ?? new Date(2000, 0)}
                  startMonth={new Date(1920, 0)}
                  endMonth={TODAY}
                  disabled={{ after: TODAY }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className={LABEL_CLASS}>
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+55 11 99999-9999"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="address" className={LABEL_CLASS}>
              Address
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Street, number, city"
              required
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          {/* Nationality */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="nationality" className={LABEL_CLASS}>
              Nationality
            </Label>
            <Input
              id="nationality"
              name="nationality"
              type="text"
              placeholder="Brazilian"
              required
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
        </div>

        {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}

        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full rounded-none h-auto py-3 text-base"
          >
            {submitting ? 'Creating account…' : 'Sign Up'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-none h-auto py-3 text-base gap-2"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </div>
      </form>

      <div className="text-center pt-4 border-t border-border">
        <p className="text-base text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="underline font-semibold text-foreground transition-opacity hover:opacity-60"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
