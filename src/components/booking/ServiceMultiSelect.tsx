
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "./schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";

interface ServiceMultiSelectProps {
  form: UseFormReturn<BookingFormValues>;
}

export const ServiceMultiSelect = ({ form }: ServiceMultiSelectProps) => {
  const { services, loading, error } = useServices();
  const selectedServices = form.watch("services") || [];

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = [...selectedServices];
    const index = currentServices.indexOf(serviceId);
    
    if (index > -1) {
      currentServices.splice(index, 1);
    } else {
      currentServices.push(serviceId);
    }
    
    form.setValue("services", currentServices, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Đang tải dịch vụ...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Lỗi khi tải dịch vụ: {error}
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="services"
      render={() => (
        <FormItem>
          <FormLabel>Dịch vụ</FormLabel>
          <FormControl>
            <Card>
              <CardContent className="p-4 grid gap-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3 p-3 rounded hover:bg-muted/40">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      id={`service-${service.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`service-${service.id}`}
                        className="flex justify-between text-sm font-medium cursor-pointer"
                      >
                        <span>{service.name}</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                        </span>
                      </label>
                      {service.description && (
                        <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                      )}
                      {service.duration && (
                        <div className="flex items-center text-muted-foreground text-xs mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{service.duration} phút</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
