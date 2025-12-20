import { TripResult } from '@/types/trip';

export const mockTripResult: TripResult = {
  start: "New Delhi",
  end: "Jaipur",
  total_distance_km: 281.5,
  estimated_duration_min: 285,
  trip_risk: "CAUTION",
  trip_advisory: "Some parts of the trip require cautious driving.",
  worst_segment_index: 3,
  timeline: [
    {
      lat: 28.6139,
      lon: 77.2090,
      datetime: "2024-12-18T08:00:00",
      weather: {
        temperature: 12,
        windspeed: 8,
        precipitation: 0,
        humidity: 78,
        cloudcover: 45,
        visibility: 8000,
      },
      hazard_score: 12,
      risk_level: "SAFE",
      advisory: "Weather conditions are suitable for driving.",
    },
    {
      lat: 28.4595,
      lon: 77.0266,
      datetime: "2024-12-18T08:45:00",
      weather: {
        temperature: 11,
        windspeed: 12,
        precipitation: 0,
        humidity: 82,
        cloudcover: 60,
        visibility: 6000,
      },
      hazard_score: 18,
      risk_level: "SAFE",
      advisory: "Weather conditions are suitable for driving.",
    },
    {
      lat: 28.1853,
      lon: 76.6394,
      datetime: "2024-12-18T09:30:00",
      weather: {
        temperature: 10,
        windspeed: 15,
        precipitation: 0.2,
        humidity: 88,
        cloudcover: 75,
        visibility: 4000,
      },
      hazard_score: 24,
      risk_level: "CAUTION",
      advisory: "Reduced visibility or weather conditions require cautious driving.",
    },
    {
      lat: 27.8974,
      lon: 76.3044,
      datetime: "2024-12-18T10:15:00",
      weather: {
        temperature: 9,
        windspeed: 18,
        precipitation: 0.5,
        humidity: 92,
        cloudcover: 85,
        visibility: 2500,
      },
      hazard_score: 32,
      risk_level: "CAUTION",
      advisory: "Reduced visibility or weather conditions require cautious driving.",
    },
    {
      lat: 27.5530,
      lon: 76.0789,
      datetime: "2024-12-18T11:00:00",
      weather: {
        temperature: 11,
        windspeed: 14,
        precipitation: 0.1,
        humidity: 85,
        cloudcover: 70,
        visibility: 5000,
      },
      hazard_score: 22,
      risk_level: "CAUTION",
      advisory: "Reduced visibility or weather conditions require cautious driving.",
    },
    {
      lat: 26.9124,
      lon: 75.7873,
      datetime: "2024-12-18T12:00:00",
      weather: {
        temperature: 14,
        windspeed: 10,
        precipitation: 0,
        humidity: 72,
        cloudcover: 40,
        visibility: 10000,
      },
      hazard_score: 10,
      risk_level: "SAFE",
      advisory: "Weather conditions are suitable for driving.",
    },
  ],
};

// Mock data for dangerous conditions
export const mockDangerousTrip: TripResult = {
  ...mockTripResult,
  trip_risk: "DANGEROUS",
  trip_advisory: "Hazardous conditions detected along the route. Consider postponing the trip.",
  worst_segment_index: 2,
  timeline: mockTripResult.timeline.map((point, index) => 
    index === 2 ? {
      ...point,
      weather: {
        ...point.weather!,
        visibility: 200,
        precipitation: 5,
        windspeed: 35,
      },
      hazard_score: 65,
      risk_level: "DANGEROUS" as const,
      advisory: "Unsafe driving conditions detected. Consider delaying travel.",
    } : point
  ),
};

// Mock data for safe conditions
export const mockSafeTrip: TripResult = {
  ...mockTripResult,
  trip_risk: "SAFE",
  trip_advisory: "Trip conditions are generally safe for travel.",
  worst_segment_index: 0,
  timeline: mockTripResult.timeline.map(point => ({
    ...point,
    weather: {
      ...point.weather!,
      visibility: 10000,
      precipitation: 0,
      windspeed: 5,
      humidity: 60,
      cloudcover: 20,
    },
    hazard_score: 8,
    risk_level: "SAFE" as const,
    advisory: "Weather conditions are suitable for driving.",
  })),
};
