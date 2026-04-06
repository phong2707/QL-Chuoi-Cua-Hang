// server/src/app/controllers/CategoryController.ts
import { Request, Response } from 'express';
import models from '@models';

class CategoryController {
  // Lấy tất cả danh mục (Để hiện lên thanh lọc ở Frontend)
  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await models.category.findMany({
        orderBy: { name: 'asc' }
      });
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      return res.status(500).json({ message: "Lỗi hệ thống khi lấy danh mục" });
    }
  };

  // Tạo danh mục mới
  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const newCategory = await models.category.create({
        data: { name }
      });
      return res.status(201).json(newCategory);
    } catch (error) {
      return res.status(500).json({ message: "Không thể tạo danh mục" });
    }
  };

  // Xóa danh mục
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await models.category.delete({
        where: { id: Number(id) }
      });
      return res.status(200).json({ message: "Xóa danh mục thành công" });
    } catch (error) {
      return res.status(400).json({ message: "Không thể xóa danh mục đang có sản phẩm" });
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedCategory = await models.category.update({
        where: { id: Number(id) },
        data: { name }
      });
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ message: "Không thể cập nhật danh mục" });
    }
  };
}

export const categoryController = new CategoryController();