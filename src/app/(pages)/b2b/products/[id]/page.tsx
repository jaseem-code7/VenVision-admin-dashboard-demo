'use client'

import { useParams } from 'next/navigation'

import RecordDetailPage from '@/components/record-detail-page'
import { sampleB2BProducts } from '../page'

export default function B2BProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const product = sampleB2BProducts.find(item => item.id === id)

  if (!product) {
    return (
      <RecordDetailPage
        backHref='/b2b/products'
        backLabel='Back to Products'
        eyebrow='B2B Wholesale / Products'
        title='Product not found'
        subtitle={`No B2B product exists with ID ${id}.`}
        fields={[]}
      />
    )
  }

  return (
    <RecordDetailPage
      backHref='/b2b/products'
      backLabel='Back to Products'
      eyebrow='B2B Wholesale / Product Details'
      title={product.name}
      subtitle={product.sku}
      status={product.status}
      image={product.image}
      fields={[
        { label: 'Product ID', value: product.id },
        { label: 'Product Type', value: product.productType },
        { label: 'Metal / Purity', value: `${product.metal} / ${product.purity}` },
        { label: 'Weight', value: product.weightDisplay },
        { label: 'Current Rate', value: `SAR ${product.currentRateSAR.toFixed(2)}/g` },
        { label: 'B2B Price', value: `SAR ${product.b2bPriceSAR.toLocaleString()}` },
        { label: 'Stock', value: product.stock },
        { label: 'Rate Type', value: product.rateType },
        { label: 'Rating', value: product.rating.toFixed(1) },
        { label: 'Last Updated', value: product.updatedAt }
      ]}
    />
  )
}
