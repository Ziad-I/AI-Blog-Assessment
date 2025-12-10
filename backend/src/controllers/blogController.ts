import * as blogService from "../services/blogService.js";
import { type Request, type Response } from "express";

export async function listBlogs(req: Request, res: Response) {
  try {
    const blogs = await blogService.listBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
}

export async function getBlogById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const blog = await blogService.getBlogById(id);
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
}

export async function createBlog(req: Request, res: Response) {
  const { title, content } = req.body;
  try {
    const newBlog = await blogService.createBlog(title, content);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog" });
  }
}

export async function generateBlog(req: Request, res: Response) {
  const topic = req.body?.topic as string | undefined;
  try {
    const generatedBlog = await blogService.generateBlog(topic);
    res.status(200).json(generatedBlog);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate blog" });
  }
}
