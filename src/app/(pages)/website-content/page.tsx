'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Globe,
  Edit2,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Tag,
  Mail,
  Sliders,
  ExternalLink,
  Save,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ContentSection {
  id: string
  name: string
  key: 'banner' | 'featured' | 'arrivals' | 'category' | 'promo' | 'newsletter'
  description: string
  status: 'Active' | 'Draft' | 'Scheduled'
  lastUpdated: string
  previewText: string
  previewBadge: string
  headline: string
  subheadline: string
  ctaText: string
  ctaUrl: string
}

const initialSections: ContentSection[] = [
  {
    id: 'sec-1',
    name: 'Homepage Banner',
    key: 'banner',
    description: 'Hero carousel showcasing seasonal haute jewellery and bullion trading.',
    status: 'Active',
    lastUpdated: '24 Sep 2026, 11:30 AST',
    previewText: 'National Day Fine Gold Collection — Up to 0% Making Charge on Selected 21K Sets',
    previewBadge: 'Hero Slider (3 Slides)',
    headline: 'National Day Fine Gold Heritage',
    subheadline: 'Crafted with royal mastery. Enjoy complimentary insured courier delivery across Saudi Arabia.',
    ctaText: 'Explore Collection',
    ctaUrl: '/collections/national-day'
  },
  {
    id: 'sec-2',
    name: 'Featured Products',
    key: 'featured',
    description: 'Curated 8-grid showcase of signature diamond solitaires and high-demand bracelets.',
    status: 'Active',
    lastUpdated: '23 Sep 2026, 17:00 AST',
    previewText: 'Hand-picked luxury rings, tennis bracelets, and diamond huggies',
    previewBadge: '8 Products Selected',
    headline: 'Signature Masterpieces',
    subheadline: 'The pinnacle of VenVision atelier design, certified by GIA.',
    ctaText: 'View All Featured',
    ctaUrl: '/b2c/products?tag=featured'
  },
  {
    id: 'sec-3',
    name: 'New Arrivals',
    key: 'arrivals',
    description: 'Latest weekly catalog drops directly synced with workshop release schedules.',
    status: 'Active',
    lastUpdated: '24 Sep 2026, 09:15 AST',
    previewText: 'Autumn 2026 Italian 18K Chains & Pavé Floral Rings',
    previewBadge: 'Auto-updated Weekly',
    headline: 'New In The Atelier',
    subheadline: 'Fresh arrivals crafted for the modern luxury connoisseur.',
    ctaText: 'Discover New Arrivals',
    ctaUrl: '/b2c/products?sort=newest'
  },
  {
    id: 'sec-4',
    name: 'Shop by Category',
    key: 'category',
    description: 'Visual category pills: Rings, Necklaces, Earrings, Bangles, and Bullion.',
    status: 'Active',
    lastUpdated: '21 Sep 2026, 14:20 AST',
    previewText: 'Navigation tiles for 8 core retail jewellery lines & investment gold bars',
    previewBadge: '8 Tiles Displayed',
    headline: 'Curated Categories',
    subheadline: 'Find your perfect piece by category standard.',
    ctaText: 'Browse All Categories',
    ctaUrl: '/categories'
  },
  {
    id: 'sec-5',
    name: 'Promotional Section',
    key: 'promo',
    description: 'Mid-page promotional banner with countdown timer for festive sales and bridal fairs.',
    status: 'Active',
    lastUpdated: '22 Sep 2026, 18:45 AST',
    previewText: 'Bridal Season Special: Free Custom 3D CAD Design with Any 18K Engagement Order',
    previewBadge: 'Active Campaign',
    headline: 'The Bridal Atelier Experience',
    subheadline: 'Book a bespoke consultation with our master goldsmiths in Riyadh.',
    ctaText: 'Book VIP Consultation',
    ctaUrl: '/custom-jewellery'
  },
  {
    id: 'sec-6',
    name: 'Newsletter & VIP Club',
    key: 'newsletter',
    description: 'Customer subscription signup for private gold rate market alerts and previews.',
    status: 'Active',
    lastUpdated: '19 Sep 2026, 10:00 AST',
    previewText: 'Join the VenVision Circle for daily bullion market briefs & private sales',
    previewBadge: 'Active Subscriber Form',
    headline: 'Stay Ahead of the Gold Market',
    subheadline: 'Receive daily bullion opening prices and invitations to private trunk shows.',
    ctaText: 'Subscribe Now',
    ctaUrl: '#newsletter'
  }
]

