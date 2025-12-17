import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'success';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/10 border-primary/20',
  accent: 'bg-accent/10 border-accent/20',
  warning: 'bg-warning/10 border-warning/20',
  success: 'bg-success/10 border-success/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent',
  warning: 'bg-warning/20 text-warning',
  success: 'bg-success/20 text-success',
};

export function MetricCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  trend, 
  progress, 
  variant = 'default',
  className 
}: MetricCardProps) {
  return (
    <Card className={cn(
      "shadow-card hover:shadow-card-hover transition-all duration-300 border",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconStyles[variant]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">{progress}% of goal</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
