import { Router } from 'express';
import { checkUser } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
import UserController from '../controllers/userController';

const router = Router();


router.put('/update/:id', checkUser, catchAsync(UserController.updateUser));

export default router;
