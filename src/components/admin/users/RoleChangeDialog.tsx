
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

  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const newRole = formData.get('new-role') as 'user' | 'staff' | 'admin';

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(`Đã thay đổi vai trò của ${user.name} thành công`);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
                <option value="user">Người dùng</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
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
