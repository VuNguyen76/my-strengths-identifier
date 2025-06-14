
import { useState } from "react";

// For now, this will be a simple state management hook
// In the future, this can be connected to a roles table in the database
export const useAdminRoles = () => {
  const [roles] = useState([
    {
      id: "1",
      name: "Admin",
      description: "Quản trị viên hệ thống có toàn quyền truy cập",
      permissions: ["users_view", "users_create", "users_edit", "users_delete", "services_view", "services_create", "services_edit", "services_delete", "bookings_view", "bookings_create", "bookings_edit", "bookings_delete", "reports_view", "transactions_view", "transactions_create", "staff_view", "staff_create", "staff_edit", "staff_delete", "blogs_view", "blogs_create", "blogs_edit", "blogs_delete", "settings_edit"],
    },
    {
      id: "2", 
      name: "Nhân viên",
      description: "Nhân viên có quyền hạn chế",
      permissions: ["users_view", "services_view", "bookings_view", "bookings_create", "bookings_edit", "staff_view"],
    },
    {
      id: "3",
      name: "Kế toán", 
      description: "Nhân viên kế toán có quyền quản lý giao dịch",
      permissions: ["transactions_view", "transactions_create", "reports_view"],
    },
  ]);

  return { roles };
};
