/**
 * Risk-Adjusted Optimization Service
 * Maximizes potential strokes gained without adding adverse risk
 *
 * Key Concepts:
 * - Expected Value: Average strokes gained across possible outcomes
 * - Risk: Variance/standard deviation of outcomes
 * - Sharpe Ratio: (Expected SG) / (Risk) - higher is better
 * - Risk-Adjusted Return: Maximize gains while controlling downside risk
 */

import { getBaseline, performanceBenchmarks, dispersionBenchmarks } from '../data/pgaTourBaselines.js';
import StrokesGainedCalculator from './StrokesGainedCalculator.js';

export class RiskOptimizer {
    /**
     * Calculate risk-adjusted expected value for a shot strategy
     *
     * @param {Object} strategy - Shot strategy (club, target, etc.)
     * @param {Object} playerProfile - Player skill profile
     * @param {Object} situation - Current shot situation
     * @returns {Object} Expected value, risk, and risk-adjusted metrics
     */
    static calculateExpectedValue(strategy, playerProfile, situation) {
        const outcomes = this.simulateOutcomes(strategy, playerProfile, situation);

        // Calculate expected strokes gained
        const expectedSG = outcomes.reduce((sum, outcome) =>
            sum + (outcome.probability * outcome.strokesGained), 0
        );

        // Calculate variance (risk)
        const variance = outcomes.reduce((sum, outcome) =>
            sum + (outcome.probability * Math.pow(outcome.strokesGained - expectedSG, 2)), 0
        );

        const stdDev = Math.sqrt(variance);

        // Calculate downside risk (only negative outcomes)
        const downsideOutcomes = outcomes.filter(o => o.strokesGained < 0);
        const downsideRisk = downsideOutcomes.reduce((sum, outcome) =>
            sum + (outcome.probability * Math.abs(outcome.strokesGained)), 0
        );

        // Sharpe Ratio (risk-adjusted return)
        const sharpeRatio = stdDev > 0 ? expectedSG / stdDev : 0;

        // Sortino Ratio (downside risk-adjusted return)
        const sortinoRatio = downsideRisk > 0 ? expectedSG / downsideRisk : expectedSG;

        return {
            expectedStrokesGained: expectedSG,
            standardDeviation: stdDev,
            downsideRisk,
            sharpeRatio,
            sortinoRatio,
            outcomes,
            riskScore: this.calculateRiskScore(stdDev, downsideRisk)
        };
    }

    /**
     * Simulate possible outcomes for a shot
     */
    static simulateOutcomes(strategy, playerProfile, situation) {
        const { club, target } = strategy;
        const { distance, startingLocation } = situation;

        // Get player dispersion for this club
        const dispersion = this.getPlayerDispersion(club, playerProfile);

        // Define outcome scenarios
        const outcomes = [
            // Perfect shot (10% probability)
            {
                name: 'perfect',
                probability: 0.10,
                lateralDispersion: 0,
                distanceDispersion: 0
            },
            // Good shot (40% probability)
            {
                name: 'good',
                probability: 0.40,
                lateralDispersion: dispersion * 0.5,
                distanceDispersion: dispersion * 0.3
            },
            // Average shot (30% probability)
            {
                name: 'average',
                probability: 0.30,
                lateralDispersion: dispersion,
                distanceDispersion: dispersion * 0.5
            },
            // Poor shot (15% probability)
            {
                name: 'poor',
                probability: 0.15,
                lateralDispersion: dispersion * 1.5,
                distanceDispersion: dispersion * 0.8
            },
            // Bad shot (5% probability)
            {
                name: 'bad',
                probability: 0.05,
                lateralDispersion: dispersion * 2.5,
                distanceDispersion: dispersion * 1.2
            }
        ];

        // Calculate strokes gained for each outcome
        return outcomes.map(outcome => {
            const resultingPosition = this.calculateResultingPosition(
                target,
                outcome.lateralDispersion,
                outcome.distanceDispersion,
                situation
            );

            const baselineBefore = getBaseline(distance, startingLocation);
            const baselineAfter = getBaseline(
                resultingPosition.distanceToHole,
                resultingPosition.location
            );

            const strokesGained = baselineBefore - baselineAfter - 1;

            return {
                ...outcome,
                resultingPosition,
                strokesGained,
                baselineBefore,
                baselineAfter
            };
        });
    }

