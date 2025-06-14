
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Edit, 
  Trash, 
  Star 
} from "lucide-react";
import { toast } from "sonner";
import { useAdminSpecialists } from "@/hooks/useAdminSpecialists";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const AdminStaff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const queryClient = useQueryClient();
  const { data: staff = [], isLoading, error } = useAdminSpecialists(searchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const { error } = await supabase
        .from('specialists')
        .insert([{
          name: formData.get("name") as string,
          role: formData.get("specialty") as string,
          experience: formData.get("experience") as string,
          bio: formData.get("bio") as string,
          image_url: formData.get("image") as string || null,
          is_active: true
        }]);

      if (error) throw error;

      toast.success("Đã thêm chuyên viên mới thành công");
      setIsAddStaffDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["admin-specialists"] });
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const { error } = await supabase
        .from('specialists')
        .update({
          name: formData.get("name") as string,
          role: formData.get("specialty") as string,
          experience: formData.get("experience") as string,
          bio: formData.get("bio") as string,
          image_url: formData.get("image") as string || selectedStaff.image,
        })
        .eq('id', selectedStaff.id);

      if (error) throw error;

      toast.success(`Đã cập nhật thông tin chuyên viên ${selectedStaff.name} thành công`);
      setIsEditStaffDialogOpen(false);
      setSelectedStaff(null);
      queryClient.invalidateQueries({ queryKey: ["admin-specialists"] });
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('specialists')
        .delete()
        .eq('id', staffId);

      if (error) throw error;

      toast.success("Đã xóa chuyên viên thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-specialists"] });
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  const openEditDialog = (member: any) => {
    setSelectedStaff(member);
    setIsEditStaffDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge className="bg-green-500">Đang làm việc</Badge>
      : <Badge className="bg-gray-500">Nghỉ việc</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý chuyên viên</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý chuyên viên</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý chuyên viên</h1>
        <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm chuyên viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm chuyên viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để thêm chuyên viên mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên đầy đủ</Label>
                    <Input id="name" name="name" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Chuyên môn</Label>
                    <Input id="specialty" name="specialty" placeholder="Chăm sóc da" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Kinh nghiệm</Label>
                    <Input id="experience" name="experience" placeholder="5 năm" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Hình ảnh URL</Label>
                    <Input id="image" name="image" placeholder="https://example.com/image.jpg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Tiểu sử</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    placeholder="Thông tin chi tiết về chuyên viên..." 
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Thêm chuyên viên</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chuyên viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, chuyên môn..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Chuyên môn</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.length > 0 ? (
                  staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                            }}
                          />
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.specialty}</TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                          <span>{member.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditDialog(member)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteStaff(member.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không tìm thấy chuyên viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditStaffDialogOpen} onOpenChange={setIsEditStaffDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin chuyên viên</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin của {selectedStaff?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <form onSubmit={handleEditStaff} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Tên đầy đủ</Label>
                    <Input 
                      id="edit-name" 
                      name="name" 
                      defaultValue={selectedStaff.name} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-specialty">Chuyên môn</Label>
                    <Input 
                      id="edit-specialty" 
                      name="specialty" 
                      defaultValue={selectedStaff.specialty} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-experience">Kinh nghiệm</Label>
                    <Input 
                      id="edit-experience" 
                      name="experience" 
                      defaultValue={selectedStaff.experience} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-image">Hình ảnh URL</Label>
                    <Input 
                      id="edit-image" 
                      name="image" 
                      defaultValue={selectedStaff.image} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bio">Tiểu sử</Label>
                  <Textarea 
                    id="edit-bio" 
                    name="bio" 
                    defaultValue={selectedStaff.bio}
                    placeholder="Thông tin chi tiết về chuyên viên..." 
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaff;
