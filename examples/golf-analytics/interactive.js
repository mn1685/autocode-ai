#!/usr/bin/env node

/**
 * Interactive Golf Analytics Application
 * Enter your own scenarios and get real-time strokes gained analysis
 */

import readline from 'readline';
import { Shot } from './models/Shot.js';
import { Hole } from './models/Round.js';
import StrokesGainedCalculator from './services/StrokesGainedCalculator.js';
import RiskOptimizer from './services/RiskOptimizer.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to prompt user
function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// Clear console
function clearScreen() {
    console.clear();
}

// Display header
function displayHeader() {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║     🏌️  GOLF ANALYTICS - Interactive Strokes Gained Tool      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
}

// Main menu
async function mainMenu() {
    clearScreen();
    displayHeader();

    console.log('What would you like to do?\n');
    console.log('1. Analyze a Single Shot');
    console.log('2. Compare Shot Strategies (Risk Optimization)');
    console.log('3. Analyze a Complete Hole');
    console.log('4. Get Player Improvement Recommendations');
    console.log('5. Quick Strokes Gained Lookup');
    console.log('6. Exit\n');

    const choice = await prompt('Enter your choice (1-6): ');

    switch (choice) {
        case '1':
            await analyzeSingleShot();
            break;
        case '2':
            await compareStrategies();
            break;
        case '3':
            await analyzeHole();
            break;
        case '4':
            await playerAnalysis();
            break;
        case '5':
            await quickLookup();
            break;
        case '6':
            console.log('\n👋 Thanks for using Golf Analytics! Good luck on the course!\n');
            rl.close();
            return;
        default:
            console.log('\n⚠️  Invalid choice. Please try again.\n');
            await prompt('Press Enter to continue...');
            await mainMenu();
            return;
    }

    await prompt('\nPress Enter to return to main menu...');
    await mainMenu();
}

// 1. Analyze Single Shot
async function analyzeSingleShot() {
    clearScreen();
    displayHeader();
    console.log('═══ SINGLE SHOT ANALYSIS ═══\n');

    console.log('Starting Location:');
    console.log('  1. Tee');
    console.log('  2. Fairway');
    console.log('  3. Rough');
    console.log('  4. Sand/Bunker');
    console.log('  5. Green');

    const startChoice = await prompt('\nSelect starting location (1-5): ');
    const startLocations = ['tee', 'fairway', 'rough', 'sand', 'green'];
    const startingLocation = startLocations[parseInt(startChoice) - 1] || 'fairway';

    const distance = parseFloat(await prompt(`Enter distance to hole (${startingLocation === 'green' ? 'feet' : 'yards'}): `));

    console.log('\nEnding Location:');
    console.log('  1. Fairway');
    console.log('  2. Rough');
    console.log('  3. Sand/Bunker');
    console.log('  4. Green');
    console.log('  5. Hole (holed out!)');

    const endChoice = await prompt('\nSelect ending location (1-5): ');
    const endLocations = ['fairway', 'rough', 'sand', 'green', 'hole'];
    const endingLocation = endLocations[parseInt(endChoice) - 1] || 'green';

    let distanceToPin = 0;
    if (endingLocation !== 'hole') {
        const unit = endingLocation === 'green' ? 'feet' : 'yards';
        distanceToPin = parseFloat(await prompt(`Enter distance to pin after shot (${unit}): `));
    }

    const club = await prompt('Enter club used (optional, press Enter to skip): ') || 'Unknown';

    // Create shot
    const shot = new Shot({
        shotNumber: 1,
        hole: 1,
        distance,
        startingLocation,
        endingLocation,
        club,
        result: endingLocation,
        distanceToPin,
        lie: 7
    });

    // Calculate strokes gained
    const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);

    // Display results
    console.log('\n' + '═'.repeat(64));
    console.log('📊 SHOT ANALYSIS RESULTS');
    console.log('═'.repeat(64) + '\n');

    console.log(`Club: ${club}`);
    console.log(`From: ${startingLocation} (${distance} ${startingLocation === 'green' ? 'ft' : 'yds'})`);
    console.log(`To: ${endingLocation} (${distanceToPin > 0 ? distanceToPin + (endingLocation === 'green' ? 'ft' : 'yds') : 'HOLED!'})`);
    console.log(`\nCategory: ${sg.category.toUpperCase()}`);
    console.log(`\nBaseline Before Shot: ${sg.baselineBefore.toFixed(3)} strokes`);
    console.log(`Baseline After Shot:  ${sg.baselineAfter.toFixed(3)} strokes`);

    const sgColor = sg.strokesGained >= 0 ? '🟢' : '🔴';
    const sgText = sg.strokesGained >= 0 ? `+${sg.strokesGained.toFixed(3)}` : sg.strokesGained.toFixed(3);

    console.log(`\n${sgColor} STROKES GAINED: ${sgText}`);

    if (sg.strokesGained > 0.5) {
        console.log('   ⭐ EXCELLENT shot! Well above tour average.');
    } else if (sg.strokesGained > 0.2) {
        console.log('   ✅ Great shot! Above tour average.');
    } else if (sg.strokesGained > 0) {
        console.log('   👍 Good shot. Slightly above average.');
    } else if (sg.strokesGained > -0.2) {
        console.log('   ⚠️  Slightly below average.');
    } else if (sg.strokesGained > -0.5) {
        console.log('   ❌ Below average shot.');
    } else {
        console.log('   💥 Poor shot. Well below tour average.');
    }

    const riskLevel = shot.getRiskLevel();
    console.log(`\nRisk Level: ${riskLevel.toFixed(1)}/10 ${riskLevel < 3 ? '(Low)' : riskLevel < 6 ? '(Medium)' : '(High)'}`);
}

