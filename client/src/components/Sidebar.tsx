
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  ShoppingCart, 
  FolderTree
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Tổng quan', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
    { name: 'Cửa hàng', icon: <Store size={20}/>, path: '/branches' },
    { name: 'Danh mục', icon: <FolderTree size={20}/>, path: '/categories' },
    { name: 'Sản phẩm', icon: <Package size={20}/>, path: '/products' },
    { name: 'Đơn hàng', icon: <ShoppingCart size={20}/>, path: '/orders' },
    { name: 'Nhân viên', icon: <Users size={20}/>, path: '/users', adminOnly: true },
    { name: 'Cấu hình', icon: <Settings size={20}/>, path: '/settings' },
  ];

  const handleLogout = () => {
  localStorage.removeItem('accessToken'); // Xóa chìa khóa
  window.location.href = '/login';        // Đá về trang login
};
  

  return (
    <div className="sidebar" style={{
      width: '260px', height: '100vh', background: '#1e293b', 
      color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed'
    }}>
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #334155' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>TECH STORE</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Quản lý chuỗi hệ thống</p>
      </div>

      <nav style={{ flex: 1, padding: '20px 10px' }}>
        {menuItems.map((item) => {
          // Ẩn menu Nhân viên nếu không phải Admin (Dựa vào email hoặc role của bạn)
          if (item.adminOnly && user.email !== 'admin@example.com') return null;

          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
                cursor: 'pointer', borderRadius: '8px', marginBottom: '5px',
                background: isActive ? '#38bdf8' : 'transparent',
                color: isActive ? 'white' : '#cbd5e1',
                transition: '0.3s'
              }}
            >
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.name}</span>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#38bdf8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {user.fullName?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{user.fullName}</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{user.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%', padding: '10px', background: '#ef4444', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <LogOut size={18}/> Thoát
        </button>
      </div>
    </div>
  );
};