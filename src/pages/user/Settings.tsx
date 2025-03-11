import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  UserCircle, 
  Bell, 
  Shield, 
  Languages, 
  Mail, 
  Phone, 
  MapPin, 
  Upload,
  Lock,
  CreditCard,
  Trash2,
  Plus,
  Moon,
  Sun,
  Monitor
} from "lucide-react";

// Sample payment methods
const initialPaymentMethods = [
  {
    id: "1",
    type: "credit",
    number: "**** **** **** 4589",
    name: "Nguyễn Văn A",
    expires: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "bank",
    number: "Techcombank - **** 9845",
    name: "Nguyễn Văn A",
    expires: "",
    isDefault: false,
  }
];

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
    bio: "Tôi là khách hàng thường xuyên sử dụng dịch vụ spa."
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    promotional: false,
    reminder: true,
    newsletter: false,
  });

  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [newPaymentDialogOpen, setNewPaymentDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: "credit",
    number: "",
    name: "",
    expires: "",
    cvv: "",
  });
  
  const [language, setLanguage] = useState("vi");

  const handleProfileChange = (key: keyof typeof profileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveProfile = () => {
    toast.success("Thông tin cá nhân đã được cập nhật");
  };

  const handleSaveNotifications = () => {
    toast.success("Cài đặt thông báo đã được lưu");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mật khẩu đã được thay đổi thành công");
  };

  const handleUploadAvatar = () => {
    toast.success("Ảnh đại diện đã được cập nhật");
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({ ...prev, [name]: value }));
  };

  const addPaymentMethod = () => {
    // Basic validation
    if (!newPayment.number || !newPayment.name) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Format card number for display
    let displayNumber = newPayment.number;
    if (newPayment.type === "credit") {
      const last4 = newPayment.number.slice(-4);
      displayNumber = `**** **** **** ${last4}`;
    } else {
      displayNumber = `Techcombank - **** ${newPayment.number.slice(-4)}`;
    }

    const newMethod = {
      id: (paymentMethods.length + 1).toString(),
      type: newPayment.type,
      number: displayNumber,
      name: newPayment.name,
      expires: newPayment.expires,
      isDefault: paymentMethods.length === 0, // First card is default
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setNewPaymentDialogOpen(false);
    setNewPayment({
      type: "credit",
      number: "",
      name: "",
      expires: "",
      cvv: "",
    });
    toast.success("Phương thức thanh toán đã được thêm");
  };

  const removePaymentMethod = (id: string) => {
    // Check if it's the default card
    const isDefault = paymentMethods.find(method => method.id === id)?.isDefault;
    
    // Filter out the card
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    
    // If we removed the default card, set a new default
    if (isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }
    
    setPaymentMethods(updatedMethods);
    toast.success("Phương thức thanh toán đã được xóa");
  };

  const setDefaultPaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    
    setPaymentMethods(updatedMethods);
    toast.success("Phương thức thanh toán mặc định đã được cập nhật");
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success(`Đã chuyển sang ${value === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt tài khoản</h1>
      </div>

      <Tabs defaultValue="profile" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="appearance">Giao diện</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780" />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Ảnh đại diện</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleUploadAvatar}>
                      <Upload className="h-4 w-4 mr-2" />
                      Tải lên
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <div className="flex">
                    <UserCircle className="w-5 h-5 mr-2 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex">
                    <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="flex">
                    <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleProfileChange("address", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveProfile}>
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>
                Quản lý các phương thức thanh toán của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Phương thức đã lưu</h3>
                <Button 
                  onClick={() => setNewPaymentDialogOpen(true)}
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm mới
                </Button>
              </div>

              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{method.number}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.name} {method.expires && `• Hết hạn: ${method.expires}`}
                          </p>
                          {method.isDefault && (
                            <Badge variant="outline" className="mt-1">Mặc định</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setDefaultPaymentMethod(method.id)}
                          >
                            Đặt mặc định
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => removePaymentMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <CreditCard className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Bạn chưa có phương thức thanh toán nào</p>
                  <Button 
                    onClick={() => setNewPaymentDialogOpen(true)}
                    variant="outline" 
                    className="mt-4"
                  >
                    Thêm phương thức thanh toán
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý cách bạn nhận thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">
                      Thông báo qua email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo về lịch hẹn qua email
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.email}
                  onCheckedChange={() => handleNotificationChange("email")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base">
                      Thông báo qua SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo về lịch hẹn qua tin nhắn SMS
                    </p>
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notificationSettings.sms}
                  onCheckedChange={() => handleNotificationChange("sms")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="reminder-notifications" className="text-base">
                      Nhắc nhở lịch hẹn
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo nhắc nhở trước lịch hẹn 24 giờ
                    </p>
                  </div>
                </div>
                <Switch
                  id="reminder-notifications"
                  checked={notificationSettings.reminder}
                  onCheckedChange={() => handleNotificationChange("reminder")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="promotional-notifications" className="text-base">
                      Thông báo khuyến mãi
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông tin về khuyến mãi và dịch vụ mới
                    </p>
                  </div>
                </div>
                <Switch
                  id="promotional-notifications"
                  checked={notificationSettings.promotional}
                  onCheckedChange={() => handleNotificationChange("promotional")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="newsletter-notifications" className="text-base">
                      Bản tin
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận bản tin định kỳ với mẹo chăm sóc sắc đẹp
                    </p>
                  </div>
                </div>
                <Switch
                  id="newsletter-notifications"
                  checked={notificationSettings.newsletter}
                  onCheckedChange={() => handleNotificationChange("newsletter")}
                />
              </div>

              <Button onClick={handleSaveNotifications} className="mt-4">
                Lưu thay đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Thay đổi mật khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu để bảo vệ tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  </div>
                  <Input type="password" id="current-password" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                  </div>
                  <Input type="password" id="new-password" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                  </div>
                  <Input type="password" id="confirm-password" />
                </div>
                <Button type="submit" className="mt-2">
                  Cập nhật mật khẩu
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Bảo mật tài khoản</CardTitle>
              <CardDescription>
                Cài đặt bảo mật bổ sung cho tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="two-factor" className="text-base">
                      Xác thực hai yếu tố
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Tăng cường bảo mật bằng xác thực hai yếu tố
                    </p>
                  </div>
                </div>
                <Switch id="two-factor" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="login-alerts" className="text-base">
                      Cảnh báo đăng nhập
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo khi có đăng nhập mới
                    </p>
                  </div>
                </div>
                <Switch id="login-alerts" checked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>
                Tùy chỉnh ngôn ngữ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-base">Ngôn ngữ</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={language === "vi" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleLanguageChange("vi")}
                  >
                    Tiếng Việt
                  </Button>
                  <Button 
                    variant={language === "en" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleLanguageChange("en")}
                  >
                    Tiếng Anh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Payment Method Dialog */}
      <Dialog open={newPaymentDialogOpen} onOpenChange={setNewPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Loại phương thức</Label>
              <div className="flex space-x-2">
                <Button 
                  type="button"
                  variant={newPayment.type === "credit" ? "default" : "outline"}
                  onClick={() => setNewPayment({...newPayment, type: "credit"})}
                  className="flex-1"
                >
                  Thẻ tín dụng
                </Button>
                <Button 
                  type="button"
                  variant={newPayment.type === "bank" ? "default" : "outline"}
                  onClick={() => setNewPayment({...newPayment, type: "bank"})}
                  className="flex-1"
                >
                  Tài khoản ngân hàng
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">
                {newPayment.type === "credit" ? "Số thẻ" : "Số tài khoản"}
              </Label>
              <Input 
                id="card-number"
                name="number"
                value={newPayment.number}
                onChange={handlePaymentInputChange}
                placeholder={newPayment.type === "credit" ? "1234 5678 9012 3456" : "0123456789"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Tên chủ thẻ</Label>
              <Input 
                id="card-name"
                name="name"
                value={newPayment.name}
                onChange={handlePaymentInputChange}
                placeholder="NGUYEN VAN A"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {newPayment.type === "credit" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="expires">Ngày hết hạn</Label>
                    <Input 
                      id="expires"
                      name="expires"
                      value={newPayment.expires}
                      onChange={handlePaymentInputChange}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv"
                      name="cvv"
                      value={newPayment.cvv}
                      onChange={handlePaymentInputChange}
                      placeholder="123"
                      type="password"
                      maxLength={3}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPaymentDialogOpen(false)}>Hủy</Button>
            <Button onClick={addPaymentMethod}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSettings;
