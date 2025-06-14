
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BlogHeader = () => {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <div className="w-full mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Blog làm đẹp & Chăm sóc da</h1>
      <p className="text-muted-foreground max-w-2xl">
        Khám phá những bài viết chuyên sâu về chăm sóc da, bí quyết làm đẹp và cách điều trị các vấn đề về da từ các chuyên gia hàng đầu.
      </p>
    </div>
  );
};

export default BlogHeader;
