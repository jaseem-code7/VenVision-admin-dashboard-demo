'use client'

import * as React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

const Drawer = ({
  direction = 'right',
  ...props
}: React.ComponentProps<typeof Sheet> & { direction?: 'top' | 'bottom' | 'left' | 'right' }) => {
  return <Sheet {...props} />
}

const DrawerTrigger = SheetTrigger
const DrawerClose = SheetClose
const DrawerHeader = SheetHeader
const DrawerFooter = SheetFooter
const DrawerTitle = SheetTitle
const DrawerDescription = SheetDescription

const DrawerContent = ({
  className,
  children,
  side,
  ...props
}: React.ComponentProps<typeof SheetContent>) => {
  return (
    <SheetContent side={side ?? 'right'} className={className} {...props}>
      {children}
    </SheetContent>
  )
}

export { Drawer, DrawerTrigger, DrawerClose, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerContent }
