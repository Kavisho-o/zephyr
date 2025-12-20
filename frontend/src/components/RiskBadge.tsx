import { RiskLevel } from '@/types/trip';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, XOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const riskConfig = {
  SAFE: {
    label: 'Safe',
    icon: Shield,
    colorClass: 'risk-safe',
    bgClass: 'bg-risk-safe/10 border-risk-safe/30',
  },
  CAUTION: {
    label: 'Caution',
    icon: AlertTriangle,
    colorClass: 'risk-caution',
    bgClass: 'bg-risk-caution/10 border-risk-caution/30',
  },
  DANGEROUS: {
    label: 'Dangerous',
    icon: XOctagon,
    colorClass: 'risk-dangerous',
    bgClass: 'bg-risk-dangerous/10 border-risk-dangerous/30',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
};

const iconSizeConfig = {
  sm: 12,
  md: 14,
  lg: 18,
};

export function RiskBadge({ level, size = 'md', showIcon = true, className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-200',
        config.bgClass,
        config.colorClass,
        sizeConfig[size],
        className
      )}
    >
      {showIcon && <Icon size={iconSizeConfig[size]} />}
      {config.label}
    </span>
  );
}
