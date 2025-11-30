import { Router } from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  getMenu,
  getMenuItem,
  updateMenuItem
} from '../controllers/menuController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getMenu);
router.get('/:id', getMenuItem);
router.post('/', authenticate, requireAdmin, createMenuItem);
router.put('/:id', authenticate, requireAdmin, updateMenuItem);
router.delete('/:id', authenticate, requireAdmin, deleteMenuItem);

export default router;
