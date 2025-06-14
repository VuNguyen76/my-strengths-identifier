
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type BookingInsert = TablesInsert<'bookings'>;
type BookingServiceInsert = TablesInsert<'booking_services'>;

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (
    bookingData: Omit<BookingInsert, 'id' | 'created_at' | 'updated_at'>,
    serviceIds: string[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Tạo booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Lấy thông tin services để tính giá
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id, price')
        .in('id', serviceIds);

      if (servicesError) throw servicesError;

      // Tạo booking_services
      const bookingServices: BookingServiceInsert[] = services.map(service => ({
        booking_id: booking.id,
        service_id: service.id,
        price: service.price
      }));

      const { error: bookingServicesError } = await supabase
        .from('booking_services')
        .insert(bookingServices);

      if (bookingServicesError) throw bookingServicesError;

      setLoading(false);
      return { booking, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      setLoading(false);
      return { booking: null, error: errorMessage };
    }
  };

  return { createBooking, loading, error };
};
