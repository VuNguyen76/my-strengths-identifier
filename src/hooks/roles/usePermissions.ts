
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Permission {
  id: string;
  name: string;
  description: string;
  group_name: string;
}

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('group_name, name');

      if (error) {
        throw error;
      }

      return data as Permission[];
    }
  });
};
