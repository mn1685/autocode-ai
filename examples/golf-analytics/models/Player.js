/**
 * Player Model - Represents a golfer with statistics
 */

export class Player {
    constructor({
        id,
        name,
        handicap = 0,
        rounds = [],
        strokesGainedProfile = null
    }) {
        this.id = id;
        this.name = name;
        this.handicap = handicap;
        this.rounds = rounds;
        this.strokesGainedProfile = strokesGainedProfile || this.initializeProfile();
    }

    /**
     * Initialize default strokes gained profile
     */
    initializeProfile() {
        return {
            offTheTee: {
                average: 0,
                stdDev: 0,
                trend: []
            },
            approach: {
                average: 0,
                stdDev: 0,
                trend: []
            },
            aroundGreen: {
                average: 0,
                stdDev: 0,
                trend: []
            },
            putting: {
                average: 0,
                stdDev: 0,
                trend: []
            },
            total: {
                average: 0,
                stdDev: 0,
                trend: []
            }
        };
    }

    /**
     * Update strokes gained profile with new round data
     */
    updateProfile(strokesGainedData) {
        const categories = ['offTheTee', 'approach', 'aroundGreen', 'putting', 'total'];

        categories.forEach(category => {
            const profile = this.strokesGainedProfile[category];
            const newValue = strokesGainedData[category];

            // Update trend
            profile.trend.push({
                date: new Date(),
                value: newValue
            });

            // Keep only last 20 rounds in trend
            if (profile.trend.length > 20) {
                profile.trend.shift();
            }

            // Recalculate average
            const values = profile.trend.map(t => t.value);
            profile.average = values.reduce((sum, v) => sum + v, 0) / values.length;

            // Recalculate standard deviation
            const variance = values.reduce((sum, v) =>
                sum + Math.pow(v - profile.average, 2), 0
            ) / values.length;
            profile.stdDev = Math.sqrt(variance);
        });
    }

    /**
     * Get scoring average
     */
    getScoringAverage() {
        if (this.rounds.length === 0) return 0;
        const totalScore = this.rounds.reduce((sum, r) => sum + r.totalScore, 0);
        return totalScore / this.rounds.length;
    }

    /**
     * Get strongest category
     */
    getStrengths() {
        const categories = ['offTheTee', 'approach', 'aroundGreen', 'putting'];
        return categories
            .map(cat => ({
                category: cat,
                average: this.strokesGainedProfile[cat].average
            }))
            .sort((a, b) => b.average - a.average);
    }

    /**
     * Get weakest category (improvement opportunities)
     */
    getWeaknesses() {
        return this.getStrengths().reverse();
    }

    /**
     * Calculate consistency score (lower is more consistent)
     */
    getConsistencyScore() {
        const totalStdDev = this.strokesGainedProfile.total.stdDev;
        return totalStdDev;
    }

    /**
     * Convert to JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            handicap: this.handicap,
            rounds: this.rounds.length,
            strokesGainedProfile: this.strokesGainedProfile
        };
    }
}
