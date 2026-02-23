import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone } from 'lucide-react';
import type { Restaurant } from '../backend';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all duration-300 bg-card border-2 border-border">
      {/* Restaurant Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted/50">
        <img
          src="/assets/generated/restaurant-placeholder.dim_400x300.png"
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Card Content */}
      <CardHeader className="pb-3 bg-card/50">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-serif leading-tight tracking-tight">{restaurant.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0 font-medium border border-secondary/30">
            {restaurant.cuisine}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-2 text-muted-foreground">{restaurant.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 text-sm bg-muted/20">
        {restaurant.location && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
            <span className="line-clamp-1">{restaurant.location}</span>
          </div>
        )}
        {restaurant.contact && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-primary/70" />
            <span>{restaurant.contact}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
