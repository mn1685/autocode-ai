/**
 * Strokes Gained Calculator Service
 * Implements PGA Tour strokes gained methodology
 *
 * Formula: Strokes Gained = (Baseline Before Shot - Baseline After Shot) - 1
 *
 * The "-1" accounts for the stroke taken.
 * Positive values indicate better than tour average.
 * Negative values indicate worse than tour average.
 */

import { getBaseline, performanceBenchmarks } from '../data/pgaTourBaselines.js';

export class StrokesGainedCalculator {
    /**
     * Calculate strokes gained for a single shot
     */
    static calculateShotStrokesGained(shot) {
        const { distance, startingLocation, endingLocation, distanceToPin } = shot;

        // Get baseline before shot
        const baselineBefore = getBaseline(
            distance,
            startingLocation,
            startingLocation === 'green' ? 'feet' : 'yards'
        );

        // Get baseline after shot
        let baselineAfter;
        if (endingLocation === 'hole') {
            baselineAfter = 0; // Holed out
        } else {
            baselineAfter = getBaseline(
                distanceToPin,
                endingLocation,
                endingLocation === 'green' ? 'feet' : 'yards'
            );
        }

        // Calculate strokes gained
        const strokesGained = baselineBefore - baselineAfter - 1;

        return {
            strokesGained,
            baselineBefore,
            baselineAfter,
            category: this.categorizeShot(shot)
        };
    }

    /**
     * Categorize shot into strokes gained categories
     */
    static categorizeShot(shot) {
        const { startingLocation, distance, endingLocation } = shot;

        // Putting: Any shot on the green
        if (startingLocation === 'green') {
            return 'putting';
        }

        // Off the tee: Tee shots on par 4s and 5s
        if (startingLocation === 'tee' && distance > 200) {
            return 'offTheTee';
        }

        // Around the green: Within 30 yards of green (not on green)
        if (distance <= 30 && startingLocation !== 'green') {
            return 'aroundGreen';
        }

        // Approach: Everything else (approach shots to green)
        return 'approach';
    }

    /**
     * Calculate strokes gained for an entire hole
     */
    static calculateHoleStrokesGained(hole) {
        const categories = {
            offTheTee: 0,
            approach: 0,
            aroundGreen: 0,
            putting: 0,
            total: 0
        };

        hole.shots.forEach(shot => {
            const sg = this.calculateShotStrokesGained(shot);
            categories[sg.category] += sg.strokesGained;
            categories.total += sg.strokesGained;
        });

        return categories;
    }

    /**
     * Calculate strokes gained for an entire round
     */
    static calculateRoundStrokesGained(round) {
        const totalCategories = {
            offTheTee: 0,
            approach: 0,
            aroundGreen: 0,
            putting: 0,
            total: 0
        };

        const holeResults = round.holes.map(hole => {
            const holeSG = this.calculateHoleStrokesGained(hole);

            // Accumulate totals
            totalCategories.offTheTee += holeSG.offTheTee;
            totalCategories.approach += holeSG.approach;
            totalCategories.aroundGreen += holeSG.aroundGreen;
            totalCategories.putting += holeSG.putting;
            totalCategories.total += holeSG.total;

            return {
                hole: hole.number,
                strokesGained: holeSG
            };
        });

        return {
            total: totalCategories,
            byHole: holeResults,
            performance: this.evaluatePerformance(totalCategories)
        };
    }

    /**
     * Evaluate performance against benchmarks
     */
    static evaluatePerformance(strokesGained) {
        const evaluation = {};
        const categories = ['offTheTee', 'approach', 'aroundGreen', 'putting', 'total'];

        categories.forEach(category => {
            const sg = strokesGained[category];
            const great = performanceBenchmarks.great[category] || 0;
            const poor = performanceBenchmarks.poor[category] || 0;
            const elite = performanceBenchmarks.elite[category] || 0;

            let rating;
            if (sg >= elite) {
                rating = 'elite';
            } else if (sg >= great) {
                rating = 'excellent';
            } else if (sg > 0) {
                rating = 'above average';
            } else if (sg > poor) {
                rating = 'below average';
            } else {
                rating = 'poor';
            }

            evaluation[category] = {
                value: sg,
                rating,
                percentile: this.estimatePercentile(sg, category)
            };
        });

        return evaluation;
    }

