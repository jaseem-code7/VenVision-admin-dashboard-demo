export type ReturnStatus =
  | 'Return Requested'
  | 'Under Review'
  | 'Return Approved'
  | 'Awaiting Product'
  | 'Product Received'
  | 'Quality Inspection'
  | 'Refund Approved'
  | 'Partial Refund Approved'
  | 'Refund Rejected'
  | 'Refund Processing'
  | 'Refund Completed'
  | 'Return Closed'

export type RefundStatus =
  | 'Not Started'
  | 'Awaiting Inspection'
  | 'Approved'
  | 'Partial Approved'
  | 'Rejected'
  | 'Processing'
  | 'Completed'
  | 'Failed'

export type ReturnReason =
  | 'Wrong Size'
  | 'Damaged Product'
  | 'Incorrect Product'
  | 'Changed Mind'
  | 'Order Cancellation'
  | 'Quality Issue'
  | 'Other'

export type InspectionResult = 'Pass' | 'Fail' | 'Not Applicable'

export type InspectionStatus = 'Not Started' | 'Pending' | 'In Progress' | 'Passed' | 'Failed'

export type InspectionCheckKey =
  | 'correctProduct'
  | 'productCondition'
  | 'scratchesDamage'
  | 'missingStones'
  | 'stoneCondition'
  | 'metalCondition'
  | 'certificateIncluded'
  | 'packagingIncluded'
  | 'accessoriesIncluded'
  | 'resizingSigns'
  | 'engravingSigns'
  | 'modificationSigns'
  | 'usageSigns'
  | 'serialSkuMatch'

export const INSPECTION_CHECKS: { key: InspectionCheckKey; label: string }[] = [
  { key: 'correctProduct', label: 'Correct returned product' },
  { key: 'productCondition', label: 'Product condition' },
  { key: 'scratchesDamage', label: 'Scratches / damage' },
  { key: 'missingStones', label: 'Missing stones' },
  { key: 'stoneCondition', label: 'Stone condition' },
  { key: 'metalCondition', label: 'Gold / metal condition' },
  { key: 'certificateIncluded', label: 'Certificate included' },
  { key: 'packagingIncluded', label: 'Packaging included' },
  { key: 'accessoriesIncluded', label: 'Accessories included' },
  { key: 'resizingSigns', label: 'Signs of resizing' },
  { key: 'engravingSigns', label: 'Signs of engraving' },
  { key: 'modificationSigns', label: 'Signs of modification' },
  { key: 'usageSigns', label: 'Signs of usage' },
  { key: 'serialSkuMatch', label: 'Serial / SKU match' }
]

export type ReturnInspection = {
  status: InspectionStatus
  checklist: Record<InspectionCheckKey, InspectionResult>
  inspectorNotes: string
  inspectorName?: string
  inspectedDate?: string
}

export type RefundDecision = {
  type: 'None' | 'Full' | 'Partial' | 'Rejected'
  originalPaidAmountSAR: number
  deductionAmountSAR: number
  deductionReason?: string
  finalRefundAmountSAR: number
  rejectionReason?: string
  decidedDate?: string
}

export type MoyasarRefund = {
  paymentId: string
  refundId?: string
  refundAmountSAR?: number
  requestedDate?: string
  processedDate?: string
  status: 'Not Started' | 'Processing' | 'Completed' | 'Failed'
  apiReference?: string
}

export type ReturnItem = {
  id: string
  orderId: string
  customer: string
  businessName?: string
  product: string
  productSku: string
  productImage: string
  channel: 'B2C' | 'B2B'
  quantity: number
  originalProductPriceSAR: number
  shippingRefundSAR: number
  returnDeliveryCostSAR: number
  customerReturnFeeSAR: number
  venvisionReturnExpenseSAR: number
  restockingFeeSAR: number
  refundAmountSAR: number // Product + Shipping - ReturnFee - Restocking
  returnReason: ReturnReason
  returnStatus: ReturnStatus
  refundStatus: RefundStatus
  requestedDate: string
  customerNotes: string
  originalPaymentMethod: string
  courierUsed: string
  trackingNumber: string
  receivedDate?: string
  receivedBy?: string
  evidencePhotos?: string[]
  inspection?: ReturnInspection
  refundDecision?: RefundDecision
  moyasarRefund?: MoyasarRefund

  // B2B specific inspection attributes
  b2bDetails?: {
    weightGrams: number
    purity: string
    originalGoldRateSAR: number
    lockedRateSAR: number
    returnWeightGrams: number
    assayPass: boolean
  }
  timeline: {
    stage: string
    date: string
    completed: boolean
    current?: boolean
  }[]
}

