
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SpecialistsSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpecialistsSearch = ({ searchQuery, onSearchChange }: SpecialistsSearchProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm chuyên viên..."
          className="pl-10"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default SpecialistsSearch;
