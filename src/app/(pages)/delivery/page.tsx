'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Truck,
  Package,
  DollarSign,
  TrendingDown,
  Gift,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight as ChevronRightIcon,
  Calendar,
  Building2,
  User,
  Info,
  Plus,
  Sliders,
  Radio,
  Zap,
  CheckCircle2,
  XCircle,
  Settings2,
  ArrowUpRight,
  Key,
  Globe2,
  FileText,
  BadgePercent,
  MoveUp,
  MoveDown
} from 'lucide-react'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

export type DeliveryStatus =
  | 'Pending Pickup'
  | 'Picked Up'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Failed Delivery'
  | 'Returned'
  | 'Cancelled'

export type CourierProvider = {
  id: string
  code: string
  name: string
  logoText: string
  integrationStatus: 'Integrated' | 'Configuring' | 'Disabled'
  apiEnvironment: 'Production' | 'Sandbox'
  serviceType: string
  coverage: string
  averageCostSAR: number
  averageDeliveryDays: string
  activeShipments: number
  successRate: number
  status: 'Active' | 'Inactive'
  features: string[]
  pricing: {
    baseFee: number
    additionalKgFee: number
    remoteAreaFee: number
    codFee: number
    returnFee: number
    insurancePct: number
    vatPct: number
    cityRates: {
      riyadh: number
      jeddah: number
      dammam: number
      makkah: number
      madinah: number
      other: number
    }
  }
}

export type ShipmentRecord = {
  id: string
  orderNumber: string
  customer: string
  channel: 'B2C' | 'B2B'
  courierId: string
  courierName: string
  deliveryType: 'Free Delivery' | 'Customer Paid' | 'Subsidized Tier'
  customerPaidSAR: number
  courierCostSAR: number
  venvisionSubsidySAR: number // courierCostSAR - customerPaidSAR
  status: DeliveryStatus
  trackingNumber: string
  destinationCity: string
  createdDate: string
  estimatedDelivery: string
}

// Initial 5 Saudi Providers as specified
const INITIAL_PROVIDERS: CourierProvider[] = [
  {
    id: 'spl',
    code: 'SPL',
    name: 'SPL – Saudi Post',
    logoText: 'SPL',
    integrationStatus: 'Integrated',
    apiEnvironment: 'Production',
    serviceType: 'Domestic / Last Mile',
    coverage: 'Saudi Arabia',
    averageCostSAR: 22.0,
    averageDeliveryDays: '2–4 days',
    activeShipments: 184,
    successRate: 97.5,
    status: 'Active',
    features: ['Create Shipment', 'Generate Delivery Label', 'Shipment Tracking', 'Returns', 'Proof of Delivery'],
    pricing: {
      baseFee: 22.0,
      additionalKgFee: 2.5,
      remoteAreaFee: 8.0,
      codFee: 4.0,
      returnFee: 12.0,
      insurancePct: 0.5,
      vatPct: 15,
      cityRates: {
        riyadh: 20.0,
        jeddah: 22.0,
        dammam: 22.0,
        makkah: 23.0,
        madinah: 23.0,
        other: 26.0
      }
    }
  },
  {
    id: 'smsa',
    code: 'SMSA',
    name: 'SMSA Express',
    logoText: 'SMSA',
    integrationStatus: 'Integrated',
    apiEnvironment: 'Production',
    serviceType: 'Express / E-commerce',
    coverage: 'Saudi Arabia',
    averageCostSAR: 25.0,
    averageDeliveryDays: '1–3 days',
    activeShipments: 126,
    successRate: 96.8,
    status: 'Active',
    features: ['Create Shipment', 'Generate Delivery Label', 'Shipment Tracking', 'Cancel Shipment', 'Returns', 'Cash on Delivery', 'Proof of Delivery'],
    pricing: {
      baseFee: 25.0,
      additionalKgFee: 3.0,
      remoteAreaFee: 10.0,
      codFee: 5.0,
      returnFee: 15.0,
      insurancePct: 0.8,
      vatPct: 15,
      cityRates: {
        riyadh: 22.0,
        jeddah: 25.0,
        dammam: 25.0,
        makkah: 26.0,
        madinah: 26.0,
        other: 28.0
      }
    }
  },
  {
    id: 'aramex',
    code: 'ARAMEX',
    name: 'Aramex',
    logoText: 'ARX',
    integrationStatus: 'Integrated',
    apiEnvironment: 'Production',
    serviceType: 'Domestic / Express',
    coverage: 'Saudi Arabia',
    averageCostSAR: 27.0,
    averageDeliveryDays: '1–3 days',
    activeShipments: 98,
    successRate: 97.1,
    status: 'Active',
    features: ['Create Shipment', 'Generate Delivery Label', 'Shipment Tracking', 'Cancel Shipment', 'Returns', 'Proof of Delivery'],
    pricing: {
      baseFee: 27.0,
      additionalKgFee: 3.5,
      remoteAreaFee: 12.0,
      codFee: 6.0,
      returnFee: 16.0,
      insurancePct: 1.0,
      vatPct: 15,
      cityRates: {
        riyadh: 24.0,
        jeddah: 27.0,
        dammam: 27.0,
        makkah: 28.0,
        madinah: 28.0,
        other: 30.0
      }
    }
  },
  {
    id: 'ajex',
    code: 'AJEX',
    name: 'AJEX Logistics',
    logoText: 'AJEX',
    integrationStatus: 'Integrated',
    apiEnvironment: 'Production',
    serviceType: 'E-commerce Express',
    coverage: 'Saudi Arabia / GCC',
    averageCostSAR: 24.0,
    averageDeliveryDays: '1–3 days',
    activeShipments: 72,
    successRate: 96.4,
    status: 'Active',
    features: ['Create Shipment', 'Generate Delivery Label', 'Shipment Tracking', 'Returns', 'Proof of Delivery'],
    pricing: {
      baseFee: 24.0,
      additionalKgFee: 3.0,
      remoteAreaFee: 9.0,
      codFee: 5.0,
      returnFee: 14.0,
      insurancePct: 0.6,
      vatPct: 15,
      cityRates: {
        riyadh: 21.0,
        jeddah: 24.0,
        dammam: 24.0,
        makkah: 25.0,
        madinah: 25.0,
        other: 27.0
      }
    }
  },
  {
    id: 'imile',
    code: 'IMILE',
    name: 'iMile Delivery',
    logoText: 'iMile',
    integrationStatus: 'Integrated',
    apiEnvironment: 'Production',
    serviceType: 'Last Mile / Marketplace',
    coverage: 'Saudi Arabia',
    averageCostSAR: 21.0,
    averageDeliveryDays: '2–4 days',
    activeShipments: 61,
    successRate: 95.9,
    status: 'Active',
    features: ['Create Shipment', 'Generate Delivery Label', 'Shipment Tracking', 'Cash on Delivery', 'Proof of Delivery'],
    pricing: {
      baseFee: 21.0,
      additionalKgFee: 2.0,
      remoteAreaFee: 8.0,
      codFee: 4.5,
      returnFee: 11.0,
      insurancePct: 0.5,
      vatPct: 15,
      cityRates: {
        riyadh: 19.0,
        jeddah: 21.0,
        dammam: 21.0,
        makkah: 22.0,
        madinah: 22.0,
        other: 25.0
      }
    }
  }
]

