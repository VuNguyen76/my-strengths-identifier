
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { Blog } from "@/hooks/useBlogs";

interface BlogDetailHeaderProps {
  post: Blog;
}

const BlogDetailHeader = ({ post }: BlogDetailHeaderProps) => {
  const calculateReadTime = (content: string | null): number => {
    if (!content) return 5;
    const wordsPerMinute = 200;
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
    <div className="px-8 pt-8 pb-6">
      <div className="max-w-3xl mx-auto">
        <Badge className="mb-6 bg-gradient-to-r from-primary to-pink-600 text-white border-0" variant="secondary">
          {post.blog_categories?.name || "Chưa phân loại"}
        </Badge>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {post.title}
        </h1>
        
        {post.description && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-light">
            {post.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{formatDate(post.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{calculateReadTime(post.content)} phút đọc</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{post.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailHeader;
