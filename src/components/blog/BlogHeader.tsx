
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BlogHeader = () => {
  return (
    <div className="max-w-4xl mx-auto text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
        Blog làm đẹp & Chăm sóc da
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Khám phá những bài viết chuyên sâu về chăm sóc da, bí quyết làm đẹp và cách điều trị các vấn đề về da từ các chuyên gia hàng đầu.
      </p>
    </div>
  );
};

export default BlogHeader;
