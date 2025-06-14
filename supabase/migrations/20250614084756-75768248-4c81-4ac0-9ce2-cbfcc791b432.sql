
-- Tạo enum cho các trạng thái
CREATE TYPE booking_status AS ENUM ('upcoming', 'completed', 'canceled', 'pending');
CREATE TYPE payment_status AS ENUM ('completed', 'pending', 'failed', 'refunded');
CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');

-- Bảng danh mục dịch vụ
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng dịch vụ
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- phút
  category_id UUID REFERENCES service_categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng chuyên viên
CREATE TABLE specialists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience TEXT,
  bio TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lịch làm việc của chuyên viên
CREATE TABLE specialist_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID REFERENCES specialists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0-6 (Chủ nhật - Thứ 7)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true
);

-- Bảng khung giờ
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time TEXT NOT NULL UNIQUE
);

-- Bảng người dùng mở rộng
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng đặt lịch
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  specialist_id UUID REFERENCES specialists(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  total_price INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng chi tiết dịch vụ trong đặt lịch
CREATE TABLE booking_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  price INTEGER NOT NULL
);

-- Bảng thanh toán
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  amount INTEGER NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng blog categories
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng blogs
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  author TEXT NOT NULL,
  category_id UUID REFERENCES blog_categories(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chèn dữ liệu mẫu cho categories
INSERT INTO service_categories (name, description, icon) VALUES
('Chăm sóc da', 'Các dịch vụ chăm sóc da cơ bản và chuyên sâu', 'Sparkles'),
('Điều trị', 'Các dịch vụ điều trị da chuyên sâu', 'Syringe'),
('Trẻ hóa', 'Các dịch vụ trẻ hóa da và chống lão hóa', 'Clock'),
('Massage', 'Các dịch vụ massage mặt và cơ thể', 'Hand'),
('Làm đẹp', 'Các dịch vụ làm đẹp khác', 'Gem');

-- Chèn dữ liệu mẫu cho services
INSERT INTO services (name, description, price, duration, category_id, image_url) 
SELECT 
  'Chăm sóc da cơ bản', 
  'Làm sạch, tẩy tế bào chết và dưỡng ẩm chuyên sâu', 
  450000, 
  60, 
  id,
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1740'
FROM service_categories WHERE name = 'Chăm sóc da';

INSERT INTO services (name, description, price, duration, category_id, image_url) 
SELECT 
  'Trị mụn chuyên sâu', 
  'Điều trị mụn, thâm nám và các vấn đề da khác', 
  650000, 
  90, 
  id,
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1740'
FROM service_categories WHERE name = 'Điều trị';

INSERT INTO services (name, description, price, duration, category_id, image_url) 
SELECT 
  'Trẻ hóa da', 
  'Sử dụng công nghệ hiện đại giúp làn da trẻ trung hơn', 
  850000, 
  120, 
  id,
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1740'
FROM service_categories WHERE name = 'Trẻ hóa';

INSERT INTO services (name, description, price, duration, category_id, image_url) 
SELECT 
  'Massage mặt', 
  'Kỹ thuật massage thư giãn và làm săn chắc da mặt', 
  350000, 
  45, 
  id,
  'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=1740'
FROM service_categories WHERE name = 'Massage';

INSERT INTO services (name, description, price, duration, category_id, image_url) 
SELECT 
  'Tẩy trang chuyên sâu', 
  'Làm sạch sâu và loại bỏ mọi bụi bẩn, tạp chất trên da', 
  250000, 
  30, 
  id,
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1734'
FROM service_categories WHERE name = 'Chăm sóc da';

-- Chèn dữ liệu mẫu cho specialists
INSERT INTO specialists (name, role, experience, bio, image_url) VALUES
('Nguyễn Thị A', 'Chuyên viên điều trị da', '5 năm', 'Chuyên viên với 5 năm kinh nghiệm trong điều trị các vấn đề về da và thẩm mỹ.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374'),
('Trần Văn B', 'Chuyên viên trẻ hóa', '7 năm', 'Với 7 năm kinh nghiệm, chuyên viên là chuyên gia hàng đầu về các kỹ thuật trẻ hóa da.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470'),
('Lê Thị C', 'Chuyên viên massage', '3 năm', 'Chuyên viên với hơn 3 năm kinh nghiệm trong lĩnh vực massage trị liệu và thư giãn.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470');

-- Chèn dữ liệu cho time slots
INSERT INTO time_slots (time) VALUES
('09:00'), ('10:00'), ('11:00'), ('14:00'), ('15:00'), ('16:00'), ('17:00');

-- Chèn dữ liệu cho specialist availability
INSERT INTO specialist_availability (specialist_id, day_of_week, start_time, end_time) 
SELECT s.id, generate_series(1, 5), '09:00', '17:00'
FROM specialists s;

-- Tạo RLS policies
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policies cho public read access
CREATE POLICY "Allow public read access to service_categories" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to specialists" ON specialists FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to specialist_availability" ON specialist_availability FOR SELECT USING (true);
CREATE POLICY "Allow public read access to time_slots" ON time_slots FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blog_categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to published blogs" ON blogs FOR SELECT USING (is_published = true);

-- Policies cho user profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies cho bookings
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- Policies cho booking_services
CREATE POLICY "Users can view their booking services" ON booking_services FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
);
CREATE POLICY "Users can insert booking services" ON booking_services FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
);

-- Policies cho payments
CREATE POLICY "Users can view their payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
);

-- Tạo function để tự động tạo user profile khi đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data ->> 'name', 'user');
  RETURN new;
END;
$$;

-- Tạo trigger để tự động tạo profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Tạo function để update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Tạo triggers cho updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON service_categories FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON specialists FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
