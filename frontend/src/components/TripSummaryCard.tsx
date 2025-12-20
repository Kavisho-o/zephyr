import { TripResult } from '@/types/trip';
import { RiskBadge } from './RiskBadge';
import { Route, Clock, MapPin, AlertCircle } from 'lucide-react';

interface TripSummaryCardProps {
  trip: TripResult;
}

export function TripSummaryCard({ trip }: TripSummaryCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="gradient-card rounded-2xl border border-border/50 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Trip Summary
      </h3>
      
      {/* Route */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-foreground">
          <MapPin size={16} className="text-primary" />
          <span className="font-medium">{trip.start}</span>
        </div>
        <div className="flex-1 h-px bg-border relative">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center">
            <Route size={14} className="text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <span className="font-medium">{trip.end}</span>
          <MapPin size={16} className="text-primary" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-foreground">
            {trip.total_distance_km.toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground ml-1">km</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Total Distance</div>
        </div>
        
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-foreground">
            {formatDuration(trip.estimated_duration_min)}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock size={10} />
            Est. Duration
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-foreground">
            {trip.timeline.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Segments</div>
        </div>
        
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Worst at</span>
          </div>
          <div className="mt-1">
            <RiskBadge level={trip.timeline[trip.worst_segment_index]?.risk_level || 'SAFE'} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
