#!/usr/bin/env node

/**
 * Golf Analytics - Quick Demo Video
 * Automatically demonstrates all features with realistic scenarios
 */

import { Shot } from './models/Shot.js';
import { Hole } from './models/Round.js';
import StrokesGainedCalculator from './services/StrokesGainedCalculator.js';
import RiskOptimizer from './services/RiskOptimizer.js';

// Helper to pause between demos
function pause(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearScreen() {
    console.clear();
}

function displayHeader() {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║     🏌️  GOLF ANALYTICS - Interactive Demo Video              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
}

function typewriter(text, speed = 30) {
    return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
            process.stdout.write(text[i]);
            i++;
            if (i === text.length) {
                clearInterval(interval);
                console.log('');
                resolve();
            }
        }, speed);
    });
}

async function demo1SingleShot() {
    clearScreen();
    displayHeader();
    console.log('═══ DEMO 1: SINGLE SHOT ANALYSIS ═══\n');

    await typewriter('Scenario: Tiger Woods hits a perfect approach shot...');
    await pause(500);

    console.log('\n📍 Shot Details:');
    console.log('  Starting: Fairway, 165 yards to hole');
    console.log('  Club: 7-iron');
    console.log('  Result: Green, 8 feet from pin\n');

    await pause(1000);

    const shot = new Shot({
        shotNumber: 2,
        hole: 10,
        distance: 165,
        startingLocation: 'fairway',
        endingLocation: 'green',
        club: '7-iron',
        result: 'green',
        distanceToPin: 8,
        lie: 9
    });

    const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);

    console.log('═'.repeat(64));
    console.log('📊 ANALYSIS RESULTS');
    console.log('═'.repeat(64) + '\n');

    console.log(`Baseline Before Shot: ${sg.baselineBefore.toFixed(3)} strokes`);
    console.log(`Baseline After Shot:  ${sg.baselineAfter.toFixed(3)} strokes`);

    const sgText = sg.strokesGained >= 0 ? `+${sg.strokesGained.toFixed(3)}` : sg.strokesGained.toFixed(3);
    console.log(`\n🟢 STROKES GAINED: ${sgText}`);
    console.log('   ⭐ EXCELLENT shot! Well above tour average.\n');
    console.log(`Category: ${sg.category.toUpperCase()}`);
    console.log(`Risk Level: ${shot.getRiskLevel().toFixed(1)}/10 (Low)\n`);
}

async function demo2StrategyComparison() {
    clearScreen();
    displayHeader();
    console.log('═══ DEMO 2: SHOT STRATEGY COMPARISON ═══\n');

    await typewriter('Scenario: Phil Mickelson faces a risky decision...');
    await pause(500);

    console.log('\n📍 Current Situation:');
    console.log('  Distance: 235 yards to hole');
    console.log('  Location: Fairway');
    console.log('  Water hazard in front of green');
    console.log('  Skill Level: Elite (Top 10%)\n');

    await pause(1500);

    const playerProfile = { skillLevel: 'elite' };
    const situation = {
        distance: 235,
        startingLocation: 'fairway',
        distanceToHole: 235
    };

    const strategies = [
        { name: 'Aggressive - 3-wood over water', club: '3-wood', target: 'green' },
        { name: 'Conservative - 8-iron layup', club: '8-iron', target: 'fairway' },
        { name: 'Moderate - Hybrid to front edge', club: 'Hybrid', target: 'green' }
    ];

    console.log('Evaluating 3 Shot Strategies:\n');

    const evaluations = [];

    for (const strategy of strategies) {
        const evaluation = RiskOptimizer.calculateExpectedValue(strategy, playerProfile, situation);
        evaluations.push({ strategy, ...evaluation });

        console.log(`${strategy.name}`);
        console.log(`  Expected SG: ${evaluation.expectedStrokesGained >= 0 ? '+' : ''}${evaluation.expectedStrokesGained.toFixed(3)}`);
        console.log(`  Risk Score: ${evaluation.riskScore.toFixed(1)}/10`);
        console.log(`  Sortino Ratio: ${evaluation.sortinoRatio.toFixed(3)} ${evaluation.sortinoRatio > 1 ? '✅' : ''}\n`);

        await pause(800);
    }

    const optimal = RiskOptimizer.optimizeStrategy(strategies, playerProfile, situation, {
        maxRisk: 6,
        preferLowRisk: true
    });

    console.log('═'.repeat(64));
    console.log('🎯 RECOMMENDED STRATEGY');
    console.log('═'.repeat(64) + '\n');
    console.log(`✨ ${optimal.strategy.name}`);
    console.log(`\nExpected Strokes Gained: ${optimal.expectedStrokesGained >= 0 ? '+' : ''}${optimal.expectedStrokesGained.toFixed(3)}`);
    console.log(`Risk-Adjusted Score: ${optimal.sortinoRatio.toFixed(3)}`);
    console.log('\n💡 This strategy maximizes return while minimizing downside risk.\n');
}

