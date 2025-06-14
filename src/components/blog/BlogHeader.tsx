
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BlogHeader = () => {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      <div className="w-full mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>
      <h1 className="text-4xl font-bold mb-4">Blog làm đẹp & Chăm sóc da</h1>
      <p className="text-gray-600">
        Khám phá những bài viết chuyên sâu về chăm sóc da, bí quyết làm đẹp và cách điều trị các vấn đề về da từ các chuyên gia hàng đầu.
      </p>
    </div>
  );
};

export default BlogHeader;