// 12 Realistic shipments
const INITIAL_SHIPMENTS: ShipmentRecord[] = [
  {
    id: 'shp-1',
    orderNumber: 'VV-ORD-10254',
    customer: 'Ahmed Ali',
    channel: 'B2C',
    courierId: 'smsa',
    courierName: 'SMSA Express',
    deliveryType: 'Free Delivery',
    customerPaidSAR: 0,
    courierCostSAR: 25.0,
    venvisionSubsidySAR: 25.0,
    status: 'Delivered',
    trackingNumber: 'SMSA9283847',
    destinationCity: 'Riyadh',
    createdDate: '25 Sep 2026',
    estimatedDelivery: '25 Sep 2026'
  },
  {
    id: 'shp-2',
    orderNumber: 'VV-ORD-10255',
    customer: 'Noura Al-Saud',
    channel: 'B2C',
    courierId: 'aramex',
    courierName: 'Aramex',
    deliveryType: 'Customer Paid',
    customerPaidSAR: 27.0,
    courierCostSAR: 27.0,
    venvisionSubsidySAR: 0.0,
    status: 'Delivered',
    trackingNumber: 'ARX8849201',
    destinationCity: 'Jeddah',
    createdDate: '25 Sep 2026',
    estimatedDelivery: '25 Sep 2026'
  },
  {
    id: 'shp-3',
    orderNumber: 'VV-B2B-8901',
    customer: 'Al-Jazeera Jewellers',
    channel: 'B2B',
    courierId: 'smsa',
    courierName: 'SMSA Express',
    deliveryType: 'Customer Paid',
    customerPaidSAR: 50.0,
    courierCostSAR: 50.0,
    venvisionSubsidySAR: 0.0,
    status: 'Out for Delivery',
    trackingNumber: 'SMSA440918',
    destinationCity: 'Dammam',
    createdDate: '24 Sep 2026',
    estimatedDelivery: '25 Sep 2026'
  },
  {
    id: 'shp-4',
    orderNumber: 'VV-ORD-10250',
    customer: 'Fatima Al-Otaibi',
    channel: 'B2C',
    courierId: 'spl',
    courierName: 'SPL – Saudi Post',
    deliveryType: 'Free Delivery',
    customerPaidSAR: 0,
    courierCostSAR: 22.0,
    venvisionSubsidySAR: 22.0,
    status: 'In Transit',
    trackingNumber: 'SPL773910',
    destinationCity: 'Khobar',
    createdDate: '24 Sep 2026',
    estimatedDelivery: '26 Sep 2026'
  },
  {
    id: 'shp-5',
    orderNumber: 'VV-ORD-10249',
    customer: 'Dr. Tariq Mansoor',
    channel: 'B2C',
    courierId: 'ajex',
    courierName: 'AJEX Logistics',
    deliveryType: 'Subsidized Tier',
    customerPaidSAR: 15.0,
    courierCostSAR: 24.0,
    venvisionSubsidySAR: 9.0,
    status: 'In Transit',
    trackingNumber: 'AJX9284102',
    destinationCity: 'Medina',
    createdDate: '24 Sep 2026',
    estimatedDelivery: '26 Sep 2026'
  },
  {
    id: 'shp-6',
    orderNumber: 'VV-ORD-10246',
    customer: 'Reem Al-Hassan',
    channel: 'B2C',
    courierId: 'imile',
    courierName: 'iMile Delivery',
    deliveryType: 'Free Delivery',
    customerPaidSAR: 0,
    courierCostSAR: 21.0,
    venvisionSubsidySAR: 21.0,
    status: 'Delivered',
    trackingNumber: 'IML772841',
    destinationCity: 'Riyadh',
    createdDate: '23 Sep 2026',
    estimatedDelivery: '24 Sep 2026'
  },
  {
    id: 'shp-7',
    orderNumber: 'VV-B2B-8898',
    customer: 'Riyadh Gold Foundry Co.',
    channel: 'B2B',
    courierId: 'aramex',
    courierName: 'Aramex',
    deliveryType: 'Customer Paid',
    customerPaidSAR: 75.0,
    courierCostSAR: 75.0,
    venvisionSubsidySAR: 0.0,
    status: 'Delivered',
    trackingNumber: 'ARX440899',
    destinationCity: 'Riyadh',
    createdDate: '23 Sep 2026',
    estimatedDelivery: '23 Sep 2026'
  },
  {
    id: 'shp-8',
    orderNumber: 'VV-ORD-10241',
    customer: 'Zaid Al-Harbi',
    channel: 'B2C',
    courierId: 'spl',
    courierName: 'SPL – Saudi Post',
    deliveryType: 'Free Delivery',
    customerPaidSAR: 0,
    courierCostSAR: 22.0,
    venvisionSubsidySAR: 22.0,
    status: 'Delivered',
    trackingNumber: 'SPL551029',
    destinationCity: 'Tabuk',
    createdDate: '22 Sep 2026',
    estimatedDelivery: '25 Sep 2026'
  },
  {
    id: 'shp-9',
    orderNumber: 'VV-ORD-10238',
    customer: 'Layan Al-Shahrani',
    channel: 'B2C',
    courierId: 'smsa',
    courierName: 'SMSA Express',
    deliveryType: 'Free Delivery',
    customerPaidSAR: 0,
    courierCostSAR: 25.0,
    venvisionSubsidySAR: 25.0,
    status: 'Failed Delivery',
    trackingNumber: 'SMSA9279912',
    destinationCity: 'Abha',
    createdDate: '21 Sep 2026',
    estimatedDelivery: '23 Sep 2026'
  },
  {
    id: 'shp-10',
    orderNumber: 'VV-ORD-10235',
    customer: 'Sultan Bin Khalid',
    channel: 'B2C',
    courierId: 'aramex',
    courierName: 'Aramex',
    deliveryType: 'Customer Paid',
    customerPaidSAR: 27.0,
    courierCostSAR: 27.0,
    venvisionSubsidySAR: 0.0,
    status: 'Delivered',
    trackingNumber: 'ARX8845100',
    destinationCity: 'Riyadh',
    createdDate: '21 Sep 2026',
    estimatedDelivery: '21 Sep 2026'
  },
  {
    id: 'shp-11',
    orderNumber: 'VV-ORD-10230',
    customer: 'Haya Al-Dosari',
    channel: 'B2C',
    courierId: 'ajex',
    courierName: 'AJEX Logistics',
    deliveryType: 'Free Delivery',
    customerPaidSAR: 0,
    courierCostSAR: 24.0,
    venvisionSubsidySAR: 24.0,
    status: 'Pending Pickup',
    trackingNumber: 'AJX771092',
    destinationCity: 'Taif',
    createdDate: '20 Sep 2026',
    estimatedDelivery: '23 Sep 2026'
  },
  {
    id: 'shp-12',
    orderNumber: 'VV-ORD-10228',
    customer: 'Omar Al-Ghamdi',
    channel: 'B2C',
    courierId: 'spl',
    courierName: 'SPL – Saudi Post',
    deliveryType: 'Free Delivery',
    customerPaidSAR: 0,
    courierCostSAR: 22.0,
    venvisionSubsidySAR: 22.0,
    status: 'Returned',
    trackingNumber: 'SPL550882',
    destinationCity: 'Najran',
    createdDate: '19 Sep 2026',
    estimatedDelivery: '22 Sep 2026'
  }
]

// Provider Comparison Analytics (Exact User Spec)
const PROVIDER_ANALYTICS = [
  {
    provider: 'SPL – Saudi Post',
    totalShipments: 520,
    delivered: 505,
    failed: 8,
    returned: 7,
    averageCostSAR: 22.0,
    averageDeliveryDays: 2.8,
    totalAmountPaidSAR: 11440
  },
  {
    provider: 'SMSA Express',
    totalShipments: 410,
    delivered: 397,
    failed: 9,
    returned: 4,
    averageCostSAR: 25.0,
    averageDeliveryDays: 2.1,
    totalAmountPaidSAR: 10250
  },
  {
    provider: 'Aramex',
    totalShipments: 280,
    delivered: 271,
    failed: 6,
    returned: 3,
    averageCostSAR: 27.0,
    averageDeliveryDays: 2.0,
    totalAmountPaidSAR: 7560
  },
  {
    provider: 'AJEX Logistics',
    totalShipments: 190,
    delivered: 182,
    failed: 5,
    returned: 3,
    averageCostSAR: 24.0,
    averageDeliveryDays: 2.3,
    totalAmountPaidSAR: 4560
  },
  {
    provider: 'iMile Delivery',
    totalShipments: 150,
    delivered: 142,
    failed: 5,
    returned: 3,
    averageCostSAR: 21.0,
    averageDeliveryDays: 2.7,
    totalAmountPaidSAR: 3150
  }
]

// Monthly Delivery Cost Bar Data
const MONTHLY_EXPENSE_DATA = [
  {
    month: 'Jun',
    courierCost: 24150,
    customerPaid: 14200,
    venvisionSubsidy: 9950
  },
  {
    month: 'Jul',
    courierCost: 26800,
    customerPaid: 15400,
    venvisionSubsidy: 11400
  },
  {
    month: 'Aug',
    courierCost: 28900,
    customerPaid: 16100,
    venvisionSubsidy: 12800
  },
  {
    month: 'Sep',
    courierCost: 31420,
    customerPaid: 8450,
    venvisionSubsidy: 22970
  }
]

