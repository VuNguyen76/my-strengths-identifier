
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  booking?: {
    id: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    specialist?: {
      name: string;
    };
    booking_services?: Array<{
      service?: {
        name: string;
      };
    }>;
  };
}

export const useAdminTransactions = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-transactions", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          bookings(
            id,
            customer_name,
            customer_email,
            customer_phone,
            specialists(name),
            booking_services(
              services(name)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`transaction_id.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        booking_id: payment.booking_id || '',
        amount: payment.amount,
        status: payment.status || 'pending',
        payment_method: payment.payment_method,
        transaction_id: payment.transaction_id,
        created_at: payment.created_at,
        booking: payment.bookings
      })) || [];
    }
  });
};
