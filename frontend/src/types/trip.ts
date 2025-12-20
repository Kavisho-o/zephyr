export type RiskLevel = 'SAFE' | 'CAUTION' | 'DANGEROUS';

export interface Weather {
  temperature: number;
  windspeed: number;
  precipitation: number;
  humidity: number;
  cloudcover: number;
  visibility: number;
}

export interface TimelinePoint {
  lat: number;
  lon: number;
  datetime: string;
  weather: Weather | null;
  hazard_score: number;
  risk_level: RiskLevel;
  advisory: string;
}

export interface TripResult {
  start: string;
  end: string;
  total_distance_km: number;
  estimated_duration_min: number;
  trip_risk: RiskLevel;
  trip_advisory: string;
  worst_segment_index: number;
  timeline: TimelinePoint[];
}

export interface TripFormData {
  start: string;
  end: string;
  departure_date: string;
  departure_time: string;
}