async function demo3CompleteHole() {
    clearScreen();
    displayHeader();
    console.log('═══ DEMO 3: COMPLETE HOLE ANALYSIS ═══\n');

    await typewriter('Scenario: Rory McIlroy makes birdie on a tough par 4...');
    await pause(500);

    console.log('\n🏌️ Hole #17 - Par 4, 425 yards\n');

    await pause(1000);

    const shots = [
        new Shot({
            shotNumber: 1,
            hole: 17,
            distance: 425,
            startingLocation: 'tee',
            endingLocation: 'fairway',
            club: 'Driver',
            result: 'fairway',
            distanceToPin: 155,
            lie: 8
        }),
        new Shot({
            shotNumber: 2,
            hole: 17,
            distance: 155,
            startingLocation: 'fairway',
            endingLocation: 'green',
            club: '8-iron',
            result: 'green',
            distanceToPin: 12,
            lie: 9
        }),
        new Shot({
            shotNumber: 3,
            hole: 17,
            distance: 12,
            startingLocation: 'green',
            endingLocation: 'hole',
            club: 'Putter',
            result: 'hole',
            distanceToPin: 0,
            lie: 10
        })
    ];

    console.log('Shot 1: Driver (425 yards)');
    console.log('  Tee → Fairway, 155 yards remaining');
    await pause(800);

    console.log('\nShot 2: 8-iron (155 yards)');
    console.log('  Fairway → Green, 12 feet from hole');
    await pause(800);

    console.log('\nShot 3: Putter (12 feet)');
    console.log('  Green → HOLE! ⛳');
    await pause(1000);

    const hole = new Hole({
        number: 17,
        par: 4,
        yardage: 425,
        shots,
        score: 3
    });

    const holeSG = StrokesGainedCalculator.calculateHoleStrokesGained(hole);

    console.log('\n' + '═'.repeat(64));
    console.log('📊 HOLE ANALYSIS');
    console.log('═'.repeat(64) + '\n');

    console.log('Score: 3 (-1)');
    console.log('🐦 Birdie!\n');

    console.log('Strokes Gained by Category:');
    console.log(`  Off the Tee:    ${holeSG.offTheTee >= 0 ? '+' : ''}${holeSG.offTheTee.toFixed(3)}`);
    console.log(`  Approach:       ${holeSG.approach >= 0 ? '+' : ''}${holeSG.approach.toFixed(3)}`);
    console.log(`  Putting:        ${holeSG.putting >= 0 ? '+' : ''}${holeSG.putting.toFixed(3)}`);
    console.log(`  ${'─'.repeat(30)}`);
    console.log(`  TOTAL:          ${holeSG.total >= 0 ? '+' : ''}${holeSG.total.toFixed(3)} 🟢\n`);

    console.log(`Green in Regulation: ${hole.isGreenInRegulation() ? '✅ Yes' : '❌ No'}`);
    console.log(`Putts: ${hole.getPutts()}\n`);
}

async function demo4PlayerAnalysis() {
    clearScreen();
    displayHeader();
    console.log('═══ DEMO 4: PLAYER IMPROVEMENT ANALYSIS ═══\n');

    await typewriter('Scenario: Amateur golfer wants to lower their handicap...');
    await pause(500);

    console.log('\n📊 Player: John Smith (10 handicap)');
    console.log('Goal: Break 80 consistently\n');

    await pause(1000);

    const playerSG = {
        offTheTee: 0.1,
        approach: -0.5,    // Weak area
        aroundGreen: -0.1,
        putting: -0.3,     // Another weak area
        total: -0.8
    };

    console.log('Current Strokes Gained by Category:');
    console.log(`  Off the Tee:     ${playerSG.offTheTee >= 0 ? '🟢 +' : '🔴 '}${playerSG.offTheTee.toFixed(2)}`);
    console.log(`  Approach:        ${playerSG.approach >= 0 ? '🟢 +' : '🔴 '}${playerSG.approach.toFixed(2)}`);
    console.log(`  Around Green:    ${playerSG.aroundGreen >= 0 ? '🟢 +' : '🔴 '}${playerSG.aroundGreen.toFixed(2)}`);
    console.log(`  Putting:         ${playerSG.putting >= 0 ? '🟢 +' : '🔴 '}${playerSG.putting.toFixed(2)}`);
    console.log(`  ${'─'.repeat(30)}`);
    console.log(`  Total SG/Round:  🔴 ${playerSG.total.toFixed(2)}\n`);

    await pause(1500);

    const playerProfile = {
        strokesGainedProfile: {
            offTheTee: { average: 0.1, stdDev: 0.5 },
            approach: { average: -0.5, stdDev: 0.6 },
            aroundGreen: { average: -0.1, stdDev: 0.4 },
            putting: { average: -0.3, stdDev: 0.5 }
        }
    };

    const improvementPlan = RiskOptimizer.generateImprovementPlan(playerSG, playerProfile);

    console.log('═'.repeat(64));
    console.log('🎯 PRIORITIZED IMPROVEMENT PLAN');
    console.log('═'.repeat(64) + '\n');

    improvementPlan.forEach((item, idx) => {
        console.log(`${idx + 1}. ${item.category.toUpperCase()} - ${item.recommendation.priority.toUpperCase()} Priority`);
        console.log(`   Current: ${item.currentPerformance >= 0 ? '+' : ''}${item.currentPerformance.toFixed(2)} SG`);
        console.log(`   Potential Gain: ${item.riskNeutralGain.toFixed(2)} strokes/round`);

        if (idx === 0) {
            console.log(`   📋 ${item.recommendation.practice}`);
            console.log(`   🎯 ${item.recommendation.management}`);
        }
        console.log('');

        if (idx < improvementPlan.length - 1) {
            pause(800);
        }
    });

    console.log('💡 Focus on approach shots first for maximum improvement!\n');
}

