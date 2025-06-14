
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createdAt: string;
}

interface RolePermission {
  permission_id: string;
}

export const useRoles = () => {
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
        console.error('Error in useRoles:', error);
        return [];
      }
    }
  });
};
