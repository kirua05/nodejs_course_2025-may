// models/Todos.js
// 定義使用者 Schema
const mongoose = require('mongoose');

const todosSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '請輸入待辦事項'],
    trim: true,
    unique: true,
    minlength: [3, '待辦事項至少需要3個字'],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{ versionKey: false })

// 建立 model
const Todos = mongoose.model('Todos', todosSchema, "TodosExample");

// 匯出 model
module.exports = Todos;