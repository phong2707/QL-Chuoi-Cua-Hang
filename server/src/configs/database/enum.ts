// Định nghĩa các Role chính trong hệ thống
export enum RoleName {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  ACCOUNTANT = 'ACCOUNTANT',
}

// Định nghĩa Feature Modules
export enum FeatureName {
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  REPORT = 'REPORT',
  CUSTOMER_WALLET = 'CUSTOMER_WALLET',
}

// Định nghĩa Action Codes chi tiết
export enum ActionCode {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
}

// Trạng thái đơn hàng
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Hình thức thanh toán
export enum PaymentMethod {
  CASH = 'CASH',
  WALLET = 'WALLET',
  BANK = 'BANK',
}

// Loại giao dịch ví
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
}

export const saltRounds = 10;

// Helper function
export const createPermissionCode = (feature: FeatureName, action: ActionCode) => `${feature}_${action}`;