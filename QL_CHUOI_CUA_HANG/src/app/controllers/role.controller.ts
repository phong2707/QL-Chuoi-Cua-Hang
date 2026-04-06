import { Request, Response } from 'express';
import models from '@models';

class RoleController {
  // Lấy danh sách Role để Admin chọn khi phân quyền cho nhân viên
  getAll = async (req: Request, res: Response) => {
    try {
      const roles = await models.role.findMany({
        orderBy: { name: 'asc' }
      });
      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi lấy danh sách vai trò" });
    }
  };
}

export const roleController = new RoleController();