import { Request, Response } from 'express';
import models from '@models';
import * as bcrypt from 'bcrypt';

class UserController {
  // 1. Lấy danh sách nhân viên
  getAll = async (req: Request, res: Response) => {
    try {
      const users = await models.user.findMany({
        include: {
          branch: true,
          userRoles: {
            include: { role: true }
          }
        },
        orderBy: { createdAt: 'desc' } // Hiện nhân viên mới tạo lên đầu
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi lấy danh sách nhân viên" });
    }
  };

  // 2. Tạo nhân viên mới
  create = async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, branchId, roleId } = req.body;

      const existingUser = await models.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email này đã được sử dụng!" });
      }

      const salt = 10;
      const finalPassword = password || 'Abcd@1234';
      const hashPassword = await bcrypt.hash(finalPassword, salt);

      const newUser = await models.user.create({
        data: {
          fullName,
          email,
          passwordHash: hashPassword,
          branchId: branchId ? String(branchId) : null,
          isActive: true, // Mặc định khi tạo mới là hoạt động
          userRoles: {
            create: { roleId: Number(roleId) }
          }
        }
      });

      return res.status(201).json({ message: "Tạo nhân viên thành công!", data: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi hệ thống khi tạo nhân viên" });
    }
  };

  // 3. Cập nhật thông tin (Đổi chi nhánh, Role hoặc Trạng thái)
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { fullName, email, branchId, roleId, isActive } = req.body;

      await models.user.update({
        where: { id: String(id) },
        data: {
          fullName,
          email,
          branchId: branchId ? String(branchId) : undefined,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined, // Cập nhật isActive nếu có gửi lên
          userRoles: roleId ? {
            deleteMany: {},
            create: { roleId: Number(roleId) }
          } : undefined
        }
      });
      return res.status(200).json({ message: "Cập nhật nhân viên thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi khi cập nhật nhân viên" });
    }
  }

  // 4. Khóa/Mở khóa tài khoản (Toggle)
  toggleActive = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await models.user.findUnique({ where: { id: String(id) } });
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên này" });
      }

      const updatedUser = await models.user.update({
        where: { id: String(id) },
        data: { isActive: !user.isActive }
      });

      const statusText = updatedUser.isActive ? "Mở khóa" : "Khóa";
      return res.status(200).json({ 
        message: `${statusText} tài khoản thành công!`,
        isActive: updatedUser.isActive 
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi hệ thống khi thay đổi trạng thái" });
    }
  };
}

export const userController = new UserController();