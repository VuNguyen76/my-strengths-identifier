
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import { useAdminServices } from "@/hooks/useAdminServices";
import { useAdminSpecialists } from "@/hooks/useAdminSpecialists";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { BookingDialog } from "@/components/admin/BookingDialog";
import { BookingFilters } from "@/components/admin/BookingFilters";
import { BookingTable } from "@/components/admin/BookingTable";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

const AdminBookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);

  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading, error } = useAdminBookings(searchTerm);
  const { data: services = [] } = useAdminServices();
  const { data: specialists = [] } = useAdminSpecialists();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
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
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && booking.status === "pending") ||
      (activeTab === "upcoming" && booking.status === "upcoming") ||
      (activeTab === "completed" && booking.status === "completed") ||
      (activeTab === "cancelled" && booking.status === "canceled");

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
        <BookingDialog services={services} specialists={specialists} />
      </div>

      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showCancelled={showCancelled}
        onShowCancelledChange={setShowCancelled}
      />

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="upcoming">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lịch đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTable 
                bookings={filteredBookings} 
                onUpdateStatus={updateBookingStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBookings;
