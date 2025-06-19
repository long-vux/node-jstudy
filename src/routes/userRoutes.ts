import { Router } from 'express';
import { checkUser, checkAdmin } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
import UserController from '../controllers/userController';

const router = Router();

router.put('/update/:id', checkUser, catchAsync(UserController.updateUser));
router.get('/:id', checkUser, catchAsync(UserController.getUserById));

// Only admin can get all users
router.get('/', checkUser, checkAdmin, catchAsync(UserController.getUsers));

router.delete('/delete-me/:id', checkUser, catchAsync(UserController.userDeleteThemselves));

export default router;