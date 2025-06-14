
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type Specialist = Tables<'specialists'>;

interface SpecialistCardProps {
  specialist: Specialist;
  onViewDetails: (specialist: Specialist) => void;
}

const SpecialistCard = ({ specialist, onViewDetails }: SpecialistCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={specialist.image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"}
          alt={specialist.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold">{specialist.name}</h3>
          <p className="text-white/80 text-sm">{specialist.role}</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{specialist.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <span className="font-medium text-primary">{specialist.role}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {specialist.experience && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="w-4 h-4 mr-1" />
            <span>{specialist.experience}</span>
          </div>
        )}
        <p className="line-clamp-2 text-gray-600">
          {specialist.bio || "Chuyên viên giàu kinh nghiệm, luôn tận tâm với khách hàng."}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onViewDetails(specialist)}>
          Xem chi tiết
        </Button>
        <Button className="flex-1" asChild>
          <Link to="/booking">Đặt lịch</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpecialistCard;
