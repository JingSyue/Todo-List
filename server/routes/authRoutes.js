// server/routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

