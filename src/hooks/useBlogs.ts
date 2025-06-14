
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Blog {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  author: string;
  category_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  blog_categories?: {
    name: string;
  };
}

export interface UseBlogsOptions {
  searchTerm?: string;
  categoryId?: string;
  limit?: number;
  featured?: boolean;
}

export const useBlogs = (options: UseBlogsOptions = {}) => {
  const { searchTerm, categoryId, limit, featured } = options;

  return useQuery({
    queryKey: ["blogs", searchTerm, categoryId, limit, featured],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select(`
          *,
          blog_categories (
            name
          )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
      }

      if (categoryId && categoryId !== "all") {
        query = query.eq("category_id", categoryId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }

      return data as Blog[];
    },
  });
};
