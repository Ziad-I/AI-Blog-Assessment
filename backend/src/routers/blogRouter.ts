import express from "express";
import * as blogController from "../controllers/blogController.js";

const blogRouter = express.Router();

blogRouter.get("/", blogController.listBlogs);
blogRouter.get("/:id", blogController.getBlogById);
blogRouter.post("/", blogController.createBlog);
blogRouter.post("/generate", blogController.generateBlog);

export default blogRouter;
