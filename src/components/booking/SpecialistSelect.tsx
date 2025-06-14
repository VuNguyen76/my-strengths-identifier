
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "./schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSpecialists } from "@/hooks/useSpecialists";
import { Loader2 } from "lucide-react";

interface SpecialistSelectProps {
  form: UseFormReturn<BookingFormValues>;
}

export const SpecialistSelect = ({ form }: SpecialistSelectProps) => {
  const { specialists, loading, error } = useSpecialists();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">Đang tải chuyên viên...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Lỗi khi tải chuyên viên: {error}
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="specialist"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Chuyên viên</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chuyên viên" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {specialists.map((specialist) => (
                <SelectItem key={specialist.id} value={specialist.id} className="py-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={specialist.image_url || ''} alt={specialist.name} />
                      <AvatarFallback>{specialist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{specialist.name}</div>
                      <div className="text-xs text-muted-foreground">{specialist.role}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
