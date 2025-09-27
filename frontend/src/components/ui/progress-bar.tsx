import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-2",
        default: "h-3",
        lg: "h-4",
        xl: "h-6",
      },
      variant: {
        default: "",
        success: "",
        warning: "",
        destructive: "",
        info: "",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/80",
        success: "bg-gradient-to-r from-success to-success/80",
        warning: "bg-gradient-to-r from-warning to-warning/80",
        destructive: "bg-gradient-to-r from-destructive to-destructive/80",
        info: "bg-gradient-to-r from-info to-info/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showValue?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, variant, showValue = false, animated = false, ...props }, ref) => (
  <div className="relative w-full">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ size, variant }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          progressIndicatorVariants({ variant }),
          animated && "animate-pulse"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showValue && (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-foreground/80">
          {Math.round(value || 0)}%
        </span>
      </div>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Enhanced Progress with Steps
interface ProgressStepsProps {
  steps: Array<{
    label: string;
    completed: boolean;
    current?: boolean;
  }>;
  className?: string;
}

const ProgressSteps = React.forwardRef<HTMLDivElement, ProgressStepsProps>(
  ({ steps, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step.completed
                    ? "bg-success text-success-foreground"
                    : step.current
                    ? "bg-primary text-primary-foreground animate-pulse-glow"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.completed ? "✓" : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 text-center",
                  step.completed || step.current
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          {steps.map((_, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 rounded",
                    steps[index].completed
                      ? "bg-success"
                      : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);

ProgressSteps.displayName = "ProgressSteps";

export { Progress, ProgressSteps }

