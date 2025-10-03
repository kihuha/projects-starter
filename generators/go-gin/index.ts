import fs from "fs";
import path from "path";
import { goMainContent } from "./file-contents/main";
import { goReadmeFile } from "./file-contents/readme";

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

    fs.writeFileSync(
      path.resolve(dirPath, "main.go"),
      goMainContent(openApiSpec),
      "utf-8"
    );
  }

  fs.writeFileSync(
    path.resolve(dirPath, "README.md"),
    goReadmeFile(deps, openApiSpec),
    "utf-8"
  );

  // directory for the utils
  fs.mkdirSync(path.resolve(dirPath, "utils"), { recursive: true });
};
