import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Add migration in with clause
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type Restaurant = {
    name : Text;
    cuisine : Text;
    description : Text;
    location : Text;
    address : Text;
    contact : Text;
    isHiddenGem : Bool;
    coordinates : Coordinates;
    isPetFriendly : Bool;
    isNearRiverfrontTrail : Bool;
    isGreatForDate : Bool;
    isPalisadeFruitSeason : Bool;
    seasonalMonths : [Nat]; // 1-12 (Jan-Dec)
  };

  type VisitedRestaurants = Map.Map<Text, Bool>;
  type RestaurantNotes = Map.Map<Text, Text>;
  type RestaurantRatings = Map.Map<Text, Nat>;

  public type UserProfile = {
    name : Text;
  };

  let restaurants = Map.fromIter<Text, Restaurant>([
    (
      "Peche",
      {
        name = "Peche";
        cuisine = "Fine Dining";
        description = "Locally sourced fine dining experience in the heart of Palisade.";
        location = "Palisade";
        address = "336 Main St, Palisade, CO 81526";
        contact = "(970) 464-4913";
        isHiddenGem = true;
        coordinates = { latitude = 39.110108; longitude = -108.352289 };
        isPetFriendly = false;
        isNearRiverfrontTrail = false;
        isGreatForDate = true;
        isPalisadeFruitSeason = false;
        seasonalMonths = [];
      },
    ),
    (
      "Hot Tomato Pizza",
      {
        name = "Hot Tomato Pizza";
        cuisine = "Pizza";
        description = "Legendary pizza with a bike-friendly vibe, loved by locals.";
        location = "Fruita";
        address = "124 N Mulberry St, Fruita, CO 81521";
        contact = "(970) 858-1117";
        isHiddenGem = true;
        coordinates = { latitude = 39.15815; longitude = -108.727654 };
        isPetFriendly = true;
        isNearRiverfrontTrail = true;
        isGreatForDate = true;
        isPalisadeFruitSeason = false;
        seasonalMonths = [];
      },
    ),
    (
      "Taco Party",
      {
        name = "Taco Party";
        cuisine = "Mexican";
        description = "Creative local tacos with a twist, using fresh ingredients.";
        location = "Grand Junction";
        address = "126 S 5th St, Grand Junction, CO 81501";
        contact = "(970) 549-6165";
        isHiddenGem = true;
        coordinates = { latitude = 39.064035; longitude = -108.549956 };
        isPetFriendly = true;
        isNearRiverfrontTrail = false;
        isGreatForDate = true;
        isPalisadeFruitSeason = false;
        seasonalMonths = [];
      },
    ),
    (
      "Best Slope Coffee",
      {
        name = "Best Slope Coffee";
        cuisine = "Cafe";
        description = "Artisan coffee shop and community hub in Fruita.";
        location = "Fruita";
        address = "129 N Peach St, Fruita, CO 81521";
        contact = "(970) 640-4085";
        isHiddenGem = true;
        coordinates = { latitude = 39.158623; longitude = -108.728779 };
        isPetFriendly = true;
        isNearRiverfrontTrail = true;
        isGreatForDate = true;
        isPalisadeFruitSeason = false;
        seasonalMonths = [];
      },
    ),
    (
      "Bin 707 Foodbar",
      {
        name = "Bin 707 Foodbar";
        cuisine = "Fine Dining";
        description = "High-end seasonal Colorado cuisine with an extensive wine list.";
        location = "Grand Junction";
        address = "225 N 5th St #105, Grand Junction, CO 81501";
        contact = "(970) 243-4543";
        isHiddenGem = true;
        coordinates = { latitude = 39.065513; longitude = -108.551252 };
        isPetFriendly = false;
        isNearRiverfrontTrail = false;
        isGreatForDate = true;
        isPalisadeFruitSeason = false;
        seasonalMonths = [];
      },
    ),
  ].values());

  let userVisitedRestaurants = Map.empty<Principal, VisitedRestaurants>();
  let userNotes = Map.empty<Principal, RestaurantNotes>();
  let userRatings = Map.empty<Principal, RestaurantRatings>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getRestaurantByName(name : Text) : async ?Restaurant {
    restaurants.get(name);
  };

  public query ({ caller }) func searchByCuisine(cuisine : Text) : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.cuisine.contains(#text(cuisine))) {
        results.add(v);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getAllRestaurants() : async [Restaurant] {
    restaurants.values().toArray();
  };

  public query ({ caller }) func getRestaurantsByLocation(location : Text) : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.location.contains(#text(location))) {
        results.add(v);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getPetFriendlyRestaurants() : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.isPetFriendly) {
        results.add(v);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getRestaurantsNearTrail() : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.isNearRiverfrontTrail) {
        results.add(v);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getDateNightRestaurants() : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.isGreatForDate) {
        results.add(v);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getSeasonalRestaurants() : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.isPalisadeFruitSeason) {
        results.add(v);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getSeasonalRestaurantsByMonth(month : Nat) : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.isPalisadeFruitSeason) {
        for (m in v.seasonalMonths.values()) {
          if (m == month) {
            results.add(v);
          };
        };
      };
    };
    results.toArray();
  };

  public shared ({ caller }) func addVisitedRestaurant(restaurantName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark restaurants as visited");
    };

    switch (restaurants.get(restaurantName)) {
      case (null) {
        Runtime.trap("Restaurant does not exist");
      };
      case (?_) {
        switch (userVisitedRestaurants.get(caller)) {
          case (null) {
            let visited = Map.empty<Text, Bool>();
            visited.add(restaurantName, true);
            userVisitedRestaurants.add(caller, visited);
          };
          case (?visitedRestaurants) {
            visitedRestaurants.add(restaurantName, true);
          };
        };
      };
    };
  };

  public query ({ caller }) func isRestaurantVisited(restaurantName : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check visited status");
    };

    switch (userVisitedRestaurants.get(caller)) {
      case (null) { false };
      case (?visitedRestaurants) {
        switch (visitedRestaurants.get(restaurantName)) {
          case (null) { false };
          case (?visited) { visited };
        };
      };
    };
  };

  public shared ({ caller }) func saveRating(restaurantName : Text, rating : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save ratings");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    switch (restaurants.get(restaurantName)) {
      case (null) {
        Runtime.trap("Restaurant does not exist");
      };
      case (?_) {
        switch (userRatings.get(caller)) {
          case (null) {
            let ratings = Map.empty<Text, Nat>();
            ratings.add(restaurantName, rating);
            userRatings.add(caller, ratings);
          };
          case (?ratings) {
            ratings.add(restaurantName, rating);
          };
        };
      };
    };
  };

  public query ({ caller }) func getRating(restaurantName : Text) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access ratings");
    };

    switch (userRatings.get(caller)) {
      case (null) { null };
      case (?ratings) {
        ratings.get(restaurantName);
      };
    };
  };

  public shared ({ caller }) func saveNote(restaurantName : Text, note : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save notes");
    };

    switch (restaurants.get(restaurantName)) {
      case (null) {
        Runtime.trap("Restaurant does not exist");
      };
      case (?_) {
        switch (userNotes.get(caller)) {
          case (null) {
            let notes = Map.empty<Text, Text>();
            notes.add(restaurantName, note);
            userNotes.add(caller, notes);
          };
          case (?notes) {
            notes.add(restaurantName, note);
          };
        };
      };
    };
  };

  public query ({ caller }) func getNote(restaurantName : Text) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access notes");
    };

    switch (userNotes.get(caller)) {
      case (null) { null };
      case (?notes) {
        notes.get(restaurantName);
      };
    };
  };
};
