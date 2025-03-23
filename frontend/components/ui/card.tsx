import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  animate?: boolean
}

export function Card({ children, className, animate = true, ...props }: CardProps) {
  const content = (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}
