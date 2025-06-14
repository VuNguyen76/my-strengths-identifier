
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
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full md:w-auto"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bài viết..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      
      <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full md:w-auto">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${allCategories.length}, 1fr)` }}>
          {allCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BlogSearchAndFilters;