// 2. Compare Shot Strategies
async function compareStrategies() {
    clearScreen();
    displayHeader();
    console.log('═══ SHOT STRATEGY COMPARISON ═══\n');

    console.log('Current Situation:');

    const distance = parseFloat(await prompt('Distance to hole (yards): '));

    console.log('\nStarting Location:');
    console.log('  1. Tee');
    console.log('  2. Fairway');
    console.log('  3. Rough');

    const locChoice = await prompt('\nSelect location (1-3): ');
    const locations = ['tee', 'fairway', 'rough'];
    const startingLocation = locations[parseInt(locChoice) - 1] || 'fairway';

    console.log('\nPlayer Skill Level:');
    console.log('  1. Tour Average');
    console.log('  2. Elite (Top 10%)');
    console.log('  3. Scratch (0 handicap)');
    console.log('  4. Mid Handicap (10-15)');

    const skillChoice = await prompt('\nSelect skill level (1-4): ');
    const skillLevels = ['tourAverage', 'elite', 'scratch', 'midHandicap'];
    const skillLevel = skillLevels[parseInt(skillChoice) - 1] || 'tourAverage';

    const playerProfile = { skillLevel };
    const situation = { distance, startingLocation, distanceToHole: distance };

    // Define strategies
    const strategies = [];

    console.log('\n' + '─'.repeat(64));
    console.log('Enter up to 3 shot strategies to compare:');
    console.log('─'.repeat(64) + '\n');

    for (let i = 1; i <= 3; i++) {
        const name = await prompt(`\nStrategy ${i} name (or press Enter to ${i === 1 ? 'skip' : 'finish'}): `);
        if (!name) {
            if (i === 1) {
                console.log('\n⚠️  You must enter at least one strategy!');
                i--;
                continue;
            }
            break;
        }

        const club = await prompt(`  Club for "${name}": `);

        console.log('  Target:');
        console.log('    1. Green');
        console.log('    2. Fairway (layup)');

        const targetChoice = await prompt('  Select target (1-2): ');
        const target = targetChoice === '1' ? 'green' : 'fairway';

        strategies.push({ name, club, target });
    }

    if (strategies.length === 0) {
        console.log('\n⚠️  No strategies entered. Returning to menu...');
        return;
    }

    // Evaluate strategies
    console.log('\n' + '═'.repeat(64));
    console.log('📊 STRATEGY COMPARISON RESULTS');
    console.log('═'.repeat(64) + '\n');

    const evaluations = [];

    strategies.forEach(strategy => {
        const evaluation = RiskOptimizer.calculateExpectedValue(strategy, playerProfile, situation);
        evaluations.push({ strategy, ...evaluation });

        console.log(`Strategy: ${strategy.name}`);
        console.log(`  Club: ${strategy.club} → ${strategy.target}`);
        console.log(`  Expected Strokes Gained: ${evaluation.expectedStrokesGained >= 0 ? '+' : ''}${evaluation.expectedStrokesGained.toFixed(3)}`);
        console.log(`  Risk (Std Dev): ${evaluation.standardDeviation.toFixed(3)}`);
        console.log(`  Downside Risk: ${evaluation.downsideRisk.toFixed(3)}`);
        console.log(`  Sortino Ratio: ${evaluation.sortinoRatio.toFixed(3)} ${evaluation.sortinoRatio > 1 ? '✅' : ''}`);
        console.log(`  Risk Score: ${evaluation.riskScore.toFixed(1)}/10\n`);
    });

    // Find optimal
    const optimal = RiskOptimizer.optimizeStrategy(strategies, playerProfile, situation, {
        maxRisk: 7,
        preferLowRisk: true
    });

    console.log('═'.repeat(64));
    console.log('🎯 RECOMMENDED STRATEGY');
    console.log('═'.repeat(64) + '\n');
    console.log(`✨ ${optimal.strategy.name} (${optimal.strategy.club})`);
    console.log(`\nExpected Strokes Gained: ${optimal.expectedStrokesGained >= 0 ? '+' : ''}${optimal.expectedStrokesGained.toFixed(3)}`);
    console.log(`Risk-Adjusted Score (Sortino): ${optimal.sortinoRatio.toFixed(3)}`);
    console.log(`\nThis strategy provides the best risk-adjusted return.`);
}

