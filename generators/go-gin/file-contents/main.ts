import { OpenApiSpec, PathItemObject } from "../../../types";

export const goMainContent = (openApiSpec: OpenApiSpec) => {
  if (!openApiSpec.paths) {
    return `package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	server.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello there",
		})
	})
	
	server.Run()
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

  const groupsCode = Object.entries(pathMap)
    .map(([group, paths]) => {
      const groupVar = `${group}Group`;
      const groupDeclaration = `\t${groupVar} := server.Group("/${group}")`;

      const handlers = paths
        .flatMap(({ url, methods }) => {
          const routePath = url.replace(`/${group}`, "") || "/";
          return methods.map((method) => {
            const ginMethod = method.toUpperCase();
            return `\t${groupVar}.${ginMethod}("${routePath}", func(c *gin.Context) {
\t\tc.JSON(200, gin.H{
\t\t\t"message": "not implemented",
\t\t})
\t})`;
          });
        })
        .join("\n");

      return `${groupDeclaration}\n${handlers}`;
    })
    .join("\n\n");

  return `package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	server.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello there",
		})
	})

	// API routes
${groupsCode}
	
	server.Run()
}
`;
};
