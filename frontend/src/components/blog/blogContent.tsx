import type { BlogPost } from "@/lib/definitions";
import MarkdownRenderer from "@/components/blog/markdownRenderer";

type BlogContentProps = {
  blog: BlogPost;
};

export function BlogContent({ blog }: BlogContentProps) {
  return (
    <>
      <div className="prose max-w-none mb-8 markdown">
        <MarkdownRenderer content={blog.content || ""}></MarkdownRenderer>
      </div>
    </>
  );
}
