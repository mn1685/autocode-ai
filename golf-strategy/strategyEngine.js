import { playerProfiles, weatherConditions } from './golfCourseData.js';

export class GolfStrategyEngine {
    constructor(playerProfile, weather = 'calm') {
        this.player = playerProfiles[playerProfile] || playerProfiles.midHandicap;
        this.weather = weatherConditions[weather] || weatherConditions.calm;
    }

    /**
     * Calculate optimal strategy for a specific hole
     */
    analyzeHole(hole) {
        const strategy = {
            holeNumber: hole.number,
            par: hole.par,
            distance: hole.distance,
            playerLevel: this.player.level,
            weatherImpact: this.weather.impact,
            teeShot: this.calculateTeeShot(hole),
            approach: this.calculateApproach(hole),
            hazardManagement: this.analyzeHazards(hole),
            greenStrategy: this.analyzeGreen(hole),
            expectedScore: this.calculateExpectedScore(hole),
            riskAssessment: this.assessRisk(hole),
            clubRecommendations: this.recommendClubs(hole)
        };

        return strategy;
    }

    /**
     * Calculate tee shot strategy
     */
    calculateTeeShot(hole) {
        const adjustedDistance = this.adjustForWeather(this.player.drivingDistance);
        const safetyMargin = this.player.riskTolerance === 'conservative' ? 20 : 10;

        let club = 'Driver';
        let targetLine = 'center';
        let layupDistance = null;

        // Analyze hazards and adjust strategy
        if (hole.hazards.some(h => h.includes('water') || h.includes('ocean'))) {
            if (this.player.riskTolerance === 'conservative') {
                club = '3-wood or hybrid';
                targetLine = 'safe side away from water';
            } else {
                targetLine = 'aggressive line close to hazard';
            }
        }

        // Par 3 strategy
        if (hole.par === 3) {
            club = this.selectIronForDistance(hole.distance);
            targetLine = this.analyzeWindImpact(hole);
        }

        // Long par 4/5 - consider layup
        if (hole.distance > adjustedDistance * 1.5 && hole.par >= 4) {
            layupDistance = adjustedDistance - safetyMargin;
        }

        return {
            club,
            targetLine,
            expectedDistance: adjustedDistance,
            layupDistance,
            confidence: this.calculateConfidence(hole)
        };
    }

    /**
     * Calculate approach shot strategy
     */
    calculateApproach(hole) {
        let strategy = 'aggressive';
        let targetArea = 'pin';

        // Adjust based on green characteristics
        if (hole.green.slope === 'severe') {
            targetArea = 'center of green';
            strategy = 'conservative';
        }

        // Adjust based on hazards
        if (hole.hazards.some(h => h.includes('bunker') || h.includes('water'))) {
            if (this.player.riskTolerance === 'conservative') {
                targetArea = 'fat part of green';
                strategy = 'very conservative';
            }
        }

        // GIR probability affects strategy
        const girProbability = this.calculateGIRProbability(hole);

        return {
            strategy,
            targetArea,
            girProbability: `${girProbability}%`,
            recommendedApproach: this.getApproachAdvice(hole)
        };
    }

    /**
     * Analyze hazards and provide management strategy
     */
    analyzeHazards(hole) {
        const hazardStrategies = [];

        hole.hazards.forEach(hazard => {
            let strategy = '';
            let severity = 'medium';

            if (hazard.includes('water') || hazard.includes('ocean')) {
                severity = 'high';
                strategy = 'Avoid at all costs - aim away and accept longer approach';
            } else if (hazard.includes('bunker')) {
                severity = this.player.sandSaves > 40 ? 'low' : 'medium';
                strategy = this.player.sandSaves > 40
                    ? 'Can play aggressive - good bunker play'
                    : 'Avoid bunkers - limited sand game';
            } else if (hazard.includes('rough')) {
                severity = 'low';
                strategy = 'Acceptable miss - maintain scoring opportunity';
            } else if (hazard.includes('trees')) {
                severity = 'medium';
                strategy = 'Avoid - limited recovery options';
            }

            hazardStrategies.push({ hazard, severity, strategy });
        });

        return hazardStrategies;
    }

