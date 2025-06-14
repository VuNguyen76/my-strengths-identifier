
import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingData } from "@/pages/Booking";
import { bookingFormSchema, type BookingFormValues } from "./schema";
import { ServiceMultiSelect } from "./ServiceMultiSelect";
import { SpecialistSelect } from "./SpecialistSelect";
import { DateTimeSelect } from "./DateTimeSelect";
import { CustomerInfo } from "./CustomerInfo";
import { useServices } from "@/hooks/useServices";
import { useSpecialists } from "@/hooks/useSpecialists";
import { useBooking } from "@/hooks/useBooking";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface BookingFormProps {
  onFormUpdate: (data: BookingData) => void;
  onBookingComplete: () => void;
}

const BookingForm = ({ onFormUpdate, onBookingComplete }: BookingFormProps) => {
  const { services } = useServices();
  const { specialists } = useSpecialists();
  const { createBooking, loading: bookingLoading } = useBooking();
  const [user, setUser] = useState<any>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      services: [],
      name: "",
      phone: "",
      email: "",
    }
  });

  useEffect(() => {
    // Kiểm tra user hiện tại
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const serviceIds = value.services || [];
      const specialistId = value.specialist;

      const selectedServices = serviceIds.map(id => 
        services.find(s => s.id === id)
      ).filter(Boolean);

      const selectedSpecialist = specialistId ? specialists.find(s => s.id === specialistId) : undefined;

      const bookingData: BookingData = {
        services: selectedServices?.map(s => ({
          id: s!.id,
          name: s!.name,
          price: s!.price
        })),
        specialist: selectedSpecialist ? {
          id: selectedSpecialist.id,
          name: selectedSpecialist.name
        } : undefined,
        date: value.date,
        time: value.time,
        customerName: value.name,
        customerPhone: value.phone,
        customerEmail: value.email,
      };

      onFormUpdate(bookingData);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, onFormUpdate, services, specialists]);

  const onSubmit = async (values: BookingFormValues) => {
    console.log('Submitting booking:', values);
    
    // Tính tổng giá từ các dịch vụ đã chọn
    const selectedServices = values.services.map(id => 
      services.find(s => s.id === id)
    ).filter(Boolean);
    
    const totalPrice = selectedServices.reduce((sum, service) => sum + (service?.price || 0), 0);

    const bookingData = {
      user_id: user?.id || null,
      specialist_id: values.specialist,
      booking_date: values.date.toISOString().split('T')[0],
      booking_time: values.time,
      total_price: totalPrice,
      customer_name: values.name,
      customer_phone: values.phone,
      customer_email: values.email,
      status: 'pending' as const
    };

    const { error } = await createBooking(bookingData, values.services);
    
    if (!error) {
      onBookingComplete();
    } else {
      console.error('Booking error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ServiceMultiSelect form={form} />
        <SpecialistSelect form={form} />
        <DateTimeSelect form={form} />
        <CustomerInfo form={form} />
        <Button type="submit" className="w-full" disabled={bookingLoading}>
          {bookingLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đặt lịch...
            </>
          ) : (
            'Đặt lịch'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
