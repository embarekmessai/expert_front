import { useToast } from "@/components/ui/use-toast"
import { toast } from "sonner"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map(({ title, description, action, position = "top-right" }) => (
            toast(title, {
                position: position,
                description: description,
                action: action,
            })
        // <Toast key={id} {...props}>
        //   <div className="grid gap-1">
        //     {title && <ToastTitle>{title}</ToastTitle>}
        //     {description && (
        //       <ToastDescription>{description}</ToastDescription>
        //     )}
        //   </div>
        //   {action}
        //   <ToastClose />
        // </Toast>
      ))}
    </>
  )
}