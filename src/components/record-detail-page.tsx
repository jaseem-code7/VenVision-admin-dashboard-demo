'use client'

import type { ReactNode } from 'react'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DetailField = {
  label: string
  value: ReactNode
}

type RecordDetailPageProps = {
  backHref: string
  backLabel: string
  eyebrow: string
  title: string
  subtitle?: string
  status?: string
  image?: string
  fields: DetailField[]
}

export default function RecordDetailPage({
  backHref,
  backLabel,
  eyebrow,
  title,
  subtitle,
  status,
  image,
  fields
}: RecordDetailPageProps) {
  return (
    <div className='space-y-6 pb-12'>
      <div className='flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='text-xs font-medium text-muted-foreground'>{eyebrow}</div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{title}</h1>
          {subtitle && <p className='text-sm text-muted-foreground'>{subtitle}</p>}
        </div>
        <Link
          href={backHref}
          className='inline-flex h-9 w-fit items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground'
        >
          <ArrowLeft className='size-4' />
          {backLabel}
        </Link>
      </div>

      <Card className='rounded-xl border-border/80 shadow-xs'>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border/60'>
          <CardTitle className='text-base'>Record Details</CardTitle>
          {status && <Badge variant='outline'>{status}</Badge>}
        </CardHeader>
        <CardContent className='grid gap-6 pt-6 md:grid-cols-[180px_1fr]'>
          {image ? (
            <img src={image} alt={title} className='aspect-square w-full rounded-xl border border-border/70 object-cover' />
          ) : (
            <div className='flex aspect-square w-full items-center justify-center rounded-xl border border-border/70 bg-muted/30 text-xs text-muted-foreground'>
              {eyebrow}
            </div>
          )}
          <dl className='grid content-start gap-x-8 gap-y-4 sm:grid-cols-2'>
            {fields.map(field => (
              <div key={field.label} className='border-b border-border/50 pb-3'>
                <dt className='text-xs text-muted-foreground'>{field.label}</dt>
                <dd className='mt-1 text-sm font-medium text-foreground'>{field.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
