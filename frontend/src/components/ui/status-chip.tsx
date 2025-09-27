import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusChipVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        queued: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        running: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        searching: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        resolving: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        downloading: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusChipVariants> {}

function StatusChip({ className, variant, ...props }: StatusChipProps) {
  return (
    <span
      className={cn(statusChipVariants({ variant }), className)}
      {...props}
    />
  )
}

export { StatusChip, statusChipVariants }

