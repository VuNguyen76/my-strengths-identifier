
export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  group_name: string;
}

export interface RolePermission {
  permission_id: string;
}
