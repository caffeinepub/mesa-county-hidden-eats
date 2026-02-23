import { useMemo } from 'react';
import { useGetAllRestaurants } from './useQueries';
import type { Restaurant } from '../backend';
import { Cuisine } from '../backend';

export interface VibeFilters {
  isPetFriendly: boolean;
  isNearRiverfrontTrail: boolean;
  isGreatForDate: boolean;
  isLiveMusic: boolean;
  isDogFriendly: boolean;
  isGreatForGroups: boolean;
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

  const restaurants = useMemo(() => {
    let results: Restaurant[] = allRestaurants || [];

    // Apply cuisine filter
    if (trimmedCuisine) {
      results = results.filter((r) => r.cuisine === trimmedCuisine);
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
      if (vibeFilters.isLiveMusic) {
        results = results.filter((r) => r.vibeAttributes.liveMusic);
      }
      if (vibeFilters.isDogFriendly) {
        results = results.filter((r) => r.vibeAttributes.dogFriendly);
      }
      if (vibeFilters.isGreatForGroups) {
        // Using vibeAttributes.familyFriendly as a proxy for great for groups
        results = results.filter((r) => r.vibeAttributes.familyFriendly);
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
  }, [allRestaurants, trimmedQuery, trimmedCuisine, vibeFilters, seasonalMode]);

  return {
    restaurants,
    isLoading: isLoadingAll,
    error: allError,
  };
}