// 3. Analyze Complete Hole
async function analyzeHole() {
    clearScreen();
    displayHeader();
    console.log('═══ HOLE ANALYSIS ═══\n');

    const holeNumber = parseInt(await prompt('Hole number: '));
    const par = parseInt(await prompt('Par: '));
    const yardage = parseInt(await prompt('Total yardage: '));

    const shots = [];
    let shotsInput = true;
    let shotNumber = 1;

    console.log('\n' + '─'.repeat(64));
    console.log('Enter each shot (press Enter with no distance when done):');
    console.log('─'.repeat(64) + '\n');

    while (shotsInput) {
        console.log(`\nShot ${shotNumber}:`);

        const distInput = await prompt(`  Distance (${shotNumber === 1 || shots[shotNumber - 2]?.endingLocation !== 'green' ? 'yards' : 'feet'}): `);
        if (!distInput) {
            if (shotNumber === 1) {
                console.log('  ⚠️  You must enter at least one shot!');
                continue;
            }
            break;
        }

        const distance = parseFloat(distInput);

        const startingLocation = shotNumber === 1 ? 'tee' :
                                 shots[shotNumber - 2].endingLocation === 'hole' ? 'finished' :
                                 shots[shotNumber - 2].endingLocation;

        if (startingLocation === 'finished') {
            console.log('  ⚠️  Previous shot was holed out!');
            break;
        }

        console.log('  Ending location:');
        if (startingLocation === 'green') {
            console.log('    1. Green (still on green)');
            console.log('    2. Hole (holed out!)');
            const endChoice = await prompt('  Select (1-2): ');
            var endingLocation = endChoice === '2' ? 'hole' : 'green';
        } else {
            console.log('    1. Fairway');
            console.log('    2. Rough');
            console.log('    3. Sand');
            console.log('    4. Green');
            console.log('    5. Hole');
            const endChoice = await prompt('  Select (1-5): ');
            const endings = ['fairway', 'rough', 'sand', 'green', 'hole'];
            var endingLocation = endings[parseInt(endChoice) - 1] || 'green';
        }

        let distanceToPin = 0;
        if (endingLocation !== 'hole') {
            const unit = endingLocation === 'green' ? 'feet' : 'yards';
            distanceToPin = parseFloat(await prompt(`  Distance to pin after shot (${unit}): `));
        }

        const club = await prompt('  Club (optional): ') || 'Unknown';

        shots.push(new Shot({
            shotNumber,
            hole: holeNumber,
            distance,
            startingLocation,
            endingLocation,
            club,
            result: endingLocation,
            distanceToPin,
            lie: 7
        }));

        if (endingLocation === 'hole') {
            shotsInput = false;
        }

        shotNumber++;
    }

    if (shots.length === 0) {
        console.log('\n⚠️  No shots entered. Returning to menu...');
        return;
    }

    const score = shots.length;

    const hole = new Hole({
        number: holeNumber,
        par,
        yardage,
        shots,
        score
    });

    const holeSG = StrokesGainedCalculator.calculateHoleStrokesGained(hole);

    // Display results
    console.log('\n' + '═'.repeat(64));
    console.log('📊 HOLE ANALYSIS RESULTS');
    console.log('═'.repeat(64) + '\n');

    console.log(`Hole #${holeNumber} - Par ${par}, ${yardage} yards`);
    console.log(`Score: ${score} (${score - par >= 0 ? '+' : ''}${score - par})`);

    const scoreText = score - par < -1 ? '🦅 Eagle!' :
                     score - par === -1 ? '🐦 Birdie!' :
                     score - par === 0 ? '➖ Par' :
                     score - par === 1 ? '➕ Bogey' :
                     score - par === 2 ? '➕➕ Double Bogey' :
                     '💥 Triple+';
    console.log(`${scoreText}\n`);

    console.log('Strokes Gained by Category:');
    console.log(`  Off the Tee:    ${holeSG.offTheTee >= 0 ? '+' : ''}${holeSG.offTheTee.toFixed(3)}`);
    console.log(`  Approach:       ${holeSG.approach >= 0 ? '+' : ''}${holeSG.approach.toFixed(3)}`);
    console.log(`  Around Green:   ${holeSG.aroundGreen >= 0 ? '+' : ''}${holeSG.aroundGreen.toFixed(3)}`);
    console.log(`  Putting:        ${holeSG.putting >= 0 ? '+' : ''}${holeSG.putting.toFixed(3)}`);
    console.log(`  ${'─'.repeat(30)}`);
    console.log(`  TOTAL:          ${holeSG.total >= 0 ? '+' : ''}${holeSG.total.toFixed(3)} ${holeSG.total >= 0 ? '🟢' : '🔴'}`);

    console.log(`\nGreen in Regulation: ${hole.isGreenInRegulation() ? '✅ Yes' : '❌ No'}`);
    console.log(`Putts: ${hole.getPutts()}`);

    console.log('\n' + '─'.repeat(64));
    console.log('Shot-by-Shot Breakdown:');
    console.log('─'.repeat(64) + '\n');

    shots.forEach((shot, idx) => {
        const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);
        console.log(`Shot ${idx + 1}: ${shot.club || 'Unknown club'}`);
        console.log(`  ${shot.startingLocation} → ${shot.endingLocation}`);
        console.log(`  SG: ${sg.strokesGained >= 0 ? '+' : ''}${sg.strokesGained.toFixed(3)} (${sg.category})\n`);
    });
}

