
import { Button } from "@/components/ui/button";

interface EmptyBlogStateProps {
  onClearFilters?: () => void;
}

const EmptyBlogState = ({ onClearFilters }: EmptyBlogStateProps) => {
  return (
    <div className="col-span-full text-center py-12">
      <p className="text-lg text-gray-500 mb-4">Không tìm thấy bài viết nào.</p>
      {onClearFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
};

export default EmptyBlogState;
