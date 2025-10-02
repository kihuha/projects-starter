import fs from "fs";
import path from "path";
import { goMainContent } from "./file-contents/main";
import { goReadmeFile } from "./file-contents/readme";

import { OpenApiSpec, PathsObject } from "../../types";

export const generateGoGin = (dirPath: string, openApiSpec?: OpenApiSpec) => {
  const projectName = (
    openApiSpec ? openApiSpec.info.title : "generated-api"
  ).replaceAll(/\s/g, "_");

  // Generate router groups
  let routerGroups = "";

  // directory for the controllers
  const controllerGroups: Record<string, any> = {};

  if (openApiSpec && openApiSpec.paths) {
    const paths: PathsObject = openApiSpec.paths;

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

          methods.forEach((method) => {
            const operation = pathItem[method];
            if (operation) {
              controllerGroups[match].push({
                route,
                method: method.toUpperCase(),
                operationId: operation.operationId,
                summary: operation.summary,
              });
            }
          });
        }
      }
    });
  } else {
    // Default controllers when no OpenAPI spec is provided
    controllerGroups["pets"] = [];
    controllerGroups["stores"] = [];
    controllerGroups["users"] = [];
  }

  // Generate router groups for each controller
  Object.keys(controllerGroups).forEach((groupName) => {
    const singular = groupName.endsWith("s")
      ? groupName.slice(0, -1)
      : groupName;
    const groupVar = `${singular}Group`;

    routerGroups += `\n\t// ${
      groupName.charAt(0).toUpperCase() + groupName.slice(1)
    } routes\n`;
    routerGroups += `\t${groupVar} := server.Group("/${groupName}")\n`;

    // Standard CRUD endpoints
    const endpoints = [
      {
        method: "GET",
        path: `/`,
        description: `Get all ${groupName}`,
      },
      {
        method: "POST",
        path: `/`,
        description: `Create ${singular}`,
      },
      {
        method: "PUT",
        path: `/`,
        description: `Upsert ${singular}`,
      },
      {
        method: "GET",
        path: `/:id`,
        description: `Get ${singular} by ID`,
      },
      {
        method: "PATCH",
        path: `/:id`,
        description: `Update ${singular}`,
      },
      {
        method: "GET",
        path: `/:id/preferences`,
        description: `Get ${singular} preferences`,
      },
      {
        method: "POST",
        path: `/:id/preferences`,
        description: `Create ${singular} preferences`,
      },
      {
        method: "PUT",
        path: `/:id/preferences`,
        description: `Update ${singular} preferences`,
      },
    ];

    endpoints.forEach((endpoint) => {
      routerGroups += `\t${groupVar}.${endpoint.method}("${endpoint.path}", func(c *gin.Context) {\n`;
      routerGroups += `\t\tc.JSON(200, gin.H{\n`;
      routerGroups += `\t\t\t"message": "not implemented",\n`;
      routerGroups += `\t\t})\n`;
      routerGroups += `\t})\n`;
    });
  });

  fs.writeFileSync(
    path.resolve(dirPath, "main.go"),
    goMainContent(routerGroups),
    "utf-8"
  );

  fs.writeFileSync(
    path.resolve(dirPath, "README.md"),
    goReadmeFile(projectName),
    "utf-8"
  );

  // directory for the utils
  fs.mkdirSync(path.resolve(dirPath, "utils"), { recursive: true });
};
