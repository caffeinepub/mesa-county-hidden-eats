import { useState } from 'react';
import RestaurantList from '../components/RestaurantList';
import SearchBar from '../components/SearchBar';
import { useRestaurantSearch } from '../hooks/useRestaurantSearch';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  
  const { restaurants, isLoading, error } = useRestaurantSearch(searchQuery, cuisineFilter);

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
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cuisineFilter={cuisineFilter}
          onCuisineChange={setCuisineFilter}
        />
      </div>

      {/* Restaurant List */}
      <div className="container px-4 pb-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive font-medium">Failed to load restaurants. Please try again.</p>
          </div>
        ) : (
          <RestaurantList restaurants={restaurants} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
