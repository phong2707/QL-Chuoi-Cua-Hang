import { Request, Response } from 'express';
import models from '@models';

class ProductController {
  // 1. READ: Lấy danh sách sản phẩm (Kèm lọc theo danh mục)
  getAll = async (req: Request, res: Response) => {
    try {
      const { categoryId, search } = req.query;
      
      const products = await models.product.findMany({
        where: {
          // Lọc theo danh mục nếu có truyền categoryId
          ...(categoryId && { categoryId: Number(categoryId) }),
          // Tìm kiếm theo tên nếu có truyền search
          ...(search && { name: { contains: String(search) } }),
        },
        include: { category: true },
        orderBy: { id: 'desc' }
      });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm" });
    }
  };

  // 2. READ: Chi tiết một sản phẩm
  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await models.product.findUnique({
        where: { id: String(id) },
        include: { category: true }
      });
      if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi lấy chi tiết sản phẩm" });
    }
  };

  // 3. CREATE: Thêm sản phẩm mới
  create = async (req: Request, res: Response) => {
    try {
      const { name, basePrice, categoryId } = req.body;
      const newProduct = await models.product.create({
        data: {
          name,
          basePrice: Number(basePrice),
          categoryId: Number(categoryId),
          isActive: true
        }
      });
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi tạo sản phẩm" });
    }
  };

  // 4. UPDATE: Chỉnh sửa sản phẩm
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, basePrice, categoryId, isActive } = req.body;
      
      const updatedProduct = await models.product.update({
        where: { id: String(id) },
        data: {
          name,
          basePrice: basePrice ? Number(basePrice) : undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
          isActive
        }
      });
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
    }
  };

  // 5. DELETE: Xóa sản phẩm
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await models.product.delete({
        where: { id: String(id) }
      });
      return res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
      // Nếu sản phẩm đã có trong hóa đơn, Prisma sẽ báo lỗi ràng buộc (Foreign Key)
      return res.status(400).json({ message: "Không thể xóa sản phẩm đã có dữ liệu giao dịch" });
    }
  };
}

export const productController = new ProductController();