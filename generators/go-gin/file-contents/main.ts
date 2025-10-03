import { OpenApiSpec, PathItemObject } from "../../../types";
import { generateFunctionName } from "./services";

export const goMainContent = (openApiSpec: OpenApiSpec) => {
  if (!openApiSpec.paths) {
    return `package main

import (
	"net/http"
	"log"

	"github.com/gin-gonic/gin"
	"./utils"
)

func main() {
	// Initialize database
	utils.InitDB()
	defer utils.CloseDB()

	server := gin.Default()

	server.GET("/", GetRoot)
	
	server.Run()
}

// Root handler
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

  // Generate import statements for service packages
  const serviceImports = Object.keys(pathMap)
    .map((group) => `\t"./services/${group}Service"`)
    .join("\n");

  const groupsCode = Object.entries(pathMap)
    .map(([group, paths]) => {
      const groupVar = `${group}Group`;
      const groupDeclaration = `\t${groupVar} := server.Group("/${group}")`;

      const handlers = paths
        .flatMap(({ url, methods }) => {
          const routePath = url.replace(`/${group}`, "") || "/";
          return methods.map((method) => {
            const ginMethod = method.toUpperCase();
            const functionName = generateFunctionName(method, group, routePath);
            const servicePackage = `${group}Service`;

            return `\t${groupVar}.${ginMethod}("${routePath}", ${servicePackage}.${functionName})`;
          });
        })
        .join("\n");

      return `${groupDeclaration}\n${handlers}`;
    })
    .join("\n\n");

  return `package main

import (
	"net/http"
	"log"

	"github.com/gin-gonic/gin"
	"./utils"
${serviceImports}
)

func main() {
	// Initialize database
	utils.InitDB()
	defer utils.CloseDB()

	server := gin.Default()

	server.GET("/", GetRoot)

	// API routes
${groupsCode}
	
	server.Run()
}

// Root handler
func GetRoot(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello there",
	})
}
`;
};
