'use client'

import { useParams } from 'next/navigation'

import RecordDetailPage from '@/components/record-detail-page'
import { initialInventoryData } from '../page'

export default function InventoryDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const item = initialInventoryData.find(record => record.id === id)

  if (!item) {
    return (
      <RecordDetailPage
        backHref='/inventory'
        backLabel='Back to Inventory'
        eyebrow='Management / Inventory'
        title='Inventory record not found'
        subtitle={`No inventory record exists with ID ${id}.`}
        fields={[]}
      />
    )
  }

  return (
    <RecordDetailPage
      backHref='/inventory'
      backLabel='Back to Inventory'
      eyebrow='Management / Inventory Details'
      title={item.name}
      subtitle={item.sku}
      status={item.status}
      fields={[
        { label: 'Inventory ID', value: item.id },
        { label: 'Channel', value: item.channel },
        { label: 'Category', value: item.category },
        { label: 'Material', value: item.material },
        { label: 'Available Stock', value: `${item.availableStock.toLocaleString()} ${item.unit}` },
        { label: 'Reserved Stock', value: `${item.reservedStock.toLocaleString()} ${item.unit}` },
        { label: 'Low Stock Threshold', value: `${item.lowStockLevel.toLocaleString()} ${item.unit}` },
        { label: 'Last Updated', value: item.updatedAt }
      ]}
    />
  )
}
