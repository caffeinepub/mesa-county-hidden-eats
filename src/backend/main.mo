import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";

actor {
  type Restaurant = {
    name : Text;
    cuisine : Text;
    description : Text;
    location : Text;
    contact : Text;
  };

  let restaurants = Map.empty<Text, Restaurant>();

  public shared ({ caller }) func addRestaurant(name : Text, cuisine : Text, description : Text, location : Text, contact : Text) : async () {
    let restaurant : Restaurant = {
      name;
      cuisine;
      description;
      location;
      contact;
    };
    restaurants.add(name, restaurant);
  };

  public query ({ caller }) func searchByName(name : Text) : async ?Restaurant {
    restaurants.get(name);
  };

  public query ({ caller }) func searchByCuisine(cuisine : Text) : async [Restaurant] {
    restaurants.values().toArray().filter(
      func(restaurant) {
        restaurant.cuisine.contains(#text(cuisine));
      }
    );
  };
};
