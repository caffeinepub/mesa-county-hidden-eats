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
    contact: string;
    name: string;
    description: string;
    cuisine: string;
    location: string;
}
export interface backendInterface {
    addRestaurant(name: string, cuisine: string, description: string, location: string, contact: string): Promise<void>;
    searchByCuisine(cuisine: string): Promise<Array<Restaurant>>;
    searchByName(name: string): Promise<Restaurant | null>;
}
