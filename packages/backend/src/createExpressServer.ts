import * as fs from "node:fs";
import * as path from "node:path";
import { addAuthenticationMiddleware } from "@auth/jwt-decode";
import { jwtVerifyTokenMiddleware } from "@auth/jwt-verify";
import {
  FRONTEND_DIST_DIR,
  FRONTEND_PUBLIC_DIR,
  IS_DEV_ENVIRONMENT,
} from "@config";
import { createPrivateRestRouter } from "@controllers/ts-rest/privateRestRouter";
import { createPublicRestRouter } from "@controllers/ts-rest/publicRestRouter";
import serveApiDocs from "@serveApiDocs";
import { getSharedConfig } from "@shared/config/sharedConfig";
import { privateRestContracts } from "@shared/contracts/privateRestContracts";
import { publicRestContracts } from "@shared/contracts/publicRestContracts";
import { createExpressEndpoints } from "@ts-rest/express";
import cors from "cors";
import express, {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";

function getIndexHtmlContents() {
  const indexPath = path.join(FRONTEND_DIST_DIR, "index.html");
  let original: string;
  try {
    original = fs.readFileSync(indexPath, { encoding: "utf8" });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "ENOENT"
    ) {
      // Fallback for test runs or when frontend hasn't been built yet.
      // Prefer the indirect-dev template (used by frontend dev mode) if available.
      const indirectDevPath = path.join(
        path.dirname(FRONTEND_DIST_DIR),
        "index-indirect-dev.html"
      );
      original = fs.readFileSync(indirectDevPath, { encoding: "utf8" });
    } else {
      throw err;
    }
  }
  return original.replace(
    `<!-- __SHARED_CONFIG_SCRIPT_PLACEHOLDER__ -->`,
    `<script type="application/javascript">globalThis.__SHARED_CONFIG__ = ${JSON.stringify(getSharedConfig())};</script>
`
  );
}

export const createExpressServer = () => {
  const app = express();
  if (IS_DEV_ENVIRONMENT) {
    app.use((_req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next(); // for inspection during development
    });
  }

  app.use(cors());

  // Accept any valid JSON value (including primitives like JSON strings).
  app.use(express.json({ strict: false }));
  const indexHtmlContents = getIndexHtmlContents();
  // Handle requests for the root and /page routes by sending the main HTML file.
  // This is crucial for Single Page Applications (SPAs) that use client-side routing.
  app.get(["/", "/page", "/page/*"], (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(indexHtmlContents);
  });

  app.use(express.static(FRONTEND_DIST_DIR));
  app.use(express.static(FRONTEND_PUBLIC_DIR));

  const pino = pinoHttp();
  app.use(pino);

  serveApiDocs(app);

  const apiV3Router = express.Router();
  app.use("/api/v3", apiV3Router);
  createExpressEndpoints(
    publicRestContracts,
    createPublicRestRouter(),
    apiV3Router
  );

  const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 100 requests per windowMs
  });
  createExpressEndpoints(
    privateRestContracts,
    createPrivateRestRouter(),
    apiV3Router,
    {
      globalMiddleware: [
        rateLimiter,
        jwtVerifyTokenMiddleware,
        addAuthenticationMiddleware,
      ],
    }
  );
  const errorLogger: ErrorRequestHandler = (
    err: unknown,
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    console.warn(err);
    next(err);
  };
  app.use(errorLogger);
  return app;
};
