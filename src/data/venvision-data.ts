export interface GoldRate {
  karat: string
  purity: string
  buyRateSAR: number
  sellRateSAR: number
  change24h: number
  lastUpdated: string
}

export interface B2CProduct {
  id: string
  sku: string
  name: string
  nameAr: string
  category: string
  goldColor: 'Yellow Gold' | 'White Gold' | 'Rose Gold' | 'Two-Tone'
  purity: '18K' | '21K' | '22K' | '24K'
  weightGrams: number
  goldRateSAR: number
  makingChargeSAR: number
  stoneDetails: string
  stonePriceSAR: number
  vatAmountSAR: number
  finalPriceSAR: number
  stock: number
  sizes: string[]
  gender?: 'Women' | 'Men' | 'Unisex'
  images: string[]
  certificate: string
  isBestSeller?: boolean
  isNewArrival?: boolean
  customizable?: boolean
  customizationOptions?: {
    allowsEngraving?: boolean
    allowsCustomText?: boolean
  }
  wishlistCount?: number
  reviewsCount?: number
  rating?: number
  description: string
}

export interface B2BProduct {
  id: string
  sku: string
  name: string
  nameAr: string
  type: 'Raw Material' | 'Bullion' | 'Findings' | 'Wholesale Finished'
  unit: 'grams' | 'kilograms' | 'pieces' | 'ounces'
  purity: '24K (999.9)' | '22K (916)' | '21K (875)' | '18K (750)'
  weightPerUnitGrams: number
  availableStock: number
  fixedWholesalePriceSAR: number
  minOrderQuantity: number
  images: string[]
  description: string
}

export interface B2COrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  date: string
  itemsCount: number
  totalAmountSAR: number
  nafathVerified: boolean
  paymentMethod: 'Moyasar (Mada)' | 'Moyasar (Visa/MC)' | 'Moyasar (Apple Pay)'
  paymentStatus: 'Paid' | 'Pending' | 'Failed'
  fulfillmentStatus: 'Processing' | 'In Production' | 'Shipped' | 'Delivered' | 'Returned'
  shippingAddress: string
  courier: string
  trackingNumber: string
  orderType?: 'Catalogue Jewellery' | 'Custom Jewellery'
  customRequestId?: string
  items: {
    productName: string
    sku: string
    quantity: number
    priceSAR: number
  }[]
}

export type B2BPricingType = 'Fixed Rate' | 'Negotiation'
export type B2BOrderStatus = 'Pending' | 'Completed' | 'Cancelled'
export type B2BNegotiationStatus =
  | 'Offer Pending Review'
  | 'Counter-Offered'
  | 'Offer Accepted'
  | 'Offer Declined'

export interface B2BOrder {
  id: string
  orderNumber: string
  businessName: string
  buyerName: string
  crNumber: string
  vatNumber: string
  date: string
  totalUnits: number
  unitType: string
  totalAmountSAR: number
  paymentMethod: string
  paymentStatus: 'Paid' | 'Processing' | 'Failed' | 'Pending Wire'
  fulfillmentStatus: 'Preparing Dispatch' | 'In Transit' | 'Delivered' | 'Cancelled' | 'On Hold'
  status: B2BOrderStatus
  pricingType: B2BPricingType
  fixedRateSAR?: number
  rateLockRef?: string
  quotationPriceSAR?: number
  customerOfferSAR?: number
  counterOfferSAR?: number
  negotiationStatus?: B2BNegotiationStatus
  shippingCity: string
  trackingNumber: string
  items: {
    productName: string
    sku: string
    units: number
    ratePerUnitSAR: number
    totalSAR: number
  }[]
}

export interface B2CCustomer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  nafathVerified: boolean
  nafathIdMasked: string
  totalOrders: number
  totalSpentSAR: number
  wishlistItemsCount?: number
  savedAddressesCount?: number
  returnRequestsCount?: number
  joinedDate: string
  lastActive: string
}

export interface B2BBuyer {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  city: string
  crNumber: string
  vatNumber: string
  tier: 'Diamond Wholesale' | 'Gold Retailer' | 'Workshop Partner'
  totalOrders: number
  totalVolumeGrams: number
  totalSpendSAR: number
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Active'
  // Corporate Verification Fields
  businessType?: string
  licenceNumber?: string
  nationalAddress?: string
  businessAddress?: string
  website?: string
  logoUrl?: string
  shopPhotos?: string[]
  crDocumentUrl?: string
  licenceDocumentUrl?: string
  vatCertificateUrl?: string
  ownerName?: string
  ownerEmail?: string
  ownerMobile?: string
  ownerIdNumber?: string
  ownerIdDocumentUrl?: string
  registrationDate?: string
  approvalDate?: string
  // Purchase Analytics & Profile
  averageOrderValueSAR?: number
  lastPurchaseDate?: string
  frequentlyPurchasedCategories?: string[]
  frequentlyPurchasedProducts?: string[]
  purchaseFrequency?: 'Weekly Buyer' | 'Monthly Buyer' | 'Occasional Buyer'
}

export interface CustomJewelleryCAD {
  id: string
  referenceId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  requestType: 'Custom CAD Design' | '3D Jewellery Modelling' | 'STL File Production' | 'Custom Handcraft'
  targetMetal: '18K Yellow Gold' | '18K White Gold' | '21K Saudi Gold' | 'Platinum'
  targetBudgetSAR: number
  dimensions: string
  referenceImages: string[]
  notes: string
  submittedDate: string
  deadline: string
  status: 'New' | 'CAD In Progress' | 'Client Review' | 'Approved' | 'Sent to Casting'
  quotedPriceSAR?: number
  designerAssigned: string
}

export interface Coupon {
  id: string
  code: string
  discountType: 'Percentage' | 'Fixed SAR'
  discountValue: number
  applicableTo: 'All' | 'B2C Only' | 'B2B Only'
  minSpendSAR: number
  startDate: string
  expiryDate: string
  usageLimit: number
  usedCount: number
  isActive: boolean
}

export interface Review {
  id: string
  productName: string
  customerName: string
  rating: number
  comment: string
  date: string
  status: 'Approved' | 'Pending' | 'Hidden'
  verifiedBuyer: boolean
  images?: string[]
}

export interface Category {
  id: string
  name: string
  nameAr: string
  type: 'B2C Jewellery' | 'B2B Wholesale'
  itemCount: number
  purityDefault: string
  icon: string
  description: string
}

// -------------------------------------------------------------
// LIVE MOCK DATA
// -------------------------------------------------------------

