import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { generateGoGin } from "./generators/go-gin";
import { OpenApiSpec } from "./types";

function parseOpenApiSpec(content: string, filename?: string): OpenApiSpec {
  try {
    return JSON.parse(content) as OpenApiSpec;
  } catch (jsonError) {
    try {
      return yaml.load(content) as OpenApiSpec;
    } catch (yamlError) {
      const fileInfo = filename ? ` in file "${filename}"` : "";
      throw new Error(
        `Failed to parse OpenAPI spec${fileInfo}. Content must be valid JSON or YAML format.`
      );
    }
  }
}

const spec = fs.readFileSync(
  path.resolve(__dirname, "sample-spec.json"),
  "utf-8"
);

const outputDir = path.resolve(process.cwd(), "generated-project");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
}
generateGoGin(outputDir, parseOpenApiSpec(spec));
