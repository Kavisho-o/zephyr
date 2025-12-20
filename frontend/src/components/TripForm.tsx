import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TripFormData } from '@/types/trip';
import { MapPin, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading?: boolean;
}

export function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    start: '',
    end: '',
    departure_date: '',
    departure_time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.start && formData.end && formData.departure_date && formData.departure_time;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-xl">
        <div className="space-y-5">
          {/* Location inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin size={14} />
                Start Location
              </label>
              <Input
                placeholder="e.g., New Delhi"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin size={14} />
                End Location
              </label>
              <Input
                placeholder="e.g., Jaipur"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
              />
            </div>
          </div>

          {/* Date and time inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar size={14} />
                Departure Date
              </label>
              <Input
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock size={14} />
                Departure Time
              </label>
              <Input
                type="time"
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
              />
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full mt-4"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing Route...
              </>
            ) : (
              <>
                Assess Trip Risk
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
