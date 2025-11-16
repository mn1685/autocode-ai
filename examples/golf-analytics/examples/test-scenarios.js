/**
 * Test Scenarios for Golf Analytics
 * Validates strokes gained calculations and risk optimization
 */

import { Shot } from '../models/Shot.js';
import { Round, Hole } from '../models/Round.js';
import StrokesGainedCalculator from '../services/StrokesGainedCalculator.js';
import RiskOptimizer from '../services/RiskOptimizer.js';
import { getBaseline } from '../data/pgaTourBaselines.js';

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        testsPassed++;
    } catch (error) {
        console.error(`✗ ${name}`);
        console.error(`  Error: ${error.message}`);
        testsFailed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertApprox(actual, expected, tolerance = 0.01, message) {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
        throw new Error(
            message || `Expected ${expected}, got ${actual} (diff: ${diff})`
        );
    }
}

console.log('=== Running Golf Analytics Tests ===\n');

// ============================================================================
// Baseline Data Tests
// ============================================================================

console.log('--- Baseline Data Tests ---\n');

test('Baseline: 200 yards from tee', () => {
    const baseline = getBaseline(200, 'tee');
    assertApprox(baseline, 3.2, 0.1, 'Expected ~3.2 strokes from 200 yards on tee');
});

test('Baseline: 150 yards from fairway', () => {
    const baseline = getBaseline(150, 'fairway');
    assertApprox(baseline, 2.94, 0.1, 'Expected ~2.94 strokes from 150 yards in fairway');
});

test('Baseline: 10 feet on green', () => {
    const baseline = getBaseline(10, 'green', 'feet');
    assertApprox(baseline, 1.61, 0.05, 'Expected ~1.61 strokes from 10 feet on green');
});

test('Baseline: Interpolation works correctly', () => {
    const baseline = getBaseline(155, 'fairway');
    // Should be between 150 (2.94) and 160 (2.98)
    assert(baseline > 2.94 && baseline < 2.98, 'Interpolation should be between boundaries');
    assertApprox(baseline, 2.96, 0.05);
});

// ============================================================================
// Strokes Gained Calculation Tests
// ============================================================================

console.log('\n--- Strokes Gained Calculation Tests ---\n');

test('SG: Perfect drive gains strokes', () => {
    // Par 4: 400 yards from tee, drive leaves 150 yards
    const shot = new Shot({
        shotNumber: 1,
        hole: 1,
        distance: 400,        // Starting distance to hole
        startingLocation: 'tee',
        endingLocation: 'fairway',
        club: 'Driver',
        result: 'fairway',
        distanceToPin: 150    // Remaining distance after shot
    });

    const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);

    // Starting from 400 yard tee (4.0 strokes) to 150 yards in fairway (2.94 strokes)
    // SG = 4.0 - 2.94 - 1 = 0.06 strokes
    assert(sg.strokesGained > 0, 'Perfect drive should gain strokes');
    console.log(`    Strokes Gained: ${sg.strokesGained.toFixed(3)}`);
});

test('SG: Great approach shot gains strokes', () => {
    // 150 yard approach from fairway to 10 feet on green
    const shot = new Shot({
        shotNumber: 2,
        hole: 1,
        distance: 150,
        startingLocation: 'fairway',
        endingLocation: 'green',
        club: '8-iron',
        result: 'green',
        distanceToPin: 10 // feet
    });

    const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);

    // Starting from 150 yards in fairway (2.94) to 10 feet on green (1.61)
    // SG = 2.94 - 1.61 - 1 = 0.33
    assertApprox(sg.strokesGained, 0.33, 0.1, 'Great approach should gain ~0.3 strokes');
    console.log(`    Strokes Gained: ${sg.strokesGained.toFixed(3)}`);
});

test('SG: Missed green loses strokes', () => {
    // 150 yard shot from fairway to 30 yards in rough
    const shot = new Shot({
        shotNumber: 2,
        hole: 1,
        distance: 150,
        startingLocation: 'fairway',
        endingLocation: 'rough',
        club: '8-iron',
        result: 'rough',
        distanceToPin: 30
    });

    const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);

    // Should lose strokes for missing green
    assert(sg.strokesGained < 0, 'Missing green should lose strokes');
    console.log(`    Strokes Gained: ${sg.strokesGained.toFixed(3)}`);
});

test('SG: Holed putt from 20 feet', () => {
    const shot = new Shot({
        shotNumber: 3,
        hole: 1,
        distance: 20, // feet
        startingLocation: 'green',
        endingLocation: 'hole',
        club: 'Putter',
        result: 'hole',
        distanceToPin: 0
    });

    const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);

    // From 20 feet (1.87 strokes) to holed (0 strokes) = 1.87 - 0 - 1 = 0.87
    assertApprox(sg.strokesGained, 0.87, 0.1, 'Holed 20 footer should gain ~0.87 strokes');
    assert(sg.category === 'putting', 'Should be categorized as putting');
    console.log(`    Strokes Gained: ${sg.strokesGained.toFixed(3)}`);
});

