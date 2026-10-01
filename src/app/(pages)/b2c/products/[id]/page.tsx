'use client'

import { useParams } from 'next/navigation'

import RecordDetailPage from '@/components/record-detail-page'
import { sampleB2CProducts } from '../page'

export default function B2CProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const product = sampleB2CProducts.find(item => item.id === id)

  if (!product) {
    return (
      <RecordDetailPage
        backHref='/b2c/products'
        backLabel='Back to Products'
        eyebrow='B2C Retail / Products'
        title='Product not found'
        subtitle={`No B2C product exists with ID ${id}.`}
        fields={[]}
      />
    )
  }

  return (
    <RecordDetailPage
      backHref='/b2c/products'
      backLabel='Back to Products'
      eyebrow='B2C Retail / Product Details'
      title={product.name}
      subtitle={product.sku}
      status={product.status}
      image={product.image}
      fields={[
        { label: 'Product ID', value: product.id },
        { label: 'Category', value: product.category },
        { label: 'Selling Price', value: `SAR ${product.priceSAR.toLocaleString()}` },
        { label: 'Stock', value: `${product.stock} units` },
        { label: 'Total Sales', value: `${product.salesCount.toLocaleString()} pcs` },
        { label: 'Revenue', value: `SAR ${product.revenueSAR.toLocaleString()}` },
        { label: 'Rating', value: product.rating.toFixed(1) },
        { label: 'Last Updated', value: product.updatedAt }
      ]}
    />
  )
}