export const initialGoldRates: GoldRate[] = [
  {
    karat: '24K',
    purity: '999.9 Fine Gold',
    buyRateSAR: 312.50,
    sellRateSAR: 316.20,
    change24h: 1.25,
    lastUpdated: 'Today, 13:30 AST'
  },
  {
    karat: '22K',
    purity: '916 Standard',
    buyRateSAR: 286.40,
    sellRateSAR: 289.80,
    change24h: 1.15,
    lastUpdated: 'Today, 13:30 AST'
  },
  {
    karat: '21K',
    purity: '875 Traditional',
    buyRateSAR: 273.40,
    sellRateSAR: 276.70,
    change24h: 1.10,
    lastUpdated: 'Today, 13:30 AST'
  },
  {
    karat: '18K',
    purity: '750 Fine Luxury',
    buyRateSAR: 234.35,
    sellRateSAR: 237.20,
    change24h: 0.95,
    lastUpdated: 'Today, 13:30 AST'
  }
]

export const initialB2CProducts: B2CProduct[] = [
  {
    id: 'prod-1',
    sku: 'VV-RG-18K-001',
    name: 'Royale Solitaire Diamond Ring 1.2ct',
    nameAr: 'خاتم سوليتير ألماس رويال 1.2 قيراط',
    category: 'Rings',
    goldColor: 'White Gold',
    purity: '18K',
    weightGrams: 4.85,
    goldRateSAR: 234.35,
    makingChargeSAR: 450.00,
    stoneDetails: '1.20ct Natural Diamond, VVS1 Clarity, E Color',
    stonePriceSAR: 14200.00,
    vatAmountSAR: 2367.99,
    finalPriceSAR: 18154.59,
    stock: 12,
    sizes: ['52 (US 6)', '54 (US 7)', '56 (US 7.5)'],
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'],
    certificate: 'GIA-6482910482',
    isBestSeller: true,
    isNewArrival: false,
    customizable: true,
    customizationOptions: {
      allowsEngraving: true,
      allowsCustomText: true
    },
    wishlistCount: 142,
    reviewsCount: 18,
    rating: 4.9,
    description: 'Masterfully crafted in 18K white gold with an exceptional GIA certified round brilliant diamond.'
  },
  {
    id: 'prod-2',
    sku: 'VV-NL-21K-014',
    name: 'Najdi Heritage Filigree Choker Necklace',
    nameAr: 'عقد شوكر نجدي تراثي مخرم',
    category: 'Necklaces',
    goldColor: 'Yellow Gold',
    purity: '21K',
    weightGrams: 32.40,
    goldRateSAR: 273.40,
    makingChargeSAR: 1250.00,
    stoneDetails: 'Pure 21K Gold Filigree, No Stones',
    stonePriceSAR: 0.00,
    vatAmountSAR: 1516.23,
    finalPriceSAR: 11624.39,
    stock: 7,
    sizes: ['40cm Adjustable'],
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'],
    certificate: 'Saudi Assay Hallmark 21K',
    isBestSeller: true,
    isNewArrival: true,
    customizable: false,
    wishlistCount: 210,
    reviewsCount: 24,
    rating: 5.0,
    description: 'Traditional Saudi Arabian filigree motif handcrafted in authentic 21 Karat gold.'
  },
  {
    id: 'prod-3',
    sku: 'VV-BR-18K-029',
    name: 'Pavé Emerald Tennis Bracelet',
    nameAr: 'سوار تنس ألماس وزمرد بافيه',
    category: 'Bracelets',
    goldColor: 'Yellow Gold',
    purity: '18K',
    weightGrams: 14.20,
    goldRateSAR: 234.35,
    makingChargeSAR: 1800.00,
    stoneDetails: '2.40ct Colombian Emeralds & 1.80ct F/VS Diamonds',
    stonePriceSAR: 9500.00,
    vatAmountSAR: 2194.16,
    finalPriceSAR: 16821.93,
    stock: 5,
    sizes: ['17 cm', '18 cm'],
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1611591475155-4284ec28d351?w=800&auto=format&fit=crop&q=80'],
    certificate: 'IGI Certified Diamond & Gemstone',
    isBestSeller: false,
    isNewArrival: true,
    customizable: true,
    customizationOptions: {
      allowsEngraving: true
    },
    wishlistCount: 88,
    reviewsCount: 9,
    rating: 4.7,
    description: 'Luminous alternating fine emeralds and brilliant diamonds set in solid 18K yellow gold.'
  },
  {
    id: 'prod-4',
    sku: 'VV-ER-18K-008',
    name: 'Celestial Diamond Drop Earrings',
    nameAr: 'أقراط متدلية ماسية بتصميم سماوي',
    category: 'Earrings',
    goldColor: 'Two-Tone',
    purity: '18K',
    weightGrams: 8.60,
    goldRateSAR: 234.35,
    makingChargeSAR: 680.00,
    stoneDetails: '1.05ct Brilliant Cut Diamonds VS2',
    stonePriceSAR: 4800.00,
    vatAmountSAR: 1124.31,
    finalPriceSAR: 8619.72,
    stock: 18,
    sizes: ['One Size (Drop 35mm)'],
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'],
    certificate: 'IGI Jewelry Report',
    isBestSeller: true,
    isNewArrival: false,
    customizable: false,
    wishlistCount: 165,
    reviewsCount: 15,
    rating: 4.8,
    description: 'Dynamic drop earrings designed to reflect light from every angle with supreme mobility.'
  },
  {
    id: 'prod-5',
    sku: 'VV-ST-21K-003',
    name: 'Sultana Bridal Grand Set (4-Piece)',
    nameAr: 'طقم عروس سلطانة الفاخر (4 قطع)',
    category: 'Bridal Sets',
    goldColor: 'Yellow Gold',
    purity: '21K',
    weightGrams: 118.50,
    goldRateSAR: 273.40,
    makingChargeSAR: 4200.00,
    stoneDetails: 'Fine micro-set zircon highlights and solid 21K gold',
    stonePriceSAR: 1200.00,
    vatAmountSAR: 5669.69,
    finalPriceSAR: 43467.59,
    stock: 3,
    sizes: ['Custom Bridal Fit'],
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'],
    certificate: 'Saudi Assay Office Certified',
    isBestSeller: false,
    isNewArrival: false,
    customizable: true,
    customizationOptions: {
      allowsEngraving: true,
      allowsCustomText: true
    },
    wishlistCount: 340,
    reviewsCount: 31,
    rating: 5.0,
    description: 'Comprehensive 4-piece bridal collection: necklace, tiara-style bracelet, earrings, and ring.'
  },
  {
    id: 'prod-6',
    sku: 'VV-MEN-21K-005',
    name: "Men's Heritage Saudi Signet Ring 21K",
    nameAr: 'خاتم رجالي تراثي عيار 21 بشعار السيفين والنخلة',
    category: 'Rings',
    goldColor: 'Yellow Gold',
    purity: '21K',
    weightGrams: 14.80,
    goldRateSAR: 273.40,
    makingChargeSAR: 750.00,
    stoneDetails: 'Solid 21K Gold with Natural Black Onyx Inlay',
    stonePriceSAR: 850.00,
    vatAmountSAR: 846.95,
    finalPriceSAR: 6493.27,
    stock: 9,
    sizes: ['60 (US 9)', '62 (US 10)', '64 (US 11)'],
    gender: 'Men',
    images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'],
    certificate: 'Saudi Assay Hallmark 21K',
    isBestSeller: true,
    isNewArrival: false,
    customizable: true,
    customizationOptions: {
      allowsEngraving: true,
      allowsCustomText: true
    },
    wishlistCount: 94,
    reviewsCount: 12,
    rating: 5.0,
    description: 'Distinguished men’s signet ring with hand-carved Saudi emblem and deep black natural onyx stone.'
  },
  {
    id: 'prod-7',
    sku: 'VV-MEN-18K-012',
    name: "Men's Guilloché Gold Cufflinks Set 18K",
    nameAr: 'طقم أزرار أكمام رجالية فاخرة عيار 18 بتصميم غيوشيه',
    category: 'Rings',
    goldColor: 'Two-Tone',
    purity: '18K',
    weightGrams: 16.20,
    goldRateSAR: 234.35,
    makingChargeSAR: 950.00,
    stoneDetails: 'Hand guilloché engraved solid gold with mother of pearl center',
    stonePriceSAR: 1100.00,
    vatAmountSAR: 876.97,
    finalPriceSAR: 6723.44,
    stock: 14,
    sizes: ['Standard Fit'],
    gender: 'Men',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
    certificate: 'Swiss Assay 750 / Saudi Assay Certified',
    isBestSeller: false,
    isNewArrival: true,
    customizable: true,
    customizationOptions: {
      allowsEngraving: true,
      allowsCustomText: true
    },
    wishlistCount: 68,
    reviewsCount: 7,
    rating: 4.8,
    description: 'Refined dual-tone white and yellow 18K gold cufflinks with bespoke monogram engraving option.'
  }
]

