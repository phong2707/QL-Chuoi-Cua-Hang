import { Router } from 'express';
import { homeController, devController, authController, productController } from '@controllers';
import { resource } from '../../lib/resource';
import { authorize } from 'app/middleware/authMiddleware';
import { categoryController } from '@controllers/category.controller';
import { userController } from '@controllers/user.controller';
import { branchController } from '@controllers/branch.controller';
import { roleController } from '@controllers/role.controller';

const path = Router();

path.get('/', homeController.index);
path.post('/auth/login', authController.login);
path.post('/auth/register', authController.register);
path.post('/auth/google', authController.googleLogin);


// Routes cho Sản phẩm
path.get('/products', authorize([]), productController.getAll);
path.post('/products', authorize(['PRODUCT_CREATE']), productController.create);
path.get('/products/:id', authorize([]), productController.getOne);
path.put('/products/:id', authorize(['PRODUCT_EDIT']), productController.update);
path.delete('/products/:id', authorize(['PRODUCT_DELETE']), productController.delete);

path.get('/categories', authorize([]), categoryController.getAll);
// Các endpoint quản lý (cần quyền)
path.post('/categories', authorize(['CATEGORY_CREATE']), categoryController.create);
path.put('/categories/:id', authorize(['CATEGORY_EDIT']), categoryController.update);
path.delete('/categories/:id', authorize(['CATEGORY_DELETE']), categoryController.delete);
resource(path, 'dev', devController);

path.get('/users', authorize(['USER_VIEW']), userController.getAll);
path.post('/users', authorize(['USER_CREATE']), userController.create);
path.put('/users/:id', authorize(['USER_EDIT']), userController.update);
path.patch('/users/:id/toggle-status', authorize(['USER_EDIT']), userController.toggleActive);path.get('/branches', authorize([]), branchController.getAll); // Đảm bảo đã có Controller này
path.get('/roles', authorize([]), roleController.getAll); // Đảm bảo đã có Controller này

export default path;