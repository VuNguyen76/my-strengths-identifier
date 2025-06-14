
import { useState } from "react";
import { Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { useAdminSpecialists } from "@/hooks/useAdminSpecialists";
import {
  useAdminSchedules,
  useCreateOrUpdateSchedule,
  useDeleteSchedule,
  type SpecialistSchedule
} from "@/hooks/useAdminSchedules";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

const scheduleFormSchema = z.object({
  specialist_id: z.string().min(1, "Vui lòng chọn chuyên viên"),
  date: z.string().min(1, "Vui lòng chọn ngày"),
  time_slots: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một khung giờ"),
});

type FormValues = z.infer<typeof scheduleFormSchema>;

const Schedule = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<SpecialistSchedule | null>(null);

  const { specialists, loading: specialistsLoading } = useAdminSpecialists();
  const { data: schedules = [], isLoading, error } = useAdminSchedules();
  const createOrUpdateSchedule = useCreateOrUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const form = useForm<FormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      specialist_id: "",
      date: "",
      time_slots: [],
    },
  });

  const handleAddSchedule = (values: FormValues) => {
    createOrUpdateSchedule.mutate({
      specialist_id: values.specialist_id,
      date: values.date,
      time_slots: values.time_slots,
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        form.reset();
      }
    });
  };

  const handleEditSchedule = (values: FormValues) => {
    createOrUpdateSchedule.mutate({
      specialist_id: values.specialist_id,
      date: values.date,
      time_slots: values.time_slots,
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setCurrentSchedule(null);
        form.reset();
      }
    });
  };

  const handleDeleteSchedule = () => {
    if (currentSchedule) {
      deleteSchedule.mutate(currentSchedule.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCurrentSchedule(null);
        }
      });
    }
  };

  const openEditDialog = (schedule: SpecialistSchedule) => {
    setCurrentSchedule(schedule);
    form.reset({
      specialist_id: schedule.specialist_id,
      date: schedule.date,
      time_slots: schedule.time_slots,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (schedule: SpecialistSchedule) => {
    setCurrentSchedule(schedule);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading || specialistsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản lý lịch làm việc</h1>
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
          <h1 className="text-2xl font-bold">Quản lý lịch làm việc</h1>
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
        <h1 className="text-2xl font-bold">Quản lý lịch làm việc</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm lịch làm việc
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch làm việc</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chuyên viên</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Khung giờ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {schedule.specialist?.name || "Chưa có tên"}
                  </TableCell>
                  <TableCell>
                    {new Date(schedule.date).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {schedule.time_slots.map((slot, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {slot}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(schedule)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => openDeleteDialog(schedule)}
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

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setCurrentSchedule(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "Chỉnh sửa lịch làm việc" : "Thêm lịch làm việc mới"}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen 
                ? "Chỉnh sửa thông tin lịch làm việc hiện tại."
                : "Tạo lịch làm việc mới cho chuyên viên."
              }
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(isEditDialogOpen ? handleEditSchedule : handleAddSchedule)} className="space-y-4">
              <FormField
                control={form.control}
                name="specialist_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chuyên viên</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chuyên viên" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialists.map((specialist) => (
                          <SelectItem key={specialist.id} value={specialist.id}>
                            {specialist.name} - {specialist.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time_slots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khung giờ làm việc</FormLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <div key={slot} className="flex items-center space-x-2">
                          <Checkbox
                            id={slot}
                            checked={field.value?.includes(slot)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, slot]);
                              } else {
                                field.onChange(field.value?.filter((s: string) => s !== slot));
                              }
                            }}
                          />
                          <label htmlFor={slot} className="text-sm font-medium">
                            {slot}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={createOrUpdateSchedule.isPending}>
                  {createOrUpdateSchedule.isPending 
                    ? "Đang lưu..." 
                    : (isEditDialogOpen ? "Lưu thay đổi" : "Thêm lịch làm việc")
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Schedule Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lịch làm việc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch làm việc ngày {currentSchedule?.date ? new Date(currentSchedule.date).toLocaleDateString('vi-VN') : ''} của chuyên viên {currentSchedule?.specialist?.name}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSchedule} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSchedule.isPending}
            >
              {deleteSchedule.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Schedule;
