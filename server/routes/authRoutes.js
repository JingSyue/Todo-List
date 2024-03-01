// server/routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // 確保引入bcrypt
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

// 注册
router.post('/register', async (req, res) => {
  try {
    // 检查数据库中是否存在相同的电子邮件地址
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ error: '用户已存在' });
    }

    // 如果用户不存在，则创建新用户
    const user = new User(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // 将token添加到用户的tokens数组中
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.status(201).send({ 
      user: {
        id: user._id,
        email: user.email
        // 其他需要发送的用户信息
      }, 
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: '注册过程中发生错误', details: error.message});
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

    // 将新token添加到用户的tokens数组中
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.status(201).send({ 
      user: {
        id: user._id,
        email: user.email
        // 其他需要发送的用户信息
      }, 
      token 
    });
  } catch (error) {
    res.status(400).send({ error: 'An error occurred during login' });
  }
});


// 登出
router.post('/logout', auth, async (req, res) => {
  try {
    // 从用户的tokens数组中移除当前的token
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred during logout' });
  }
});

module.exports = router;
