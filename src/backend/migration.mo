import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type OldCoordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type OldRestaurant = {
    name : Text;
    cuisine : Text;
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
    seasonalMonths : [Nat]; // 1-12 (Jan-Dec)
  };

  public type OldUserProfile = {
    name : Text;
  };

  public type RestaurantNotes = Map.Map<Text, Text>;
  public type RestaurantRatings = Map.Map<Text, Nat>;
  public type VisitedRestaurants = Map.Map<Text, Bool>;

  public type OldActor = {
    restaurants : Map.Map<Text, OldRestaurant>;
    userVisitedRestaurants : Map.Map<Principal, VisitedRestaurants>;
    userNotes : Map.Map<Principal, RestaurantNotes>;
    userRatings : Map.Map<Principal, RestaurantRatings>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
