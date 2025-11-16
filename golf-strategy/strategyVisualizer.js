import chalk from 'chalk';

export class StrategyVisualizer {
    /**
     * Display complete course strategy
     */
    displayCourseStrategy(strategy) {
        console.log('\n' + '='.repeat(80));
        console.log(chalk.bold.cyan.underline(`\n🏌️  GOLF COURSE STRATEGY PLAN\n`));
        console.log('='.repeat(80) + '\n');

        this.displayCourseInfo(strategy);
        this.displayOverallPlan(strategy);
        this.displayKeyHoles(strategy);
        this.displayHoleByHole(strategy);

        console.log('\n' + '='.repeat(80));
        console.log(chalk.bold.green('Strategy analysis complete! Good luck on the course! 🏌️'));
        console.log('='.repeat(80) + '\n');
    }

    /**
     * Display course information header
     */
    displayCourseInfo(strategy) {
        console.log(chalk.bold.yellow('📍 COURSE INFORMATION'));
        console.log(chalk.gray('─'.repeat(80)));
        console.log(`${chalk.bold('Course:')} ${chalk.cyan(strategy.courseName)}`);
        console.log(`${chalk.bold('Location:')} ${strategy.location}`);
        console.log(`${chalk.bold('Par:')} ${strategy.par}`);
        console.log(`${chalk.bold('Player Profile:')} ${chalk.magenta(strategy.playerProfile)}`);
        console.log(`${chalk.bold('Weather:')} ${strategy.weatherConditions}`);
        console.log(`${chalk.bold('Expected Score:')} ${this.colorizeScore(strategy.expectedScore, strategy.par)}`);
        console.log(`${chalk.bold('Average GIR:')} ${chalk.cyan(strategy.averageGIR)}`);
        console.log();
    }

    /**
     * Display overall game plan
     */
    displayOverallPlan(strategy) {
        console.log(chalk.bold.yellow('📋 GAME PLAN'));
        console.log(chalk.gray('─'.repeat(80)));
        strategy.overallGamePlan.forEach(item => {
            console.log(`  ${chalk.green('•')} ${item}`);
        });
        console.log();
    }

    /**
     * Display key holes summary
     */
    displayKeyHoles(strategy) {
        console.log(chalk.bold.yellow('🎯 KEY HOLES'));
        console.log(chalk.gray('─'.repeat(80)));

        if (strategy.keyHoles.scoringOpportunities.length > 0) {
            console.log(chalk.bold.green('\n  Scoring Opportunities:'));
            strategy.keyHoles.scoringOpportunities.forEach(hole => {
                console.log(`    ${chalk.green('➤')} Hole ${hole.hole}: ${hole.reason}`);
            });
        }

        if (strategy.keyHoles.dangerHoles.length > 0) {
            console.log(chalk.bold.red('\n  Danger Holes (Play Conservative):'));
            strategy.keyHoles.dangerHoles.forEach(hole => {
                console.log(`    ${chalk.red('⚠')} Hole ${hole.hole}: ${hole.reason}`);
            });
        }
        console.log();
    }

    /**
     * Display hole-by-hole strategy
     */
    displayHoleByHole(strategy) {
        console.log(chalk.bold.yellow('⛳ HOLE-BY-HOLE STRATEGY'));
        console.log(chalk.gray('='.repeat(80)));

        strategy.holeByHoleStrategy.forEach(hole => {
            this.displayHoleStrategy(hole);
        });
    }

    /**
     * Display individual hole strategy
     */
    displayHoleStrategy(hole) {
        console.log();
        console.log(chalk.bold.cyan(`HOLE ${hole.holeNumber} - Par ${hole.par}, ${hole.distance} yards`));
        console.log(chalk.gray('─'.repeat(80)));

        // Risk assessment
        const riskColor = hole.riskAssessment.level === 'HIGH' ? 'red' :
            hole.riskAssessment.level === 'MEDIUM' ? 'yellow' : 'green';
        console.log(`${chalk.bold('Risk Level:')} ${chalk[riskColor](hole.riskAssessment.level)} - ${hole.riskAssessment.recommendation}`);

        // Expected score
        console.log(`${chalk.bold('Expected Score:')} ${this.colorizeScore(hole.expectedScore, hole.par)}`);

        // Tee shot
        console.log(chalk.bold.blue('\n  TEE SHOT:'));
        console.log(`    Club: ${chalk.cyan(hole.teeShot.club)}`);
        console.log(`    Target: ${hole.teeShot.targetLine}`);
        console.log(`    Expected Distance: ${hole.teeShot.expectedDistance} yards`);
        console.log(`    Confidence: ${this.colorizeConfidence(hole.teeShot.confidence)}%`);
        if (hole.teeShot.layupDistance) {
            console.log(`    ${chalk.yellow('⚠ Consider laying up to:')} ${hole.teeShot.layupDistance} yards`);
        }

        // Approach
        console.log(chalk.bold.blue('\n  APPROACH:'));
        console.log(`    Strategy: ${chalk.magenta(hole.approach.strategy)}`);
        console.log(`    Target Area: ${hole.approach.targetArea}`);
        console.log(`    GIR Probability: ${this.colorizePercentage(hole.approach.girProbability)}`);
        console.log(`    Advice: ${hole.approach.recommendedApproach}`);

        // Hazards
        if (hole.hazardManagement.length > 0) {
            console.log(chalk.bold.blue('\n  HAZARD MANAGEMENT:'));
            hole.hazardManagement.forEach(hazard => {
                const severityColor = hazard.severity === 'high' ? 'red' :
                    hazard.severity === 'medium' ? 'yellow' : 'green';
                console.log(`    ${chalk[severityColor]('•')} ${hazard.hazard} (${chalk[severityColor](hazard.severity)} risk)`);
                console.log(`      ${chalk.gray(hazard.strategy)}`);
            });
        }

        // Green strategy
        console.log(chalk.bold.blue('\n  GREEN:'));
        console.log(`    Size: ${hole.greenStrategy.size} | Speed: ${hole.greenStrategy.speed} | Slope: ${hole.greenStrategy.slope}`);
        console.log(`    Reading Difficulty: ${hole.greenStrategy.readingDifficulty}`);
        console.log(`    Target Zone: ${chalk.cyan(hole.greenStrategy.targetZone)}`);
        console.log(`    Average Putts: ${hole.greenStrategy.averagePutts}`);

        // Club recommendations
        console.log(chalk.bold.blue('\n  CLUB SELECTION:'));
        hole.clubRecommendations.forEach(rec => {
            console.log(`    ${rec.shot}: ${chalk.cyan(rec.club)} (${rec.distance} yards)`);
        });

        console.log();
    }

