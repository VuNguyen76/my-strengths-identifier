
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSpecialists } from "@/hooks/useSpecialists";
import { Tables } from "@/integrations/supabase/types";
import SpecialistsHeader from "@/components/specialists/SpecialistsHeader";
import SpecialistsSearch from "@/components/specialists/SpecialistsSearch";
import SpecialistsFilters from "@/components/specialists/SpecialistsFilters";
import SpecialistsList from "@/components/specialists/SpecialistsList";
import SpecialistDetailDialog from "@/components/specialists/SpecialistDetailDialog";

type Specialist = Tables<'specialists'>;

const Specialists = () => {
  const { specialists, loading, error } = useSpecialists();
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tất cả");
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Lấy danh sách roles từ data
  const specialistRoles = ["Tất cả", ...Array.from(new Set(specialists.map(s => s.role)))];

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterSpecialists(query, selectedRole);
  };

  // Handle role filter
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    filterSpecialists(searchQuery, role);
  };

  const filterSpecialists = (query: string, role: string) => {
    let filtered = specialists;
    
    if (query.trim()) {
      filtered = filtered.filter(specialist => 
        specialist.name.toLowerCase().includes(query.toLowerCase()) ||
        specialist.role.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (role !== "Tất cả") {
      filtered = filtered.filter(specialist => specialist.role === role);
    }
    
    setFilteredSpecialists(filtered);
  };

  // Open specialist detail
  const openSpecialistDetail = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setIsDetailOpen(true);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRole("Tất cả");
    setFilteredSpecialists(specialists);
  };

  // Update filtered list when specialists load
  useEffect(() => {
    setFilteredSpecialists(specialists);
  }, [specialists]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Đang tải chuyên viên...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Lỗi khi tải chuyên viên: {error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SpecialistsHeader />

          <div className="max-w-4xl mx-auto mb-8">
            <SpecialistsSearch 
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
            />
            
            <SpecialistsFilters
              specialistRoles={specialistRoles}
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SpecialistsList
              specialists={filteredSpecialists}
              onViewDetails={openSpecialistDetail}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </main>

      <SpecialistDetailDialog
        specialist={selectedSpecialist}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <Footer />
    </div>
  );
};

export default Specialists;
