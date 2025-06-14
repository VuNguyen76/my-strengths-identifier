
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Blog } from "./useBlogs";

export const useBlogDetail = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          blog_categories (
            name
          )
        `)
        .eq("id", id)
        .eq("is_published", true)
        .single();

      if (error) {
        console.error("Error fetching blog detail:", error);
        throw error;
      }

      return data as Blog;
    },
    enabled: !!id,
  });
};
