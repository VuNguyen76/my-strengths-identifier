
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useBlogCategories } from "@/hooks/useBlogCategories";

interface BlogSearchAndFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (value: string) => void;
}

const BlogSearchAndFilters = ({
  searchTerm,
  onSearchTermChange,
  activeCategory,
  onCategoryChange,
}: BlogSearchAndFiltersProps) => {
  const { data: categories = [], isLoading: categoriesLoading } = useBlogCategories();

  const allCategories = [
    { id: "all", name: "Tất cả" },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  if (categoriesLoading) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bài viết..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      
      <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
        <TabsList className="w-full h-auto flex flex-wrap">
          {allCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex-1">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BlogSearchAndFilters;
