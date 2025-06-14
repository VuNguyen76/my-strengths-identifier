
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminServiceCategories = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-service-categories", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('service_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || 'Không có mô tả',
        icon: category.icon || 'Package',
        servicesCount: 0, // This would need a join query to get accurate count
        createdAt: category.created_at
      })) || [];
    }
  });
};
