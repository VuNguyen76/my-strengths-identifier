
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, User } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";
import { useBlogCategories } from "@/hooks/useBlogCategories";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: categories = [], isLoading: categoriesLoading } = useBlogCategories();
  const { data: blogs = [], isLoading: blogsLoading } = useBlogs({
    searchTerm,
    categoryId: activeCategory,
  });

  const calculateReadTime = (content: string | null): number => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 5;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const allCategories = [
    { id: "all", name: "Tất cả" },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  if (categoriesLoading || blogsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Blog làm đẹp & Chăm sóc da</h1>
        <p className="text-muted-foreground max-w-2xl">
          Khám phá những bài viết chuyên sâu về chăm sóc da, bí quyết làm đẹp và cách điều trị các vấn đề về da từ các chuyên gia hàng đầu.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${allCategories.length}, 1fr)` }}>
            {allCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image_url || "https://via.placeholder.com/400x200"} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">
                    {post.blog_categories?.name || "Chưa phân loại"}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{calculateReadTime(post.content)} phút đọc</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.description || "Không có mô tả"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(post.created_at)}</span>
                  <span className="mx-2">•</span>
                  <User className="h-3 w-3 mr-1" />
                  <span>{post.author}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="px-0">
                  <Link to={`/blog/${post.id}`}>Đọc tiếp</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Không tìm thấy bài viết</h3>
          <p className="text-muted-foreground">Vui lòng thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
