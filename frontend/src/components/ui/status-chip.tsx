import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Link, 
  Download, 
  Pause,
  AlertTriangle,
  Loader2
} from "lucide-react"

import { cn } from "@/lib/utils"

const statusChipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        queued: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        running: "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        completed: "bg-success/10 text-success border border-success/20 dark:bg-success/20",
        failed: "bg-destructive/10 text-destructive border border-destructive/20 dark:bg-destructive/20",
        searching: "bg-processing/10 text-processing border border-processing/20 dark:bg-processing/20",
        resolving: "bg-warning/10 text-warning border border-warning/20 dark:bg-warning/20",
        downloading: "bg-info/10 text-info border border-info/20 dark:bg-info/20",
        skipped: "bg-warning/10 text-warning border border-warning/20 dark:bg-warning/20",
        default: "bg-muted text-muted-foreground border border-border",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const iconMap = {
  queued: Clock,
  running: Loader2,
  completed: CheckCircle,
  failed: XCircle,
  searching: Search,
  resolving: Link,
  downloading: Download,
  skipped: Pause,
  default: AlertTriangle,
} as const;

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusChipVariants> {
  showIcon?: boolean;
  animated?: boolean;
}

function StatusChip({ 
  className, 
  variant = "default", 
  size = "default",
  showIcon = true, 
  animated = false,
  children,
  ...props 
}: StatusChipProps) {
  const Icon = iconMap[variant as keyof typeof iconMap];
  
  return (
    <span
      className={cn(statusChipVariants({ variant, size }), className)}
      {...props}
    >
      {showIcon && Icon && (
        <Icon 
          className={cn(
            "w-3 h-3",
            animated && variant === "running" && "animate-spin",
            animated && variant === "searching" && "animate-pulse"
          )} 
        />
      )}
      {children}
    </span>
  )
}

// Enhanced Status Chip with Progress
interface StatusChipWithProgressProps extends StatusChipProps {
  progress?: number;
}

function StatusChipWithProgress({ 
  progress, 
  children, 
  className,
  ...props 
}: StatusChipWithProgressProps) {
  return (
    <div className="relative">
      <StatusChip className={className} {...props}>
        {children}
        {typeof progress === "number" && (
          <span className="ml-1 text-xs opacity-75">
            {Math.round(progress)}%
          </span>
        )}
      </StatusChip>
      {typeof progress === "number" && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 rounded-full transition-all duration-300"
             style={{ width: `${progress}%` }} />
      )}
    </div>
  );
}

export { StatusChip, StatusChipWithProgress, statusChipVariants }

