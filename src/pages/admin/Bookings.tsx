
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { format, startOfToday } from "date-fns";
import { Search, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import { useAdminServices } from "@/hooks/useAdminServices";
import { useAdminSpecialists } from "@/hooks/useAdminSpecialists";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const AdminBookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);
  
  // State for new booking form
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
  
  // Date for calendar
  const [date, setDate] = useState<Date | undefined>(startOfToday());

  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading, error } = useAdminBookings(searchTerm);
  const { data: services = [] } = useAdminServices();
  const { data: specialists = [] } = useAdminSpecialists();

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
      // Combine date and time
      const bookingDateTime = new Date(newBooking.date);
      const [hours, minutes] = newBooking.time.split(":").map(Number);
      bookingDateTime.setHours(hours, minutes);
      
      // Find selected service and specialist
      const selectedService = services.find(s => s.name === newBooking.service);
      const selectedSpecialist = specialists.find(s => s.name === newBooking.specialist);

      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          customer_name: newBooking.customer,
          customer_email: newBooking.email,
          customer_phone: newBooking.phone,
          specialist_id: selectedSpecialist?.id || null,
          booking_date: format(newBooking.date, 'yyyy-MM-dd'),
          booking_time: newBooking.time,
          status: 'pending',
          total_price: selectedService?.price || 0,
          notes: newBooking.notes
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create booking service relationship
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

      // Reset form and close dialog
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
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

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(`Đã cập nhật trạng thái thành công`);
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    // Filter by search term
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && booking.status === "pending") ||
      (activeTab === "confirmed" && booking.status === "confirmed") ||
      (activeTab === "completed" && booking.status === "completed") ||
      (activeTab === "cancelled" && booking.status === "canceled");

    // Filter by cancelled switch
    const matchesCancelled = showCancelled || booking.status !== "canceled";

    return matchesSearch && matchesTab && matchesCancelled;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý lịch đặt</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý lịch đặt</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý lịch đặt</h1>
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
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm lịch đặt..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-cancelled"
            checked={showCancelled}
            onCheckedChange={setShowCancelled}
          />
          <Label htmlFor="show-cancelled">Hiển thị đã hủy</Label>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lịch đặt</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
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
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {booking.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                >
                                  Xác nhận
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-500"
                                  onClick={() => updateBookingStatus(booking.id, "canceled")}
                                >
                                  Hủy
                                </Button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, "completed")}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBookings;
