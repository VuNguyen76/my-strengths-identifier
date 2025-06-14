
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import SpecialistCard from "./SpecialistCard";

type Specialist = Tables<'specialists'>;

interface SpecialistsListProps {
  specialists: Specialist[];
  onViewDetails: (specialist: Specialist) => void;
  onClearFilters: () => void;
}

const SpecialistsList = ({ specialists, onViewDetails, onClearFilters }: SpecialistsListProps) => {
  if (specialists.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-lg text-gray-500">Không tìm thấy chuyên viên nào.</p>
        <Button variant="outline" className="mt-4" onClick={onClearFilters}>
          Xóa bộ lọc
        </Button>
      </div>
    );
  }

  return (
    <>
      {specialists.map((specialist) => (
        <SpecialistCard
          key={specialist.id}
          specialist={specialist}
          onViewDetails={onViewDetails}
        />
      ))}
    </>
  );
};

export default SpecialistsList;
