#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync } from 'fs';
import { GolfStrategyEngine } from './strategyEngine.js';
import { StrategyVisualizer } from './strategyVisualizer.js';
import { golfCourses } from './golfCourseData.js';

const visualizer = new StrategyVisualizer();

async function main() {
    console.log(chalk.bold.cyan('\n🏌️  Welcome to Golf Course Strategy Planner 🏌️\n'));
    console.log(chalk.gray('Analyze golf courses and create optimal playing strategies\n'));

    try {
        await showMainMenu();
    } catch (error) {
        if (error.message.includes('User force closed')) {
            console.log(chalk.yellow('\n👋 Goodbye! See you on the course!\n'));
            process.exit(0);
        }
        console.error(chalk.red('\n❌ Error:'), error.message);
        process.exit(1);
    }
}

async function showMainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: '📊 Analyze a golf course', value: 'analyze' },
                { name: '🏌️ Create custom strategy', value: 'custom' },
                { name: '📋 View available courses', value: 'courses' },
                { name: '👤 Compare player profiles', value: 'compare' },
                { name: '🌤️  Weather impact analysis', value: 'weather' },
                { name: '🚪 Exit', value: 'exit' }
            ]
        }
    ]);

    switch (action) {
        case 'analyze':
            await analyzeCourse();
            break;
        case 'custom':
            await createCustomStrategy();
            break;
        case 'courses':
            await viewCourses();
            break;
        case 'compare':
            await compareProfiles();
            break;
        case 'weather':
            await weatherAnalysis();
            break;
        case 'exit':
            console.log(chalk.yellow('\n👋 Goodbye! Good luck on the course!\n'));
            process.exit(0);
    }

    // Return to main menu
    await showMainMenu();
}

async function analyzeCourse() {
    console.log(chalk.cyan('\n📊 Golf Course Analysis\n'));

    const { courseName } = await inquirer.prompt([
        {
            type: 'list',
            name: 'courseName',
            message: 'Select a golf course:',
            choices: [
                { name: '🏖️  Pebble Beach Golf Links', value: 'pebbleBeach' },
                { name: '🌸 Augusta National Golf Club', value: 'augusta' },
                { name: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 The Old Course at St. Andrews', value: 'stAndrews' }
            ]
        }
    ]);

    const { playerProfile } = await inquirer.prompt([
        {
            type: 'list',
            name: 'playerProfile',
            message: 'Select your skill level:',
            choices: [
                { name: '⭐ Professional', value: 'professional' },
                { name: '🏆 Low Handicap (0-5)', value: 'lowHandicap' },
                { name: '⛳ Mid Handicap (6-15)', value: 'midHandicap' },
                { name: '🏌️ High Handicap (16+)', value: 'highHandicap' }
            ]
        }
    ]);

    const { weather } = await inquirer.prompt([
        {
            type: 'list',
            name: 'weather',
            message: 'Select weather conditions:',
            choices: [
                { name: '☀️  Calm', value: 'calm' },
                { name: '🌬️  Breezy', value: 'breezy' },
                { name: '💨 Windy', value: 'windy' },
                { name: '🌧️  Rainy', value: 'rainy' }
            ]
        }
    ]);

    const spinner = ora('Analyzing course and generating strategy...').start();

    // Small delay for effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    const course = golfCourses[courseName];
    const engine = new GolfStrategyEngine(playerProfile, weather);
    const strategy = engine.generateCourseStrategy(course);

    spinner.succeed('Strategy generated successfully!');

    visualizer.displayCourseStrategy(strategy);

    const { saveStrategy } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'saveStrategy',
            message: 'Would you like to save this strategy to a file?',
            default: true
        }
    ]);

    if (saveStrategy) {
        const filename = `golf-strategy-${courseName}-${Date.now()}.txt`;
        const textOutput = visualizer.exportToText(strategy);
        writeFileSync(filename, textOutput);
        console.log(chalk.green(`\n✅ Strategy saved to: ${filename}\n`));
    }
}

async function createCustomStrategy() {
    console.log(chalk.cyan('\n🏌️ Custom Strategy Builder\n'));
    console.log(chalk.gray('This feature would allow you to input custom hole data'));
    console.log(chalk.gray('Coming soon in the next version!\n'));
}

