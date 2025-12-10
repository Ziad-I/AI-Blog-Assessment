import type { BlogPost } from "@/lib/definitions";
import BlogCard from "@/components/allBlogs/blogCard";

interface BlogListProps {
  blogs: BlogPost[];
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
