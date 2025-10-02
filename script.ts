#!/usr/bin/env node

import readline from "readline";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import axios from "axios";
import yaml from "js-yaml";
import { generateExpressTs } from "./generators/express-ts";
import { generateGoGin } from "./generators/go-gin";
import { OpenApiSpec } from "./types";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const TEMPLATES = {
  nodejs: "Node.js Express with TypeScript",
  go: "Go Gin",
};

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

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

function showLoader(message: string, duration: number = 2000): Promise<void> {
  return new Promise((resolve) => {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let i = 0;

    console.log();
    const interval = setInterval(() => {
      process.stdout.write(
        `\r${chalk.cyan(frames[i % frames.length])} ${chalk.white(message)}`
      );
      i++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      process.stdout.write("\r" + " ".repeat(50) + "\r");
      resolve();
    }, duration);
  });
}

async function main() {
  console.log(chalk.bold.blue("\n🚀 Welcome to Project Starter CLI!\n"));
  console.log(
    chalk.gray(
      "This tool will help you generate a new project from a template.\n"
    )
  );

  try {
    console.log(chalk.yellow("📄 OpenAPI Specification"));
    const openApiSpec = await askQuestion(
      chalk.white(
        "Enter your OpenAPI spec URL or file path (JSON/YAML) (or press Enter for NA): "
      )
    );
    const finalOpenApiSpec = openApiSpec || "NA";

    console.log(chalk.green(`✓ OpenAPI spec: ${finalOpenApiSpec}\n`));

    console.log(chalk.yellow("🛠️  Project Template"));
    console.log(chalk.gray("Available templates:"));
    const templateKeys = Object.keys(TEMPLATES);
    templateKeys.forEach((key, idx) => {
      console.log(
        chalk.gray(`  ${idx + 1}. ${TEMPLATES[key as keyof typeof TEMPLATES]}`)
      );
    });
    console.log();

    let templateChoice = "";
    let validChoice = false;

    while (!validChoice) {
      const templateOptions = templateKeys
        .map((key, idx) => `${idx + 1}`)
        .join(", ");
      templateChoice = await askQuestion(
        chalk.white(`Select template (${templateOptions}): `)
      );

      const choiceNum = parseInt(templateChoice);
      if (choiceNum >= 1 && choiceNum <= templateKeys.length) {
        validChoice = true;
      } else {
        console.log(
          chalk.red(
            `❌ Please enter a number between 1 and ${templateKeys.length}\n`
          )
        );
      }
    }

    const choiceIndex = parseInt(templateChoice) - 1;
    const selectedTemplateKey = templateKeys[choiceIndex];
    const selectedTemplate =
      TEMPLATES[selectedTemplateKey as keyof typeof TEMPLATES];
    console.log(chalk.green(`✓ Template: ${selectedTemplate}\n`));

    const outputDir = path.resolve(process.cwd(), "generated-project");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let parsedOpenApiSpec: OpenApiSpec | undefined;
    if (finalOpenApiSpec !== "NA") {
      try {
        if (finalOpenApiSpec.startsWith("http")) {
          console.log(chalk.cyan("🌐 Fetching OpenAPI spec from URL..."));
          const response = await axios.get(finalOpenApiSpec, {
            timeout: 10000, // 10 second timeout
            headers: {
              Accept: "application/json, application/yaml, text/yaml",
            },
          });

          let specContent = response.data;

          if (typeof specContent === "string") {
            parsedOpenApiSpec = parseOpenApiSpec(specContent, finalOpenApiSpec);
          } else {
            parsedOpenApiSpec = specContent as OpenApiSpec;
          }

          console.log(
            chalk.green("✓ Successfully fetched OpenAPI spec from URL")
          );
        } else if (fs.existsSync(finalOpenApiSpec)) {
          console.log(chalk.cyan("📁 Reading OpenAPI spec from file..."));
          const specContent = fs.readFileSync(finalOpenApiSpec, "utf-8");
          parsedOpenApiSpec = parseOpenApiSpec(specContent, finalOpenApiSpec);
          console.log(
            chalk.green("✓ Successfully loaded OpenAPI spec from file")
          );
        } else {
          console.log(
            chalk.yellow(
              "⚠️  OpenAPI spec file not found. Continuing without spec."
            )
          );
        }
      } catch (error) {
        console.log(
          chalk.yellow(
            `⚠️  Failed to fetch/parse OpenAPI spec: ${
              error instanceof Error ? error.message : "Unknown error"
            }. Continuing without spec.`
          )
        );
      }
    }

    // clear generated-project if present
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (selectedTemplateKey === "nodejs") {
      generateExpressTs(outputDir, parsedOpenApiSpec);
    } else if (selectedTemplateKey === "go") {
      generateGoGin(outputDir, parsedOpenApiSpec);
    }

    console.log(chalk.bold.cyan("📋 Project Configuration Summary:"));
    console.log(
      chalk.white(`   OpenAPI Spec: ${chalk.cyan(finalOpenApiSpec)}`)
    );
    console.log(chalk.white(`   Template: ${chalk.cyan(selectedTemplate)}\n`));

    await showLoader("Generating project files...");

    console.log(
      chalk.bold.green(
        "✨ Success! Your project has been generated successfully!\n"
      )
    );
    console.log(chalk.gray("Your project is ready to use. Happy coding! 🎉\n"));
  } catch (error) {
    console.error(chalk.red("\n❌ An error occurred:"), error);
  } finally {
    rl.close();
  }
}

process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\n👋 Goodbye!"));
  rl.close();
  process.exit(0);
});

main().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});
