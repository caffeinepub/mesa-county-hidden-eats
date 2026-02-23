import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  public type OldCoordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type NewCoordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type OldCuisine = Text;

  public type NewCuisine = {
    #pizza;
    #mexican;
    #cafe;
    #fineDining;
    #barbecue;
    #italian;
    #asianFusion;
    #coffeeShop;
    #bar;
    #pub;
    #burger;
    #sandwiches;
    #seafood;
    #steakhouse;
    #brewery;
    #deli;
    #market;
    #hotelRestaurant;
    #winery;
    #hybrid;
  };

  public type OldRestaurant = {
    name : Text;
    cuisine : OldCuisine;
    description : Text;
    location : Text;
    address : Text;
    contact : Text;
    isHiddenGem : Bool;
    coordinates : OldCoordinates;
    isPetFriendly : Bool;
    isNearRiverfrontTrail : Bool;
    isGreatForDate : Bool;
    isPalisadeFruitSeason : Bool;
    seasonalMonths : [Nat];
    isLiveMusic : Bool;
    isDogFriendly : Bool;
    isGreatForGroups : Bool;
    imageURL : Text;
  };

  public type NewRestaurant = {
    name : Text;
    cuisine : NewCuisine;
    description : Text;
    location : Text;
    address : Text;
    contact : Text;
    isHiddenGem : Bool;
    coordinates : NewCoordinates;
    isPetFriendly : Bool;
    isNearRiverfrontTrail : Bool;
    isGreatForDate : Bool;
    isPalisadeFruitSeason : Bool;
    seasonalMonths : [Nat];
    vibeAttributes : {
      artCraftsFocused : Bool;
      dateNightFriendly : Bool;
      familyFriendly : Bool;
      liveMusic : Bool;
      dogFriendly : Bool;
      brightOpenSpaces : Bool;
      perfectLighting : Bool;
      themedDrinks : Bool;
      fruitCiderOptions : Bool;
      mountainViews : Bool;
      fruitInfusedRecipes : Bool;
      workFriendly : Bool;
    };
    imageURL : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type OldActor = {
    restaurants : Map.Map<Text, OldRestaurant>;
    userProfiles : Map.Map<Principal, UserProfile>;
    userVisitedRestaurants : Map.Map<Principal, Map.Map<Text, Bool>>;
    userNotes : Map.Map<Principal, Map.Map<Text, Text>>;
    userRatings : Map.Map<Principal, Map.Map<Text, Nat>>;
  };

  public type NewActor = {
    restaurants : Map.Map<Text, NewRestaurant>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  func toCuisineVariant(cuisineText : Text) : NewCuisine {
    switch (cuisineText) {
      case ("pizza") { #pizza };
      case ("mexican") { #mexican };
      case ("cafe") { #cafe };
      case ("fineDining") { #fineDining };
      case ("barbecue") { #barbecue };
      case ("italian") { #italian };
      case ("asianFusion") { #asianFusion };
      case ("coffeeShop") { #coffeeShop };
      case ("bar") { #bar };
      case ("pub") { #pub };
      case ("burger") { #burger };
      case ("sandwiches") { #sandwiches };
      case ("seafood") { #seafood };
      case ("steakhouse") { #steakhouse };
      case ("brewery") { #brewery };
      case ("deli") { #deli };
      case ("market") { #market };
      case ("hotelRestaurant") { #hotelRestaurant };
      case ("winery") { #winery };
      case ("hybrid") { #hybrid };
      case (_) { #hybrid };
    };
  };

  public func run(old : OldActor) : NewActor {
    let restaurants = old.restaurants.map<Text, OldRestaurant, NewRestaurant>(
      func(_key, oldRestaurant) {
        {
          oldRestaurant with
          cuisine = toCuisineVariant(oldRestaurant.cuisine);
          vibeAttributes = {
            artCraftsFocused = false;
            dateNightFriendly = true;
            familyFriendly = true;
            liveMusic = false;
            dogFriendly = oldRestaurant.isDogFriendly;
            brightOpenSpaces = true;
            perfectLighting = true;
            themedDrinks = true;
            fruitCiderOptions = true;
            mountainViews = false;
            fruitInfusedRecipes = true;
            workFriendly = true;
          };
        };
      }
    );

    {
      restaurants;
      userProfiles = old.userProfiles;
    };
  };
};
