
import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useAdminServiceCategories,
  useCreateServiceCategory,
  useUpdateServiceCategory,
  useDeleteServiceCategory,
  type ServiceCategory
} from "@/hooks/useAdminServiceCategories";

import { ServiceCategoryTable } from "@/components/admin/service-categories/ServiceCategoryTable";
import { ServiceCategoryDialogs } from "@/components/admin/service-categories/ServiceCategoryDialogs";
import { FormValues } from "@/components/admin/service-categories/ServiceCategoryForm";

const ServiceCategories = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ServiceCategory | null>(null);

  const { data: categories = [], isLoading, error } = useAdminServiceCategories();
  const createCategory = useCreateServiceCategory();
  const updateCategory = useUpdateServiceCategory();
  const deleteCategory = useDeleteServiceCategory();

  const handleAddCategory = (values: FormValues) => {
    createCategory.mutate({
      name: values.name,
      description: values.description || null,
      icon: values.icon || null,
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
      }
    });
  };

  const handleEditCategory = (values: FormValues) => {
    if (currentCategory) {
      updateCategory.mutate({
        id: currentCategory.id,
        name: values.name,
        description: values.description || null,
        icon: values.icon || null,
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
      if (currentCategory.services_count && currentCategory.services_count > 0) {
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

  const openEditDialog = (category: ServiceCategory) => {
    setCurrentCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: ServiceCategory) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý danh mục dịch vụ</h1>
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
          <h1 className="text-2xl font-bold">Quản lý danh mục dịch vụ</h1>
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
        <h1 className="text-2xl font-bold">Quản lý danh mục dịch vụ</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceCategoryTable
            categories={categories}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <ServiceCategoryDialogs
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        currentCategory={currentCategory}
        createLoading={createCategory.isPending}
        updateLoading={updateCategory.isPending}
        deleteLoading={deleteCategory.isPending}
        onAddDialogChange={setIsAddDialogOpen}
        onEditDialogChange={setIsEditDialogOpen}
        onDeleteDialogChange={setIsDeleteDialogOpen}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

export default ServiceCategories;
