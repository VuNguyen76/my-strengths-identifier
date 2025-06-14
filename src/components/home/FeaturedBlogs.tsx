
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";

const FeaturedBlogs = () => {
  const { data: blogs = [], isLoading } = useBlogs({ limit: 3 });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bài Viết Nổi Bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chia sẻ kiến thức và bí quyết chăm sóc da từ các chuyên gia hàng đầu
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Bài Viết Nổi Bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức và bí quyết chăm sóc da từ các chuyên gia hàng đầu
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={blog.image_url || "https://via.placeholder.com/400x200"} 
                  alt={blog.title}
                  className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formatDate(blog.created_at)}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.author}</span>
                </div>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 line-clamp-3">
                  {blog.description || "Không có mô tả"}
                </CardDescription>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/blog/${blog.id}`}>Đọc tiếp</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/blog">Xem tất cả bài viết</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
