import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Restaurant } from '../backend';

export function useGetAllRestaurants() {
  const { actor, isFetching } = useActor();

  return useQuery<Restaurant[]>({
    queryKey: ['restaurants', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      // Since backend doesn't have a getAll method, we'll return empty array
      // This will be populated when we search
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchRestaurantByName(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Restaurant | null>({
    queryKey: ['restaurants', 'name', name],
    queryFn: async () => {
      if (!actor || !name) return null;
      return actor.searchByName(name);
    },
    enabled: !!actor && !isFetching && !!name,
  });
}

export function useSearchRestaurantsByCuisine(cuisine: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Restaurant[]>({
    queryKey: ['restaurants', 'cuisine', cuisine],
    queryFn: async () => {
      if (!actor || !cuisine) return [];
      return actor.searchByCuisine(cuisine);
    },
    enabled: !!actor && !isFetching && !!cuisine,
  });
}
