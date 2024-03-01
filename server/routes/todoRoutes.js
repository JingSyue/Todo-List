const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middlewares/authMiddleware'); // 假設您已經有身份驗證的中間件

// 創建一個新的待辦事項
router.post('/', auth, todoController.createTodo);

// 獲取當前用戶的所有待辦事項
router.get('/', auth, todoController.getTodos);

// 獲取一個特定的待辦事項
router.get('/:id', auth, todoController.getTodoById);

// 更新一個待辦事項
router.put('/:id', auth, todoController.updateTodo);

// 刪除一個待辦事項
router.delete('/:id', auth, todoController.deleteTodo);

module.exports = router;
