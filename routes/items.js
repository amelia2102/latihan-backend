const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { Item } = require('../models');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error (get items)' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const item = await Item.create({ title, description, userId: req.user.id });
    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error (create item)' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item || item.userId !== req.user.id) return res.status(404).json({ message: 'Item tidak ditemukan' });

    const { title, description } = req.body;
    item.title = title ?? item.title;
    item.description = description ?? item.description;
    await item.save();
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error (update item)' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item || item.userId !== req.user.id) return res.status(404).json({ message: 'Item tidak ditemukan' });
    await item.destroy();
    return res.json({ message: 'Item dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error (delete item)' });
  }
});

module.exports = router;