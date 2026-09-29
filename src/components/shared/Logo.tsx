// Config Imports
import themeConfig from '@/configs/themeConfig'

// SVG Imports
import LogoSvg from '@/assets/svg/logo'

// Util Imports
import { cn } from '@/lib/utils'

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img src='/images/logo.png' alt={themeConfig.templateName} className='size-9 object-contain shrink-0' />
      <span className='text-xl font-bold tracking-tight'>{themeConfig.templateName}</span>
    </div>
  )
}

export default Logo
