import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderPayment,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/my', protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/pay', protect, updateOrderPayment);

export default router;
