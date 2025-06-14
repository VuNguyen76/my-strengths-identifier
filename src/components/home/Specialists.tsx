
import { useSpecialists } from "@/hooks/useSpecialists";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const Specialists = () => {
  const { specialists, loading } = useSpecialists();

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ chuyên gia</h2>
            <p className="text-gray-600">Gặp gỡ các chuyên gia hàng đầu về chăm sóc da</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Đội ngũ chuyên gia</h2>
          <p className="text-gray-600">Gặp gỡ các chuyên gia hàng đầu về chăm sóc da</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.slice(0, 6).map((specialist) => (
            <Card key={specialist.id} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src={specialist.image_url || "https://via.placeholder.com/80x80"} 
                    alt={specialist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg">{specialist.name}</CardTitle>
                <CardDescription>{specialist.role}</CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {specialist.experience}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{specialist.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialists;
