
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type Specialist = Tables<'specialists'>;

interface SpecialistDetailDialogProps {
  specialist: Specialist | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SpecialistDetailDialog = ({ specialist, isOpen, onOpenChange }: SpecialistDetailDialogProps) => {
  if (!specialist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{specialist.name}</DialogTitle>
          <DialogDescription>{specialist.role}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div className="col-span-1">
            <img 
              src={specialist.image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"} 
              alt={specialist.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="col-span-2 space-y-4">
            {specialist.experience && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Kinh nghiệm</h4>
                <p className="text-sm">{specialist.experience}</p>
              </div>
            )}
            {specialist.bio && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Tiểu sử</h4>
                <p className="text-sm">{specialist.bio}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button asChild>
            <Link to="/booking">Đặt lịch với chuyên viên này</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialistDetailDialog;
