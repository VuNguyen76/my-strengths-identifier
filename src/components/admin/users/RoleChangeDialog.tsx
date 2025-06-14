import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminRoles } from "@/hooks/useAdminRoles";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'staff' | 'admin';
  status: string;
  createdAt: string;
}

interface RoleChangeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const RoleChangeDialog = ({ isOpen, onOpenChange, user }: RoleChangeDialogProps) => {
  const queryClient = useQueryClient();
  const { data: roles = [] } = useAdminRoles();

  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const selectedRoleId = formData.get('new-role') as string;
    const isLegacyRole = ['user', 'staff', 'admin'].includes(selectedRoleId);

    try {
      if (isLegacyRole) {
        // Update legacy role in user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ role: selectedRoleId as 'user' | 'staff' | 'admin' })
          .eq('id', user.id);

        if (profileError) {
          throw profileError;
        }
      } else {
        // Handle new role system
        // First remove any existing role assignments
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', user.id);

        // Add new role assignment
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role_id: selectedRoleId,
            assigned_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (roleError) {
          throw roleError;
        }

        // Also update user_profiles to keep legacy system in sync
        const selectedRole = roles.find(r => r.id === selectedRoleId);
        if (selectedRole) {
          await supabase
            .from('user_profiles')
            .update({ 
              role: selectedRole.name.toLowerCase() as 'user' | 'staff' | 'admin' 
            })
            .eq('id', user.id);
        }
      }

      toast.success(`Đã thay đổi vai trò của ${user.name} thành công`);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phân quyền người dùng</DialogTitle>
          <DialogDescription>
            Thay đổi vai trò của {user?.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleChangeRole} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-role">Vai trò mới</Label>
              <select 
                id="new-role" 
                name="new-role"
                className="w-full p-2 border rounded-md"
                defaultValue={user?.role}
              >
                <optgroup label="Vai trò hệ thống">
                  <option value="user">Người dùng</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </optgroup>
                {roles.length > 0 && (
                  <optgroup label="Vai trò tùy chỉnh">
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeDialog;
