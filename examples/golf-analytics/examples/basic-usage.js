/**
 * Basic Usage Examples for Golf Analytics
 * Demonstrates strokes gained calculations and risk optimization
 */

import { Shot } from '../models/Shot.js';
import { Round, Hole } from '../models/Round.js';
import { Player } from '../models/Player.js';
import StrokesGainedCalculator from '../services/StrokesGainedCalculator.js';
import RiskOptimizer from '../services/RiskOptimizer.js';

// ============================================================================
// Example 1: Calculate Strokes Gained for a Single Shot
// ============================================================================

console.log('=== Example 1: Single Shot Strokes Gained ===\n');

// Create a drive shot: 280 yards from tee, ends up in fairway 180 yards from hole
const driveShot = new Shot({
    shotNumber: 1,
    hole: 1,
    distance: 280,
    startingLocation: 'tee',
    endingLocation: 'fairway',
    club: 'Driver',
    result: 'fairway',
    lateralDistance: 5,
    distanceToPin: 180,
    lie: 8,
    slope: 0,
    wind: 5
});

const driveSG = StrokesGainedCalculator.calculateShotStrokesGained(driveShot);

console.log('Drive shot analysis:');
console.log(`  Starting: 280 yards from hole on tee`);
console.log(`  Ending: 180 yards from hole in fairway`);
console.log(`  Baseline before: ${driveSG.baselineBefore.toFixed(3)} strokes`);
console.log(`  Baseline after: ${driveSG.baselineAfter.toFixed(3)} strokes`);
console.log(`  Strokes Gained: ${driveSG.strokesGained.toFixed(3)}`);
console.log(`  Category: ${driveSG.category}`);
console.log(`  Risk Level: ${driveShot.getRiskLevel()}/10\n`);

// Create an approach shot: 180 yards from fairway to 15 feet from hole on green
const approachShot = new Shot({
    shotNumber: 2,
    hole: 1,
    distance: 180,
    startingLocation: 'fairway',
    endingLocation: 'green',
    club: '6-iron',
    result: 'green',
    lateralDistance: 8,
    distanceToPin: 15, // 15 feet
    lie: 9,
    slope: 0,
    wind: 3
});

const approachSG = StrokesGainedCalculator.calculateShotStrokesGained(approachShot);

console.log('Approach shot analysis:');
console.log(`  Starting: 180 yards from hole in fairway`);
console.log(`  Ending: 15 feet from hole on green`);
console.log(`  Baseline before: ${approachSG.baselineBefore.toFixed(3)} strokes`);
console.log(`  Baseline after: ${approachSG.baselineAfter.toFixed(3)} strokes`);
console.log(`  Strokes Gained: ${approachSG.strokesGained.toFixed(3)}`);
console.log(`  Category: ${approachSG.category}\n`);

// ============================================================================
// Example 2: Calculate Strokes Gained for a Hole
// ============================================================================

console.log('=== Example 2: Full Hole Strokes Gained ===\n');

// Par 4, 380 yards
const hole1 = new Hole({
    number: 1,
    par: 4,
    yardage: 380,
    shots: [
        driveShot,
        approachShot,
        new Shot({
            shotNumber: 3,
            hole: 1,
            distance: 15, // 15 feet
            startingLocation: 'green',
            endingLocation: 'hole',
            club: 'Putter',
            result: 'hole',
            distanceToPin: 0,
            lie: 10
        })
    ],
    score: 3 // Birdie!
});

const holeSG = StrokesGainedCalculator.calculateHoleStrokesGained(hole1);

console.log(`Hole #${hole1.number} (Par ${hole1.par}, ${hole1.yardage} yards)`);
console.log(`Score: ${hole1.score} (${hole1.getScoreToPar() < 0 ? '' : '+'}${hole1.getScoreToPar()})`);
console.log('\nStrokes Gained by Category:');
console.log(`  Off the Tee: ${holeSG.offTheTee.toFixed(3)}`);
console.log(`  Approach: ${holeSG.approach.toFixed(3)}`);
console.log(`  Around Green: ${holeSG.aroundGreen.toFixed(3)}`);
console.log(`  Putting: ${holeSG.putting.toFixed(3)}`);
console.log(`  Total: ${holeSG.total.toFixed(3)}\n`);

// ============================================================================
// Example 3: Risk-Adjusted Shot Selection
// ============================================================================

console.log('=== Example 3: Risk-Adjusted Shot Optimization ===\n');

// Player profile
const playerProfile = {
    skillLevel: 'tourAverage',
    handicap: 0,
    strokesGainedProfile: {
        offTheTee: { average: 0.2, stdDev: 0.5 },
        approach: { average: -0.1, stdDev: 0.6 },
        aroundGreen: { average: 0.1, stdDev: 0.4 },
        putting: { average: 0.0, stdDev: 0.5 }
    }
};

// Current situation: 220 yards from hole in fairway
const situation = {
    distance: 220,
    startingLocation: 'fairway',
    distanceToHole: 220
};

// Strategy options
const strategies = [
    {
        name: 'Aggressive - Go for green with 3-wood',
        club: '3-wood',
        target: 'green'
    },
    {
        name: 'Conservative - Lay up with 7-iron',
        club: '7-iron',
        target: 'fairway'
    },
    {
        name: 'Moderate - 5-iron to front of green',
        club: '5-iron',
        target: 'green'
    }
];

console.log('Situation: 220 yards from hole in fairway');
console.log('Evaluating shot strategies:\n');

