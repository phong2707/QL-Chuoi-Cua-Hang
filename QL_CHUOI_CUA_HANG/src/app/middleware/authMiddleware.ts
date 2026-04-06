import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@configs/jwt'; // Đảm bảo bạn đã có hàm verifyToken

export const authorize = (requiredPermissions: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (req.method === 'OPTIONS') return next();
    try {
      // 1. Lấy Token từ Header (Authorization: Bearer <token>)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập hoặc Token thiếu!' });
      }

      const token = authHeader.split(' ')[1];

      // 2. Giải mã Token
      const decoded: any = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Phiên đăng nhập hết hạn!' });
      }

      // Lưu thông tin user vào request để các controller sau có thể dùng (ví dụ: req.user.id)
      (req as any).user = decoded;

      // 3. KIỂM TRA QUYỀN (Nếu mảng requiredPermissions không trống)
      if (requiredPermissions.length > 0) {
        const userPermissions: string[] = decoded.permissions || [];
        
        // Kiểm tra xem user có ít nhất 1 trong các quyền yêu cầu không
        const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));

        if (!hasPermission) {
          return res.status(403).json({ 
            message: 'Bạn không có quyền thực hiện hành động này (Yêu cầu: ' + requiredPermissions.join(', ') + ')' 
          });
        }
      }

      // Nếu mọi thứ ổn, cho phép đi tiếp vào Controller
      next();
    } catch (error) {
      console.error("Middleware Error:", error);
      return res.status(500).json({ message: 'Lỗi xác thực hệ thống!' });
    }
  };
};