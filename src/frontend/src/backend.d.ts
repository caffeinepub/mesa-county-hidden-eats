import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VibeAttributes {
    dogFriendly: boolean;
    familyFriendly: boolean;
    dateNightFriendly: boolean;
    artCraftsFocused: boolean;
    perfectLighting: boolean;
    brightOpenSpaces: boolean;
    liveMusic: boolean;
    themedDrinks: boolean;
    fruitInfusedRecipes: boolean;
    mountainViews: boolean;
    workFriendly: boolean;
    fruitCiderOptions: boolean;
}
export interface Restaurant {
    isGreatForDate: boolean;
    contact: string;
    name: string;
    description: string;
    isPetFriendly: boolean;
    imageURL: string;
    address: string;
    cuisine: Cuisine;
    isHiddenGem: boolean;
    isNearRiverfrontTrail: boolean;
    location: string;
    isPalisadeFruitSeason: boolean;
    vibeAttributes: VibeAttributes;
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
export enum Cuisine {
    bar = "bar",
    pub = "pub",
    fineDining = "fineDining",
    seafood = "seafood",
    steakhouse = "steakhouse",
    cafe = "cafe",
    deli = "deli",
    winery = "winery",
    sandwiches = "sandwiches",
    mexican = "mexican",
    hybrid = "hybrid",
    italian = "italian",
    hotelRestaurant = "hotelRestaurant",
    market = "market",
    pizza = "pizza",
    burger = "burger",
    barbecue = "barbecue",
    asianFusion = "asianFusion",
    coffeeShop = "coffeeShop",
    brewery = "brewery"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllRestaurants(): Promise<Array<Restaurant>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDateNightRestaurants(): Promise<Array<Restaurant>>;
    getPetFriendlyRestaurants(): Promise<Array<Restaurant>>;
    getRestaurantByName(name: string): Promise<Restaurant | null>;
    getRestaurantsByLocation(location: string): Promise<Array<Restaurant>>;
    getRestaurantsNearTrail(): Promise<Array<Restaurant>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchByCuisine(cuisine: Cuisine): Promise<Array<Restaurant>>;
}
