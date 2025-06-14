
-- Tạo bảng roles để lưu trữ các vai trò
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng permissions để lưu trữ các quyền hạn
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    group_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng role_permissions để liên kết roles với permissions (many-to-many)
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(role_id, permission_id)
);

-- Tạo bảng user_roles để liên kết users với roles (many-to-many)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID,
    UNIQUE(user_id, role_id)
);

-- Bật Row Level Security cho các bảng
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho bảng roles (chỉ admin mới có thể quản lý)
CREATE POLICY "Anyone can view roles" ON public.roles
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert roles" ON public.roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update roles" ON public.roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete roles" ON public.roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Tạo policies cho bảng permissions (public read, admin write)
CREATE POLICY "Anyone can view permissions" ON public.permissions
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage permissions" ON public.permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Tạo policies cho bảng role_permissions (public read, admin write)
CREATE POLICY "Anyone can view role permissions" ON public.role_permissions
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage role permissions" ON public.role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Tạo policies cho bảng user_roles (users can view their own, admin can manage all)
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles" ON public.user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can manage user roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Thêm trigger để tự động cập nhật updated_at
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Chèn dữ liệu mặc định cho permissions
INSERT INTO public.permissions (name, description, group_name) VALUES 
-- Người dùng
('users_view', 'Xem người dùng', 'Người dùng'),
('users_create', 'Thêm người dùng', 'Người dùng'),
('users_edit', 'Sửa người dùng', 'Người dùng'),
('users_delete', 'Xóa người dùng', 'Người dùng'),

-- Dịch vụ
('services_view', 'Xem dịch vụ', 'Dịch vụ'),
('services_create', 'Thêm dịch vụ', 'Dịch vụ'),
('services_edit', 'Sửa dịch vụ', 'Dịch vụ'),
('services_delete', 'Xóa dịch vụ', 'Dịch vụ'),

-- Lịch đặt
('bookings_view', 'Xem lịch đặt', 'Lịch đặt'),
('bookings_create', 'Thêm lịch đặt', 'Lịch đặt'),
('bookings_edit', 'Sửa lịch đặt', 'Lịch đặt'),
('bookings_delete', 'Xóa lịch đặt', 'Lịch đặt'),

-- Báo cáo
('reports_view', 'Xem báo cáo', 'Báo cáo'),

-- Giao dịch
('transactions_view', 'Xem giao dịch', 'Giao dịch'),
('transactions_create', 'Thêm giao dịch', 'Giao dịch'),

-- Chuyên viên
('staff_view', 'Xem chuyên viên', 'Chuyên viên'),
('staff_create', 'Thêm chuyên viên', 'Chuyên viên'),
('staff_edit', 'Sửa chuyên viên', 'Chuyên viên'),
('staff_delete', 'Xóa chuyên viên', 'Chuyên viên'),

-- Blog
('blogs_view', 'Xem bài viết', 'Blog'),
('blogs_create', 'Thêm bài viết', 'Blog'),
('blogs_edit', 'Sửa bài viết', 'Blog'),
('blogs_delete', 'Xóa bài viết', 'Blog'),

-- Cài đặt
('settings_edit', 'Chỉnh sửa cài đặt', 'Cài đặt');

-- Chèn dữ liệu mặc định cho roles
INSERT INTO public.roles (name, description) VALUES 
('Admin', 'Quản trị viên hệ thống có toàn quyền truy cập'),
('Staff', 'Nhân viên có quyền hạn chế'),
('User', 'Người dùng thông thường');

-- Gán quyền cho role Admin (tất cả quyền)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'Admin';

-- Gán quyền cho role Staff (quyền hạn chế)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'Staff' AND p.name IN (
    'users_view', 'services_view', 'bookings_view', 
    'bookings_create', 'bookings_edit', 'staff_view'
);

-- Gán quyền cho role User (quyền cơ bản)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'User' AND p.name IN (
    'bookings_view', 'bookings_create'
);
