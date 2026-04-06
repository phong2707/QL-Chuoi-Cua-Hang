import { Request, Response } from 'express';
import { BadRequestError } from './concens'; // Giữ nguyên tên folder của bạn
import models from '@models';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '@configs/jwt';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Replace with your actual GOOGLE_CLIENT_ID or environment variable

export class AuthController {
  /**
   * ĐĂNG NHẬP
   */
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return BadRequestError('Email and password are required', res);
      }

      // 1. Tìm user duy nhất bằng email (trường có @unique)
      // Include thêm các bảng liên quan để lấy danh sách quyền hạn
      const user = await models.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true }
                  }
                }
              }
            }
          }
        }
      });

      // 2. Kiểm tra user có tồn tại không
      if (!user) {
        return BadRequestError('Invalid email or password', res);
      }

      // 3. So sánh mật khẩu người dùng nhập với passwordHash trong DB
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return BadRequestError('Invalid email or password', res);
      }

      // 4. Gom tất cả actionCode của user thành một mảng phẳng (Flatten permissions)
      const permissions = user.userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.actionCode)
      );

      // 5. Tạo Access Token và Refresh Token
      const payload = { 
        userId: user.id, 
        email: user.email, 
        permissions, 
        branchId: user.branchId 
      };

      const accessToken = generateToken(payload);
      const refreshToken = generateToken(payload, 60 * 60 * 24 * 7); 

      return res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          branchId: user.branchId
        }
      });

    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { fullName, email, password } = req.body;

      // 1. Kiểm tra email đã tồn tại chưa
      const existingUser = await models.user.findUnique({ where: { email } });
      if (existingUser) return BadRequestError('Email đã được sử dụng', res);

      // 2. Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Lưu vào Database
      const newUser = await models.user.create({
        data: {
          fullName,
          email,
          passwordHash: hashedPassword,
          // Mặc định gán Role là khách hàng hoặc nhân viên mới
          userRoles: {
            create: {
              role: { connect: { name: 'STAFF' } } 
            }
          }
        }
      });

      return res.status(201).json({ message: "Tạo tài khoản thành công", userId: newUser.id });
    } catch (error) {
      return res.status(500).json({ error: "Lỗi đăng ký" });
    }
  };

 // server/src/app/controllers/AuthController.ts

googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });
    const payloadGoogle = ticket.getPayload();
    
    if (!payloadGoogle || !payloadGoogle.email) {
      return res.status(400).json({ message: "Không thể lấy thông tin từ Google" });
    }

    const { email, name } = payloadGoogle;

    // 1. Tìm hoặc tạo User kèm theo BẢNG QUYỀN HẠN (Rất quan trọng)
    let user = await models.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      // Tạo user mới nếu chưa có (như code cũ của bạn)
      user = await models.user.create({
        data: {
          email,
          fullName: name || "Google User",
          passwordHash: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
          userRoles: { create: { role: { connect: { name: 'STAFF' } } } }
        },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true }
                  }
                }
              }
            }
          }
        }
      });
    }

    // 2. GOM QUYỀN HẠN (Giống hệt hàm login thường)
    const permissions = user.userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission.actionCode)
    );

    // 3. TẠO TOKEN VỚI ĐẦY ĐỦ PAYLOAD
    const payload = { 
      userId: user.id, 
      email: user.email, 
      permissions, 
      branchId: user.branchId 
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateToken(payload, 60 * 60 * 24 * 7);

    return res.json({
      message: "Google Login Success",
      accessToken,
      refreshToken,
      user: { id: user.id, fullName: user.fullName, email: user.email }
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Xác thực Google thất bại" });
  }
};

  /**
   * LẤY ACCESS TOKEN MỚI TỪ REFRESH TOKEN
   */
  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return BadRequestError('Refresh token is required', res);
    }

    try {
      // 1. Xác thực Refresh Token
      const decoded: any = verifyToken(refreshToken);
      if (!decoded || !decoded.userId) {
        return BadRequestError('Invalid or expired refresh token', res);
      }

      // 2. Tìm user để đảm bảo user vẫn tồn tại/không bị khóa
      const user = await models.user.findUnique({
        where: { id: decoded.userId },
        include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: { permission: true }
                    }
                  }
                }
              }
            }
          }
      });

      if (!user) {
        return BadRequestError('User not found', res);
      }

      // 3. Cập nhật lại permissions mới nhất (phòng trường hợp Admin vừa đổi quyền)
      const permissions = user.userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.actionCode)
      );

      const payload = { 
        userId: user.id, 
        email: user.email, 
        permissions, 
        branchId: user.branchId 
      };

      const newAccessToken = generateToken(payload);
      const newRefreshToken = generateToken(payload, 60 * 60 * 24 * 7);

      return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return BadRequestError('Invalid refresh token', res);
    }
  };
}

export const authController = new AuthController();