export const initialB2BProducts: B2BProduct[] = [
  {
    id: 'b2b-1',
    sku: 'VV-RAW-24K-GRAIN',
    name: '24K Fine Gold Casting Grain (999.9)',
    nameAr: 'حبيبات ذهب صب عيار 24 (999.9)',
    type: 'Raw Material',
    unit: 'grams',
    purity: '24K (999.9)',
    weightPerUnitGrams: 1,
    availableStock: 25400, // 25.4 kg in stock
    fixedWholesalePriceSAR: 314.20,
    minOrderQuantity: 100, // 100g min
    images: ['https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80'],
    description: 'Direct mint casting granules with 99.99% assay purity, ideal for vacuum casting and fine workshops.'
  },
  {
    id: 'b2b-2',
    sku: 'VV-BUL-24K-1KG',
    name: '1 Kilogram Pure Gold Bullion Bar (999.9)',
    nameAr: 'سبيكة ذهب نقي 1 كيلوجرام (999.9)',
    type: 'Bullion',
    unit: 'kilograms',
    purity: '24K (999.9)',
    weightPerUnitGrams: 1000,
    availableStock: 18,
    fixedWholesalePriceSAR: 313500.00,
    minOrderQuantity: 1,
    images: ['https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=800&auto=format&fit=crop&q=80'],
    description: 'LBMA accredited stamped investment bars with serialized assay certification certificate.'
  },
  {
    id: 'b2b-3',
    sku: 'VV-FND-18K-LOCKS',
    name: '18K Italian Lobster Clasps (Box of 50 pcs)',
    nameAr: 'أقفال إيطالية ذهب عيار 18 (علبة 50 قطعة)',
    type: 'Findings',
    unit: 'pieces',
    purity: '18K (750)',
    weightPerUnitGrams: 1.15,
    availableStock: 450,
    fixedWholesalePriceSAR: 380.00,
    minOrderQuantity: 5,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
    description: 'High-durability precision Italian spring lobster clasps for jewellery manufacturers and ateliers.'
  },
  {
    id: 'b2b-4',
    sku: 'VV-WHL-21K-BANGLES',
    name: 'Wholesale Pre-finished 21K Laser-Cut Bangles',
    nameAr: 'أساور ذهب عيار 21 مقطوعة بالليزر بالجملة',
    type: 'Wholesale Finished',
    unit: 'grams',
    purity: '21K (875)',
    weightPerUnitGrams: 1,
    availableStock: 8600,
    fixedWholesalePriceSAR: 279.50,
    minOrderQuantity: 250,
    images: ['https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80'],
    description: 'Ready-for-retail finished bangles ready for immediate shop floor display by jewellery retailers.'
  },
  {
    id: 'b2b-5',
    sku: 'VV-BUL-24K-100G',
    name: '100 Grams Minted Investment Gold Bar (999.9)',
    nameAr: 'سبيكة ذهب صافي 100 جرام مصكوكة (999.9)',
    type: 'Bullion',
    unit: 'pieces',
    purity: '24K (999.9)',
    weightPerUnitGrams: 100,
    availableStock: 85,
    fixedWholesalePriceSAR: 31450.00,
    minOrderQuantity: 1,
    images: ['https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80'],
    description: 'Security blister-packed 100g minted gold bars with verifiable QR assay certification.'
  }
]

