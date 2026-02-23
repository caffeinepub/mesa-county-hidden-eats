import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Gem, Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { Restaurant } from '../backend';
import { useIsVisited, useMarkVisited } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { formatSeasonalMonths, isCurrentlyInSeason, getSeasonalBadgeStyle } from '../utils/seasonal';

interface RestaurantCardProps {
  restaurant: Restaurant;
  distance?: number;
  highlightSeasonal?: boolean;
}

export default function RestaurantCard({ restaurant, distance, highlightSeasonal = false }: RestaurantCardProps) {
  const { identity } = useInternetIdentity();
  const { data: isVisited = false } = useIsVisited(restaurant.name);
  const markVisitedMutation = useMarkVisited();

  const handleVisitedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!identity) {
      return;
    }

    markVisitedMutation.mutate(restaurant.name);
  };

  const isAuthenticated = !!identity;
  const isSeasonal = restaurant.isPalisadeFruitSeason || restaurant.seasonalMonths.length > 0;
  const inSeason = isCurrentlyInSeason(restaurant.seasonalMonths);
  const seasonalText = formatSeasonalMonths(restaurant.seasonalMonths);

  // Email for claim business link
  const claimEmailSubject = encodeURIComponent(`Business Claim Request - ${restaurant.name}`);
  const claimEmailBody = encodeURIComponent(
    `I would like to claim my business listing for ${restaurant.name}.\n\nRestaurant: ${restaurant.name}\nLocation: ${restaurant.location}\nAddress: ${restaurant.address}\n\nPlease contact me regarding featured placement options.`
  );
  const claimMailto = `mailto:hello@caffeine.ai?subject=${claimEmailSubject}&body=${claimEmailBody}`;

  return (
    <Link
      to="/restaurant/$name"
      params={{ name: restaurant.name }}
      className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
    >
      <Card className={`overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all duration-300 bg-card border-2 h-full flex flex-col ${
        highlightSeasonal && restaurant.isPalisadeFruitSeason ? 'border-accent shadow-md' : 'border-border'
      }`}>
        {/* Restaurant Image */}
        <div className="relative h-48 w-full overflow-hidden bg-muted/50">
          <img
            src="/assets/generated/restaurant-placeholder.dim_400x300.png"
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          {/* Hidden Gem Badge Overlay */}
          {restaurant.isHiddenGem && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary/90 text-primary-foreground border-2 border-primary-foreground/20 shadow-lg font-semibold flex items-center gap-1.5 px-3 py-1">
                <Gem className="h-3.5 w-3.5" />
                Hidden Gem
              </Badge>
            </div>
          )}
          {/* Distance Badge */}
          {distance !== undefined && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-background/90 text-foreground border border-border shadow-md font-semibold">
                {distance.toFixed(1)} mi
              </Badge>
            </div>
          )}
          {/* Seasonal Badge */}
          {isSeasonal && seasonalText && (
            <div className="absolute bottom-3 left-3">
              <Badge className={getSeasonalBadgeStyle(inSeason)}>
                🍑 {seasonalText}
              </Badge>
            </div>
          )}
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

        <CardContent className="space-y-3 text-sm bg-muted/20 flex-1 flex flex-col">
          <div className="flex-1 space-y-2">
            {restaurant.location && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
                <div className="flex flex-col gap-0.5">
                  <span className="line-clamp-1 font-medium">{restaurant.location}</span>
                  {restaurant.address && (
                    <span className="text-xs text-muted-foreground/80">{restaurant.address}</span>
                  )}
                </div>
              </div>
            )}
            {restaurant.contact && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                <span>{restaurant.contact}</span>
              </div>
            )}

            {/* Vibe Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {restaurant.isPetFriendly && (
                <Badge variant="outline" className="text-xs">
                  🐾 Pet-Friendly
                </Badge>
              )}
              {restaurant.isNearRiverfrontTrail && (
                <Badge variant="outline" className="text-xs">
                  🚴 Near Trail
                </Badge>
              )}
              {restaurant.isGreatForDate && (
                <Badge variant="outline" className="text-xs">
                  💕 Date Spot
                </Badge>
              )}
            </div>
          </div>

          {/* Visited Button */}
          <Button
            onClick={handleVisitedClick}
            disabled={!isAuthenticated || markVisitedMutation.isPending}
            variant={isVisited ? "default" : "outline"}
            size="sm"
            className={`w-full mt-2 ${
              isVisited 
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                : 'border-primary/30 hover:bg-primary/10'
            }`}
          >
            {markVisitedMutation.isPending ? (
              'Saving...'
            ) : isVisited ? (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                Visited
              </>
            ) : (
              'Mark as Visited'
            )}
          </Button>

          {/* Claim Business Link */}
          <a
            href={claimMailto}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center underline"
          >
            Claim My Business
          </a>
        </CardContent>
      </Card>
    </Link>
  );
}
