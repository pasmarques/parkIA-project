import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'bg-card',
  success: 'bg-gradient-to-br from-spot-free/10 to-spot-free/5 border-spot-free/20',
  warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
  danger: 'bg-gradient-to-br from-spot-occupied/10 to-spot-occupied/5 border-spot-occupied/20',
};

const iconStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-spot-free/20 text-spot-free',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-spot-occupied/20 text-spot-occupied',
};

export function StatCard({ title, value, subtitle, icon, variant = 'default' }: StatCardProps) {
  return (
    <div className={cn('stat-card animate-fade-in', variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('rounded-xl p-3', iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

