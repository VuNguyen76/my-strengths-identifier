
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Clock, Star, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSpecialists } from "@/hooks/useSpecialists";
import { Tables } from "@/integrations/supabase/types";

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

  // Update filtered list when specialists load
  useState(() => {
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
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Đội Ngũ Chuyên Viên</h1>
            <p className="text-gray-600">
              Gặp gỡ đội ngũ chuyên viên giàu kinh nghiệm của chúng tôi, những người sẽ chăm sóc làn da của bạn
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm chuyên viên..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            
            <Tabs value={selectedRole} onValueChange={handleRoleChange} className="w-full mb-8">
              <TabsList className="w-full h-auto flex flex-wrap">
                {specialistRoles.map(role => (
                  <TabsTrigger key={role} value={role} className="flex-1">
                    {role}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpecialists.length > 0 ? (
              filteredSpecialists.map((specialist) => (
                <Card key={specialist.id} className="overflow-hidden group hover:shadow-md transition-shadow">
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
                    <Button variant="outline" className="flex-1" onClick={() => openSpecialistDetail(specialist)}>
                      Xem chi tiết
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link to="/booking">Đặt lịch</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-500">Không tìm thấy chuyên viên nào.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("Tất cả");
                  setFilteredSpecialists(specialists);
                }}>
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Specialist Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedSpecialist && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSpecialist.name}</DialogTitle>
                <DialogDescription>{selectedSpecialist.role}</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div className="col-span-1">
                  <img 
                    src={selectedSpecialist.image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"} 
                    alt={selectedSpecialist.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="col-span-2 space-y-4">
                  {selectedSpecialist.experience && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Kinh nghiệm</h4>
                      <p className="text-sm">{selectedSpecialist.experience}</p>
                    </div>
                  )}
                  {selectedSpecialist.bio && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Tiểu sử</h4>
                      <p className="text-sm">{selectedSpecialist.bio}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button asChild>
                  <Link to="/booking">Đặt lịch với chuyên viên này</Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Specialists;
