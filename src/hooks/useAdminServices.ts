
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminServices = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-services", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select(`
          *,
          service_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description || 'Không có mô tả',
        category: service.service_categories?.name || 'Chưa phân loại',
        price: service.price,
        duration: service.duration,
        isActive: service.is_active,
        imageUrl: service.image_url,
        createdAt: service.created_at
      })) || [];
    }
  });
};
