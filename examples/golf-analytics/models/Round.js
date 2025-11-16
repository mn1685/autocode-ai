/**
 * Round Model - Represents a complete golf round
 */

export class Round {
    constructor({
        playerId,
        courseId,
        date,
        holes = [],
        weather = {},
        totalScore,
        coursePar = 72
    }) {
        this.playerId = playerId;
        this.courseId = courseId;
        this.date = date;
        this.holes = holes;
        this.weather = weather;
        this.totalScore = totalScore;
        this.coursePar = coursePar;
    }

    /**
     * Calculate total strokes gained for the round
     */
    getTotalStrokesGained(strokesGainedByHole) {
        return strokesGainedByHole.reduce((sum, sg) => sum + sg.total, 0);
    }

    /**
     * Get strokes gained by category
     */
    getStrokesGainedByCategory(strokesGainedByHole) {
        const categories = {
            offTheTee: 0,
            approach: 0,
            aroundGreen: 0,
            putting: 0
        };

        strokesGainedByHole.forEach(hole => {
            categories.offTheTee += hole.offTheTee || 0;
            categories.approach += hole.approach || 0;
            categories.aroundGreen += hole.aroundGreen || 0;
            categories.putting += hole.putting || 0;
        });

        return categories;
    }

    /**
     * Calculate scoring average
     */
    getScoringAverage() {
        return this.totalScore;
    }

    /**
     * Get score relative to par
     */
    getScoreToPar() {
        return this.totalScore - this.coursePar;
    }

    /**
     * Calculate fairways hit percentage
     */
    getFairwaysHitPercentage() {
        const drivableHoles = this.holes.filter(h => h.par >= 4);
        if (drivableHoles.length === 0) return 0;

        const fairwaysHit = drivableHoles.filter(h =>
            h.shots[0]?.endingLocation === 'fairway'
        ).length;

        return (fairwaysHit / drivableHoles.length) * 100;
    }

    /**
     * Calculate greens in regulation percentage
     */
    getGreensInRegulation() {
        const girHoles = this.holes.filter(hole => {
            const targetStrokes = hole.par - 2;
            const strokesUsed = hole.shots.findIndex(s => s.endingLocation === 'green') + 1;
            return strokesUsed > 0 && strokesUsed <= targetStrokes;
        });

        return (girHoles.length / this.holes.length) * 100;
    }

    /**
     * Convert to JSON
     */
    toJSON() {
        return {
            playerId: this.playerId,
            courseId: this.courseId,
            date: this.date,
            holes: this.holes,
            weather: this.weather,
            totalScore: this.totalScore,
            coursePar: this.coursePar
        };
    }
}

export class Hole {
    constructor({
        number,
        par,
        yardage,
        shots = [],
        score
    }) {
        this.number = number;
        this.par = par;
        this.yardage = yardage;
        this.shots = shots;
        this.score = score;
    }

    /**
     * Get score relative to par for this hole
     */
    getScoreToPar() {
        return this.score - this.par;
    }

    /**
     * Check if green in regulation
     */
    isGreenInRegulation() {
        const targetStrokes = this.par - 2;
        const strokesUsed = this.shots.findIndex(s => s.endingLocation === 'green') + 1;
        return strokesUsed > 0 && strokesUsed <= targetStrokes;
    }

    /**
     * Get number of putts
     */
    getPutts() {
        return this.shots.filter(s => s.startingLocation === 'green').length;
    }
}
