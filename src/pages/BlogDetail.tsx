
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Home } from "lucide-react";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { useBlogs } from "@/hooks/useBlogs";
import { useEffect } from "react";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogDetail(id || "");
  
  const { data: relatedPosts = [] } = useBlogs({
    categoryId: post?.category_id || undefined,
    limit: 3,
  });

  const filteredRelatedPosts = relatedPosts.filter(p => p.id !== id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const calculateReadTime = (content: string | null): number => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 5;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
        <p className="mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
      
      <div className="max-w-4xl mx-auto">
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
        
        {post.image_url && (
          <div className="mb-8">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex justify-between mb-8">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </div>
        </div>
        
        <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        
        {filteredRelatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRelatedPosts.slice(0, 3).map(relatedPost => (
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
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
