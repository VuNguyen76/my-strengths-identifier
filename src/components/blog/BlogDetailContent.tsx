
interface BlogDetailContentProps {
  content: string | null;
}

const BlogDetailContent = ({ content }: BlogDetailContentProps) => {
  if (!content) {
    return (
      <div className="prose max-w-none mb-12 p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-muted-foreground">Nội dung bài viết đang được cập nhật...</p>
      </div>
    );
  }

  return (
    <div 
      className="prose prose-lg max-w-none mb-12 bg-white p-8 rounded-lg shadow-sm border" 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};

export default BlogDetailContent;