export const initialB2COrders: B2COrder[] = [
  {
    id: 'b2c-ord-1',
    orderNumber: 'VV-B2C-10492',
    customerName: 'Nouf Al-Shahrani',
    customerPhone: '+966 50 128 4491',
    customerEmail: 'nouf.shahrani@gmail.com',
    date: '2026-09-23 11:20 AM',
    itemsCount: 1,
    totalAmountSAR: 18154.59,
    nafathVerified: true,
    paymentMethod: 'Moyasar (Apple Pay)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'In Production',
    shippingAddress: 'Al-Nakheel District, Riyadh 12381, KSA',
    courier: 'SMSA Express',
    trackingNumber: 'SMSA-99210482',
    orderType: 'Custom Jewellery',
    customRequestId: 'REQ-7094',
    items: [
      {
        productName: 'Royale Solitaire Diamond Ring 1.2ct',
        sku: 'VV-RG-18K-001',
        quantity: 1,
        priceSAR: 18154.59
      }
    ]
  },
  {
    id: 'b2c-ord-2',
    orderNumber: 'VV-B2C-10491',
    customerName: 'Tariq Al-Harbi',
    customerPhone: '+966 55 994 3122',
    customerEmail: 'tariq.harbi@outlook.sa',
    date: '2026-09-23 09:45 AM',
    itemsCount: 2,
    totalAmountSAR: 20244.11,
    nafathVerified: true,
    paymentMethod: 'Moyasar (Mada)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    shippingAddress: 'Al-Shati District, Jeddah 23514, KSA',
    courier: 'Aramex Gold Safe',
    trackingNumber: 'ARM-77291039',
    items: [
      {
        productName: 'Najdi Heritage Filigree Choker Necklace',
        sku: 'VV-NL-21K-014',
        quantity: 1,
        priceSAR: 11624.39
      },
      {
        productName: 'Celestial Diamond Drop Earrings',
        sku: 'VV-ER-18K-008',
        quantity: 1,
        priceSAR: 8619.72
      }
    ]
  },
  {
    id: 'b2c-ord-3',
    orderNumber: 'VV-B2C-10490',
    customerName: 'Sarah Bint Fahad',
    customerPhone: '+966 54 331 8820',
    customerEmail: 'sarah.f@yahoo.com',
    date: '2026-09-22 04:15 PM',
    itemsCount: 1,
    totalAmountSAR: 43467.59,
    nafathVerified: true,
    paymentMethod: 'Moyasar (Visa/MC)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    shippingAddress: 'Al-Faisaliyah, Al Khobar 34423, KSA',
    courier: 'DHL Express SafeVal',
    trackingNumber: 'DHL-44910283',
    items: [
      {
        productName: 'Sultana Bridal Grand Set (4-Piece)',
        sku: 'VV-ST-21K-003',
        quantity: 1,
        priceSAR: 43467.59
      }
    ]
  },
  {
    id: 'b2c-ord-4',
    orderNumber: 'VV-B2C-10489',
    customerName: 'Faisal Al-Qahtani',
    customerPhone: '+966 56 448 9110',
    customerEmail: 'faisal.q@hotmail.com',
    date: '2026-09-22 01:10 PM',
    itemsCount: 1,
    totalAmountSAR: 16821.93,
    nafathVerified: false,
    paymentMethod: 'Moyasar (Mada)',
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Processing',
    shippingAddress: 'Al-Olaya, Riyadh 12211, KSA',
    courier: 'Awaiting Nafath verification',
    trackingNumber: 'Pending',
    items: [
      {
        productName: 'Pavé Emerald Tennis Bracelet',
        sku: 'VV-BR-18K-029',
        quantity: 1,
        priceSAR: 16821.93
      }
    ]
  }
]

