import { TripResult } from '@/types/trip';
import { TripRiskCard } from './TripRiskCard';
import { TripSummaryCard } from './TripSummaryCard';
import { TravelTimeline } from './TravelTimeline';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface ResultsSectionProps {
  result: TripResult;
  onReset: () => void;
}

export function ResultsSection({ result, onReset }: ResultsSectionProps) {
  return (
    <section className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onReset}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} />
          New Trip Assessment
        </Button>

        {/* Main risk card */}
        <TripRiskCard riskLevel={result.trip_risk} advisory={result.trip_advisory} />

        {/* Summary */}
        <div className="mt-6">
          <TripSummaryCard trip={result} />
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <TravelTimeline timeline={result.timeline} worstIndex={result.worst_segment_index} />
        </div>
      </div>
    </section>
  );
}
