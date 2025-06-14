
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { Blog } from "@/hooks/useBlogs";

interface BlogCardProps {
  post: Blog;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const calculateReadTime = (content: string | null): number => {
    if (!content) return 5;
    const wordsPerMinute = 200; // Average Vietnamese reading speed
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 5;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Use fallback image from database or default
  const imageUrl = post.image_url || "/placeholder.svg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl}
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <CardHeader className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="shrink-0">
            {post.blog_categories?.name || "Chưa phân loại"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground ml-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{calculateReadTime(post.content)} phút</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg leading-tight">
          {post.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm">
          {post.description || "Khám phá nội dung thú vị trong bài viết này..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(post.created_at)}</span>
          <span className="mx-2">•</span>
          <User className="h-3 w-3 mr-1" />
          <span className="truncate">{post.author}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="default" className="w-full" size="sm">
          <Link to={`/blog/${post.id}`}>Đọc tiếp</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