export const initialB2BOrders: B2BOrder[] = [
  {
    id: 'b2b-ord-1',
    orderNumber: 'VV-B2B-8092',
    businessName: 'Al-Yamama Fine Jewellery Est.',
    buyerName: 'Abdullah Al-Dossary',
    crNumber: '1010892411',
    vatNumber: '310294821000003',
    date: '2026-09-24 10:15 AM',
    totalUnits: 1000,
    unitType: 'grams (24K Grain)',
    totalAmountSAR: 314200.00,
    paymentMethod: 'Moyasar (Direct B2B Transfer)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'In Transit',
    status: 'Pending',
    pricingType: 'Fixed Rate',
    fixedRateSAR: 314.20,
    rateLockRef: 'RL-2026-9041',
    shippingCity: 'Riyadh Gold Souq, Batha',
    trackingNumber: 'VAL-SA-9901',
    items: [
      {
        productName: '24K Fine Gold Casting Grain (999.9)',
        sku: 'VV-RAW-24K-GRAIN',
        units: 1000,
        ratePerUnitSAR: 314.20,
        totalSAR: 314200.00
      }
    ]
  },
  {
    id: 'b2b-ord-2',
    orderNumber: 'VV-B2B-8091',
    businessName: 'Red Sea Gold Trading Co.',
    buyerName: 'Mohammed Bin Laden Jr.',
    crNumber: '4030192847',
    vatNumber: '300928174100003',
    date: '2026-09-23 02:40 PM',
    totalUnits: 2,
    unitType: 'kilograms (Bullion)',
    totalAmountSAR: 627000.00,
    paymentMethod: 'Moyasar (Direct B2B Transfer)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    status: 'Completed',
    pricingType: 'Fixed Rate',
    fixedRateSAR: 313500.00,
    rateLockRef: 'RL-2026-9039',
    shippingCity: 'Al-Balad Souk, Jeddah',
    trackingNumber: 'BRINKS-SA-4410',
    items: [
      {
        productName: '1 Kilogram Pure Gold Bullion Bar (999.9)',
        sku: 'VV-BUL-24K-1KG',
        units: 2,
        ratePerUnitSAR: 313500.00,
        totalSAR: 627000.00
      }
    ]
  },
  {
    id: 'b2b-ord-3',
    orderNumber: 'VV-B2B-8090',
    businessName: 'Dammam Diamond Ateliers',
    buyerName: 'Zaid Al-Mansoor',
    crNumber: '2050991823',
    vatNumber: '310492819000003',
    date: '2026-09-23 11:30 AM',
    totalUnits: 50,
    unitType: 'pieces (Mounts)',
    totalAmountSAR: 167500.00,
    paymentMethod: 'Moyasar (Corporate Card)',
    paymentStatus: 'Processing',
    fulfillmentStatus: 'On Hold',
    status: 'Pending',
    pricingType: 'Negotiation',
    quotationPriceSAR: 3600.00,
    customerOfferSAR: 3200.00,
    counterOfferSAR: 3350.00,
    negotiationStatus: 'Counter-Offered',
    shippingCity: 'Al-Dammam City Center',
    trackingNumber: 'SMSA-B2B-1849',
    items: [
      {
        productName: '18K Diamond Solitaire Mounts (Bulk Lot)',
        sku: 'VV-FND-18K-MOUNTS',
        units: 50,
        ratePerUnitSAR: 3350.00,
        totalSAR: 167500.00
      }
    ]
  },
  {
    id: 'b2b-ord-4',
    orderNumber: 'VV-B2B-8089',
    businessName: 'Riyadh Royal Bullion House',
    buyerName: 'Nasser Al-Subaie',
    crNumber: '1010772819',
    vatNumber: '310129482000003',
    date: '2026-09-22 04:15 PM',
    totalUnits: 10,
    unitType: 'pieces (100g Ingots)',
    totalAmountSAR: 315000.00,
    paymentMethod: 'Moyasar (Direct B2B Transfer)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    status: 'Completed',
    pricingType: 'Fixed Rate',
    fixedRateSAR: 31500.00,
    rateLockRef: 'RL-2026-9038',
    shippingCity: 'Al-Olaya Towers, Riyadh',
    trackingNumber: 'VAL-SA-8820',
    items: [
      {
        productName: '24K Minted Gold Ingots (100g Assay Card)',
        sku: 'VV-BUL-24K-100G',
        units: 10,
        ratePerUnitSAR: 31500.00,
        totalSAR: 315000.00
      }
    ]
  },
  {
    id: 'b2b-ord-5',
    orderNumber: 'VV-B2B-8088',
    businessName: 'Taif Goldsmiths Guild',
    buyerName: 'Sultan Al-Harbi',
    crNumber: '4031992810',
    vatNumber: '300892814000003',
    date: '2026-09-22 09:30 AM',
    totalUnits: 25,
    unitType: 'sets (Traditional)',
    totalAmountSAR: 420000.00,
    paymentMethod: 'Bank Wire (SNB)',
    paymentStatus: 'Pending Wire',
    fulfillmentStatus: 'Preparing Dispatch',
    status: 'Pending',
    pricingType: 'Negotiation',
    quotationPriceSAR: 18500.00,
    customerOfferSAR: 16800.00,
    negotiationStatus: 'Offer Pending Review',
    shippingCity: 'Taif Central Market',
    trackingNumber: 'SMSA-B2B-1902',
    items: [
      {
        productName: '21K Saudi Traditional Choker Sets',
        sku: 'VV-SET-21K-TRAD',
        units: 25,
        ratePerUnitSAR: 16800.00,
        totalSAR: 420000.00
      }
    ]
  },
  {
    id: 'b2b-ord-6',
    orderNumber: 'VV-B2B-8087',
    businessName: 'Al-Khobar Luxury Jewels W.L.L.',
    buyerName: 'Hassan Al-Majed',
    crNumber: '2051882910',
    vatNumber: '310992817000003',
    date: '2026-09-21 03:00 PM',
    totalUnits: 30,
    unitType: 'pieces (Bracelets)',
    totalAmountSAR: 405000.00,
    paymentMethod: 'Moyasar (Direct B2B Transfer)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    status: 'Completed',
    pricingType: 'Negotiation',
    quotationPriceSAR: 14200.00,
    customerOfferSAR: 13500.00,
    counterOfferSAR: 13500.00,
    negotiationStatus: 'Offer Accepted',
    shippingCity: 'Corniche District, Al-Khobar',
    trackingNumber: 'VAL-SA-7719',
    items: [
      {
        productName: '18K Italian Diamond Tennis Bracelets',
        sku: 'VV-BR-18K-TENNIS',
        units: 30,
        ratePerUnitSAR: 13500.00,
        totalSAR: 405000.00
      }
    ]
  },
  {
    id: 'b2b-ord-7',
    orderNumber: 'VV-B2B-8086',
    businessName: 'Hejaz Precious Metals Co.',
    buyerName: 'Khalid Al-Qurashi',
    crNumber: '4030882194',
    vatNumber: '300281948000003',
    date: '2026-09-21 11:10 AM',
    totalUnits: 2500,
    unitType: 'grams (999.9)',
    totalAmountSAR: 782000.00,
    paymentMethod: 'Moyasar (Direct B2B Transfer)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    status: 'Completed',
    pricingType: 'Fixed Rate',
    fixedRateSAR: 312.80,
    rateLockRef: 'RL-2026-9035',
    shippingCity: 'Makkah Industrial Zone',
    trackingNumber: 'BRINKS-SA-3829',
    items: [
      {
        productName: '999.9 Gold Granules (Batch 44-A)',
        sku: 'VV-RAW-24K-GRAIN',
        units: 2500,
        ratePerUnitSAR: 312.80,
        totalSAR: 782000.00
      }
    ]
  },
  {
    id: 'b2b-ord-8',
    orderNumber: 'VV-B2B-8085',
    businessName: 'Arabian Gulf Jewellery Workshop',
    buyerName: 'Fahad Al-Otaibi',
    crNumber: '1010992837',
    vatNumber: '310382910000003',
    date: '2026-09-20 01:25 PM',
    totalUnits: 1500,
    unitType: 'grams (Alloy)',
    totalAmountSAR: 315000.00,
    paymentMethod: 'Bank Wire (SNB)',
    paymentStatus: 'Failed',
    fulfillmentStatus: 'Cancelled',
    status: 'Cancelled',
    pricingType: 'Negotiation',
    quotationPriceSAR: 245.00,
    customerOfferSAR: 210.00,
    negotiationStatus: 'Offer Declined',
    shippingCity: 'Batha Gold Market, Riyadh',
    trackingNumber: 'N/A',
    items: [
      {
        productName: '18K Gold Master Alloy Castings',
        sku: 'VV-RAW-18K-ALLOY',
        units: 1500,
        ratePerUnitSAR: 210.00,
        totalSAR: 315000.00
      }
    ]
  },
  {
    id: 'b2b-ord-9',
    orderNumber: 'VV-B2B-8084',
    businessName: 'Najd Bullion & Coin Traders',
    buyerName: 'Yousef Al-Mutawa',
    crNumber: '1010662819',
    vatNumber: '310482918000003',
    date: '2026-09-19 10:45 AM',
    totalUnits: 1,
    unitType: 'kilograms (PAMP)',
    totalAmountSAR: 314000.00,
    paymentMethod: 'Moyasar (Direct B2B Transfer)',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    status: 'Completed',
    pricingType: 'Fixed Rate',
    fixedRateSAR: 314000.00,
    rateLockRef: 'RL-2026-9032',
    shippingCity: 'Al-Suwaidi, Riyadh',
    trackingNumber: 'VAL-SA-6610',
    items: [
      {
        productName: '1kg Investment Gold Bars (PAMP Fortuna)',
        sku: 'VV-BUL-24K-1KG',
        units: 1,
        ratePerUnitSAR: 314000.00,
        totalSAR: 314000.00
      }
    ]
  },
  {
    id: 'b2b-ord-10',
    orderNumber: 'VV-B2B-8083',
    businessName: 'Qassim Custom Gems Atelier',
    buyerName: 'Rayan Al-Ghamdi',
    crNumber: '3050119283',
    vatNumber: '300392817000003',
    date: '2026-09-18 04:50 PM',
    totalUnits: 20,
    unitType: 'pieces (Settings)',
    totalAmountSAR: 84000.00,
    paymentMethod: 'Moyasar (Corporate Card)',
    paymentStatus: 'Failed',
    fulfillmentStatus: 'Cancelled',
    status: 'Cancelled',
    pricingType: 'Negotiation',
    quotationPriceSAR: 5800.00,
    customerOfferSAR: 4200.00,
    negotiationStatus: 'Offer Declined',
    shippingCity: 'Buraidah Central Souq',
    trackingNumber: 'N/A',
    items: [
      {
        productName: 'Bespoke Platinum & Emerald Ring Settings',
        sku: 'VV-SET-PLAT-RING',
        units: 20,
        ratePerUnitSAR: 4200.00,
        totalSAR: 84000.00
      }
    ]
  }
]

