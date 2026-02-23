import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllRestaurants, useIsVisited } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, MapPin, Award, LogIn } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function ProfilePage() {
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
  const explorationPercentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

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
                Please log in to view your exploration progress and track your Mesa County dining adventures.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
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
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
              My Progress
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your culinary journey through Mesa County's hidden gems
            </p>
          </div>

          {/* Main Progress Card */}
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Exploration Progress
              </CardTitle>
              <CardDescription>
                Keep exploring to discover all the hidden gems in Mesa County!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Completion
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {explorationPercentage}%
                  </span>
                </div>
                <Progress value={explorationPercentage} className="h-3" />
              </div>

              {/* Main Message */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                <p className="text-xl md:text-2xl font-serif font-bold text-foreground">
                  You've explored {explorationPercentage}% of Mesa County!
                </p>
                <p className="text-muted-foreground mt-2">
                  {explorationPercentage === 100
                    ? '🎉 Congratulations! You\'ve visited all the hidden gems!'
                    : explorationPercentage >= 75
                    ? 'Almost there! Just a few more spots to go.'
                    : explorationPercentage >= 50
                    ? 'Great progress! Keep discovering new places.'
                    : explorationPercentage >= 25
                    ? 'You\'re off to a good start! Many gems await.'
                    : 'Your culinary adventure is just beginning!'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visited Count */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Places Visited
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-foreground">{visitedCount}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  restaurants explored
                </p>
              </CardContent>
            </Card>

            {/* Total Count */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-foreground">{totalCount}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  hidden gems to discover
                </p>
              </CardContent>
            </Card>

            {/* Remaining Count */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-foreground">{totalCount - visitedCount}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  places left to explore
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-accent/10 border-accent/30">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-lg font-medium text-foreground">
                Ready to discover more hidden gems?
              </p>
              <Link to="/">
                <Button size="lg" className="font-semibold">
                  Explore Restaurants
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
