export type CustomRequestType = 'Product Customization' | 'Full Custom Design'

export type CustomRequestStatus =
  | 'New'
  | 'Under Review'
  | 'Awaiting Customer'
  | 'Design Confirmed'
  | 'In Production'
  | 'Completed'
  | 'Rejected'

export interface OriginalProductInfo {
  name: string
  sku: string
  image: string
  originalPrice: number
  category: string
}

export interface CustomChangesInfo {
  goldKarat?: string
  goldColor?: string
  stone?: string
  size?: string
  engraving?: string
  specialInstructions?: string
}

export interface FullCustomDesignInfo {
  jewelleryType: string
  materialPreference: string
  customerDescription: string
  photos: string[]
  sizeMeasurements: string
  additionalRequirements?: string
  customerBudget?: number
}

export interface QuotationInfo {
  originalPrice?: number
  customizationAdjustment?: number
  materialsEstimate?: number
  laborEstimate?: number
  finalQuote: number
}

export interface CustomJewelleryRequest {
  id: string
  type: CustomRequestType
  customerName: string
  customerEmail: string
  customerPhone: string
  jewellery: string
  requestDetails: string
  referenceImages: string[]
  status: CustomRequestStatus
  submittedDate: string
  dateCategory: 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'This Month' | 'Older'
  originalProduct?: OriginalProductInfo
  customChanges?: CustomChangesInfo
  fullCustomDesign?: FullCustomDesignInfo
  quotation: QuotationInfo
}

