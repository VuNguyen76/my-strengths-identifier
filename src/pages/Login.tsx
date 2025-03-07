
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Facebook, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginValues = z.infer<typeof loginSchema>;

// Facebook SDK initialization
const initFacebookSDK = () => {
  if (window.FB) return Promise.resolve();
  
  return new Promise<void>((resolve) => {
    // Load the Facebook SDK asynchronously
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1234567890', // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [facebookSDKLoaded, setFacebookSDKLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Facebook SDK
    initFacebookSDK().then(() => {
      setFacebookSDKLoaded(true);
    }).catch(error => {
      console.error("Error initializing Facebook SDK:", error);
    });
  }, []);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    setIsLoading(true);

    // Mock login simulation - In a real app, replace with actual API call
    setTimeout(() => {
      console.log("Login submitted:", values);
      setIsLoading(false);
      
      if (values.email === "demo@example.com" && values.password === "password123") {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify({ email: values.email, role: "user" }));
        navigate("/");
      } else {
        toast.error("Email hoặc mật khẩu không đúng");
      }
    }, 1000);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    
    if (!window.FB) {
      toast.error("Facebook SDK chưa được tải");
      setIsLoading(false);
      return;
    }
    
    window.FB.login((response) => {
      if (response.authResponse) {
        // Get user information from Facebook
        window.FB.api('/me', { fields: 'name,email' }, (userInfo) => {
          console.log('Facebook login successful', userInfo);
          toast.success("Đăng nhập Facebook thành công!");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify({ 
            email: userInfo.email || `${userInfo.id}@facebook.com`, 
            name: userInfo.name,
            provider: "facebook",
            facebookId: userInfo.id,
            role: "user"
          }));
          setIsLoading(false);
          navigate("/");
        });
      } else {
        console.log('Facebook login cancelled');
        toast.error("Đăng nhập Facebook bị hủy");
        setIsLoading(false);
      }
    }, { scope: 'public_profile,email' });
  };

  const handleGmailLogin = () => {
    setIsLoading(true);
    
    // Mock Gmail login - In a real app, replace with Google OAuth
    setTimeout(() => {
      console.log(`Login with Gmail`);
      setIsLoading(false);
      toast.error("Đăng nhập Gmail chưa được tích hợp");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 mt-16">
        <div className="w-full max-w-md">
          <AuthCard
            title="Đăng nhập"
            description="Nhập thông tin tài khoản của bạn"
          >
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleFacebookLogin}
                disabled={isLoading || !facebookSDKLoaded}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGmailLogin}
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Gmail
              </Button>
            </div>

            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  Hoặc đăng nhập bằng email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm space-y-2">
              <p>
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Đăng ký
                </Link>
              </p>
              <p>
                Đăng nhập quản trị viên?{" "}
                <Link
                  to="/admin/login"
                  className="text-primary hover:underline font-medium"
                >
                  Đăng nhập quản trị
                </Link>
              </p>
            </div>
          </AuthCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Add types for Facebook SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default Login;
