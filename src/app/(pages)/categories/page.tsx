'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Filter,
  RotateCcw,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface CategoryItem {
  id: string
  name: string
  nameAr: string
  slug: string
  type: 'B2C Retail' | 'B2B Wholesale' | 'Bullion & Investment'
  productsCount: number
  status: 'Active' | 'Draft' | 'Hidden'
  purityDefault: string
  updatedAt: string
  description: string
}

const initialCategoriesData: CategoryItem[] = [
  {
    id: 'cat-01',
    name: 'Rings',
    nameAr: 'خواتم ودبل',
    slug: 'rings',
    type: 'B2C Retail',
    productsCount: 42,
    status: 'Active',
    purityDefault: '18K / 21K',
    updatedAt: '24 Sep 2026',
    description: 'Solitaire, halo, eternity bands and bridal wedding sets.'
  },
  {
    id: 'cat-02',
    name: 'Necklaces',
    nameAr: 'قلائد وعقود',
    slug: 'necklaces',
    type: 'B2C Retail',
    productsCount: 38,
    status: 'Active',
    purityDefault: '18K / 21K',
    updatedAt: '22 Sep 2026',
    description: 'Chokers, tennis necklaces, statement collars, and layered gold chains.'
  },
  {
    id: 'cat-03',
    name: 'Earrings',
    nameAr: 'أقراط وحلقان',
    slug: 'earrings',
    type: 'B2C Retail',
    productsCount: 29,
    status: 'Active',
    purityDefault: '18K',
    updatedAt: '21 Sep 2026',
    description: 'Studs, chandeliers, diamond huggies, and traditional drop earrings.'
  },
  {
    id: 'cat-04',
    name: 'Bracelets',
    nameAr: 'أساور ذهبية',
    slug: 'bracelets',
    type: 'B2C Retail',
    productsCount: 34,
    status: 'Active',
    purityDefault: '18K / 21K',
    updatedAt: '20 Sep 2026',
    description: 'Diamond tennis bracelets, charm links, and Italian link chains.'
  },
  {
    id: 'cat-05',
    name: 'Bangles',
    nameAr: 'بناجر ومعاضد',
    slug: 'bangles',
    type: 'B2C Retail',
    productsCount: 26,
    status: 'Active',
    purityDefault: '21K / 22K',
    updatedAt: '19 Sep 2026',
    description: 'High-karat traditional bridal bangles, laser-cut cuffs, and stackable sets.'
  },
  {
    id: 'cat-06',
    name: 'Pendants',
    nameAr: 'تعليقات وميداليات',
    slug: 'pendants',
    type: 'B2C Retail',
    productsCount: 19,
    status: 'Active',
    purityDefault: '18K / 21K',
    updatedAt: '18 Sep 2026',
    description: 'Calligraphy initials, solitaire bezels, and symbolic medallion amulets.'
  },
  {
    id: 'cat-07',
    name: 'Gold Bars',
    nameAr: 'سبائك ذهب نقية',
    slug: 'gold-bars',
    type: 'Bullion & Investment',
    productsCount: 14,
    status: 'Active',
    purityDefault: '24K (999.9)',
    updatedAt: '24 Sep 2026',
    description: 'LBMA / PAMP / Valcambi certified cast and minted investment bars.'
  },
  {
    id: 'cat-08',
    name: 'Gold Coins',
    nameAr: 'عملات وجنيهات ذهبية',
    slug: 'gold-coins',
    type: 'Bullion & Investment',
    productsCount: 12,
    status: 'Active',
    purityDefault: '22K / 24K',
    updatedAt: '23 Sep 2026',
    description: 'King Abdulaziz sovereign coins, George sovereigns, and commemorative gold coins.'
  },
  {
    id: 'cat-09',
    name: 'Bullion & Cast Ingots',
    nameAr: 'سبائك خام ومصبوبة',
    slug: 'bullion-ingots',
    type: 'B2B Wholesale',
    productsCount: 16,
    status: 'Active',
    purityDefault: '24K (999.9)',
    updatedAt: '24 Sep 2026',
    description: 'Kilobars and standard delivery wholesale ingots for institutional treasury.'
  },
  {
    id: 'cat-10',
    name: 'Raw Grain & Scrap Melting',
    nameAr: 'حبيبات ذهب صناعية',
    slug: 'raw-grain',
    type: 'B2B Wholesale',
    productsCount: 6,
    status: 'Draft',
    purityDefault: '24K',
    updatedAt: '15 Sep 2026',
    description: 'Manufacturing casting grain for jewellery workshops and ateliers.'
  }
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategoriesData)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    type: 'B2C Retail' as CategoryItem['type'],
    status: 'Active' as CategoryItem['status'],
    purityDefault: '18K / 21K',
    description: ''
  })

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      nameAr: '',
      type: 'B2C Retail',
      status: 'Active',
      purityDefault: '18K / 21K',
      description: ''
    })
    setIsModalOpen(true)
  }

  // Open Edit Dialog
  const handleOpenEdit = (item: CategoryItem) => {
    setEditingCategory(item)
    setFormData({
      name: item.name,
      nameAr: item.nameAr,
      type: item.type,
      status: item.status,
      purityDefault: item.purityDefault,
      description: item.description
    })
    setIsModalOpen(true)
  }

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (editingCategory) {
      setCategories(prev =>
        prev.map(c =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formData.name,
                nameAr: formData.nameAr || formData.name,
                type: formData.type,
                status: formData.status,
                purityDefault: formData.purityDefault,
                description: formData.description,
                updatedAt: 'Just now'
              }
            : c
        )
      )
      toast.success(`Category "${formData.name}" updated successfully`)
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        nameAr: formData.nameAr || formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        type: formData.type,
        productsCount: 0,
        status: formData.status,
        purityDefault: formData.purityDefault,
        updatedAt: 'Just now',
        description: formData.description || 'Newly created jewellery category.'
      }
      setCategories(prev => [newCat, ...prev])
      toast.success(`Category "${formData.name}" added successfully`)
    }
    setIsModalOpen(false)
  }

  // Delete Category
  const handleDeleteCategory = (id: string, name: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    toast.success(`Category "${name}" deleted`)
  }

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setTypeFilter('ALL')
    setStatusFilter('ALL')
  }

  // Filtered List
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameAr.includes(searchQuery) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === 'ALL' || c.type === typeFilter
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [categories, searchQuery, typeFilter, statusFilter])

  return (
    <div className='space-y-6 pb-12'>
      {/* Breadcrumb & Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Link href='/b2c/dashboard' className='hover:text-foreground transition-colors'>
              Management
            </Link>
            <span>/</span>
            <span className='font-medium text-foreground'>Categories</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Categories
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Manage jewellery classifications, retail collections, and wholesale bullion types.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            onClick={handleOpenAdd}
            className='bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs font-medium text-xs sm:text-sm h-9 px-4 gap-1.5'
          >
            <Plus className='size-4' />
            Add Category
          </Button>
        </div>
      </div>

      {/* ONE Main Container: Search + Filters + Table + Centered Pagination */}
      <div className='rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden'>
        {/* Top Controls Section */}
        <div className='p-4 space-y-3.5 bg-card'>
          {/* Large Search Input */}
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
            <Input
              type='text'
              placeholder='Search category name, Arabic title, slug, or keywords...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 bg-background/50 h-9 text-xs sm:text-sm border-border/80 focus-visible:ring-1 focus-visible:ring-primary'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='size-3.5' />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className='flex flex-wrap items-center justify-between gap-3 pt-0.5'>
            <div className='flex flex-wrap items-center gap-2'>
              {/* Type Filter */}
              <div className='flex items-center gap-1.5'>
                <span className='text-[11px] text-muted-foreground font-medium'>Type:</span>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className='h-8 rounded-md border border-border/80 bg-background/60 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
                >
                  <option value='ALL'>All Types</option>
                  <option value='B2C Retail'>B2C Retail</option>
                  <option value='B2B Wholesale'>B2B Wholesale</option>
                  <option value='Bullion & Investment'>Bullion & Investment</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className='flex items-center gap-1.5'>
                <span className='text-[11px] text-muted-foreground font-medium'>Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className='h-8 rounded-md border border-border/80 bg-background/60 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
                >
                  <option value='ALL'>All Statuses</option>
                  <option value='Active'>Active</option>
                  <option value='Draft'>Draft</option>
                  <option value='Hidden'>Hidden</option>
                </select>
              </div>

              {/* Reset Filter Button */}
              {(searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleResetFilters}
                  className='h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1'
                >
                  <RotateCcw className='size-3' />
                  Reset
                </Button>
              )}
            </div>

            <div className='text-xs text-muted-foreground'>
              Showing <span className='font-semibold text-foreground'>{filteredCategories.length}</span> categories
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-border/70' />

        {/* Categories Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/70'>
              <tr>
                <th className='py-3 px-4'>Category</th>
                <th className='py-3 px-4'>Type</th>
                <th className='py-3 px-4 text-center'>Products</th>
                <th className='py-3 px-4'>Default Karat</th>
                <th className='py-3 px-4 text-center'>Status</th>
                <th className='py-3 px-4'>Updated</th>
                <th className='py-3 px-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/60'>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-muted-foreground'>
                    No categories found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCategories.map(cat => (
                  <tr
                    key={cat.id}
                    className='group hover:bg-muted/30 transition-colors'
                  >
                    {/* Category Title + Arabic */}
                    <td className='py-3.5 px-4'>
                      <div className='flex items-center gap-3'>
                        <div className='size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0'>
                          <Layers className='size-4 text-primary' />
                        </div>
                        <div>
                          <div className='font-semibold text-foreground text-xs sm:text-sm flex items-center gap-1.5'>
                            {cat.name}
                            <span className='text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.2 rounded'>
                              /{cat.slug}
                            </span>
                          </div>
                          <div className='text-[11px] text-muted-foreground flex items-center gap-2'>
                            <span className='font-arabic' dir='rtl'>{cat.nameAr}</span>
                            <span>•</span>
                            <span className='truncate max-w-[220px]'>{cat.description}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className='py-3.5 px-4 whitespace-nowrap'>
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-medium border ${
                          cat.type === 'B2C Retail'
                            ? 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                            : cat.type === 'Bullion & Investment'
                            ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                            : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                        }`}
                      >
                        {cat.type}
                      </Badge>
                    </td>

                    {/* Products Count */}
                    <td className='py-3.5 px-4 text-center whitespace-nowrap'>
                      <span className='inline-flex items-center justify-center font-semibold text-foreground bg-muted/40 px-2.5 py-0.5 rounded-full text-xs'>
                        {cat.productsCount}
                      </span>
                    </td>

                    {/* Purity Default */}
                    <td className='py-3.5 px-4 text-muted-foreground whitespace-nowrap'>
                      {cat.purityDefault}
                    </td>

                    {/* Status Badge */}
                    <td className='py-3.5 px-4 text-center whitespace-nowrap'>
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-medium border ${
                          cat.status === 'Active'
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                            : cat.status === 'Draft'
                            ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                            : 'border-muted-foreground/30 text-muted-foreground bg-muted/20'
                        }`}
                      >
                        {cat.status}
                      </Badge>
                    </td>

                    {/* Updated */}
                    <td className='py-3.5 px-4 text-muted-foreground whitespace-nowrap text-[11px]'>
                      {cat.updatedAt}
                    </td>

                    {/* Actions */}
                    <td className='py-3.5 px-4 text-right whitespace-nowrap'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleOpenEdit(cat)}
                          className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
                        >
                          <Edit2 className='size-3.5 mr-1' />
                          Edit
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger className='inline-flex items-center justify-center h-7 w-7 rounded-md border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors'>
                            <MoreVertical className='size-3.5' />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-40 text-xs'>
                            <DropdownMenuItem
                              onClick={() => toast.info(`Viewing products in ${cat.name}`)}
                              className='gap-2'
                            >
                              <Eye className='size-3.5' />
                              View Products
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const newStatus = cat.status === 'Active' ? 'Hidden' : 'Active'
                                setCategories(prev =>
                                  prev.map(c => (c.id === cat.id ? { ...c, status: newStatus } : c))
                                )
                                toast.success(`Category status set to ${newStatus}`)
                              }}
                              className='gap-2'
                            >
                              <CheckCircle2 className='size-3.5' />
                              {cat.status === 'Active' ? 'Hide Category' : 'Activate Category'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className='gap-2 text-destructive focus:text-destructive'
                            >
                              <Trash2 className='size-3.5' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className='h-px bg-border/70' />

        {/* Centered 3-Column Pagination Footer */}
        <div className='p-4 bg-card grid grid-cols-1 sm:grid-cols-3 items-center gap-3 text-xs'>
          {/* LEFT: Showing count */}
          <div className='text-muted-foreground text-center sm:text-left'>
            Showing <span className='font-semibold text-foreground'>1–{filteredCategories.length}</span> of{' '}
            <span className='font-semibold text-foreground'>{filteredCategories.length}</span> categories
          </div>

          {/* CENTER: Pagination controls visually centered */}
          <div className='flex items-center justify-center gap-1.5'>
            <Button
              variant='outline'
              size='sm'
              disabled
              className='h-7 px-2.5 text-xs border-border/80'
            >
              <ChevronLeft className='size-3.5 mr-0.5' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 text-xs bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-xs'
            >
              1
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled
              className='h-7 px-2.5 text-xs border-border/80'
            >
              Next
              <ChevronRight className='size-3.5 ml-0.5' />
            </Button>
          </div>

          {/* RIGHT: Rows per page */}
          <div className='flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground'>
            <span>Rows per page:</span>
            <select
              defaultValue='10'
              className='h-7 rounded-md border border-border/80 bg-background/60 px-2 text-xs text-foreground focus:outline-none'
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add / Edit Category Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-[480px] bg-card border-border/80'>
          <form onSubmit={handleSaveCategory}>
            <DialogHeader>
              <DialogTitle className='text-base font-semibold'>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription className='text-xs'>
                Create or modify jewellery classifications, retail lines, or wholesale bullion types.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-3.5 py-4 text-xs'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Category Name (English) *</Label>
                <Input
                  required
                  placeholder='e.g. Diamond Solitaire Rings'
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className='h-8 text-xs'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Category Name (Arabic - العربية)</Label>
                <Input
                  placeholder='مثال: خواتم ألماس سوليتير'
                  dir='rtl'
                  value={formData.nameAr}
                  onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                  className='h-8 text-xs font-arabic'
                />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Channel / Type</Label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className='h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none'
                  >
                    <option value='B2C Retail'>B2C Retail</option>
                    <option value='B2B Wholesale'>B2B Wholesale</option>
                    <option value='Bullion & Investment'>Bullion & Investment</option>
                  </select>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>Status</Label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className='h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none'
                  >
                    <option value='Active'>Active</option>
                    <option value='Draft'>Draft</option>
                    <option value='Hidden'>Hidden</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Default Karat Standard</Label>
                <Input
                  placeholder='e.g. 18K / 21K'
                  value={formData.purityDefault}
                  onChange={e => setFormData({ ...formData, purityDefault: e.target.value })}
                  className='h-8 text-xs'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Description</Label>
                <textarea
                  rows={3}
                  placeholder='Short description for catalogue and SEO indexing...'
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className='w-full rounded-md border border-input bg-background p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary'
                />
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
                className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs'
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
