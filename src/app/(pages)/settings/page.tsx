'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Settings as SettingsIcon,
  Store,
  Receipt,
  Truck,
  CreditCard,
  Languages,
  UserCheck,
  Save,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  Building,
  Key,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type SettingsTab =
  | 'general'
  | 'store'
  | 'tax'
  | 'shipping'
  | 'payments'
  | 'languages'
  | 'profile'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  // General Settings
  const [general, setGeneral] = useState({
    storeName: 'VenVision Luxury Jewellery & Bullion',
    contactEmail: 'contact@venvision.com',
    contactPhone: '+966 11 482 9900',
    currency: 'SAR (Saudi Riyal)',
    country: 'Saudi Arabia'
  })

  // Store Information
  const [storeInfo, setStoreInfo] = useState({
    crNumber: '1010849201',
    commercialLicense: 'MOC-JEW-882910',
    headquarters: 'King Fahd Road, Al-Olaya District, Riyadh, Saudi Arabia',
    postalCode: '12211',
    supportWorkingHours: '09:00 AM - 10:00 PM AST'
  })

  // VAT & Tax
  const [tax, setTax] = useState({
    vatPercentage: 15,
    zatcaRegistrationNumber: '310492810400003',
    bullionVatExempt: true,
    zatcaPhase2Integration: 'Connected & Compliant'
  })

  // Shipping
  const [shipping, setShipping] = useState({
    standardDeliveryActive: true,
    standardFee: 35.0,
    standardDays: '2–3 Business Days',
    expressDeliveryActive: true,
    expressFee: 75.0,
    expressHours: 'Same-Day (Riyadh) / Next-Day (KSA)',
    storePickupActive: true,
    pickupLocation: 'Flagship Showroom, Centria Mall, Riyadh'
  })

  // Payments Gateways
  const [payments, setPayments] = useState({
    madaActive: true,
    applePayActive: true,
    creditCardActive: true,
    corporateWireActive: true,
    goldClearingActive: true,
    gatewayProvider: 'Moyasar / Saudi National Bank (SNB)'
  })

  // Languages
  const [languages, setLanguages] = useState({
    defaultLanguage: 'English',
    enableEnglish: true,
    enableArabic: true,
    arabicRtlSupport: true
  })

  // Admin Profile
  const [profile, setProfile] = useState({
    fullName: 'Admin User',
    email: 'admin@venvision.com',
    role: 'Super Administrator & Treasury Controller',
    twoFactorEnabled: true
  })

  const handleSave = (sectionName: string) => {
    toast.success(`${sectionName} saved successfully!`)
  }

  return (
    <div className='space-y-6 pb-16'>
      {/* Header & Breadcrumb */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>Settings</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Settings
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Manage store preferences, regional tax compliance, delivery carriers, and gateway integrations.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            onClick={() => handleSave('All Configuration Settings')}
            className='h-9 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs font-medium'
          >
            <Save className='size-3.5' />
            Save Changes
          </Button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: Left-Side Settings Navigation + Right Content */}
      <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
        {/* LEFT-SIDE NAVIGATION (3 cols) */}
        <div className='md:col-span-3 space-y-1'>
          <div className='rounded-xl border border-border/70 bg-card p-2 shadow-sm space-y-1'>
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'general'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <SettingsIcon className='size-4 shrink-0' />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'store'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <Store className='size-4 shrink-0' />
              <span>Store Information</span>
            </button>

            <button
              onClick={() => setActiveTab('tax')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'tax'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <Receipt className='size-4 shrink-0' />
              <span>VAT & Tax</span>
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'shipping'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <Truck className='size-4 shrink-0' />
              <span>Delivery</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'payments'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <CreditCard className='size-4 shrink-0' />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setActiveTab('languages')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'languages'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <Languages className='size-4 shrink-0' />
              <span>Languages</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'profile'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <UserCheck className='size-4 shrink-0' />
              <span>Admin Profile</span>
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT SECTION (9 cols) */}
        <div className='md:col-span-9'>
          {/* 1. GENERAL */}
          {activeTab === 'general' && (
            <div className='rounded-xl border border-border/70 bg-card p-6 space-y-6 shadow-sm'>
              <div className='border-b border-border/60 pb-3'>
                <h2 className='text-base font-semibold text-foreground'>General Settings</h2>
                <p className='text-xs text-muted-foreground'>Configure basic store identity and primary operating currency.</p>
              </div>

              <div className='space-y-4 text-xs max-w-xl'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Store Name</Label>
                  <Input
                    value={general.storeName}
                    onChange={e => setGeneral({ ...general, storeName: e.target.value })}
                    className='h-8 text-xs'
                  />
                  <p className='text-[10px] text-muted-foreground'>The legal and public branding name shown across receipts and invoices.</p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Contact Email</Label>
                    <Input
                      value={general.contactEmail}
                      onChange={e => setGeneral({ ...general, contactEmail: e.target.value })}
                      className='h-8 text-xs'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Contact Phone</Label>
                    <Input
                      value={general.contactPhone}
                      onChange={e => setGeneral({ ...general, contactPhone: e.target.value })}
                      className='h-8 text-xs font-mono'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Base Currency</Label>
                    <Input
                      disabled
                      value={general.currency}
                      className='h-8 text-xs bg-muted/30 font-medium'
                    />
                    <p className='text-[10px] text-muted-foreground'>Fixed to SAR for Saudi bullion compliance.</p>
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Country of Domicile</Label>
                    <Input
                      disabled
                      value={general.country}
                      className='h-8 text-xs bg-muted/30 font-medium'
                    />
                  </div>
                </div>

                <div className='pt-2'>
                  <Button
                    onClick={() => handleSave('Tab Settings')}
                    className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
                  >
                    Save General Settings
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 2. STORE INFORMATION */}
          {activeTab === 'store' && (
            <div className='rounded-xl border border-border/70 bg-card p-6 space-y-6 shadow-sm'>
              <div className='border-b border-border/60 pb-3'>
                <h2 className='text-base font-semibold text-foreground'>Store Information</h2>
                <p className='text-xs text-muted-foreground'>Commercial registration and physical showroom headquarters.</p>
              </div>

              <div className='space-y-4 text-xs max-w-xl'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Commercial Registration (CR) Number</Label>
                    <Input
                      value={storeInfo.crNumber}
                      onChange={e => setStoreInfo({ ...storeInfo, crNumber: e.target.value })}
                      className='h-8 text-xs font-mono'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Jewellery Trade License</Label>
                    <Input
                      value={storeInfo.commercialLicense}
                      onChange={e => setStoreInfo({ ...storeInfo, commercialLicense: e.target.value })}
                      className='h-8 text-xs font-mono'
                    />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Headquarters Physical Address</Label>
                  <Input
                    value={storeInfo.headquarters}
                    onChange={e => setStoreInfo({ ...storeInfo, headquarters: e.target.value })}
                    className='h-8 text-xs'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Postal / National Address Code</Label>
                    <Input
                      value={storeInfo.postalCode}
                      onChange={e => setStoreInfo({ ...storeInfo, postalCode: e.target.value })}
                      className='h-8 text-xs font-mono'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>Customer Support Working Hours</Label>
                    <Input
                      value={storeInfo.supportWorkingHours}
                      onChange={e => setStoreInfo({ ...storeInfo, supportWorkingHours: e.target.value })}
                      className='h-8 text-xs'
                    />
                  </div>
                </div>

                <div className='pt-2'>
                  <Button
                    onClick={() => handleSave('Store Information')}
                    className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
                  >
                    Save Store Information
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 3. VAT & TAX */}
          {activeTab === 'tax' && (
            <div className='rounded-xl border border-border/70 bg-card p-6 space-y-6 shadow-sm'>
              <div className='border-b border-border/60 pb-3'>
                <h2 className='text-base font-semibold text-foreground'>VAT & Tax Compliance</h2>
                <p className='text-xs text-muted-foreground'>ZATCA electronic tax invoicing and bullion exemption rules.</p>
              </div>

              <div className='space-y-4 text-xs max-w-xl'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Standard VAT Rate (%)</Label>
                  <div className='relative w-32'>
                    <Input
                      type='number'
                      value={tax.vatPercentage}
                      onChange={e => setTax({ ...tax, vatPercentage: parseFloat(e.target.value) || 0 })}
                      className='h-8 text-xs pr-7 font-mono'
                    />
                    <span className='absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground'>%</span>
                  </div>
                  <p className='text-[10px] text-muted-foreground'>Standard 15% VAT applicable on retail jewellery and making charges.</p>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>ZATCA Tax Identification Number (TRN)</Label>
                  <Input
                    value={tax.zatcaRegistrationNumber}
                    onChange={e => setTax({ ...tax, zatcaRegistrationNumber: e.target.value })}
                    className='h-8 text-xs font-mono'
                  />
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-semibold text-foreground'>Investment Bullion VAT Exemption</span>
                    <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                      Active (0% VAT)
                    </Badge>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    In accordance with Saudi tax regulation, 99% pure investment gold bars and minted bullion are taxed at 0% VAT.
                  </p>
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-semibold text-foreground'>ZATCA Phase-2 Integration Status</span>
                    <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                      Live & Certified
                    </Badge>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    Cryptographic stamps, XML invoice generation, and QR compliance active.
                  </p>
                </div>

                <div className='pt-2'>
                  <Button
                    onClick={() => handleSave('VAT & Tax Rules')}
                    className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
                  >
                    Save Tax Configuration
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 4. SHIPPING */}
          {activeTab === 'shipping' && (
            <div className='rounded-xl border border-border/70 bg-card p-6 space-y-6 shadow-sm'>
              <div className='border-b border-border/60 pb-3'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-base font-semibold text-foreground'>Delivery Methods</h2>
                  <span className='px-2 py-0.5 rounded-full text-[10px] font-medium border border-primary/30 bg-primary/10 text-primary'>
                    Saudi Arabia Only
                  </span>
                </div>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Insured bullion logistics, express couriers, and boutique showroom pickup across the Kingdom of Saudi Arabia.
                </p>
              </div>

              <div className='space-y-4 text-xs max-w-xl'>
                {/* Standard Delivery */}
                <div className='rounded-lg border border-border/70 bg-background/50 p-4 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-semibold text-foreground text-sm'>Standard Delivery (Aramex / SMSA)</span>
                    <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                      Enabled
                    </Badge>
                  </div>
                  <div className='grid grid-cols-2 gap-3 pt-1'>
                    <div>
                      <span className='text-[11px] text-muted-foreground'>Fee (SAR):</span>
                      <Input
                        type='number'
                        value={shipping.standardFee}
                        onChange={e => setShipping({ ...shipping, standardFee: parseFloat(e.target.value) || 0 })}
                        className='h-8 text-xs font-mono mt-1'
                      />
                    </div>
                    <div>
                      <span className='text-[11px] text-muted-foreground'>Transit Duration:</span>
                      <Input
                        value={shipping.standardDays}
                        onChange={e => setShipping({ ...shipping, standardDays: e.target.value })}
                        className='h-8 text-xs mt-1'
                      />
                    </div>
                  </div>
                </div>

                {/* Express Delivery */}
                <div className='rounded-lg border border-border/70 bg-background/50 p-4 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-semibold text-foreground text-sm'>Express Armored Courier (DHL / G4S Vault)</span>
                    <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                      Enabled
                    </Badge>
                  </div>
                  <div className='grid grid-cols-2 gap-3 pt-1'>
                    <div>
                      <span className='text-[11px] text-muted-foreground'>Fee (SAR):</span>
                      <Input
                        type='number'
                        value={shipping.expressFee}
                        onChange={e => setShipping({ ...shipping, expressFee: parseFloat(e.target.value) || 0 })}
                        className='h-8 text-xs font-mono mt-1'
                      />
                    </div>
                    <div>
                      <span className='text-[11px] text-muted-foreground'>Transit Duration:</span>
                      <Input
                        value={shipping.expressHours}
                        onChange={e => setShipping({ ...shipping, expressHours: e.target.value })}
                        className='h-8 text-xs mt-1'
                      />
                    </div>
                  </div>
                </div>

                {/* Store Pickup */}
                <div className='rounded-lg border border-border/70 bg-background/50 p-4 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-semibold text-foreground text-sm'>Boutique Showroom Pickup</span>
                    <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                      Free (0 SAR)
                    </Badge>
                  </div>
                  <div>
                    <span className='text-[11px] text-muted-foreground'>Pickup Showroom Address:</span>
                    <Input
                      value={shipping.pickupLocation}
                      onChange={e => setShipping({ ...shipping, pickupLocation: e.target.value })}
                      className='h-8 text-xs mt-1'
                    />
                  </div>
                </div>

                <div className='pt-2'>
                  <Button
                    onClick={() => handleSave('Delivery Methods')}
                    className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
                  >
                    Save Delivery Configuration
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 5. PAYMENTS */}
          {activeTab === 'payments' && (
            <div className='rounded-xl border border-border/70 bg-card p-6 space-y-6 shadow-sm'>
              <div className='border-b border-border/60 pb-3'>
                <h2 className='text-base font-semibold text-foreground'>Payment Gateways</h2>
                <p className='text-xs text-muted-foreground'>Configure card acquiring, Apple Pay, Mada debit, and corporate wire clearance.</p>
              </div>

              <div className='space-y-3.5 text-xs max-w-xl'>
                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 flex items-center justify-between'>
                  <div>
                    <div className='font-semibold text-foreground'>Mada National Debit Network</div>
                    <div className='text-[11px] text-muted-foreground'>Direct clearance via Saudi Payments</div>
                  </div>
                  <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                    Active
                  </Badge>
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 flex items-center justify-between'>
                  <div>
                    <div className='font-semibold text-foreground'>Apple Pay</div>
                    <div className='text-[11px] text-muted-foreground'>Seamless one-touch checkout on iOS and macOS</div>
                  </div>
                  <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                    Active
                  </Badge>
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 flex items-center justify-between'>
                  <div>
                    <div className='font-semibold text-foreground'>Credit Cards (Visa / Mastercard)</div>
                    <div className='text-[11px] text-muted-foreground'>3D-Secure 2.0 fraud protection enabled</div>
                  </div>
                  <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                    Active
                  </Badge>
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 flex items-center justify-between'>
                  <div>
                    <div className='font-semibold text-foreground'>B2B Corporate Wire Transfer (SNB)</div>
                    <div className='text-[11px] text-muted-foreground'>Automated IBAN reference reconciliation</div>
                  </div>
                  <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                    Active
                  </Badge>
                </div>

                <div className='pt-2'>
                  <Button
                    onClick={() => handleSave('Payment Gateways')}
                    className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
                  >
                    Save Payment Settings
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 6. LANGUAGES */}
          {activeTab === 'languages' && (
            <div className='rounded-xl border border-border/70 bg-card p-6 space-y-6 shadow-sm'>
              <div className='border-b border-border/60 pb-3'>
                <h2 className='text-base font-semibold text-foreground'>Languages & Localization</h2>
                <p className='text-xs text-muted-foreground'>Configure bilingual store interface and RTL typography.</p>
              </div>

              <div className='space-y-4 text-xs max-w-xl'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Default Storefront Language</Label>
                  <select
                    value={languages.defaultLanguage}
                    onChange={e => setLanguages({ ...languages, defaultLanguage: e.target.value })}
                    className='h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none'
                  >
                    <option value='English'>English (EN)</option>
                    <option value='Arabic'>Arabic - العربية (AR)</option>
                  </select>
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 flex items-center justify-between'>
                  <div>
                    <div className='font-semibold text-foreground'>English (United States / International)</div>
                    <div className='text-[11px] text-muted-foreground'>Primary administrative and catalog language</div>
                  </div>
                  <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                    Enabled
                  </Badge>
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 flex items-center justify-between'>
                  <div>
                    <div className='font-semibold text-foreground font-arabic' dir='rtl'>العربية (Arabic - KSA)</div>
                    <div className='text-[11px] text-muted-foreground'>Full RTL layout support and Arabic typography</div>
                  </div>
                  <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                    Enabled
                  </Badge>
                </div>

                <div className='pt-2'>
                  <Button
                    onClick={() => handleSave('Language Settings')}
                    className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
                  >
                    Save Language Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 7. ADMIN PROFILE */}
          {activeTab === 'profile' && (
            <div className='rounded-xl border border-border/70 bg-card p-6 space-y-6 shadow-sm'>
              <div className='border-b border-border/60 pb-3'>
                <h2 className='text-base font-semibold text-foreground'>Admin Profile & Security</h2>
                <p className='text-xs text-muted-foreground'>Super administrator credentials, security keys, and two-factor authentication.</p>
              </div>

              <div className='space-y-4 text-xs max-w-xl'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Full Name</Label>
                  <Input
                    value={profile.fullName}
                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                    className='h-8 text-xs'
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Admin Account Email</Label>
                  <Input
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className='h-8 text-xs font-mono'
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Assigned Role</Label>
                  <Input
                    disabled
                    value={profile.role}
                    className='h-8 text-xs bg-muted/30 font-medium'
                  />
                </div>

                <div className='rounded-lg border border-border/70 bg-background/50 p-3.5 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <ShieldCheck className='size-4 text-emerald-400' />
                      <span className='font-semibold text-foreground'>Two-Factor Authentication (2FA)</span>
                    </div>
                    <Badge variant='outline' className='text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10'>
                      Active & Enforced
                    </Badge>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    FIDO2 / TOTP authenticator protection required for gold rate modifications and bullion dispatch.
                  </p>
                </div>

                <div className='pt-2 flex items-center gap-3'>
                  <Button
                    onClick={() => handleSave('Admin Profile')}
                    className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
                  >
                    Save Profile
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => toast.info('Password reset email dispatched to admin@venvision.com')}
                    className='h-8 text-xs border-border/80'
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
