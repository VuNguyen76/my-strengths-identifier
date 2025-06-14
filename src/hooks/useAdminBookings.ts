
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminBookings = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-bookings", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          booking_services (
            service_id,
            price,
            services (
              name
            )
          ),
          specialists (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`customer_name.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(booking => ({
        id: booking.id,
        customer: booking.customer_name,
        phone: booking.customer_phone,
        email: booking.customer_email || 'Chưa có email',
        service: booking.booking_services?.[0]?.services?.name || 'Dịch vụ không xác định',
        specialist: booking.specialists?.name || 'Chưa phân công',
        date: booking.booking_date,
        time: booking.booking_time,
        status: booking.status,
        total: booking.total_price,
        notes: booking.notes,
        createdAt: booking.created_at
      })) || [];
    }
  });
};
