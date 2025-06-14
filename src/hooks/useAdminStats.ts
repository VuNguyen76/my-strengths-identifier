
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total services count
      const { count: totalServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total specialists count
      const { count: totalSpecialists } = await supabase
        .from('specialists')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total bookings count
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get pending bookings count
      const { count: pendingBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get completed bookings for revenue calculation
      const { data: completedBookings } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'completed');

      const totalRevenue = completedBookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;

      return {
        totalUsers: totalUsers || 0,
        totalServices: totalServices || 0,
        totalSpecialists: totalSpecialists || 0,
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        totalRevenue,
        revenueGrowth: 12.5, // This would need historical data to calculate properly
        bookingGrowth: 8.3,  // This would need historical data to calculate properly
      };
    }
  });
};