// 4. Player Analysis
async function playerAnalysis() {
    clearScreen();
    displayHeader();
    console.log('═══ PLAYER IMPROVEMENT ANALYSIS ═══\n');

    console.log('Enter your average strokes gained by category:');
    console.log('(Use + for above average, - for below average)\n');

    const offTheTee = parseFloat(await prompt('Off the Tee (e.g., +0.3 or -0.2): '));
    const approach = parseFloat(await prompt('Approach: '));
    const aroundGreen = parseFloat(await prompt('Around Green: '));
    const putting = parseFloat(await prompt('Putting: '));

    const playerSG = {
        offTheTee,
        approach,
        aroundGreen,
        putting,
        total: offTheTee + approach + aroundGreen + putting
    };

    const playerProfile = {
        strokesGainedProfile: {
            offTheTee: { average: offTheTee, stdDev: 0.5 },
            approach: { average: approach, stdDev: 0.6 },
            aroundGreen: { average: aroundGreen, stdDev: 0.4 },
            putting: { average: putting, stdDev: 0.5 }
        }
    };

    // Compare to benchmarks
    const comparison = StrokesGainedCalculator.compareToBenchmarks(playerSG);

    console.log('\n' + '═'.repeat(64));
    console.log('📊 PERFORMANCE ANALYSIS');
    console.log('═'.repeat(64) + '\n');

    console.log('Your Performance vs. Tour Average:\n');
    Object.keys(playerSG).forEach(category => {
        if (category === 'total') return;
        const value = playerSG[category];
        const emoji = value >= 0 ? '🟢' : '🔴';
        console.log(`  ${category.padEnd(15)}: ${emoji} ${value >= 0 ? '+' : ''}${value.toFixed(2)}`);
    });

    console.log(`\n  Total SG/Round:   ${playerSG.total >= 0 ? '🟢 +' : '🔴 '}${playerSG.total.toFixed(2)}\n`);

    // Generate improvement plan
    const improvementPlan = RiskOptimizer.generateImprovementPlan(playerSG, playerProfile);

    console.log('═'.repeat(64));
    console.log('🎯 PRIORITIZED IMPROVEMENT PLAN');
    console.log('═'.repeat(64) + '\n');

    improvementPlan.forEach((item, idx) => {
        console.log(`${idx + 1}. ${item.category.toUpperCase()} - Priority: ${item.recommendation.priority.toUpperCase()}`);
        console.log(`   Current: ${item.currentPerformance >= 0 ? '+' : ''}${item.currentPerformance.toFixed(2)} SG`);
        console.log(`   Potential Gain: ${item.riskNeutralGain.toFixed(2)} strokes/round`);
        console.log(`   📋 Practice: ${item.recommendation.practice}`);
        console.log(`   🎯 Strategy: ${item.recommendation.management}\n`);
    });
}

