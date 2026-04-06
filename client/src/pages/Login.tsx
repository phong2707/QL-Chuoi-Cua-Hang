import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../assets/style/login.css';


export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post('http://localhost:3000/auth/google', {
        token: credentialResponse.credential,
      });
      console.log("Đăng nhập thành công:", res.data);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("Chào mừng bạn!");
      console.log("Đã nhận được data Admin:", res.data);
      navigate('/dashboard');
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (e: any) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:3000/auth/login', {
      email: email,
      password: password,
    });
    if (res.status === 200) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      console.log("Đăng nhập Admin thành công, đang chuyển hướng...");
      navigate('/dashboard'); 
    }
  } catch (error) {
    console.error("Lỗi đăng nhập Admin:", error);
    alert("Sai email hoặc mật khẩu Admin!");
  }
};
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Chào mừng trở lại</h2>
        <p>Vui lòng đăng nhập để quản lý cửa hàng</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email hệ thống</label>
            <input 
              type="email" 
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label style={{
              fontSize: '16px',
              fontWeight: '500',
              display: 'block',
              marginBottom: '10px'
            }}>Bạn chưa có tài khoản? <a href="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Đăng ký ngay</a></label>
          </div>

          <button type="submit" className="btn-login">
            Đăng nhập
          </button>
        </form>

        <div className="divider">
          <span>HOẶC</span>
        </div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
          />
        </div>
      </div>
    </div>
  );
};