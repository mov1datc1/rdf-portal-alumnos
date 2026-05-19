import { HeroBanner } from '../components/dashboard/HeroBanner';
import { CalendarWidget } from '../components/dashboard/CalendarWidget';
import { StatsWidget } from '../components/dashboard/StatsWidget';

export function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <HeroBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        <CalendarWidget />
        <StatsWidget />
      </div>
    </div>
  );
}
