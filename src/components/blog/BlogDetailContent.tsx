
interface BlogDetailContentProps {
  content: string | null;
}

const BlogDetailContent = ({ content }: BlogDetailContentProps) => {
  return (
    <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content || "" }} />
  );
};

export default BlogDetailContent;