export default function WebsiteContentPage() {
  const [sections, setSections] = useState<ContentSection[]>(initialSections)
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Edit Form State
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    ctaText: '',
    ctaUrl: '',
    status: 'Active' as ContentSection['status']
  })

  const handleOpenEdit = (sec: ContentSection) => {
    setEditingSection(sec)
    setFormData({
      headline: sec.headline,
      subheadline: sec.subheadline,
      ctaText: sec.ctaText,
      ctaUrl: sec.ctaUrl,
      status: sec.status
    })
    setIsModalOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSection) return

    setSections(prev =>
      prev.map(s =>
        s.id === editingSection.id
          ? {
              ...s,
              headline: formData.headline,
              subheadline: formData.subheadline,
              ctaText: formData.ctaText,
              ctaUrl: formData.ctaUrl,
              status: formData.status,
              lastUpdated: 'Just now'
            }
          : s
      )
    )

    setIsModalOpen(false)
    toast.success(`Section "${editingSection.name}" updated successfully!`)
  }

  return (
    <div className='space-y-6 pb-12'>
      {/* Header & Breadcrumb */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>Website Content</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Website Content
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Configure storefront homepage sections, promotional hero banners, and VIP newsletter messaging.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => toast.info('Opening public storefront preview...')}
            className='h-9 text-xs sm:text-sm border-border/80 gap-1.5'
          >
            <Eye className='size-3.5' />
            View Live Storefront
          </Button>
        </div>
      </div>

      {/* Sections List in Clean Cards */}
      <div className='space-y-4'>
        {sections.map(section => (
          <div
            key={section.id}
            className='rounded-xl border border-border/70 bg-card p-5 shadow-2xs hover:border-primary/40 transition-colors'
          >
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              {/* Left: Thumbnail Preview + Info */}
              <div className='flex items-start gap-4'>
                {/* Visual Preview Thumbnail Box */}
                <div className='size-16 sm:size-20 rounded-lg border border-border/80 bg-background/60 flex flex-col items-center justify-center p-2 text-center shrink-0'>
                  {section.key === 'banner' && <ImageIcon className='size-6 text-primary' />}
                  {section.key === 'featured' && <Sparkles className='size-6 text-[#C5A059]' />}
                  {section.key === 'arrivals' && <Layers className='size-6 text-cyan-500' />}
                  {section.key === 'category' && <Tag className='size-6 text-primary/80' />}
                  {section.key === 'promo' && <Sliders className='size-6 text-amber-500' />}
                  {section.key === 'newsletter' && <Mail className='size-6 text-blue-500' />}
                  <span className='text-[9px] font-mono text-muted-foreground mt-1 uppercase'>
                    {section.key}
                  </span>
                </div>

                <div className='space-y-1.5'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='font-semibold text-foreground text-sm sm:text-base'>
                      {section.name}
                    </h3>
                    <Badge
                      variant='outline'
                      className={`text-[10px] font-medium border ${
                        section.status === 'Active'
                          ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                          : section.status === 'Scheduled'
                          ? 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10'
                          : 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {section.status}
                    </Badge>
                    <Badge variant='outline' className='text-[10px] border-border/70 text-muted-foreground'>
                      {section.previewBadge}
                    </Badge>
                  </div>

                  <p className='text-xs text-muted-foreground'>
                    {section.description}
                  </p>

                  <div className='rounded-md border border-border/60 bg-muted/20 px-3 py-1.5 text-xs text-foreground'>
                    <span className='text-muted-foreground'>Headline: </span>
                    <strong className='font-medium'>{section.headline}</strong>
                    {section.ctaText && (
                      <span className='ml-2 text-muted-foreground'>
                        • CTA: <code className='text-[11px] font-mono text-primary font-medium'>{section.ctaText}</code>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Metadata & Edit Action */}
              <div className='flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60'>
                <div className='text-left md:text-right'>
                  <span className='text-[10px] text-muted-foreground block'>Last Updated</span>
                  <span className='text-xs text-foreground font-medium'>{section.lastUpdated}</span>
                </div>

                <Button
                  onClick={() => handleOpenEdit(section)}
                  className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 px-3.5 shadow-xs'
                >
                  <Edit2 className='size-3.5' />
                  Edit Section
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Section Modal / Drawer */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-[500px] bg-card border-border/80'>
          {editingSection && (
            <form onSubmit={handleSaveEdit}>
              <DialogHeader>
                <DialogTitle className='text-base font-semibold'>
                  Edit {editingSection.name}
                </DialogTitle>
                <DialogDescription className='text-xs'>
                  Modify storefront content copy, call to action, and publication status.
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-3.5 py-4 text-xs'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Headline Title *</Label>
                  <Input
                    required
                    value={formData.headline}
                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                    className='h-8 text-xs'
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Subheadline / Caption</Label>
                  <textarea
                    rows={2}
                    value={formData.subheadline}
                    onChange={e => setFormData({ ...formData, subheadline: e.target.value })}
                    className='w-full rounded-md border border-input bg-background p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>CTA Button Text</Label>
                    <Input
                      value={formData.ctaText}
                      onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder='e.g. Shop Collection'
                      className='h-8 text-xs'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold'>CTA Target URL</Label>
                    <Input
                      value={formData.ctaUrl}
                      onChange={e => setFormData({ ...formData, ctaUrl: e.target.value })}
                      placeholder='e.g. /collections/gold'
                      className='h-8 text-xs'
                    />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Publication Status</Label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className='h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none'
                  >
                    <option value='Active'>Active (Published Live)</option>
                    <option value='Draft'>Draft (Hidden from Storefront)</option>
                    <option value='Scheduled'>Scheduled Campaign</option>
                  </select>
                </div>
              </div>

              <DialogFooter className='gap-2 sm:gap-0'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setIsModalOpen(false)}
                  className='h-8 text-xs'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
                >
                  Save & Publish
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
