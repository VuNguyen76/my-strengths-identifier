
// Re-export all hooks for backward compatibility
export { useRoles as useAdminRoles } from './roles/useRoles';
export { useCreateRole, useUpdateRole, useDeleteRole } from './roles/useRoleMutations';
export { usePermissions } from './roles/usePermissions';

// Export types for convenience
export type { Role, Permission } from './roles/types';
