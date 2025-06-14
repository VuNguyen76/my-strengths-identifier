
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SpecialistSchedule {
  id: string;
  specialist_id: string;
  date: string;
  time_slots: string[];
  created_at: string;
  updated_at: string;
  specialist?: {
    id: string;
    name: string;
    role: string;
  };
}

export const useAdminSchedules = () => {
  return useQuery({
    queryKey: ["admin-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialist_schedules')
        .select(`
          *,
          specialists(id, name, role)
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      return data?.map(schedule => ({
        ...schedule,
        specialist: schedule.specialists
      })) || [];
    }
  });
};

export const useCreateOrUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedule: {
      specialist_id: string;
      date: string;
      time_slots: string[];
    }) => {
      const { data, error } = await supabase
        .from('specialist_schedules')
        .upsert(schedule, {
          onConflict: 'specialist_id,date'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
      toast.success("Lịch làm việc đã được lưu thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('specialist_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
      toast.success("Lịch làm việc đã được xóa thành công!");
    },
    onError: (error: any) => {
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  });
};
