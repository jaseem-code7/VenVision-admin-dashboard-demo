'use client'

import React, { useState } from 'react'
import {
  Building2,
  Search,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Coins,
  TrendingUp
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initialB2BBuyers, type B2BBuyer } from '@/data/venvision-data'

export default function B2BBuyersPage() {
  const [buyers] = useState<B2BBuyer[]>(initialB2BBuyers)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBuyers = buyers.filter(b =>
    b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.crNumber.includes(searchQuery) ||
    b.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='space-y-6 pb-12'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Wholesale Buyers
            </h1>
            <Badge variant='outline' className='border-blue-500/30 text-blue-600 dark:text-blue-400'>
              {buyers.length} Verified Jewellery Businesses
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            Registered jewellery store owners, goldsmith ateliers, and manufacturing partners buying at fixed wholesale rates.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className='p-4'>
          <div className='relative max-w-md'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search by company name, owner, CR number, or city...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 text-xs'
            />
          </div>
        </CardContent>
      </Card>

      {/* Buyers Grid */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredBuyers.map(buyer => (
          <Card key={buyer.id} className='hover:border-blue-500/40 transition-colors'>
            <CardContent className='p-5 space-y-4'>
              <div className='flex items-start justify-between'>
                <div className='space-y-1'>
                  <h3 className='font-bold text-base text-foreground'>{buyer.companyName}</h3>
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <MapPin className='size-3' /> {buyer.city}, Saudi Arabia
                  </div>
                </div>
                <Badge className='bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px]'>
                  {buyer.tier}
                </Badge>
              </div>

              {/* CR & Tax */}
              <div className='rounded-lg bg-muted/30 p-3 text-xs space-y-1 font-mono'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground font-sans'>CR Number:</span>
                  <span className='font-bold text-foreground'>{buyer.crNumber}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground font-sans'>VAT ID:</span>
                  <span>{buyer.vatNumber}</span>
                </div>
              </div>

              {/* Contacts */}
              <div className='space-y-1 text-xs text-muted-foreground'>
                <div className='text-foreground font-semibold'>{buyer.contactPerson}</div>
                <div className='flex items-center gap-2'>
                  <Mail className='size-3.5' /> {buyer.email}
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='size-3.5' /> {buyer.phone}
                </div>
              </div>

              {/* Volume & Spend */}
              <div className='grid grid-cols-2 gap-2 pt-2 border-t text-xs'>
                <div>
                  <span className='text-muted-foreground'>Gold Volume:</span>
                  <div className='font-bold text-foreground'>{buyer.totalVolumeGrams.toLocaleString()} grams</div>
                </div>
                <div className='text-right'>
                  <span className='text-muted-foreground'>Lifetime Spend:</span>
                  <div className='font-bold text-blue-600 dark:text-blue-400'>
                    {buyer.totalSpendSAR.toLocaleString()} SAR
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