export const initialB2CCustomers: B2CCustomer[] = [
  {
    id: 'cust-1',
    name: 'Nouf Al-Shahrani',
    email: 'nouf.shahrani@gmail.com',
    phone: '+966 50 128 4491',
    city: 'Riyadh',
    nafathVerified: true,
    nafathIdMasked: '109****491',
    totalOrders: 4,
    totalSpentSAR: 58240.00,
    wishlistItemsCount: 5,
    savedAddressesCount: 2,
    returnRequestsCount: 0,
    joinedDate: 'Jan 2026',
    lastActive: '10 mins ago'
  },
  {
    id: 'cust-2',
    name: 'Tariq Al-Harbi',
    email: 'tariq.harbi@outlook.sa',
    phone: '+966 55 994 3122',
    city: 'Jeddah',
    nafathVerified: true,
    nafathIdMasked: '108****122',
    totalOrders: 3,
    totalSpentSAR: 39400.00,
    wishlistItemsCount: 2,
    savedAddressesCount: 1,
    returnRequestsCount: 0,
    joinedDate: 'Feb 2026',
    lastActive: '2 hours ago'
  },
  {
    id: 'cust-3',
    name: 'Sarah Bint Fahad',
    email: 'sarah.f@yahoo.com',
    phone: '+966 54 331 8820',
    city: 'Al Khobar',
    nafathVerified: true,
    nafathIdMasked: '107****820',
    totalOrders: 6,
    totalSpentSAR: 112500.00,
    wishlistItemsCount: 12,
    savedAddressesCount: 3,
    returnRequestsCount: 1,
    joinedDate: 'Nov 2025',
    lastActive: 'Yesterday'
  },
  {
    id: 'cust-4',
    name: 'Faisal Al-Qahtani',
    email: 'faisal.q@hotmail.com',
    phone: '+966 56 448 9110',
    city: 'Riyadh',
    nafathVerified: false,
    nafathIdMasked: 'Unverified',
    totalOrders: 1,
    totalSpentSAR: 16821.93,
    wishlistItemsCount: 1,
    savedAddressesCount: 1,
    returnRequestsCount: 0,
    joinedDate: 'Sep 2026',
    lastActive: 'Today'
  }
]