async function demo5QuickLookup() {
    clearScreen();
    displayHeader();
    console.log('═══ DEMO 5: QUICK STROKES GAINED LOOKUP ═══\n');

    await typewriter('Quick reference: How many strokes from different positions?');
    await pause(500);

    const { getBaseline } = await import('./data/pgaTourBaselines.js');

    const scenarios = [
        { location: 'tee', distance: 450, unit: 'yards' },
        { location: 'fairway', distance: 175, unit: 'yards' },
        { location: 'rough', distance: 50, unit: 'yards' },
        { location: 'sand', distance: 20, unit: 'yards' },
        { location: 'green', distance: 15, unit: 'feet' }
    ];

    console.log('\nPGA Tour Average Strokes to Hole Out:\n');

    for (const scenario of scenarios) {
        const baseline = getBaseline(scenario.distance, scenario.location, scenario.unit);

        const locationEmoji = {
            'tee': '🏌️',
            'fairway': '🟢',
            'rough': '🌿',
            'sand': '🏖️',
            'green': '⛳'
        };

        console.log(`${locationEmoji[scenario.location]} ${scenario.location.padEnd(10)} ${String(scenario.distance).padStart(4)} ${scenario.unit.padEnd(6)} → ${baseline.toFixed(3)} strokes`);
        await pause(600);
    }

    console.log('\n💡 These baselines are used to calculate strokes gained!\n');
}

async function runDemo() {
    clearScreen();
    displayHeader();

    console.log('🎬 Starting Golf Analytics Demo Video...\n');
    console.log('This demo will showcase all 5 key features:\n');
    console.log('  1️⃣  Single Shot Analysis');
    console.log('  2️⃣  Strategy Comparison (Risk Optimization)');
    console.log('  3️⃣  Complete Hole Analysis');
    console.log('  4️⃣  Player Improvement Plan');
    console.log('  5️⃣  Quick Baseline Lookup\n');

    await pause(3000);

    // Demo 1
    await demo1SingleShot();
    await pause(3000);

    // Demo 2
    await demo2StrategyComparison();
    await pause(3000);

    // Demo 3
    await demo3CompleteHole();
    await pause(3000);

    // Demo 4
    await demo4PlayerAnalysis();
    await pause(3000);

    // Demo 5
    await demo5QuickLookup();
    await pause(2000);

    // Finale
    clearScreen();
    displayHeader();
    console.log('═══ DEMO COMPLETE ═══\n');

    console.log('✅ All features demonstrated!\n');
    console.log('Key Capabilities:');
    console.log('  ✨ PGA Tour statistical benchmarking');
    console.log('  ✨ Risk-adjusted optimization (Sortino ratios)');
    console.log('  ✨ Real-time strokes gained calculations');
    console.log('  ✨ Personalized improvement recommendations');
    console.log('  ✨ Shot-by-shot performance analysis\n');

    console.log('📚 Try it yourself:\n');
    console.log('  npm start          # Interactive mode');
    console.log('  npm run demo       # Pre-built examples');
    console.log('  npm test           # Run test suite\n');

    console.log('🏌️  Ready to improve your game? Start the interactive app!\n');
    console.log('═'.repeat(64) + '\n');
}

// Run the demo
runDemo().catch(console.error);
