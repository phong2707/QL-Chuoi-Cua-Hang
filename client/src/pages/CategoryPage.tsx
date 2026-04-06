/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MainLayout } from '../layouts/MainLayout';
import { Plus, Edit, Trash2, FolderTree, X } from 'lucide-react';

export const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Danh mục thường chỉ cần Tên và Mô tả (nếu có)
  const [formData, setFormData] = useState({ name: '' });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });

  const API_URL = 'http://localhost:3000/categories';

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getHeaders());
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi tải danh mục", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat: any = null) => {
    setEditingCategory(cat);
    setFormData({ name: cat ? cat.name : '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Lưu ý: Hiện tại route index.ts của bạn chưa có PUT cho category, 
        // bạn có thể bổ sung ở backend sau.
        await axios.put(`${API_URL}/${editingCategory.id}`, formData, getHeaders());
      } else {
        await axios.post(API_URL, formData, getHeaders());
      }
      alert("Thành công!");
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi lưu danh mục");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Xóa danh mục "${name}"? Cẩn thận: Các sản phẩm thuộc danh mục này sẽ bị ảnh hưởng!`)) {
      try {
        await axios.delete(`${API_URL}/${id}`, getHeaders());
        fetchCategories();
      } catch (error) {
        alert("Không thể xóa danh mục đang có sản phẩm!");
      }
    }
  };

  return (
    <MainLayout>
      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
              <X cursor="pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tên danh mục</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({ name: e.target.value })} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
                  placeholder="Ví dụ: Đồ uống, Khai vị..."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '8px', background: 'none' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px' }}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <h1>Quản lý danh mục</h1>
        <button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      {/* TABLE */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>Tên danh mục</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FolderTree size={20} color="#64748b" />
                  {cat.name}
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={() => openModal(cat)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginRight: '10px' }}><Edit size={18}/></button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>}
      </div>
    </MainLayout>
  );
};