    /**
     * Calculate resulting position after shot with dispersion
     */
    static calculateResultingPosition(target, lateralDispersion, distanceDispersion, situation) {
        // Simplified model - in reality this would account for:
        // - Course topology
        // - Hazards
        // - Wind
        // - Elevation changes

        const totalDispersion = Math.sqrt(
            Math.pow(lateralDispersion, 2) + Math.pow(distanceDispersion, 2)
        );

        // Determine resulting lie
        let location;
        if (target === 'green' && totalDispersion < 10) {
            location = 'green';
        } else if (totalDispersion < 20) {
            location = 'fairway';
        } else if (totalDispersion < 35) {
            location = 'rough';
        } else {
            location = 'rough'; // or hazard in more advanced model
        }

        // Calculate distance to hole
        const targetDistance = situation.distanceToHole - situation.distance;
        const distanceToHole = Math.max(0, targetDistance + distanceDispersion);

        return {
            location,
            distanceToHole,
            dispersion: totalDispersion
        };
    }

    /**
     * Get player dispersion based on skill level
     */
    static getPlayerDispersion(club, playerProfile) {
        const skillLevel = playerProfile.skillLevel || 'tourAverage';
        const clubType = this.getClubType(club);

        return dispersionBenchmarks[clubType]?.[skillLevel] || 30;
    }

    /**
     * Map club to club type for dispersion lookup
     */
    static getClubType(club) {
        if (!club) return 'midIron';

        const clubLower = club.toLowerCase();

        if (clubLower.includes('driver') || clubLower.includes('wood')) {
            return 'driver';
        } else if (clubLower.includes('wedge')) {
            return 'wedge';
        } else if (clubLower.includes('9') || clubLower.includes('8') || clubLower.includes('7')) {
            return 'shortIron';
        } else if (clubLower.includes('6') || clubLower.includes('5')) {
            return 'midIron';
        } else {
            return 'longIron';
        }
    }

    /**
     * Calculate overall risk score (0-10 scale)
     */
    static calculateRiskScore(standardDeviation, downsideRisk) {
        // Risk increases with variance and downside potential
        const varianceScore = Math.min(5, standardDeviation * 2);
        const downsideScore = Math.min(5, downsideRisk * 3);

        return varianceScore + downsideScore;
    }

    /**
     * Optimize shot strategy for maximum risk-adjusted returns
     *
     * @param {Array} strategies - Array of possible shot strategies
     * @param {Object} playerProfile - Player skill profile
     * @param {Object} situation - Current shot situation
     * @param {Object} constraints - Risk constraints
     * @returns {Object} Optimal strategy
     */
    static optimizeStrategy(strategies, playerProfile, situation, constraints = {}) {
        const {
            maxRisk = 5, // Maximum acceptable risk score
            minExpectedSG = -0.5, // Minimum acceptable expected strokes gained
            preferLowRisk = true // Prefer lower risk when equal expected value
        } = constraints;

        // Evaluate each strategy
        const evaluatedStrategies = strategies.map(strategy => {
            const evaluation = this.calculateExpectedValue(strategy, playerProfile, situation);

            return {
                strategy,
                ...evaluation
            };
        });

        // Filter by constraints
        const viableStrategies = evaluatedStrategies.filter(s =>
            s.riskScore <= maxRisk &&
            s.expectedStrokesGained >= minExpectedSG
        );

        if (viableStrategies.length === 0) {
            console.warn('No strategies meet risk constraints. Relaxing constraints...');
            // Fall back to least risky option
            return evaluatedStrategies.sort((a, b) => a.riskScore - b.riskScore)[0];
        }

        // Select optimal strategy
        if (preferLowRisk) {
            // Maximize Sortino Ratio (best risk-adjusted return considering downside)
            return viableStrategies.sort((a, b) => b.sortinoRatio - a.sortinoRatio)[0];
        } else {
            // Maximize expected value
            return viableStrategies.sort((a, b) =>
                b.expectedStrokesGained - a.expectedStrokesGained
            )[0];
        }
    }

    /**
     * Generate practice improvement plan that maximizes SG without increasing risk
     *
     * @param {Object} playerStrokesGained - Current player SG profile
     * @param {Object} playerProfile - Player skill profile
     * @returns {Array} Prioritized improvement areas
     */
    static generateImprovementPlan(playerStrokesGained, playerProfile) {
        // Get improvement opportunities
        const opportunities = StrokesGainedCalculator.getImprovementOpportunities(
            playerStrokesGained
        );

        // Enhance with risk analysis
        const riskEnhancedOpportunities = opportunities.map(opp => {
            const category = opp.category;

            // Calculate current risk in this category
            const currentRisk = this.estimateCategoryRisk(category, playerProfile);

            // Calculate potential risk if aggressively pursuing improvement
            const potentialRisk = currentRisk * 1.2; // Aggressive play increases risk

            // Calculate risk-neutral improvement potential
            // (improvement possible without increasing risk)
            const riskNeutralGain = this.calculateRiskNeutralGain(
                category,
                opp.currentPerformance,
                currentRisk,
                playerProfile
            );

            return {
                ...opp,
                currentRisk,
                potentialRisk,
                riskNeutralGain,
                recommendation: this.generateRecommendation(
                    category,
                    opp.currentPerformance,
                    riskNeutralGain
                )
            };
        });

        // Sort by risk-neutral gain (highest first)
        return riskEnhancedOpportunities.sort((a, b) =>
            b.riskNeutralGain - a.riskNeutralGain
        );
    }

