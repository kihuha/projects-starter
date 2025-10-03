import { PathItemObject } from "../../../types";

export const generateGinController = (
  module: string,
  handlers: Array<{ url: string; handlers: PathItemObject }>
) => {
  const nameMapping: Record<string, string> = {
    get: "Get",
    post: "Create",
    put: "Update",
    delete: "Delete",
  };
  const handlerFunctions = handlers
    .map(({ url, handlers: pathHandlers }) => {
      // Replace {id} with :id in the URL
      const normalizedUrl = url.replace(/{(\w+)}/g, ":$1");

      return Object.entries(pathHandlers)
        .map(([method, operation]) => {
          const methodName =
            nameMapping[method.toLowerCase()] ||
            method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();

          // Check if the URL contains an ":id" parameter
          const isById = normalizedUrl.includes(":id");

          // Build function name parts
          const urlParts = normalizedUrl
            .split("/")
            .filter(Boolean)
            .map(
              (segment) =>
                segment.charAt(0).toUpperCase() +
                segment.replace(/^:/, "").slice(1)
            );

          let functionName = `${methodName}${urlParts.join("")}`;
          if (isById) {
            functionName += "ById";
          }

          return `
func ${functionName}(c *gin.Context) {
  // TODO: Implement handler for ${method.toUpperCase()} ${normalizedUrl}
}
`;
        })
        .join("\n");
    })
    .join("\n");

  return `package controllers


${handlerFunctions}
`;
};
