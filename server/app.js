const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/auth');

dotenv.config(); // 加载.env文件中的环境变量
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// 使用.env文件中的环境变量，例如 process.env.MONGODB_URI
const mongodbUri = process.env.MONGODB_URI;
// 其他环境变量的使用方式类似

// 连接到MongoDB数据库
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB...');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => console.error('Could not connect to MongoDB...', err));
app.use(express.json());

// 使用认证路由
app.use(authRoutes);

// 示例首页路由
app.get('/', (req, res) => {
  res.send('Hello, TodoListApp!');
});
