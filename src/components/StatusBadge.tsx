import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'critical' | 'expired' | 'pending';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  critical: {
    label: 'Critical',
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  },
  expired: {
    label: 'Expired',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  },
  pending: {
    label: 'Pending',
    className: 'bg-muted text-muted-foreground border-muted-foreground/20 hover:bg-muted/80',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