export const initialB2BBuyers: B2BBuyer[] = [
  {
    id: 'buyer-1',
    companyName: 'Al-Yamama Fine Jewellery Est.',
    contactPerson: 'Abdullah Al-Dossary',
    email: 'procurement@alyamama-jewels.sa',
    phone: '+966 11 411 9000',
    city: 'Riyadh',
    crNumber: '1010892411',
    vatNumber: '310294821000003',
    tier: 'Diamond Wholesale',
    totalOrders: 18,
    totalVolumeGrams: 14500,
    totalSpendSAR: 4560000.00,
    status: 'Approved',
    businessType: 'Retail Jewellery Chain',
    licenceNumber: 'MOC-RYD-882104',
    nationalAddress: 'Bldg 3492, King Fahd Road, Al Olaya Dist, Riyadh 12214, Saudi Arabia',
    businessAddress: 'Showroom 12, Gold Souq Complex, Al Bathaa, Riyadh',
    website: 'https://alyamama-jewels.sa',
    logoUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&auto=format&fit=crop&q=60',
    shopPhotos: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?w=500&auto=format&fit=crop&q=60'
    ],
    crDocumentUrl: '/docs/cr-1010892411.pdf',
    licenceDocumentUrl: '/docs/licence-882104.pdf',
    vatCertificateUrl: '/docs/vat-3102948210.pdf',
    ownerName: 'Sheikh Abdullah Bin Saleh Al-Dossary',
    ownerEmail: 'abdullah.dossary@gmail.com',
    ownerMobile: '+966 50 411 9000',
    ownerIdNumber: '1098234812',
    ownerIdDocumentUrl: '/docs/national-id-dossary.pdf',
    registrationDate: '12 Jan 2026',
    approvalDate: '14 Jan 2026',
    averageOrderValueSAR: 253333.33,
    lastPurchaseDate: '26 Sep 2026',
    frequentlyPurchasedCategories: ['21K Saudi Gold Bullion', '24K Raw Kilobars', '18K Diamond Castings'],
    frequentlyPurchasedProducts: ['1000g Bullion Bar 999.9', '18K Diamond Tennis Mountings', '21K Heavy Sovereign Coins'],
    purchaseFrequency: 'Weekly Buyer'
  },
  {
    id: 'buyer-2',
    companyName: 'Red Sea Gold Trading Co.',
    contactPerson: 'Mohammed Bin Laden Jr.',
    email: 'trading@redseagold.com',
    phone: '+966 12 667 3320',
    city: 'Jeddah',
    crNumber: '4030192847',
    vatNumber: '300928174100003',
    tier: 'Diamond Wholesale',
    totalOrders: 29,
    totalVolumeGrams: 32000,
    totalSpendSAR: 10040000.00,
    status: 'Approved',
    businessType: 'Precious Metal Wholesaler',
    licenceNumber: 'MOC-JED-919240',
    nationalAddress: 'Al-Madinah Al-Munawarah Rd, Al-Faisaliyah, Jeddah 23442, Saudi Arabia',
    businessAddress: 'Level 4, Jewellery Trade Center, Al Balad, Jeddah',
    website: 'https://redseagold.com',
    logoUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=200&auto=format&fit=crop&q=60',
    shopPhotos: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60'
    ],
    crDocumentUrl: '/docs/cr-4030192847.pdf',
    licenceDocumentUrl: '/docs/licence-919240.pdf',
    vatCertificateUrl: '/docs/vat-3009281741.pdf',
    ownerName: 'Mohammed Tariq Bin Laden',
    ownerEmail: 'm.binladen@redseagold.com',
    ownerMobile: '+966 55 667 3320',
    ownerIdNumber: '1049281745',
    ownerIdDocumentUrl: '/docs/national-id-binladen.pdf',
    registrationDate: '04 Nov 2025',
    approvalDate: '06 Nov 2025',
    averageOrderValueSAR: 346206.90,
    lastPurchaseDate: '24 Sep 2026',
    frequentlyPurchasedCategories: ['24K Raw Bullion', '22K Coin Bundles'],
    frequentlyPurchasedProducts: ['500g Gold Ingot 24K', '22K Saudi Guinea Lot'],
    purchaseFrequency: 'Weekly Buyer'
  },
  {
    id: 'buyer-3',
    companyName: 'Dammam Diamond Ateliers',
    contactPerson: 'Zaid Al-Mansoor',
    email: 'zaid@dammam-diamonds.com',
    phone: '+966 13 833 4410',
    city: 'Dammam',
    crNumber: '2050991823',
    vatNumber: '310492819000003',
    tier: 'Workshop Partner',
    totalOrders: 12,
    totalVolumeGrams: 3800,
    totalSpendSAR: 980000.00,
    status: 'Approved',
    businessType: 'Jewellery Workshop & Manufacturer',
    licenceNumber: 'MOC-DMM-491023',
    nationalAddress: 'Industrial Area 1, Street 14, Dammam 32234, Saudi Arabia',
    businessAddress: 'Atelier Suite 201, Diamond Artisans Tower, Dammam',
    website: 'https://dammam-diamonds.com',
    logoUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=60',
    shopPhotos: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60'
    ],
    crDocumentUrl: '/docs/cr-2050991823.pdf',
    licenceDocumentUrl: '/docs/licence-491023.pdf',
    vatCertificateUrl: '/docs/vat-3104928190.pdf',
    ownerName: 'Zaid Ibrahim Al-Mansoor',
    ownerEmail: 'zaid.mansoor@gmail.com',
    ownerMobile: '+966 54 833 4410',
    ownerIdNumber: '1074829103',
    ownerIdDocumentUrl: '/docs/national-id-mansoor.pdf',
    registrationDate: '15 Feb 2026',
    approvalDate: '18 Feb 2026',
    averageOrderValueSAR: 81666.67,
    lastPurchaseDate: '19 Sep 2026',
    frequentlyPurchasedCategories: ['18K Mountings', 'Findings & Clasps'],
    frequentlyPurchasedProducts: ['18K White Gold Earring Settings', 'Lobster Claw Clasps 18K (100pc)'],
    purchaseFrequency: 'Monthly Buyer'
  },
  {
    id: 'buyer-4',
    companyName: 'Luluat Al-Khaleej Jewellery',
    contactPerson: 'Sultan Al-Harbi',
    email: 'info@luluat-khaleej.sa',
    phone: '+966 11 290 8844',
    city: 'Riyadh',
    crNumber: '1010773921',
    vatNumber: '310992384100003',
    tier: 'Gold Retailer',
    totalOrders: 0,
    totalVolumeGrams: 0,
    totalSpendSAR: 0.00,
    status: 'Pending Review',
    businessType: 'Retail Boutique & Custom Jeweller',
    licenceNumber: 'MOC-RYD-772910',
    nationalAddress: 'Prince Mohammed Bin Abdulaziz Rd, Al Olaya, Riyadh 12331, Saudi Arabia',
    businessAddress: 'Shop 08, Panorama Mall Gold Avenue, Riyadh',
    website: 'https://luluat-khaleej.sa',
    logoUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=60',
    shopPhotos: [
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=500&auto=format&fit=crop&q=60'
    ],
    crDocumentUrl: '/docs/cr-1010773921.pdf',
    licenceDocumentUrl: '/docs/licence-772910.pdf',
    vatCertificateUrl: '/docs/vat-3109923841.pdf',
    ownerName: 'Sultan Fahad Al-Harbi',
    ownerEmail: 'sultan.alharbi@gmail.com',
    ownerMobile: '+966 50 290 8844',
    ownerIdNumber: '1088219482',
    ownerIdDocumentUrl: '/docs/national-id-harbi.pdf',
    registrationDate: '27 Sep 2026',
    approvalDate: undefined,
    averageOrderValueSAR: 0,
    lastPurchaseDate: 'None',
    frequentlyPurchasedCategories: ['None yet'],
    frequentlyPurchasedProducts: ['None yet'],
    purchaseFrequency: 'Occasional Buyer'
  }
]

