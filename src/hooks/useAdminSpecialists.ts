
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminSpecialists = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-specialists", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('specialists')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(specialist => ({
        id: specialist.id,
        name: specialist.name,
        specialty: specialist.role,
        email: 'email@example.com', // Email không có trong database
        phone: 'Chưa có SĐT', // Phone không có trong database
        experience: specialist.experience || 'Chưa xác định',
        rating: 4.5, // Rating sẽ được tính từ feedback sau
        status: specialist.is_active ? 'active' : 'inactive',
        image: specialist.image_url || 'https://via.placeholder.com/150',
        bio: specialist.bio,
        createdAt: specialist.created_at
      })) || [];
    }
  });
};
