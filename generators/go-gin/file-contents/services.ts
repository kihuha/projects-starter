import { OpenApiSpec, PathItemObject } from "../../../types";

// Helper function to generate function name based on method and path
function generateFunctionName(
  method: string,
  group: string,
  routePath: string
): string {
  const methodName =
    method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();

  if (methodName === "Get") {
    if (routePath === "/") {
      return `Get${group.charAt(0).toUpperCase() + group.slice(1)}`;
    } else {
      const pathParts = routePath
        .split("/")
        .filter(Boolean)
        .map((part) => {
          if (part.startsWith("{") && part.endsWith("}")) {
            return "ById";
          }
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("");
      return `Get${group.charAt(0).toUpperCase() + group.slice(1)}${pathParts}`;
    }
  } else if (methodName === "Post") {
    if (routePath === "/") {
      return `Create${group.charAt(0).toUpperCase() + group.slice(1)}`;
    } else {
      const pathParts = routePath
        .split("/")
        .filter(Boolean)
        .map((part) => {
          if (part.startsWith("{") && part.endsWith("}")) {
            return "ById";
          }
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("");
      return `${methodName}${
        group.charAt(0).toUpperCase() + group.slice(1)
      }${pathParts}`;
    }
  } else if (methodName === "Put") {
    if (routePath === "/") {
      return `Update${group.charAt(0).toUpperCase() + group.slice(1)}`;
    } else {
      const pathParts = routePath
        .split("/")
        .filter(Boolean)
        .map((part) => {
          if (part.startsWith("{") && part.endsWith("}")) {
            return "ById";
          }
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("");
      return `Update${
        group.charAt(0).toUpperCase() + group.slice(1)
      }${pathParts}`;
    }
  } else if (methodName === "Delete") {
    const pathParts = routePath
      .split("/")
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith("{") && part.endsWith("}")) {
          return "ById";
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join("");
    return `Delete${
      group.charAt(0).toUpperCase() + group.slice(1)
    }${pathParts}`;
  } else {
    // For other methods like PATCH, OPTIONS, etc.
    const pathParts = routePath
      .split("/")
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith("{") && part.endsWith("}")) {
          return "ById";
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join("");
    return `${methodName}${
      group.charAt(0).toUpperCase() + group.slice(1)
    }${pathParts}`;
  }
}

// Generate individual service file for a specific module
export const generateModuleService = (
  module: string,
  paths: Array<{ url: string; methods: string[] }>
) => {
  const packageName = `${module}Service`;

  const serviceFunctions = paths
    .flatMap(({ url, methods }) => {
      return methods.map((method) => {
        const routePath = url.replace(`/${module}`, "") || "/";
        const functionName = generateFunctionName(method, module, routePath);

        return `func ${functionName}(c *gin.Context) {
	// TODO: Implement business logic for ${method.toUpperCase()} ${url}
	c.JSON(200, gin.H{
		"message": "not implemented",
	})
}`;
      });
    })
    .join("\n\n");

  return `package ${packageName}

import (
	"github.com/gin-gonic/gin"
)

${serviceFunctions}
`;
};

// Generate main services file (for backward compatibility)
export const generateGinServices = (openApiSpec: OpenApiSpec) => {
  if (!openApiSpec.paths) {
    return `package main

import (
	"github.com/gin-gonic/gin"
)

// Example service function
func GetRoot(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello there",
	})
}
`;
  }

  const urls = Object.keys(openApiSpec.paths);
  const pathMap: Record<string, Array<{ url: string; methods: string[] }>> = {};

  urls.forEach((url) => {
    const key = url.split("/")[1] as string;
    if (!key) return;

    if (!(key in pathMap)) {
      pathMap[key] = [];
    }

    const pathItem = openApiSpec.paths![url] as PathItemObject;
    const methods = Object.keys(pathItem).filter((method) =>
      ["get", "post", "put", "delete", "patch", "options", "head"].includes(
        method.toLowerCase()
      )
    );

    pathMap[key]!.push({
      url: url,
      methods: methods,
    });
  });

  return { pathMap };
};

// Get path mapping for generating separate service files
export const getPathMapping = (openApiSpec: OpenApiSpec) => {
  if (!openApiSpec.paths) {
    return {};
  }

  const urls = Object.keys(openApiSpec.paths);
  const pathMap: Record<string, Array<{ url: string; methods: string[] }>> = {};

  urls.forEach((url) => {
    const key = url.split("/")[1] as string;
    if (!key) return;

    if (!(key in pathMap)) {
      pathMap[key] = [];
    }

    const pathItem = openApiSpec.paths![url] as PathItemObject;
    const methods = Object.keys(pathItem).filter((method) =>
      ["get", "post", "put", "delete", "patch", "options", "head"].includes(
        method.toLowerCase()
      )
    );

    pathMap[key]!.push({
      url: url,
      methods: methods,
    });
  });

  return pathMap;
};

// Export the function name generator for use in main.ts
export { generateFunctionName };
