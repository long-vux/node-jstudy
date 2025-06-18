import { Router } from 'express';
import { register, login } from '../controllers/authController';
import catchAsync from '../utils/catchAsync';
const router = Router();

router.post('/register', catchAsync(register));
router.post('/login', catchAsync(login));

export default router;
