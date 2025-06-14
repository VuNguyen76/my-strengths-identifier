
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      setUser(null);
      setUserProfile(null);
      navigate("/");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "staff";
  const displayName = userProfile?.name || user?.user_metadata?.name || user?.email;

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-primary transition-colors font-medium">
              Trang chủ
            </Link>
            <Link to="/services" className="hover:text-primary transition-colors font-medium">
              Dịch vụ
            </Link>
            <Link to="/specialists" className="hover:text-primary transition-colors font-medium">
              Chuyên viên
            </Link>
            <Link to="/booking" className="hover:text-primary transition-colors font-medium">
              Đặt lịch
            </Link>
            <Link to="/blog" className="hover:text-primary transition-colors font-medium">
              Blog
            </Link>
            <Link to="/quiz" className="hover:text-primary transition-colors font-medium">
              Trắc nghiệm da
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {isAdmin ? <Shield size={16} className="text-primary" /> : <User size={16} />}
                    <span className="hidden sm:inline">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Tổng quan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile">Thông tin cá nhân</Link>
                  </DropdownMenuItem>
                  {userProfile?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Quản trị viên</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-4 border-t mt-3 space-y-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                Trang chủ
              </Link>
              <Link to="/services" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                Dịch vụ
              </Link>
              <Link to="/specialists" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                Chuyên viên
              </Link>
              <Link to="/booking" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                Đặt lịch
              </Link>
              <Link to="/blog" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                Blog
              </Link>
              <Link to="/quiz" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                Trắc nghiệm da
              </Link>
              
              {user && (
                <>
                  <Link to="/dashboard" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                    Tổng quan
                  </Link>
                  <Link to="/dashboard/profile" className="hover:text-primary transition-colors px-2 py-1.5 rounded font-medium">
                    Thông tin cá nhân
                  </Link>
                </>
              )}
            </div>
            
            <div className="pt-2 flex gap-2">
              {user ? (
                <Button variant="outline" className="flex-1" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link to="/register">Đăng ký</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
