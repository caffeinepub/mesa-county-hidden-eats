import { useMemo } from 'react';
import { useSearchRestaurantByName, useSearchRestaurantsByCuisine } from './useQueries';
import type { Restaurant } from '../backend';

export function useRestaurantSearch(searchQuery: string, cuisineFilter: string) {
  const trimmedQuery = searchQuery.trim();
  const trimmedCuisine = cuisineFilter.trim();

  // Search by name if query is provided
  const { data: nameResult, isLoading: isLoadingName, error: nameError } = useSearchRestaurantByName(trimmedQuery);

  // Search by cuisine if filter is provided
  const { data: cuisineResults, isLoading: isLoadingCuisine, error: cuisineError } = useSearchRestaurantsByCuisine(trimmedCuisine);

  const restaurants = useMemo(() => {
    const results: Restaurant[] = [];

    // If we have a name search result, add it
    if (nameResult) {
      results.push(nameResult);
    }

    // If we have cuisine results, add them
    if (cuisineResults && cuisineResults.length > 0) {
      // Avoid duplicates if name search also returned a result
      cuisineResults.forEach((restaurant) => {
        if (!results.some((r) => r.name === restaurant.name)) {
          results.push(restaurant);
        }
      });
    }

    // If both filters are applied, filter cuisine results by name
    if (trimmedQuery && trimmedCuisine && cuisineResults) {
      return cuisineResults.filter((r) =>
        r.name.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
    }

    return results;
  }, [nameResult, cuisineResults, trimmedQuery, trimmedCuisine]);

  return {
    restaurants,
    isLoading: isLoadingName || isLoadingCuisine,
    error: nameError || cuisineError,
  };
}
