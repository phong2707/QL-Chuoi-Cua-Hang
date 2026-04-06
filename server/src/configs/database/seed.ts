import models from '@models';
import * as bcrypt from 'bcrypt';
import { RoleName, FeatureName, ActionCode, createPermissionCode } from './enum';

async function main() {
  console.log('🚀 Đang làm sạch toàn bộ dữ liệu cũ...');
  
  // Xóa theo thứ tự ngược để tránh lỗi Foreign Key
  await models.walletTransaction.deleteMany();
  await models.wallet.deleteMany();
  await models.customer.deleteMany();
  await models.invoice.deleteMany();
  await models.orderItem.deleteMany();
  await models.order.deleteMany();
  await models.branchInventory.deleteMany();
  await models.recipe.deleteMany();
  await models.product.deleteMany();
  await models.category.deleteMany();
  await models.ingredient.deleteMany();
  await models.userRole.deleteMany();
  await models.rolePermission.deleteMany();
  await models.permission.deleteMany();
  await models.feature.deleteMany();
  await models.user.deleteMany();
  await models.branch.deleteMany();
  await models.role.deleteMany();

  console.log('🌱 Đang bắt đầu seed dữ liệu mới...');

  // --- 1. MÃ HÓA MẬT KHẨU ---
  const salt = 10;
  const hashPassword = await bcrypt.hash('Abcd@1234', salt);

  // --- 2. TẠO CHI NHÁNH (BRANCHES) ---
  const branch1 = await models.branch.create({
    data: { name: 'TechStore Đà Nẵng', address: '123 Nguyễn Văn Linh', city: 'Đà Nẵng' }
  });
  const branch2 = await models.branch.create({
    data: { name: 'TechStore Hồ Chí Minh', address: '456 Lê Lợi', city: 'Hồ Chí Minh' }
  });

  // --- 3. SEED ROLES & FEATURES ---
  const adminRole = await models.role.create({
    data: { name: RoleName.ADMIN, description: 'Quản trị viên toàn hệ thống' }
  });
  const staffRole = await models.role.create({
    data: { name: 'STAFF', description: 'Nhân viên bán hàng' }
  });

  const features = [
  { name: 'SALES', actions: [ActionCode.CREATE, ActionCode.VIEW] },
  { name: 'PRODUCT', actions: [ActionCode.CREATE, ActionCode.EDIT, ActionCode.DELETE, ActionCode.VIEW] },
  { name: 'CATEGORY', actions: [ActionCode.CREATE, ActionCode.EDIT, ActionCode.DELETE, ActionCode.VIEW] },
  { name: 'BRANCH', actions: [ActionCode.CREATE, ActionCode.EDIT, ActionCode.VIEW] }, // Quản lý chi nhánh
  { name: 'USER', actions: [ActionCode.CREATE, ActionCode.EDIT, ActionCode.DELETE, ActionCode.VIEW] }, // Quản lý nhân viên
  { name: 'ROLE', actions: [ActionCode.EDIT, ActionCode.VIEW] }, // Quản lý quyền hạn
];

  for (const f of features) {
    await models.feature.create({
      data: {
        featureName: f.name,
        permissions: {
          create: f.actions.map(action => ({
            actionCode: `${f.name}_${action}`,
            description: `Quyền ${action} cho mục ${f.name}`
          }))
        }
      }
    });
  }

  const allPermissions = await models.permission.findMany();
  await models.rolePermission.createMany({
    data: allPermissions.map(p => ({ roleId: adminRole.id, permissionId: p.id }))
  });

  // --- 4. SEED USERS ---
  const adminUser = await models.user.create({
    data: {
      fullName: 'Quản trị viên',
      email: 'admin@example.com',
      passwordHash: hashPassword,
      branchId: branch1.id,
      userRoles: { create: { roleId: adminRole.id } }
    }
  });

  await models.user.create({
    data: {
      fullName: 'Nguyễn Nhân Viên',
      email: 'staff@example.com',
      passwordHash: hashPassword,
      branchId: branch1.id,
      userRoles: { create: { roleId: staffRole.id } }
    }
  });

  // --- 5. CATEGORY & INGREDIENTS ---
  const catOrganic = await models.category.create({ data: { name: 'Hữu cơ' } });
  const catImport = await models.category.create({ data: { name: 'Nhập khẩu' } });

  const ingre1 = await models.ingredient.create({
    data: { name: 'Bao bì loại A', unit: 'Cái', minStockLevel: 10 }
  });

  // --- 6. PRODUCTS & RECIPES ---
  const prod1 = await models.product.create({
    data: { 
      name: 'Rau cải hữu cơ', 
      basePrice: 25000, 
      categoryId: catOrganic.id,
      recipes: {
        create: { ingredientId: ingre1.id, quantityRequired: 1 }
      }
    }
  });

  const prod2 = await models.product.create({
    data: { 
      name: 'Táo nhập khẩu', 
      basePrice: 80000, 
      categoryId: catImport.id 
    }
  });

  // --- 7. TỒN KHO (INVENTORY) ---
  // Lưu ý: BranchInventory trong schema của bạn kết nối với Ingredient, không phải Product
  await models.branchInventory.createMany({
    data: [
      { branchId: branch1.id, ingredientId: ingre1.id, currentStock: 500 },
      { branchId: branch2.id, ingredientId: ingre1.id, currentStock: 300 },
    ]
  });

  console.log('-----------------------------------');
  console.log('✅ SEED DỮ LIỆU THÀNH CÔNG!');
  console.log('👤 Admin: admin@example.com / Abcd@1234');
  console.log('🏢 Chi nhánh: 2 | 📦 Sản phẩm: 2 | 🧺 Nguyên liệu: 1');
  console.log('-----------------------------------');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await models.$disconnect(); });