    /**
     * Estimate percentile rank based on strokes gained value
     * Assumes normal distribution around tour average
     */
    static estimatePercentile(strokesGained, category) {
        // These are rough estimates based on tour statistics
        const stdDevs = {
            offTheTee: 0.5,
            approach: 0.8,
            aroundGreen: 0.4,
            putting: 0.5,
            total: 1.5
        };

        const stdDev = stdDevs[category] || 1.0;
        const zScore = strokesGained / stdDev;

        // Convert z-score to percentile (simplified)
        // Using approximation of cumulative normal distribution
        const percentile = this.normalCDF(zScore) * 100;

        return Math.min(99.9, Math.max(0.1, percentile));
    }

    /**
     * Approximation of normal cumulative distribution function
     */
    static normalCDF(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

        return x > 0 ? 1 - prob : prob;
    }

    /**
     * Calculate strokes gained trend over multiple rounds
     */
    static calculateTrend(rounds) {
        const trend = {
            offTheTee: [],
            approach: [],
            aroundGreen: [],
            putting: [],
            total: []
        };

        rounds.forEach((round, index) => {
            const sg = this.calculateRoundStrokesGained(round);

            Object.keys(trend).forEach(category => {
                trend[category].push({
                    round: index + 1,
                    date: round.date,
                    value: sg.total[category]
                });
            });
        });

        // Calculate moving averages
        const movingAverages = {};
        Object.keys(trend).forEach(category => {
            movingAverages[category] = this.calculateMovingAverage(trend[category], 5);
        });

        return {
            raw: trend,
            movingAverage: movingAverages
        };
    }

    /**
     * Calculate moving average
     */
    static calculateMovingAverage(data, windowSize) {
        const result = [];

        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const window = data.slice(start, i + 1);
            const avg = window.reduce((sum, item) => sum + item.value, 0) / window.length;

            result.push({
                round: data[i].round,
                date: data[i].date,
                value: avg
            });
        }

        return result;
    }

    /**
     * Compare player to benchmarks
     */
    static compareToBenchmarks(playerStrokesGained) {
        const comparisons = {};
        const benchmarkLevels = ['tourAverage', 'elite'];

        Object.keys(playerStrokesGained).forEach(category => {
            comparisons[category] = {
                player: playerStrokesGained[category]
            };

            benchmarkLevels.forEach(level => {
                const benchmark = performanceBenchmarks[level][category] || 0;
                comparisons[category][level] = {
                    value: benchmark,
                    delta: playerStrokesGained[category] - benchmark
                };
            });
        });

        return comparisons;
    }

    /**
     * Identify improvement opportunities
     */
    static getImprovementOpportunities(playerStrokesGained) {
        const categories = ['offTheTee', 'approach', 'aroundGreen', 'putting'];

        const opportunities = categories.map(category => {
            const playerSG = playerStrokesGained[category];
            const tourAverage = performanceBenchmarks.tourAverage[category];
            const elite = performanceBenchmarks.elite[category];

            // Potential gain if improved to tour average
            const potentialGainToAverage = Math.max(0, tourAverage - playerSG);

            // Potential gain if improved to elite level
            const potentialGainToElite = elite - playerSG;

            return {
                category,
                currentPerformance: playerSG,
                potentialGainToAverage,
                potentialGainToElite,
                priority: this.calculatePriority(playerSG, potentialGainToElite)
            };
        });

        // Sort by priority (highest first)
        return opportunities.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Calculate improvement priority
     */
    static calculatePriority(currentSG, potentialGain) {
        // Priority is higher when:
        // 1. Current performance is poor (negative SG)
        // 2. Potential gain is large
        const performancePenalty = Math.abs(Math.min(0, currentSG)) * 2;
        const gainBonus = Math.max(0, potentialGain);

        return performancePenalty + gainBonus;
    }
}

export default StrokesGainedCalculator;
