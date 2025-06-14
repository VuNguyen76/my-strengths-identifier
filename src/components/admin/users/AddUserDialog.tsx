
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserDialog = ({ isOpen, onOpenChange }: AddUserDialogProps) => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const queryClient = useQueryClient();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    if (!email || !password || !name) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsCreatingUser(true);
    
    try {
      // Create user through Supabase Auth with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          toast.error("Email này đã được đăng ký");
        } else {
          toast.error("Có lỗi xảy ra: " + authError.message);
        }
        return;
      }

      if (authData.user) {
        // Also create user profile in user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            name,
            phone,
            role: 'user'
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't show error to user as the auth user was created successfully
        }

        toast.success("Người dùng mới đã được thêm thành công");
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        (e.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      console.error("Add user error:", error);
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo tài khoản người dùng mới
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên đầy đủ *</Label>
              <Input id="name" name="name" placeholder="Nguyễn Văn A" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="example@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" name="phone" placeholder="0901234567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu *</Label>
              <Input id="password" name="password" type="password" placeholder="Tối thiểu 6 ký tự" required minLength={6} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreatingUser}>
              {isCreatingUser ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
