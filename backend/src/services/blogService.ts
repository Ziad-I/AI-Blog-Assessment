import { db } from "../config/database.js";
import { blogs } from "../db/schema/blog.js";
import { eq, desc } from "drizzle-orm";
import { makePrompts } from "../config/prompt.js";
import { env } from "../config/config.js";
import logger from "../config/logger.js";

export async function listBlogs() {
  const res = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      createdAt: blogs.createdAt,
    })
    .from(blogs)
    .orderBy(desc(blogs.createdAt));
  return res;
}

export async function getBlogById(id: number) {
  const [res] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  return res;
}

export async function createBlog(title: string, content: string) {
  const [res] = await db
    .insert(blogs)
    .values({
      title,
      content,
    })
    .returning();
  return res;
}

export async function generateBlog(topic?: string) {
  const { userPrompt, systemPrompt } = makePrompts(topic);

  const headers = {
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  };

  const payload = {
    model: env.OPENROUTER_MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0.4,
    presence_penalty: 0.25,
  };

  const response = await fetch(env.OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    logger.error(
      `OpenRouter API error: ${response.status} ${response.statusText}`
    );
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data: any = await response.json();

  const generatedContent = data.choices[0].message.content;

  const [titleRaw, ...contentParts] = generatedContent.split("\n");
  const title = titleRaw.replace(/^#\s*/, "").trim();
  const content = contentParts.join("\n").trim();

  const newBlog = await createBlog(title, content);

  return newBlog;
}
