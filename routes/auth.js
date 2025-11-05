const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

router.use((req, res, next) => {
  console.log(`📩 Auth route hit: ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/register', async (req, res) => {
  console.log('📦 Register endpoint accessed, body:', req.body);
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email sudah digunakan' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.post('/login', async (req, res) => {
    console.log('📦 Login endpoint accessed');
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email tidak ditemukan' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Password salah' });

        const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
        );

        res.json({ message: 'Login berhasil', token });
    } catch (err) {
        console.error('Error in /login:', err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

module.exports = router;