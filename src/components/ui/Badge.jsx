import { cn } from '../../lib/utils'

const variants = {
  default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  primary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  danger: "bg-red-100 text-red-800 hover:bg-red-200",
}

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}