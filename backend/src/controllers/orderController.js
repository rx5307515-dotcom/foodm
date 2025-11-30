import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required to create an order' });
    }

    const menuItemIds = items.map((item) => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    const menuMap = new Map(menuItems.map((item) => [item.id, item]));

    let totalPrice = 0;
    for (const item of items) {
      const menuItem = menuMap.get(String(item.menuItem));
      if (!menuItem) {
        return res.status(400).json({ message: 'One or more menu items are invalid' });
      }

      const quantity = Number(item.quantity) || 0;
      if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
      }

      totalPrice += menuItem.price * quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice
    });

    const populatedOrder = await order.populate('items.menuItem');
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error', error);
    res.status(500).json({ message: 'Unable to create order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error', error);
    res.status(500).json({ message: 'Unable to fetch orders' });
  }
};

export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email role')
      .populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error', error);
    res.status(500).json({ message: 'Unable to fetch all orders' });
  }
};