strategies.forEach(strategy => {
    const evaluation = RiskOptimizer.calculateExpectedValue(
        strategy,
        playerProfile,
        situation
    );

    console.log(`Strategy: ${strategy.name}`);
    console.log(`  Expected Strokes Gained: ${evaluation.expectedStrokesGained.toFixed(3)}`);
    console.log(`  Risk (Std Dev): ${evaluation.standardDeviation.toFixed(3)}`);
    console.log(`  Downside Risk: ${evaluation.downsideRisk.toFixed(3)}`);
    console.log(`  Sharpe Ratio: ${evaluation.sharpeRatio.toFixed(3)}`);
    console.log(`  Sortino Ratio: ${evaluation.sortinoRatio.toFixed(3)}`);
    console.log(`  Risk Score: ${evaluation.riskScore.toFixed(1)}/10\n`);
});

// Find optimal strategy
const optimalStrategy = RiskOptimizer.optimizeStrategy(
    strategies,
    playerProfile,
    situation,
    { maxRisk: 6, preferLowRisk: true }
);

console.log('=== OPTIMAL STRATEGY ===');
console.log(`Recommended: ${optimalStrategy.strategy.name}`);
console.log(`Expected SG: ${optimalStrategy.expectedStrokesGained.toFixed(3)}`);
console.log(`Risk-Adjusted Score (Sortino): ${optimalStrategy.sortinoRatio.toFixed(3)}\n`);

// ============================================================================
// Example 4: Player Performance Analysis and Improvement Plan
// ============================================================================

console.log('=== Example 4: Performance Analysis & Improvement Plan ===\n');

const player = new Player({
    id: 'player-001',
    name: 'John Doe',
    handicap: 2
});

// Simulate player's strokes gained profile
const playerStrokesGained = {
    offTheTee: 0.3,
    approach: -0.4, // Weak area
    aroundGreen: 0.1,
    putting: -0.2, // Another weak area
    total: -0.2
};

console.log('Current Performance:');
console.log(`  Off the Tee: ${playerStrokesGained.offTheTee > 0 ? '+' : ''}${playerStrokesGained.offTheTee.toFixed(2)}`);
console.log(`  Approach: ${playerStrokesGained.approach > 0 ? '+' : ''}${playerStrokesGained.approach.toFixed(2)}`);
console.log(`  Around Green: ${playerStrokesGained.aroundGreen > 0 ? '+' : ''}${playerStrokesGained.aroundGreen.toFixed(2)}`);
console.log(`  Putting: ${playerStrokesGained.putting > 0 ? '+' : ''}${playerStrokesGained.putting.toFixed(2)}`);
console.log(`  Total: ${playerStrokesGained.total > 0 ? '+' : ''}${playerStrokesGained.total.toFixed(2)}\n`);

// Compare to benchmarks
const comparison = StrokesGainedCalculator.compareToBenchmarks(playerStrokesGained);

console.log('Comparison to Benchmarks:');
Object.keys(comparison).forEach(category => {
    const comp = comparison[category];
    if (comp.elite) {
        console.log(`\n${category}:`);
        console.log(`  vs Tour Average: ${comp.tourAverage.delta > 0 ? '+' : ''}${comp.tourAverage.delta.toFixed(2)}`);
        console.log(`  vs Elite: ${comp.elite.delta > 0 ? '+' : ''}${comp.elite.delta.toFixed(2)}`);
    }
});

console.log('\n');

// Generate improvement plan
const improvementPlan = RiskOptimizer.generateImprovementPlan(
    playerStrokesGained,
    playerProfile
);

console.log('=== PRIORITIZED IMPROVEMENT PLAN ===\n');

improvementPlan.forEach((item, index) => {
    console.log(`${index + 1}. ${item.category.toUpperCase()}`);
    console.log(`   Current Performance: ${item.currentPerformance.toFixed(2)}`);
    console.log(`   Risk-Neutral Gain Potential: ${item.riskNeutralGain.toFixed(2)} strokes/round`);
    console.log(`   Current Risk: ${item.currentRisk.toFixed(2)}`);
    console.log(`   Priority: ${item.recommendation.priority.toUpperCase()}`);
    console.log(`   Technical Focus: ${item.recommendation.technical}`);
    console.log(`   Course Management: ${item.recommendation.management}`);
    console.log(`   Practice Plan: ${item.recommendation.practice}\n`);
});

// ============================================================================
// Example 5: Risk Budget Allocation
// ============================================================================

console.log('=== Example 5: Optimal Risk Budget Allocation ===\n');

const riskAllocation = RiskOptimizer.allocateRiskBudget(playerProfile, 2.0);

console.log(`Total Risk Budget: ${riskAllocation.totalRiskBudget.toFixed(2)}`);
console.log(`Expected Total Gain: ${riskAllocation.expectedTotalGain.toFixed(2)} strokes/round\n`);

console.log('Recommended Risk Allocation by Category:');
Object.keys(riskAllocation.allocation).forEach(category => {
    const alloc = riskAllocation.allocation[category];
    console.log(`\n${category}:`);
    console.log(`  Risk Budget: ${alloc.riskBudget.toFixed(2)}`);
    console.log(`  Expected Gain: ${alloc.expectedGain.toFixed(2)} strokes/round`);
    console.log(`  Current SG: ${alloc.currentSG.toFixed(2)}`);
});

console.log('\n=== END OF EXAMPLES ===');
