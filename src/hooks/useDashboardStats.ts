
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total services
      const { count: totalServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total specialists
      const { count: totalSpecialists } = await supabase
        .from('specialists')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get pending bookings
      const { count: pendingBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total revenue from completed bookings
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;

      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          id,
          customer_name,
          booking_date,
          booking_time,
          status,
          booking_services (
            service_id,
            services (
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get popular services
      const { data: popularServicesData } = await supabase
        .from('booking_services')
        .select(`
          service_id,
          services (
            name
          ),
          bookings (
            status
          )
        `);

      // Process popular services data
      const serviceStats = popularServicesData?.reduce((acc: any, item) => {
        if (!item.services) return acc;
        
        const serviceName = item.services.name;
        if (!acc[serviceName]) {
          acc[serviceName] = { bookings: 0, revenue: 0 };
        }
        acc[serviceName].bookings += 1;
        return acc;
      }, {});

      const popularServices = Object.entries(serviceStats || {})
        .map(([name, stats]: [string, any]) => ({
          name,
          bookings: stats.bookings,
          revenue: stats.bookings * 200000 // Estimate based on average service price
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 3);

      return {
        totalUsers: totalUsers || 0,
        totalServices: totalServices || 0,
        totalSpecialists: totalSpecialists || 0,
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        totalRevenue,
        recentBookings: recentBookings?.map(booking => ({
          id: booking.id,
          name: booking.customer_name,
          service: booking.booking_services?.[0]?.services?.name || 'Dịch vụ không xác định',
          date: `${booking.booking_date}T${booking.booking_time}`,
          status: booking.status === 'completed' ? 'Đã hoàn thành' :
                  booking.status === 'pending' ? 'Đang chờ' :
                  booking.status === 'cancelled' ? 'Đã hủy' : 'Khác'
        })) || [],
        popularServices
      };
    }
  });
};
