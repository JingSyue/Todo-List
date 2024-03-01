// server/routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // 確保引入bcrypt
const jwt = require('jsonwebtoken');
const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    // 檢查數據庫中是否存在相同的電子郵件地址
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ error: '用戶已存在' });
    }

    // 如果用戶不存在，則創建新用戶
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).send({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: '註冊過程中發生錯誤', details: error.message});
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ error: 'Login failed. User not found.' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'An error occurred during login' });
  }
});

module.exports = router;
