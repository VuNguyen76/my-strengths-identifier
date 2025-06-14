
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminBlogCategories = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-blog-categories", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('blog_categories')
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
        blogsCount: 0, // This would need a join query to get accurate count
        createdAt: category.created_at
      })) || [];
    }
  });
};
