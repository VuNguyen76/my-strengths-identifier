
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlusCircle, Edit, Trash2, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAdminRoles, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/useAdminRoles";

// Define role schema
const roleFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên vai trò phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
});

// Define permissions
const defaultPermissions = [
  { id: "users_view", name: "Xem người dùng", group: "Người dùng" },
  { id: "users_create", name: "Thêm người dùng", group: "Người dùng" },
  { id: "users_edit", name: "Sửa người dùng", group: "Người dùng" },
  { id: "users_delete", name: "Xóa người dùng", group: "Người dùng" },
  
  { id: "services_view", name: "Xem dịch vụ", group: "Dịch vụ" },
  { id: "services_create", name: "Thêm dịch vụ", group: "Dịch vụ" },
  { id: "services_edit", name: "Sửa dịch vụ", group: "Dịch vụ" },
  { id: "services_delete", name: "Xóa dịch vụ", group: "Dịch vụ" },
  
  { id: "bookings_view", name: "Xem lịch đặt", group: "Lịch đặt" },
  { id: "bookings_create", name: "Thêm lịch đặt", group: "Lịch đặt" },
  { id: "bookings_edit", name: "Sửa lịch đặt", group: "Lịch đặt" },
  { id: "bookings_delete", name: "Xóa lịch đặt", group: "Lịch đặt" },
  
  { id: "reports_view", name: "Xem báo cáo", group: "Báo cáo" },
  
  { id: "transactions_view", name: "Xem giao dịch", group: "Giao dịch" },
  { id: "transactions_create", name: "Thêm giao dịch", group: "Giao dịch" },
  
  { id: "staff_view", name: "Xem chuyên viên", group: "Chuyên viên" },
  { id: "staff_create", name: "Thêm chuyên viên", group: "Chuyên viên" },
  { id: "staff_edit", name: "Sửa chuyên viên", group: "Chuyên viên" },
  { id: "staff_delete", name: "Xóa chuyên viên", group: "Chuyên viên" },
  
  { id: "blogs_view", name: "Xem bài viết", group: "Blog" },
  { id: "blogs_create", name: "Thêm bài viết", group: "Blog" },
  { id: "blogs_edit", name: "Sửa bài viết", group: "Blog" },
  { id: "blogs_delete", name: "Xóa bài viết", group: "Blog" },
  
  { id: "settings_edit", name: "Chỉnh sửa cài đặt", group: "Cài đặt" },
];

type Role = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createdAt: string;
};

