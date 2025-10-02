export const expressController = (
  controllerGroups: Record<
    string,
    { route: string; method: string; operationId?: string; summary?: string }[]
  >,
  group: string
) => {
  const routes = controllerGroups[group] ?? [];

  return `import { Router, Request, Response, NextFunction } from 'express';

// Controller for ${group}
// Generated from OpenAPI specification

const router = Router();

${routes
  .map((routeInfo) => {
    const functionName =
      routeInfo.operationId ||
      `${routeInfo.method.toLowerCase()}${
        group.charAt(0).toUpperCase() + group.slice(1)
      }`;
    const summary = routeInfo.summary ? `\n// ${routeInfo.summary}` : "";

    // Remove the group prefix from the route to avoid double paths
    // e.g., '/pet/findByStatus' becomes '/findByStatus' when mounted at '/pet'
    const cleanRoute = routeInfo.route.startsWith(`/${group}`)
      ? routeInfo.route.substring(`/${group}`.length) || "/"
      : routeInfo.route;

    return `${summary}
router.${routeInfo.method.toLowerCase()}('${cleanRoute}', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement ${routeInfo.method} ${routeInfo.route}
    res.status(200).json({ message: 'Not implemented yet' });
  } catch (error) {
    next(error);
  }
});`;
  })
  .join("\n\n")}

export default router;
`;
};
