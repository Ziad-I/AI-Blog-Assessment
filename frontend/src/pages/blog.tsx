import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/definitions";
import BlogHeader from "@/components/blog/blogHeader";
import { BlogContent } from "@/components/blog/blogContent";
import BlogSkeleton from "@/components/blog/blogSkeleton";
import { useParams } from "react-router";
import api from "@/lib/api";

function BlogPage() {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const fetchBlog = async () => {
      try {
        const response = await api.get<BlogPost>(`/blogs/${params.blogId}`, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setBlog(response.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
          return; // don't set error/toast if request was cancelled
        }
        setError("An error occurred while fetching the blog");
        toast.error("Error!", {
          description: "Failed to fetch blog data. Please try again.",
        });
        console.error(err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBlog();

    return () => {
      controller.abort();
    };
  }, [params.blogId]);

  if (loading) {
    return <BlogSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive-foreground">{error}</div>
    );
  }

  if (!blog) {
    return <div className="text-center">Blog not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <BlogHeader blog={blog} />
        <BlogContent blog={blog} />
      </article>
    </div>
  );
}

export default BlogPage;
