
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRoles = () => {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      // For now, we'll return static roles since there's no roles table in the database yet
      // This can be updated when a proper roles/permissions system is implemented
      
      // Get user counts for each role from user_profiles
      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select('role');

      const roleCounts = userProfiles?.reduce((acc: Record<string, number>, profile) => {
        const role = profile.role || 'user';
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
