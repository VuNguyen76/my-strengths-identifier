
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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

import {
  useAdminBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
  type BlogCategory
} from "@/hooks/useAdminBlogCategories";

// Blog category schema
const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên danh mục phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof categoryFormSchema>;

const BlogCategories = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<BlogCategory | null>(null);

  const { data: categories = [], isLoading, error } = useAdminBlogCategories();
  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory();
  const deleteCategory = useDeleteBlogCategory();

  // Add category form
  const addForm = useForm<FormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Edit category form
  const editForm = useForm<FormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleAddCategory = (values: FormValues) => {
    createCategory.mutate({
      name: values.name,
      description: values.description || null,
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        addForm.reset();
      }
    });
  };

  const handleEditCategory = (values: FormValues) => {
    if (currentCategory) {
      updateCategory.mutate({
        id: currentCategory.id,
        name: values.name,
        description: values.description || null,
      }, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setCurrentCategory(null);
        }
      });
    }
  };

  const handleDeleteCategory = () => {
    if (currentCategory) {
      if (currentCategory.posts_count && currentCategory.posts_count > 0) {
        setIsDeleteDialogOpen(false);
        return;
      }
      
      deleteCategory.mutate(currentCategory.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCurrentCategory(null);
        }
      });
    }
  };

  const openEditDialog = (category: BlogCategory) => {
    setCurrentCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: BlogCategory) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý danh mục blog</h1>
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
          <h1 className="text-2xl font-bold">Quản lý danh mục blog</h1>
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
        <h1 className="text-2xl font-bold">Quản lý danh mục blog</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục blog</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số bài viết</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate">
                      {category.description}
                    </div>
                  </TableCell>
                  <TableCell>{category.posts_count || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => openDeleteDialog(category)}
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

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục blog mới</DialogTitle>
            <DialogDescription>
              Tạo danh mục blog mới để phân loại các bài viết.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddCategory)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên danh mục" {...field} />
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
                      <Textarea 
                        placeholder="Mô tả danh mục này" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={createCategory.isPending}>
                  {createCategory.isPending ? "Đang thêm..." : "Thêm danh mục"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục blog</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin của danh mục blog hiện tại.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCategory)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên danh mục" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả danh mục này" 
                        className="resize-none" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateCategory.isPending}>
                  {updateCategory.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              {currentCategory?.posts_count && currentCategory.posts_count > 0 ? 
                `Không thể xóa danh mục "${currentCategory.name}" vì có ${currentCategory.posts_count} bài viết đang sử dụng!` : 
                `Bạn có chắc chắn muốn xóa danh mục "${currentCategory?.name}"? Hành động này không thể hoàn tác.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={(currentCategory?.posts_count && currentCategory.posts_count > 0) || deleteCategory.isPending}
            >
              {deleteCategory.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogCategories;
