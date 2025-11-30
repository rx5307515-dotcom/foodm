import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createOrder, getAllOrders, getMyOrders } from '../controllers/orderController.js';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/me', authenticate, getMyOrders);
router.get('/', authenticate, requireAdmin, getAllOrders);

export default router;
