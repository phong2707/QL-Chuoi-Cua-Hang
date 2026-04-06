import { Request, Response } from 'express';
import models from '@models';

class BranchController {
  // Lấy toàn bộ chi nhánh để đổ vào Select Box ở Frontend
  getAll = async (req: Request, res: Response) => {
    try {
      const branches = await models.branch.findMany({
        orderBy: { name: 'asc' }
      });
      return res.status(200).json(branches);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi lấy danh sách chi nhánh" });
    }
  };

  // Thêm chi nhánh mới (Dành cho Admin)
  create = async (req: Request, res: Response) => {
    try {
      const { name, address, city } = req.body;
      const newBranch = await models.branch.create({
        data: { name, address, city }
      });
      return res.status(201).json(newBranch);
    } catch (error) {
      return res.status(500).json({ message: "Không thể tạo chi nhánh" });
    }
  };
}

export const branchController = new BranchController();