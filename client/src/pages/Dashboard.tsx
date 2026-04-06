/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { MainLayout } from '../layouts/MainLayout';

export const Dashboard = () => {
  return (
    <MainLayout>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Bảng điều khiển</h1>
        <p style={{ color: '#64748b' }}>Chào mừng trở lại hệ thống quản lý Tech Store.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <StatCard title="Doanh thu" value="125.000.000đ" color="#38bdf8" />
        <StatCard title="Đơn hàng" value="45" color="#4ade80" />
        <StatCard title="Sản phẩm" value="1,200" color="#fbbf24" />
        <StatCard title="Chi nhánh" value="3" color="#f472b6" />
      </div>

      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3>Hoạt động gần đây</h3>
        <p>Không có hoạt động nào để hiển thị.</p>
      </div>
    </MainLayout>
  );
};

const StatCard = ({ title, value, color }: any) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderLeft: `5px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{title}</p>
    <h2 style={{ margin: '5px 0 0 0' }}>{value}</h2>
  </div>
);