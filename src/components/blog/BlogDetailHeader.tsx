
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
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
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang Blog
          </Link>
        </Button>
        
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Trang chủ
          </Link>
        </Button>
      </div>
      
      <div className="mb-4">
        <Badge className="mb-4">
          {post.blog_categories?.name || "Chưa phân loại"}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-8">
          <div className="flex items-center mr-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{calculateReadTime(post.content)} phút đọc</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetailHeader;
