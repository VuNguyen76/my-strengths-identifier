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
  
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Facebook SDK loading timeout"));
    }, 10000);
    
    window.fbAsyncInit = function() {
      clearTimeout(timeoutId);
      window.FB.init({
        appId: '1343611270219538',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    (function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Failed to load Facebook SDK"));
      };
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

// Google OAuth initialization - Improved with better error handling
const loadGoogleScript = () => {
  return new Promise<void>((resolve, reject) => {
    // Check if script already exists
    if (document.getElementById('google-login-sdk')) {
      return resolve();
    }
    
    const script = document.createElement('script');
    script.id = 'google-login-sdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(new Error(`Google SDK failed to load: ${error}`));
    document.head.appendChild(script);
  });
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [facebookSDKLoaded, setFacebookSDKLoaded] = useState(false);
  const [facebookSDKError, setFacebookSDKError] = useState<string | null>(null);
  const [googleSDKLoaded, setGoogleSDKLoaded] = useState(false);
  const [googleSDKError, setGoogleSDKError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Facebook SDK initialization
    initFacebookSDK()
      .then(() => {
        setFacebookSDKLoaded(true);
        console.log("Facebook SDK initialized successfully");
      })
      .catch(error => {
        console.error("Error initializing Facebook SDK:", error);
        setFacebookSDKError(error.message);
        toast.error("Không thể kết nối với Facebook. Vui lòng thử lại sau.");
      });
      
    // Google SDK initialization
    loadGoogleScript()
      .then(() => {
        // Allow some time for the script to be properly loaded
        setTimeout(() => {
          if (!window.google || !window.google.accounts) {
            throw new Error("Google accounts API not loaded properly");
          }
          
          try {
            window.google.accounts.id.initialize({
              client_id: "35156739608-j5hjt1e0v3a59et982igvj3l8ae2u7on.apps.googleusercontent.com", // Thay thế bằng Client ID của bạn
              callback: handleGoogleCallback,
              auto_select: false,
              cancel_on_tap_outside: true,
              context: 'signin', // Có thể là 'signin', 'signup', hoặc 'use'
              ux_mode: 'popup', // 'popup' hoặc 'redirect'
            });
            setGoogleSDKLoaded(true);
            console.log("Google SDK initialized successfully");
          } catch (initError) {
            console.error("Error during Google SDK initialization:", initError);
            setGoogleSDKError(String(initError));
            toast.error("Lỗi khi khởi tạo Google SDK. Vui lòng thử lại sau.");
          }
        }, 500);
      })
      .catch(error => {
        console.error("Error loading Google SDK:", error);
        setGoogleSDKError(error.message);
        toast.error("Không thể tải Google SDK. Vui lòng thử lại sau.");
      });
      
    // Cleanup function to prevent memory leaks
    return () => {
      // Any cleanup needed for SDKs
    };
  }, []);

  const handleGoogleCallback = (response: any) => {
    try {
      console.log("Google response:", response);
      
      if (!response || !response.credential) {
        toast.error("Không nhận được thông tin xác thực từ Google");
        return;
      }

      setIsLoading(true);
      
      // Decode the JWT token
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { email, name, picture, sub } = JSON.parse(jsonPayload);
      
      console.log('Google login successful', { email, name });
      
      // Store user data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ 
        email,
        name,
        provider: "google",
        googleId: sub,
        picture,
        role: "user"
      }));
      
      setIsLoading(false);
      toast.success("Đăng nhập Google thành công!");
      
      // Navigate to home page
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Error processing Google login:", error);
      setIsLoading(false);
      toast.error("Đã xảy ra lỗi khi xử lý đăng nhập Google.");
    }
  };

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    setIsLoading(true);

    // Mock login simulation - Replace with actual API call
    setTimeout(() => {
      console.log("Login submitted:", values);
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ email: values.email, role: "user" }));
      
      setIsLoading(false);
      toast.success("Đăng nhập thành công!");
      
      setTimeout(() => {
        navigate("/");
      }, 100);
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
          
          setTimeout(() => {
            navigate("/");
          }, 100);
        });
      } else {
        console.log('Facebook login cancelled');
        toast.error("Đăng nhập Facebook bị hủy");
        setIsLoading(false);
      }
    }, { scope: 'public_profile,email' });
  };

  const handleGmailLogin = () => {
    try {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        toast.error("Google SDK chưa được tải hoặc khởi tạo");
        return;
      }
      
      // For debugging
      console.log("Triggering Google sign-in prompt");
      
      // Render a custom Google button
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Google sign-in prompt not displayed:", notification.getNotDisplayedReason() || notification.getSkippedReason());
          // Fallback to standard prompt
          toast.error("Không thể hiển thị cửa sổ đăng nhập Google. Vui lòng thử lại sau.");
        } else {
          console.log("Google sign-in prompt displayed");
        }
      });
    } catch (error) {
      console.error("Error displaying Google sign-in:", error);
      toast.error("Đã xảy ra lỗi khi hiển thị đăng nhập Google");
    }
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
                disabled={isLoading || (!facebookSDKLoaded && facebookSDKError === null)}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGmailLogin}
                disabled={isLoading || (!googleSDKLoaded && googleSDKError === null)}
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
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
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

// Types for Facebook SDK and Google SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        }
      }
    };
  }
}

export default Login;