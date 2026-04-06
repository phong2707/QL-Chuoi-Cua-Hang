/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/style/login.css'; // Sử dụng lại CSS của trang Login cho trang Register

export const RegisterPage = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gọi API qua proxy đã cấu hình trong vite.config.ts
      const res = await axios.post('/api/auth/register', formData);
      alert(res.data.message);
      navigate('/login'); // Đăng ký xong thì sang trang Login
    } catch (error: any) {
      alert(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Tạo tài khoản mới</h2>
        <p>Gia nhập hệ thống quản lý Tech Store</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Họ và tên</label>
            <input 
              type="text" 
              required
              placeholder="Nguyễn Văn A"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              required
              placeholder="example@gmail.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn-login">
            Đăng ký ngay
          </button>
        </form>

        <div className="divider">
          <span>HOẶC</span>
        </div>

        <p style={{fontSize: '14px'}}>
          Đã có tài khoản? <Link to="/login" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '600'}}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};