import { Router } from 'express';
import { checkUser, checkAdmin } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
import UserController from '../controllers/userController';

const router = Router();

router.put('/update/:id', checkUser, catchAsync(UserController.updateUser));
router.get('/:id', checkUser, catchAsync(UserController.getUserById));
router.delete('/delete-me', checkUser, catchAsync(UserController.userDeleteThemselves));

// Only admin can get all users
router.get('/', checkUser, checkAdmin, catchAsync(UserController.getUsers));
router.patch('/ban/:id', checkUser, checkAdmin, catchAsync(UserController.banUser));
router.patch('/unban/:id', checkUser, checkAdmin, catchAsync(UserController.unbanUser));

export default router;