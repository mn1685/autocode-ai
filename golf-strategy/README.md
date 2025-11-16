# 🏌️ Golf Course Strategy Planner

An intelligent golf course strategy application that uses available data to plot optimal playing strategies for famous golf courses. Analyze courses, compare player profiles, and generate detailed hole-by-hole strategies based on skill level and weather conditions.

## Features

- **📊 Course Analysis**: Detailed analysis of famous golf courses including Pebble Beach, Augusta National, and St. Andrews
- **🏌️ Player Profiles**: Four skill levels (Professional, Low/Mid/High Handicap) with realistic statistics
- **🌤️ Weather Simulation**: Account for different weather conditions (calm, breezy, windy, rainy)
- **⛳ Hole-by-Hole Strategy**: Comprehensive strategy for each hole including:
  - Tee shot recommendations
  - Approach shot strategy
  - Hazard management
  - Green reading and putting strategy
  - Risk assessment
  - Club selection
- **📈 Performance Predictions**: Expected scores, GIR percentages, and confidence metrics
- **💾 Export Capability**: Save strategies to text files for reference on the course
- **🎯 Key Holes Identification**: Automatically identify scoring opportunities and danger holes

## Installation

No installation required! Run directly from the golf-strategy directory:

```bash
cd golf-strategy
node index.js
```

## Usage

### Quick Start

1. Navigate to the golf-strategy directory
2. Run `node index.js`
3. Select "Analyze a golf course"
4. Choose your course, skill level, and weather conditions
5. Review your personalized strategy

### Menu Options

#### 📊 Analyze a Golf Course
Generate a complete strategy for a specific course based on your skill level and weather conditions.

**Available Courses:**
- 🏖️ Pebble Beach Golf Links
- 🌸 Augusta National Golf Club
- 🏴 The Old Course at St. Andrews

**Player Profiles:**
- ⭐ Professional (300 yd drive, 75% GIR)
- 🏆 Low Handicap (270 yd drive, 65% GIR)
- ⛳ Mid Handicap (240 yd drive, 50% GIR)
- 🏌️ High Handicap (210 yd drive, 30% GIR)

**Weather Conditions:**
- ☀️ Calm: Ideal conditions
- 🌬️ Breezy: Moderate wind (15 mph)
- 💨 Windy: Strong wind (25 mph) - significant impact
- 🌧️ Rainy: Wet conditions with reduced distance

#### 📋 View Available Courses
Browse detailed information about all available courses including par, rating, slope, and notable holes.

#### 👤 Compare Player Profiles
View side-by-side comparison of all player profiles with driving distance, accuracy, GIR percentage, and putting averages.

#### 🌤️ Weather Impact Analysis
Compare how different weather conditions affect your expected score and performance on a specific course.

## Strategy Components

Each hole analysis includes:

### Tee Shot Strategy
- Recommended club selection
- Target line and aiming points
- Expected distance
- Confidence level
- Layup recommendations when appropriate

### Approach Strategy
- Aggressive vs. conservative approach
- Target area on green
- Green in Regulation (GIR) probability
- Specific approach advice

### Hazard Management
- Risk severity for each hazard
- Specific avoidance strategies
- Recovery options

### Green Strategy
- Green size, speed, and slope analysis
- Reading difficulty assessment
- Optimal target zones
- Expected putts

### Risk Assessment
- Overall hole risk level (LOW/MEDIUM/HIGH)
- Risk score calculation
- Recommendations based on risk

## Data Model

### Golf Course Data
Courses include detailed hole information:
- Par, distance, and handicap rating
- Hazards (bunkers, water, rough, trees, etc.)
- Green characteristics (size, slope, speed)
- Prevailing wind conditions
- Historical strategy notes

### Player Profiles
Each profile includes:
- Driving distance and accuracy
- Greens in Regulation percentage
- Putting average
- Sand save percentage
- Risk tolerance (conservative/moderate/aggressive)

### Weather Conditions
Weather impacts include:
- Wind speed and direction effects
- Temperature considerations
- Precipitation impact on distance and greens
- Adjustment recommendations

## Strategy Engine

The strategy engine considers:

1. **Player Capabilities**: Matches hole requirements to player skills
2. **Risk Analysis**: Calculates risk vs. reward for different strategies
3. **Weather Adjustment**: Modifies club selection and target lines
4. **Course Management**: Optimizes play style for scoring
5. **Statistical Modeling**: Predicts expected scores and outcomes

## Example Output

```
🏌️  GOLF COURSE STRATEGY PLAN

📍 COURSE INFORMATION
Course: Pebble Beach Golf Links
Location: Pebble Beach, CA
Par: 72
Player Profile: Mid Handicap (6-15)
Weather: Moderate wind
Expected Score: 85 (+13)
Average GIR: 48%

📋 GAME PLAN
• Playing as Mid Handicap (6-15) in moderate wind conditions
• Course management: conservative approach
• Focus on bogey avoidance on difficult holes
• Key strategy: Stay in play, avoid big numbers

🎯 KEY HOLES
Scoring Opportunities:
  ➤ Hole 1: Manageable par 4

Danger Holes:
  ⚠ Hole 8: Ocean left, severe green - play conservative
  ⚠ Hole 18: Long par 5 with ocean left

⛳ HOLE-BY-HOLE STRATEGY
[Detailed strategy for each hole...]
```

## Technical Details

### Technologies Used
- Node.js (ES6+ modules)
- Inquirer.js for interactive CLI
- Chalk for colorized output
- Ora for loading spinners

### File Structure
```
golf-strategy/
├── index.js              # Main CLI application
├── strategyEngine.js     # Strategy calculation engine
├── strategyVisualizer.js # Output formatting and display
├── golfCourseData.js     # Course and player data
└── README.md             # Documentation
```

### Algorithm

The strategy engine uses a multi-factor analysis:

1. **Distance Calculation**: Adjusts for weather and player capabilities
2. **Hazard Analysis**: Weights risk based on severity and player skills
3. **Green Difficulty**: Factors size, slope, and speed into approach strategy
4. **Expected Score**: Statistical model based on:
   - Player GIR percentage
   - Hazard count and severity
   - Weather conditions
   - Green difficulty
   - Historical performance

## Future Enhancements

- [ ] Custom course input
- [ ] Real-time GPS integration
- [ ] Shot tracking and post-round analysis
- [ ] AI-powered recommendations using machine learning
- [ ] Mobile app version
- [ ] Integration with golf APIs for live course data
- [ ] Personalized improvement recommendations
- [ ] Multi-round tournament strategy
- [ ] Social features (share strategies, compare with friends)

## Contributing

This app was built using the AutoCode-AI framework. To add new courses or features:

1. Add course data to `golfCourseData.js`
2. Extend the strategy engine in `strategyEngine.js`
3. Update visualization in `strategyVisualizer.js`
4. Test with different player profiles and conditions

## Credits

Built with AutoCode-AI - an innovative automatic coding tool using Claude 4 Sonnet API.

## License

MIT License - Feel free to use and modify for your golf game!

---

**Good luck on the course! 🏌️⛳**
