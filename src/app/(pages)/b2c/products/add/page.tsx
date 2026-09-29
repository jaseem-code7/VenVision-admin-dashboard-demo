'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Upload,
  Trash2,
  Check,
  CheckCircle2,
  Rotate3d,
  FileCode,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Info
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { initialGoldRates } from '@/data/venvision-data'

type ProductImage = {
  id: string
  url: string
  name: string
  isPrimary: boolean
}

export default function AddB2CProductPage() {
  const router = useRouter()

  // Language Tab State for Basic Info
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en')

  // 1. Basic Information
  const [nameEn, setNameEn] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [sku, setSku] = useState('VV-RG-18K-001')
  const [category, setCategory] = useState('Rings')
  const [productType, setProductType] = useState('Solitaire')
  const [shortDescEn, setShortDescEn] = useState('')
  const [shortDescAr, setShortDescAr] = useState('')
  const [fullDescEn, setFullDescEn] = useState('')
  const [fullDescAr, setFullDescAr] = useState('')

  // 2. Jewellery Details
  const [material, setMaterial] = useState<'Gold' | 'Diamond' | 'Gemstone'>('Diamond')
  const [goldPurity, setGoldPurity] = useState<'18K' | '21K' | '22K'>('18K')
  const [goldColour, setGoldColour] = useState<'Yellow Gold' | 'White Gold' | 'Rose Gold'>('Yellow Gold')
  const [grossWeight, setGrossWeight] = useState<number>(5.5)
  const [netGoldWeight, setNetGoldWeight] = useState<number>(5.2)
  const [productSize, setProductSize] = useState('54')

  // Diamond specific fields
  const [diamondCarat, setDiamondCarat] = useState<number>(0.85)
  const [diamondColour, setDiamondColour] = useState('F')
  const [diamondClarity, setDiamondClarity] = useState('VS1')
  const [diamondCut, setDiamondCut] = useState('Round Brilliant')
  const [numDiamonds, setNumDiamonds] = useState<number>(1)

  // 3. Product Images
  const [images, setImages] = useState<ProductImage[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      name: 'ring-front.webp',
      isPrimary: true
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
      name: 'ring-side.webp',
      isPrimary: false
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80',
      name: 'ring-detail.webp',
      isPrimary: false
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80',
      name: 'ring-box.webp',
      isPrimary: false
    }
  ])

  // 4. 3D Model
  const [has3DModel, setHas3DModel] = useState<boolean>(true)
  const [enable3DPreview, setEnable3DPreview] = useState<boolean>(true)
  const [modelFileName, setModelFileName] = useState('solitaire-diamond-ring.glb')
  const [modelFileSize, setModelFileSize] = useState('4.2 MB')

  // 5. Inventory
  const [stockQuantity, setStockQuantity] = useState<number>(8)
  const [lowStockAlert, setLowStockAlert] = useState<number>(2)
  const [availability, setAvailability] = useState<'In Stock' | 'Out of Stock' | 'Pre-order'>('In Stock')
  const [productStatus, setProductStatus] = useState<'Draft' | 'Active'>('Draft')
  const [visibility, setVisibility] = useState<'Published' | 'Hidden'>('Published')

  // 6. Pricing
  const currentPurityRate = useMemo(() => {
    const rateObj = initialGoldRates.find(r => r.karat === goldPurity)
    return rateObj ? rateObj.buyRateSAR : 234.35
  }, [goldPurity])

  const [goldRatePerGram, setGoldRatePerGram] = useState<number>(currentPurityRate)
  const [diamondStoneCost, setDiamondStoneCost] = useState<number>(3800)
  const [makingCharge, setMakingCharge] = useState<number>(650)
  const [additionalCharges, setAdditionalCharges] = useState<number>(0)
  const [discountPercent, setDiscountPercent] = useState<number>(0)

  // Calculations
  const calculations = useMemo(() => {
    const goldValue = (netGoldWeight || 0) * (goldRatePerGram || 0)
    const baseSubtotal = goldValue + (diamondStoneCost || 0) + (makingCharge || 0) + (additionalCharges || 0)
    const discountAmount = (baseSubtotal * (discountPercent || 0)) / 100
    const taxableSubtotal = Math.max(0, baseSubtotal - discountAmount)
    const vat15 = taxableSubtotal * 0.15
    const finalSellingPrice = taxableSubtotal + vat15

    return {
      goldValue,
      diamondStoneCost,
      makingCharge,
      additionalCharges,
      subtotal: taxableSubtotal,
      vat15,
      finalSellingPrice
    }
  }, [netGoldWeight, goldRatePerGram, diamondStoneCost, makingCharge, additionalCharges, discountPercent])

  // Image handlers
  const handleSetPrimaryImage = (id: string) => {
    setImages(prev =>
      prev.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    )
  }

  const handleDeleteImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id)
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true
      }
      return filtered
    })
  }

  const handleSaveDraft = () => {
    toast.success('Product saved as draft')
    setTimeout(() => {
      router.push('/b2c/products')
    }, 800)
  }

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    const activeName = activeLang === 'en' ? nameEn : nameAr
    if (!activeName.trim() && !nameEn.trim()) {
      toast.error('Please enter the Product Name before publishing')
      return
    }

    toast.success('Product published successfully', {
      description: `${nameEn || nameAr} (${sku}) is now live.`
    })

    setTimeout(() => {
      router.push('/b2c/products')
    }, 800)
  }

  return (
    <form onSubmit={handlePublish} className="space-y-6 pb-20">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          {/* Breadcrumb: B2C > Products > Add Product */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/b2c/dashboard" className="hover:text-foreground transition-colors">
              B2C
            </Link>
            <span>&gt;</span>
            <Link href="/b2c/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Add Product</span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Add Product
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new jewellery product for the B2C store.
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            className="h-10 px-4 text-sm font-medium rounded-xl"
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            className="h-10 px-5 text-sm font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
          >
            Publish Product
          </Button>
        </div>
      </div>

      {/* QUICK SECTION NAV (Optional small sticky navigation) */}
      <div className="sticky top-16 z-20 flex items-center gap-2 overflow-x-auto rounded-xl border border-border/60 bg-background/95 p-1.5 backdrop-blur-sm text-xs font-medium">
        <a href="#basic-info" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Basic
        </a>
        <a href="#jewellery-details" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Jewellery
        </a>
        <a href="#product-images" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Media
        </a>
        <a href="#3d-model" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          3D Model
        </a>
        <a href="#inventory" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Inventory
        </a>
        <a href="#pricing" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Pricing
        </a>
      </div>

      {/* 2-COLUMN LAYOUT: Main 70% | Right Sidebar 30% */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* MAIN CONTENT (70% - 8 of 12 columns) */}
        <div className="space-y-6 lg:col-span-8">
          {/* 1. Basic Information card */}
          <Card id="basic-info" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Basic Information</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Primary title, SKU code, category, and descriptive details.
                </CardDescription>
              </div>

              {/* Small English | العربية Tabs */}
              <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveLang('en')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeLang === 'en'
                      ? 'bg-background text-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('ar')}
                  className={`px-2.5 py-1 rounded-md font-arabic transition-all ${
                    activeLang === 'ar'
                      ? 'bg-background text-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  العربية
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {activeLang === 'en' ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Product Name *</Label>
                      <Input
                        placeholder="e.g. Royale Solitaire Diamond Ring"
                        value={nameEn}
                        onChange={e => setNameEn(e.target.value)}
                        required
                        className="h-10 rounded-lg text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">SKU *</Label>
                      <Input
                        placeholder="e.g. VV-RG-18K-001"
                        value={sku}
                        onChange={e => setSku(e.target.value)}
                        required
                        className="h-10 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Category *</Label>
                      <Select value={category} onValueChange={(val: any) => val && setCategory(val)}>
                        <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Rings">Rings</SelectItem>
                          <SelectItem value="Necklaces">Necklaces</SelectItem>
                          <SelectItem value="Bracelets">Bracelets</SelectItem>
                          <SelectItem value="Earrings">Earrings</SelectItem>
                          <SelectItem value="Bridal Sets">Bridal Sets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Product Type *</Label>
                      <Select value={productType} onValueChange={(val: any) => val && setProductType(val)}>
                        <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Solitaire">Solitaire</SelectItem>
                          <SelectItem value="Fine Jewellery">Fine Jewellery</SelectItem>
                          <SelectItem value="Daily Wear">Daily Wear</SelectItem>
                          <SelectItem value="High Jewellery">High Jewellery</SelectItem>
                          <SelectItem value="Eternity">Eternity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">Short Description</Label>
                    <Input
                      placeholder="Brief one-line summary for product cards and search results"
                      value={shortDescEn}
                      onChange={e => setShortDescEn(e.target.value)}
                      className="h-10 rounded-lg text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">Full Description</Label>
                    <Textarea
                      placeholder="Describe the craftsmanship, setting details, and inspiration..."
                      value={fullDescEn}
                      onChange={e => setFullDescEn(e.target.value)}
                      rows={4}
                      className="rounded-lg text-sm leading-relaxed"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground font-arabic">اسم المنتج (بالعربية) *</Label>
                      <Input
                        placeholder="مثال: خاتم سوليتير ألماس رويال"
                        value={nameAr}
                        onChange={e => setNameAr(e.target.value)}
                        dir="rtl"
                        className="h-10 rounded-lg text-sm font-arabic"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">SKU *</Label>
                      <Input
                        value={sku}
                        onChange={e => setSku(e.target.value)}
                        className="h-10 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground font-arabic">الوصف المختصر</Label>
                    <Input
                      placeholder="نبذة موجزة تظهر في بطاقة المنتج"
                      value={shortDescAr}
                      onChange={e => setShortDescAr(e.target.value)}
                      dir="rtl"
                      className="h-10 rounded-lg text-sm font-arabic"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground font-arabic">الوصف الكامل للمنتج</Label>
                    <Textarea
                      placeholder="تفاصيل التصميم الحرفي، دقة الصياغة، ولمعان الألماس..."
                      value={fullDescAr}
                      onChange={e => setFullDescAr(e.target.value)}
                      dir="rtl"
                      rows={4}
                      className="rounded-lg text-sm font-arabic leading-relaxed"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 2. Jewellery Details card */}
          <Card id="jewellery-details" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Jewellery Details</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Metal purity, gross/net weight, and gemstone specifications in a clean grid.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Material *</Label>
                  <Select value={material} onValueChange={(val: any) => val && setMaterial(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Material" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Diamond">Diamond & Gold</SelectItem>
                      <SelectItem value="Gemstone">Precious Gemstone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Gold Purity *</Label>
                  <Select value={goldPurity} onValueChange={(val: any) => val && setGoldPurity(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Purity" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="18K">18K (750 Hallmark)</SelectItem>
                      <SelectItem value="21K">21K (875 Hallmark)</SelectItem>
                      <SelectItem value="22K">22K (916 Hallmark)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Gold Colour *</Label>
                  <Select value={goldColour} onValueChange={(val: any) => val && setGoldColour(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Gold Colour" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Yellow Gold">Yellow Gold</SelectItem>
                      <SelectItem value="White Gold">White Gold</SelectItem>
                      <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Product Size</Label>
                  <Input
                    placeholder="e.g. 52, 54, 56 or 45cm"
                    value={productSize}
                    onChange={e => setProductSize(e.target.value)}
                    className="h-10 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t border-border/40">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Gross Weight (grams) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={grossWeight}
                    onChange={e => setGrossWeight(parseFloat(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Net Gold Weight (grams) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={netGoldWeight}
                    onChange={e => setNetGoldWeight(parseFloat(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              {/* Diamond Section (Visible if Material is Diamond or Gemstone) */}
              {(material === 'Diamond' || material === 'Gemstone') && (
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Diamond & Gemstone Specifications</span>
                    <Badge variant="outline" className="text-[11px] font-normal">
                      Certified Carats
                    </Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Diamond Carat (ct)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={diamondCarat}
                        onChange={e => setDiamondCarat(parseFloat(e.target.value) || 0)}
                        className="h-9 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Diamond Colour</Label>
                      <Select value={diamondColour} onValueChange={(val: any) => val && setDiamondColour(val)}>
                        <SelectTrigger className="w-full h-9 rounded-lg text-xs">
                          <SelectValue placeholder="Colour" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map(col => (
                            <SelectItem key={col} value={col}>
                              Colour {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Diamond Clarity</Label>
                      <Select value={diamondClarity} onValueChange={(val: any) => val && setDiamondClarity(val)}>
                        <SelectTrigger className="w-full h-9 rounded-lg text-xs">
                          <SelectValue placeholder="Clarity" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'].map(clarity => (
                            <SelectItem key={clarity} value={clarity}>
                              {clarity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Diamond Cut</Label>
                      <Select value={diamondCut} onValueChange={(val: any) => val && setDiamondCut(val)}>
                        <SelectTrigger className="w-full h-9 rounded-lg text-xs">
                          <SelectValue placeholder="Select Cut" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {['Round Brilliant', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Pear'].map(cut => (
                            <SelectItem key={cut} value={cut}>
                              {cut}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Number of Diamonds</Label>
                      <Input
                        type="number"
                        min="1"
                        value={numDiamonds}
                        onChange={e => setNumDiamonds(parseInt(e.target.value) || 1)}
                        className="h-9 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Product Images card */}
          <Card id="product-images" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Product Images</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                High-resolution photography for store listing and gallery view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Drag & Drop Uploader */}
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 px-6 py-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="p-3 rounded-full bg-background border border-border shadow-2xs mb-3 text-muted-foreground">
                  <Upload className="size-5 text-muted-foreground" />
                </div>
                <div className="text-sm font-medium text-foreground">
                  Drag &amp; drop product images or <span className="text-primary hover:underline">browse</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted formats: JPG, PNG, WebP (up to 10MB per file)
                </p>
              </div>

              {/* 4-column thumbnail grid */}
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-2.5 block">
                  Uploaded Images ({images.length})
                </Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {images.map(img => (
                    <div
                      key={img.id}
                      className={`group relative overflow-hidden rounded-xl border bg-card p-1.5 transition-all shadow-2xs ${
                        img.isPrimary ? 'border-primary ring-1 ring-primary/40' : 'border-border/80'
                      }`}
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {img.isPrimary && (
                          <span className="absolute top-1.5 left-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground shadow-xs">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-1.5 right-1.5 size-6 rounded-md bg-background/80 hover:bg-destructive hover:text-white flex items-center justify-center text-muted-foreground transition-colors shadow-xs"
                          title="Delete image"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between px-1">
                        <span className="text-[11px] text-muted-foreground truncate max-w-[90px]">
                          {img.name}
                        </span>
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.id)}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            Set Primary
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. 3D Model card */}
          <Card id="3d-model" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">3D Model</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Optional — enable interactive 360° product preview.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Enable 3D Preview:</span>
                  <Switch checked={enable3DPreview} onCheckedChange={setEnable3DPreview} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!has3DModel ? (
                /* Upload box */
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                  <Rotate3d className="size-6 text-muted-foreground mb-2" />
                  <div className="text-sm font-medium text-foreground">Upload GLB Model</div>
                  <p className="text-xs text-muted-foreground mt-0.5">Accepted: .GLB (3D WebGL format)</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 h-8 text-xs rounded-lg"
                    onClick={() => setHas3DModel(true)}
                  >
                    Choose .GLB File
                  </Button>
                </div>
              ) : (
                /* Show after upload */
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background border border-border text-foreground">
                        <FileCode className="size-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{modelFileName}</div>
                        <div className="text-xs text-muted-foreground">{modelFileSize} &bull; .GLB format</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Replace
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setHas3DModel(false)}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Simple preview area */}
                  {enable3DPreview && (
                    <div className="rounded-xl border border-border bg-muted/10 p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Rotate3d className="size-4 text-primary" />
                        <span>360° Interactive Canvas Active</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Model will render in Three.js viewport on the customer storefront with PBR reflections.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. Inventory card */}
          <Card id="inventory" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Inventory</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Stock counts, replenishment thresholds, and boutique availability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Stock Quantity *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(parseInt(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Low Stock Alert Threshold</Label>
                  <Input
                    type="number"
                    min="1"
                    value={lowStockAlert}
                    onChange={e => setLowStockAlert(parseInt(e.target.value) || 1)}
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Availability *</Label>
                  <Select value={availability} onValueChange={(val: any) => val && setAvailability(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Availability" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Pre-order">Pre-order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Product Status *</Label>
                  <Select value={productStatus} onValueChange={(val: any) => val && setProductStatus(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Pricing card */}
          <Card id="pricing" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Pricing</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Formula breakdown: metal weight &times; gold rate + stone cost + making charge + 15% VAT.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground flex items-center justify-between">
                    <span>Gold Rate per Gram (SAR) *</span>
                    <span className="text-xs text-muted-foreground font-mono">Live {goldPurity}</span>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={goldRatePerGram}
                    onChange={e => setGoldRatePerGram(parseFloat(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Gold Value (Auto: Weight &times; Rate)</Label>
                  <Input
                    type="text"
                    disabled
                    value={`${calculations.goldValue.toFixed(2)} SAR`}
                    className="h-10 rounded-lg text-sm font-mono bg-muted/40"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Diamond / Stone Cost (SAR)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={diamondStoneCost}
                    onChange={e => setDiamondStoneCost(parseFloat(e.target.value) || 0)}
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Making Charge (SAR) *</Label>
                  <Input
                    type="number"
                    step="1"
                    value={makingCharge}
                    onChange={e => setMakingCharge(parseFloat(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Additional Charges (SAR)</Label>
                  <Input
                    type="number"
                    value={additionalCharges}
                    onChange={e => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">VAT % (ZATCA KSA)</Label>
                  <Input
                    type="text"
                    disabled
                    value="15%"
                    className="h-10 rounded-lg text-sm font-mono bg-muted/40"
                  />
                </div>
              </div>

              {/* Compact Calculation Summary Box */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5 text-sm">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Calculation Summary
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground border-y border-border/50 py-2.5">
                  <div className="flex justify-between">
                    <span>Gold Value ({netGoldWeight}g &times; {goldRatePerGram.toFixed(2)} SAR):</span>
                    <span className="font-mono text-foreground">{calculations.goldValue.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diamond / Stone Cost:</span>
                    <span className="font-mono text-foreground">{calculations.diamondStoneCost.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Making Charge:</span>
                    <span className="font-mono text-foreground">{calculations.makingCharge.toFixed(2)} SAR</span>
                  </div>
                  {additionalCharges > 0 && (
                    <div className="flex justify-between">
                      <span>Additional Charges:</span>
                      <span className="font-mono text-foreground">+{additionalCharges.toFixed(2)} SAR</span>
                    </div>
                  )}
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({discountPercent}%):</span>
                      <span className="font-mono">-{(calculations.subtotal * (discountPercent / (100 - discountPercent))).toFixed(2)} SAR</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-foreground pt-1 border-t border-border/30">
                    <span>Subtotal:</span>
                    <span className="font-mono">{calculations.subtotal.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT 15%:</span>
                    <span className="font-mono text-foreground">+{calculations.vat15.toFixed(2)} SAR</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-foreground">Final Selling Price:</span>
                  <span className="text-lg font-bold text-primary font-mono">
                    {calculations.finalSellingPrice.toFixed(2)} SAR
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR (30% - 4 of 12 columns) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            {/* Card 1: Product Status */}
            <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="font-medium bg-muted/40">
                    {productStatus}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Visibility:</span>
                  <Select value={visibility} onValueChange={(val: any) => val && setVisibility(val)}>
                    <SelectTrigger className="h-8 w-28 text-xs rounded-lg">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">{category}</span>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="text-muted-foreground">Today at 2:35 PM</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Price Summary */}
            <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gold Value:</span>
                  <span className="font-mono text-foreground">{calculations.goldValue.toFixed(2)} SAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Stone Value:</span>
                  <span className="font-mono text-foreground">{calculations.diamondStoneCost.toFixed(2)} SAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Making Charge:</span>
                  <span className="font-mono text-foreground">{calculations.makingCharge.toFixed(2)} SAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">VAT (15%):</span>
                  <span className="font-mono text-foreground">+{calculations.vat15.toFixed(2)} SAR</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold text-foreground">Final Selling Price:</span>
                  <span className="text-base font-bold text-primary font-mono">
                    {calculations.finalSellingPrice.toFixed(2)} SAR
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Product Readiness */}
            <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Product Readiness</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Complete required attributes before publishing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">Basic Information</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">Pricing</span>
                </div>

                <div className="flex items-center gap-2">
                  {images.length > 0 ? (
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="size-4 rounded-full border border-muted-foreground/40 shrink-0" />
                  )}
                  <span className="text-foreground">Product Images ({images.length})</span>
                </div>

                <div className="flex items-center gap-2">
                  {has3DModel ? (
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="size-4 rounded-full border border-muted-foreground/40 shrink-0" />
                  )}
                  <span className="text-muted-foreground">3D Model (optional)</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">Inventory</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
