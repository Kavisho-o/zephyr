import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ResultsSection } from '@/components/ResultsSection';
import { TripFormData, TripResult } from '@/types/trip';

const Index = () => {
  const [tripResult, setTripResult] = useState<TripResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TripFormData) => {
  setIsLoading(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/predict-trip`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch trip prediction');
    }

    const result: TripResult = await response.json();
    setTripResult(result);
  } catch (error) {
    console.error(error);
    alert('Something went wrong while analyzing the trip.');
  } finally {
    setIsLoading(false);
  }
};


  const handleReset = () => {
    setTripResult(null);
  };

  return (
    <main className="min-h-screen bg-background">
      {tripResult ? (
        <ResultsSection result={tripResult} onReset={handleReset} />
      ) : (
        <HeroSection onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </main>
  );
};

export default Index;
