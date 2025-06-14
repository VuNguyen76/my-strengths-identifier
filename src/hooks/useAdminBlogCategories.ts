
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BlogCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  posts_count?: number;
}

export const useAdminBlogCategories = () => {
  return useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select(`
          *,
          blogs(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(category => ({
        ...category,
        posts_count: category.blogs?.[0]?.count || 0
      })) || [];
    }
  });
};

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<BlogCategory, 'id' | 'created_at' | 'posts_count'>) => {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
      toast.success("Danh mục blog mới đã được thêm thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
      toast.success("Danh mục blog đã được cập nhật thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-categories"] });
      toast.success("Danh mục blog đã được xóa thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};
