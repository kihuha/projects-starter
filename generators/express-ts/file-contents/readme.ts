import { OpenApiSpec } from "../../../types";

export const readmeFile = (
  deps: string,
  devDeps: string,
  openApiSpec?: OpenApiSpec
) => `
# ${openApiSpec ? openApiSpec.info.title : "Express TypeScript API"} 

${openApiSpec ? openApiSpec.info.description : "<add description here>"}

## Getting Started

1. Install dependencies:
Before starting the project, be sure to install the dependencies and the dev dependencies

  \`\`\`bash
  yarn add ${deps}
  \`\`\`

    \`\`\`bash
  yarn add ${devDeps} --dev
  \`\`\`

`;