async function viewCourses() {
    console.log(chalk.cyan('\n📋 Available Golf Courses\n'));

    Object.entries(golfCourses).forEach(([key, course]) => {
        console.log(chalk.bold.yellow(`\n${course.name}`));
        console.log(chalk.gray('─'.repeat(60)));
        console.log(`${chalk.bold('Location:')} ${course.location}`);
        console.log(`${chalk.bold('Par:')} ${course.par}`);
        console.log(`${chalk.bold('Rating:')} ${course.rating}`);
        console.log(`${chalk.bold('Slope:')} ${course.slope}`);
        console.log(`${chalk.bold('Holes Available:')} ${course.holes.length}`);

        console.log(chalk.bold('\nNotable Holes:'));
        course.holes.forEach(hole => {
            console.log(`  ${chalk.cyan(`#${hole.number}`)} - Par ${hole.par}, ${hole.distance} yards`);
            console.log(`    ${chalk.gray(hole.strategy)}`);
        });
    });

    console.log();
}

async function compareProfiles() {
    console.log(chalk.cyan('\n👤 Player Profile Comparison\n'));

    const profiles = {
        professional: { level: 'Professional', distance: 300, accuracy: 70, gir: 75, putting: 1.7 },
        lowHandicap: { level: 'Low Handicap', distance: 270, accuracy: 65, gir: 65, putting: 1.8 },
        midHandicap: { level: 'Mid Handicap', distance: 240, accuracy: 55, gir: 50, putting: 2.0 },
        highHandicap: { level: 'High Handicap', distance: 210, accuracy: 45, gir: 30, putting: 2.2 }
    };

    console.log(chalk.bold('Profile         Distance  Accuracy  GIR    Putting'));
    console.log(chalk.gray('─'.repeat(60)));

    Object.values(profiles).forEach(profile => {
        const level = profile.level.padEnd(15);
        const distance = String(profile.distance).padEnd(9);
        const accuracy = `${profile.accuracy}%`.padEnd(9);
        const gir = `${profile.gir}%`.padEnd(6);
        const putting = String(profile.putting);

        console.log(`${level} ${distance} ${accuracy} ${gir} ${putting}`);
    });

    console.log('\n');
}

async function weatherAnalysis() {
    console.log(chalk.cyan('\n🌤️  Weather Impact Analysis\n'));

    const { courseName, weather1, weather2 } = await inquirer.prompt([
        {
            type: 'list',
            name: 'courseName',
            message: 'Select a course to analyze:',
            choices: [
                { name: 'Pebble Beach', value: 'pebbleBeach' },
                { name: 'Augusta National', value: 'augusta' },
                { name: 'St. Andrews', value: 'stAndrews' }
            ]
        },
        {
            type: 'list',
            name: 'weather1',
            message: 'First weather condition:',
            choices: ['calm', 'breezy', 'windy', 'rainy']
        },
        {
            type: 'list',
            name: 'weather2',
            message: 'Second weather condition:',
            choices: ['calm', 'breezy', 'windy', 'rainy']
        }
    ]);

    const spinner = ora('Comparing weather scenarios...').start();
    await new Promise(resolve => setTimeout(resolve, 1000));

    const course = golfCourses[courseName];
    const engine1 = new GolfStrategyEngine('midHandicap', weather1);
    const engine2 = new GolfStrategyEngine('midHandicap', weather2);

    const strategy1 = engine1.generateCourseStrategy(course);
    const strategy2 = engine2.generateCourseStrategy(course);

    spinner.succeed('Comparison complete!');

    console.log(chalk.bold.yellow(`\n📊 Weather Impact Comparison - ${course.name}\n`));
    console.log(chalk.gray('─'.repeat(60)));

    console.log(`\n${chalk.bold(weather1.toUpperCase())} conditions:`);
    console.log(`  Expected Score: ${strategy1.expectedScore} (${strategy1.expectedOverUnder > 0 ? '+' : ''}${strategy1.expectedOverUnder})`);
    console.log(`  Average GIR: ${strategy1.averageGIR}`);

    console.log(`\n${chalk.bold(weather2.toUpperCase())} conditions:`);
    console.log(`  Expected Score: ${strategy2.expectedScore} (${strategy2.expectedOverUnder > 0 ? '+' : ''}${strategy2.expectedOverUnder})`);
    console.log(`  Average GIR: ${strategy2.averageGIR}`);

    const scoreDiff = strategy2.expectedScore - strategy1.expectedScore;
    console.log(`\n${chalk.bold('Difference:')}`);
    console.log(`  Score impact: ${scoreDiff > 0 ? '+' : ''}${scoreDiff.toFixed(1)} strokes`);

    console.log();
}

// Run the application
main();
