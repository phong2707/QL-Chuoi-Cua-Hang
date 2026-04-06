/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // Thay cổng 3000 bằng cổng Backend của bạn

export const authService = {
  // Đăng ký tài khoản thường
  register: (data: any) => axios.post(`${API_URL}/register`, data),

  // Đăng nhập tài khoản thường
  login: (data: any) => axios.post(`${API_URL}/login`, data),

  // Đăng nhập bằng Google
  googleLogin: (token: string) => axios.post(`${API_URL}/google`, { token })
};