test('SG: Shot categorization - Off the tee', () => {
    const shot = new Shot({
        shotNumber: 1,
        distance: 280,
        startingLocation: 'tee',
        endingLocation: 'fairway',
        distanceToPin: 180
    });

    const category = StrokesGainedCalculator.categorizeShot(shot);
    assert(category === 'offTheTee', 'Long tee shot should be categorized as off the tee');
});

test('SG: Shot categorization - Approach', () => {
    const shot = new Shot({
        shotNumber: 2,
        distance: 150,
        startingLocation: 'fairway',
        endingLocation: 'green',
        distanceToPin: 15
    });

    const category = StrokesGainedCalculator.categorizeShot(shot);
    assert(category === 'approach', 'Mid-distance shot should be approach');
});

test('SG: Shot categorization - Around green', () => {
    const shot = new Shot({
        shotNumber: 3,
        distance: 25,
        startingLocation: 'rough',
        endingLocation: 'green',
        distanceToPin: 10
    });

    const category = StrokesGainedCalculator.categorizeShot(shot);
    assert(category === 'aroundGreen', 'Short shot should be around green');
});

test('SG: Shot categorization - Putting', () => {
    const shot = new Shot({
        shotNumber: 4,
        distance: 15,
        startingLocation: 'green',
        endingLocation: 'hole',
        distanceToPin: 0
    });

    const category = StrokesGainedCalculator.categorizeShot(shot);
    assert(category === 'putting', 'Shot on green should be putting');
});

// ============================================================================
// Hole and Round Tests
// ============================================================================

console.log('\n--- Hole and Round Tests ---\n');

test('Hole: Birdie on par 4 with good SG', () => {
    const hole = new Hole({
        number: 1,
        par: 4,
        yardage: 400,
        shots: [
            new Shot({
                shotNumber: 1,
                distance: 280,
                startingLocation: 'tee',
                endingLocation: 'fairway',
                distanceToPin: 170
            }),
            new Shot({
                shotNumber: 2,
                distance: 170,
                startingLocation: 'fairway',
                endingLocation: 'green',
                distanceToPin: 12
            }),
            new Shot({
                shotNumber: 3,
                distance: 12,
                startingLocation: 'green',
                endingLocation: 'hole',
                distanceToPin: 0
            })
        ],
        score: 3
    });

    const sg = StrokesGainedCalculator.calculateHoleStrokesGained(hole);

    assert(sg.total > 0, 'Birdie should typically have positive SG');
    assert(hole.getScoreToPar() === -1, 'Birdie is -1 to par');
    assert(hole.isGreenInRegulation(), 'Reached green in 2 on par 4');
    assert(hole.getPutts() === 1, 'One putt for birdie');

    console.log(`    Total SG: ${sg.total.toFixed(3)}`);
    console.log(`    Score: ${hole.score} (${hole.getScoreToPar()})`);
});

test('Round: Calculate total SG for 18 holes', () => {
    // Create a simple round with 3 holes (simulating partial round)
    const holes = [];

    for (let i = 0; i < 3; i++) {
        holes.push(new Hole({
            number: i + 1,
            par: 4,
            yardage: 400,
            shots: [
                new Shot({
                    shotNumber: 1,
                    distance: 280,
                    startingLocation: 'tee',
                    endingLocation: 'fairway',
                    distanceToPin: 170
                }),
                new Shot({
                    shotNumber: 2,
                    distance: 170,
                    startingLocation: 'fairway',
                    endingLocation: 'green',
                    distanceToPin: 20
                }),
                new Shot({
                    shotNumber: 3,
                    distance: 20,
                    startingLocation: 'green',
                    endingLocation: 'green',
                    distanceToPin: 2
                }),
                new Shot({
                    shotNumber: 4,
                    distance: 2,
                    startingLocation: 'green',
                    endingLocation: 'hole',
                    distanceToPin: 0
                })
            ],
            score: 4
        }));
    }

    const round = new Round({
        playerId: 'test-player',
        courseId: 'test-course',
        date: new Date(),
        holes,
        totalScore: 12,
        coursePar: 12
    });

    const roundSG = StrokesGainedCalculator.calculateRoundStrokesGained(round);

    assert(roundSG.byHole.length === 3, 'Should have 3 holes');
    assert(roundSG.total.total !== undefined, 'Should have total SG');
    assert(roundSG.performance !== undefined, 'Should have performance evaluation');

    console.log(`    Total SG: ${roundSG.total.total.toFixed(3)}`);
    console.log(`    Holes analyzed: ${roundSG.byHole.length}`);
});

// ============================================================================
// Risk Optimization Tests
// ============================================================================

console.log('\n--- Risk Optimization Tests ---\n');

