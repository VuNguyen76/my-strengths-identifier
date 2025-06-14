
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { Blog } from "@/hooks/useBlogs";

interface BlogDetailHeaderProps {
  post: Blog;
}

const BlogDetailHeader = ({ post }: BlogDetailHeaderProps) => {
  const calculateReadTime = (content: string | null): number => {
    if (!content) return 5;
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 5;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <Badge className="mb-4" variant="secondary">
          {post.blog_categories?.name || "Chưa phân loại"}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
        
        {post.description && (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {post.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{calculateReadTime(post.content)} phút đọc</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{post.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailHeader;
