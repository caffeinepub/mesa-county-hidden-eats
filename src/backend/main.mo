import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

// Components
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type Cuisine = {
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

  public type VibeAttributes = {
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

  public type Restaurant = {
    name : Text;
    cuisine : Cuisine;
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
    seasonalMonths : [Nat];
    vibeAttributes : VibeAttributes;
    imageURL : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let restaurants = Map.fromIter<Text, Restaurant>([
    (
      "Peche",
      {
        name = "Peche";
        cuisine = #fineDining;
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
        vibeAttributes = {
          artCraftsFocused = false;
          dateNightFriendly = true;
          familyFriendly = true;
          liveMusic = false;
          dogFriendly = false;
          brightOpenSpaces = true;
          perfectLighting = true;
          themedDrinks = true;
          fruitCiderOptions = true;
          mountainViews = false;
          fruitInfusedRecipes = true;
          workFriendly = true;
        };
        imageURL = "/assets/generated/peche-plating.dim_800x600.png";
      },
    ),
    (
      "Hot Tomato Pizza",
      {
        name = "Hot Tomato Pizza";
        cuisine = #pizza;
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
        vibeAttributes = {
          artCraftsFocused = false;
          dateNightFriendly = true;
          familyFriendly = true;
          liveMusic = true;
          dogFriendly = true;
          brightOpenSpaces = true;
          perfectLighting = true;
          themedDrinks = true;
          fruitCiderOptions = true;
          mountainViews = false;
          fruitInfusedRecipes = true;
          workFriendly = true;
        };
        imageURL = "/assets/generated/hot-tomato-pizza.dim_800x600.png";
      },
    ),
    (
      "Taco Party",
      {
        name = "Taco Party";
        cuisine = #mexican;
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
        vibeAttributes = {
          artCraftsFocused = false;
          dateNightFriendly = true;
          familyFriendly = true;
          liveMusic = true;
          dogFriendly = true;
          brightOpenSpaces = true;
          perfectLighting = true;
          themedDrinks = true;
          fruitCiderOptions = true;
          mountainViews = false;
          fruitInfusedRecipes = true;
          workFriendly = true;
        };
        imageURL = "/assets/generated/taco-party-cuate.dim_800x600.png";
      },
    ),
    (
      "Best Slope Coffee",
      {
        name = "Best Slope Coffee";
        cuisine = #cafe;
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
        vibeAttributes = {
          artCraftsFocused = false;
          dateNightFriendly = true;
          familyFriendly = true;
          liveMusic = false;
          dogFriendly = true;
          brightOpenSpaces = true;
          perfectLighting = true;
          themedDrinks = true;
          fruitCiderOptions = true;
          mountainViews = false;
          fruitInfusedRecipes = true;
          workFriendly = true;
        };
        imageURL = "/assets/generated/best-slope-coffee.dim_800x600.png";
      },
    ),
    (
      "Bin 707 Foodbar",
      {
        name = "Bin 707 Foodbar";
        cuisine = #fineDining;
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
        vibeAttributes = {
          artCraftsFocused = false;
          dateNightFriendly = true;
          familyFriendly = true;
          liveMusic = false;
          dogFriendly = false;
          brightOpenSpaces = true;
          perfectLighting = true;
          themedDrinks = true;
          fruitCiderOptions = true;
          mountainViews = false;
          fruitInfusedRecipes = true;
          workFriendly = true;
        };
        imageURL = "/assets/generated/fine-dining-cuate.dim_800x600.png";
      },
    ),
    (
      "Hybrid0",
      {
        name = "Hybrid0";
        cuisine = #hybrid;
        description = "Serves dirty sodas, twisted teas, and snacks.";
        location = "Grand Junction";
        address = "2650 North Ave. unit 117 Grand Junction, CO 81501";
        contact = "";
        isHiddenGem = true;
        coordinates = {
          latitude = 39.0639;
          longitude = -108.5506;
        };
        isPetFriendly = false;
        isNearRiverfrontTrail = false;
        isGreatForDate = true;
        isPalisadeFruitSeason = false;
        seasonalMonths = [];
        vibeAttributes = {
          artCraftsFocused = true;
          dateNightFriendly = true;
          familyFriendly = true;
          liveMusic = false;
          dogFriendly = false;
          brightOpenSpaces = false;
          perfectLighting = false;
          themedDrinks = true;
          fruitCiderOptions = false;
          mountainViews = false;
          fruitInfusedRecipes = false;
          workFriendly = false;
        };
        imageURL = "/assets/generated/hybrid-art-studio.dim_800x600.png";
      },
    ),
  ].values());

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

  public query ({ caller }) func searchByCuisine(cuisine : Cuisine) : async [Restaurant] {
    let results = List.empty<Restaurant>();
    for ((_, v) in restaurants.entries()) {
      if (v.cuisine == cuisine) {
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
};