export const initialCustomJewelleryCAD: CustomJewelleryCAD[] = [
  {
    id: 'cad-1',
    referenceId: 'CAD-2026-081',
    customerName: 'Hessa Al-Muhaidib',
    customerPhone: '+966 50 441 2288',
    customerEmail: 'hessa.m@gmail.com',
    requestType: 'Custom CAD Design',
    targetMetal: '18K White Gold',
    targetBudgetSAR: 25000,
    dimensions: 'Size 54, Central Stone 2.0ct Oval Cut',
    referenceImages: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'],
    notes: 'Looking for a vintage Edwardian halo setting with pave diamonds on the band. Engraving inside: "Forever M&H 2026".',
    submittedDate: '2026-09-22',
    deadline: '2026-10-15',
    status: 'CAD In Progress',
    quotedPriceSAR: 23500,
    designerAssigned: 'Kareem Designer (Senior 3D Artist)'
  },
  {
    id: 'cad-2',
    referenceId: 'CAD-2026-080',
    customerName: 'Sultan Bin Abdulaziz',
    customerPhone: '+966 55 119 7733',
    customerEmail: 'sultan.az@almutlaq.com',
    requestType: 'STL File Production',
    targetMetal: '21K Saudi Gold',
    targetBudgetSAR: 18000,
    dimensions: 'Men’s signet ring with family crest (22mm x 18mm face)',
    referenceImages: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'],
    notes: 'We have our own 2D vector crest. Need high precision 3D CAD modeling and watertight STL generation for rapid prototyping.',
    submittedDate: '2026-09-20',
    deadline: '2026-09-28',
    status: 'Approved',
    quotedPriceSAR: 2800,
    designerAssigned: 'Maya Al-Zahrani'
  },
  {
    id: 'cad-3',
    referenceId: 'CAD-2026-079',
    customerName: 'Reem Al-Olayan',
    customerPhone: '+966 53 772 1109',
    customerEmail: 'reem.olayan@corp.sa',
    requestType: '3D Jewellery Modelling',
    targetMetal: '18K Yellow Gold',
    targetBudgetSAR: 45000,
    dimensions: 'Multi-layer floral statement necklace with 3D articulated petals',
    referenceImages: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'],
    notes: 'Must allow natural flex and movement around the neck. Require photorealistic 3D render video before metal casting.',
    submittedDate: '2026-09-18',
    deadline: '2026-10-20',
    status: 'Client Review',
    quotedPriceSAR: 42000,
    designerAssigned: 'Kareem Designer'
  }
]

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Rings',
    nameAr: 'خواتم',
    type: 'B2C Jewellery',
    itemCount: 48,
    purityDefault: '18K / 21K',
    icon: 'Sparkles',
    description: 'Solitaire, halo, eternity, and stackable bridal and lifestyle rings.'
  },
  {
    id: 'cat-2',
    name: 'Necklaces & Pendants',
    nameAr: 'قلائد وسلاسل',
    type: 'B2C Jewellery',
    itemCount: 36,
    purityDefault: '18K / 21K',
    icon: 'Gem',
    description: 'Chokers, diamond tennis chains, gold coin pendants, and custom name necklaces.'
  },
  {
    id: 'cat-3',
    name: 'Bracelets & Bangles',
    nameAr: 'أساور وغوايش',
    type: 'B2C Jewellery',
    itemCount: 29,
    purityDefault: '21K / 18K',
    icon: 'CircleDot',
    description: 'Heritage Saudi bangles, diamond pavé tennis bracelets, and charm cuffs.'
  },
  {
    id: 'cat-4',
    name: 'Earrings',
    nameAr: 'أقراط وحلقان',
    type: 'B2C Jewellery',
    itemCount: 42,
    purityDefault: '18K',
    icon: 'Star',
    description: 'Studs, hoops, ear cuffs, and long chandelier drops with certified stones.'
  },
  {
    id: 'cat-5',
    name: 'Bridal Sets',
    nameAr: 'أطقم عرائس',
    type: 'B2C Jewellery',
    itemCount: 15,
    purityDefault: '21K',
    icon: 'Crown',
    description: 'High luxury 3-piece and 4-piece coordinated bridal wedding suites.'
  },
  {
    id: 'cat-6',
    name: 'Casting Grains & Granules',
    nameAr: 'حبيبات صب الذهب',
    type: 'B2B Wholesale',
    itemCount: 8,
    purityDefault: '24K (999.9)',
    icon: 'Boxes',
    description: 'Ultra pure certified casting grains for vacuum induction and centrifugal casting.'
  },
  {
    id: 'cat-7',
    name: 'Bullion & Investment Bars',
    nameAr: 'سبائك استثمارية',
    type: 'B2B Wholesale',
    itemCount: 12,
    purityDefault: '24K (999.9)',
    icon: 'Layers',
    description: '10g, 50g, 100g, 1kg serialized bullion bars with assay stamps.'
  },
  {
    id: 'cat-8',
    name: 'Findings, Mounts & Clasps',
    nameAr: 'مستلزمات وأقفال الصاغة',
    type: 'B2B Wholesale',
    itemCount: 64,
    purityDefault: '18K / 21K',
    icon: 'Wrench',
    description: 'Lobster locks, spring rings, earring backs, solder wire, and semi-mounts.'
  }
]

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'VENVISION10',
    discountType: 'Percentage',
    discountValue: 10,
    applicableTo: 'B2C Only',
    minSpendSAR: 5000,
    startDate: '2026-09-01',
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 142,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'EIDGOLD',
    discountType: 'Fixed SAR',
    discountValue: 500,
    applicableTo: 'All',
    minSpendSAR: 10000,
    startDate: '2026-09-15',
    expiryDate: '2026-10-15',
    usageLimit: 200,
    usedCount: 78,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'B2BVOLUME',
    discountType: 'Percentage',
    discountValue: 3,
    applicableTo: 'B2B Only',
    minSpendSAR: 100000,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 50,
    usedCount: 19,
    isActive: true
  }
]

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productName: 'Royale Solitaire Diamond Ring 1.2ct',
    customerName: 'Noura Al-Otaibi',
    rating: 5,
    comment: 'The 3D viewer on the website was extremely helpful to inspect the prongs. The ring arrived in Riyadh within 48 hours with full GIA certificate!',
    date: '2026-09-21',
    status: 'Approved',
    verifiedBuyer: true
  },
  {
    id: 'rev-2',
    productName: 'Najdi Heritage Filigree Choker Necklace',
    customerName: 'Maha Al-Sudairi',
    rating: 5,
    comment: 'Authentic 21K gold weight and stunning craftsmanship. You can feel the real heritage quality. Nafath sign-in was quick and reassuring.',
    date: '2026-09-19',
    status: 'Approved',
    verifiedBuyer: true
  },
  {
    id: 'rev-3',
    productName: 'Celestial Diamond Drop Earrings',
    customerName: 'Lulwa Al-Ghamdi',
    rating: 4,
    comment: 'Brilliant sparkle and very lightweight on the ears. Packaging and safe delivery courier were top notch.',
    date: '2026-09-17',
    status: 'Approved',
    verifiedBuyer: true
  }
]

export const initialBanners = [
  {
    id: 'ban-1',
    title: 'The Royal Autumn High Jewellery Collection',
    titleAr: 'مجموعة الخريف الملكية للمجوهرات الراقية',
    subtitle: 'Handcrafted in 18K and 21K gold with certified conflict-free diamonds.',
    ctaText: 'Explore Collection',
    link: '/b2c/products',
    active: true,
    badge: 'New Season'
  },
  {
    id: 'ban-2',
    title: 'B2B Direct Wholesale: 24K Mint Casting Grains & Bullion',
    titleAr: 'تجارة الجملة المباشرة: حبيبات صب عيار 24 وسبائك استثمارية',
    subtitle: 'Transparent real-time wholesale pricing for certified jewellery ateliers and shops.',
    ctaText: 'View Wholesale Stock',
    link: '/b2b/products',
    active: true,
    badge: 'B2B Portal'
  }
]
