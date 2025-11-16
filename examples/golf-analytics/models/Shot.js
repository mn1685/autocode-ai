/**
 * Shot Model - Represents a single golf shot
 * Based on PGA Tour ShotLink data structure
 */

export class Shot {
    constructor({
        shotNumber,
        hole,
        distance,
        startingLocation, // 'tee', 'fairway', 'rough', 'sand', 'green'
        endingLocation,
        club,
        result, // 'green', 'fairway', 'rough', 'sand', 'penalty', 'hole'
        lateralDistance = 0, // offline distance (for accuracy)
        distanceToPin,
        lie, // quality of lie (1-10 scale)
        slope = 0,
        wind = 0
    }) {
        this.shotNumber = shotNumber;
        this.hole = hole;
        this.distance = distance;
        this.startingLocation = startingLocation;
        this.endingLocation = endingLocation;
        this.club = club;
        this.result = result;
        this.lateralDistance = lateralDistance;
        this.distanceToPin = distanceToPin;
        this.lie = lie;
        this.slope = slope;
        this.wind = wind;
    }

    /**
     * Calculate shot dispersion (accuracy metric)
     */
    getDispersion() {
        return Math.sqrt(
            Math.pow(this.lateralDistance, 2) +
            Math.pow(this.distance - this.distanceToPin, 2)
        );
    }

    /**
     * Get risk level of the shot (0-10 scale)
     */
    getRiskLevel() {
        let risk = 0;

        // Penalty areas increase risk
        if (this.startingLocation === 'sand') risk += 2;
        if (this.startingLocation === 'rough') risk += 1;

        // Long shots are riskier
        if (this.distance > 250) risk += 2;
        if (this.distance > 200 && this.distance <= 250) risk += 1;

        // Environmental factors
        risk += Math.abs(this.slope) / 5;
        risk += Math.abs(this.wind) / 10;

        return Math.min(risk, 10);
    }

    /**
     * Convert to JSON for storage/transmission
     */
    toJSON() {
        return {
            shotNumber: this.shotNumber,
            hole: this.hole,
            distance: this.distance,
            startingLocation: this.startingLocation,
            endingLocation: this.endingLocation,
            club: this.club,
            result: this.result,
            lateralDistance: this.lateralDistance,
            distanceToPin: this.distanceToPin,
            lie: this.lie,
            slope: this.slope,
            wind: this.wind
        };
    }
}
