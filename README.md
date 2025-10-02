# Project Starter CLI 🚀

A powerful command-line tool that generates API projects from OpenAPI specifications. Supports both **Node.js Express with TypeScript** and **Go Gin** frameworks.

## Features ✨

- **OpenAPI-Driven Generation**: Create projects from OpenAPI 3.x specifications (JSON/YAML)
- **Multiple Templates**: Choose between Node.js Express TypeScript or Go Gin frameworks
- **Flexible Input**: Support for OpenAPI specs via URL, local file, or skip entirely
- **Production Ready**: Generated projects include essential middleware, error handling, and best practices
- **Interactive CLI**: Beautiful command-line interface with validation and helpful prompts

## Quick Start 🏃‍♂️

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd project-starter

# Install dependencies
npm install

# Build the project
npm run build
```

### Usage

Run the CLI tool:

```bash
npm start
# or for development
npm run dev
```

The tool will guide you through:

1. **OpenAPI Specification**: Provide a URL, file path, or skip
2. **Template Selection**: Choose your preferred framework
3. **Project Generation**: Automatic scaffolding in `./generated-project`

### Example

```bash
$ npm start

🚀 Welcome to Project Starter CLI!

📄 OpenAPI Specification
Enter your OpenAPI spec URL or file path (JSON/YAML) (or press Enter for NA): https://api.example.com/openapi.json

🛠️  Project Template
Available templates:
  1. Node.js Express with TypeScript
  2. Go Gin

Select template (1, 2): 1

✨ Success! Your project has been generated successfully!
```

## Supported Templates 📋

### 1. Node.js Express with TypeScript

Generated project includes:

- Express.js server with TypeScript
- Essential middleware (CORS, helmet, compression, rate limiting)
- Winston logging with request tracking
- Redis session support
- Zod schema validation
- Error handling middleware
- Development and production scripts

**Dependencies**: compression, cookie-parser, cors, express, express-rate-limit, express-winston, helmet, http-errors, morgan, redis, typescript, winston, zod

### 2. Go Gin

Generated project includes:

- Gin web framework setup
- Clean project structure
- Ready-to-run HTTP server
- Basic middleware configuration

## OpenAPI Integration 🔌

When an OpenAPI specification is provided, the tool:

- Validates the specification format (JSON/YAML)
- Extracts project metadata (title, description)
- Uses the title as the generated project name
- Sets up the foundation for API endpoint generation

**Supported Sources**:

- 🌐 **URLs**: `https://api.example.com/openapi.json`
- 📁 **Local Files**: `./specs/api.yaml`
- ⏭️ **Skip**: Generate basic template without spec

## Project Structure 📁

After generation, your project will be in `./generated-project/`:

**Node.js Express TypeScript**:

```
generated-project/
├── main.ts           # Application entry point
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```

**Go Gin**:

```
generated-project/
├── main.go           # Application entry point
├── go.mod            # Go module definition
└── README.md         # Project documentation
```

## Development 🛠️

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run the CLI
- `npm run dev` - Run in development mode with ts-node

### CLI Binary

The project can be used as a global CLI tool:

```bash
npm run build
# The binary is available at ./dist/script.js
```

## Requirements 📋

- **Node.js**: 16+
- **npm**: 7+
- **TypeScript**: 5.x
- **Internet connection**: Required for fetching OpenAPI specs from URLs

## Error Handling 🛡️

The CLI gracefully handles:

- Invalid OpenAPI specifications
- Network timeouts when fetching remote specs
- File system permissions
- Invalid template selections
- Interrupted operations (Ctrl+C)

## Goals 🎯

- **Rapid Prototyping**: Get from OpenAPI spec to running code in seconds
- **Best Practices**: Generate production-ready code with industry standards
- **Developer Experience**: Beautiful, intuitive CLI with helpful feedback
- **Flexibility**: Support multiple frameworks and input methods
- **Consistency**: Maintain uniform project structure across templates

## License 📄

See [LICENSE](./LICENSE) file for details.
