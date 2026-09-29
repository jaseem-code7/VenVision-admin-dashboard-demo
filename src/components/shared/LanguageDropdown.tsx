'use client'
 
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type Props = {
  trigger: ReactElement
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
}

const LanguageDropdown = ({ defaultOpen, align, trigger }: Props) => {
  const [language, setLanguage] = useState('english')

  useEffect(() => {
    const saved = localStorage.getItem('venvision_lang')
    if (saved && (saved === 'english' || saved === 'arabic')) {
      setLanguage(saved)
      applyLanguage(saved, false)
    }
  }, [])

  const applyLanguage = (lang: string, notify = true) => {
    if (typeof document !== 'undefined') {
      if (lang === 'arabic') {
        document.documentElement.dir = 'rtl'
        document.documentElement.lang = 'ar'
        document.documentElement.classList.add('rtl')
      } else {
        document.documentElement.dir = 'ltr'
        document.documentElement.lang = 'en'
        document.documentElement.classList.remove('rtl')
      }
    }
    localStorage.setItem('venvision_lang', lang)
    if (notify) {
      toast.success(
        lang === 'arabic'
          ? 'تم تغيير لغة الواجهة إلى العربية (RTL)'
          : 'Interface language switched to English (LTR)'
      )
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    applyLanguage(value, true)
  }

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent className='w-48' align={align || 'end'}>
        <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
          <DropdownMenuRadioItem value='english'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>English</span>
              <span className='text-[10px] text-muted-foreground'>(LTR)</span>
            </div>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='arabic'>
            <div className='flex items-center gap-2'>
              <span className='font-medium font-arabic'>العربية</span>
              <span className='text-[10px] text-muted-foreground'>(Arabic - RTL)</span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageDropdown
