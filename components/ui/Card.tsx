import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg shadow-lg transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-xl",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
