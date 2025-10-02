import { OpenApiSpec } from "../../../types";

export const goReadmeFile = (deps: string, openApiSpec?: OpenApiSpec) => `
# ${openApiSpec ? openApiSpec.info.title : "Go Gin API"} 

${openApiSpec ? openApiSpec.info.description : "<add description here>"}


## Getting Started

1. Install dependencies:
Before starting the project, be sure to:

  - initialize a module
    \`\`\`bash
    go mod init <project name>
    \`\`\`

  - install deps
    \`\`\`bash
    go get -u ${deps}
    \`\`\`
`;
