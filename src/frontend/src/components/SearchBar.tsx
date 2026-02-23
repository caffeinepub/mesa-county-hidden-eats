import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cuisineFilter: string;
  onCuisineChange: (cuisine: string) => void;
}

const cuisineTypes = [
  'All Cuisines',
  'American',
  'Mexican',
  'Italian',
  'Asian',
  'BBQ',
  'Cafe',
  'Bakery',
  'Seafood',
  'Steakhouse',
  'Pizza',
  'Burgers',
  'Sandwiches',
  'Breakfast',
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  cuisineFilter,
  onCuisineChange,
}: SearchBarProps) {
  return (
    <div className="w-full space-y-3">
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

      {/* Cuisine Filter */}
      <Select value={cuisineFilter} onValueChange={onCuisineChange}>
        <SelectTrigger className="h-12 text-base">
          <SelectValue placeholder="Filter by cuisine type" />
        </SelectTrigger>
        <SelectContent>
          {cuisineTypes.map((cuisine) => (
            <SelectItem key={cuisine} value={cuisine === 'All Cuisines' ? '' : cuisine}>
              {cuisine}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
