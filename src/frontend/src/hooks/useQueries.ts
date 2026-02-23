import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Restaurant, UserProfile } from '../backend';
import { Cuisine } from '../backend';

export function useGetAllRestaurants() {
  const { actor, isFetching } = useActor();

  return useQuery<Restaurant[]>({
    queryKey: ['restaurants', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRestaurants();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchRestaurantByName(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Restaurant | null>({
    queryKey: ['restaurants', 'name', name],
    queryFn: async () => {
      if (!actor || !name) return null;
      return actor.getRestaurantByName(name);
    },
    enabled: !!actor && !isFetching && !!name,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchRestaurantsByCuisine(cuisine: Cuisine) {
  const { actor, isFetching } = useActor();

  return useQuery<Restaurant[]>({
    queryKey: ['restaurants', 'cuisine', cuisine],
    queryFn: async () => {
      if (!actor || !cuisine) return [];
      return actor.searchByCuisine(cuisine);
    },
    enabled: !!actor && !isFetching && !!cuisine,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// User Profile Hooks
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Client-side visited tracking (localStorage)
export function useIsVisited(restaurantName: string) {
  return useQuery<boolean>({
    queryKey: ['visited', restaurantName],
    queryFn: () => {
      try {
        const visited = localStorage.getItem(`visited_${restaurantName}`);
        return visited === 'true';
      } catch (error) {
        console.error('Error checking visited status:', error);
        return false;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useMarkVisited() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurantName: string) => {
      localStorage.setItem(`visited_${restaurantName}`, 'true');
      return restaurantName;
    },
    onSuccess: (restaurantName) => {
      queryClient.invalidateQueries({ queryKey: ['visited', restaurantName] });
    },
    onError: (error: any) => {
      console.error('Error marking restaurant as visited:', error);
      throw error;
    },
  });
}

// Client-side rating tracking (localStorage)
export function useGetRating(restaurantName: string) {
  return useQuery<bigint | null>({
    queryKey: ['rating', restaurantName],
    queryFn: () => {
      try {
        const rating = localStorage.getItem(`rating_${restaurantName}`);
        return rating ? BigInt(rating) : null;
      } catch (error) {
        console.error('Error fetching rating:', error);
        return null;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSaveRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ restaurantName, rating }: { restaurantName: string; rating: bigint }) => {
      localStorage.setItem(`rating_${restaurantName}`, rating.toString());
      return { restaurantName, rating };
    },
    onSuccess: (_, { restaurantName }) => {
      queryClient.invalidateQueries({ queryKey: ['rating', restaurantName] });
    },
    onError: (error: any) => {
      console.error('Error saving rating:', error);
      throw error;
    },
  });
}

// Client-side note tracking (localStorage)
export function useGetNote(restaurantName: string) {
  return useQuery<string | null>({
    queryKey: ['note', restaurantName],
    queryFn: () => {
      try {
        return localStorage.getItem(`note_${restaurantName}`);
      } catch (error) {
        console.error('Error fetching note:', error);
        return null;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSaveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ restaurantName, note }: { restaurantName: string; note: string }) => {
      if (note.trim()) {
        localStorage.setItem(`note_${restaurantName}`, note);
      } else {
        localStorage.removeItem(`note_${restaurantName}`);
      }
      return { restaurantName, note };
    },
    onSuccess: (_, { restaurantName }) => {
      queryClient.invalidateQueries({ queryKey: ['note', restaurantName] });
    },
    onError: (error: any) => {
      console.error('Error saving note:', error);
      throw error;
    },
  });
}
