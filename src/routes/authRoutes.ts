import { Router } from 'express';
import { register, login, changePassword, verifyEmail } from '../controllers/authController';
import { checkUser } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
const router = Router();


router.post('/register', catchAsync(register));
router.post('/verify-email', catchAsync(verifyEmail)); 
router.post('/login', catchAsync(login));
router.patch('/change-password', checkUser, catchAsync(changePassword));

export default router;
