export const packageJsonFile = (name: string) => `{
  "name": "${name}",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon src/main.ts"
  },
  "dependencies": {

  },
  "devDependencies": {
 
  }
}
`;
