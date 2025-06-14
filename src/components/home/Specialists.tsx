
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSpecialists } from "@/hooks/useSpecialists";

const Specialists = () => {
  const { data: specialists = [], isLoading } = useSpecialists();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội Ngũ Chuyên Viên</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đội ngũ chuyên viên giàu kinh nghiệm, tận tâm chăm sóc làn da của bạn
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow animate-pulse">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Đội Ngũ Chuyên Viên</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đội ngũ chuyên viên giàu kinh nghiệm, tận tâm chăm sóc làn da của bạn
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {specialists.slice(0, 3).map((specialist) => (
            <Card key={specialist.id} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={specialist.image_url || "https://via.placeholder.com/96"}
                    alt={specialist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl mb-2">{specialist.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {specialist.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{specialist.experience}</p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {specialist.bio}
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/specialists">Xem chi tiết</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/specialists">Xem tất cả chuyên viên</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Specialists;
