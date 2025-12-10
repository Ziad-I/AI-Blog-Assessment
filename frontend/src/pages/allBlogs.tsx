import { useState, useEffect } from "react";
import axios from "axios";
import type { BlogPost } from "@/lib/definitions";
import { toast } from "sonner";
import api from "@/lib/api";
import AllBlogsSkeleton from "@/components/allBlogs/allBlogsSkeleton";
import BlogList from "@/components/allBlogs/blogList";

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBlogs() {
      try {
        const response = await api.get<BlogPost[]>("/blogs", {
          signal: controller.signal,
        });
        // don't update state if request was aborted
        if (!controller.signal.aborted) {
          setBlogs(response.data);
        }
      } catch (err) {
        // If request was cancelled/aborted, do nothing
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
          return;
        }
        setError("An error occurred while fetching blogs");
        toast.error("Error!", {
          description: "Failed to fetch blogs data. Please try again.",
        });
        console.error(err);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchBlogs();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <AllBlogsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">All Blogs</h1>
        <p className="text-destructive-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">All Blogs</h1>
      <BlogList blogs={blogs} />
    </div>
  );
}