// 5. Quick Lookup
async function quickLookup() {
    clearScreen();
    displayHeader();
    console.log('═══ QUICK STROKES GAINED LOOKUP ═══\n');

    console.log('Location:');
    console.log('  1. Tee');
    console.log('  2. Fairway');
    console.log('  3. Rough');
    console.log('  4. Sand');
    console.log('  5. Green');

    const locChoice = await prompt('\nSelect location (1-5): ');
    const locations = ['tee', 'fairway', 'rough', 'sand', 'green'];
    const location = locations[parseInt(locChoice) - 1] || 'fairway';

    const unit = location === 'green' ? 'feet' : 'yards';
    const distance = parseFloat(await prompt(`Distance to hole (${unit}): `));

    const { getBaseline } = await import('./data/pgaTourBaselines.js');
    const baseline = getBaseline(distance, location, unit);

    console.log('\n' + '═'.repeat(64));
    console.log('📊 BASELINE STROKES');
    console.log('═'.repeat(64) + '\n');

    console.log(`Location: ${location}`);
    console.log(`Distance: ${distance} ${unit}`);
    console.log(`\nTour Average Strokes to Hole Out: ${baseline.toFixed(3)}`);

    console.log('\n' + '─'.repeat(64));
    console.log('What this means:');
    console.log('─'.repeat(64));
    console.log(`\nFrom this position, PGA Tour players average ${baseline.toFixed(2)} strokes`);
    console.log('to complete the hole (including the current shot).\n');

    if (location === 'green') {
        console.log(`Average putts from ${distance} feet: ${(baseline).toFixed(2)}`);
        const makePercentage = distance <= 3 ? 95 : distance <= 5 ? 65 : distance <= 10 ? 40 : distance <= 20 ? 15 : 5;
        console.log(`Tour players hole this putt ~${makePercentage}% of the time.`);
    }
}

// Start the application
console.log('\n🏌️  Welcome to Golf Analytics!\n');
console.log('Loading...\n');

setTimeout(async () => {
    await mainMenu();
}, 500);
