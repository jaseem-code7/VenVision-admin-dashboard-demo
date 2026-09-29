'use client'

// React Import
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Third-party Imports
import { EyeIcon, EyeOffIcon, ShieldCheck, Building2, User } from 'lucide-react'
import { toast } from 'sonner'

// Components Import
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

type UserRole = 'b2c' | 'b2b' | 'admin'

const LoginForm = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [role, setRole] = useState<UserRole>('admin')
  const [email, setEmail] = useState('admin@venvision.com')
  const [password, setPassword] = useState('password123')

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole)
    if (selectedRole === 'b2c') {
      setEmail('sarah.alotaibi@gmail.com')
      setPassword('customerPass123')
    } else if (selectedRole === 'b2b') {
      setEmail('procurement@alromizan.com.sa')
      setPassword('wholesalePass123')
    } else {
      setEmail('admin@venvision.com')
      setPassword('adminPass123')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email or mobile number')
      return
    }

    if (role === 'b2b') {
      toast.success('Signed in as Approved B2B Wholesale Partner', {
        description: 'Al-Romizan Gold & Jewellery (CR: 1010184920)'
      })
      router.push('/b2b/dashboard')
    } else if (role === 'b2c') {
      toast.success('Signed in as Retail Customer', {
        description: 'Welcome back, Sarah Al-Otaibi'
      })
      router.push('/b2c/dashboard')
    } else {
      toast.success('Signed in as VenVision Administrator')
      router.push('/overview')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Account Type Selector for Common Login */}
      <div>
        <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
          Sign in as:
        </label>
        <div className='grid grid-cols-3 gap-2'>
          <button
            type='button'
            onClick={() => handleRoleSelect('b2c')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${
              role === 'b2c'
                ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-2xs'
                : 'border-border/80 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <User className='size-4 mb-1 text-primary' />
            <span>Retail (B2C)</span>
          </button>
          <button
            type='button'
            onClick={() => handleRoleSelect('b2b')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${
              role === 'b2b'
                ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-2xs'
                : 'border-border/80 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <Building2 className='size-4 mb-1 text-primary' />
            <span>Wholesale (B2B)</span>
          </button>
          <button
            type='button'
            onClick={() => handleRoleSelect('admin')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${
              role === 'admin'
                ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-2xs'
                : 'border-border/80 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <ShieldCheck className='size-4 mb-1 text-primary' />
            <span>Store Admin</span>
          </button>
        </div>
      </div>

      <FieldGroup className='gap-4'>
        {/* Email or Phone */}
        <Field className='gap-1.5'>
          <FieldLabel htmlFor='userEmail' className='text-xs font-medium text-foreground'>
            {role === 'b2b' ? 'Corporate Email or Mobile*' : 'Email or Mobile Number*'}
          </FieldLabel>
          <Input
            type='text'
            id='userEmail'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={role === 'b2b' ? 'corp@company.sa' : 'customer@mail.sa or 05XXXXXXXX'}
            className='h-10 text-xs'
          />
        </Field>

        {/* Password */}
        <Field className='w-full gap-1.5'>
          <FieldLabel htmlFor='password' className='text-xs font-medium text-foreground'>
            Password*
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id='password'
              type={isVisible ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='••••••••••••••••'
              className='h-10 text-xs'
            />
            <InputGroupAddon align='inline-end' className='pr-1.5'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setIsVisible(prevState => !prevState)}
                className='text-muted-foreground rounded-l-none hover:bg-transparent size-8'
              >
                {isVisible ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
                <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        {/* Remember Me and Forgot Password */}
        <div className='flex items-center justify-between gap-y-2 text-xs'>
          <Field orientation='horizontal' className='flex items-center gap-2'>
            <Checkbox id='rememberMe' defaultChecked />
            <FieldLabel htmlFor='rememberMe' className='text-muted-foreground cursor-pointer'>
              Remember session
            </FieldLabel>
          </Field>
          <Link href='/pages/auth/forgot-password' className='text-muted-foreground hover:text-foreground hover:underline'>
            Forgot Password?
          </Link>
        </div>

        <Field>
          <Button className='w-full h-10 text-xs font-medium' type='submit'>
            Sign in to VenVision
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
