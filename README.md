# AutoCode

AutoCode is an innovative automatic coding tool designed to bootstrap any software project incrementally, transforming README.md instructions into a fully functional software project using Claude 4 Sonnet, Gemini 2.5 Pro and others. AutoCode was bootstrapped by itself from one simple prompt.

## Features

-   NodeJS-based console application
-   Automatic code generation based on README.md instructions
-   Incremental project building
-   Creates and modifies source files in the current folder and subfolders
-   Self-updating README.md with new design ideas and considerations
-   Code quality checks and suggestions/auto fixes
-   Automatic dependency management and creation of missing files
-   Adherence to DRY, KISS, and SRP principles
-   Intelligent code analysis and refactoring suggestions
-   Automated documentation generation
-   User-friendly command-line interface
-   Support for multiple programming languages
-   AI-powered agents for specialized tasks
-   Cross-platform compatibility (Windows, macOS, Linux)
-   Syntax checking and auto-fixing

## Installation

No installation is required. AutoCode can be run directly using npx.

## Usage

1. Create CLAUDE_KEY (GEMINI_KEY, OPENAI_KEY) environment variable (get your key here https://console.anthropic.com/settings/keys)
2. Navigate to your project folder in the terminal.
3. Run the following command:

```
npx autocode-ai
```

4. Select your model from menu
5. Follow the prompts and watch as your project comes to life!

## How It Works

AutoCode reads your README.md file and your sources and sends the instructions to the Claude 3.5 Sonnet API. The API interprets the instructions and generates the necessary code structure, files, and content. AutoCode then saves the generated code back to your project directory. It can now generate code for different languages based on the project requirements and applies language-specific linting and formatting.

## Requirements

-   Node.js (version 20.0.0 or higher)
-   Use async/await, ES6 modules, and fetch (no axios please)

## Boilerplate

-   https://github.com/msveshnikov/boiler-plate (MERN stack with auth, roles, payments, chat, notifications, settings, admin panel and more)
-   put your project description in README.md
-   start brainstorming (p.1)
-   replace "boiler" with your project name in all source files
-   generate code (p.2) - not too much at once (5-7 files max)
-   revisit README often, it is your main source of truth. Remove unrealistic goals and tasks.
-   your MVP ready in 2-3 hours
-   fix deploy to your VPS/nginx/certbot/docker

## Project Structure

-   `codeAnalyzer.js`: Analyzes existing code for quality and improvement opportunities
-   `codeGenerator.js`: Generates new code based on instructions and API responses
-   `config.js`: Manages configuration settings for the application, including language-specific configs
-   `documentationGenerator.js`: Automatically generates documentation for the project
-   `fileManager.js`: Handles file operations and project structure management
-   `index.js`: Main entry point of the application
-   `userInterface.js`: Manages user interactions and command-line interface
-   `landing.html`: Template for generating project landing pages
-   `licenseManager.js`: Handles license management and validation
-   `server/index.js`: Express.js backend main point
-   `server/license-server.js`: Route for license management

## Supported Languages

AutoCode currently supports the following programming languages:

-   JavaScript (including TypeScript)
-   Python
-   C#
-   Java
-   Ruby
-   Go
-   Rust
-   PHP
-   Swift
-   Kotlin
-   Dart

Each language has its own configuration for file extensions, recommended linter, formatter, and package manager.

## AI Agents

AutoCode includes specialized AI agents that can handle specific aspects of software development:

- **Project Manager Agent**: Analyzes project scope, creates milestones, and manages task prioritization
- **DevOps Agent**: Handles CI/CD pipeline configuration, containerization, and deployment automation
- **Internationalization Agent**: Implements i18n/l10n support across the application
- **Tester Agent**: Generates comprehensive unit tests and integration tests for your codebase
- **Marketing Agent**: Creates marketing materials, landing pages, and project descriptions
- **Business Analyst Agent**: Analyzes business requirements and creates user stories
- **Product Owner Agent**: Defines product roadmap and feature prioritization
- **App Store Publisher Agent**: Prepares app store listings and publishing materials

## Supported AI Models

AutoCode now supports multiple AI providers and models:

### Anthropic Claude
- `claude-sonnet-4-20250514` (default)
- `claude-sonnet-4-5`
- Requires: `CLAUDE_KEY` environment variable

### Google Gemini
- `gemini-2.0-flash-thinking-exp-01-21`
- `gemini-2.5-flash`
- `gemini-flash-latest`
- `gemini-2.5-pro`
- Requires: `GEMINI_KEY` environment variable

### OpenAI
- `gpt-5-mini`
- `o3-mini`
- `o4-mini`
- Requires: `OPENAI_KEY` environment variable

### DeepSeek
- `deepseek-reasoner`
- `deepseek-chat`
- Requires: `DEEPSEEK_KEY` environment variable

### Grok
- `grok-4-fast`
- Requires: `GROK_KEY` environment variable

## Advanced Features

### Temperature Control
Adjust the creativity and randomness of AI-generated code by changing the temperature setting (0.0 to 1.0). Lower values produce more deterministic output, while higher values increase creativity.

### Automated Workflows

**Option 2 - Generate Code**: Select specific files from your project to process with AI-powered code generation

**Option 3 - Detect Missing Dependencies**: Automatically identifies and suggests missing npm/pip/gem packages

**Option 4 - Run Static Code Quality Checks**: Executes linters and automatically fixes common issues

**Option 5 - Generate Documentation**: Creates comprehensive documentation from your codebase

**Option 6 - Optimize and Refactor**: Analyzes code for optimization opportunities and refactoring suggestions

**Option 7 - Chat Interface**: Interactive mode for custom code modifications and feature requests

**Option 8 - Generate Project Documentation**: Creates complete project documentation including architecture diagrams

**Option 9 - Analyze Code Quality**: Deep analysis of code quality metrics and anti-patterns

**Option 10 - Optimize Project Structure**: Suggests and implements better project organization

**Option 11 - Add New File**: Guided creation of new files with appropriate templates

**Option 12 - Run AI Agents**: Execute specialized AI agents for targeted tasks

**Option 13 - Security Analysis**: Scans for security vulnerabilities and common attack vectors

**Option 14 - Generate Unit Tests**: Automatically creates comprehensive test suites

**Option 15 - Analyze Performance**: Identifies performance bottlenecks and optimization opportunities

**Option 16 - Generate Landing Page**: Creates marketing landing pages from your README

**Option 17 - Generate API Documentation**: Generates complete API reference documentation

**Option 18 - Generate Full Project**: End-to-end project generation from README specification

### Automated Mode

Run AutoCode in non-interactive mode for CI/CD integration:

```bash
node index.js generate <model> <api-key>
```

This will:
1. Brainstorm and update README.md
2. Generate code for all project files
3. Exit automatically when complete

## Best Practices

1. **Start Small**: Begin with 5-7 files at a time to avoid overwhelming the AI
2. **Iterate Frequently**: Run brainstorming often to keep README aligned with your vision
3. **Review Generated Code**: Always review AI-generated code before committing
4. **Use Version Control**: Commit before running AutoCode to easily revert if needed
5. **Clear README Instructions**: The more detailed your README, the better the generated code
6. **Leverage AI Agents**: Use specialized agents for specific tasks rather than general code generation
7. **Monitor Token Usage**: Keep track of API usage to manage costs
8. **Test Incrementally**: Test each generation cycle before moving to the next
9. **Keep Dependencies Updated**: Regularly update npm packages for security and features
10. **Document Decisions**: Add architectural decisions to README for context

## Architecture

AutoCode follows a modular architecture:

```
index.js (Main Entry)
    ├── userInterface.js (CLI Interface)
    ├── fileManager.js (File I/O Operations)
    ├── codeGenerator.js (Code Generation Logic)
    │   └── model.js (AI Model Abstraction)
    │       ├── openai.js
    │       ├── gemini.js
    │       ├── deepseek.js
    │       └── grok.js
    ├── codeAnalyzer.js (Quality Analysis)
    ├── documentationGenerator.js (Docs Generation)
    ├── config.js (Configuration Management)
    └── AI Agents/
        ├── ProjectManagerAgent.js
        ├── DevOpsAgent.js
        ├── TesterAgent.js
        ├── MarketingAgent.js
        ├── BusinessAnalystAgent.js
        ├── ProductOwnerAgent.js
        ├── InternationalizationAgent.js
        └── AppStorePublisherAgent.js
```

## Troubleshooting

### API Key Issues
- Ensure environment variables are set correctly
- Check API key validity and credit balance
- Verify network connectivity to AI provider endpoints

### Network Errors
- Check firewall settings
- Verify proxy configuration if behind corporate network
- Ensure DNS resolution is working

### Code Generation Issues
- Make README more specific and detailed
- Reduce number of files processed at once
- Try different AI models
- Adjust temperature setting

### Performance Optimization
- Use streaming responses for large files (coming soon)
- Implement caching for repeated operations
- Batch process related files together
- Use faster models like `gemini-flash-latest` for simple tasks

## Roadmap

- [ ] Streaming support for real-time code generation
- [ ] Local LLM support (Ollama, LM Studio)
- [ ] GitHub integration for automatic PR creation
- [ ] Web UI for visual project management
- [ ] Plugin system for custom AI agents
- [ ] Multi-file refactoring with dependency awareness
- [ ] Code review automation with inline suggestions
- [ ] Integration with popular IDEs (VS Code, JetBrains)
- [ ] Support for more programming languages (Scala, Haskell, Elixir)
- [ ] Cost tracking and optimization features
- [ ] Team collaboration features
- [ ] Project templates marketplace
- [ ] Automated testing and deployment pipelines

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: https://github.com/msveshnikov/autocode-ai/issues
- Documentation: https://autocode.work
- Community: Join our Discord server

## Acknowledgments

- Built with Claude 4 Sonnet API by Anthropic
- Powered by Google Gemini, OpenAI, DeepSeek, and Grok models
- Created by Max Sveshnikov
- Bootstrap by AutoCode itself from a single prompt

# TODO
