import { useEffect } from 'react'
import { toast } from 'sonner'
import { useToast } from '@/components/ui/use-toast'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

export function Toaster() {
  const { toasts } = useToast()

  useEffect(() => {
    toasts.forEach(
      ({
        title,
        description,
        action,
        position = 'top-right',
        variant = 'default',
      }) => {
        const options = { position, description, action }
        if (variant === 'success') toast.success(title, options)
        else if (variant === 'error') toast.error(title, options)
        else if (variant === 'warning') toast.warning(title, options)
        else toast(title, options)
      },
    )
  }, [toasts])

  return <SonnerToaster position="top-right" richColors closeButton />
}