export const MOCK_CUSTOM_REQUESTS: CustomJewelleryRequest[] = [
  // 1. REQ-7091: Product Customization (New)
  {
    id: 'REQ-7091',
    type: 'Product Customization',
    customerName: 'Sarah Al-Ghamdi',
    customerEmail: 'sarah.ghamdi@gmail.com',
    customerPhone: '+966 50 123 4567',
    jewellery: 'Floral Diamond Ring',
    requestDetails: 'Change to 21K yellow gold, size 9 and add engraving',
    referenceImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'New',
    submittedDate: '24 Sep 2026, 11:20',
    dateCategory: 'Today',
    originalProduct: {
      name: 'Eternity Floral Diamond Halo Ring',
      sku: 'VV-RNG-0842',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      originalPrice: 32500,
      category: 'Rings'
    },
    customChanges: {
      goldKarat: '21K (was 18K)',
      goldColor: 'Yellow Gold (was White Gold)',
      stone: '1.20ct Round Brilliant VVS1 Diamond',
      size: 'Size 9 (Standard was Size 7)',
      engraving: '"Forever & Always — S & M 2026"',
      specialInstructions: 'Ensure prong security for 21K softer alloy and mirror high-polish on inner curve.'
    },
    quotation: {
      originalPrice: 32500,
      customizationAdjustment: 4200,
      finalQuote: 36700
    }
  },

  // 2. REQ-7092: Full Custom Design (Under Review)
  {
    id: 'REQ-7092',
    type: 'Full Custom Design',
    customerName: 'Abdulrahman Al-Fassi',
    customerEmail: 'a.fassi@investments.sa',
    customerPhone: '+966 55 987 6543',
    jewellery: "Men's Ring",
    requestDetails: 'Create a signet ring with family initials',
    referenceImages: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Under Review',
    submittedDate: '23 Sep 2026, 16:45',
    dateCategory: 'Last 7 Days',
    fullCustomDesign: {
      jewelleryType: "Men's Heritage Signet Ring",
      materialPreference: '21K Heavy Solid Yellow Gold',
      customerDescription: 'Solid 21K gold men’s signet ring with deeply engraved Arabic calligraphy family initials "الفاسي" bordered by a subtle ribbed bezel.',
      photos: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Size 11.5 (Saudi standard 64mm circumference)',
      additionalRequirements: 'Minimum 22 grams net weight for substantial premium feel, matte satin shoulders.',
      customerBudget: 22000
    },
    quotation: {
      materialsEstimate: 14500,
      laborEstimate: 5000,
      finalQuote: 19500
    }
  },

  // 3. REQ-7093: Full Custom Design (Design Confirmed)
  {
    id: 'REQ-7093',
    type: 'Full Custom Design',
    customerName: 'Mona Al-Qahtani',
    customerEmail: 'mona.qahtani@outlook.sa',
    customerPhone: '+966 54 321 0987',
    jewellery: 'Bridal Necklace',
    requestDetails: 'Bridal necklace inspired by Arabic floral patterns',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591475155-4284ec28d351?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Design Confirmed',
    submittedDate: '23 Sep 2026, 10:15',
    dateCategory: 'Last 7 Days',
    fullCustomDesign: {
      jewelleryType: 'Royal Arabic Floral Bridal Necklace',
      materialPreference: '18K Yellow Gold with Natural Colombian Emeralds',
      customerDescription: 'Cascading floral arabesque vine motif with 7 teardrop natural emerald cabochons and micro-pavé round diamonds.',
      photos: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611591475155-4284ec28d351?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Neck circumference 38cm choker style with 5cm extension chain',
      additionalRequirements: 'Needs matching earrings clip attachments.',
      customerBudget: 75000
    },
    quotation: {
      materialsEstimate: 48000,
      laborEstimate: 20000,
      finalQuote: 68000
    }
  },

  // 4. REQ-7094: Product Customization (In Production)
  {
    id: 'REQ-7094',
    type: 'Product Customization',
    customerName: 'Fahad Al-Subaie',
    customerEmail: 'fahad.subaie@subaiegroup.com',
    customerPhone: '+966 53 456 7890',
    jewellery: 'Diamond Bangle Cuff',
    requestDetails: 'Switch diamonds to VVS clarity and resize to 17cm',
    referenceImages: [
      'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'In Production',
    submittedDate: '22 Sep 2026, 14:30',
    dateCategory: 'Last 7 Days',
    originalProduct: {
      name: 'Sovereign Geometric Diamond Bangle',
      sku: 'VV-BNG-1094',
      image: 'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80',
      originalPrice: 46000,
      category: 'Bracelets'
    },
    customChanges: {
      goldKarat: '18K Rose Gold',
      goldColor: 'Rose Gold (Standard)',
      stone: 'Upgrade Baguette diamonds from VS to VVS1 Top Wesselton',
      size: 'Custom 17cm wrist oval fit (Standard is 16cm)',
      engraving: 'Double safety clasp engraved with initials "F.S"',
      specialInstructions: 'Atelier master setter verification required for baguette channel.'
    },
    quotation: {
      originalPrice: 46000,
      customizationAdjustment: 6800,
      finalQuote: 52800
    }
  },

  // 5. REQ-7095: Full Custom Design (Awaiting Customer)
  {
    id: 'REQ-7095',
    type: 'Full Custom Design',
    customerName: 'Noura Al-Hazzaa',
    customerEmail: 'noura.hazzaa@hotmail.com',
    customerPhone: '+966 56 789 0123',
    jewellery: 'Arabic Name Pendant',
    requestDetails: 'Arabic calligraphy name pendant in Thuluth script',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Awaiting Customer',
    submittedDate: '22 Sep 2026, 09:00',
    dateCategory: 'Last 7 Days',
    fullCustomDesign: {
      jewelleryType: 'Calligraphy Name Pendant',
      materialPreference: '21K Yellow Gold',
      customerDescription: 'Custom gold pendant featuring the name "نورة" sculpted in Thuluth calligraphy with 2 brilliant-cut rubies.',
      photos: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Pendant height 3.2cm, 45cm diamond-cut gold chain',
      additionalRequirements: 'Gift box packing with calligraphy blessing card.',
      customerBudget: 12000
    },
    quotation: {
      materialsEstimate: 6200,
      laborEstimate: 3300,
      finalQuote: 9500
    }
  },

  // 6. REQ-7096: Product Customization (Under Review)
  {
    id: 'REQ-7096',
    type: 'Product Customization',
    customerName: 'Hessa Al-Mutawa',
    customerEmail: 'hessa.mutawa@gmail.com',
    customerPhone: '+966 50 889 9001',
    jewellery: 'Solitaire Diamond Studs',
    requestDetails: 'Upgrade center stone to 1.5ct each and platinum setting',
    referenceImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Under Review',
    submittedDate: '21 Sep 2026, 15:40',
    dateCategory: 'Last 7 Days',
    originalProduct: {
      name: 'Classic Six-Prong Diamond Studs (1.0ct)',
      sku: 'VV-EAR-0312',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      originalPrice: 18000,
      category: 'Earrings'
    },
    customChanges: {
      goldKarat: 'PT950 Platinum',
      goldColor: 'Platinum (was 18K White Gold)',
      stone: 'Twin 1.50ct GIA Certified D-Color IF Clarity diamonds',
      size: 'Screwback locking mechanism for security',
      specialInstructions: 'Provide digital GIA certificate dossiers before setting.'
    },
    quotation: {
      originalPrice: 18000,
      customizationAdjustment: 16500,
      finalQuote: 34500
    }
  },

  // 7. REQ-7097: Full Custom Design (Completed)
  {
    id: 'REQ-7097',
    type: 'Full Custom Design',
    customerName: 'Ziyad Al-Dakhil',
    customerEmail: 'ziyad.dakhil@dakhil-co.sa',
    customerPhone: '+966 59 112 2334',
    jewellery: 'Bridal Heritage Belt',
    requestDetails: 'Traditional heirloom filigree medallions with emerald inlays',
    referenceImages: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '18 Sep 2026, 15:00',
    dateCategory: 'Last 30 Days',
    fullCustomDesign: {
      jewelleryType: 'Heirloom Filigree Medallion Bridal Belt',
      materialPreference: '21K Solid Yellow Gold',
      customerDescription: 'Traditional Najdi bridal belt consisting of 18 interlocking filigree medallions set with genuine Zambian emeralds.',
      photos: [
        'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Belt length 82cm adjustable with hidden gold links',
      additionalRequirements: 'Delivered in bespoke velvet presentation casket.',
      customerBudget: 130000
    },
    quotation: {
      materialsEstimate: 85000,
      laborEstimate: 35000,
      finalQuote: 120000
    }
  },

  // 8. REQ-7098: Product Customization (Rejected)
  {
    id: 'REQ-7098',
    type: 'Product Customization',
    customerName: 'Bandar Al-Olayan',
    customerEmail: 'bandar.olayan@corp.sa',
    customerPhone: '+966 55 443 3221',
    jewellery: 'Gold Sovereign Ring',
    requestDetails: 'Engrave monogram on inner band and brush satin finish',
    referenceImages: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Rejected',
    submittedDate: '19 Sep 2026, 11:30',
    dateCategory: 'Last 30 Days',
    originalProduct: {
      name: 'Antique Sovereign Coin Bezel Ring',
      sku: 'VV-RNG-0419',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80',
      originalPrice: 14000,
      category: 'Rings'
    },
    customChanges: {
      goldKarat: '22K Gold',
      specialInstructions: 'Customer requested modifying a hollow antique mounting which cannot support requested deep engraving without puncture.'
    },
    quotation: {
      originalPrice: 14000,
      finalQuote: 14000
    }
  },

  // 9. REQ-7099: Product Customization (New)
  {
    id: 'REQ-7099',
    type: 'Product Customization',
    customerName: 'Reem Al-Dosari',
    customerEmail: 'reem.dosari@gmail.com',
    customerPhone: '+966 50 234 5678',
    jewellery: 'Tennis Bracelet',
    requestDetails: 'Change clasp to dual safety and length to 15.5cm',
    referenceImages: [
      'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'New',
    submittedDate: '24 Sep 2026, 08:30',
    dateCategory: 'Today',
    originalProduct: {
      name: 'Princess Cut Diamond Tennis Bracelet',
      sku: 'VV-BRC-0219',
      image: 'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80',
      originalPrice: 28500,
      category: 'Bracelets'
    },
    customChanges: {
      goldKarat: '18K White Gold',
      size: '15.5cm petite wrist',
      specialInstructions: 'Remove two links and return loose certified diamonds to customer.'
    },
    quotation: {
      originalPrice: 28500,
      customizationAdjustment: -1200,
      finalQuote: 27300
    }
  },

  // 10. REQ-7100: Full Custom Design (New)
  {
    id: 'REQ-7100',
    type: 'Full Custom Design',
    customerName: 'Khalid Al-Mansoor',
    customerEmail: 'k.mansoor@rawabi.com',
    customerPhone: '+966 55 111 2233',
    jewellery: 'Saudi National Emblem Cufflinks',
    requestDetails: 'Palm and crossed swords in 22K yellow gold with green enamel',
    referenceImages: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'New',
    submittedDate: '24 Sep 2026, 10:00',
    dateCategory: 'Today',
    fullCustomDesign: {
      jewelleryType: 'Diplomatic Gold Cufflinks',
      materialPreference: '22K Saudi Gold with Royal Green Cloisonné Enamel',
      customerDescription: 'State gift cufflinks featuring the Saudi national coat of arms in relief with vitreous green enamel guilloché background.',
      photos: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Diameter 19mm circular mount',
      customerBudget: 18000
    },
    quotation: {
      materialsEstimate: 11000,
      laborEstimate: 4500,
      finalQuote: 15500
    }
  },

  // 11. REQ-7101: Product Customization (New)
  {
    id: 'REQ-7101',
    type: 'Product Customization',
    customerName: 'Laila Al-Ghamdi',
    customerEmail: 'laila.g@yahoo.com',
    customerPhone: '+966 54 887 6655',
    jewellery: 'Bespoke Sapphire Pendant',
    requestDetails: 'Swap blue sapphire to natural Ceylon yellow sapphire',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'New',
    submittedDate: '24 Sep 2026, 12:10',
    dateCategory: 'Today',
    originalProduct: {
      name: 'Royal Halo Oval Sapphire Pendant',
      sku: 'VV-PND-0914',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      originalPrice: 16500,
      category: 'Pendants'
    },
    customChanges: {
      stone: 'Unheated 3.0ct Ceylon Yellow Sapphire',
      goldKarat: '18K Yellow Gold prongs with White Gold halo'
    },
    quotation: {
      originalPrice: 16500,
      customizationAdjustment: 3200,
      finalQuote: 19700
    }
  },

  // 12. REQ-7102: Product Customization (New)
  {
    id: 'REQ-7102',
    type: 'Product Customization',
    customerName: 'Yasser Al-Shehri',
    customerEmail: 'y.shehri@aramco.sa',
    customerPhone: '+966 56 332 1144',
    jewellery: 'Mens Onyx Signet',
    requestDetails: 'Laser micro-engrave family crest on black onyx stone',
    referenceImages: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'New',
    submittedDate: '24 Sep 2026, 13:40',
    dateCategory: 'Today',
    originalProduct: {
      name: 'Natural Black Onyx Signet Ring',
      sku: 'VV-RNG-0552',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80',
      originalPrice: 8900,
      category: 'Rings'
    },
    customChanges: {
      engraving: 'Intaglio seal engraving on onyx tablet',
      specialInstructions: 'Vector crest file provided by customer in vector SVG.'
    },
    quotation: {
      originalPrice: 8900,
      customizationAdjustment: 1800,
      finalQuote: 10700
    }
  },

  // 13. REQ-7103: Full Custom Design (New)
  {
    id: 'REQ-7103',
    type: 'Full Custom Design',
    customerName: 'Alanoud Al-Saud',
    customerEmail: 'alanoud.s@royalnet.sa',
    customerPhone: '+966 50 001 9988',
    jewellery: 'Tiara Headpiece',
    requestDetails: 'Royal bridal tiara with natural pearls and marquise diamonds',
    referenceImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'New',
    submittedDate: '24 Sep 2026, 14:15',
    dateCategory: 'Today',
    fullCustomDesign: {
      jewelleryType: 'Royal Bridal Diadem Tiara',
      materialPreference: '18K White Gold and Natural Arabian Gulf Pearls',
      customerDescription: 'Palatial diamond tiara incorporating 9 graduated natural Basra pearls and 14 carats of marquise and brilliant diamonds.',
      photos: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Standard bridal tiara arc with concealed velvet comfort base',
      customerBudget: 190000
    },
    quotation: {
      materialsEstimate: 125000,
      laborEstimate: 45000,
      finalQuote: 170000
    }
  },

  // 14. REQ-7104: Product Customization (In Production)
  {
    id: 'REQ-7104',
    type: 'Product Customization',
    customerName: 'Sami Al-Harbi',
    customerEmail: 'sami.harbi@gmail.com',
    customerPhone: '+966 53 776 5432',
    jewellery: 'Dual Tone Wedding Band',
    requestDetails: 'Mix 18K yellow gold inner core with brushed white gold exterior',
    referenceImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'In Production',
    submittedDate: '20 Sep 2026, 11:00',
    dateCategory: 'Last 7 Days',
    originalProduct: {
      name: 'Comfort Fit 6mm Wedding Band',
      sku: 'VV-BND-0104',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      originalPrice: 6500,
      category: 'Rings'
    },
    customChanges: {
      goldColor: 'Bicolor Fusion (Yellow & White)',
      size: 'Size 10',
      engraving: '"Sami & Dana • 2026"'
    },
    quotation: {
      originalPrice: 6500,
      customizationAdjustment: 1900,
      finalQuote: 8400
    }
  },

  // 15. REQ-7105: Full Custom Design (Awaiting Customer)
  {
    id: 'REQ-7105',
    type: 'Full Custom Design',
    customerName: 'Dana Al-Khatib',
    customerEmail: 'dana.k@finance.sa',
    customerPhone: '+966 55 889 0012',
    jewellery: 'Emerald Cut Diamond Choker',
    requestDetails: 'East-west set emerald cut diamond on rigid gold torc',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Awaiting Customer',
    submittedDate: '19 Sep 2026, 16:20',
    dateCategory: 'Last 30 Days',
    fullCustomDesign: {
      jewelleryType: 'Contemporary Diamond Torc Choker',
      materialPreference: '18K Yellow Gold with 2.5ct Emerald-cut diamond',
      customerDescription: 'Minimalist rigid open torc choker in solid gold featuring an east-west bezel-mounted emerald cut centerpiece.',
      photos: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Inner diameter 12.5cm spring temper gold',
      customerBudget: 55000
    },
    quotation: {
      materialsEstimate: 36000,
      laborEstimate: 12000,
      finalQuote: 48000
    }
  },

  // 16. REQ-7106: Product Customization (Design Confirmed)
  {
    id: 'REQ-7106',
    type: 'Product Customization',
    customerName: 'Mansoor Al-Husseini',
    customerEmail: 'm.husseini@saudilaw.com',
    customerPhone: '+966 54 112 3344',
    jewellery: 'Solitaire Engagement Ring',
    requestDetails: 'Substitute hidden halo with natural Colombian emeralds',
    referenceImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Design Confirmed',
    submittedDate: '17 Sep 2026, 14:00',
    dateCategory: 'Last 30 Days',
    originalProduct: {
      name: 'Majestic Oval Diamond Solitaire',
      sku: 'VV-RNG-0771',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      originalPrice: 42000,
      category: 'Rings'
    },
    customChanges: {
      stone: 'Hidden gallery set with 16 micro vivid green emeralds',
      goldKarat: '18K Yellow Gold'
    },
    quotation: {
      originalPrice: 42000,
      customizationAdjustment: 4800,
      finalQuote: 46800
    }
  },

  // 17. REQ-7107: Product Customization (Completed)
  {
    id: 'REQ-7107',
    type: 'Product Customization',
    customerName: 'Waleed Al-Otaibi',
    customerEmail: 'w.otaibi@saudieng.sa',
    customerPhone: '+966 50 998 7766',
    jewellery: 'Cuban Link Chain',
    requestDetails: 'Custom diamond lock clasp with pave initial W',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '15 Sep 2026, 10:15',
    dateCategory: 'Last 30 Days',
    originalProduct: {
      name: 'Solid 21K Cuban Curb Chain (8mm)',
      sku: 'VV-CHN-0081',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      originalPrice: 38000,
      category: 'Chains'
    },
    customChanges: {
      engraving: 'Box clasp covered with VVS pavé diamonds forming initial "W"',
      size: '55cm custom length'
    },
    quotation: {
      originalPrice: 38000,
      customizationAdjustment: 7500,
      finalQuote: 45500
    }
  },

  // 18. REQ-7108: Full Custom Design (Completed)
  {
    id: 'REQ-7108',
    type: 'Full Custom Design',
    customerName: 'Fatima Al-Thani',
    customerEmail: 'fatima.t@invest.qa',
    customerPhone: '+966 55 444 7788',
    jewellery: 'Bespoke Anklet',
    requestDetails: 'Delicate gold chain anklet with dangling rose-cut diamonds',
    referenceImages: [
      'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '14 Sep 2026, 17:30',
    dateCategory: 'Last 30 Days',
    fullCustomDesign: {
      jewelleryType: 'Diamond Drop Anklet',
      materialPreference: '18K Yellow Gold with 5 rose-cut diamonds',
      customerDescription: 'Boho-chic high jewellery anklet with 5 bezel-set floating rose cut diamond drops.',
      photos: [
        'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: '24cm with 3cm adjustability',
      customerBudget: 15000
    },
    quotation: {
      materialsEstimate: 8500,
      laborEstimate: 3500,
      finalQuote: 12000
    }
  },

  // 19. REQ-7109: Product Customization (Completed)
  {
    id: 'REQ-7109',
    type: 'Product Customization',
    customerName: 'Majed Al-Ghamdi',
    customerEmail: 'm.ghamdi@med.sa',
    customerPhone: '+966 53 112 8899',
    jewellery: 'Cartier-style Trinity Ring',
    requestDetails: 'Resize all 3 interlocked bands to size 8.5',
    referenceImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '12 Sep 2026, 11:20',
    dateCategory: 'Last 30 Days',
    originalProduct: {
      name: 'Tri-Gold Interlocking Rolling Band',
      sku: 'VV-RNG-0123',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      originalPrice: 11500,
      category: 'Rings'
    },
    customChanges: {
      size: 'Size 8.5 (from size 6.5)',
      specialInstructions: 'Precision rolling clearance check.'
    },
    quotation: {
      originalPrice: 11500,
      customizationAdjustment: 1800,
      finalQuote: 13300
    }
  },

  // 20. REQ-7110: Full Custom Design (Completed)
  {
    id: 'REQ-7110',
    type: 'Full Custom Design',
    customerName: 'Samira Al-Zahrani',
    customerEmail: 'samira.z@corp.sa',
    customerPhone: '+966 54 990 0011',
    jewellery: 'Medallion Charm Bracelet',
    requestDetails: 'Solid gold charm bracelet with 5 custom city silhouette charms',
    referenceImages: [
      'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '10 Sep 2026, 14:45',
    dateCategory: 'Last 30 Days',
    fullCustomDesign: {
      jewelleryType: 'Heirloom Charm Bracelet',
      materialPreference: '18K Yellow Gold',
      customerDescription: 'Heavy link bracelet with 5 bespoke sculpted charms: Riyadh Kingdom Tower, Makkah Clock Tower, AlUla Maraya, Jeddah Fountain, London Big Ben.',
      photos: [
        'https://images.unsplash.com/photo-1611591475806-2319c117ea8a?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: '18cm length',
      customerBudget: 28000
    },
    quotation: {
      materialsEstimate: 16500,
      laborEstimate: 7500,
      finalQuote: 24000
    }
  },

  // 21. REQ-7111: Product Customization (Completed)
  {
    id: 'REQ-7111',
    type: 'Product Customization',
    customerName: 'Tariq Al-Nemer',
    customerEmail: 'tariq.nemer@nemer.sa',
    customerPhone: '+966 56 778 8990',
    jewellery: 'Gold Rosary / Masbaha',
    requestDetails: 'Replace silver tassel with handcrafted 21K gold chain tassel',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '08 Sep 2026, 09:30',
    dateCategory: 'Older',
    originalProduct: {
      name: 'Baltic Amber Prayer Beads (33 Beads)',
      sku: 'VV-MSB-0044',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      originalPrice: 9200,
      category: 'Bespoke'
    },
    customChanges: {
      goldKarat: '21K Handwoven Gold Tassel',
      specialInstructions: 'Net gold weight exactly 18 grams.'
    },
    quotation: {
      originalPrice: 9200,
      customizationAdjustment: 6800,
      finalQuote: 16000
    }
  },

  // 22. REQ-7112: Product Customization (Completed)
  {
    id: 'REQ-7112',
    type: 'Product Customization',
    customerName: 'Ghada Al-Tuwaijri',
    customerEmail: 'ghada.t@edu.sa',
    customerPhone: '+966 50 445 6677',
    jewellery: 'Hoop Earrings',
    requestDetails: 'Add removable diamond star pendants to existing huggies',
    referenceImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '06 Sep 2026, 16:00',
    dateCategory: 'Older',
    originalProduct: {
      name: '18K Gold Pave Huggie Hoops',
      sku: 'VV-EAR-0182',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      originalPrice: 7800,
      category: 'Earrings'
    },
    customChanges: {
      stone: '2x 0.50ct Diamond 8-point stars with jump rings'
    },
    quotation: {
      originalPrice: 7800,
      customizationAdjustment: 4200,
      finalQuote: 12000
    }
  },

  // 23. REQ-7113: Product Customization (Completed)
  {
    id: 'REQ-7113',
    type: 'Product Customization',
    customerName: 'Nasser Al-Ajmi',
    customerEmail: 'nasser.ajmi@oil.sa',
    customerPhone: '+966 55 667 8899',
    jewellery: 'Gold Bar Pendant',
    requestDetails: 'Mount 10g Valcambi Gold Bar in custom protective diamond frame',
    referenceImages: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '05 Sep 2026, 13:20',
    dateCategory: 'Older',
    originalProduct: {
      name: 'Valcambi 10g 24K Minted Gold Ingot',
      sku: 'VV-BLN-0010',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80',
      originalPrice: 3850,
      category: 'Bullion'
    },
    customChanges: {
      goldKarat: '18K Yellow Gold Bezel Frame',
      stone: '0.85ct Round Brilliant Diamond Surround'
    },
    quotation: {
      originalPrice: 3850,
      customizationAdjustment: 5200,
      finalQuote: 9050
    }
  },

  // 24. REQ-7114: Full Custom Design (Completed)
  {
    id: 'REQ-7114',
    type: 'Full Custom Design',
    customerName: 'Hind Al-Otaibi',
    customerEmail: 'hind.o@gmail.com',
    customerPhone: '+966 53 223 3445',
    jewellery: 'Mother of Pearl Brooch',
    requestDetails: 'Falcon motif brooch carved in natural white mother of pearl',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '03 Sep 2026, 15:10',
    dateCategory: 'Older',
    fullCustomDesign: {
      jewelleryType: 'High Jewellery Falcon Brooch',
      materialPreference: '18K White Gold, Australian MOP & Cognac Diamonds',
      customerDescription: 'Sculpted Arabian falcon in flight with iridescent white shell feathers and cognac diamond eye.',
      photos: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: '6.5cm wingspan',
      customerBudget: 25000
    },
    quotation: {
      materialsEstimate: 14000,
      laborEstimate: 8000,
      finalQuote: 22000
    }
  },

  // 25. REQ-7115: Product Customization (Completed)
  {
    id: 'REQ-7115',
    type: 'Product Customization',
    customerName: 'Ibrahim Al-Bader',
    customerEmail: 'ibrahim.bader@bank.sa',
    customerPhone: '+966 54 556 7788',
    jewellery: 'Signet Cufflinks',
    requestDetails: 'Monogram hand engraving with deep antique black enamel',
    referenceImages: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Completed',
    submittedDate: '01 Sep 2026, 11:40',
    dateCategory: 'Older',
    originalProduct: {
      name: 'Solid Gold Cushion Cufflinks',
      sku: 'VV-CFF-0021',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80',
      originalPrice: 8500,
      category: 'Accessories'
    },
    customChanges: {
      engraving: 'Monogram "I.B" in interlocking serif'
    },
    quotation: {
      originalPrice: 8500,
      customizationAdjustment: 1600,
      finalQuote: 10100
    }
  },

  // 26. REQ-7116: Product Customization (Rejected)
  {
    id: 'REQ-7116',
    type: 'Product Customization',
    customerName: 'Mishal Al-Ghamdi',
    customerEmail: 'mishal.g@yahoo.com',
    customerPhone: '+966 50 334 4556',
    jewellery: 'Titanium & Gold Ring',
    requestDetails: 'Request to resize aircraft titanium core to size 12',
    referenceImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Rejected',
    submittedDate: '28 Aug 2026, 16:50',
    dateCategory: 'Older',
    originalProduct: {
      name: 'Titanium and 18K Gold Inlay Band',
      sku: 'VV-RNG-0099',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      originalPrice: 5200,
      category: 'Rings'
    },
    customChanges: {
      specialInstructions: 'Grade 5 aircraft titanium cannot be resized via traditional soldering/stretching without structural failure.'
    },
    quotation: {
      originalPrice: 5200,
      finalQuote: 5200
    }
  },

  // 27. REQ-7117: Full Custom Design (Rejected)
  {
    id: 'REQ-7117',
    type: 'Full Custom Design',
    customerName: 'Bader Al-Mutairi',
    customerEmail: 'bader.m@corp.sa',
    customerPhone: '+966 55 778 9900',
    jewellery: 'Gold Plated Replica',
    requestDetails: 'Request to manufacture low-cost brass replica of museum artifact',
    referenceImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Rejected',
    submittedDate: '25 Aug 2026, 12:00',
    dateCategory: 'Older',
    fullCustomDesign: {
      jewelleryType: 'Brass / Non-precious Replica',
      materialPreference: 'Base metal / brass gold plated',
      customerDescription: 'Replica requested in non-precious metals.',
      photos: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'N/A',
      additionalRequirements: 'Rejected: VenVision atelier only works with precious solid gold (18K, 21K, 22K, 24K) and Platinum.'
    },
    quotation: {
      finalQuote: 0
    }
  },

  // 28. REQ-7118: Full Custom Design (Rejected)
  {
    id: 'REQ-7118',
    type: 'Full Custom Design',
    customerName: 'Yasmeen Al-Omari',
    customerEmail: 'yasmeen.o@outlook.com',
    customerPhone: '+966 56 112 4433',
    jewellery: 'Synthetic Diamond Ring',
    requestDetails: 'Customer provided lab-created diamond with no certification',
    referenceImages: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'Rejected',
    submittedDate: '20 Aug 2026, 14:10',
    dateCategory: 'Older',
    fullCustomDesign: {
      jewelleryType: 'Customer Stone Mounting',
      materialPreference: '18K White Gold',
      customerDescription: 'Setting customer uncertified synthetic stones.',
      photos: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
      ],
      sizeMeasurements: 'Size 6',
      additionalRequirements: 'Rejected: Vault quality inspection detected fractured girdle on supplied stone.'
    },
    quotation: {
      finalQuote: 0
    }
  }
]
