import MenuItem from '../models/MenuItem.js';

export const getMenu = async (_req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    console.error('Get menu error', error);
    res.status(500).json({ message: 'Unable to fetch menu' });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get menu item error', error);
    res.status(500).json({ message: 'Unable to fetch menu item' });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    const item = await MenuItem.create({ name, description, price, category, available });
    res.status(201).json(item);
  } catch (error) {
    console.error('Create menu item error', error);
    res.status(500).json({ message: 'Unable to create menu item' });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, available },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Update menu item error', error);
    res.status(500).json({ message: 'Unable to update menu item' });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error('Delete menu item error', error);
    res.status(500).json({ message: 'Unable to delete menu item' });
  }
};
