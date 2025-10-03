import { OpenApiSpec } from "../../../types";

export const goReadmeFile = (deps: string, openApiSpec?: OpenApiSpec) => `
# ${openApiSpec ? openApiSpec.info.title : "Go Gin API"} 

${openApiSpec ? openApiSpec.info.description : "<add description here>"}


## Getting Started

### Prerequisites

- Go 1.16 or later
- PostgreSQL database

### Installation

1. Initialize a Go module:
   \`\`\`bash
   go mod init <project name>
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   go get -u ${deps}
   go get -u github.com/lib/pq
   \`\`\`

### Database Setup

1. Create a PostgreSQL database for your application.

2. Set up environment variables for database connection:
   \`\`\`bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_USER=your_db_user
   export DB_PASSWORD=your_db_password
   export DB_NAME=your_db_name
   \`\`\`

   Or create a \`.env\` file in your project root:
   \`\`\`
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   \`\`\`

### Running the Application

1. Make sure your PostgreSQL database is running and accessible.

2. Run the application:
   \`\`\`bash
   go run main.go
   \`\`\`

   The server will start on the default port (8080). You should see a message confirming the database connection.

## Database

This application uses PostgreSQL as its database. The database connection is handled in \`utils/db.go\`.

Key features:
- Automatic connection pooling
- Environment-based configuration
- Connection health checking
- Graceful connection cleanup

## API Endpoints

${
  openApiSpec && openApiSpec.paths
    ? Object.keys(openApiSpec.paths)
        .map((path) => {
          const methods = Object.keys(openApiSpec.paths![path] as any);
          return `- \`${methods.join("|").toUpperCase()} ${path}\``;
        })
        .join("\n")
    : "- `GET /` - Health check endpoint"
}

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USER | Database username | your_db_user |
| DB_PASSWORD | Database password | your_db_password |
| DB_NAME | Database name | your_db_name |
`;