    /**
     * Analyze green and putting strategy
     */
    analyzeGreen(hole) {
        const green = hole.green;
        let readingDifficulty = 'moderate';
        let targetZone = 'center';

        if (green.speed >= 13) {
            readingDifficulty = 'very difficult';
        } else if (green.speed <= 10) {
            readingDifficulty = 'easier';
        }

        if (green.slope === 'severe') {
            targetZone = 'below hole if possible';
        }

        return {
            size: green.size,
            speed: green.speed,
            slope: green.slope,
            readingDifficulty,
            targetZone,
            averagePutts: this.estimatePutts(green)
        };
    }

    /**
     * Calculate expected score for the hole
     */
    calculateExpectedScore(hole) {
        let baseScore = hole.par;

        // Adjust based on player skill
        if (this.player.greensInRegulation > 70) {
            baseScore -= 0.2;
        } else if (this.player.greensInRegulation < 40) {
            baseScore += 0.5;
        }

        // Adjust for hazards
        const hazardPenalty = hole.hazards.length * 0.1;
        baseScore += hazardPenalty;

        // Adjust for weather
        if (this.weather.windSpeed > 20) {
            baseScore += 0.3;
        }

        // Round to nearest 0.5
        return Math.round(baseScore * 2) / 2;
    }

    /**
     * Assess risk level of the hole
     */
    assessRisk(hole) {
        let riskScore = 0;

        // Hazard risk
        riskScore += hole.hazards.filter(h => h.includes('water') || h.includes('ocean')).length * 3;
        riskScore += hole.hazards.filter(h => h.includes('bunker')).length * 1;

        // Green difficulty
        if (hole.green.slope === 'severe') riskScore += 2;
        if (hole.green.speed >= 13) riskScore += 2;

        // Weather impact
        if (this.weather.windSpeed > 20) riskScore += 2;

        const riskLevel = riskScore > 7 ? 'HIGH' : riskScore > 4 ? 'MEDIUM' : 'LOW';

        return {
            level: riskLevel,
            score: riskScore,
            recommendation: this.getRiskRecommendation(riskLevel)
        };
    }

    /**
     * Recommend clubs for the hole
     */
    recommendClubs(hole) {
        const clubs = [];

        // Tee shot
        if (hole.par === 3) {
            clubs.push({
                shot: 'Tee',
                club: this.selectIronForDistance(hole.distance),
                distance: hole.distance
            });
        } else {
            clubs.push({
                shot: 'Tee',
                club: 'Driver',
                distance: this.player.drivingDistance
            });

            // Approach
            const remainingDistance = hole.distance - this.player.drivingDistance;
            clubs.push({
                shot: 'Approach',
                club: this.selectIronForDistance(remainingDistance),
                distance: remainingDistance
            });
        }

        return clubs;
    }

    // Helper methods

    adjustForWeather(distance) {
        const windFactor = this.weather.windSpeed / 10;
        return Math.round(distance * (1 - windFactor * 0.05));
    }

    selectIronForDistance(distance) {
        const adjustedDistance = this.adjustForWeather(distance);

        if (adjustedDistance <= 100) return 'Pitching Wedge';
        if (adjustedDistance <= 120) return '9-iron';
        if (adjustedDistance <= 140) return '8-iron';
        if (adjustedDistance <= 155) return '7-iron';
        if (adjustedDistance <= 170) return '6-iron';
        if (adjustedDistance <= 185) return '5-iron';
        if (adjustedDistance <= 200) return '4-iron/Hybrid';
        if (adjustedDistance <= 220) return '3-iron/Hybrid';
        return '3-wood';
    }

