// Next Imports
import Link from 'next/link'

// Components Import
import Logo from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import LoginForm from '@/views/pages/auth/login/login-form'

// SVG Import
import AuthBackgroundShape from '@/assets/svg/auth-background-shape'

const Login = () => {
  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>

      <Card className='z-1 w-full gap-6 py-6 sm:max-w-lg'>
        <CardHeader className='gap-4 px-6'>
          <Link href='/'>
            <Logo className='gap-3' />
          </Link>

          <div>
            <CardTitle className='mb-1.5 text-2xl font-bold text-foreground'>
              Sign in to VenVision
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
              Common access portal for B2C retail customers, approved B2B wholesale partners, and store administration.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='px-6 space-y-5'>
          {/* Common Login Form */}
          <LoginForm />

          <div className='flex items-center gap-3 pt-2'>
            <Separator className='flex-1' />
            <p className='text-xs uppercase tracking-wider text-muted-foreground'>New to VenVision?</p>
            <Separator className='flex-1' />
          </div>

          {/* Distinct Registration Pathways */}
          <div className='grid gap-2.5 pt-1'>
            <Button
              variant='outline'
              className='w-full justify-between h-auto py-2.5 px-3.5 text-left border-border/80 hover:bg-muted/40'
              render={<Link href='/pages/auth/register?type=b2c' />}
              nativeButton={false}
            >
              <div>
                <div className='text-xs font-semibold text-foreground'>Create B2C Customer Account</div>
                <div className='text-[11px] text-muted-foreground'>Instant registration with Email &amp; Mobile OTP verification</div>
              </div>
              <span className='text-xs font-semibold text-primary ml-2'>&rarr;</span>
            </Button>

            <Button
              variant='outline'
              className='w-full justify-between h-auto py-2.5 px-3.5 text-left border-border/80 hover:bg-muted/40'
              render={<Link href='/pages/auth/register?type=b2b' />}
              nativeButton={false}
            >
              <div>
                <div className='text-xs font-semibold text-foreground'>Apply for B2B Wholesale Account</div>
                <div className='text-[11px] text-muted-foreground'>Business verification (CR, VAT &amp; Licence) &bull; Requires Admin Approval</div>
              </div>
              <span className='text-xs font-semibold text-primary ml-2'>&rarr;</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

