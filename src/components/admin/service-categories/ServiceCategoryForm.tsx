
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên danh mục phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type FormValues = z.infer<typeof categoryFormSchema>;

interface ServiceCategoryFormProps {
  initialData?: {
    name: string;
    description?: string | null;
    icon?: string | null;
  };
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
  submitLabel: string;
}

export const ServiceCategoryForm = ({ 
  initialData, 
  onSubmit, 
  isLoading, 
  submitLabel 
}: ServiceCategoryFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (tùy chọn)</FormLabel>
              <FormControl>
                <Input placeholder="Tên icon" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
