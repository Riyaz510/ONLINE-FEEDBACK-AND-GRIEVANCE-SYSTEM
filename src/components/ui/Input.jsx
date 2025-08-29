import { cn } from '../../lib/utils'

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm",
        "placeholder:text-gray-500",
        "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        "disabled:bg-gray-50 disabled:cursor-not-allowed",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className
      )}
      {...props}
    />
  )
}

export function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none",
        "placeholder:text-gray-500",
        "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        "disabled:bg-gray-50 disabled:cursor-not-allowed",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className
      )}
      {...props}
    />
  )
}

export function Select({ className, error, children, ...props }) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white",
        "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        "disabled:bg-gray-50 disabled:cursor-not-allowed",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}