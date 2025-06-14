
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Blog } from "@/hooks/useBlogs";

interface BlogDetailRelatedProps {
  relatedPosts: Blog[];
}

const BlogDetailRelated = ({ relatedPosts }: BlogDetailRelatedProps) => {
  const calculateReadTime = (content: string | null): number => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 5;
  };

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.slice(0, 3).map(relatedPost => (
          <Card key={relatedPost.id} className="overflow-hidden hover:shadow-md transition-shadow">
            {relatedPost.image_url && (
              <img 
                src={relatedPost.image_url} 
                alt={relatedPost.title} 
                className="w-full h-40 object-cover"
              />
            )}
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline">
                  {relatedPost.blog_categories?.name || "Chưa phân loại"}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{calculateReadTime(relatedPost.content)} phút đọc</span>
                </div>
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
              <Button asChild variant="link" className="px-0">
                <Link to={`/blog/${relatedPost.id}`}>Đọc tiếp</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogDetailRelated;
