import { TripForm } from './TripForm';
import { TripFormData } from '@/types/trip';
import { Wind } from 'lucide-react';

interface HeroSectionProps {
  onSubmit: (data: TripFormData) => void;
  isLoading?: boolean;
}

export function HeroSection({ onSubmit, isLoading }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-glow opacity-60" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Logo / Brand */}
        <div className="inline-flex items-center gap-3 mb-8 animate-fade-in">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Wind size={28} className="text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gradient">ZEPHYR</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Weather-Based
          <br />
          <span className="text-gradient">Travel Risk Advisory</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Know before you go. Get real-time weather risk analysis for your driving route
          and make informed travel decisions.
        </p>

        {/* Form */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <TripForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
