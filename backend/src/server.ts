import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compress from "compression";

import { morganMiddleware } from "./middlewares/morgan.js";
import logger from "./config/logger.js";
import { env } from "./config/config.js";
import { db } from "./config/database.js";
import { scheduleBlogGeneration } from "./config/cron.js";

import blogRouter from "./routers/blogRouter.js";

export const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morganMiddleware);
app.use(compress());

// Routers
const apiRouter = express.Router();
apiRouter.use("/blogs", blogRouter);

app.use("/api", apiRouter);
app.use("/health", (_req, res) => {
  res.json({ status: "OK" });
});

try {
  await db.execute("select 1");
  logger.info("[server] Database connected successfully,");
} catch (error) {
  logger.error("[server] Database connection failed:", error);
}

app.listen(env.PORT, () => {
  logger.info(`[server]: Server is running at http://localhost:${env.PORT}`);
});

scheduleBlogGeneration();
