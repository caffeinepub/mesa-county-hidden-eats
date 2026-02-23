import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchRestaurantByName, useGetRating, useSaveRating, useGetNote, useSaveNote } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState, useEffect } from 'react';
import { formatSeasonalMonths, isCurrentlyInSeason, getSeasonalBadgeStyle } from '../utils/seasonal';

export default function RestaurantDetailPage() {
  const { name } = useParams({ from: '/restaurant/$name' });
  const { identity } = useInternetIdentity();
  const { data: restaurant, isLoading, error } = useSearchRestaurantByName(name);
  const { data: currentRating } = useGetRating(name);
  const { data: currentNote } = useGetNote(name);
  const saveRatingMutation = useSaveRating();
  const saveNoteMutation = useSaveNote();

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [noteText, setNoteText] = useState<string>('');

  const isAuthenticated = !!identity;

  // Initialize rating and note from backend
  useEffect(() => {
    if (currentRating !== null && currentRating !== undefined) {
      setSelectedRating(Number(currentRating));
    }
  }, [currentRating]);

  useEffect(() => {
    if (currentNote !== null && currentNote !== undefined) {
      setNoteText(currentNote);
    }
  }, [currentNote]);

  const handleRatingClick = (rating: number) => {
    if (!isAuthenticated) return;
    
    setSelectedRating(rating);
    saveRatingMutation.mutate({ restaurantName: name, rating: BigInt(rating) });
  };

  const handleNoteSave = () => {
    if (!isAuthenticated) return;
    
    saveNoteMutation.mutate({ restaurantName: name, note: noteText });
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
        </Link>
        <div className="text-center py-12">
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
          <h3 className="text-lg font-semibold mb-2">Restaurant Not Found</h3>
          <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

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
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Link to="/">
        <Button variant="ghost" className="mb-6 hover:bg-muted">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>
      </Link>

      <div className="space-y-6">
        {/* Restaurant Image */}
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-border shadow-lg">
          <img
            src="/assets/generated/restaurant-placeholder.dim_400x300.png"
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {isSeasonal && seasonalText && (
            <div className="absolute top-4 left-4">
              <Badge className={`${getSeasonalBadgeStyle(inSeason)} text-base px-4 py-2`}>
                🍑 {seasonalText}
              </Badge>
            </div>
          )}
        </div>

        {/* Restaurant Info Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-serif mb-2">{restaurant.name}</CardTitle>
                <CardDescription className="text-base">{restaurant.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2 font-medium">
                {restaurant.cuisine}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location */}
            {restaurant.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-medium">{restaurant.location}</p>
                  {restaurant.address && (
                    <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact */}
            {restaurant.contact && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <p className="font-medium">{restaurant.contact}</p>
              </div>
            )}

            {/* Vibe Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {restaurant.isPetFriendly && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  🐾 Pet-Friendly Patio
                </Badge>
              )}
              {restaurant.isNearRiverfrontTrail && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  🚴 Near Riverfront Trail
                </Badge>
              )}
              {restaurant.isGreatForDate && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  💕 Great for a Date
                </Badge>
              )}
            </div>

            {/* Claim Business Link */}
            <div className="pt-4 border-t">
              <a
                href={claimMailto}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Claim My Business - Get Featured Placement
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Rating Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">Your Rating</CardTitle>
            <CardDescription>
              {isAuthenticated ? 'Rate your experience' : 'Log in to rate this restaurant'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={!isAuthenticated || saveRatingMutation.isPending}
                  className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= (hoverRating || selectedRating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {saveRatingMutation.isPending && (
              <p className="text-sm text-muted-foreground mt-2">Saving rating...</p>
            )}
          </CardContent>
        </Card>

        {/* Private Notes Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">Private Notes</CardTitle>
            <CardDescription>
              {isAuthenticated ? 'Your personal notes (only you can see these)' : 'Log in to add private notes'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={handleNoteSave}
              disabled={!isAuthenticated}
              placeholder={isAuthenticated ? "Add your thoughts, favorite dishes, or reminders..." : "Log in to add notes"}
              className="min-h-[120px] resize-none"
            />
            {saveNoteMutation.isPending && (
              <p className="text-sm text-muted-foreground">Saving note...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
