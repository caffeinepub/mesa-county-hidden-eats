import { useMemo } from 'react';
import { useGetAllRestaurants, useSearchRestaurantsByCuisine } from './useQueries';
import type { Restaurant } from '../backend';

export interface VibeFilters {
  isPetFriendly: boolean;
  isNearRiverfrontTrail: boolean;
  isGreatForDate: boolean;
}

export function useRestaurantSearch(
  searchQuery: string,
  cuisineFilter: string,
  vibeFilters?: VibeFilters,
  seasonalMode?: boolean
) {
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const trimmedCuisine = cuisineFilter.trim();

  // Get all restaurants
  const { data: allRestaurants, isLoading: isLoadingAll, error: allError } = useGetAllRestaurants();

  // Search by cuisine if filter is provided
  const { data: cuisineResults, isLoading: isLoadingCuisine, error: cuisineError } = useSearchRestaurantsByCuisine(trimmedCuisine);

  const restaurants = useMemo(() => {
    let results: Restaurant[] = [];

    // Start with cuisine filter or all restaurants
    if (trimmedCuisine && cuisineResults) {
      results = cuisineResults;
    } else {
      results = allRestaurants || [];
    }

    // Apply name search filter
    if (trimmedQuery) {
      results = results.filter((r) =>
        r.name.toLowerCase().includes(trimmedQuery)
      );
    }

    // Apply vibe filters
    if (vibeFilters) {
      if (vibeFilters.isPetFriendly) {
        results = results.filter((r) => r.isPetFriendly);
      }
      if (vibeFilters.isNearRiverfrontTrail) {
        results = results.filter((r) => r.isNearRiverfrontTrail);
      }
      if (vibeFilters.isGreatForDate) {
        results = results.filter((r) => r.isGreatForDate);
      }
    }

    // Apply seasonal mode
    if (seasonalMode) {
      // Prioritize seasonal restaurants by sorting them to the top
      results = [...results].sort((a, b) => {
        if (a.isPalisadeFruitSeason && !b.isPalisadeFruitSeason) return -1;
        if (!a.isPalisadeFruitSeason && b.isPalisadeFruitSeason) return 1;
        return 0;
      });
    }

    return results;
  }, [allRestaurants, cuisineResults, trimmedQuery, trimmedCuisine, vibeFilters, seasonalMode]);

  return {
    restaurants,
    isLoading: isLoadingAll || isLoadingCuisine,
    error: allError || cuisineError,
  };
}
