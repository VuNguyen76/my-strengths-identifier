
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ServiceCategoryForm, FormValues } from "./ServiceCategoryForm";
import { ServiceCategory } from "@/hooks/useAdminServiceCategories";

interface ServiceCategoryDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  currentCategory: ServiceCategory | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  onAddDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onAddCategory: (values: FormValues) => void;
  onEditCategory: (values: FormValues) => void;
  onDeleteCategory: () => void;
}

export const ServiceCategoryDialogs = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  currentCategory,
  createLoading,
  updateLoading,
  deleteLoading,
  onAddDialogChange,
  onEditDialogChange,
  onDeleteDialogChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: ServiceCategoryDialogsProps) => {
  return (
    <>
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục dịch vụ mới</DialogTitle>
            <DialogDescription>
              Tạo danh mục dịch vụ mới để phân loại các dịch vụ.
            </DialogDescription>
          </DialogHeader>
          <ServiceCategoryForm
            onSubmit={onAddCategory}
            isLoading={createLoading}
            submitLabel="Thêm danh mục"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục dịch vụ</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin của danh mục dịch vụ hiện tại.
            </DialogDescription>
          </DialogHeader>
          <ServiceCategoryForm
            initialData={currentCategory ? {
              name: currentCategory.name,
              description: currentCategory.description,
              icon: currentCategory.icon,
            } : undefined}
            onSubmit={onEditCategory}
            isLoading={updateLoading}
            submitLabel="Lưu thay đổi"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              {currentCategory?.services_count && currentCategory.services_count > 0 ? 
                `Không thể xóa danh mục "${currentCategory.name}" vì có ${currentCategory.services_count} dịch vụ đang sử dụng!` : 
                `Bạn có chắc chắn muốn xóa danh mục "${currentCategory?.name}"? Hành động này không thể hoàn tác.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteCategory} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={(currentCategory?.services_count && currentCategory.services_count > 0) || deleteLoading}
            >
              {deleteLoading ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
