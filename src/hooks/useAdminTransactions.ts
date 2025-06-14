
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminTransactions = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-transactions", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          bookings (
            customer_name,
            customer_phone
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`transaction_id.ilike.%${searchQuery}%,payment_method.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        transactionId: payment.transaction_id || `TXN${payment.id.slice(0, 8)}`,
        customer: payment.bookings?.customer_name || 'Khách hàng',
        phone: payment.bookings?.customer_phone || 'N/A',
        amount: payment.amount,
        method: payment.payment_method || 'Tiền mặt',
        status: payment.status,
        date: payment.created_at,
        bookingId: payment.booking_id
      })) || [];
    }
  });
};
