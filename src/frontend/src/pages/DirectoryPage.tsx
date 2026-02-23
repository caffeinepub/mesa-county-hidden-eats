import { useState } from 'react';
import RestaurantList from '../components/RestaurantList';
import SearchBar, { type VibeFilters } from '../components/SearchBar';
import { useRestaurantSearch } from '../hooks/useRestaurantSearch';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, Sparkles, Shuffle, Compass } from 'lucide-react';
import { getUserLocation, filterByProximity } from '../utils/geolocation';
import type { Restaurant } from '../backend';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [vibeFilters, setVibeFilters] = useState<VibeFilters>({
    isPetFriendly: false,
    isNearRiverfrontTrail: false,
    isGreatForDate: false,
    isLiveMusic: false,
    isDogFriendly: false,
    isGreatForGroups: false,
  });
  const [seasonalMode, setSeasonalMode] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Array<Restaurant & { distance: number }> | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSurpriseMeLoading, setIsSurpriseMeLoading] = useState(false);
  
  const { isInitializing, loginError, login } = useInternetIdentity();
  const navigate = useNavigate();
  const { restaurants, isLoading, error } = useRestaurantSearch(
    searchQuery,
    cuisineFilter,
    vibeFilters,
    seasonalMode
  );

  const handleFindNearMe = async () => {
    setIsLoadingLocation(true);
    try {
      const userLocation = await getUserLocation();
      const nearby = filterByProximity(restaurants, userLocation, 20); // 20 mile radius for Mesa County
      
      if (nearby.length === 0) {
        toast.error('No restaurants found within 20 miles of your location.');
      } else {
        toast.success(`Found ${nearby.length} restaurant${nearby.length > 1 ? 's' : ''} near you!`);
      }
      
      setNearbyRestaurants(nearby);
    } catch (err: any) {
      toast.error(err.message || 'Failed to get your location');
      console.error('Geolocation error:', err);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleClearNearby = () => {
    setNearbyRestaurants(null);
  };

  const handleFeelingLucky = () => {
    const hiddenGems = restaurants.filter(r => r.isHiddenGem);
    
    if (hiddenGems.length === 0) {
      toast.error('No hidden gems available. Try adjusting your filters!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * hiddenGems.length);
    const luckyRestaurant = hiddenGems[randomIndex];
    
    toast.success(`Taking you to ${luckyRestaurant.name}! 🎲`);
    navigate({ to: '/restaurant/$name', params: { name: luckyRestaurant.name } });
  };

  const handleSurpriseMe = async () => {
    setIsSurpriseMeLoading(true);
    try {
      // Get user location
      const userLocation = await getUserLocation();
      
      // Filter for hidden gems only
      const hiddenGems = restaurants.filter(r => r.isHiddenGem);
      
      if (hiddenGems.length === 0) {
        toast.error('No hidden gems available. Try adjusting your filters!');
        setIsSurpriseMeLoading(false);
        return;
      }
      
      // Filter by proximity (10 miles)
      const nearbyHiddenGems = filterByProximity(hiddenGems, userLocation, 10);
      
      if (nearbyHiddenGems.length === 0) {
        toast.error('No hidden gems found within 10 miles of your location. Try "Find Gems Near Me" for a wider search!');
        setIsSurpriseMeLoading(false);
        return;
      }
      
      // Pick a random one
      const randomIndex = Math.floor(Math.random() * nearbyHiddenGems.length);
      const surpriseRestaurant = nearbyHiddenGems[randomIndex];
      
      toast.success(`Surprise! Taking you to ${surpriseRestaurant.name} - ${surpriseRestaurant.distance.toFixed(1)} miles away! 🎉`);
      navigate({ to: '/restaurant/$name', params: { name: surpriseRestaurant.name } });
    } catch (err: any) {
      toast.error(err.message || 'Failed to get your location for surprise selection');
      console.error('Surprise Me error:', err);
    } finally {
      setIsSurpriseMeLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (isInitializing) {
    return (
      <div className="w-full">
        {/* Hero Banner Skeleton */}
        <div className="relative w-full h-48 md:h-64 overflow-hidden border-b-2 border-primary/30">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Search Section Skeleton */}
        <div className="container px-4 py-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant List Skeleton */}
        <div className="container px-4 pb-8">
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
        </div>
      </div>
    );
  }

  // Show error state if auth failed
  if (loginError) {
    return (
      <div className="w-full">
        {/* Hero Banner */}
        <div className="relative w-full h-48 md:h-64 overflow-hidden border-b-2 border-primary/30">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Mesa County Hidden Eats"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-white drop-shadow-lg tracking-tight">
                Discover Mesa County's Hidden Gems
              </h2>
              <p className="text-sm md:text-base text-white/95 drop-shadow mt-2 font-medium">
                Explore authentic local eateries in Western Colorado
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="container px-4 py-12">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
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
                className="text-destructive"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Authentication Error</h3>
            <p className="text-muted-foreground">
              {loginError.message || 'Failed to initialize authentication. Please try again.'}
            </p>
            <Button onClick={login} variant="default">
              Retry Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayRestaurants = nearbyRestaurants || restaurants;

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden border-b-2 border-primary/30">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Mesa County Hidden Eats"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white drop-shadow-lg tracking-tight">
              Discover Mesa County's Hidden Gems
            </h2>
            <p className="text-sm md:text-base text-white/95 drop-shadow mt-2 font-medium">
              Explore authentic local eateries in Western Colorado
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container px-4 py-6">
        <div className="space-y-4">
          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSurpriseMe}
              disabled={isSurpriseMeLoading || isLoading}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-bold shadow-lg border-2 border-accent/30"
            >
              {isSurpriseMeLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <Compass className="h-5 w-5 mr-2" />
                  Surprise Me
                </>
              )}
            </Button>

            <Button
              onClick={handleFeelingLucky}
              disabled={isLoading}
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              I'm Feeling Lucky
            </Button>

            <Button
              onClick={handleFindNearMe}
              disabled={isLoadingLocation}
              variant="outline"
              size="lg"
              className="font-semibold border-2"
            >
              {isLoadingLocation ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 mr-2" />
                  Find Gems Near Me
                </>
              )}
            </Button>

            {nearbyRestaurants && (
              <Button
                onClick={handleClearNearby}
                variant="outline"
                size="lg"
                className="font-medium"
              >
                Show All Restaurants
              </Button>
            )}

            <Button
              onClick={() => setSeasonalMode(!seasonalMode)}
              variant={seasonalMode ? 'default' : 'outline'}
              size="lg"
              className={`font-semibold ${
                seasonalMode
                  ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md'
                  : 'border-2'
              }`}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Palisade Fruit Season
            </Button>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cuisineFilter={cuisineFilter}
            onCuisineChange={setCuisineFilter}
            vibeFilters={vibeFilters}
            onVibeFilterChange={setVibeFilters}
          />

          {/* Active Filters Display */}
          {(nearbyRestaurants || seasonalMode) && (
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-muted-foreground font-medium">Active:</span>
              {nearbyRestaurants && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  📍 Near Me ({nearbyRestaurants.length} found)
                </span>
              )}
              {seasonalMode && (
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full font-medium">
                  🍑 Palisade Fruit Season
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="container px-4 pb-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive font-medium">Error loading restaurants. Please try again.</p>
          </div>
        ) : (
          <RestaurantList
            restaurants={displayRestaurants}
            isLoading={isLoading}
            showDistance={!!nearbyRestaurants}
            seasonalMode={seasonalMode}
          />
        )}
      </div>
    </div>
  );
}
