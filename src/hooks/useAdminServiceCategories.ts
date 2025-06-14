
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
  services_count?: number;
}

export const useAdminServiceCategories = () => {
  return useQuery({
    queryKey: ["admin-service-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select(`
          *,
          services(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(category => ({
        ...category,
        services_count: category.services?.[0]?.count || 0
      })) || [];
    }
  });
};

export const useCreateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<ServiceCategory, 'id' | 'created_at' | 'updated_at' | 'services_count'>) => {
      const { data, error } = await supabase
        .from('service_categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-categories"] });
      toast.success("Danh mục dịch vụ mới đã được thêm thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};

export const useUpdateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-categories"] });
      toast.success("Danh mục dịch vụ đã được cập nhật thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};

export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-categories"] });
      toast.success("Danh mục dịch vụ đã được xóa thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};