const Roles = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: roles = [], isLoading, error } = useAdminRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  // Group permissions by category
  const groupedPermissions = defaultPermissions.reduce<Record<string, typeof defaultPermissions>>(
    (groups, permission) => {
      const group = permission.group;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(permission);
      return groups;
    },
    {}
  );

  // Add role form
  const addForm = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Edit role form
  const editForm = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleAddRole = (values: z.infer<typeof roleFormSchema>) => {
    createRole.mutate({
      name: values.name,
      description: values.description || "",
      permissions: selectedPermissions,
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        addForm.reset();
        setSelectedPermissions([]);
      }
    });
  };

  const handleEditRole = (values: z.infer<typeof roleFormSchema>) => {
    if (currentRole) {
      updateRole.mutate({
        id: currentRole.id,
        name: values.name,
        description: values.description || "",
        permissions: selectedPermissions,
      }, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setCurrentRole(null);
          setSelectedPermissions([]);
        }
      });
    }
  };

  const handleDeleteRole = () => {
    if (currentRole) {
      deleteRole.mutate(currentRole.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCurrentRole(null);
        }
      });
    }
  };

  const openEditDialog = (role: Role) => {
    setCurrentRole(role);
    editForm.reset({
      name: role.name,
      description: role.description,
    });
    setSelectedPermissions(role.permissions);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setCurrentRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  const handleSelectAllInGroup = (group: string, isChecked: boolean) => {
    const groupPermissionIds = groupedPermissions[group].map(p => p.id);
    
    if (isChecked) {
      // Add all permissions from this group that aren't already selected
      const newPermissions = [...selectedPermissions];
      for (const permId of groupPermissionIds) {
        if (!newPermissions.includes(permId)) {
          newPermissions.push(permId);
        }
      }
      setSelectedPermissions(newPermissions);
    } else {
      // Remove all permissions from this group
      setSelectedPermissions(selectedPermissions.filter(id => !groupPermissionIds.includes(id)));
    }
  };

  const isGroupFullySelected = (group: string) => {
    const groupPermissionIds = groupedPermissions[group].map(p => p.id);
    return groupPermissionIds.every(id => selectedPermissions.includes(id));
  };

  const isGroupPartiallySelected = (group: string) => {
    const groupPermissionIds = groupedPermissions[group].map(p => p.id);
    return groupPermissionIds.some(id => selectedPermissions.includes(id)) && 
           !groupPermissionIds.every(id => selectedPermissions.includes(id));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Phân quyền người dùng</h1>
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
          <h1 className="text-2xl font-bold">Phân quyền người dùng</h1>
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
        <h1 className="text-2xl font-bold">Phân quyền người dùng</h1>
        <Button onClick={() => {
          setIsAddDialogOpen(true);
          setSelectedPermissions([]);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm vai trò
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý:</strong> Hiện tại hệ thống đang sử dụng vai trò cơ bản từ bảng user_profiles. 
          Để có chức năng phân quyền đầy đủ, cần tạo bảng roles và permissions riêng trong database.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên vai trò</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số người dùng</TableHead>
                <TableHead>Số quyền hạn</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.userCount}</TableCell>
                  <TableCell>{role.permissions.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(role)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Xem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => openDeleteDialog(role)}
                        disabled={role.id === "1" || role.id === "2" || role.id === "3"}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm vai trò mới</DialogTitle>
            <DialogDescription>
              Tạo vai trò mới và phân quyền cho người dùng trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddRole)} className="space-y-6">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên vai trò</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên vai trò" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input placeholder="Mô tả vai trò này" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Phân quyền</Label>
                <div className="mt-2 border rounded-md p-4 max-h-[300px] overflow-y-auto">
                  {Object.entries(groupedPermissions).map(([group, permissions]) => (
                    <div key={group} className="mb-4">
                      <div className="flex items-center mb-2">
                        <Checkbox 
                          id={`group-${group}`}
                          checked={isGroupFullySelected(group)}
                          className="mr-2 data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                          data-state={isGroupPartiallySelected(group) ? "indeterminate" : undefined}
                          onCheckedChange={(checked) => 
                            handleSelectAllInGroup(group, checked === true)
                          }
                        />
                        <Label htmlFor={`group-${group}`} className="font-bold">
                          {group}
                        </Label>
                      </div>
                      <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center">
                            <Checkbox 
                              id={`add-${permission.id}`}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.id, checked === true)
                              }
                              className="mr-2"
                            />
                            <Label htmlFor={`add-${permission.id}`}>{permission.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createRole.isPending}>
                  {createRole.isPending ? "Đang tạo..." : "Tạo vai trò"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Xem vai trò</DialogTitle>
            <DialogDescription>
              Xem thông tin và phân quyền của vai trò hiện tại.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Tên vai trò</Label>
              <Input value={currentRole?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Input value={currentRole?.description || ""} readOnly />
            </div>

            <div>
              <Label>Phân quyền</Label>
              <div className="mt-2 border rounded-md p-4 max-h-[300px] overflow-y-auto">
                {Object.entries(groupedPermissions).map(([group, permissions]) => (
                  <div key={group} className="mb-4">
                    <div className="flex items-center mb-2">
                      <Label className="font-bold">{group}</Label>
                    </div>
                    <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center">
                          <Checkbox 
                            checked={currentRole?.permissions.includes(permission.id)}
                            disabled
                            className="mr-2"
                          />
                          <Label>{permission.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vai trò "{currentRole?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRole} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteRole.isPending}
            >
              {deleteRole.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Roles;
