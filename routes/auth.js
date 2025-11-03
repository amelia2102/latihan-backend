const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Lengkapi semua field' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({ name, email, password: hash });
    return res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error register' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Lengkapi email & password' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Email atau password salah' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Email atau password salah' });

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error login' });
  }
});

module.exports = router;