    analyzeWindImpact(hole) {
        if (!hole.wind || this.weather.windSpeed < 10) {
            return 'aim at target';
        }

        if (this.weather.windSpeed > 20) {
            return 'aim significantly into wind, allow for 2-3 club adjustment';
        }

        return 'aim slightly into wind, allow for 1-2 club adjustment';
    }

    calculateConfidence(hole) {
        let confidence = this.player.drivingAccuracy;

        if (hole.hazards.length > 2) confidence -= 15;
        if (this.weather.windSpeed > 15) confidence -= 10;

        return Math.max(20, Math.min(95, confidence));
    }

    calculateGIRProbability(hole) {
        let probability = this.player.greensInRegulation;

        if (hole.green.size === 'small') probability -= 10;
        if (hole.green.size === 'large') probability += 5;
        if (this.weather.windSpeed > 15) probability -= 10;

        return Math.max(10, Math.min(90, probability));
    }

    getApproachAdvice(hole) {
        if (this.player.greensInRegulation > 65) {
            return 'Attack pins on easier holes, play center on difficult ones';
        } else {
            return 'Always aim for center of green, avoid hazards at all costs';
        }
    }

    estimatePutts(green) {
        let putts = this.player.puttingAverage;

        if (green.speed >= 13) putts += 0.2;
        if (green.slope === 'severe') putts += 0.3;

        return Math.round(putts * 10) / 10;
    }

    getRiskRecommendation(riskLevel) {
        switch (riskLevel) {
            case 'HIGH':
                return 'Play conservative - minimize mistakes over aggressive play';
            case 'MEDIUM':
                return 'Calculated risk - aggressive when in position';
            case 'LOW':
                return 'Scoring opportunity - be aggressive';
            default:
                return 'Standard approach';
        }
    }

    /**
     * Generate complete course strategy
     */
    generateCourseStrategy(course) {
        const holeStrategies = course.holes.map(hole => this.analyzeHole(hole));

        const totalExpectedScore = holeStrategies.reduce((sum, h) => sum + h.expectedScore, 0);
        const avgGIR = holeStrategies.reduce((sum, h) => sum + parseFloat(h.approach.girProbability), 0) / holeStrategies.length;

        return {
            courseName: course.name,
            location: course.location,
            par: course.par,
            playerProfile: this.player.level,
            weatherConditions: this.weather.impact,
            expectedScore: Math.round(totalExpectedScore),
            expectedOverUnder: Math.round(totalExpectedScore - course.par),
            averageGIR: `${Math.round(avgGIR)}%`,
            holeByHoleStrategy: holeStrategies,
            keyHoles: this.identifyKeyHoles(holeStrategies),
            overallGamePlan: this.generateGamePlan(course, holeStrategies)
        };
    }

    identifyKeyHoles(holeStrategies) {
        const scoringOpportunities = holeStrategies
            .filter(h => h.riskAssessment.level === 'LOW')
            .map(h => ({ hole: h.holeNumber, reason: 'Scoring opportunity' }));

        const dangerHoles = holeStrategies
            .filter(h => h.riskAssessment.level === 'HIGH')
            .map(h => ({ hole: h.holeNumber, reason: 'High risk - play conservative' }));

        return { scoringOpportunities, dangerHoles };
    }

    generateGamePlan(course, holeStrategies) {
        const plan = [];

        plan.push(`Playing as ${this.player.level} in ${this.weather.impact} conditions`);
        plan.push(`Course management: ${this.player.riskTolerance} approach`);

        const highRiskHoles = holeStrategies.filter(h => h.riskAssessment.level === 'HIGH').length;
        if (highRiskHoles > 0) {
            plan.push(`${highRiskHoles} high-risk holes - focus on bogey avoidance`);
        }

        const lowRiskHoles = holeStrategies.filter(h => h.riskAssessment.level === 'LOW').length;
        if (lowRiskHoles > 0) {
            plan.push(`${lowRiskHoles} scoring opportunities - be aggressive when in position`);
        }

        plan.push('Key strategy: Stay in play, avoid big numbers, capitalize on par 5s');

        return plan;
    }
}
