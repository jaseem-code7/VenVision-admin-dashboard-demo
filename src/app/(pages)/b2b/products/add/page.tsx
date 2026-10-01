'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Upload,
  Trash2,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Info,
  Scale,
  Boxes,
  Zap
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

export default function AddB2BProductPage() {
  const router = useRouter()

  // Language Tab State for Basic Info
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en')

  // 1. Basic Information
  const [nameEn, setNameEn] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [sku, setSku] = useState('VV-BAR-999-100G')
  const [productType, setProductType] = useState<'Gold Jewellery' | 'Diamond Jewellery' | 'Gold Bar' | 'Gold Coin' | 'Bullion'>('Gold Bar')
  const [category, setCategory] = useState('Cast Bar')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAr, setDescriptionAr] = useState('')

  // 2. Metal Details
  const [metal, setMetal] = useState<'Gold' | 'Silver' | 'Platinum'>('Gold')
  const [purity, setPurity] = useState<'18K' | '21K' | '22K' | '24K'>('24K')
  const [weight, setWeight] = useState<number>(100)
  const [unit, setUnit] = useState<'g' | 'kg' | 'oz' | 'tola'>('g')
  const [grossWeight, setGrossWeight] = useState<number>(100)
  const [netWeight, setNetWeight] = useState<number>(100)

  // 3. Media
  const [images, setImages] = useState<ProductImage[]>([
    {
      id: 'b2b-img-1',
      url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80',
      name: 'bar-obverse.webp',
      isPrimary: true
    },
    {
      id: 'b2b-img-2',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      name: 'bar-assay-cert.webp',
      isPrimary: false
    }
  ])

  // 4. Inventory
  const [availableQuantity, setAvailableQuantity] = useState<number>(45)
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(5)
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Low Stock' | 'Pre-order' | 'Out of Stock'>('In Stock')
  const [productStatus, setProductStatus] = useState<'Active' | 'Draft'>('Draft')
  const [visibility, setVisibility] = useState<'Published' | 'Hidden'>('Published')

  // 5. B2B Pricing
  const currentPurityRate = useMemo(() => {
    if (metal !== 'Gold') return 3.45 // Silver benchmark
    if (purity === '24K') return 268.45
    if (purity === '22K') return 245.50
    if (purity === '21K') return 234.35
    return 201.20 // 18K
  }, [metal, purity])

  const [currentGoldRate, setCurrentGoldRate] = useState<number>(currentPurityRate)
  const [rateType, setRateType] = useState<'Live Rate' | 'Fixed Rate'>('Live Rate')
  const [makingCharge, setMakingCharge] = useState<number>(300) // Premium / making per unit
  const [additionalCharges, setAdditionalCharges] = useState<number>(50) // Assay & security seal
  const [isVatExempt, setIsVatExempt] = useState<boolean>(true) // Investment gold bars (99%+) are VAT exempt in KSA

  // Calculations
  const calculations = useMemo(() => {
    // Metal value = netWeight * currentGoldRate (adjusted for unit if kg)
    const effectiveWeightGrams = unit === 'kg' ? netWeight * 1000 : unit === 'oz' ? netWeight * 31.1035 : netWeight
    const metalValue = effectiveWeightGrams * currentGoldRate
    const subtotal = metalValue + makingCharge + additionalCharges
    const vatAmount = isVatExempt ? 0 : subtotal * 0.15
    const finalB2BPrice = subtotal + vatAmount

    return {
      metalValue,
      makingCharge,
      additionalCharges,
      subtotal,
      vatAmount,
      finalB2BPrice
    }
  }, [netWeight, unit, currentGoldRate, makingCharge, additionalCharges, isVatExempt])

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
    toast.success('B2B Product saved as draft')
    setTimeout(() => {
      router.push('/b2b/products')
    }, 800)
  }

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    const activeName = activeLang === 'en' ? nameEn : nameAr
    if (!activeName.trim() && !nameEn.trim()) {
      toast.error('Please enter the Product Name before publishing')
      return
    }

    toast.success('B2B Product published successfully', {
      description: `${nameEn || nameAr} (${sku}) is now active in wholesale catalog.`
    })

    setTimeout(() => {
      router.push('/b2b/products')
    }, 800)
  }

  return (
    <form onSubmit={handlePublish} className="space-y-6 pb-20">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          {/* Breadcrumb: B2B > Products > Add B2B Product */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/b2b/dashboard" className="hover:text-foreground transition-colors">
              B2B
            </Link>
            <span>&gt;</span>
            <Link href="/b2b/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Add B2B Product</span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Add B2B Product
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a wholesale, bullion, or institutional jewellery product.
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

      {/* QUICK STICKY SECTION NAV */}
      <div className="sticky top-16 z-20 flex items-center gap-2 overflow-x-auto rounded-xl border border-border/60 bg-background/95 p-1.5 backdrop-blur-sm text-xs font-medium">
        <a href="#b2b-basic-info" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Basic Info
        </a>
        <a href="#metal-details" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Metal Details
        </a>
        <a href="#b2b-media" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Media
        </a>
        <a href="#b2b-inventory" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          Inventory & MOQ
        </a>
        <a href="#b2b-pricing" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          B2B Pricing
        </a>
      </div>

      {/* 2-COLUMN LAYOUT: Main 70% | Right Sidebar 30% */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* MAIN CONTENT (70% - 8 of 12 columns) */}
        <div className="space-y-6 lg:col-span-8">
          {/* 1. Basic Information Card */}
          <Card id="b2b-basic-info" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Basic Information</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Trade specification, SKU nomenclature, wholesale category, and technical description.
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
                        placeholder="e.g. 100g 999.9 Fine Gold Cast Bar"
                        value={nameEn}
                        onChange={e => setNameEn(e.target.value)}
                        required
                        className="h-10 rounded-lg text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">SKU / Trade Code *</Label>
                      <Input
                        placeholder="e.g. VV-BAR-999-100G"
                        value={sku}
                        onChange={e => setSku(e.target.value)}
                        required
                        className="h-10 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Product Type *</Label>
                      <Select value={productType} onValueChange={(val: any) => val && setProductType(val)}>
                        <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Select Product Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Gold Bar">Gold Bar</SelectItem>
                          <SelectItem value="Bullion">Bullion</SelectItem>
                          <SelectItem value="Gold Coin">Gold Coin</SelectItem>
                          <SelectItem value="Gold Jewellery">Gold Jewellery</SelectItem>
                          <SelectItem value="Diamond Jewellery">Diamond Jewellery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Category *</Label>
                      <Select value={category} onValueChange={(val: any) => val && setCategory(val)}>
                        <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Cast Bar">Cast Bar</SelectItem>
                          <SelectItem value="Minted Ingot">Minted Ingot</SelectItem>
                          <SelectItem value="Foundry Pellets">Foundry Pellets / Grain</SelectItem>
                          <SelectItem value="Coins & Medallions">Coins & Medallions</SelectItem>
                          <SelectItem value="Wholesale Mounts">Wholesale Mounts</SelectItem>
                          <SelectItem value="Chains & Bulk Findings">Chains & Bulk Findings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">Description & Trade Specifications</Label>
                    <Textarea
                      placeholder="Specify refinery hallmark, assay serial numbering, packaging, and institutional trade notes..."
                      value={descriptionEn}
                      onChange={e => setDescriptionEn(e.target.value)}
                      rows={3}
                      className="rounded-lg text-sm leading-relaxed"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground font-arabic">اسم المنتج التجاري (بالعربية) *</Label>
                      <Input
                        placeholder="مثال: سبيكة ذهب صافي عيار 24 بوزن 100 جرام"
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
                        required
                        className="h-10 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground font-arabic">الوصف والمواصفات التجارية</Label>
                    <Textarea
                      placeholder="مواصفات المصفاة، دمغة الفحص، الرقم التسلسلي، وشروط التوريد للمؤسسات..."
                      value={descriptionAr}
                      onChange={e => setDescriptionAr(e.target.value)}
                      dir="rtl"
                      rows={3}
                      className="rounded-lg text-sm font-arabic leading-relaxed"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 2. Metal Details Card */}
          <Card id="metal-details" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Metal Details</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Assay standards, purity benchmarks, and weight metrics for commercial trade.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Metal *</Label>
                  <Select value={metal} onValueChange={(val: any) => val && setMetal(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Metal" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Gold">Gold (Au)</SelectItem>
                      <SelectItem value="Silver">Silver (Ag)</SelectItem>
                      <SelectItem value="Platinum">Platinum (Pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Purity / Fineness *</Label>
                  <Select value={purity} onValueChange={(val: any) => val && setPurity(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Purity" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="24K">24K (999.9 Fine)</SelectItem>
                      <SelectItem value="22K">22K (916 Hallmarked)</SelectItem>
                      <SelectItem value="21K">21K (875 Saudi Standard)</SelectItem>
                      <SelectItem value="18K">18K (750 Jewellery)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Weight (Per Unit) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={weight}
                    onChange={e => {
                      const val = parseFloat(e.target.value) || 0
                      setWeight(val)
                      setGrossWeight(val)
                      setNetWeight(val)
                    }}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Unit of Measurement *</Label>
                  <Select value={unit} onValueChange={(val: any) => val && setUnit(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="oz">Troy Ounces (oz - 31.1g)</SelectItem>
                      <SelectItem value="tola">Tola (11.66g)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Gross Weight ({unit})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={grossWeight}
                    onChange={e => setGrossWeight(parseFloat(e.target.value) || 0)}
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Net Pure Weight ({unit}) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={netWeight}
                    onChange={e => setNetWeight(parseFloat(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Media Card */}
          <Card id="b2b-media" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Media</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Institutional product imagery and assay stamp photography.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Product Images */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Product Images</Label>

                {/* Drag and Drop Uploader */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                  <Upload className="size-8 text-muted-foreground mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    Drag &amp; drop product images or browse
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Accepted: JPG, PNG, WebP &bull; High resolution certificate &amp; bar photos
                  </p>
                </div>

                {/* 4-column thumbnail grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
                  {images.map(img => (
                    <div
                      key={img.id}
                      className="group relative rounded-xl border border-border/80 bg-muted/20 p-2 space-y-2"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-background">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="size-full object-cover"
                        />
                        {img.isPrimary && (
                          <Badge className="absolute top-1.5 left-1.5 text-[10px] h-5 px-1.5 bg-primary text-primary-foreground font-medium shadow-xs">
                            Primary
                          </Badge>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-1.5 right-1.5 size-6 rounded-md bg-background/80 backdrop-blur-xs flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[90px]">
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

          {/* 4. Inventory Card */}
          <Card id="b2b-inventory" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">Inventory</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Vault inventory balances, batch allocations, and institutional minimum order quantities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Available Quantity ({unit} or units) *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={availableQuantity}
                    onChange={e => setAvailableQuantity(parseInt(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Total stock in vault: {(availableQuantity * weight).toLocaleString()} {unit}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Minimum Order Quantity (MOQ) *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={minOrderQuantity}
                    onChange={e => setMinOrderQuantity(parseInt(e.target.value) || 1)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Lowest batch size a B2B buyer can purchase
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Stock Status *</Label>
                  <Select value={stockStatus} onValueChange={(val: any) => val && setStockStatus(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Pre-order">Pre-order / Allocation</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Product Status *</Label>
                  <Select value={productStatus} onValueChange={(val: any) => val && setProductStatus(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Product Status" />
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

          {/* 5. B2B Pricing Card */}
          <Card id="b2b-pricing" className="rounded-xl border border-border/80 shadow-xs bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">B2B Pricing</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Institutional bullion pricing: benchmark spot rate, casting premium, and commercial ZATCA VAT.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground flex items-center justify-between">
                    <span>Current Gold Rate (SAR / g) *</span>
                    <span className="text-xs font-mono text-emerald-600">Spot {purity}</span>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={currentGoldRate}
                    onChange={e => setCurrentGoldRate(parseFloat(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Rate Type *</Label>
                  <Select value={rateType} onValueChange={(val: any) => val && setRateType(val)}>
                    <SelectTrigger className="w-full h-10 rounded-lg text-sm">
                      <SelectValue placeholder="Rate Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Live Rate">Live Rate (Auto-syncs with live market)</SelectItem>
                      <SelectItem value="Fixed Rate">Fixed Rate (Locked trade price)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Making / Minting Charge (SAR) *</Label>
                  <Input
                    type="number"
                    value={makingCharge}
                    onChange={e => setMakingCharge(parseFloat(e.target.value) || 0)}
                    required
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                  <span className="text-[11px] text-muted-foreground">Fabrication/minting premium per unit</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">Additional Charges (SAR)</Label>
                  <Input
                    type="number"
                    value={additionalCharges}
                    onChange={e => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    className="h-10 rounded-lg text-sm font-mono"
                  />
                  <span className="text-[11px] text-muted-foreground">Assay certificate, tamper blister packaging</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3.5">
                <div>
                  <div className="text-sm font-medium text-foreground">Investment Bullion VAT Exemption</div>
                  <p className="text-xs text-muted-foreground">
                    Gold bars and coins of &ge;99% purity qualify for 0% VAT under Saudi ZATCA regulations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    {isVatExempt ? '0% Exempt' : '15% Standard'}
                  </span>
                  <Switch checked={isVatExempt} onCheckedChange={setIsVatExempt} />
                </div>
              </div>

              {/* Compact Calculation Summary Box */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5 text-sm">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  B2B Calculation Summary (Per Unit)
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground border-y border-border/50 py-2.5">
                  <div className="flex justify-between">
                    <span>Metal Value ({netWeight}{unit} &times; {currentGoldRate.toFixed(2)} SAR):</span>
                    <span className="font-mono text-foreground">{calculations.metalValue.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Making / Minting Charge:</span>
                    <span className="font-mono text-foreground">+{calculations.makingCharge.toFixed(2)} SAR</span>
                  </div>
                  {additionalCharges > 0 && (
                    <div className="flex justify-between">
                      <span>Additional Charges:</span>
                      <span className="font-mono text-foreground">+{calculations.additionalCharges.toFixed(2)} SAR</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-foreground pt-1 border-t border-border/30">
                    <span>Wholesale Subtotal:</span>
                    <span className="font-mono">{calculations.subtotal.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT ({isVatExempt ? '0% Investment Exemption' : '15% ZATCA'}):</span>
                    <span className="font-mono text-foreground">
                      {isVatExempt ? 'SAR 0.00' : `+${calculations.vatAmount.toFixed(2)} SAR`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-sm font-bold text-foreground">Final B2B Price:</span>
                    <span className="block text-[11px] text-muted-foreground">Ex-vault tier 1 pricing per unit</span>
                  </div>
                  <span className="text-xl font-bold text-primary font-mono">
                    {calculations.finalB2BPrice.toFixed(2)} SAR
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR (30% - 4 of 12 columns) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            {/* Card 1: B2B Product Status */}
            <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">B2B Product Status</CardTitle>
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
                  <span className="text-muted-foreground">Rate Mechanism:</span>
                  <Badge variant="outline" className="font-mono text-[11px] text-emerald-700 bg-emerald-500/10 border-emerald-500/20">
                    {rateType}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Min Order Qty:</span>
                  <span className="font-medium text-foreground">{minOrderQuantity} units</span>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="text-muted-foreground">Today at 2:45 PM</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Wholesale Price Summary */}
            <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Wholesale Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Metal Value:</span>
                  <span className="font-mono text-foreground">{calculations.metalValue.toFixed(2)} SAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Minting / Making:</span>
                  <span className="font-mono text-foreground">+{calculations.makingCharge.toFixed(2)} SAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">VAT Exemption:</span>
                  <span className="font-mono text-emerald-600">{isVatExempt ? '0% (Exempt)' : '15%'}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold text-foreground">B2B Unit Price:</span>
                  <span className="text-base font-bold text-primary font-mono">
                    {calculations.finalB2BPrice.toFixed(2)} SAR
                  </span>
                </div>

                <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Batch Value (MOQ &times; {minOrderQuantity}):</span>
                    <span className="font-mono">
                      {(calculations.finalB2BPrice * minOrderQuantity).toFixed(2)} SAR
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: B2B Readiness */}
            <Card className="rounded-xl border border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Product Readiness</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Checklist before listing in wholesale portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">Basic Information</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">Metal &amp; Assay Specs</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">Inventory &amp; MOQ</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-foreground">B2B Pricing &amp; VAT</span>
                </div>

                <div className="flex items-center gap-2">
                  {images.length > 0 ? (
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="size-4 rounded-full border border-muted-foreground/40 shrink-0" />
                  )}
                  <span className="text-foreground">Images &amp; Certificates</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
