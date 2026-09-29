'use client'

import React, { useState } from 'react'
import {
  Star,
  ShieldCheck,
  Check,
  EyeOff,
  Search,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { initialReviews, type Review } from '@/data/venvision-data'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const updateReviewStatus = (id: string, newStatus: Review['status']) => {
    setReviews(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    )
    toast.success(`Review ${newStatus.toLowerCase()} successfully!`)
  }

  const filteredReviews = reviews.filter(
    r => statusFilter === 'All' || r.status === statusFilter
  )

  return (
    <div className='space-y-6 pb-12'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Customer Reviews & Ratings
            </h1>
            <Badge variant='outline' className='border-amber-500/30 text-amber-600 dark:text-amber-400'>
              {reviews.length} Total Reviews
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            Moderate customer feedback, verify authentic gold buyer reviews, and manage store testimonials.
          </p>
        </div>

        <div className='flex items-center gap-1.5'>
          {['All', 'Approved', 'Pending', 'Hidden'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                statusFilter === st
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className='space-y-4'>
        {filteredReviews.map(review => (
          <Card key={review.id} className='hover:border-primary/40 transition-colors'>
            <CardContent className='p-5 space-y-3'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold text-sm text-foreground'>{review.customerName}</h3>
                    {review.verifiedBuyer && (
                      <span className='inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400'>
                        <ShieldCheck className='size-3' /> Verified Jewellery Purchaser
                      </span>
                    )}
                  </div>
                  <div className='text-xs font-medium text-primary mt-0.5'>
                    Product: {review.productName}
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-0.5'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <Badge
                    variant='outline'
                    className={`text-[10px] ${
                      review.status === 'Approved'
                        ? 'border-emerald-500/30 text-emerald-600'
                        : review.status === 'Pending'
                        ? 'border-amber-500/30 text-amber-600'
                        : 'border-muted text-muted-foreground'
                    }`}
                  >
                    {review.status}
                  </Badge>
                </div>
              </div>

              <p className='text-xs text-foreground leading-relaxed'>{review.comment}</p>

              <div className='flex items-center justify-between pt-2 border-t text-xs text-muted-foreground'>
                <span>Submitted on {review.date}</span>

                <div className='flex items-center gap-2'>
                  {review.status !== 'Approved' && (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => updateReviewStatus(review.id, 'Approved')}
                      className='h-7 text-xs text-emerald-600 hover:text-emerald-700'
                    >
                      <Check className='size-3 mr-1' /> Approve
                    </Button>
                  )}
                  {review.status !== 'Hidden' && (
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => updateReviewStatus(review.id, 'Hidden')}
                      className='h-7 text-xs text-muted-foreground'
                    >
                      <EyeOff className='size-3 mr-1' /> Hide
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