    /**
     * Estimate current risk level for a strokes gained category
     */
    static estimateCategoryRisk(category, playerProfile) {
        // Use standard deviation from player profile if available
        if (playerProfile.strokesGainedProfile?.[category]?.stdDev) {
            return playerProfile.strokesGainedProfile[category].stdDev;
        }

        // Default risk estimates by category
        const defaultRisks = {
            offTheTee: 0.5,
            approach: 0.6,
            aroundGreen: 0.4,
            putting: 0.5
        };

        return defaultRisks[category] || 0.5;
    }

    /**
     * Calculate potential improvement without increasing risk
     */
    static calculateRiskNeutralGain(category, currentSG, currentRisk, playerProfile) {
        // Improvement areas that don't increase risk:
        // 1. Consistency improvements (reduce variance)
        // 2. Technical improvements (better fundamentals)
        // 3. Course management (smarter decisions)

        const tourAverage = performanceBenchmarks.tourAverage[category];
        const elite = performanceBenchmarks.elite[category];

        // Technical improvement potential (50% of gap to tour average)
        const technicalGain = Math.max(0, (tourAverage - currentSG) * 0.5);

        // Course management gain (20% of gap to elite)
        const managementGain = (elite - currentSG) * 0.2;

        // Consistency gain (reduce variance without changing mean)
        const consistencyGain = currentRisk * 0.1;

        return technicalGain + managementGain + consistencyGain;
    }

    /**
     * Generate specific recommendation for improvement
     */
    static generateRecommendation(category, currentSG, riskNeutralGain) {
        const recommendations = {
            offTheTee: {
                technical: 'Focus on swing consistency and accuracy over distance',
                management: 'Use clubs that maximize fairways hit percentage',
                practice: 'Practice with alignment aids and track dispersion patterns'
            },
            approach: {
                technical: 'Improve iron striking consistency and distance control',
                management: 'Aim for center of greens rather than pins',
                practice: 'Practice from varied lies and distances with target focus'
            },
            aroundGreen: {
                technical: 'Develop consistent short game technique',
                management: 'Select higher percentage shots around greens',
                practice: 'Practice various short game scenarios with up-and-down goal'
            },
            putting: {
                technical: 'Improve putting stroke consistency and green reading',
                management: 'Focus on lag putting to avoid three-putts',
                practice: 'Practice distance control drills and short putt pressure situations'
            }
        };

        const categoryRecs = recommendations[category] || recommendations.approach;

        return {
            ...categoryRecs,
            potentialGain: riskNeutralGain,
            priority: riskNeutralGain > 0.5 ? 'high' : riskNeutralGain > 0.2 ? 'medium' : 'low'
        };
    }

    /**
     * Calculate optimal risk budget allocation across categories
     *
     * @param {Object} playerProfile - Player profile
     * @param {number} totalRiskBudget - Total acceptable risk (variance)
     * @returns {Object} Optimal risk allocation by category
     */
    static allocateRiskBudget(playerProfile, totalRiskBudget = 2.0) {
        // Allocate risk to maximize total expected strokes gained
        // subject to total risk constraint

        const categories = ['offTheTee', 'approach', 'aroundGreen', 'putting'];

        // Get marginal return per unit of risk for each category
        const marginalReturns = categories.map(category => {
            const currentSG = playerProfile.strokesGainedProfile?.[category]?.average || 0;
            const elite = performanceBenchmarks.elite[category];

            // Potential gain if we increase risk
            const potentialGain = elite - currentSG;

            // Risk efficiency (gain per unit of risk)
            const efficiency = potentialGain / (1 + Math.abs(currentSG));

            return {
                category,
                currentSG,
                potentialGain,
                efficiency
            };
        });

        // Allocate risk proportional to efficiency
        const totalEfficiency = marginalReturns.reduce((sum, mr) => sum + mr.efficiency, 0);

        const allocation = {};
        marginalReturns.forEach(mr => {
            allocation[mr.category] = {
                riskBudget: (mr.efficiency / totalEfficiency) * totalRiskBudget,
                expectedGain: mr.potentialGain * (mr.efficiency / totalEfficiency),
                currentSG: mr.currentSG
            };
        });

        return {
            allocation,
            totalRiskBudget,
            expectedTotalGain: Object.values(allocation).reduce(
                (sum, a) => sum + a.expectedGain, 0
            )
        };
    }
}

export default RiskOptimizer;
