
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUsers = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(user => ({
        id: user.id,
        name: user.name || 'Chưa có tên',
        email: 'email@example.com', // Email không lưu trong user_profiles
        phone: user.phone || 'Chưa có SĐT',
        role: user.role,
        status: 'active',
        createdAt: user.created_at
      })) || [];
    }
  });
};
