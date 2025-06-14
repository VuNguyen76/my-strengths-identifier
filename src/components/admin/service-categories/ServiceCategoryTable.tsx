
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceCategory } from "@/hooks/useAdminServiceCategories";

interface ServiceCategoryTableProps {
  categories: ServiceCategory[];
  onEdit: (category: ServiceCategory) => void;
  onDelete: (category: ServiceCategory) => void;
}

export const ServiceCategoryTable = ({ 
  categories, 
  onEdit, 
  onDelete 
}: ServiceCategoryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên danh mục</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Số dịch vụ</TableHead>
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
            <TableCell>{category.icon || "-"}</TableCell>
            <TableCell>{category.services_count || 0}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onDelete(category)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Xóa
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
