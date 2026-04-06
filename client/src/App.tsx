import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard'; // Import trang mới tạo
import { RegisterPage } from './pages/Register';
import { ProductPage } from './pages/ProductPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CategoryPage } from './pages/CategoryPage';
import { UserPage } from './pages/UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/users" element={<UserPage />} /> {/* Trang quản lý người dùng mới */}
        </Route>      
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    </Router>
  );
}

export default App;