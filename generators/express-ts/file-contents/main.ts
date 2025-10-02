export const expressMainContent = (
  routerGroups: string[] = []
) => `import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import createError from "http-errors";

// import controllers
${
  routerGroups.length > 0
    ? "\n" +
      routerGroups
        .map(
          (group) =>
            `import ${group}Controller from "./controllers/${group}Controller";`
        )
        .join("\n")
    : ""
}

const app = express();

app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://some-domain-here.com"]
        : true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


// use controllers
${
  routerGroups.length > 0
    ? routerGroups
        .map((group) => `app.use("/${group}", ${group}Controller);`)
        .join("\n") + "\n\n"
    : ""
}app.use(function (_req, _res, next) {
  next(createError(404));
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    const isDevelopment = process.env.NODE_ENV !== "production";

    res.status(500).json({
      error: "Internal server error",
      ...(isDevelopment && { details: err.message, stack: err.stack }),
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/health\`);
  console.log(\`🌍 Environment: \${process.env.NODE_ENV || "development"}\`);
});
`;
