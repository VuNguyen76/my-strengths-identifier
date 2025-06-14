export const SERVICES = [
  { 
    id: "1", 
    name: "Chăm sóc da cơ bản", 
    price: 450000,
    description: "Làm sạch, tẩy tế bào chết và dưỡng ẩm chuyên sâu",
    duration: 60,
    category: "Chăm sóc da",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1740"
  },
  { 
    id: "2", 
    name: "Trị mụn chuyên sâu", 
    price: 650000,
    description: "Điều trị mụn, thâm nám và các vấn đề da khác",
    duration: 90,
    category: "Điều trị",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1740"
  },
  { 
    id: "3", 
    name: "Trẻ hóa da", 
    price: 850000,
    description: "Sử dụng công nghệ hiện đại giúp làn da trẻ trung hơn",
    duration: 120,
    category: "Trẻ hóa",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1740"
  },
  { 
    id: "4", 
    name: "Massage mặt", 
    price: 350000,
    description: "Kỹ thuật massage thư giãn và làm săn chắc da mặt",
    duration: 45,
    category: "Massage",
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=1740"
  },
  { 
    id: "5", 
    name: "Tẩy trang chuyên sâu", 
    price: 250000,
    description: "Làm sạch sâu và loại bỏ mọi bụi bẩn, tạp chất trên da",
    duration: 30,
    category: "Chăm sóc da",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1734"
  },
];

export const SPECIALISTS = [
  { 
    id: "1", 
    name: "Nguyễn Thị A",
    role: "Chuyên viên điều trị da",
    experience: "5 năm",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374",
    availability: ["09:00", "10:00", "14:00", "15:00"],
    bio: "Chuyên viên với 5 năm kinh nghiệm trong điều trị các vấn đề về da và thẩm mỹ."
  },
  { 
    id: "2", 
    name: "Trần Văn B",
    role: "Chuyên viên trẻ hóa",
    experience: "7 năm",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470",
    availability: ["10:00", "11:00", "15:00", "16:00"],
    bio: "Với 7 năm kinh nghiệm, chuyên viên là chuyên gia hàng đầu về các kỹ thuật trẻ hóa da."
  },
  { 
    id: "3", 
    name: "Lê Thị C",
    role: "Chuyên viên massage",
    experience: "3 năm",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470",
    availability: ["09:00", "11:00", "14:00", "17:00"],
    bio: "Chuyên viên với hơn 3 năm kinh nghiệm trong lĩnh vực massage trị liệu và thư giãn."
  },
];

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00", "17:00"
];

export const BOOKING_STATUSES = {
  UPCOMING: "upcoming",
  COMPLETED: "completed",
  CANCELED: "canceled",
  PENDING: "pending"
};

export const PAYMENT_STATUSES = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
  REFUNDED: "refunded"
};
