const express = require('express');
const Item = require('../models/Item');
const { itemSchema } = require('../utils/validators');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get items for the user's college with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, category, status, campus, search } = req.query;
    const filters = { college: req.user.college };

    if (type) filters.type = type;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (campus) filters.campus = campus;

    // Use MongoDB text search for better performance
    if (search && search.trim()) {
      filters.$text = { $search: search.trim() };
    }

    const query = Item.find(filters);

    // Sort by text score if searching, otherwise by creation date
    if (search && search.trim()) {
      query.sort({ score: { $meta: 'textScore' }, createdAt: -1 });
    } else {
      query.sort({ createdAt: -1 });
    }

    const items = await query.limit(200).lean();

    // Debug logging - remove after fixing
    console.log('Total items fetched:', items.length);
    const sampleWithImage = items.find(i => i.images && i.images.length > 0);
    if (sampleWithImage) {
      console.log('Sample item with images:', {
        id: sampleWithImage._id,
        title: sampleWithImage.title,
        images: sampleWithImage.images,
      });
    }

    res.json(items);
  } catch (error) {
    console.error('Get items error', error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

router.get('/mine', async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (error) {
    console.error('Get user items error', error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = itemSchema.parse(req.body);
    const item = await Item.create({
      ...payload,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone,
      college: req.user.college,
      campus: payload.campus || req.user.campus,
    });
    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error', error);
    if (error.name === 'ZodError') {
      const firstError = error.errors[0];
      const field = firstError.path.join('.');
      return res.status(400).json({
        message: `${field}: ${firstError.message}`,
        field,
        errors: error.errors
      });
    }
    res.status(500).json({ message: 'Failed to create item' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Get item error', error);
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const payload = itemSchema.partial().parse(req.body);
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    Object.assign(item, payload);
    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Update item error', error);
    if (error.name === 'ZodError') {
      const firstError = error.errors[0];
      const field = firstError.path.join('.');
      return res.status(400).json({
        message: `${field}: ${firstError.message}`,
        field,
        errors: error.errors
      });
    }
    res.status(500).json({ message: 'Failed to update item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error('Delete item error', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

module.exports = router;
