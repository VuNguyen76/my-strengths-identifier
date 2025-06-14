
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogDetailActionsProps {
  onShare?: () => void;
  onBookmark?: () => void;
}

const BlogDetailActions = ({ onShare, onBookmark }: BlogDetailActionsProps) => {
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark();
    } else {
      // Default bookmark functionality - could integrate with user preferences later
      console.log("Bookmark functionality to be implemented");
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-lg">
      <div className="flex space-x-2">
        <Button variant="outline" asChild>
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Blog
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Trang chủ
          </Link>
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Chia sẻ
        </Button>
        <Button variant="outline" size="sm" onClick={handleBookmark}>
          <Bookmark className="h-4 w-4 mr-2" />
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default BlogDetailActions;
