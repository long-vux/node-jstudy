import { Router } from 'express';
import authRoutes from './authRoutes';
// import exerciseRoutes from './exerciseRoutes';
// import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes); 
// router.use('/exercises', exerciseRoutes); 
// router.use('/users', userRoutes); 

export default router;
