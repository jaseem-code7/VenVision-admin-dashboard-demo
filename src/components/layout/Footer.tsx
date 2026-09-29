'use client'

import React from 'react'
import Link from 'next/link'
import {
  Globe,
  MapPin,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className='border-t border-border/70 bg-card/60 text-muted-foreground mt-auto'>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5'>
        {/* Main Footer Row */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs'>
          {/* Left: Brand & Regional Scope */}
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-foreground tracking-tight text-sm'>
                VenVision Jewellery
              </span>
              <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-primary/30 bg-primary/10 text-primary'>
                <MapPin className='size-2.5' />
                Saudi Arabia Service Region
              </span>
            </div>
            <p className='text-muted-foreground text-[11px] leading-relaxed max-w-md'>
              High jewellery &amp; physical bullion trading. Domestic delivery available exclusively across the Kingdom of Saudi Arabia.
            </p>
          </div>

          {/* Middle: Help Links (Including Delivery & Returns) */}
          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-xs'>
            <span className='text-[11px] font-semibold uppercase tracking-wider text-foreground'>
              Help &amp; Policies:
            </span>
            <Link
              href='/returns-refunds'
              className='hover:text-foreground text-foreground/90 font-medium transition-colors'
            >
              Delivery &amp; Returns
            </Link>
            <Link
              href='/delivery'
              className='hover:text-foreground transition-colors'
            >
              Delivery Information
            </Link>
            <Link
              href='/custom-jewellery'
              className='hover:text-foreground transition-colors'
            >
              Bespoke Requests
            </Link>
            <Link
              href='/pricing'
              className='hover:text-foreground transition-colors'
            >
              Live Gold Rates
            </Link>
          </div>

          {/* Right: Language Selector & Region */}
          <div className='flex items-center gap-3'>
            <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/80 bg-background/50 text-[11px] font-medium text-foreground'>
              <Globe className='size-3 text-primary' />
              <span>Saudi Arabia | English / العربية</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-border/60' />

        {/* Sub-Footer Row: Social Media Links, Regulatory Compliance & Copyright */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px]'>
          {/* Social Media Links */}
          <div className='flex items-center gap-3 text-muted-foreground'>
            <span className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
              Follow VenVision:
            </span>
            {/* Instagram */}
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='VenVision Instagram'
              className='p-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors'
              title='Instagram'
            >
              <svg className='size-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href='https://tiktok.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='VenVision TikTok'
              className='p-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors'
              title='TikTok'
            >
              <svg className='size-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
              </svg>
            </a>

            {/* Snapchat */}
            <a
              href='https://snapchat.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='VenVision Snapchat'
              className='p-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors'
              title='Snapchat'
            >
              <svg className='size-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M12.012 2.25c-3.78 0-6.012 2.65-6.012 5.67 0 .95.31 2.12.82 2.95.21.34.31.6.14.88-.2.32-.67.48-1.07.64-.47.19-.94.38-.98.71-.05.42.36.73.74.88.75.3 1.57.19 2.29-.02.44-.13.78-.06 1.02.26.43.58 1.17 1.34 2.17 1.63.4.11.83.17 1.27.17.44 0 .87-.06 1.28-.17 1-.29 1.74-1.05 2.17-1.63.24-.32.58-.39 1.02-.26.72.21 1.54.32 2.29.02.38-.15.79-.46.74-.88-.04-.33-.51-.52-.98-.71-.4-.16-.87-.32-1.07-.64-.17-.28-.07-.54.14-.88.51-.83.82-2 .82-2.95 0-3.02-2.23-5.67-6.01-5.67zm-3.8 15.65c-.83.18-1.55.53-2.06 1.05-.33.34-.33.72-.05.99.6.58 1.83.83 3.09.68.7-.08 1.48-.35 2.15-.65.46-.21.84-.21 1.34 0 .67.3 1.45.57 2.15.65 1.26.15 2.49-.1 3.09-.68.28-.27.28-.65-.05-.99-.51-.52-1.23-.87-2.06-1.05-.59-.13-1.08-.1-1.63.14-.65.28-1.35.6-2.17.6-.82 0-1.52-.32-2.17-.6-.55-.24-1.04-.27-1.63-.14z' />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='VenVision Facebook'
              className='p-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors'
              title='Facebook'
            >
              <svg className='size-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href='https://wa.me/966500000000'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='VenVision WhatsApp Concierge'
              className='p-1.5 rounded-md hover:text-emerald-400 hover:bg-muted/60 transition-colors'
              title='WhatsApp Concierge'
            >
              <svg className='size-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z' />
              </svg>
            </a>
          </div>

          {/* Legal and Regulatory info */}
          <div className='flex flex-wrap items-center gap-2 sm:gap-3 text-muted-foreground'>
            <span className='flex items-center gap-1 text-emerald-400 font-medium'>
              <CheckCircle2 className='size-3' />
              Moyasar &amp; Nafath Verified
            </span>
            <span>•</span>
            <span>VAT 15% Registered</span>
            <span>•</span>
            <span className='text-foreground font-medium'>
              &copy; {new Date().getFullYear()} VenVision Jewellery
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
