// server/controllers/todoController.js
const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
    try {
        // 添加owner字段以关联Todo项和当前用户
        const todo = new Todo({
            ...req.body,
            owner: req.user._id
        });
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getTodos = async (req, res) => {
    try {
        // 查找与当前用户关联的所有Todo项
        const todos = await Todo.find({ owner: req.user._id });
        res.send(todos);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, owner: req.user._id });
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (error) {
        res.status(500).send(error);
    }
};
