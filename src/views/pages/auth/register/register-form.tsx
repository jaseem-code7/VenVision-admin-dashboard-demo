'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Building2,
  User,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlertCircle,
  EyeIcon,
  EyeOffIcon,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') === 'b2b' ? 'b2b' : 'b2c'

  const [regType, setRegType] = useState<'b2c' | 'b2b'>(initialType)

  // B2C Form State
  const [b2cStep, setB2cStep] = useState<'form' | 'otp' | 'success'>('form')
  const [b2cName, setB2cName] = useState('')
  const [b2cEmail, setB2cEmail] = useState('')
  const [b2cMobile, setB2cMobile] = useState('')
  const [b2cPassword, setB2cPassword] = useState('')
  const [b2cConfirmPassword, setB2cConfirmPassword] = useState('')
  const [b2cOtp, setB2cOtp] = useState(['', '', '', '', '', ''])
  const [showB2cPassword, setShowB2cPassword] = useState(false)

  // B2B Form State
  const [b2bStep, setB2bStep] = useState<'business' | 'owner' | 'otp' | 'submitted'>('business')
  const [b2bData, setB2bData] = useState({
    businessName: '',
    businessType: 'Jewellery Retailer',
    crNumber: '',
    crDocument: 'CR_Certificate_1010184920.pdf',
    licenceNumber: '',
    licenceDocument: 'Gold_Jewellery_License_2026.pdf',
    vatNumber: '',
    vatCertificate: 'ZATCA_VAT_Certificate.pdf',
    nationalAddress: '',
    businessAddress: '',
    businessEmail: '',
    businessMobile: '',
    website: '',
    shopDescription: '',
    businessLogo: 'alromizan_logo.png',
    shopPhotos: ['showroom_front.jpg', 'display_cases.jpg'],
    // Owner Info
    ownerFullName: '',
    ownerEmail: '',
    ownerMobile: '',
    ownerIdNumber: '',
    ownerIdDocument: 'National_ID_Scan.pdf'
  })
  const [b2bOtp, setB2bOtp] = useState(['', '', '', '', '', ''])

  // B2C Handlers
  const handleB2cSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!b2cEmail || !b2cMobile || !b2cName) {
      toast.error('Email and Mobile Number are mandatory for B2C registration.')
      return
    }
    if (b2cPassword !== b2cConfirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    toast.success('Verification OTP code sent to ' + b2cMobile, {
      description: 'Use test code: 123456'
    })
    setB2cStep('otp')
  }

  const handleVerifyB2cOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const entered = b2cOtp.join('')
    if (entered.length < 6) {
      toast.error('Please enter the 6-digit OTP code.')
      return
    }
    setB2cStep('success')
    toast.success('B2C Customer Account Activated!', {
      description: 'Welcome to VenVision Luxury Jewellery & Bullion.'
    })
    setTimeout(() => {
      router.push('/b2c/dashboard')
    }, 1500)
  }

  // B2B Handlers
  const handleB2bBusinessNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!b2bData.businessName || !b2bData.crNumber || !b2bData.businessEmail || !b2bData.businessMobile) {
      toast.error('Please fill in all mandatory business fields (Name, CR, Email, Mobile).')
      return
    }
    setB2bStep('owner')
  }

  const handleB2bOwnerNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!b2bData.ownerFullName || !b2bData.ownerIdNumber || !b2bData.ownerEmail || !b2bData.ownerMobile) {
      toast.error('Please provide complete owner verification information.')
      return
    }
    toast.success('Business verification code sent to ' + b2bData.businessMobile, {
      description: 'Use test code: 889922'
    })
    setB2bStep('otp')
  }

  const handleB2bOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entered = b2bOtp.join('')
    if (entered.length < 6) {
      toast.error('Please enter the 6-digit OTP code.')
      return
    }

    setB2bStep('submitted')
    toast.success('B2B Wholesale Application Submitted!', {
      description: 'Status: Pending Review by VenVision Compliance'
    })
  }

  return (
    <div className='space-y-5'>
      {/* Registration Type Selector */}
      <div className='grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl border border-border/80'>
        <button
          type='button'
          onClick={() => setRegType('b2c')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            regType === 'b2c'
              ? 'bg-background text-foreground font-semibold shadow-xs border border-border/60'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className='size-3.5 text-primary' />
          <span>B2C Retail Customer</span>
        </button>

        <button
          type='button'
          onClick={() => setRegType('b2b')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            regType === 'b2b'
              ? 'bg-background text-foreground font-semibold shadow-xs border border-border/60'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className='size-3.5 text-primary' />
          <span>B2B Wholesale Business</span>
        </button>
      </div>

      {/* ======================================================= */}
      {/* 1. B2C RETAIL CUSTOMER REGISTRATION                     */}
      {/* ======================================================= */}
      {regType === 'b2c' && (
        <div>
          {b2cStep === 'form' && (
            <form onSubmit={handleB2cSubmit} className='space-y-3.5'>
              <div className='bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-xs text-muted-foreground flex items-center gap-2'>
                <ShieldCheck className='size-4 text-primary shrink-0' />
                <span>
                  <strong>Email &amp; Mobile Number</strong> are mandatory for verified retail accounts.
                </span>
              </div>

              <div>
                <label className='text-xs font-medium text-foreground block mb-1'>Full Name*</label>
                <Input
                  type='text'
                  value={b2cName}
                  onChange={e => setB2cName(e.target.value)}
                  placeholder='e.g. Sarah Al-Otaibi'
                  className='h-9 text-xs'
                  required
                />
              </div>

              <div>
                <label className='text-xs font-medium text-foreground block mb-1'>Email Address* (Mandatory)</label>
                <Input
                  type='email'
                  value={b2cEmail}
                  onChange={e => setB2cEmail(e.target.value)}
                  placeholder='name@example.sa'
                  className='h-9 text-xs'
                  required
                />
              </div>

              <div>
                <label className='text-xs font-medium text-foreground block mb-1'>Mobile Number* (Mandatory, KSA)</label>
                <div className='flex gap-2'>
                  <div className='h-9 px-2.5 rounded-md border border-input bg-muted/40 text-xs font-mono flex items-center justify-center text-muted-foreground shrink-0'>
                    +966
                  </div>
                  <Input
                    type='tel'
                    value={b2cMobile}
                    onChange={e => setB2cMobile(e.target.value)}
                    placeholder='5XXXXXXXX'
                    className='h-9 text-xs font-mono'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='text-xs font-medium text-foreground block mb-1'>Password*</label>
                  <div className='relative'>
                    <Input
                      type={showB2cPassword ? 'text' : 'password'}
                      value={b2cPassword}
                      onChange={e => setB2cPassword(e.target.value)}
                      placeholder='••••••••'
                      className='h-9 text-xs pr-8'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowB2cPassword(!showB2cPassword)}
                      className='absolute right-2 top-2 text-muted-foreground hover:text-foreground'
                    >
                      {showB2cPassword ? <EyeOffIcon className='size-3.5' /> : <EyeIcon className='size-3.5' />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className='text-xs font-medium text-foreground block mb-1'>Confirm Password*</label>
                  <Input
                    type='password'
                    value={b2cConfirmPassword}
                    onChange={e => setB2cConfirmPassword(e.target.value)}
                    placeholder='••••••••'
                    className='h-9 text-xs'
                    required
                  />
                </div>
              </div>

              <div className='flex items-center gap-2 pt-1'>
                <Checkbox id='b2cTerms' defaultChecked />
                <label htmlFor='b2cTerms' className='text-xs text-muted-foreground cursor-pointer'>
                  I agree to VenVision Terms of Service &amp; Privacy Policy.
                </label>
              </div>

              <Button type='submit' className='w-full h-9 text-xs font-medium mt-2'>
                Send OTP Verification Code &rarr;
              </Button>
            </form>
          )}

          {b2cStep === 'otp' && (
            <form onSubmit={handleVerifyB2cOtp} className='space-y-4 py-2 text-center'>
              <div className='size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center'>
                <Phone className='size-6' />
              </div>
              <div>
                <h3 className='text-base font-semibold text-foreground'>Verify Your Mobile Number</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                  Enter the 6-digit OTP code sent to <strong>+966 {b2cMobile || '501234567'}</strong>
                </p>
              </div>

              {/* 6-box OTP input */}
              <div className='flex justify-center gap-2 py-2'>
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <input
                    key={idx}
                    type='text'
                    maxLength={1}
                    value={b2cOtp[idx]}
                    onChange={e => {
                      const val = e.target.value.slice(-1)
                      const next = [...b2cOtp]
                      next[idx] = val
                      setB2cOtp(next)
                      if (val && e.target.nextElementSibling) {
                        ;(e.target.nextElementSibling as HTMLInputElement).focus()
                      }
                    }}
                    className='size-10 text-center font-mono font-bold text-lg rounded-lg border border-border/80 bg-background focus:border-primary focus:outline-none'
                  />
                ))}
              </div>

              <div className='flex items-center justify-between text-xs px-2'>
                <button
                  type='button'
                  onClick={() => setB2cStep('form')}
                  className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1'
                >
                  <ArrowLeft className='size-3' /> Back
                </button>
                <button
                  type='button'
                  onClick={() => toast.info('New OTP code sent: 123456')}
                  className='text-primary hover:underline'
                >
                  Resend Code
                </button>
              </div>

              <Button type='submit' className='w-full h-9 text-xs font-medium'>
                Verify &amp; Create Retail Account
              </Button>
            </form>
          )}

          {b2cStep === 'success' && (
            <div className='py-6 text-center space-y-3'>
              <div className='size-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center'>
                <CheckCircle2 className='size-6' />
              </div>
              <h3 className='text-base font-bold text-foreground'>Registration Successful!</h3>
              <p className='text-xs text-muted-foreground'>
                Your B2C customer profile is verified and active. Redirecting to your customer dashboard...
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================= */}
      {/* 2. B2B WHOLESALE BUSINESS REGISTRATION                  */}
      {/* ======================================================= */}
      {regType === 'b2b' && (
        <div>
          {/* Progress / Step Indicator */}
          {b2bStep !== 'submitted' && (
            <div className='flex items-center justify-between pb-3 border-b border-border/60 text-xs mb-3 font-medium'>
              <span className={b2bStep === 'business' ? 'text-primary font-bold' : 'text-muted-foreground'}>
                1. Business Info
              </span>
              <span>&rarr;</span>
              <span className={b2bStep === 'owner' ? 'text-primary font-bold' : 'text-muted-foreground'}>
                2. Owner Verification
              </span>
              <span>&rarr;</span>
              <span className={b2bStep === 'otp' ? 'text-primary font-bold' : 'text-muted-foreground'}>
                3. OTP Submit
              </span>
            </div>
          )}

          {/* STEP 1: BUSINESS INFORMATION */}
          {b2bStep === 'business' && (
            <form onSubmit={handleB2bBusinessNext} className='space-y-3 text-xs'>
              <div className='bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2'>
                <Clock className='size-4 shrink-0 mt-0.5' />
                <span>
                  <strong>Admin Approval Required:</strong> B2B applications are submitted as <em>Pending Review</em> and require manual verification of CR, Licence &amp; VAT before wholesale pricing is unlocked.
                </span>
              </div>

              {/* Business Name & Type */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Business / Shop Name*</label>
                  <Input
                    type='text'
                    value={b2bData.businessName}
                    onChange={e => setB2bData({ ...b2bData, businessName: e.target.value })}
                    placeholder='e.g. Al-Romizan Gold &amp; Jewellery'
                    className='h-8 text-xs'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Business Type*</label>
                  <select
                    value={b2bData.businessType}
                    onChange={e => setB2bData({ ...b2bData, businessType: e.target.value })}
                    className='h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none'
                  >
                    <option value='Jewellery Retailer'>Jewellery Retailer</option>
                    <option value='Wholesaler'>Wholesaler</option>
                    <option value='Manufacturer'>Manufacturer / Casting Workshop</option>
                    <option value='Bullion Trader'>Bullion &amp; Scrap Gold Trader</option>
                  </select>
                </div>
              </div>

              {/* CR & CR Document */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Commercial Registration (CR)*</label>
                  <Input
                    type='text'
                    value={b2bData.crNumber}
                    onChange={e => setB2bData({ ...b2bData, crNumber: e.target.value })}
                    placeholder='10-digit CR (e.g. 1010184920)'
                    className='h-8 text-xs font-mono'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>CR Document Upload*</label>
                  <div className='flex items-center gap-1.5 h-8 px-2 rounded-md border border-dashed border-border/80 bg-muted/20 text-muted-foreground'>
                    <Upload className='size-3 text-primary shrink-0' />
                    <span className='truncate text-[11px]'>{b2bData.crDocument}</span>
                  </div>
                </div>
              </div>

              {/* Licence & Licence Document */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Business Licence Number*</label>
                  <Input
                    type='text'
                    value={b2bData.licenceNumber}
                    onChange={e => setB2bData({ ...b2bData, licenceNumber: e.target.value })}
                    placeholder='MOC-JEW-882910'
                    className='h-8 text-xs font-mono'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Licence Document Upload*</label>
                  <div className='flex items-center gap-1.5 h-8 px-2 rounded-md border border-dashed border-border/80 bg-muted/20 text-muted-foreground'>
                    <Upload className='size-3 text-primary shrink-0' />
                    <span className='truncate text-[11px]'>{b2bData.licenceDocument}</span>
                  </div>
                </div>
              </div>

              {/* VAT & VAT Certificate */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>VAT Number*</label>
                  <Input
                    type='text'
                    value={b2bData.vatNumber}
                    onChange={e => setB2bData({ ...b2bData, vatNumber: e.target.value })}
                    placeholder='15-digit ZATCA VAT (3XXXXXXXXXXXXX3)'
                    className='h-8 text-xs font-mono'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>VAT Certificate Upload</label>
                  <div className='flex items-center gap-1.5 h-8 px-2 rounded-md border border-dashed border-border/80 bg-muted/20 text-muted-foreground'>
                    <Upload className='size-3 text-primary shrink-0' />
                    <span className='truncate text-[11px]'>{b2bData.vatCertificate}</span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>National Address*</label>
                  <Input
                    type='text'
                    value={b2bData.nationalAddress}
                    onChange={e => setB2bData({ ...b2bData, nationalAddress: e.target.value })}
                    placeholder='Building 4210, Al-Olaya, Riyadh 12211'
                    className='h-8 text-xs'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Shop / Business Address*</label>
                  <Input
                    type='text'
                    value={b2bData.businessAddress}
                    onChange={e => setB2bData({ ...b2bData, businessAddress: e.target.value })}
                    placeholder='Gold Market St., Souq Taiba, Riyadh'
                    className='h-8 text-xs'
                    required
                  />
                </div>
              </div>

              {/* Email & Mobile */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Business Email*</label>
                  <Input
                    type='email'
                    value={b2bData.businessEmail}
                    onChange={e => setB2bData({ ...b2bData, businessEmail: e.target.value })}
                    placeholder='trade@company.com.sa'
                    className='h-8 text-xs'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Business Mobile Number*</label>
                  <Input
                    type='tel'
                    value={b2bData.businessMobile}
                    onChange={e => setB2bData({ ...b2bData, businessMobile: e.target.value })}
                    placeholder='+966 50 123 4567'
                    className='h-8 text-xs font-mono'
                    required
                  />
                </div>
              </div>

              {/* Website (Optional) & Description */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Website (Optional)</label>
                  <Input
                    type='url'
                    value={b2bData.website}
                    onChange={e => setB2bData({ ...b2bData, website: e.target.value })}
                    placeholder='https://company.sa'
                    className='h-8 text-xs'
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Business / Shop Description</label>
                  <Input
                    type='text'
                    value={b2bData.shopDescription}
                    onChange={e => setB2bData({ ...b2bData, shopDescription: e.target.value })}
                    placeholder='Retail boutique established 1998 specializing in 21K/22K jewellery'
                    className='h-8 text-xs'
                  />
                </div>
              </div>

              {/* Business Logo & Shop Photos */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Business Logo Upload</label>
                  <div className='flex items-center gap-1.5 h-8 px-2 rounded-md border border-dashed border-border/80 bg-muted/20 text-muted-foreground'>
                    <Upload className='size-3 text-primary shrink-0' />
                    <span className='truncate text-[11px]'>{b2bData.businessLogo}</span>
                  </div>
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Shop Photo Uploads</label>
                  <div className='flex items-center gap-1.5 h-8 px-2 rounded-md border border-dashed border-border/80 bg-muted/20 text-muted-foreground'>
                    <Upload className='size-3 text-primary shrink-0' />
                    <span className='truncate text-[11px]'>{b2bData.shopPhotos.join(', ')}</span>
                  </div>
                </div>
              </div>

              <Button type='submit' className='w-full h-9 text-xs font-medium mt-3'>
                Next: Owner Information &rarr;
              </Button>
            </form>
          )}

          {/* STEP 2: OWNER INFORMATION */}
          {b2bStep === 'owner' && (
            <form onSubmit={handleB2bOwnerNext} className='space-y-3.5 text-xs'>
              <div className='bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-xs text-muted-foreground flex items-center gap-2'>
                <User className='size-4 text-primary shrink-0' />
                <span>
                  <strong>Owner / Authorized Signatory Details:</strong> Mandatory for regulatory and credit compliance.
                </span>
              </div>

              <div>
                <label className='font-medium text-foreground block mb-1'>Owner Full Name*</label>
                <Input
                  type='text'
                  value={b2bData.ownerFullName}
                  onChange={e => setB2bData({ ...b2bData, ownerFullName: e.target.value })}
                  placeholder='e.g. Tariq Mansoor Al-Romizan'
                  className='h-9 text-xs'
                  required
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Owner Email*</label>
                  <Input
                    type='email'
                    value={b2bData.ownerEmail}
                    onChange={e => setB2bData({ ...b2bData, ownerEmail: e.target.value })}
                    placeholder='owner@company.sa'
                    className='h-9 text-xs'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Owner Mobile Number*</label>
                  <Input
                    type='tel'
                    value={b2bData.ownerMobile}
                    onChange={e => setB2bData({ ...b2bData, ownerMobile: e.target.value })}
                    placeholder='+966 55 987 6543'
                    className='h-9 text-xs font-mono'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Owner Identity Card / ID Number*</label>
                  <Input
                    type='text'
                    value={b2bData.ownerIdNumber}
                    onChange={e => setB2bData({ ...b2bData, ownerIdNumber: e.target.value })}
                    placeholder='National ID / Iqama (10 digits)'
                    className='h-9 text-xs font-mono'
                    required
                  />
                </div>
                <div>
                  <label className='font-medium text-foreground block mb-1'>Owner Identity Document Upload*</label>
                  <div className='flex items-center gap-1.5 h-9 px-2 rounded-md border border-dashed border-border/80 bg-muted/20 text-muted-foreground'>
                    <Upload className='size-3.5 text-primary shrink-0' />
                    <span className='truncate text-[11px]'>{b2bData.ownerIdDocument}</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setB2bStep('business')}
                  className='h-9 text-xs'
                >
                  <ArrowLeft className='size-3 mr-1' /> Back to Business Info
                </Button>
                <Button type='submit' className='h-9 text-xs font-medium'>
                  Proceed to OTP Verification &rarr;
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {b2bStep === 'otp' && (
            <form onSubmit={handleB2bOtpSubmit} className='space-y-4 py-2 text-center'>
              <div className='size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center'>
                <Phone className='size-6' />
              </div>
              <div>
                <h3 className='text-base font-semibold text-foreground'>Verify Authorized Mobile</h3>
                <p className='text-xs text-muted-foreground mt-1'>
                  Enter the 6-digit verification code sent to <strong>{b2bData.businessMobile || '+966 50 123 4567'}</strong>
                </p>
              </div>

              <div className='flex justify-center gap-2 py-2'>
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <input
                    key={idx}
                    type='text'
                    maxLength={1}
                    value={b2bOtp[idx]}
                    onChange={e => {
                      const val = e.target.value.slice(-1)
                      const next = [...b2bOtp]
                      next[idx] = val
                      setB2bOtp(next)
                      if (val && e.target.nextElementSibling) {
                        ;(e.target.nextElementSibling as HTMLInputElement).focus()
                      }
                    }}
                    className='size-10 text-center font-mono font-bold text-lg rounded-lg border border-border/80 bg-background focus:border-primary focus:outline-none'
                  />
                ))}
              </div>

              <div className='flex items-center justify-between text-xs px-2'>
                <button
                  type='button'
                  onClick={() => setB2bStep('owner')}
                  className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1'
                >
                  <ArrowLeft className='size-3' /> Back
                </button>
                <button
                  type='button'
                  onClick={() => toast.info('New OTP code sent: 889922')}
                  className='text-primary hover:underline'
                >
                  Resend Code
                </button>
              </div>

              <Button type='submit' className='w-full h-9 text-xs font-medium'>
                Submit Application for Admin Review &rarr;
              </Button>
            </form>
          )}

          {/* STEP 4: SUBMITTED (PENDING REVIEW) */}
          {b2bStep === 'submitted' && (
            <div className='py-6 text-center space-y-4'>
              <div className='size-14 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30'>
                <Clock className='size-7' />
              </div>
              <div className='space-y-1.5'>
                <Badge className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs px-3 py-1'>
                  Application Status: Pending Review
                </Badge>
                <h3 className='text-lg font-bold text-foreground pt-1'>
                  B2B Application Submitted
                </h3>
                <p className='text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed'>
                  Your business registration for <strong>{b2bData.businessName || 'Your Company'}</strong> is under review by VenVision Compliance. Wholesale catalog and pricing will be activated once your CR &amp; VAT are approved by Admin.
                </p>
              </div>

              <div className='p-3 bg-muted/40 rounded-xl border border-border/60 text-xs text-left max-w-sm mx-auto space-y-1.5 text-muted-foreground'>
                <div className='flex justify-between'>
                  <span>Reference ID:</span>
                  <span className='font-mono font-semibold text-foreground'>B2B-APP-2026-089</span>
                </div>
                <div className='flex justify-between'>
                  <span>Notification Channels:</span>
                  <span className='text-foreground font-medium'>Email &bull; WhatsApp</span>
                </div>
                <div className='flex justify-between'>
                  <span>Expected SLA:</span>
                  <span className='text-foreground font-medium'>1–2 Business Days</span>
                </div>
              </div>

              <div className='pt-2'>
                <Button
                  onClick={() => router.push('/pages/auth/login')}
                  className='h-9 px-6 text-xs font-medium'
                >
                  Return to Common Login
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
