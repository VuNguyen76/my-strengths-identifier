
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleData: { name: string; description: string; permissions: string[] }) => {
      // Create the role
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .insert({
          name: roleData.name,
          description: roleData.description
        })
        .select()
        .single();

      if (roleError) {
        throw roleError;
      }

      // Get permission IDs from permission names
      const { data: permissions, error: permissionsError } = await supabase
        .from('permissions')
        .select('id, name')
        .in('name', roleData.permissions);

      if (permissionsError) {
        throw permissionsError;
      }

      // Create role-permission relationships
      if (permissions && permissions.length > 0) {
        const rolePermissions = permissions.map(permission => ({
          role_id: role.id,
          permission_id: permission.id
        }));

        const { error: rolePermissionsError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (rolePermissionsError) {
          throw rolePermissionsError;
        }
      }

      return role;
    },
    onSuccess: () => {
      toast.success("Tạo vai trò thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error: any) => {
      console.error('Create role error:', error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo vai trò");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...roleData }: { id: string; name: string; description: string; permissions: string[] }) => {
      // Update the role
      const { error: roleError } = await supabase
        .from('roles')
        .update({
          name: roleData.name,
          description: roleData.description
        })
        .eq('id', id);

      if (roleError) {
        throw roleError;
      }

      // Delete existing role-permission relationships
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Get permission IDs from permission names
      const { data: permissions, error: permissionsError } = await supabase
        .from('permissions')
        .select('id, name')
        .in('name', roleData.permissions);

      if (permissionsError) {
        throw permissionsError;
      }

      // Create new role-permission relationships
      if (permissions && permissions.length > 0) {
        const rolePermissions = permissions.map(permission => ({
          role_id: id,
          permission_id: permission.id
        }));

        const { error: rolePermissionsError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (rolePermissionsError) {
          throw rolePermissionsError;
        }
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật vai trò thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error: any) => {
      console.error('Update role error:', error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật vai trò");
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Check if role is being used by any users
      const { data: userRoles, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role_id', id)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (userRoles && userRoles.length > 0) {
        throw new Error("Không thể xóa vai trò đang được sử dụng bởi người dùng");
      }

      // Delete the role (role_permissions will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Xóa vai trò thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error: any) => {
      console.error('Delete role error:', error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa vai trò");
    },
  });
};
