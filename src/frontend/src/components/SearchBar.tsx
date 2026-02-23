import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface VibeFilters {
  isPetFriendly: boolean;
  isNearRiverfrontTrail: boolean;
  isGreatForDate: boolean;
  isLiveMusic: boolean;
  isDogFriendly: boolean;
  isGreatForGroups: boolean;
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cuisineFilter: string;
  onCuisineChange: (cuisine: string) => void;
  vibeFilters: VibeFilters;
  onVibeFilterChange: (filters: VibeFilters) => void;
}

const cuisineTypes = [
  { label: 'All', value: '' },
  { label: 'Pizza', value: 'pizza' },
  { label: 'Mexican', value: 'mexican' },
  { label: 'Cafe', value: 'cafe' },
  { label: 'Fine Dining', value: 'fineDining' },
  { label: 'Bar', value: 'bar' },
  { label: 'Pub', value: 'pub' },
  { label: 'Winery', value: 'winery' },
  { label: 'Hybrid', value: 'hybrid' },
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  cuisineFilter,
  onCuisineChange,
  vibeFilters,
  onVibeFilterChange,
}: SearchBarProps) {
  const toggleVibeFilter = (filterKey: keyof VibeFilters) => {
    onVibeFilterChange({
      ...vibeFilters,
      [filterKey]: !vibeFilters[filterKey],
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by restaurant name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Cuisine Filter Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Filter by Cuisine:</label>
        <div className="flex flex-wrap gap-2">
          {cuisineTypes.map((cuisine) => (
            <Button
              key={cuisine.value}
              variant={cuisineFilter === cuisine.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCuisineChange(cuisine.value)}
              className="transition-all"
            >
              {cuisine.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Vibe Filter Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Filter by Vibe:</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={vibeFilters.isPetFriendly ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleVibeFilter('isPetFriendly')}
            className="transition-all"
          >
            🐾 Pet-Friendly Patio
          </Button>
          <Button
            variant={vibeFilters.isNearRiverfrontTrail ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleVibeFilter('isNearRiverfrontTrail')}
            className="transition-all"
          >
            🚴 Near Riverfront Trail
          </Button>
          <Button
            variant={vibeFilters.isGreatForDate ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleVibeFilter('isGreatForDate')}
            className="transition-all"
          >
            💕 Great for a Date
          </Button>
          <Button
            variant={vibeFilters.isLiveMusic ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleVibeFilter('isLiveMusic')}
            className="transition-all"
          >
            🎵 Live Music
          </Button>
          <Button
            variant={vibeFilters.isDogFriendly ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleVibeFilter('isDogFriendly')}
            className="transition-all"
          >
            🐕 Dog-Friendly Patio
          </Button>
          <Button
            variant={vibeFilters.isGreatForGroups ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleVibeFilter('isGreatForGroups')}
            className="transition-all"
          >
            👥 Great for Groups
          </Button>
        </div>
      </div>
    </div>
  );
}
