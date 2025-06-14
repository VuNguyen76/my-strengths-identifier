import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  group_name: string;
}

interface RolePermission {
  permission_id: string;
}

export const useAdminRoles = () => {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      try {
        // Fetch roles with their permissions
        const { data: roles, error: rolesError } = await supabase
          .from('roles')
          .select(`
            id,
            name,
            description,
            created_at,
            role_permissions (
              permission_id
            )
          `);

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          throw rolesError;
        }

        // Fetch all permissions for mapping
        const { data: permissions, error: permissionsError } = await supabase
          .from('permissions')
          .select('id, name');

        if (permissionsError) {
          console.error('Error fetching permissions:', permissionsError);
          throw permissionsError;
        }

        // Fetch user counts for each role from user_roles table
        const { data: userRoles, error: userRolesError } = await supabase
          .from('user_roles')
          .select(`
            role_id,
            roles!inner(name)
          `);

        if (userRolesError) {
          console.error('Error fetching user roles:', userRolesError);
        }

        // Also fetch from user_profiles for legacy role system
        const { data: userProfiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('role');

        if (profilesError) {
          console.error('Error fetching user profiles:', profilesError);
        }

        // Count users by role from both systems
        const newSystemCounts: Record<string, number> = {};
        if (userRoles) {
          userRoles.forEach((ur: any) => {
            const roleName = ur.roles?.name;
            if (roleName) {
              newSystemCounts[roleName] = (newSystemCounts[roleName] || 0) + 1;
            }
          });
        }

        const legacySystemCounts: Record<string, number> = {};
        if (userProfiles) {
          userProfiles.forEach((profile: any) => {
            const role = profile.role || 'user';
            legacySystemCounts[role] = (legacySystemCounts[role] || 0) + 1;
          });
        }

        // Create permission mapping
        const permissionMap = new Map(permissions?.map(p => [p.id, p.name]) || []);

        // Transform roles data
        const transformedRoles: Role[] = (roles || []).map((role: any) => {
          // Use new system count if available, otherwise fall back to legacy system
          const userCount = newSystemCounts[role.name] || legacySystemCounts[role.name.toLowerCase()] || 0;
          
          return {
            id: role.id,
            name: role.name,
            description: role.description || '',
            userCount,
            permissions: (role.role_permissions || []).map((rp: RolePermission) => 
              permissionMap.get(rp.permission_id) || ''
            ).filter(Boolean),
            createdAt: role.created_at
          };
        });

        return transformedRoles;

      } catch (error) {
        console.error('Error in useAdminRoles:', error);
        return [];
      }
    }
  });
};

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

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('group_name, name');

      if (error) {
        throw error;
      }

      return data as Permission[];
    }
  });
};
