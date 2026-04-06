/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MainLayout } from '../layouts/MainLayout';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

export const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    categoryId: '',
    isActive: true
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://localhost:3000/products', getHeaders()),
        axios.get('http://localhost:3000/categories', getHeaders())
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', basePrice: '', categoryId: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      basePrice: prod.basePrice,
      categoryId: prod.categoryId.toString(),
      isActive: prod.isActive
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `http://localhost:3000/products/${editingProduct.id}` 
        : 'http://localhost:3000/products';
      
      const method = editingProduct ? 'put' : 'post';

      await axios[method](url, formData, getHeaders());
      
      alert(editingProduct ? "Cập nhật thành công!" : "Thêm thành công!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Xóa sản phẩm "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`, getHeaders());
        fetchData();
      } catch (error) {
        alert("Lỗi khi xóa");
      }
    }
  };

  const filteredProducts = products.filter((prod: any) => {
    const matchSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || prod.categoryId === Number(selectedCategory);
    return matchSearch && matchCategory;
  });

  return (
    <MainLayout>
      {/* MODAL SECTION */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
              <X cursor="pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Tên sản phẩm</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Giá (VNĐ)</label>
                  <input required type="number" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Danh mục</label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <option value="">Chọn loại...</option>
                    {categories.map((cat: any) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                <label>Đang kinh doanh</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '8px', background: 'none' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500 }}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Quản lý sản phẩm</h1>
          <p style={{ color: '#64748b' }}>Danh sách các mặt hàng trong hệ thống.</p>
        </div>
        <button 
          onClick={openAddModal} // ĐÃ SỬA: Gọi hàm mở modal thêm
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
          <input type="text" placeholder="Tìm tên sản phẩm..." style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #ddd' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">Tất cả danh mục</option>
          {categories.map((cat: any) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
        </select>
      </div>

      {/* TABLE */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>Sản phẩm</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Danh mục</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Giá</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod: any) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px' }}>{prod.name}</td>
                <td style={{ padding: '15px' }}>{prod.category?.name}</td>
                <td style={{ padding: '15px' }}>{prod.basePrice?.toLocaleString()}đ</td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => openEditModal(prod)} // ĐÃ SỬA: Gọi hàm mở modal sửa
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginRight: '10px' }}
                  >
                    <Edit size={18}/>
                  </button>
                  <button onClick={() => handleDelete(prod.id, prod.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18}/>
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};