import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Restaurant {
    isGreatForDate: boolean;
    contact: string;
    name: string;
    description: string;
    isPetFriendly: boolean;
    address: string;
    cuisine: string;
    isHiddenGem: boolean;
    isNearRiverfrontTrail: boolean;
    location: string;
    isPalisadeFruitSeason: boolean;
    coordinates: Coordinates;
    seasonalMonths: Array<bigint>;
}
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addVisitedRestaurant(restaurantName: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllRestaurants(): Promise<Array<Restaurant>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDateNightRestaurants(): Promise<Array<Restaurant>>;
    getNote(restaurantName: string): Promise<string | null>;
    getPetFriendlyRestaurants(): Promise<Array<Restaurant>>;
    getRating(restaurantName: string): Promise<bigint | null>;
    getRestaurantByName(name: string): Promise<Restaurant | null>;
    getRestaurantsByLocation(location: string): Promise<Array<Restaurant>>;
    getRestaurantsNearTrail(): Promise<Array<Restaurant>>;
    getSeasonalRestaurants(): Promise<Array<Restaurant>>;
    getSeasonalRestaurantsByMonth(month: bigint): Promise<Array<Restaurant>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isRestaurantVisited(restaurantName: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveNote(restaurantName: string, note: string): Promise<void>;
    saveRating(restaurantName: string, rating: bigint): Promise<void>;
    searchByCuisine(cuisine: string): Promise<Array<Restaurant>>;
}
