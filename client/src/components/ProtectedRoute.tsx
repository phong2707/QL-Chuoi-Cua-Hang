import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  
  console.log("--- Kiểm tra bảo vệ Route ---");
  console.log("Token hiện tại:", token ? "Đã có" : "Trống rỗng");

  if (!token) {
    console.warn("Không tìm thấy Token, đang đá về Login...");
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};