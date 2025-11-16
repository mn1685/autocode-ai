# Golf Analytics - Strokes Gained with Risk Optimization

A comprehensive golf analytics example demonstrating **strokes gained** calculations and **risk-adjusted optimization** based on PGA Tour statistical benchmarks.

## Overview

This example showcases how to build a professional golf analytics system that:

- ✅ **Calculates strokes gained** using PGA Tour baseline data
- ✅ **Optimizes shot strategy** to maximize performance without adverse risk
- ✅ **Analyzes player performance** against tour benchmarks
- ✅ **Generates improvement plans** with risk-neutral recommendations
- ✅ **Allocates risk budgets** across different game categories

## Table of Contents

- [What is Strokes Gained?](#what-is-strokes-gained)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Examples](#usage-examples)
- [Risk Optimization](#risk-optimization)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Testing](#testing)

## What is Strokes Gained?

**Strokes Gained** is a statistical method developed by Columbia Business School professor Mark Broadie and adopted by the PGA Tour. It measures a player's performance compared to the field average.

### Formula

```
Strokes Gained = (Baseline Before Shot - Baseline After Shot) - 1
```

- **Positive values** = Better than tour average
- **Negative values** = Worse than tour average
- The "-1" accounts for the stroke taken

### Categories

The system tracks strokes gained across four categories:

1. **Off the Tee** - Tee shots on par 4s and 5s
2. **Approach** - Shots to the green from >30 yards
3. **Around the Green** - Shots within 30 yards of the green
4. **Putting** - All shots on the green

## Key Features

### 1. PGA Tour Baseline Data

Comprehensive baseline data based on 2024-2025 PGA Tour statistics:

- **Tee shots** (100-600 yards)
- **Fairway shots** (10-300 yards)
- **Rough shots** (5-275 yards)
- **Sand shots** (5-125 yards)
- **Putting** (1-100 feet)

### 2. Strokes Gained Calculator

Calculate strokes gained for:
- Individual shots
- Complete holes
- Full rounds
- Multi-round trends

### 3. Risk-Adjusted Optimization

**Maximize strokes gained without increasing risk:**

- Expected value calculations
- Risk metrics (Standard Deviation, Downside Risk)
- Sharpe Ratio and Sortino Ratio
- Shot strategy optimization
- Risk-neutral improvement planning

### 4. Performance Benchmarking

Compare player performance against:
- Tour average
- Elite players (top 10%)
- Great shots (top 5%)
- Poor shots (bottom 5%)

## Project Structure

```
examples/golf-analytics/
├── interactive.js              # 🎮 Interactive CLI application (START HERE)
├── models/                     # Data models
│   ├── Shot.js                # Individual shot model
│   ├── Round.js               # Round and hole models
│   └── Player.js              # Player profile model
├── services/                   # Core services
│   ├── StrokesGainedCalculator.js  # SG calculation engine
│   └── RiskOptimizer.js           # Risk optimization algorithms
├── data/                       # Baseline data
│   └── pgaTourBaselines.js    # PGA Tour statistical baselines
├── examples/                   # Usage examples
│   ├── basic-usage.js         # Pre-built demonstrations
│   └── test-scenarios.js      # Test cases and validation
├── package.json               # NPM scripts
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- ES6 modules support

### Installation

No installation required! This is a standalone example.

### Running the Application

**🎮 Interactive Mode (Recommended):**

Run the interactive CLI application to enter your own scenarios:

```bash
cd examples/golf-analytics
npm start
# or
node interactive.js
```

The interactive app features:
- ✅ **Analyze Single Shots** - Enter any shot scenario and get instant strokes gained
- ✅ **Compare Strategies** - Evaluate multiple shot options with risk optimization
- ✅ **Analyze Complete Holes** - Track shot-by-shot performance
- ✅ **Get Improvement Plans** - Personalized recommendations based on your stats
- ✅ **Quick Lookups** - Check baseline strokes for any distance/location

**📚 Example Demonstrations:**

```bash
npm run demo   # View pre-built examples
npm test       # Run test suite
```

### Quick Start (Code)

```javascript
import { Shot } from './models/Shot.js';
import StrokesGainedCalculator from './services/StrokesGainedCalculator.js';

// Create a shot: 150 yards from fairway to 10 feet on green
const shot = new Shot({
    distance: 150,
    startingLocation: 'fairway',
    endingLocation: 'green',
    club: '8-iron',
    distanceToPin: 10 // feet
});

// Calculate strokes gained
const sg = StrokesGainedCalculator.calculateShotStrokesGained(shot);

console.log(`Strokes Gained: ${sg.strokesGained.toFixed(3)}`);
// Output: Strokes Gained: 0.330
```

## Usage Examples

### Example 1: Single Shot Analysis

```javascript
import { Shot } from './models/Shot.js';
import StrokesGainedCalculator from './services/StrokesGainedCalculator.js';

// Analyze a drive
const drive = new Shot({
    distance: 280,
    startingLocation: 'tee',
    endingLocation: 'fairway',
    club: 'Driver',
    distanceToPin: 180
});

const driveSG = StrokesGainedCalculator.calculateShotStrokesGained(drive);

console.log(`Drive SG: ${driveSG.strokesGained.toFixed(3)}`);
console.log(`Category: ${driveSG.category}`);
console.log(`Baseline Before: ${driveSG.baselineBefore.toFixed(3)}`);
console.log(`Baseline After: ${driveSG.baselineAfter.toFixed(3)}`);
```

### Example 2: Full Hole Analysis

```javascript
import { Hole } from './models/Round.js';
import { Shot } from './models/Shot.js';
import StrokesGainedCalculator from './services/StrokesGainedCalculator.js';

const hole = new Hole({
    number: 1,
    par: 4,
    yardage: 380,
    shots: [
        new Shot({
            distance: 280,
            startingLocation: 'tee',
            endingLocation: 'fairway',
            distanceToPin: 170
        }),
        new Shot({
            distance: 170,
            startingLocation: 'fairway',
            endingLocation: 'green',
            distanceToPin: 15
        }),
        new Shot({
            distance: 15,
            startingLocation: 'green',
            endingLocation: 'hole',
            distanceToPin: 0
        })
    ],
    score: 3 // Birdie!
});

const holeSG = StrokesGainedCalculator.calculateHoleStrokesGained(hole);

console.log('Strokes Gained by Category:');
console.log(`  Off the Tee: ${holeSG.offTheTee.toFixed(3)}`);
console.log(`  Approach: ${holeSG.approach.toFixed(3)}`);
console.log(`  Putting: ${holeSG.putting.toFixed(3)}`);
console.log(`  Total: ${holeSG.total.toFixed(3)}`);
```

### Example 3: Round Performance Analysis

```javascript
import { Round } from './models/Round.js';
import StrokesGainedCalculator from './services/StrokesGainedCalculator.js';

const round = new Round({
    playerId: 'player-001',
    courseId: 'pebble-beach',
    date: new Date(),
    holes: [...], // Array of Hole objects
    totalScore: 68,
    coursePar: 72
});

const roundSG = StrokesGainedCalculator.calculateRoundStrokesGained(round);

console.log('Round Summary:');
console.log(`Total SG: ${roundSG.total.total.toFixed(2)}`);
console.log(`Performance: ${roundSG.performance.total.rating}`);
console.log(`Percentile: ${roundSG.performance.total.percentile.toFixed(1)}%`);
```

## Risk Optimization

### Maximizing Strokes Gained Without Adverse Risk

The `RiskOptimizer` service helps players make optimal decisions that maximize expected strokes gained while controlling for risk.

### Example: Shot Strategy Optimization

```javascript
import RiskOptimizer from './services/RiskOptimizer.js';

// Player profile
const playerProfile = {
    skillLevel: 'tourAverage',
    strokesGainedProfile: {
        offTheTee: { average: 0.2, stdDev: 0.5 },
        approach: { average: -0.1, stdDev: 0.6 }
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
    { name: 'Aggressive - 3-wood to green', club: '3-wood', target: 'green' },
    { name: 'Conservative - 7-iron layup', club: '7-iron', target: 'fairway' },
    { name: 'Moderate - 5-iron', club: '5-iron', target: 'green' }
];

// Find optimal strategy
const optimal = RiskOptimizer.optimizeStrategy(
    strategies,
    playerProfile,
    situation,
    {
        maxRisk: 6,           // Maximum acceptable risk score
        preferLowRisk: true   // Prefer risk-adjusted returns
    }
);

console.log(`Optimal Strategy: ${optimal.strategy.name}`);
console.log(`Expected SG: ${optimal.expectedStrokesGained.toFixed(3)}`);
console.log(`Risk Score: ${optimal.riskScore.toFixed(1)}/10`);
console.log(`Sortino Ratio: ${optimal.sortinoRatio.toFixed(3)}`);
```

### Key Risk Metrics

1. **Expected Strokes Gained** - Average SG across all possible outcomes
2. **Standard Deviation** - Total risk (variance of outcomes)
3. **Downside Risk** - Risk of negative outcomes only
4. **Sharpe Ratio** - Expected SG / Standard Deviation
5. **Sortino Ratio** - Expected SG / Downside Risk (preferred metric)

### Improvement Planning

Generate risk-neutral improvement recommendations:

```javascript
const playerSG = {
    offTheTee: 0.3,
    approach: -0.4,    // Weak area
    aroundGreen: 0.1,
    putting: -0.2      // Another weak area
};

const improvementPlan = RiskOptimizer.generateImprovementPlan(
    playerSG,
    playerProfile
);

improvementPlan.forEach(item => {
    console.log(`Category: ${item.category}`);
    console.log(`Current: ${item.currentPerformance.toFixed(2)}`);
    console.log(`Risk-Neutral Gain: ${item.riskNeutralGain.toFixed(2)}`);
    console.log(`Technical: ${item.recommendation.technical}`);
    console.log(`Practice: ${item.recommendation.practice}\n`);
});
```

## Data Models

### Shot

Represents a single golf shot with all relevant attributes.

```javascript
{
    shotNumber: 1,
    hole: 1,
    distance: 150,              // yards (or feet for putting)
    startingLocation: 'fairway', // 'tee', 'fairway', 'rough', 'sand', 'green'
    endingLocation: 'green',     // same options + 'hole'
    club: '8-iron',
    result: 'green',
    lateralDistance: 5,          // offline distance
    distanceToPin: 10,
    lie: 8,                      // quality 1-10
    slope: 0,
    wind: 0
}
```

### Hole

Represents a single hole with multiple shots.

```javascript
{
    number: 1,
    par: 4,
    yardage: 380,
    shots: [...],    // Array of Shot objects
    score: 4
}
```

### Round

Represents a complete 18-hole round.

```javascript
{
    playerId: 'player-001',
    courseId: 'pebble-beach',
    date: new Date(),
    holes: [...],    // Array of Hole objects
    weather: {},
    totalScore: 72,
    coursePar: 72
}
```

### Player

Represents a player with performance history.

```javascript
{
    id: 'player-001',
    name: 'John Doe',
    handicap: 2,
    rounds: [...],
    strokesGainedProfile: {
        offTheTee: { average: 0.2, stdDev: 0.5, trend: [...] },
        approach: { average: -0.1, stdDev: 0.6, trend: [...] },
        aroundGreen: { average: 0.0, stdDev: 0.4, trend: [...] },
        putting: { average: 0.1, stdDev: 0.5, trend: [...] }
    }
}
```

## API Reference

### StrokesGainedCalculator

#### `calculateShotStrokesGained(shot)`

Calculate strokes gained for a single shot.

**Returns:**
```javascript
{
    strokesGained: 0.33,
    baselineBefore: 2.94,
    baselineAfter: 1.61,
    category: 'approach'
}
```

#### `calculateHoleStrokesGained(hole)`

Calculate strokes gained for an entire hole by category.

**Returns:**
```javascript
{
    offTheTee: 0.1,
    approach: 0.3,
    aroundGreen: 0.0,
    putting: 0.2,
    total: 0.6
}
```

#### `calculateRoundStrokesGained(round)`

Calculate strokes gained for an entire round with performance evaluation.

**Returns:**
```javascript
{
    total: { offTheTee: 1.5, approach: 2.0, ... },
    byHole: [...],
    performance: {
        offTheTee: { value: 1.5, rating: 'excellent', percentile: 85.2 },
        ...
    }
}
```

### RiskOptimizer

#### `calculateExpectedValue(strategy, playerProfile, situation)`

Calculate expected strokes gained and risk metrics for a shot strategy.

**Returns:**
```javascript
{
    expectedStrokesGained: 0.15,
    standardDeviation: 0.3,
    downsideRisk: 0.1,
    sharpeRatio: 0.5,
    sortinoRatio: 1.5,
    outcomes: [...],
    riskScore: 4.2
}
```

#### `optimizeStrategy(strategies, playerProfile, situation, constraints)`

Find the optimal shot strategy that maximizes risk-adjusted returns.

**Parameters:**
- `strategies` - Array of strategy objects
- `playerProfile` - Player skill profile
- `situation` - Current shot situation
- `constraints` - Risk constraints
  - `maxRisk` (default: 5) - Maximum acceptable risk score
  - `minExpectedSG` (default: -0.5) - Minimum expected SG
  - `preferLowRisk` (default: true) - Optimize for Sortino ratio

**Returns:** Optimal strategy object with evaluation metrics

#### `generateImprovementPlan(playerStrokesGained, playerProfile)`

Generate prioritized improvement plan with risk-neutral recommendations.

**Returns:** Array of improvement opportunities sorted by potential gain

#### `allocateRiskBudget(playerProfile, totalRiskBudget)`

Optimize risk allocation across categories to maximize total strokes gained.

**Returns:**
```javascript
{
    allocation: {
        offTheTee: { riskBudget: 0.5, expectedGain: 0.3, currentSG: 0.2 },
        approach: { riskBudget: 0.8, expectedGain: 0.5, currentSG: -0.1 },
        ...
    },
    totalRiskBudget: 2.0,
    expectedTotalGain: 1.2
}
```

## Testing

Run the test suite to validate calculations:

```bash
node examples/test-scenarios.js
```

The test suite includes:

- ✅ Baseline data validation
- ✅ Strokes gained calculations
- ✅ Shot categorization
- ✅ Hole and round analysis
- ✅ Risk optimization algorithms
- ✅ Improvement planning
- ✅ Risk budget allocation

**Expected output:**
```
✓ Baseline: 200 yards from tee
✓ SG: Perfect drive gains strokes
✓ Risk: Expected value calculation
...
✓ Passed: 23
✗ Failed: 0
🎉 All tests passed!
```

## Use Cases

### 1. Player Performance Analysis

Track and analyze player performance over time:
- Identify strengths and weaknesses
- Compare to tour benchmarks
- Track improvement trends

### 2. Shot Decision Support

Help players make optimal shot selections:
- Evaluate risk vs. reward
- Consider player skill level
- Account for course conditions

### 3. Practice Planning

Generate data-driven practice plans:
- Prioritize improvement areas
- Focus on risk-neutral gains
- Balance technical and strategic work

### 4. Coaching Insights

Provide coaches with detailed analytics:
- Quantify player strengths/weaknesses
- Track progress over time
- Validate training programs

### 5. Course Management

Optimize course strategy:
- Identify high-leverage shots
- Minimize risk on tight holes
- Maximize scoring opportunities

## Technical Implementation

### Baseline Interpolation

The system uses linear interpolation to calculate baselines for distances not in the lookup tables:

```javascript
// Example: 155 yards from fairway
// Interpolates between 150 yards (2.94) and 160 yards (2.98)
const baseline = getBaseline(155, 'fairway');
// Returns: ~2.96
```

### Monte Carlo Simulation

Risk analysis uses Monte Carlo simulation with outcome probabilities:

- Perfect shot (10%)
- Good shot (40%)
- Average shot (30%)
- Poor shot (15%)
- Bad shot (5%)

Each outcome includes dispersion modeling based on player skill level.

### Risk-Adjusted Optimization

Uses Modern Portfolio Theory concepts:

- **Sharpe Ratio** - Return per unit of total risk
- **Sortino Ratio** - Return per unit of downside risk (preferred)
- **Risk Budgeting** - Optimal allocation of acceptable risk

## References

### Data Sources

- PGA Tour ShotLink System
- Data Golf (datagolf.com)
- Mark Broadie's "Every Shot Counts"

### Methodology

- **Strokes Gained**: PGA Tour official methodology
- **Risk Metrics**: Modern Portfolio Theory
- **Optimization**: Mean-variance optimization adapted for golf

## Future Enhancements

Potential additions to this example:

1. **Course topology modeling** - Account for elevation, hazards, wind
2. **Weather integration** - Adjust baselines for conditions
3. **Historical trends** - Time-series analysis and forecasting
4. **Machine learning** - Predictive models for player performance
5. **Visualization** - Charts and graphs for insights
6. **Database integration** - Persistent storage for rounds and players
7. **API endpoints** - RESTful API for web/mobile apps

## License

MIT - This is an example/demo project for educational purposes.

## Contributing

This is an example project for the AutoCode repository. To use this as a starting point for your own golf analytics application:

1. Copy this directory to a new project
2. Install dependencies: `npm init -y`
3. Add any additional libraries you need
4. Customize for your specific use case

---

**Built with AutoCode** - Demonstrating AI-powered code generation for complex analytics systems.

For questions or suggestions, please open an issue in the main AutoCode repository.
