
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserSearch = ({ searchQuery, onSearchChange }: UserSearchProps) => {
  return (
    <div className="flex mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default UserSearch;
