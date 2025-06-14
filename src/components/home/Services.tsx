import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useServices } from "@/hooks/useServices";

const Services = () => {
  const { services, loading } = useServices();

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp đa dạng các dịch vụ chăm sóc da chuyên nghiệp
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow animate-pulse">
                <CardHeader>
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp đa dạng các dịch vụ chăm sóc da chuyên nghiệp
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service) => (
            <Card key={service.id} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img 
                    src={service.image_url || "https://via.placeholder.com/64"}
                    alt={service.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({service.duration} phút)
                  </span>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/booking">Đặt lịch ngay</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link to="/services">Xem tất cả dịch vụ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