    /**
     * Display scorecard summary
     */
    displayScorecard(strategy) {
        console.log(chalk.bold.yellow('\n📊 SCORECARD SUMMARY'));
        console.log(chalk.gray('─'.repeat(80)));

        console.log(chalk.bold('Hole   Par   Distance   Expected   Risk'));
        console.log(chalk.gray('─'.repeat(80)));

        strategy.holeByHoleStrategy.forEach(hole => {
            const holeNum = String(hole.holeNumber).padEnd(6);
            const par = String(hole.par).padEnd(5);
            const distance = String(hole.distance).padEnd(10);
            const expected = this.colorizeScore(hole.expectedScore, hole.par).padEnd(10);
            const riskColor = hole.riskAssessment.level === 'HIGH' ? 'red' :
                hole.riskAssessment.level === 'MEDIUM' ? 'yellow' : 'green';
            const risk = chalk[riskColor](hole.riskAssessment.level);

            console.log(`${holeNum} ${par} ${distance} ${expected}   ${risk}`);
        });

        console.log(chalk.gray('─'.repeat(80)));
        console.log(`${chalk.bold('Total Expected Score:')} ${this.colorizeScore(strategy.expectedScore, strategy.par)}`);
        console.log();
    }

    /**
     * Export strategy to text format
     */
    exportToText(strategy) {
        let output = '';

        output += `GOLF COURSE STRATEGY PLAN\n`;
        output += `${'='.repeat(80)}\n\n`;

        output += `Course: ${strategy.courseName}\n`;
        output += `Location: ${strategy.location}\n`;
        output += `Par: ${strategy.par}\n`;
        output += `Player Profile: ${strategy.playerProfile}\n`;
        output += `Weather: ${strategy.weatherConditions}\n`;
        output += `Expected Score: ${strategy.expectedScore} (${strategy.expectedOverUnder > 0 ? '+' : ''}${strategy.expectedOverUnder})\n`;
        output += `Average GIR: ${strategy.averageGIR}\n\n`;

        output += `GAME PLAN\n`;
        output += `${'-'.repeat(80)}\n`;
        strategy.overallGamePlan.forEach(item => {
            output += `  • ${item}\n`;
        });
        output += `\n`;

        output += `HOLE-BY-HOLE STRATEGY\n`;
        output += `${'='.repeat(80)}\n`;

        strategy.holeByHoleStrategy.forEach(hole => {
            output += `\nHOLE ${hole.holeNumber} - Par ${hole.par}, ${hole.distance} yards\n`;
            output += `${'-'.repeat(80)}\n`;
            output += `Risk: ${hole.riskAssessment.level} - ${hole.riskAssessment.recommendation}\n`;
            output += `Expected Score: ${hole.expectedScore}\n\n`;

            output += `TEE SHOT:\n`;
            output += `  Club: ${hole.teeShot.club}\n`;
            output += `  Target: ${hole.teeShot.targetLine}\n`;
            output += `  Expected Distance: ${hole.teeShot.expectedDistance} yards\n`;
            output += `  Confidence: ${hole.teeShot.confidence}%\n\n`;

            output += `APPROACH:\n`;
            output += `  Strategy: ${hole.approach.strategy}\n`;
            output += `  Target Area: ${hole.approach.targetArea}\n`;
            output += `  GIR Probability: ${hole.approach.girProbability}\n\n`;

            if (hole.hazardManagement.length > 0) {
                output += `HAZARDS:\n`;
                hole.hazardManagement.forEach(hazard => {
                    output += `  • ${hazard.hazard} (${hazard.severity} risk): ${hazard.strategy}\n`;
                });
                output += `\n`;
            }

            output += `GREEN:\n`;
            output += `  Size: ${hole.greenStrategy.size} | Speed: ${hole.greenStrategy.speed}\n`;
            output += `  Target Zone: ${hole.greenStrategy.targetZone}\n`;
            output += `  Average Putts: ${hole.greenStrategy.averagePutts}\n\n`;
        });

        return output;
    }

    // Helper methods for colorizing output

    colorizeScore(score, par) {
        const diff = score - par;
        if (diff < 0) return chalk.green(`${score} (${diff})`);
        if (diff > 0) return chalk.red(`${score} (+${diff})`);
        return chalk.yellow(`${score} (E)`);
    }

    colorizeConfidence(confidence) {
        if (confidence >= 70) return chalk.green(confidence);
        if (confidence >= 50) return chalk.yellow(confidence);
        return chalk.red(confidence);
    }

    colorizePercentage(percentage) {
        const value = parseInt(percentage);
        if (value >= 70) return chalk.green(percentage);
        if (value >= 50) return chalk.yellow(percentage);
        return chalk.red(percentage);
    }
}
