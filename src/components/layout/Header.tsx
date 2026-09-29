'use client'

// Next Imports
import { Fragment } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Third-party Imports
import { LanguagesIcon } from 'lucide-react'

// Component Imports
import LanguageDropdown from '@/components/shared/LanguageDropdown'
import ModeToggle from '@/components/layout/ModeToggle'
import ProfileDropdown from '@/components/shared/ProfileDropdown'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const Header = () => {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  return (
    <header className='bg-card sticky top-0 z-50 border-b'>
      <div className='mx-auto flex max-w-360 items-center justify-between gap-6 px-4 py-2 sm:px-6'>
        <div className='flex items-center gap-4'>
          <SidebarTrigger className='[&_svg]:size-5!' />
          <Separator orientation='vertical' className='hidden h-4! data-vertical:self-center sm:block' />
          <Breadcrumb className='hidden sm:block'>
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1
                let label = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                if (segment.toLowerCase() === 'orders' && pathname.includes('/dashboard/orders')) {
                  label = 'B2B Orders'
                }
                const href = '/' + segments.slice(0, index + 1).join('/')

                return (
                  <Fragment key={href}>
                    <BreadcrumbItem>
                      {isLast ? <BreadcrumbPage>{label}</BreadcrumbPage> : <BreadcrumbLink>{label}</BreadcrumbLink>}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='flex items-center gap-2.5'>
          <Link
            href='/pricing'
            className='hidden items-center gap-2 rounded-full border border-border/80 bg-secondary/50 hover:bg-secondary px-3 py-1 text-xs text-foreground transition-colors md:flex'
            title='View Live Gold & Bullion Rates'
          >
            <span className='size-1.5 rounded-full bg-[#C5A059]' />
            <span className='text-muted-foreground font-medium'>24K Gold:</span>
            <span className='font-semibold tabular-nums text-foreground'>SAR 312.50/g</span>
            <span className='text-[10px] font-medium text-emerald-600 dark:text-emerald-400'>+0.35%</span>
          </Link>
          <ModeToggle />
          <LanguageDropdown
            trigger={
              <Button variant='ghost' size='icon-lg'>
                <LanguagesIcon />
              </Button>
            }
          />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

export default Header
