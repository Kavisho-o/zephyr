import { Weather } from '@/types/trip';
import { Thermometer, Wind, CloudRain, Droplets, Cloud, Eye } from 'lucide-react';

interface WeatherSnapshotProps {
  weather: Weather;
}

export function WeatherSnapshot({ weather }: WeatherSnapshotProps) {
  const metrics = [
    { icon: Thermometer, label: 'Temp', value: `${weather.temperature}°C` },
    { icon: Wind, label: 'Wind', value: `${weather.windspeed} km/h` },
    { icon: CloudRain, label: 'Precip', value: `${weather.precipitation} mm` },
    { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
    { icon: Cloud, label: 'Clouds', value: `${weather.cloudcover}%` },
    { icon: Eye, label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km` },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-4 border-t border-border/50">
      {metrics.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-muted/30 rounded-lg p-2 text-center">
          <Icon size={14} className="mx-auto text-muted-foreground mb-1" />
          <div className="text-xs font-medium text-foreground">{value}</div>
          <div className="text-[10px] text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}
