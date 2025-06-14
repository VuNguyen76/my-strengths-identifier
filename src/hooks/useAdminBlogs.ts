
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminBlogs = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["admin-blogs", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('blogs')
        .select(`
          *,
          blog_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(blog => ({
        id: blog.id,
        title: blog.title,
        author: blog.author,
        category: blog.blog_categories?.name || 'Chưa phân loại',
        status: blog.is_published ? 'published' : 'draft',
        publishDate: blog.created_at,
        views: Math.floor(Math.random() * 1000), // Would need actual view tracking
        imageUrl: blog.image_url,
        content: blog.content,
        description: blog.description
      })) || [];
    }
  });
};
