
-- First, let's add some sample blog categories
INSERT INTO public.blog_categories (name, description) VALUES
('Chăm sóc da', 'Các bài viết về chăm sóc da và làm đẹp'),
('Trẻ hóa da', 'Các bài viết về chống lão hóa và trẻ hóa da'),
('Trị mụn', 'Các bài viết về điều trị mụn và vấn đề da'),
('Bảo vệ da', 'Các bài viết về bảo vệ da khỏi tác hại môi trường'),
('Dinh dưỡng', 'Các bài viết về dinh dưỡng cho làn da khỏe đẹp');

-- Now let's add some sample blog posts
INSERT INTO public.blogs (title, description, content, author, image_url, category_id, is_published) VALUES
(
  'Bí quyết chăm sóc da mùa hanh khô',
  'Làn da khô, bong tróc là nỗi lo thường trực trong mùa hanh khô. Hãy cùng khám phá những bí quyết giữ ẩm hiệu quả nhất.',
  '<p>Mùa đông với không khí hanh khô luôn là thử thách lớn đối với làn da. Nhiệt độ thấp kết hợp với độ ẩm không khí giảm mạnh khiến da dễ bị khô, bong tróc và mất nước.</p>

<h2>Nguyên nhân khiến da khô trong mùa đông</h2>

<p>Có nhiều yếu tố khiến da bị khô trong mùa đông:</p>
<ul>
  <li>Không khí lạnh có độ ẩm thấp</li>
  <li>Sử dụng máy sưởi làm giảm độ ẩm trong không khí</li>
  <li>Tắm nước nóng làm mất đi lớp dầu tự nhiên trên da</li>
  <li>Thiếu nước uống</li>
</ul>

<h2>Các bước chăm sóc da cơ bản trong mùa đông</h2>

<h3>1. Làm sạch nhẹ nhẹ</h3>
<p>Trong mùa đông, bạn nên chọn các sản phẩm làm sạch dịu nhẹ, không chứa sulfate và có độ pH cân bằng.</p>

<h3>2. Dưỡng ẩm chuyên sâu</h3>
<p>Sử dụng kem dưỡng ẩm dạng kem (cream) thay vì lotion.</p>',
  'Bác sĩ Nguyễn Thị A',
  'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  (SELECT id FROM public.blog_categories WHERE name = 'Chăm sóc da'),
  true
),
(
  'Top 5 liệu trình chống lão hóa hiệu quả nhất',
  'Khám phá những liệu trình chống lão hóa được các chuyên gia da liễu đánh giá cao và khuyên dùng.',
  '<p>Lão hóa da là quá trình tự nhiên mà ai cũng phải trải qua. Tuy nhiên, với sự phát triển của khoa học công nghệ, chúng ta có thể làm chậm quá trình này và duy trì làn da tươi trẻ lâu hơn.</p>

<h2>Các dấu hiệu lão hóa da phổ biến</h2>
<p>Trước khi tìm hiểu về các liệu trình chống lão hóa, hãy nhận biết các dấu hiệu lão hóa da:</p>
<ul>
  <li>Nếp nhăn và đường chân chim</li>
  <li>Da chảy xệ, mất độ đàn hồi</li>
  <li>Sạm nám, đốm nâu</li>
  <li>Da khô, thiếu độ ẩm</li>
  <li>Lỗ chân lông to</li>
  <li>Vết đỏ, mao mạch nổi</li>
</ul>

<h2>Top 5 liệu trình chống lão hóa hiệu quả</h2>

<h3>1. Liệu trình Retinol</h3>
<p>Retinol (dẫn xuất từ vitamin A) được coi là "vàng" trong việc chống lão hóa.</p>',
  'Chuyên gia Trần Văn B',
  'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  (SELECT id FROM public.blog_categories WHERE name = 'Trẻ hóa da'),
  true
),
(
  'Cách trị mụn hiệu quả tại nhà',
  'Những phương pháp đơn giản giúp bạn loại bỏ mụn một cách hiệu quả mà không cần đến spa.',
  '<p>Mụn là vấn đề phổ biến ảnh hưởng đến mọi lứa tuổi và loại da. Mặc dù có nhiều phương pháp điều trị tại các cơ sở thẩm mỹ, nhưng bạn cũng có thể áp dụng một số cách trị mụn hiệu quả tại nhà.</p>

<h2>Nguyên nhân gây mụn</h2>
<p>Để điều trị hiệu quả, trước tiên bạn cần hiểu nguyên nhân gây mụn:</p>
<ul>
  <li>Tắc nghẽn lỗ chân lông do bã nhờn và tế bào chết</li>
  <li>Vi khuẩn P. acnes phát triển</li>
  <li>Thay đổi hormone</li>
  <li>Stress và thiếu ngủ</li>
  <li>Chế độ ăn uống không lành mạnh</li>
</ul>

<h2>Các bước trị mụn tại nhà</h2>

<h3>1. Làm sạch da đúng cách</h3>
<p>Sử dụng sữa rửa mặt dành cho da mụn, có chứa salicylic acid hoặc benzoyl peroxide.</p>',
  'Dược sĩ Phạm Thị C',
  'https://images.unsplash.com/photo-1573461169001-478ce74c359e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  (SELECT id FROM public.blog_categories WHERE name = 'Trị mụn'),
  true
),
(
  'Tác hại của tia UV và cách bảo vệ da',
  'Tia UV là kẻ thù số một của làn da, gây ra nhiều vấn đề nghiêm trọng. Hãy tìm hiểu cách bảo vệ da hiệu quả.',
  '<p>Tia UV từ mặt trời không chỉ gây ra cháy nắng, sạm da mà còn là nguyên nhân chính dẫn đến lão hóa sớm và thậm chí là ung thư da. Việc bảo vệ da khỏi tác hại của tia UV là vô cùng quan trọng.</p>

<h2>Các loại tia UV</h2>
<p>Có 3 loại tia UV chính:</p>
<ul>
  <li><strong>UVA:</strong> Chiếm 95% tia UV, xuyên sâu vào da, gây lão hóa</li>
  <li><strong>UVB:</strong> Chiếm 5% tia UV, gây cháy nắng, ung thư da</li>
  <li><strong>UVC:</strong> Bị tầng ozone hấp thụ hoàn toàn</li>
</ul>

<h2>Tác hại của tia UV</h2>
<ul>
  <li>Cháy nắng và viêm da</li>
  <li>Lão hóa sớm, nếp nhăn</li>
  <li>Tàn nhang, nám da</li>
  <li>Ung thư da</li>
  <li>Suy giảm hệ miễn dịch da</li>
</ul>',
  'Bác sĩ Hoàng Văn E',
  'https://images.unsplash.com/photo-1638815752077-d1f7c1f7c4bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  (SELECT id FROM public.blog_categories WHERE name = 'Bảo vệ da'),
  true
),
(
  'Chế độ ăn uống tốt cho làn da',
  'Làn da khỏe đẹp bắt đầu từ bên trong. Khám phá những thực phẩm giúp nuôi dưỡng da từ gốc.',
  '<p>Chế độ ăn uống đóng vai trò quan trọng trong việc duy trì làn da khỏe mạnh. Những thực phẩm giàu chất chống oxy hóa, vitamin và khoáng chất không chỉ tốt cho sức khỏe tổng thể mà còn giúp da sáng mịn, chống lại các dấu hiệu lão hóa.</p>

<h2>Các chất dinh dưỡng quan trọng cho da</h2>

<h3>1. Vitamin C</h3>
<p>Chất chống oxy hóa mạnh, giúp sản xuất collagen và làm sáng da.</p>
<ul>
  <li>Cam, chanh, bưởi</li>
  <li>Ớt chuông đỏ</li>
  <li>Dâu tây, kiwi</li>
  <li>Rau xanh lá</li>
</ul>

<h3>2. Omega-3</h3>
<p>Giúp duy trì độ ẩm tự nhiên cho da và giảm viêm.</p>
<ul>
  <li>Cá hồi, cá thu</li>
  <li>Hạt chia, hạt lanh</li>
  <li>Quả óc chó</li>
</ul>',
  'Chuyên gia dinh dưỡng Ngô Thị F',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  (SELECT id FROM public.blog_categories WHERE name = 'Dinh dưỡng'),
  true
),
(
  '5 bước chăm sóc da cơ bản mỗi ngày',
  'Khám phá quy trình 5 bước đơn giản giúp làn da của bạn luôn khỏe mạnh và rạng rỡ mỗi ngày.',
  '<p>Chăm sóc da không cần phải phức tạp. Với 5 bước cơ bản này, bạn có thể xây dựng một thói quen chăm sóc da hiệu quả và phù hợp với mọi loại da.</p>

<h2>Bước 1: Làm sạch</h2>
<p>Làm sạch là bước đầu tiên và quan trọng nhất trong quy trình chăm sóc da.</p>
<ul>
  <li>Sáng: Rửa mặt với nước hoặc sữa rửa mặt nhẹ nhàng</li>
  <li>Tối: Tẩy trang và rửa mặt kỹ để loại bỏ bụi bẩn, dầu thừa</li>
</ul>

<h2>Bước 2: Cân bằng độ pH với toner</h2>
<p>Toner giúp cân bằng độ pH của da sau khi làm sạch và chuẩn bị da để hấp thụ các sản phẩm tiếp theo.</p>

<h2>Bước 3: Điều trị với serum</h2>
<p>Serum chứa nồng độ hoạt chất cao, giúp giải quyết các vấn đề cụ thể của da.</p>

<h2>Bước 4: Dưỡng ẩm</h2>
<p>Kem dưỡng ẩm giúp khóa ẩm và tạo lớp bảo vệ cho da.</p>

<h2>Bước 5: Chống nắng (buổi sáng)</h2>
<p>Kem chống nắng là bước không thể thiếu để bảo vệ da khỏi tác hại của tia UV.</p>',
  'Thu Hà',
  'https://images.unsplash.com/photo-1498843053639-170ff2122f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
  (SELECT id FROM public.blog_categories WHERE name = 'Chăm sóc da'),
  true
);
