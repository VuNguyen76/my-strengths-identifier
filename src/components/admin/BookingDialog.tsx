
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, startOfToday } from "date-fns";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Specialist {
  id: string;
  name: string;
}

interface BookingDialogProps {
  services: Service[];
  specialists: Specialist[];
}

export const BookingDialog = ({ services, specialists }: BookingDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customer: "",
    email: "",
    phone: "",
    service: "",
    specialist: "",
    date: startOfToday(),
    time: "09:00",
    notes: ""
  });
  const [date, setDate] = useState<Date | undefined>(startOfToday());

  const queryClient = useQueryClient();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setNewBooking(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const createBooking = async () => {
    try {
      const selectedService = services.find(s => s.name === newBooking.service);
      const selectedSpecialist = specialists.find(s => s.name === newBooking.specialist);

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          customer_name: newBooking.customer,
          customer_email: newBooking.email,
          customer_phone: newBooking.phone,
          specialist_id: selectedSpecialist?.id || null,
          booking_date: format(newBooking.date, 'yyyy-MM-dd'),
          booking_time: newBooking.time,
          status: 'pending' as BookingStatus,
          total_price: selectedService?.price || 0,
          notes: newBooking.notes
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      if (selectedService && bookingData) {
        const { error: serviceError } = await supabase
          .from('booking_services')
          .insert([{
            booking_id: bookingData.id,
            service_id: selectedService.id,
            price: selectedService.price
          }]);

        if (serviceError) throw serviceError;
      }

      setNewBooking({
        customer: "",
        email: "",
        phone: "",
        service: "",
        specialist: "",
        date: startOfToday(),
        time: "09:00",
        notes: ""
      });
      
      setIsDialogOpen(false);
      toast.success("Đặt lịch mới đã được tạo!");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Đặt lịch mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Đặt lịch mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Tên khách hàng</Label>
              <Input
                id="customer"
                name="customer"
                value={newBooking.customer}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newBooking.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={newBooking.phone}
                onChange={handleInputChange}
                placeholder="0901234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Dịch vụ</Label>
              <Select
                value={newBooking.service}
                onValueChange={(value) => handleSelectChange("service", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialist">Chuyên viên</Label>
              <Select
                value={newBooking.specialist}
                onValueChange={(value) => handleSelectChange("specialist", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chuyên viên" />
                </SelectTrigger>
                <SelectContent>
                  {specialists.map((specialist) => (
                    <SelectItem key={specialist.id} value={specialist.name}>
                      {specialist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Giờ</Label>
              <Select
                value={newBooking.time}
                onValueChange={(value) => handleSelectChange("time", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giờ" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const hour = 8 + i;
                    const time = `${hour.toString().padStart(2, '0')}:00`;
                    return (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ngày</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < startOfToday()}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Input
              id="notes"
              name="notes"
              value={newBooking.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú về đặt lịch"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Hủy
          </Button>
          <Button type="button" onClick={createBooking}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