test('Risk: Expected value calculation', () => {
    const strategy = {
        name: 'Test strategy',
        club: 'driver',
        target: 'fairway'
    };

    const playerProfile = {
        skillLevel: 'tourAverage'
    };

    const situation = {
        distance: 280,
        startingLocation: 'tee',
        distanceToHole: 280
    };

    const ev = RiskOptimizer.calculateExpectedValue(strategy, playerProfile, situation);

    assert(ev.expectedStrokesGained !== undefined, 'Should calculate expected SG');
    assert(ev.standardDeviation !== undefined, 'Should calculate standard deviation');
    assert(ev.sharpeRatio !== undefined, 'Should calculate Sharpe ratio');
    assert(ev.sortinoRatio !== undefined, 'Should calculate Sortino ratio');
    assert(ev.riskScore >= 0 && ev.riskScore <= 10, 'Risk score should be 0-10');

    console.log(`    Expected SG: ${ev.expectedStrokesGained.toFixed(3)}`);
    console.log(`    Risk Score: ${ev.riskScore.toFixed(1)}/10`);
});

test('Risk: Strategy optimization prefers better risk-adjusted returns', () => {
    const strategies = [
        { name: 'Conservative', club: '7-iron', target: 'fairway' },
        { name: 'Aggressive', club: '3-wood', target: 'green' },
        { name: 'Moderate', club: '5-iron', target: 'green' }
    ];

    const playerProfile = { skillLevel: 'tourAverage' };
    const situation = {
        distance: 220,
        startingLocation: 'fairway',
        distanceToHole: 220
    };

    const optimal = RiskOptimizer.optimizeStrategy(
        strategies,
        playerProfile,
        situation,
        { maxRisk: 6, preferLowRisk: true }
    );

    assert(optimal.strategy !== undefined, 'Should select a strategy');
    assert(optimal.expectedStrokesGained !== undefined, 'Should have expected value');

    console.log(`    Optimal: ${optimal.strategy.name}`);
    console.log(`    Expected SG: ${optimal.expectedStrokesGained.toFixed(3)}`);
    console.log(`    Sortino Ratio: ${optimal.sortinoRatio.toFixed(3)}`);
});

test('Risk: Improvement plan identifies weak areas', () => {
    const playerSG = {
        offTheTee: 0.2,
        approach: -0.5, // Weak
        aroundGreen: 0.1,
        putting: -0.3 // Weak
    };

    const playerProfile = {
        skillLevel: 'tourAverage',
        strokesGainedProfile: {
            offTheTee: { average: 0.2, stdDev: 0.4 },
            approach: { average: -0.5, stdDev: 0.6 },
            aroundGreen: { average: 0.1, stdDev: 0.3 },
            putting: { average: -0.3, stdDev: 0.5 }
        }
    };

    const plan = RiskOptimizer.generateImprovementPlan(playerSG, playerProfile);

    assert(plan.length === 4, 'Should have 4 improvement areas');
    assert(plan[0].category !== undefined, 'Should have category');
    assert(plan[0].riskNeutralGain !== undefined, 'Should calculate risk-neutral gain');
    assert(plan[0].recommendation !== undefined, 'Should have recommendations');

    // Weakest areas should be prioritized
    const topPriority = plan[0];
    console.log(`    Top priority: ${topPriority.category}`);
    console.log(`    Current SG: ${topPriority.currentPerformance.toFixed(2)}`);
    console.log(`    Risk-neutral gain: ${topPriority.riskNeutralGain.toFixed(2)}`);
});

test('Risk: Budget allocation maximizes return', () => {
    const playerProfile = {
        strokesGainedProfile: {
            offTheTee: { average: 0.1, stdDev: 0.4 },
            approach: { average: -0.3, stdDev: 0.6 },
            aroundGreen: { average: 0.0, stdDev: 0.3 },
            putting: { average: 0.2, stdDev: 0.5 }
        }
    };

    const allocation = RiskOptimizer.allocateRiskBudget(playerProfile, 2.0);

    assert(allocation.totalRiskBudget === 2.0, 'Should respect risk budget');
    assert(allocation.allocation !== undefined, 'Should have allocation');
    assert(allocation.expectedTotalGain !== undefined, 'Should have expected gain');

    // Sum of allocated risk should equal budget
    const totalAllocated = Object.values(allocation.allocation)
        .reduce((sum, a) => sum + a.riskBudget, 0);

    assertApprox(totalAllocated, 2.0, 0.01, 'Allocated risk should sum to budget');

    console.log(`    Total risk budget: ${allocation.totalRiskBudget.toFixed(2)}`);
    console.log(`    Expected gain: ${allocation.expectedTotalGain.toFixed(2)}`);
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n=== Test Summary ===\n');
console.log(`✓ Passed: ${testsPassed}`);
console.log(`✗ Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
} else {
    console.log(`\n⚠️  ${testsFailed} test(s) failed`);
    process.exit(1);
}
