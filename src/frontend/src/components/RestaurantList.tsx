import RestaurantCard from './RestaurantCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Restaurant } from '../backend';

interface RestaurantListProps {
  restaurants: Array<Restaurant & { distance?: number }>;
  isLoading: boolean;
  authError?: Error | null;
  showDistance?: boolean;
  seasonalMode?: boolean;
}

export default function RestaurantList({ 
  restaurants, 
  isLoading, 
  authError,
  showDistance = false,
  seasonalMode = false,
}: RestaurantListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
        <p className="text-muted-foreground">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard 
          key={restaurant.name} 
          restaurant={restaurant}
          distance={showDistance ? restaurant.distance : undefined}
          highlightSeasonal={seasonalMode}
        />
      ))}
    </div>
  );
}
