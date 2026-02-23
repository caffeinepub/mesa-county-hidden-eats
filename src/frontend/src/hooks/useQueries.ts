import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Restaurant, UserProfile } from '../backend';

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

export function useSearchRestaurantsByCuisine(cuisine: string) {
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

// Visited Restaurant Hooks
export function useIsVisited(restaurantName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['visited', restaurantName],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isRestaurantVisited(restaurantName);
      } catch (error) {
        console.error('Error checking visited status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!restaurantName,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useMarkVisited() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurantName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVisitedRestaurant(restaurantName);
    },
    onSuccess: (_, restaurantName) => {
      queryClient.invalidateQueries({ queryKey: ['visited', restaurantName] });
    },
    onError: (error: any) => {
      console.error('Error marking restaurant as visited:', error);
      if (error.message?.includes('Unauthorized')) {
        throw new Error('Please log in to mark restaurants as visited');
      }
      throw error;
    },
  });
}

// Rating Hooks
export function useGetRating(restaurantName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ['rating', restaurantName],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getRating(restaurantName);
      } catch (error) {
        console.error('Error fetching rating:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!restaurantName,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSaveRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ restaurantName, rating }: { restaurantName: string; rating: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveRating(restaurantName, rating);
    },
    onSuccess: (_, { restaurantName }) => {
      queryClient.invalidateQueries({ queryKey: ['rating', restaurantName] });
    },
    onError: (error: any) => {
      console.error('Error saving rating:', error);
      if (error.message?.includes('Unauthorized')) {
        throw new Error('Please log in to rate restaurants');
      }
      throw error;
    },
  });
}

// Note Hooks
export function useGetNote(restaurantName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['note', restaurantName],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getNote(restaurantName);
      } catch (error) {
        console.error('Error fetching note:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!restaurantName,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useSaveNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ restaurantName, note }: { restaurantName: string; note: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveNote(restaurantName, note);
    },
    onSuccess: (_, { restaurantName }) => {
      queryClient.invalidateQueries({ queryKey: ['note', restaurantName] });
    },
    onError: (error: any) => {
      console.error('Error saving note:', error);
      if (error.message?.includes('Unauthorized')) {
        throw new Error('Please log in to save notes');
      }
      throw error;
    },
  });
}
