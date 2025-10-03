import fs from "fs";
import path from "path";
import { goMainContent } from "./file-contents/main";
import { goReadmeFile } from "./file-contents/readme";
import {
  generateModuleService,
  getPathMapping,
} from "./file-contents/services";
import { goDbContent } from "./file-contents/db";

import { OpenApiSpec, PathItemObject } from "../../types";

export const generateGoGin = (dirPath: string, openApiSpec?: OpenApiSpec) => {
  const deps = "github.com/gin-gonic/gin";

  if (openApiSpec && openApiSpec.paths) {
    // spec provided
    const urls = Object.keys(openApiSpec.paths);

    const mainModules = new Set();

    urls.map((url) => mainModules.add(url.split("/")[1]));

    const pathMap: Record<
      string,
      Array<{ url: string; handlers: PathItemObject }>
    > = {};

    urls.map((url) => {
      // determine module
      const key = url.split("/")[1] as string;

      if (!(key in pathMap)) {
        pathMap[key] = [];
      }
      (pathMap[key] as any).push({
        url: url,
        handlers: { ...(openApiSpec.paths || {})[url] },
      });
    });

    // Generate main.go with service function calls
    fs.writeFileSync(
      path.resolve(dirPath, "main.go"),
      goMainContent(openApiSpec),
      "utf-8"
    );

    // Create services directory
    const servicesDir = path.resolve(dirPath, "services");
    fs.mkdirSync(servicesDir, { recursive: true });

    // Get path mapping for services
    const servicePathMap = getPathMapping(openApiSpec);

    // Generate individual service files for each module
    Object.entries(servicePathMap).forEach(([module, paths]) => {
      const serviceFileName = `${module}Service.go`;
      const serviceFilePath = path.resolve(servicesDir, serviceFileName);

      fs.writeFileSync(
        serviceFilePath,
        generateModuleService(module, paths),
        "utf-8"
      );
    });
  } else {
    // No spec provided, generate basic files
    fs.writeFileSync(
      path.resolve(dirPath, "main.go"),
      goMainContent({} as OpenApiSpec),
      "utf-8"
    );

    // Create services directory even for basic setup
    const servicesDir = path.resolve(dirPath, "services");
    fs.mkdirSync(servicesDir, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(dirPath, "README.md"),
    goReadmeFile(deps, openApiSpec),
    "utf-8"
  );

  // directory for the utils
  fs.mkdirSync(path.resolve(dirPath, "utils"), { recursive: true });
  fs.writeFileSync(
    path.resolve(dirPath, "utils/db.go"),
    goDbContent(),
    "utf-8"
  );
};
