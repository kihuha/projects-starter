export const tsConfig = `{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    // For nodejs:
    // "lib": ["esnext"],
    "types": ["node"],

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
`;

export const expressDb = `import pgPromise from "pg-promise";

const pgp = pgPromise({});

// It's recommended to store your database connection string in an environment variable for security.
const db = pgp(process.env.DB_CONNECTION_STRING || "");

export default db;
`;

export const expressCache = `import redis from "redis";

const client = redis.createClient({
  url: \`redis://username:password@host:port/db-number\`,
});

client.on("error", (err) => {
  console.log(\`Error \${err}\`);
});

export default client;
`;
