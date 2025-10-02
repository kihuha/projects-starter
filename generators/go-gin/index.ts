import fs from "fs";
import path from "path";
import { goMainContent } from "./file-contents/main";
import { goReadmeFile } from "./file-contents/readme";

import { OpenApiSpec } from "../../types";

export const generateGoGin = (dirPath: string, openApiSpec?: OpenApiSpec) => {
  const projectName = (
    openApiSpec ? openApiSpec.info.title : "generated-api"
  ).replaceAll(/\s/g, "_");

  fs.writeFileSync(path.resolve(dirPath, "main.go"), goMainContent, "utf-8");

  fs.writeFileSync(
    path.resolve(dirPath, "README.md"),
    goReadmeFile(projectName),
    "utf-8"
  );
};
