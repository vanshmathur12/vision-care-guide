import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const medicalCardVariants = cva(
  "transition-all duration-300 hover:shadow-medical",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        primary: "bg-gradient-primary text-primary-foreground border-primary/20",
        healing: "bg-gradient-healing text-secondary-foreground border-secondary/20", 
        wellness: "bg-gradient-wellness text-accent-foreground border-accent/20",
        glass: "glass-medical border-border/50",
        elevated: "shadow-floating bg-card/95 backdrop-blur-sm",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface MedicalCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof medicalCardVariants> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  value?: string | number;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

const MedicalCard = React.forwardRef<HTMLDivElement, MedicalCardProps>(
  ({ className, variant, size, icon, title, description, value, trend, trendValue, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(medicalCardVariants({ variant, size, className }))}
        {...props}
      >
        {(icon || title || value) && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              {icon && <div className="text-2xl">{icon}</div>}
              {title && <CardTitle className="text-sm font-medium">{title}</CardTitle>}
            </div>
            {trend && trendValue && (
              <div className={cn(
                "flex items-center text-xs font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive", 
                trend === "stable" && "text-muted-foreground"
              )}>
                {trend === "up" && "↗"}
                {trend === "down" && "↘"}
                {trend === "stable" && "→"}
                {trendValue}
              </div>
            )}
          </CardHeader>
        )}
        <CardContent>
          {value && (
            <div className="text-2xl font-bold mb-1">{value}</div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {children}
        </CardContent>
      </Card>
    );
  }
);

MedicalCard.displayName = "MedicalCard";

export { MedicalCard, medicalCardVariants };