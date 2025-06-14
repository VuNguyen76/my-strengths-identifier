
interface BlogDetailContentProps {
  content: string | null;
}

const BlogDetailContent = ({ content }: BlogDetailContentProps) => {
  if (!content) {
    return (
      <div className="px-8 mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="prose max-w-none p-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl text-center border">
            <p className="text-muted-foreground text-lg">Nội dung bài viết đang được cập nhật...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 mb-12">
      <div className="max-w-3xl mx-auto">
        <div 
          className="prose prose-lg max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </div>
  );
};

export default BlogDetailContent;
