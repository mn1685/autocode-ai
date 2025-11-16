// Sample golf course data with detailed hole information
export const golfCourses = {
    pebbleBeach: {
        name: "Pebble Beach Golf Links",
        location: "Pebble Beach, CA",
        par: 72,
        rating: 145,
        slope: 75.5,
        holes: [
            {
                number: 1,
                par: 4,
                distance: 381,
                handicap: 13,
                hazards: ["fairway bunkers left", "rough right"],
                green: { size: "medium", slope: "moderate", speed: 12 },
                wind: { prevailing: "west", strength: "moderate" },
                strategy: "Driver off tee aiming right center, approach from 150-170 yards"
            },
            {
                number: 7,
                par: 3,
                distance: 106,
                handicap: 17,
                hazards: ["ocean left", "bunkers front"],
                green: { size: "small", slope: "severe", speed: 13 },
                wind: { prevailing: "ocean breeze", strength: "strong" },
                strategy: "Club selection critical - wind can change 2-3 clubs"
            },
            {
                number: 8,
                par: 4,
                distance: 428,
                handicap: 3,
                hazards: ["ocean left", "cliff edge", "bunkers right"],
                green: { size: "medium", slope: "severe", speed: 13 },
                wind: { prevailing: "ocean", strength: "strong" },
                strategy: "Most iconic hole - aim right to avoid ocean, 200+ yard approach over cliff"
            },
            {
                number: 18,
                par: 5,
                distance: 543,
                handicap: 5,
                hazards: ["ocean left all the way", "bunkers right", "trees right"],
                green: { size: "large", slope: "moderate", speed: 12 },
                wind: { prevailing: "ocean", strength: "variable" },
                strategy: "Strategic finishing hole - lay up or go for green in two depending on position"
            }
        ]
    },
    augusta: {
        name: "Augusta National Golf Club",
        location: "Augusta, GA",
        par: 72,
        rating: 155,
        slope: 76.2,
        holes: [
            {
                number: 12,
                par: 3,
                distance: 155,
                handicap: 16,
                hazards: ["rae's creek front", "bunkers back", "swirling winds"],
                green: { size: "small", slope: "severe", speed: 14 },
                wind: { prevailing: "swirling", strength: "variable" },
                strategy: "Golden Bell - most dangerous par 3, club selection and wind reading crucial"
            },
            {
                number: 13,
                par: 5,
                distance: 510,
                handicap: 9,
                hazards: ["creek fronts green", "azaleas left", "trees right"],
                green: { size: "medium", slope: "severe left to right", speed: 14 },
                wind: { prevailing: "downwind", strength: "helping" },
                strategy: "Azalea - risk/reward decision on second shot to go for green"
            }
        ]
    },
    stAndrews: {
        name: "The Old Course at St. Andrews",
        location: "St. Andrews, Scotland",
        par: 72,
        rating: 141,
        slope: 74.8,
        holes: [
            {
                number: 17,
                par: 4,
                distance: 495,
                handicap: 1,
                hazards: ["road hole bunker", "road behind green", "hotel OB right"],
                green: { size: "narrow", slope: "severe front to back", speed: 11 },
                wind: { prevailing: "left to right", strength: "strong" },
                strategy: "Road Hole - hardest hole in golf, aim left of green to avoid road bunker"
            }
        ]
    }
};

export const playerProfiles = {
    professional: {
        level: "Professional",
        drivingDistance: 300,
        drivingAccuracy: 70,
        greensInRegulation: 75,
        puttingAverage: 1.7,
        sandSaves: 60,
        riskTolerance: "moderate"
    },
    lowHandicap: {
        level: "Low Handicap (0-5)",
        drivingDistance: 270,
        drivingAccuracy: 65,
        greensInRegulation: 65,
        puttingAverage: 1.8,
        sandSaves: 50,
        riskTolerance: "moderate"
    },
    midHandicap: {
        level: "Mid Handicap (6-15)",
        drivingDistance: 240,
        drivingAccuracy: 55,
        greensInRegulation: 50,
        puttingAverage: 2.0,
        sandSaves: 35,
        riskTolerance: "conservative"
    },
    highHandicap: {
        level: "High Handicap (16+)",
        drivingDistance: 210,
        drivingAccuracy: 45,
        greensInRegulation: 30,
        puttingAverage: 2.2,
        sandSaves: 20,
        riskTolerance: "conservative"
    }
};

export const weatherConditions = {
    calm: {
        windSpeed: 5,
        temperature: 72,
        precipitation: 0,
        impact: "minimal"
    },
    breezy: {
        windSpeed: 15,
        temperature: 68,
        precipitation: 0,
        impact: "moderate - adjust club selection 1-2 clubs"
    },
    windy: {
        windSpeed: 25,
        temperature: 65,
        precipitation: 0,
        impact: "significant - adjust club selection 2-3 clubs, ball flight affected"
    },
    rainy: {
        windSpeed: 10,
        temperature: 58,
        precipitation: 80,
        impact: "severe - reduced distance, softer greens, wet rough"
    }
};
