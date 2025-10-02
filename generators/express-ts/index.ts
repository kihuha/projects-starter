import fs from "fs";
import path from "path";
import { expressMainContent } from "./file-contents/main";
import { OpenApiSpec, PathsObject } from "../../types";
import { packageJsonFile } from "./file-contents/deps";
import { readmeFile } from "./file-contents/readme";
import { expressController } from "./file-contents/controller";
import { tsConfig, expressDb, expressCache } from "./file-contents/utils";

const deps =
  "compression cookie-parser cors express express-rate-limit express-winston helmet http-errors morgan redis typescript winston zod";
const devDeps =
  "@types/compression @types/cookie-parser @types/cors @types/express @types/morgan @types/node @types/pg-promise @types/helmet @types/express-rate-limit nodemon ts-node";

export const generateExpressTs = (
  dirPath: string,
  openApiSpec?: OpenApiSpec
) => {
  const projectName = (
    openApiSpec ? openApiSpec.info.title : "generated-api"
  ).replaceAll(/\s/g, "_");

  fs.writeFileSync(
    path.resolve(dirPath, "package.json"),
    packageJsonFile(projectName),
    "utf-8"
  );

  fs.writeFileSync(path.resolve(dirPath, "tsconfig.json"), tsConfig, "utf-8");

  fs.writeFileSync(
    path.resolve(dirPath, "README.md"),
    readmeFile(deps, devDeps, openApiSpec),
    "utf-8"
  );

  // directory for the utils
  fs.mkdirSync(path.resolve(dirPath, "utils"), { recursive: true });
  fs.writeFileSync(path.resolve(dirPath, "utils", "db.ts"), expressDb, "utf-8");
  fs.writeFileSync(
    path.resolve(dirPath, "utils", "cache.ts"),
    expressCache,
    "utf-8"
  );

  // directory for the controllers
  const routerGroups: string[] = [];
  fs.mkdirSync(path.resolve(dirPath, "controllers"), { recursive: true });
  if (openApiSpec && openApiSpec.paths) {
    const paths: PathsObject = openApiSpec.paths;
    const controllerGroups: Record<
      string,
      {
        route: string;
        method: string;
        operationId?: string;
        summary?: string;
      }[]
    > = {};

    Object.keys(paths).forEach((route: string) => {
      const match = route.split("/").filter(Boolean)[0];
      if (match) {
        if (!controllerGroups[match]) controllerGroups[match] = [];

        const pathItem = paths[route];
        if (pathItem) {
          const methods = [
            "get",
            "post",
            "put",
            "delete",
            "patch",
            "head",
            "options",
            "trace",
          ] as const;
          const groupRoutes = controllerGroups[match]; // Store reference to avoid undefined error

          methods.forEach((method) => {
            const operation = pathItem[method];
            if (operation) {
              const routeInfo: {
                route: string;
                method: string;
                operationId?: string;
                summary?: string;
              } = {
                route,
                method: method.toUpperCase(),
              };

              if (operation.operationId) {
                routeInfo.operationId = operation.operationId;
              }
              if (operation.summary) {
                routeInfo.summary = operation.summary;
              }

              groupRoutes.push(routeInfo);
            }
          });
        }
      }
    });

    Object.keys(controllerGroups).forEach((group: string) => {
      const controllerFile: string = path.resolve(
        dirPath,
        "controllers",
        `${group}Controller.ts`
      );

      fs.writeFileSync(
        controllerFile,
        expressController(controllerGroups, group),
        "utf-8"
      );
      routerGroups.push(group);
    });
  }

  fs.writeFileSync(
    path.resolve(dirPath, "main.ts"),
    expressMainContent(routerGroups),
    "utf-8"
  );
};
