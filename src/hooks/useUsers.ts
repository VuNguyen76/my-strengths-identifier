
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUsers = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      // Get users from auth.users through admin API
      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) throw error;

      // Filter users based on search query if provided
      let filteredUsers = data?.users || [];
      
      if (searchQuery) {
        filteredUsers = filteredUsers.filter(user => 
          user.user_metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return filteredUsers.map(user => ({
        id: user.id,
        name: user.user_metadata?.name || user.email || 'Chưa có tên',
        email: user.email || 'Chưa có email',
        phone: user.user_metadata?.phone || user.phone || 'Chưa có SĐT',
        role: (user.user_metadata?.role as 'user' | 'staff' | 'admin') || 'user',
        status: 'active' as const,
        createdAt: user.created_at
      }));
    }
  });
};
