import logger from "../config/logger.js";
import { generateBlog } from "../services/blogService.js";

export async function generateBlogJob() {
  const newBlog = await generateBlog();
  logger.info("Blog post generated:", newBlog?.title);
}
