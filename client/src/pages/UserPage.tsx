/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MainLayout } from '../layouts/MainLayout';
import { UserPlus, Edit, MapPin, Lock, Unlock, X } from 'lucide-react';

export const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    password: '', 
    branchId: '', 
    roleId: '', 
    isActive: true
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });

  const fetchData = async () => {
    try {
      const [uRes, bRes, rRes] = await Promise.all([
        axios.get('http://localhost:3000/users', getHeaders()),
        axios.get('http://localhost:3000/branches', getHeaders()),
        axios.get('http://localhost:3000/roles', getHeaders())
      ]);
      setUsers(uRes.data);
      setBranches(bRes.data);
      setRoles(rRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? `http://localhost:3000/users/${editingUser.id}` : 'http://localhost:3000/users';
      const method = editingUser ? 'put' : 'post';
      await axios[method](url, formData, getHeaders());
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi lưu thông tin");
    }
  };

  // Hàm xử lý Khóa/Mở khóa tài khoản
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const actionText = currentStatus ? "KHÓA" : "MỞ KHÓA";
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này?`)) {
      try {
        // Gọi API Patch để cập nhật trạng thái isActive
        await axios.patch(`http://localhost:3000/users/${id}/toggle-status`, {}, getHeaders());
        alert(`${actionText} tài khoản thành công!`);
        fetchData();
      } catch (error: any) {
        alert(error.response?.data?.message || "Không thể thực hiện thao tác này");
      }
    }
  };

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setFormData({
      fullName: u.fullName,
      email: u.email,
      password: '', // Không sửa password ở đây
      branchId: u.branchId || '',
      roleId: u.userRoles?.[0]?.roleId || '',
      isActive: u.isActive
    });
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Quản lý nhân sự</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Quản lý nhân viên, chi nhánh và quyền hạn.</p>
        </div>
        <button onClick={() => { setEditingUser(null); setFormData({fullName: '', email: '', password: '', branchId: '', roleId: '', isActive: true}); setIsModalOpen(true); }} 
          style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={18} /> Thêm nhân viên
        </button>
      </div>

      {/* TABLE */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>Họ tên</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Chi nhánh</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Vai trò</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: u.isActive ? 1 : 0.6 }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{u.fullName}</strong>
                    {!u.isActive && (
                      <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>BỊ KHÓA</span>
                    )}
                  </div>
                  <small style={{ color: '#64748b' }}>{u.email}</small>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
                    <MapPin size={14}/> {u.branch?.name || 'Chưa gán'}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                    {u.userRoles?.[0]?.role?.name}
                  </span>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={() => openEditModal(u)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }} title="Sửa">
                    <Edit size={18} color="#64748b"/>
                  </button>
                  
                  <button 
                    onClick={() => handleToggleStatus(u.id, u.isActive)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    title={u.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  >
                    {u.isActive ? (
                      <Lock size={18} color="#ef4444" />
                    ) : (
                      <Unlock size={18} color="#22c55e" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{editingUser ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h2>
              <X cursor="pointer" onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Họ tên</label>
                <input required placeholder="Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Email đăng nhập</label>
                <input type="email" required placeholder="email@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>

              {!editingUser && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Mật khẩu tạm thời</label>
                  <input type="password" placeholder="Mặc định: Abcd@1234" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Chi nhánh</label>
                  <select required value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <option value="">Chọn...</option>
                    {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Chức vụ</label>
                  <select required value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <option value="">Chọn...</option>
                    {roles.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '8px', background: 'none', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};