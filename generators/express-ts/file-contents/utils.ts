export const tsConfig = `{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    "rootDir": "./",
    "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    "types": ["node"],
    "lib": ["esnext"],

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
  },
  "include": ["script.ts"],
  "exclude": ["node_modules", "dist"]
}
`;

export const expressDb = `import pgPromise from "pg-promise";

const pgp = pgPromise({});

const db = pgp("postgres://username:password@host:port/database");

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
