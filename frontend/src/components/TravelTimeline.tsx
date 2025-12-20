import { useState } from 'react';
import { TimelinePoint } from '@/types/trip';
import { RiskBadge } from './RiskBadge';
import { WeatherSnapshot } from './WeatherSnapshot';
import { ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TravelTimelineProps {
  timeline: TimelinePoint[];
  worstIndex: number;
}

interface TimelineItemProps {
  point: TimelinePoint;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isWorst: boolean;
}

function TimelineItem({ point, index, isFirst, isLast, isWorst }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const riskLineColor = {
    SAFE: 'bg-risk-safe',
    CAUTION: 'bg-risk-caution',
    DANGEROUS: 'bg-risk-dangerous',
  };

  return (
    <div className={cn('relative pl-8 pb-6', isLast && 'pb-0')}>
      {/* Timeline line */}
      {!isLast && (
        <div className={cn('absolute left-[11px] top-6 bottom-0 w-0.5', riskLineColor[point.risk_level], 'opacity-40')} />
      )}
      
      {/* Timeline dot */}
      <div className={cn(
        'absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center',
        isWorst ? 'animate-pulse' : '',
        point.risk_level === 'SAFE' && 'border-risk-safe bg-risk-safe/20',
        point.risk_level === 'CAUTION' && 'border-risk-caution bg-risk-caution/20',
        point.risk_level === 'DANGEROUS' && 'border-risk-dangerous bg-risk-dangerous/20',
      )}>
        <div className={cn(
          'w-2 h-2 rounded-full',
          riskLineColor[point.risk_level]
        )} />
      </div>

      {/* Content */}
      <div 
        className={cn(
          'gradient-card rounded-xl border border-border/50 p-4 cursor-pointer transition-all duration-200 hover:border-border',
          isWorst && 'ring-1 ring-risk-dangerous/30'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge level={point.risk_level} size="sm" />
              {isWorst && (
                <span className="text-[10px] uppercase tracking-wider text-risk-dangerous font-medium">
                  Highest Risk
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {point.advisory}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              {formatTime(point.datetime)}
            </div>
            <div className="text-[10px] text-muted-foreground/60">
              {formatDate(point.datetime)}
            </div>
            <div className="text-xs text-muted-foreground/60 mt-1">
              Segment {index + 1}
            </div>
          </div>
          
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Expanded weather details */}
        {isExpanded && point.weather && (
          <WeatherSnapshot weather={point.weather} />
        )}
      </div>
    </div>
  );
}

export function TravelTimeline({ timeline, worstIndex }: TravelTimelineProps) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
        Route Timeline
      </h3>
      
      <div className="space-y-0">
        {timeline.map((point, index) => (
          <TimelineItem
            key={index}
            point={point}
            index={index}
            isFirst={index === 0}
            isLast={index === timeline.length - 1}
            isWorst={index === worstIndex}
          />
        ))}
      </div>
    </div>
  );
}
