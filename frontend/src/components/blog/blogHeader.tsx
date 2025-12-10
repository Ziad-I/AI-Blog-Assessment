import { format, parseISO } from "date-fns";
import type { BlogPost } from "@/lib/definitions";

interface BlogHeader {
  blog: BlogPost;
}

export default function BlogHeader({ blog }: BlogHeader) {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold">{blog.title}</h1>
      <p className="text-sm text-muted-foreground mt-2">
        {format(parseISO(blog.createdAt), "MMMM d, yyyy")}
      </p>
    </div>
  );
}
