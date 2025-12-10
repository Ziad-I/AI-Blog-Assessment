import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";

interface BlogMarkdownProps {
  content: string;
}

export default function MarkdownRenderer({ content }: BlogMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[
        rehypeRaw,
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeSanitize,
      ]}
    >
      {content}
    </ReactMarkdown>
  );
}
