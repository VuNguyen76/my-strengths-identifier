
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { Database } from "@/integrations/supabase/types";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  specialist: string;
  date: string;
  time: string;
  status: string;
}

interface BookingTableProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

export const BookingTable = ({ bookings, onUpdateStatus }: BookingTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Liên hệ</TableHead>
          <TableHead>Dịch vụ</TableHead>
          <TableHead>Chuyên viên</TableHead>
          <TableHead>Ngày giờ</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.customer}</TableCell>
              <TableCell>
                <div>{booking.email}</div>
                <div className="text-sm text-muted-foreground">{booking.phone}</div>
              </TableCell>
              <TableCell>{booking.service}</TableCell>
              <TableCell>{booking.specialist}</TableCell>
              <TableCell>
                {format(new Date(`${booking.date}T${booking.time}`), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                <BookingStatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {booking.status === "pending" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onUpdateStatus(booking.id, "upcoming")}
                      >
                        Xác nhận
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500"
                        onClick={() => onUpdateStatus(booking.id, "canceled")}
                      >
                        Hủy
                      </Button>
                    </>
                  )}
                  {booking.status === "upcoming" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onUpdateStatus(booking.id, "completed")}
                    >
                      Hoàn thành
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              Không có lịch đặt nào
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
