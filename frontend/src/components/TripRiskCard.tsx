import { RiskLevel } from '@/types/trip';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, XOctagon } from 'lucide-react';

interface TripRiskCardProps {
  riskLevel: RiskLevel;
  advisory: string;
}

const riskConfig = {
  SAFE: {
    icon: Shield,
    title: 'Safe to Travel',
    colorClass: 'risk-safe',
    glowClass: 'glow-safe',
    borderClass: 'border-risk-safe/30',
    bgGradient: 'from-risk-safe/10 to-transparent',
  },
  CAUTION: {
    icon: AlertTriangle,
    title: 'Travel with Caution',
    colorClass: 'risk-caution',
    glowClass: 'glow-caution',
    borderClass: 'border-risk-caution/30',
    bgGradient: 'from-risk-caution/10 to-transparent',
  },
  DANGEROUS: {
    icon: XOctagon,
    title: 'Dangerous Conditions',
    colorClass: 'risk-dangerous',
    glowClass: 'glow-dangerous',
    borderClass: 'border-risk-dangerous/30',
    bgGradient: 'from-risk-dangerous/10 to-transparent',
  },
};

export function TripRiskCard({ riskLevel, advisory }: TripRiskCardProps) {
  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-8 md:p-10 text-center animate-slide-up',
        config.borderClass,
        config.glowClass
      )}
    >
      {/* Background gradient */}
      <div className={cn('absolute inset-0 bg-gradient-to-b opacity-50', config.bgGradient)} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={cn('inline-flex p-4 rounded-full mb-6 animate-pulse-slow', `bg-current/10`, config.colorClass)}>
          <Icon size={48} strokeWidth={1.5} />
        </div>
        
        <h2 className={cn('text-3xl md:text-4xl font-bold mb-3', config.colorClass)}>
          {config.title}
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {advisory}
        </p>
      </div>
    </div>
  );
}
