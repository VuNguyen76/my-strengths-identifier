
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";

interface BookingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showCancelled: boolean;
  onShowCancelledChange: (checked: boolean) => void;
}

export const BookingFilters = ({
  searchTerm,
  onSearchChange,
  showCancelled,
  onShowCancelledChange,
}: BookingFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm lịch đặt..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-cancelled"
          checked={showCancelled}
          onCheckedChange={onShowCancelledChange}
        />
        <Label htmlFor="show-cancelled">Hiển thị đã hủy</Label>
      </div>
    </div>
  );
};
