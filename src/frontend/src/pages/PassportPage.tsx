import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllRestaurants, useIsVisited } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, LogIn, Stamp } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function PassportPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: restaurants, isLoading: restaurantsLoading } = useGetAllRestaurants();

  const isAuthenticated = !!identity;

  // Calculate visited count
  const visitedCount = restaurants?.reduce((count, restaurant) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: isVisited } = useIsVisited(restaurant.name);
    return count + (isVisited ? 1 : 0);
  }, 0) || 0;

  const totalCount = restaurants?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="container px-4 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 mx-auto">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Login Required</CardTitle>
              <CardDescription>
                Please log in to view your Mesa County Passport and track your dining journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                disabled={loginStatus === 'logging-in'}
                size="lg"
                className="w-full"
              >
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading state
  if (restaurantsLoading) {
    return (
      <div className="w-full">
        <div className="container px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight flex items-center gap-3">
              <Stamp className="h-10 w-10 text-primary" />
              Mesa County Passport
            </h1>
            <p className="text-muted-foreground text-lg">
              Your official dining passport for Mesa County's hidden gems
            </p>
          </div>

          {/* Main Passport Card */}
          <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardHeader className="pb-4 border-b border-primary/20">
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Award className="h-7 w-7 text-primary" />
                Passport Progress
              </CardTitle>
              <CardDescription className="text-base">
                Collect stamps by visiting Mesa County's finest local eateries
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Progress Statistics */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-5xl md:text-6xl font-bold text-primary font-serif">
                    {completionPercentage}%
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    Complete
                  </p>
                </div>
                <div className="pt-2 border-t border-primary/20">
                  <p className="text-xl md:text-2xl font-serif font-bold text-foreground">
                    You've visited {visitedCount} of {totalCount} restaurants
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {completionPercentage === 100
                      ? '🎉 Passport Complete! You\'re a true Mesa County foodie!'
                      : completionPercentage >= 75
                      ? '🌟 Almost there! Just a few more stamps to collect.'
                      : completionPercentage >= 50
                      ? '🍽️ Halfway through your passport journey!'
                      : completionPercentage >= 25
                      ? '🚀 Great start! Keep exploring Mesa County.'
                      : '📍 Your passport adventure begins now!'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Passport Completion
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {visitedCount}/{totalCount}
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-4 shadow-inner" />
              </div>

              {/* Motivational Message */}
              {completionPercentage < 100 && (
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-foreground">
                    {totalCount - visitedCount} {totalCount - visitedCount === 1 ? 'stamp' : 'stamps'} remaining to complete your passport!
                  </p>
                </div>
              )}

              {/* Achievement Badge */}
              {completionPercentage === 100 && (
                <div className="bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent rounded-lg p-6 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent mb-4">
                    <Award className="h-12 w-12 text-accent-foreground" />
                  </div>
                  <p className="text-xl font-bold text-foreground mb-2">
                    Passport Master!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You've explored every hidden gem in Mesa County. Congratulations!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-lg font-medium text-foreground">
                {completionPercentage === 100
                  ? 'Want to revisit your favorite spots?'
                  : 'Ready to collect more stamps?'}
              </p>
              <Link to="/">
                <Button size="lg" className="font-semibold">
                  {completionPercentage === 100 ? 'Browse Restaurants' : 'Discover More Gems'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
