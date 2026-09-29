// Third-party Imports
import type * as Icon from 'lucide-react'

type IconName = keyof typeof Icon

export type MenuLeafSubItem = {
  label: string
  href: string
  activePath?: string
  badge?: string
  badgeClassName?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

export type MenuGroupSubItem = {
  label: string
  childItems: MenuLeafSubItem[]
}

export type MenuSubItem = MenuLeafSubItem | MenuGroupSubItem

export type MenuItem = {
  icon: IconName
  label: string
} & (
  | {
      href: string
      badge?: string
      badgeClassName?: string
      childItems?: never
      target?: '_blank' | '_self' | '_parent' | '_top'
    }
  | {
      href?: never
      badge?: string
      badgeClassName?: string
      childItems: MenuSubItem[]
    }
)

export type NavItem = {
  groupLabel?: string
  items: MenuItem[]
}

export const navItems: NavItem[] = [
  {
    groupLabel: 'B2C Retail',
    items: [
      {
        icon: 'LayoutDashboard',
        label: 'Dashboard',
        href: '/b2c/dashboard'
      },
      {
        icon: 'Package',
        label: 'Products',
        href: '/b2c/products'
      },
      {
        icon: 'ShoppingBag',
        label: 'Orders',
        href: '/b2c/orders'
      },
      {
        icon: 'Users',
        label: 'Customers',
        href: '/b2c/customers'
      },
      {
        icon: 'Sparkles',
        label: 'Custom Jewellery',
        href: '/custom-jewellery'
      }
    ]
  },
  {
    groupLabel: 'B2B Wholesale',
    items: [
      {
        icon: 'TrendingUp',
        label: 'Dashboard',
        href: '/b2b/dashboard'
      },
      {
        icon: 'Boxes',
        label: 'Products',
        href: '/b2b/products'
      },
      {
        icon: 'FileText',
        label: 'Orders',
        href: '/b2b/orders'
      },
      {
        icon: 'Building2',
        label: 'Customers',
        href: '/b2b/customers'
      }
    ]
  },
  {
    groupLabel: 'Management',
    items: [
      {
        icon: 'Warehouse',
        label: 'Inventory',
        href: '/inventory'
      },
      {
        icon: 'Tags',
        label: 'Categories',
        href: '/categories'
      },
      {
        icon: 'Coins',
        label: 'Gold Rate & Pricing',
        href: '/pricing'
      },
      {
        icon: 'CreditCard',
        label: 'Payments',
        href: '/payments'
      },
      {
        icon: 'Truck',
        label: 'Delivery',
        href: '/delivery'
      },
      {
        icon: 'RotateCcw',
        label: 'Returns & Refunds',
        href: '/returns-refunds'
      },
      {
        icon: 'BarChart3',
        label: 'Reports',
        href: '/reports'
      },
      {
        icon: 'Globe',
        label: 'Website Content',
        href: '/website-content'
      },
      {
        icon: 'Settings',
        label: 'Settings',
        href: '/settings'
      }
    ]
  }
]
