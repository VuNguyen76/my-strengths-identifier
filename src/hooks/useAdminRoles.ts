
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminRoles = () => {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      // Get users from auth to count roles
      const { data: users } = await supabase.auth.admin.listUsers();

      const roleCounts = users?.users?.reduce((acc: Record<string, number>, user) => {
        const role = user.user_metadata?.role || 'user';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {}) || {};

      return [
        {
          id: "1",
          name: "Admin",
          description: "Quản trị viên hệ thống có toàn quyền truy cập",
          userCount: roleCounts.admin || 0,
          permissions: [
            "users_view", "users_create", "users_edit", "users_delete",
            "services_view", "services_create", "services_edit", "services_delete",
            "bookings_view", "bookings_create", "bookings_edit", "bookings_delete",
            "reports_view", "transactions_view", "transactions_create",
            "staff_view", "staff_create", "staff_edit", "staff_delete",
            "blogs_view", "blogs_create", "blogs_edit", "blogs_delete",
            "settings_edit"
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2", 
          name: "Staff",
          description: "Nhân viên có quyền hạn chế",
          userCount: roleCounts.staff || 0,
          permissions: [
            "users_view", "services_view", "bookings_view", 
            "bookings_create", "bookings_edit", "staff_view"
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "User", 
          description: "Người dùng thông thường",
          userCount: roleCounts.user || 0,
          permissions: [
            "bookings_view", "bookings_create"
          ],
          createdAt: new Date().toISOString(),
        },
      ];
    }
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleData: { name: string; description: string; permissions: string[] }) => {
      throw new Error("Chức năng tạo vai trò mới sẽ được triển khai khi có bảng roles trong database");
    },
    onSuccess: () => {
      toast.success("Tạo vai trò thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo vai trò");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...roleData }: { id: string; name: string; description: string; permissions: string[] }) => {
      throw new Error("Chức năng cập nhật vai trò sẽ được triển khai khi có bảng roles trong database");
    },
    onSuccess: () => {
      toast.success("Cập nhật vai trò thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật vai trò");
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      throw new Error("Chức năng xóa vai trò sẽ được triển khai khi có bảng roles trong database");
    },
    onSuccess: () => {
      toast.success("Xóa vai trò thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi xóa vai trò");
    },
  });
};
