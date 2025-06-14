
import { Button } from "@/components/ui/button";
import { Share2, Bookmark } from "lucide-react";

const BlogDetailActions = () => {
  return (
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
  );
};

export default BlogDetailActions;
