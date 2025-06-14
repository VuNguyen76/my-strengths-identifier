
import { Badge } from "@/components/ui/badge";

interface BookingStatusBadgeProps {
  status: string;
}

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  switch (status) {
    case "upcoming":
      return <Badge className="bg-green-500">Đã xác nhận</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Chờ xác nhận</Badge>;
    case "completed":
      return <Badge className="bg-blue-500">Hoàn thành</Badge>;
    case "canceled":
      return <Badge className="bg-red-500">Đã hủy</Badge>;
    default:
      return <Badge>Không xác định</Badge>;
  }
};
