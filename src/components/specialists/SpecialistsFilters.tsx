
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SpecialistsFiltersProps {
  specialistRoles: string[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const SpecialistsFilters = ({ specialistRoles, selectedRole, onRoleChange }: SpecialistsFiltersProps) => {
  return (
    <Tabs value={selectedRole} onValueChange={onRoleChange} className="w-full mb-8">
      <TabsList className="w-full h-auto flex flex-wrap">
        {specialistRoles.map(role => (
          <TabsTrigger key={role} value={role} className="flex-1">
            {role}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default SpecialistsFilters;
