const express = require('express');
const router = express.Router();
const { Item } = require('../models');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll({ where: { userId: req.user.id } });
    res.json(items);
  } catch (err) {
    console.error('Error GET /items:', err);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    const newItem = await Item.create({ title, description, userId });
    res.json(newItem);
  } catch (err) {
    console.error('Error POST /items:', err);
    res.status(500).json({ message: 'Gagal menambah data' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await Item.findOne({ where: { id, userId } });
    if (!item) return res.status(404).json({ message: 'Item tidak ditemukan' });

    await item.destroy();
    res.json({ message: 'Item berhasil dihapus' });
  } catch (err) {
    console.error('Error DELETE /items/:id:', err);
    res.status(500).json({ message: 'Gagal menghapus item' });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user?.id;

        console.log("🛠 UPDATE ITEM:", { id, title, description, userId });

        if (!userId) {
        return res.status(401).json({ message: 'User tidak terautentikasi' });
        }

        const item = await Item.findOne({ where: { id, userId } });
        if (!item) {
        return res.status(404).json({ message: 'Item tidak ditemukan atau bukan milik kamu' });
        }

        item.title = title;
        item.description = description;
        await item.save();

        res.json({ message: 'Item berhasil diupdate', item });
    } catch (err) {
        console.error('❌ Error PUT /items/:id:', err);
        res.status(500).json({ message: 'Gagal mengupdate item', error: err.message });
    }
});


module.exports = router;