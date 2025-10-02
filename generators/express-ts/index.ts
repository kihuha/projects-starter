import fs from "fs";
import path from "path";
import { expressMainContent } from "./file-contents/main";
import { OpenApiSpec } from "../../types";
import { packageJsonFile } from "./file-contents/deps";
import { readmeFile } from "./file-contents/readme";

const deps =
  "compression cookie-parser cors express express-rate-limit express-winston helmet http-errors morgan redis typescript winston zod";
const devDeps =
  "@types/compression @types/cookie-parser @types/cors @types/express @types/morgan @types/node @types/pg-promise nodemon ts-node";

export const generateExpressTs = (
  dirPath: string,
  openApiSpec?: OpenApiSpec
) => {
  const projectName = (
    openApiSpec ? openApiSpec.info.title : "generated-api"
  ).replaceAll(/\s/g, "_");

  fs.writeFileSync(
    path.resolve(dirPath, "main.ts"),
    expressMainContent(),
    "utf-8"
  );

  fs.writeFileSync(
    path.resolve(dirPath, "package.json"),
    packageJsonFile(projectName),
    "utf-8"
  );

  fs.writeFileSync(
    path.resolve(dirPath, "README.md"),
    readmeFile(deps, devDeps, openApiSpec),
    "utf-8"
  );
};
