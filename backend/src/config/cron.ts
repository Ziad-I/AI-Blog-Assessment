import { db } from "./database.js";
import cron from "node-cron";
import { generateBlogJob } from "../jobs/blogGenerateJob.js";
import logger from "./logger.js";

export function scheduleBlogGeneration() {
  cron.schedule("0 0 * * *", async () => {
    logger.info("Running scheduled blog generation job...");
    try {
      await db.execute("select 1");
      await generateBlogJob();
      logger.info("Blog generation job completed successfully.");
    } catch (error) {
      logger.error("Error during blog generation job:", error);
    }
  });
}
