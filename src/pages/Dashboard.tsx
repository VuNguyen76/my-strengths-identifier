
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast.error("Bạn cần đăng nhập để truy cập trang này");
          navigate("/login");
          return;
        }

        setUser(session.user);

        // Fetch user profile
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
        } else if (profile) {
          setUserProfile(profile);
          
          // Redirect based on role
          if (profile.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking user:", error);
        toast.error("Đã xảy ra lỗi khi kiểm tra thông tin người dùng");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return null; // Actual rendering is handled by the redirect
};

export default Dashboard;