export default function DeliveryShippingPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])
  const isDark = mounted ? resolvedTheme === 'dark' : false

  const [activeTab, setActiveTab] = React.useState('overview')
  const [providers, setProviders] = React.useState<CourierProvider[]>(INITIAL_PROVIDERS)
  const [shipments, setShipments] = React.useState<ShipmentRecord[]>(INITIAL_SHIPMENTS)

  // Automatic Courier Selection Rule State
  const [selectionRule, setSelectionRule] = React.useState<
    'manual' | 'lowest_cost' | 'fastest' | 'best_success' | 'priority'
  >('lowest_cost')
  const [priorityOrder, setPriorityOrder] = React.useState<string[]>([
    'SPL – Saudi Post',
    'SMSA Express',
    'Aramex',
    'AJEX Logistics',
    'iMile Delivery'
  ])

  // Modals state
  const [isAddProviderOpen, setIsAddProviderOpen] = React.useState(false)
  const [editingPricingProvider, setEditingPricingProvider] = React.useState<CourierProvider | null>(null)
  const [assigningShipment, setAssigningShipment] = React.useState<ShipmentRecord | null>(null)
  const [manifestShipment, setManifestShipment] = React.useState<ShipmentRecord | null>(null)

  // Filters state (Shipment Tab)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [courierFilter, setCourierFilter] = React.useState('ALL')
  const [channelFilter, setChannelFilter] = React.useState('ALL')
  const [statusFilter, setStatusFilter] = React.useState('ALL')
  const [deliveryTypeFilter, setDeliveryTypeFilter] = React.useState('ALL')
  const [currentPage, setCurrentPage] = React.useState(1)
  const rowsPerPage = 6

  // New Provider Form state
  const [newProvider, setNewProvider] = React.useState({
    name: '',
    code: '',
    apiBaseUrl: 'https://api.carrier.sa/v1',
    apiKey: '',
    apiSecret: '',
    accountNumber: '',
    environment: 'Sandbox' as 'Sandbox' | 'Production',
    serviceType: 'Standard' as 'Standard' | 'Express' | 'Same Day' | 'Next Day' | 'B2B Freight',
    status: 'Active' as 'Active' | 'Inactive',
    features: [
      'Create Shipment',
      'Generate Delivery Label',
      'Shipment Tracking',
      'Cancel Shipment',
      'Returns',
      'Proof of Delivery'
    ]
  })

  // Feature Toggle for New Provider Modal
  const toggleFeature = (feat: string) => {
    setNewProvider(prev => ({
      ...prev,
      features: prev.features.includes(feat)
        ? prev.features.filter(f => f !== feat)
        : [...prev.features, feat]
    }))
  }

  // Handle Save New Provider
  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProvider.name || !newProvider.code) {
      toast.error('Please provide a carrier name and provider code.')
      return
    }

    const created: CourierProvider = {
      id: newProvider.code.toLowerCase(),
      code: newProvider.code.toUpperCase(),
      name: newProvider.name,
      logoText: newProvider.code.slice(0, 3).toUpperCase(),
      integrationStatus: 'Integrated',
      apiEnvironment: newProvider.environment,
      serviceType: newProvider.serviceType,
      coverage: 'Saudi Arabia',
      averageCostSAR: 23.0,
      averageDeliveryDays: '1–3 days',
      activeShipments: 0,
      successRate: 98.0,
      status: newProvider.status,
      features: newProvider.features,
      pricing: {
        baseFee: 23.0,
        additionalKgFee: 3.0,
        remoteAreaFee: 10.0,
        codFee: 5.0,
        returnFee: 12.0,
        insurancePct: 0.5,
        vatPct: 15,
        cityRates: {
          riyadh: 20.0,
          jeddah: 23.0,
          dammam: 23.0,
          makkah: 25.0,
          madinah: 25.0,
          other: 28.0
        }
      }
    }

    setProviders(prev => [...prev, created])
    setPriorityOrder(prev => [...prev, created.name])
    setIsAddProviderOpen(false)
    toast.success(`Carrier "${created.name}" connected and saved successfully.`)
  }

  // Priority reorder helper
  const movePriority = (idx: number, dir: 'up' | 'down') => {
    const next = [...priorityOrder]
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= next.length) return
    const temp = next[idx]
    next[idx] = next[targetIdx]
    next[targetIdx] = temp
    setPriorityOrder(next)
    toast.success('Updated courier priority routing order.')
  }

  // Reassign courier to shipment
  const handleAssignCourier = (shipmentId: string, provider: CourierProvider) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          const newCost = provider.averageCostSAR
          const newSubsidy = Math.max(0, newCost - s.customerPaidSAR)
          return {
            ...s,
            courierId: provider.id,
            courierName: provider.name,
            courierCostSAR: newCost,
            venvisionSubsidySAR: newSubsidy
          }
        }
        return s
      })
    )
    toast.success(`Assigned ${provider.name} to order. Rate updated to SAR ${provider.averageCostSAR.toFixed(2)}.`)
    setAssigningShipment(null)
  }

  // Status Badge Helper
  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-medium'
          >
            Delivered
          </Badge>
        )
      case 'In Transit':
      case 'Out for Delivery':
        return (
          <Badge
            variant='outline'
            className='bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 text-[11px] font-medium'
          >
            {status}
          </Badge>
        )
      case 'Pending Pickup':
      case 'Picked Up':
        return (
          <Badge
            variant='outline'
            className='bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[11px] font-medium'
          >
            {status}
          </Badge>
        )
      case 'Failed Delivery':
      case 'Returned':
      case 'Cancelled':
        return (
          <Badge
            variant='outline'
            className='bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 text-[11px] font-medium'
          >
            {status}
          </Badge>
        )
      default:
        return (
          <Badge variant='outline' className='text-[11px]'>
            {status}
          </Badge>
        )
    }
  }

  // Filtered Shipments
  const filteredShipments = React.useMemo(() => {
    return shipments.filter(s => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        s.orderNumber.toLowerCase().includes(q) ||
        s.customer.toLowerCase().includes(q) ||
        s.trackingNumber.toLowerCase().includes(q) ||
        s.destinationCity.toLowerCase().includes(q)

      const matchesCourier = courierFilter === 'ALL' || s.courierName === courierFilter || s.courierId === courierFilter
      const matchesChannel = channelFilter === 'ALL' || s.channel === channelFilter
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
      const matchesType =
        deliveryTypeFilter === 'ALL' ||
        (deliveryTypeFilter === 'FREE' && s.customerPaidSAR === 0) ||
        (deliveryTypeFilter === 'PAID' && s.customerPaidSAR > 0)

      return matchesSearch && matchesCourier && matchesChannel && matchesStatus && matchesType
    })
  }, [shipments, searchQuery, courierFilter, channelFilter, statusFilter, deliveryTypeFilter])

  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage) || 1
  const displayedShipments = filteredShipments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const resetFilters = () => {
    setSearchQuery('')
    setCourierFilter('ALL')
    setChannelFilter('ALL')
    setStatusFilter('ALL')
    setDeliveryTypeFilter('ALL')
    setCurrentPage(1)
    toast.info('Filters reset to default view')
  }

  return (
    <div className='flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full'>
      {/* ================================================== */}
      {/* 1. TOP HEADER & ADD PROVIDER ACTION                */}
      {/* ================================================== */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Badge
              variant='outline'
              className='text-[10px] font-mono uppercase tracking-wider text-primary border-primary/20 bg-primary/5 px-2 py-0.5'
            >
              Saudi Logistics &amp; Carrier Network
            </Badge>
            <span className='text-xs text-muted-foreground'>Multi-Provider Fleet Routing</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5'>
            <Truck className='size-7 text-primary' />
            Delivery
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Manage domestic courier providers, delivery rates, performance benchmarks and VenVision delivery expenses across Saudi Arabia.
          </p>
        </div>

        <div className='flex items-center gap-2.5'>
          <Button
            size='sm'
            onClick={() => setIsAddProviderOpen(true)}
            className='h-9 px-4 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 shadow-xs'
          >
            <Plus className='size-4' />
            <span>Add Delivery Provider</span>
          </Button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. TOP TABS                                        */}
      {/* ================================================== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-5'>
        <TabsList className='bg-muted/40 p-1 border border-border/60 rounded-xl h-auto'>
          <TabsTrigger value='overview' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Overview
          </TabsTrigger>
          <TabsTrigger value='shipments' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Shipments ({shipments.length})
          </TabsTrigger>
          <TabsTrigger value='providers' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Delivery Providers ({providers.length})
          </TabsTrigger>
          <TabsTrigger value='campaigns' className='text-xs px-4 py-1.5 data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-2xs rounded-lg'>
            Free Delivery Campaigns
          </TabsTrigger>
        </TabsList>

        {/* ================================================== */}
        {/* TAB 1: OVERVIEW                                    */}
        {/* ================================================== */}
        <TabsContent value='overview' className='space-y-6 pt-1 outline-none'>
          {/* 5 Compact KPI Cards */}
          <div className='grid grid-cols-2 lg:grid-cols-5 gap-3.5'>
            {/* Card 1: Total Shipments */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Total Shipments</span>
                <Package className='size-4 text-muted-foreground/70' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-foreground'>
                  1,248
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1'>
                  <span className='text-emerald-500 font-medium'>+8.4%</span>
                  <span>vs previous month</span>
                </p>
              </div>
            </Card>

            {/* Card 2: Delivery Cost */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Delivery Cost</span>
                <DollarSign className='size-4 text-amber-500' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-amber-500 dark:text-amber-400'>
                  SAR 31,420
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  Paid to courier companies
                </p>
              </div>
            </Card>

            {/* Card 3: Customer Delivery Revenue */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Customer Revenue</span>
                <TrendingDown className='size-4 text-emerald-500' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-emerald-500 dark:text-emerald-400'>
                  SAR 8,450
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  Collected from customers
                </p>
              </div>
            </Card>

            {/* Card 4: Free Delivery Cost */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Free Delivery Cost</span>
                <Gift className='size-4 text-[#D4AF37]' />
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-[#D4AF37] dark:text-[#E5C158]'>
                  SAR 18,750
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  Orders where customer paid SAR 0
                </p>
              </div>
            </Card>

            {/* Card 5: Net Delivery Expense */}
            <Card className='rounded-xl border border-border/80 bg-card p-4 shadow-2xs flex flex-col justify-between col-span-2 lg:col-span-1'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span className='font-medium'>Net Delivery Expense</span>
                <Badge variant='outline' className='text-[9px] px-1 py-0 border-[#8C253E]/40 text-[#DC2626] dark:text-[#F87171] bg-[#8C253E]/10'>
                  Courier - Revenue
                </Badge>
              </div>
              <div className='mt-2'>
                <div className='text-2xl font-bold font-mono tracking-tight text-[#DC2626] dark:text-[#F87171]'>
                  SAR 22,970
                </div>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  Net cost absorbed by VenVision
                </p>
              </div>
            </Card>
          </div>

          {/* Monthly Delivery Expense Chart & Quick Dispatch Benchmark */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
            {/* Chart: Delivery Cost by Month (8 cols) */}
            <Card className='lg:col-span-8 rounded-xl border border-border/80 bg-card shadow-xs'>
              <CardHeader className='pb-2 border-b border-border/60'>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-sm font-semibold text-foreground'>
                      Delivery Cost by Month
                    </CardTitle>
                    <CardDescription className='text-xs text-muted-foreground'>
                      Courier Cost vs Customer Paid Revenue vs VenVision Free Subsidy
                    </CardDescription>
                  </div>
                  <Badge variant='outline' className='text-[10px] font-mono'>
                    SAR Currency
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='p-4 pt-5'>
                <div className='h-[230px] w-full min-w-0'>
                  <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={200}>
                    <BarChart data={MONTHLY_EXPENSE_DATA} barGap={4}>
                      <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' vertical={false} opacity={0.6} />
                      <XAxis dataKey='month' stroke='hsl(var(--muted-foreground))' fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke='hsl(var(--muted-foreground))' fontSize={11} tickLine={false} axisLine={false} tickFormatter={val => `${val / 1000}k`} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '11px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                        }}
                        formatter={(value: any) => [`SAR ${Number(value).toLocaleString()}`, '']}
                      />
                      <Legend verticalAlign='top' align='right' iconType='circle' wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                      <Bar dataKey='courierCost' name='Courier Cost' fill={isDark ? '#7447E8' : '#8C253E'} radius={[4, 4, 0, 0]} />
                      <Bar dataKey='customerPaid' name='Customer Paid' fill={isDark ? '#38BDF8' : '#16A34A'} radius={[4, 4, 0, 0]} />
                      <Bar dataKey='venvisionSubsidy' name='VenVision Subsidy' fill={isDark ? '#9668FF' : '#D4AF37'} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className='mt-3 pt-3 border-t border-border/60 grid grid-cols-3 gap-2 text-center text-xs'>
                  <div className='p-2 rounded-lg bg-background border border-border/70'>
                    <span className='text-[10px] text-muted-foreground block'>September Courier</span>
                    <span className='font-mono font-bold text-amber-500 dark:text-amber-400 text-xs sm:text-sm'>SAR 31,420</span>
                  </div>
                  <div className='p-2 rounded-lg bg-background border border-border/70'>
                    <span className='text-[10px] text-muted-foreground block'>Customer Paid</span>
                    <span className='font-mono font-bold text-emerald-500 dark:text-emerald-400 text-xs sm:text-sm'>SAR 8,450</span>
                  </div>
                  <div className='p-2 rounded-lg bg-[#8C253E]/10 border border-[#8C253E]/30'>
                    <span className='text-[10px] text-[#DC2626] dark:text-[#F87171] block font-medium'>VenVision Subsidy</span>
                    <span className='font-mono font-bold text-[#DC2626] dark:text-[#F87171] text-xs sm:text-sm'>SAR 22,970</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courier Routing Logic Status (4 cols) */}
            <Card className='lg:col-span-4 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between'>
              <CardHeader className='pb-3 border-b border-border/60'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
                    <Sliders className='size-4 text-primary' />
                    Courier Selection Engine
                  </CardTitle>
                  <Badge variant='outline' className='text-[10px] text-emerald-600 border-emerald-500/20 bg-emerald-500/10'>
                    Active
                  </Badge>
                </div>
                <CardDescription className='text-xs text-muted-foreground'>
                  Order routing criteria across Saudi territory
                </CardDescription>
              </CardHeader>
              <CardContent className='p-4 space-y-3 text-xs'>
                <div className='p-3 rounded-lg border border-border/70 bg-background space-y-1.5'>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Current Algorithm:</span>
                    <Badge variant='default' className='text-[10px] bg-primary text-primary-foreground font-medium'>
                      {selectionRule === 'lowest_cost'
                        ? 'Lowest Delivery Cost'
                        : selectionRule === 'fastest'
                        ? 'Fastest Delivery'
                        : selectionRule === 'best_success'
                        ? 'Best Success Rate'
                        : selectionRule === 'priority'
                        ? 'Priority Provider'
                        : 'Manual Selection'}
                    </Badge>
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    Orders are automatically pre-routed to the courier with the lowest negotiated rate for the destination city.
                  </p>
                </div>

                <div className='space-y-1.5 pt-1'>
                  <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                    Provider Performance Highlights
                  </span>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='p-2 rounded-lg border border-border/60 bg-muted/15'>
                      <span className='text-[10px] text-muted-foreground block'>Cheapest Carrier</span>
                      <span className='font-semibold text-foreground block'>iMile Delivery</span>
                      <span className='font-mono text-[11px] text-emerald-600'>SAR 21.00 avg</span>
                    </div>
                    <div className='p-2 rounded-lg border border-border/60 bg-muted/15'>
                      <span className='text-[10px] text-muted-foreground block'>Fastest Transit</span>
                      <span className='font-semibold text-foreground block'>Aramex</span>
                      <span className='font-mono text-[11px] text-primary'>2.0 days avg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='p-3 border-t border-border/60 bg-muted/10 flex justify-between items-center'>
                <span className='text-[11px] text-muted-foreground'>5 Active Saudi Couriers</span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setActiveTab('providers')}
                  className='h-7 px-2 text-xs text-primary hover:bg-primary/10'
                >
                  Configure Rules &rarr;
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Provider Analytics Comparison Table */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-sm font-semibold text-foreground flex items-center gap-2'>
                    <ShieldCheck className='size-4 text-primary' />
                    Provider Performance &amp; Analytics
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Courier-wise SLA success rates, transit speed, and gross expenditure comparison
                  </CardDescription>
                </div>
                <span className='text-xs font-mono text-muted-foreground'>5 Carrier Accounts</span>
              </div>
            </CardHeader>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80'>
                  <TableRow className='hover:bg-transparent border-b border-border/80 text-xs'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Provider</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Total Shipments</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Delivered</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Failed</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Returned</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Average Cost</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Avg Delivery Time</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Total Amount Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {PROVIDER_ANALYTICS.map(p => (
                    <TableRow key={p.provider} className='hover:bg-muted/25 transition-colors h-[52px]'>
                      <TableCell className='py-2.5 pl-5 font-semibold text-foreground flex items-center gap-2.5'>
                        <div className='size-7 rounded-md bg-muted/60 border border-border flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground'>
                          {p.provider.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <span>{p.provider}</span>
                          <span className='text-[10px] text-muted-foreground block font-normal'>
                            {p.delivered / p.totalShipments > 0.96 ? 'SLA Compliant (96%+)' : 'Watch SLA'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono font-medium text-foreground'>
                        {p.totalShipments}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-emerald-600 font-medium'>
                        {p.delivered}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-rose-600 font-medium'>
                        {p.failed}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-amber-600 font-medium'>
                        {p.returned}
                      </TableCell>
                      <TableCell className='py-2.5 text-right font-mono text-foreground font-semibold'>
                        SAR {p.averageCostSAR.toFixed(2)}
                      </TableCell>
                      <TableCell className='py-2.5 text-center font-mono text-muted-foreground'>
                        {p.averageDeliveryDays} days
                      </TableCell>
                      <TableCell className='py-2.5 pr-5 text-right font-mono font-bold text-foreground'>
                        SAR {p.totalAmountPaidSAR.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 2: SHIPMENTS & ORDER LEDGER                    */}
        {/* ================================================== */}
        <TabsContent value='shipments' className='space-y-4 pt-1 outline-none'>
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3.5 border-b border-border/60'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <CardTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
                    <Truck className='size-4 text-primary' />
                    Shipment Ledger &amp; Provider Assignment
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Live customer delivery charges, courier invoiced costs, and VenVision subsidized amounts
                  </CardDescription>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => toast.success('Exporting filtered shipments to CSV...')}
                  className='h-8 text-xs gap-1.5'
                >
                  <Download className='size-3.5' /> Export
                </Button>
              </div>

              {/* Toolbar Search & Filters */}
              <div className='pt-3 flex flex-wrap items-center justify-between gap-2.5'>
                <div className='relative w-full sm:w-80'>
                  <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none' />
                  <Input
                    type='text'
                    placeholder='Search order, tracking number, customer...'
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className='h-9 pl-8 pr-3 text-xs bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-primary'
                  />
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                  {/* Courier filter */}
                  <Select
                    value={courierFilter}
                    onValueChange={v => {
                      setCourierFilter(v)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className='h-9 w-36 text-xs rounded-lg bg-background border-border/80'>
                      <SelectValue placeholder='Courier' />
                    </SelectTrigger>
                    <SelectContent className='rounded-xl'>
                      <SelectItem value='ALL'>All Couriers</SelectItem>
                      {providers.map(p => (
                        <SelectItem key={p.id} value={p.name}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Channel Filter */}
                  <Select
                    value={channelFilter}
                    onValueChange={v => {
                      setChannelFilter(v)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className='h-9 w-28 text-xs rounded-lg bg-background border-border/80'>
                      <SelectValue placeholder='Channel' />
                    </SelectTrigger>
                    <SelectContent className='rounded-xl'>
                      <SelectItem value='ALL'>All Channels</SelectItem>
                      <SelectItem value='B2C'>B2C Retail</SelectItem>
                      <SelectItem value='B2B'>B2B Wholesale</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Delivery Status Filter */}
                  <Select
                    value={statusFilter}
                    onValueChange={v => {
                      setStatusFilter(v)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className='h-9 w-36 text-xs rounded-lg bg-background border-border/80'>
                      <SelectValue placeholder='Delivery Status' />
                    </SelectTrigger>
                    <SelectContent className='rounded-xl'>
                      <SelectItem value='ALL'>All Statuses</SelectItem>
                      <SelectItem value='Pending Pickup'>Pending Pickup</SelectItem>
                      <SelectItem value='Picked Up'>Picked Up</SelectItem>
                      <SelectItem value='In Transit'>In Transit</SelectItem>
                      <SelectItem value='Out for Delivery'>Out for Delivery</SelectItem>
                      <SelectItem value='Delivered'>Delivered</SelectItem>
                      <SelectItem value='Failed Delivery'>Failed Delivery</SelectItem>
                      <SelectItem value='Returned'>Returned</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Free vs Paid Filter */}
                  <Select
                    value={deliveryTypeFilter}
                    onValueChange={v => {
                      setDeliveryTypeFilter(v)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className='h-9 w-32 text-xs rounded-lg bg-background border-border/80'>
                      <SelectValue placeholder='Pricing Type' />
                    </SelectTrigger>
                    <SelectContent className='rounded-xl'>
                      <SelectItem value='ALL'>All Pricing</SelectItem>
                      <SelectItem value='FREE'>Free Delivery (SAR 0)</SelectItem>
                      <SelectItem value='PAID'>Customer Paid</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchQuery || courierFilter !== 'ALL' || channelFilter !== 'ALL' || statusFilter !== 'ALL' || deliveryTypeFilter !== 'ALL') && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={resetFilters}
                      className='h-9 px-2 text-xs text-muted-foreground hover:text-foreground'
                    >
                      <RotateCcw className='size-3 mr-1' /> Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80'>
                  <TableRow className='hover:bg-transparent border-b border-border/80 text-xs'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Order</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Customer</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Courier</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Tracking Number</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Delivery Type</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Customer Paid</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Courier Cost</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>VenVision Cost</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Status</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Created</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {displayedShipments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className='h-36 text-center text-muted-foreground'>
                        No shipments found matching current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedShipments.map(s => (
                      <TableRow key={s.id} className='hover:bg-muted/20 border-b border-border/50 h-[56px] transition-colors'>
                        {/* Order */}
                        <TableCell className='py-2.5 pl-5 font-mono text-xs font-bold text-primary'>
                          <Link href={s.channel === 'B2B' ? '/b2b/orders' : '/b2c/orders'} className='hover:underline'>
                            {s.orderNumber}
                          </Link>
                          <span className='block text-[10px] text-muted-foreground font-normal'>{s.channel}</span>
                        </TableCell>

                        {/* Customer */}
                        <TableCell className='py-2.5'>
                          <div className='font-semibold text-foreground'>{s.customer}</div>
                          <div className='text-[10px] text-muted-foreground'>{s.destinationCity}, KSA</div>
                        </TableCell>

                        {/* Courier */}
                        <TableCell className='py-2.5'>
                          <Badge variant='outline' className='text-[10px] px-1.5 py-0 font-medium'>
                            {s.courierName}
                          </Badge>
                        </TableCell>

                        {/* Tracking Number */}
                        <TableCell className='py-2.5 font-mono text-[11px]'>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-foreground'>{s.trackingNumber}</span>
                            <button
                              type='button'
                              onClick={() => {
                                navigator.clipboard.writeText(s.trackingNumber)
                                toast.success(`Copied: ${s.trackingNumber}`)
                              }}
                              className='text-muted-foreground hover:text-foreground'
                            >
                              <Copy className='size-3' />
                            </button>
                          </div>
                        </TableCell>

                        {/* Delivery Type */}
                        <TableCell className='py-2.5'>
                          {s.customerPaidSAR === 0 ? (
                            <span className='inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]'>
                              <Gift className='size-3' /> Free Delivery
                            </span>
                          ) : (
                            <span className='text-muted-foreground text-[11px]'>Standard Paid</span>
                          )}
                        </TableCell>

                        {/* Customer Paid */}
                        <TableCell className='py-2.5 text-right font-mono font-medium text-foreground'>
                          SAR {s.customerPaidSAR.toFixed(2)}
                        </TableCell>

                        {/* Courier Cost */}
                        <TableCell className='py-2.5 text-right font-mono font-medium text-foreground'>
                          SAR {s.courierCostSAR.toFixed(2)}
                        </TableCell>

                        {/* VenVision Subsidy Cost */}
                        <TableCell className='py-2.5 text-right font-mono font-bold text-primary'>
                          {s.venvisionSubsidySAR > 0 ? `SAR ${s.venvisionSubsidySAR.toFixed(2)}` : 'SAR 0.00'}
                        </TableCell>

                        {/* Status */}
                        <TableCell className='py-2.5 text-center'>
                          {getStatusBadge(s.status)}
                        </TableCell>

                        {/* Created Date */}
                        <TableCell className='py-2.5 text-muted-foreground text-[11px] whitespace-nowrap'>
                          {s.createdDate}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className='py-2.5 pr-5 text-right space-x-1.5'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setAssigningShipment(s)}
                            className='h-7 px-2 text-[11px]'
                            title='Reassign courier provider'
                          >
                            Change Courier
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setManifestShipment(s)}
                            className='h-7 px-2 text-[11px] text-primary hover:bg-primary/10'
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className='p-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground'>
              <div>
                Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
                {Math.min(currentPage * rowsPerPage, filteredShipments.length)} of {filteredShipments.length} shipments
              </div>

              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className='h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground'
                >
                  <ChevronLeft className='size-3.5' />
                  <span>Previous</span>
                </Button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1
                  return (
                    <Button
                      key={pNum}
                      variant={currentPage === pNum ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setCurrentPage(pNum)}
                      className={`size-8 p-0 text-xs rounded-lg font-medium ${
                        currentPage === pNum
                          ? 'bg-primary text-primary-foreground'
                          : 'border-border/80 bg-background text-foreground'
                      }`}
                    >
                      {pNum}
                    </Button>
                  )
                })}

                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className='h-8 px-2.5 text-xs rounded-lg gap-1 border-border/80 bg-background text-foreground'
                >
                  <span>Next</span>
                  <ChevronRight className='size-3.5' />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 3: DELIVERY PROVIDERS (MANAGEMENT & RULES)     */}
        {/* ================================================== */}
        <TabsContent value='providers' className='space-y-6 pt-1 outline-none'>
          {/* Automatic Courier Selection Rules Card */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs'>
            <CardHeader className='pb-3.5 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-sm font-semibold text-foreground flex items-center gap-2'>
                    <Sliders className='size-4 text-primary' />
                    Automatic Courier Selection Rules
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Define how VenVision automatically pairs each order with the best third-party courier
                  </CardDescription>
                </div>
                <Button
                  size='sm'
                  onClick={() => toast.success('Courier routing rules saved and deployed across storefront checkout.')}
                  className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
                >
                  Save Selection Rules
                </Button>
              </div>
            </CardHeader>

            <CardContent className='p-5 space-y-5 text-xs'>
              {/* Radio options */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3'>
                {[
                  { id: 'manual', label: 'Manual selection only', desc: 'Admin chooses courier per dispatch' },
                  { id: 'lowest_cost', label: 'Lowest delivery cost', desc: 'Auto-pick cheapest negotiated rate' },
                  { id: 'fastest', label: 'Fastest delivery', desc: 'Prioritize shortest estimated transit' },
                  { id: 'best_success', label: 'Best success rate', desc: 'Route to highest SLA carrier' },
                  { id: 'priority', label: 'Priority provider order', desc: 'Follow defined priority sequence' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setSelectionRule(opt.id as any)}
                    className={`rounded-xl border p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
                      selectionRule === opt.id
                        ? 'border-primary ring-1 ring-primary/40 bg-primary/5'
                        : 'border-border/80 bg-background hover:bg-muted/30'
                    }`}
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-foreground text-xs'>{opt.label}</span>
                        <span
                          className={`size-3.5 rounded-full border flex items-center justify-center ${
                            selectionRule === opt.id ? 'border-primary bg-primary' : 'border-border'
                          }`}
                        >
                          {selectionRule === opt.id && <span className='size-1.5 rounded-full bg-white' />}
                        </span>
                      </div>
                      <p className='text-[11px] text-muted-foreground'>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Priority Ordering List */}
              <div className='rounded-xl border border-border/70 bg-muted/15 p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='font-semibold text-foreground text-xs uppercase tracking-wider'>
                    Carrier Priority Sequence (Fallback Hierarchy)
                  </span>
                  <span className='text-[11px] text-muted-foreground'>Use arrows to adjust hierarchy</span>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-5 gap-2'>
                  {priorityOrder.map((carrierName, idx) => (
                    <div
                      key={carrierName}
                      className='p-2.5 rounded-lg border border-border/80 bg-background flex items-center justify-between shadow-2xs'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='size-5 rounded-full bg-primary/10 text-primary font-mono font-bold text-[10px] flex items-center justify-center'>
                          {idx + 1}
                        </span>
                        <span className='font-medium text-foreground text-xs truncate max-w-[110px]'>
                          {carrierName}
                        </span>
                      </div>
                      <div className='flex items-center gap-0.5'>
                        <button
                          type='button'
                          disabled={idx === 0}
                          onClick={() => movePriority(idx, 'up')}
                          className='p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30'
                          title='Move Up'
                        >
                          <MoveUp className='size-3' />
                        </button>
                        <button
                          type='button'
                          disabled={idx === priorityOrder.length - 1}
                          onClick={() => movePriority(idx, 'down')}
                          className='p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30'
                          title='Move Down'
                        >
                          <MoveDown className='size-3' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Provider Table */}
          <Card className='rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
            <CardHeader className='pb-3.5 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-base font-semibold text-foreground'>
                    Configured Delivery Providers
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Saudi Arabian courier integrations, API status, and commercial rate cards
                  </CardDescription>
                </div>
                <Badge variant='outline' className='text-xs font-mono'>
                  {providers.length} Couriers Active
                </Badge>
              </div>
            </CardHeader>

            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/20 border-b border-border/80'>
                  <TableRow className='hover:bg-transparent border-b border-border/80 text-xs'>
                    <TableHead className='py-3 pl-5 font-semibold text-foreground'>Provider</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Services</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground'>Coverage</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-right'>Avg. Cost</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Avg. Delivery Time</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Shipments</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Success Rate</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>API Status</TableHead>
                    <TableHead className='py-3 font-semibold text-foreground text-center'>Status</TableHead>
                    <TableHead className='py-3 pr-5 font-semibold text-foreground text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-xs divide-y divide-border/50'>
                  {providers.map(p => (
                    <TableRow key={p.id} className='hover:bg-muted/20 transition-colors h-[58px]'>
                      {/* Provider name + logo */}
                      <TableCell className='py-2.5 pl-5 font-semibold text-foreground'>
                        <div className='flex items-center gap-2.5'>
                          <div className='size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-xs text-primary shrink-0'>
                            {p.logoText}
                          </div>
                          <div>
                            <span className='font-semibold text-foreground block'>{p.name}</span>
                            <span className='text-[10px] text-muted-foreground font-mono font-normal'>
                              Code: {p.code} &bull; {p.apiEnvironment}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Services */}
                      <TableCell className='py-2.5 text-muted-foreground font-medium'>
                        {p.serviceType}
                      </TableCell>

                      {/* Coverage */}
                      <TableCell className='py-2.5 text-foreground'>
                        {p.coverage}
                      </TableCell>

                      {/* Avg Cost */}
                      <TableCell className='py-2.5 text-right font-mono font-bold text-foreground'>
                        SAR {p.averageCostSAR.toFixed(2)}
                      </TableCell>

                      {/* Avg Delivery Time */}
                      <TableCell className='py-2.5 text-center font-mono text-muted-foreground'>
                        {p.averageDeliveryDays}
                      </TableCell>

                      {/* Active Shipments */}
                      <TableCell className='py-2.5 text-center font-mono font-medium text-foreground'>
                        {p.activeShipments} active
                      </TableCell>

                      {/* Success Rate */}
                      <TableCell className='py-2.5 text-center'>
                        <span className='font-mono font-semibold text-emerald-600 dark:text-emerald-400'>
                          {p.successRate}%
                        </span>
                      </TableCell>

                      {/* API Status */}
                      <TableCell className='py-2.5 text-center'>
                        <Badge
                          variant='outline'
                          className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-medium'
                        >
                          <CheckCircle2 className='size-3 mr-1' /> {p.integrationStatus}
                        </Badge>
                      </TableCell>

                      {/* Status Toggle */}
                      <TableCell className='py-2.5 text-center'>
                        <Badge
                          variant={p.status === 'Active' ? 'default' : 'outline'}
                          className={`text-[10px] ${
                            p.status === 'Active' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className='py-2.5 pr-5 text-right space-x-1.5 whitespace-nowrap'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setEditingPricingProvider(p)}
                          className='h-7 px-2 text-[11px]'
                        >
                          View Rates
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            toast.success(`Pinged ${p.name} API endpoint: 200 OK (Latency: 84ms)`)
                          }}
                          className='h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground'
                        >
                          Test API
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ================================================== */}
        {/* TAB 4: FREE DELIVERY CAMPAIGNS                     */}
        {/* ================================================== */}
        <TabsContent value='campaigns' className='space-y-6 pt-1 outline-none'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
            {/* Active Campaign Card (6 cols) */}
            <Card className='lg:col-span-6 rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden'>
              <CardHeader className='pb-3.5 border-b border-border/60 bg-muted/10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary'>
                      <Gift className='size-4' />
                    </div>
                    <div>
                      <CardTitle className='text-sm font-semibold text-foreground'>
                        Free Delivery Campaign
                      </CardTitle>
                      <CardDescription className='text-xs text-muted-foreground'>
                        Promotional customer free delivery subsidy tracking
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant='outline'
                    className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold px-2'
                  >
                    Active Campaign
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='p-5 space-y-4 text-xs'>
                <div className='rounded-lg bg-background border border-border/70 p-3 space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>Campaign:</span>
                    <span className='font-semibold text-foreground text-sm'>
                      First Month Free Delivery
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Calendar className='size-3 text-muted-foreground' /> Period:
                    </span>
                    <span className='font-mono text-foreground'>01 Sep 2026 - 30 Sep 2026</span>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-lg border border-border/60 bg-muted/15 p-3 space-y-0.5'>
                    <span className='text-muted-foreground text-[11px] block'>Eligible Orders</span>
                    <span className='font-mono font-bold text-lg text-foreground'>750</span>
                    <span className='text-[10px] text-muted-foreground block'>Customer Paid: SAR 0</span>
                  </div>

                  <div className='rounded-lg border border-border/60 bg-muted/15 p-3 space-y-0.5'>
                    <span className='text-muted-foreground text-[11px] block'>Average Delivery Cost</span>
                    <span className='font-mono font-bold text-lg text-foreground'>SAR 25</span>
                    <span className='text-[10px] text-muted-foreground block'>Blended courier rate</span>
                  </div>
                </div>

                <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-foreground'>Courier Invoice Incurred:</span>
                    <span className='font-mono font-bold text-foreground'>SAR 18,750.00</span>
                  </div>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-foreground'>Customer Paid Delivery:</span>
                    <span className='font-mono font-bold text-emerald-600'>SAR 0.00</span>
                  </div>
                  <div className='border-t border-primary/20 pt-2 flex items-center justify-between'>
                    <div>
                      <span className='font-bold text-xs text-primary block'>VenVision Subsidy Total</span>
                      <span className='text-[10px] text-muted-foreground'>Absorbed marketing cost</span>
                    </div>
                    <span className='font-mono text-lg font-bold text-primary'>
                      SAR 18,750.00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subsidy Calculation Explanation Card (6 cols) */}
            <Card className='lg:col-span-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between'>
              <CardHeader className='pb-3.5 border-b border-border/60'>
                <CardTitle className='text-sm font-semibold text-foreground flex items-center gap-2'>
                  <BadgePercent className='size-4 text-primary' />
                  Free Delivery Cost Calculation Engine
                </CardTitle>
                <CardDescription className='text-xs text-muted-foreground'>
                  Formula applied automatically to every customer order
                </CardDescription>
              </CardHeader>

              <CardContent className='p-5 space-y-3.5 text-xs'>
                <div className='p-3.5 rounded-lg border border-border/80 bg-muted/20 font-mono text-center'>
                  <span className='text-xs text-muted-foreground block mb-1'>Subsidy Accounting Formula:</span>
                  <span className='text-sm font-bold text-primary'>
                    VenVision Subsidy = Actual Courier Cost - Customer Delivery Fee
                  </span>
                </div>

                <div className='space-y-2'>
                  <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                    Live Working Examples:
                  </span>

                  {/* Scenario 1: Free Delivery */}
                  <div className='p-2.5 rounded-lg border border-border/60 bg-background space-y-1'>
                    <div className='flex justify-between font-semibold'>
                      <span>Scenario 1: Free Promo Order</span>
                      <Badge variant='outline' className='text-[10px] text-emerald-600 border-emerald-500/20'>
                        Customer Paid SAR 0
                      </Badge>
                    </div>
                    <div className='text-muted-foreground flex justify-between'>
                      <span>Courier Cost: SAR 25 &bull; Customer Fee: SAR 0</span>
                      <span className='font-mono font-bold text-primary'>VenVision Subsidy: SAR 25</span>
                    </div>
                  </div>

                  {/* Scenario 2: Subsidized Rate */}
                  <div className='p-2.5 rounded-lg border border-border/60 bg-background space-y-1'>
                    <div className='flex justify-between font-semibold'>
                      <span>Scenario 2: Tiered Remote Subsidy</span>
                      <Badge variant='outline' className='text-[10px]'>
                        Customer Paid SAR 15
                      </Badge>
                    </div>
                    <div className='text-muted-foreground flex justify-between'>
                      <span>Courier Cost: SAR 25 &bull; Customer Fee: SAR 15</span>
                      <span className='font-mono font-bold text-primary'>VenVision Subsidy: SAR 10</span>
                    </div>
                  </div>

                  {/* Scenario 3: Full Delivery Fee */}
                  <div className='p-2.5 rounded-lg border border-border/60 bg-background space-y-1'>
                    <div className='flex justify-between font-semibold'>
                      <span>Scenario 3: Full Customer Paid</span>
                      <Badge variant='outline' className='text-[10px] text-muted-foreground'>
                        Zero Subsidy
                      </Badge>
                    </div>
                    <div className='text-muted-foreground flex justify-between'>
                      <span>Courier Cost: SAR 25 &bull; Customer Fee: SAR 25</span>
                      <span className='font-mono font-semibold text-foreground'>VenVision Subsidy: SAR 0</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className='p-3 border-t border-border/60 bg-muted/10'>
                <Button
                  size='sm'
                  onClick={() => toast.info('New campaign creator modal')}
                  className='w-full text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground'
                >
                  Create New Promotional Campaign
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ================================================== */}
      {/* 3. MODAL: ADD DELIVERY PROVIDER                    */}
      {/* ================================================== */}
      <Dialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen}>
        <DialogContent className='max-w-xl bg-card border-border/80 shadow-xl rounded-xl'>
          <DialogHeader className='pb-2 border-b border-border/60'>
            <DialogTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
              <Truck className='size-5 text-primary' />
              Add Delivery Service Provider
            </DialogTitle>
            <DialogDescription className='text-xs text-muted-foreground'>
              Configure third-party Saudi logistics integration and API credentials.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProvider} className='space-y-4 py-2 text-xs'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Provider Name</Label>
                <Input
                  required
                  placeholder='e.g. Careem Express'
                  value={newProvider.name}
                  onChange={e => setNewProvider({ ...newProvider, name: e.target.value })}
                  className='h-8 text-xs'
                />
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Provider Code</Label>
                <Input
                  required
                  placeholder='e.g. CAREEM'
                  value={newProvider.code}
                  onChange={e => setNewProvider({ ...newProvider, code: e.target.value })}
                  className='h-8 text-xs font-mono uppercase'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>API Base URL</Label>
                <Input
                  value={newProvider.apiBaseUrl}
                  onChange={e => setNewProvider({ ...newProvider, apiBaseUrl: e.target.value })}
                  className='h-8 text-xs font-mono'
                />
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Account Number</Label>
                <Input
                  placeholder='VV-ACC-88219'
                  value={newProvider.accountNumber}
                  onChange={e => setNewProvider({ ...newProvider, accountNumber: e.target.value })}
                  className='h-8 text-xs font-mono'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>API Key</Label>
                <Input
                  type='password'
                  placeholder='Bearer key or token'
                  value={newProvider.apiKey}
                  onChange={e => setNewProvider({ ...newProvider, apiKey: e.target.value })}
                  className='h-8 text-xs font-mono'
                />
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>API Secret</Label>
                <Input
                  type='password'
                  placeholder='Secret hash'
                  value={newProvider.apiSecret}
                  onChange={e => setNewProvider({ ...newProvider, apiSecret: e.target.value })}
                  className='h-8 text-xs font-mono'
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Environment</Label>
                <Select
                  value={newProvider.environment}
                  onValueChange={(val: any) => setNewProvider({ ...newProvider, environment: val })}
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl'>
                    <SelectItem value='Sandbox'>Sandbox (Test)</SelectItem>
                    <SelectItem value='Production'>Production (Live)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Service Type</Label>
                <Select
                  value={newProvider.serviceType}
                  onValueChange={(val: any) => setNewProvider({ ...newProvider, serviceType: val })}
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl'>
                    <SelectItem value='Standard'>Standard</SelectItem>
                    <SelectItem value='Express'>Express</SelectItem>
                    <SelectItem value='Same Day'>Same Day</SelectItem>
                    <SelectItem value='Next Day'>Next Day</SelectItem>
                    <SelectItem value='B2B Freight'>B2B Freight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1'>
                <Label className='text-xs font-semibold'>Initial Status</Label>
                <Select
                  value={newProvider.status}
                  onValueChange={(val: any) => setNewProvider({ ...newProvider, status: val })}
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='rounded-xl'>
                    <SelectItem value='Active'>Active</SelectItem>
                    <SelectItem value='Inactive'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Supported Features Checkboxes */}
            <div className='space-y-2 pt-1 border-t border-border/60'>
              <Label className='text-xs font-semibold block'>Supported Features</Label>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                {[
                  'Create Shipment',
                  'Generate Delivery Label',
                  'Shipment Tracking',
                  'Cancel Shipment',
                  'Returns',
                  'Cash on Delivery',
                  'Proof of Delivery'
                ].map(feat => (
                  <label key={feat} className='flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 rounded'>
                    <input
                      type='checkbox'
                      checked={newProvider.features.includes(feat)}
                      onChange={() => toggleFeature(feat)}
                      className='accent-primary size-3.5 rounded'
                    />
                    <span className='text-foreground'>{feat}</span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter className='gap-2 sm:gap-0 pt-3 border-t border-border/60'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsAddProviderOpen(false)}
                className='h-8 text-xs'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                size='sm'
                className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
              >
                Save Provider
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================================================== */}
      {/* 4. MODAL: ORDER COURIER ASSIGNMENT & SELECTION     */}
      {/* ================================================== */}
      <Dialog open={!!assigningShipment} onOpenChange={open => !open && setAssigningShipment(null)}>
        {assigningShipment && (
          <DialogContent className='max-w-md bg-card border-border/80 shadow-xl rounded-xl'>
            <DialogHeader className='pb-2 border-b border-border/60'>
              <DialogTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
                <Truck className='size-4 text-primary' />
                Select Delivery Provider
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Order: <span className='font-mono font-bold text-foreground'>{assigningShipment.orderNumber}</span> &bull; {assigningShipment.destinationCity}, KSA
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-2 text-xs'>
              {/* Recommended Provider Banner */}
              <div className='rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='font-semibold text-xs text-primary flex items-center gap-1.5'>
                    <Sparkles className='size-3.5' /> Recommended Provider
                  </span>
                  <Badge className='text-[10px] bg-primary text-primary-foreground'>
                    Algorithm Match
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='font-bold text-foreground text-sm block'>SMSA Express</span>
                    <span className='text-[11px] text-muted-foreground'>Estimated 1–3 days delivery</span>
                  </div>
                  <div className='text-right'>
                    <span className='font-mono font-bold text-base text-foreground'>SAR 25.00</span>
                    <span className='text-[10px] text-muted-foreground block'>Negotiated Base Rate</span>
                  </div>
                </div>
                <Button
                  size='sm'
                  onClick={() => {
                    const smsa = providers.find(p => p.id === 'smsa') || providers[0]
                    handleAssignCourier(assigningShipment.id, smsa)
                  }}
                  className='w-full h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-1'
                >
                  Confirm Recommended Provider
                </Button>
              </div>

              {/* Other Options */}
              <div className='space-y-2'>
                <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                  Alternative Available Couriers (Manual Override)
                </span>

                <div className='space-y-1.5'>
                  {providers.map(p => (
                    <div
                      key={p.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                        assigningShipment.courierName === p.name
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-border/70 bg-background hover:bg-muted/30'
                      }`}
                    >
                      <div className='flex items-center gap-2.5'>
                        <div className='size-7 rounded-md bg-muted/60 border border-border flex items-center justify-center font-mono font-bold text-[10px] text-muted-foreground'>
                          {p.logoText}
                        </div>
                        <div>
                          <div className='font-semibold text-foreground flex items-center gap-1.5'>
                            <span>{p.name}</span>
                            {assigningShipment.courierName === p.name && (
                              <span className='text-[9px] text-primary font-mono'>(Current)</span>
                            )}
                          </div>
                          <span className='text-[10px] text-muted-foreground'>
                            {p.averageDeliveryDays} transit
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        <span className='font-mono font-semibold text-foreground text-xs'>
                          SAR {p.averageCostSAR.toFixed(2)}
                        </span>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleAssignCourier(assigningShipment.id, p)}
                          className='h-7 px-2.5 text-[11px]'
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className='border-t border-border/60 pt-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setAssigningShipment(null)}
                className='h-8 text-xs'
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ================================================== */}
      {/* 5. MODAL: CONFIGURE PROVIDER NEGOTIATED PRICING    */}
      {/* ================================================== */}
      <Dialog open={!!editingPricingProvider} onOpenChange={open => !open && setEditingPricingProvider(null)}>
        {editingPricingProvider && (
          <DialogContent className='max-w-lg bg-card border-border/80 shadow-xl rounded-xl'>
            <DialogHeader className='pb-2 border-b border-border/60'>
              <DialogTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
                <DollarSign className='size-4 text-primary' />
                Negotiated Courier Rates: {editingPricingProvider.name}
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Commercial agreed pricing for VenVision. Actual rates depend on agreement and destination.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-2 text-xs'>
              {/* Global Commercial Fees */}
              <div className='grid grid-cols-3 gap-2.5'>
                <div className='p-2.5 rounded-lg border border-border/70 bg-background space-y-1'>
                  <span className='text-muted-foreground text-[11px] block'>Base Delivery Fee</span>
                  <div className='flex items-center font-mono font-bold text-foreground text-sm'>
                    SAR <input
                      type='number'
                      defaultValue={editingPricingProvider.pricing.baseFee}
                      className='w-16 ml-1 p-0.5 bg-muted/40 border border-input rounded text-xs'
                    />
                  </div>
                </div>

                <div className='p-2.5 rounded-lg border border-border/70 bg-background space-y-1'>
                  <span className='text-muted-foreground text-[11px] block'>Additional KG Fee</span>
                  <div className='flex items-center font-mono font-bold text-foreground text-sm'>
                    SAR <input
                      type='number'
                      defaultValue={editingPricingProvider.pricing.additionalKgFee}
                      className='w-14 ml-1 p-0.5 bg-muted/40 border border-input rounded text-xs'
                    />
                  </div>
                </div>

                <div className='p-2.5 rounded-lg border border-border/70 bg-background space-y-1'>
                  <span className='text-muted-foreground text-[11px] block'>Remote Area Fee</span>
                  <div className='flex items-center font-mono font-bold text-foreground text-sm'>
                    SAR <input
                      type='number'
                      defaultValue={editingPricingProvider.pricing.remoteAreaFee}
                      className='w-14 ml-1 p-0.5 bg-muted/40 border border-input rounded text-xs'
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-2.5'>
                <div className='p-2.5 rounded-lg border border-border/70 bg-background space-y-1'>
                  <span className='text-muted-foreground text-[11px] block'>COD Handling Fee</span>
                  <div className='flex items-center font-mono font-bold text-foreground text-sm'>
                    SAR <input
                      type='number'
                      defaultValue={editingPricingProvider.pricing.codFee}
                      className='w-14 ml-1 p-0.5 bg-muted/40 border border-input rounded text-xs'
                    />
                  </div>
                </div>

                <div className='p-2.5 rounded-lg border border-border/70 bg-background space-y-1'>
                  <span className='text-muted-foreground text-[11px] block'>Return Fee</span>
                  <div className='flex items-center font-mono font-bold text-foreground text-sm'>
                    SAR <input
                      type='number'
                      defaultValue={editingPricingProvider.pricing.returnFee}
                      className='w-14 ml-1 p-0.5 bg-muted/40 border border-input rounded text-xs'
                    />
                  </div>
                </div>

                <div className='p-2.5 rounded-lg border border-border/70 bg-background space-y-1'>
                  <span className='text-muted-foreground text-[11px] block'>VAT Tax Rate</span>
                  <span className='font-mono font-bold text-foreground text-sm block pt-1'>15% (ZATCA)</span>
                </div>
              </div>

              {/* City Tier Breakdown */}
              <div className='space-y-1.5'>
                <span className='text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block'>
                  Negotiated City Rates (SAR)
                </span>
                <div className='grid grid-cols-3 gap-2'>
                  {Object.entries(editingPricingProvider.pricing.cityRates).map(([city, rate]) => (
                    <div key={city} className='p-2 rounded-lg border border-border/60 bg-muted/20 flex justify-between items-center'>
                      <span className='capitalize text-foreground font-medium'>{city}:</span>
                      <span className='font-mono font-bold text-foreground'>SAR {rate.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className='text-[11px] text-muted-foreground italic border-t border-border/60 pt-2'>
                Note: These values are configurable according to VenVision commercial contract terms with {editingPricingProvider.name}.
              </p>
            </div>

            <DialogFooter className='gap-2 sm:gap-0 pt-2 border-t border-border/60'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setEditingPricingProvider(null)}
                className='h-8 text-xs'
              >
                Close
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  toast.success(`Commercial rate card for ${editingPricingProvider.name} updated.`)
                  setEditingPricingProvider(null)
                }}
                className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
              >
                Save Rate Card
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ================================================== */}
      {/* 6. MODAL: SHIPMENT MANIFEST DETAILS                */}
      {/* ================================================== */}
      <Dialog open={!!manifestShipment} onOpenChange={open => !open && setManifestShipment(null)}>
        {manifestShipment && (
          <DialogContent className='max-w-md bg-card border-border/80 shadow-xl rounded-xl'>
            <DialogHeader className='pb-2 border-b border-border/60'>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
                  <Truck className='size-4 text-primary' />
                  Shipment Manifest Details
                </DialogTitle>
                {getStatusBadge(manifestShipment.status)}
              </div>
              <DialogDescription className='text-xs text-muted-foreground'>
                Order: <span className='font-mono font-bold text-foreground'>{manifestShipment.orderNumber}</span>
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-2 text-xs'>
              <div className='rounded-lg border border-border/70 bg-muted/20 p-3 space-y-1.5'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Carrier Assigned:</span>
                  <span className='font-semibold text-foreground'>{manifestShipment.courierName}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Tracking Number:</span>
                  <span className='font-mono font-bold text-foreground'>{manifestShipment.trackingNumber}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Dispatch Date:</span>
                  <span className='font-mono text-foreground'>{manifestShipment.createdDate}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Estimated Delivery:</span>
                  <span className='font-mono text-foreground'>{manifestShipment.estimatedDelivery}</span>
                </div>
              </div>

              <div className='p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Courier Invoice Incurred:</span>
                  <span className='font-mono font-semibold text-foreground'>
                    SAR {manifestShipment.courierCostSAR.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Customer Paid Delivery:</span>
                  <span className='font-mono font-semibold text-emerald-600'>
                    SAR {manifestShipment.customerPaidSAR.toFixed(2)}
                  </span>
                </div>
                <div className='border-t border-primary/20 pt-1.5 flex justify-between font-bold'>
                  <span className='text-primary'>VenVision Absorbed Cost:</span>
                  <span className='font-mono text-primary text-sm'>
                    SAR {manifestShipment.venvisionSubsidySAR.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className='gap-2 sm:gap-0 pt-2 border-t border-border/60'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setManifestShipment(null)}
                className='h-8 text-xs'
              >
                Close
              </Button>
              <Button
                size='sm'
                onClick={() => toast.success(`Tracking link generated for ${manifestShipment.trackingNumber}`)}
                className='h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1'
              >
                <ExternalLink className='size-3.5' />
                <span>Track on Carrier Portal</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