export const MOCK_RETURNS: ReturnItem[] = [
  {
    id: 'RET-1024',
    orderId: 'ORD-4521',
    customer: 'Ahmed Ali',
    product: '18K Diamond Solitaire Ring',
    productSku: 'VV-RNG-DIA-01',
    productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
    channel: 'B2C',
    quantity: 1,
    originalProductPriceSAR: 2490,
    shippingRefundSAR: 0,
    returnDeliveryCostSAR: 25,
    customerReturnFeeSAR: 25,
    venvisionReturnExpenseSAR: 0,
    restockingFeeSAR: 0,
    refundAmountSAR: 2465, // 2490 + 0 - 25 - 0 = 2465
    returnReason: 'Wrong Size',
    returnStatus: 'Return Requested',
    refundStatus: 'Not Started',
    requestedDate: '25 Sep 2026',
    customerNotes: 'The ring size is European 52 but my fiancée wears size 56. The ring is completely unworn with original tamper tag intact.',
    originalPaymentMethod: 'Mada Debit Card (Moyasar)',
    courierUsed: 'SMSA Express',
    trackingNumber: 'SMSA9283847',
    timeline: [
      { stage: 'Return Requested', date: '25 Sep 2026, 09:30 AM', completed: true, current: true },
      { stage: 'Under Atelier Review', date: 'Estimated: 26 Sep', completed: false },
      { stage: 'Item Received at Vault', date: 'Pending Pickup', completed: false },
      { stage: 'Refund Processing', date: 'Mada Gateway', completed: false },
      { stage: 'Completed', date: 'Final Settlement', completed: false }
    ]
  },
  {
    id: 'RET-1025',
    orderId: 'ORD-4510',
    customer: 'Al Noor Jewellery Ateliers',
    businessName: 'Al Noor Jewellery Ateliers LLC (CR: 1010892019)',
    product: '100g 999.9 Fine Gold Bar',
    productSku: 'VV-BLN-100G-999',
    productImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=400&q=80',
    channel: 'B2B',
    quantity: 1,
    originalProductPriceSAR: 27150,
    shippingRefundSAR: 0,
    returnDeliveryCostSAR: 50,
    customerReturnFeeSAR: 0,
    venvisionReturnExpenseSAR: 50, // Absorbed by VenVision under B2B agreement
    restockingFeeSAR: 0,
    refundAmountSAR: 27150,
    returnReason: 'Order Cancellation',
    returnStatus: 'Quality Inspection',
    refundStatus: 'Awaiting Inspection',
    requestedDate: '24 Sep 2026',
    customerNotes: 'Client project cancelled prior to vault physical dispatch. Security seals remain verified in vault depot.',
    originalPaymentMethod: 'Direct Bank Wire (Riyad Bank)',
    courierUsed: 'Armoured Logistics',
    trackingNumber: 'ARM440918',
    b2bDetails: {
      weightGrams: 100,
      purity: '999.9 Fine Investment Purity',
      originalGoldRateSAR: 271.50,
      lockedRateSAR: 271.50,
      returnWeightGrams: 100.0,
      assayPass: true
    },
    timeline: [
      { stage: 'Return Requested', date: '24 Sep 2026, 11:15 AM', completed: true },
      { stage: 'Approved by Treasury', date: '24 Sep 2026, 02:40 PM', completed: true },
      { stage: 'Item Verified in Vault', date: '25 Sep 2026, 10:00 AM', completed: true, current: true },
      { stage: 'Refund Processing', date: 'Wire In Progress', completed: false },
      { stage: 'Completed', date: 'Pending Settlement', completed: false }
    ]
  },
  {
    id: 'RET-1026',
    orderId: 'ORD-4498',
    customer: 'Sarah Al-Ghamdi',
    product: 'Emerald Cut Diamond Tennis Bracelet',
    productSku: 'VV-BRC-EMR-04',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    channel: 'B2C',
    quantity: 1,
    originalProductPriceSAR: 14200,
    shippingRefundSAR: 0,
    returnDeliveryCostSAR: 25,
    customerReturnFeeSAR: 0,
    venvisionReturnExpenseSAR: 25, // VIP Client complimentary return
    restockingFeeSAR: 0,
    refundAmountSAR: 14200,
    returnReason: 'Changed Mind',
    returnStatus: 'Under Review',
    refundStatus: 'Not Started',
    requestedDate: '23 Sep 2026',
    customerNotes: 'Client opted for the royal sapphire edition instead. Requesting full refund to repurchase.',
    originalPaymentMethod: 'Visa / Mastercard (Moyasar)',
    courierUsed: 'DHL Express',
    trackingNumber: 'DHL8849201',
    timeline: [
      { stage: 'Return Requested', date: '23 Sep 2026, 04:20 PM', completed: true },
      { stage: 'Under Atelier Review', date: '24 Sep 2026, 09:00 AM', completed: true, current: true },
      { stage: 'Item Received at Vault', date: 'Scheduled for 26 Sep', completed: false },
      { stage: 'Refund Processing', date: 'Credit Card Reversal', completed: false },
      { stage: 'Completed', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'RET-1027',
    orderId: 'ORD-4482',
    customer: 'Nasser Al-Subaie',
    product: '21K Traditional Royal Gold Bangle',
    productSku: 'VV-BNG-21K-08',
    productImage: 'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?auto=format&fit=crop&w=400&q=80',
    channel: 'B2C',
    quantity: 1,
    originalProductPriceSAR: 5600,
    shippingRefundSAR: 0,
    returnDeliveryCostSAR: 20,
    customerReturnFeeSAR: 0,
    venvisionReturnExpenseSAR: 20,
    restockingFeeSAR: 0,
    refundAmountSAR: 5600,
    returnReason: 'Damaged Product',
    returnStatus: 'Quality Inspection',
    refundStatus: 'Awaiting Inspection',
    requestedDate: '22 Sep 2026',
    customerNotes: 'Minor hinge defect noticed upon unboxing. Master craftsman inspection confirmed hinge pin looseness.',
    originalPaymentMethod: 'Apple Pay (Mada)',
    courierUsed: 'Aramex',
    trackingNumber: 'ARX9284102',
    timeline: [
      { stage: 'Return Requested', date: '22 Sep 2026', completed: true },
      { stage: 'Approved', date: '23 Sep 2026', completed: true },
      { stage: 'Item Received at Vault', date: '24 Sep 2026', completed: true, current: true },
      { stage: 'Refund Processing', date: 'Authorized by Atelier', completed: false },
      { stage: 'Completed', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'RET-1028',
    orderId: 'ORD-4460',
    customer: 'Dammam Wholesale Bullion Trading',
    businessName: 'Dammam Wholesale Bullion Trading Establishment (CR: 2050119842)',
    product: '500g Swiss Mint Cast Ingot',
    productSku: 'VV-BLN-500G-CH',
    productImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=400&q=80',
    channel: 'B2B',
    quantity: 1,
    originalProductPriceSAR: 135800,
    shippingRefundSAR: 0,
    returnDeliveryCostSAR: 75,
    customerReturnFeeSAR: 0,
    venvisionReturnExpenseSAR: 75,
    restockingFeeSAR: 0,
    refundAmountSAR: 135800,
    returnReason: 'Quality Issue',
    returnStatus: 'Refund Completed',
    refundStatus: 'Completed',
    requestedDate: '18 Sep 2026',
    customerNotes: 'Discrepancy in assay certificate serial numbering vs physical laser barcode. Replacement unit issued and financial reconciliation finalized.',
    originalPaymentMethod: 'RTGS Central Bank Transfer',
    courierUsed: 'Armoured Logistics',
    trackingNumber: 'ARM440899',
    b2bDetails: {
      weightGrams: 500,
      purity: '999.9 Swiss Fineness',
      originalGoldRateSAR: 271.60,
      lockedRateSAR: 271.60,
      returnWeightGrams: 500.0,
      assayPass: true
    },
    timeline: [
      { stage: 'Return Requested', date: '18 Sep 2026', completed: true },
      { stage: 'Approved by Quality Assurance', date: '19 Sep 2026', completed: true },
      { stage: 'Item Received at Central Vault', date: '20 Sep 2026', completed: true },
      { stage: 'Refund Processed', date: '21 Sep 2026', completed: true },
      { stage: 'Completed', date: '22 Sep 2026', completed: true, current: true }
    ]
  },
  {
    id: 'RET-1029',
    orderId: 'ORD-4455',
    customer: 'Khaled Bin Faisal',
    product: '18K White Gold Diamond Cufflinks',
    productSku: 'VV-ACC-DIA-CF',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    channel: 'B2C',
    quantity: 1,
    originalProductPriceSAR: 3800,
    shippingRefundSAR: 0,
    returnDeliveryCostSAR: 22,
    customerReturnFeeSAR: 0,
    venvisionReturnExpenseSAR: 22,
    restockingFeeSAR: 380, // 10% personalized engraving restocking fee
    refundAmountSAR: 3420,
    returnReason: 'Other',
    returnStatus: 'Return Closed',
    refundStatus: 'Rejected',
    requestedDate: '16 Sep 2026',
    customerNotes: 'Custom engraved initials requested on back plate. Bespoke personalized items are non-returnable under VenVision terms.',
    originalPaymentMethod: 'Mada Debit Card',
    courierUsed: 'SPL – Saudi Post',
    trackingNumber: 'SPL551029',
    timeline: [
      { stage: 'Return Requested', date: '16 Sep 2026', completed: true },
      { stage: 'Under Review', date: '17 Sep 2026', completed: true },
      { stage: 'Rejected by Atelier', date: '17 Sep 2026 (Personalized Engraving Exception)', completed: true, current: true },
      { stage: 'Item Received', date: 'N/A', completed: false },
      { stage: 'Completed', date: 'Case Closed', completed: false }
    ]
  }
]

const createInspectionChecklist = (): Record<InspectionCheckKey, InspectionResult> =>
  Object.fromEntries(INSPECTION_CHECKS.map(item => [item.key, 'Not Applicable'])) as Record<
    InspectionCheckKey,
    InspectionResult
  >

const getInitialInspectionStatus = (item: ReturnItem): InspectionStatus => {
  if (item.returnStatus === 'Refund Completed') return 'Passed'
  if (item.returnStatus === 'Quality Inspection') return 'In Progress'
  if (item.returnStatus === 'Product Received') return 'Pending'

  return 'Not Started'
}

export const normalizeReturnItem = (item: ReturnItem): ReturnItem => {
  const inspection = item.inspection ?? {
    status: getInitialInspectionStatus(item),
    checklist: createInspectionChecklist(),
    inspectorNotes: ''
  }

  const refundDecision = item.refundDecision ?? {
    type: item.refundStatus === 'Completed' ? 'Full' : item.refundStatus === 'Rejected' ? 'Rejected' : 'None',
    originalPaidAmountSAR: item.originalProductPriceSAR,
    deductionAmountSAR: Math.max(0, item.originalProductPriceSAR - item.refundAmountSAR),
    finalRefundAmountSAR: item.refundAmountSAR
  }

  const moyasarRefund = item.moyasarRefund ?? {
    paymentId: `PAY-${item.orderId}`,
    refundId: item.refundStatus === 'Completed' ? `RFN-${item.id}` : undefined,
    refundAmountSAR: item.refundStatus === 'Completed' ? item.refundAmountSAR : undefined,
    status: item.refundStatus === 'Completed' ? 'Completed' : 'Not Started'
  }

  return {
    ...item,
    evidencePhotos: item.evidencePhotos ?? [item.productImage],
    inspection,
    refundDecision,
    moyasarRefund
  }
}

const getReturnStorageKey = (returnId: string) => `venvision-return-workflow:${returnId}`

export const loadReturnItem = (item: ReturnItem): ReturnItem => {
  const fallback = normalizeReturnItem(item)

  if (typeof window === 'undefined') return fallback

  try {
    const stored = window.localStorage.getItem(getReturnStorageKey(item.id))

    return stored ? normalizeReturnItem({ ...fallback, ...JSON.parse(stored) }) : fallback
  } catch {
    return fallback
  }
}

export const saveReturnItem = (item: ReturnItem) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(getReturnStorageKey(item.id), JSON.stringify(item))
  }
}
