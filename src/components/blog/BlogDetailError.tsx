
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BlogDetailError = () => {
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
};

export default BlogDetailError;
