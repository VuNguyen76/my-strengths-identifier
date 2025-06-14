
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, ArrowLeft } from "lucide-react";
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
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark();
    } else {
      console.log("Bookmark functionality to be implemented");
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
        <Link to="/blog">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại Blog
        </Link>
      </Button>
      
      <div className="flex space-x-3">
        <Button variant="outline" size="sm" onClick={handleShare} className="hover:bg-primary/10">
          <Share2 className="h-4 w-4 mr-2" />
          Chia sẻ
        </Button>
        <Button variant="outline" size="sm" onClick={handleBookmark} className="hover:bg-primary/10">
          <Bookmark className="h-4 w-4 mr-2" />
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default BlogDetailActions;
