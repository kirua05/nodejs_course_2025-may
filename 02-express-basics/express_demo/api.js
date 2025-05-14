const express = require('express');
const app = express();
const port = 3000;

// 建立一個陣列來儲存使用者資料
let todos = [];

// 解析 JSON 格式
app.use(express.json());

app.get('/', (req, res) => {
  res.send('To-Do List');
});

// GET
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST
app.post('/todos', (req, res) => {
  const { title } = req.body

  if(!title){
    return res.status(400).json({ error: 'title is wrong'})
  }

  const newTodo = {
    id: Date.now(),
    title,
    completed: false,
    createdAt: new Date()
  };
  todos.push(newTodo);  123
  res.status(201).json({
    message: 'New todo has been created',
    todo: newTodo
  });
});

// PUT
app.put('/todos/:id', (req, res) => {
  const { id } = req.params
  const { completed } = req.body

  const todo = todos.find((t) => t.id ===Number(id))
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }


  todo.completed = completed
  res.json(todo)

})

// DELETE
app.delete('/todos/:id', (req, res) => {
  console.log(req);
  
  const { id } = req.params

  todos = todos.filter((t) => t.id !== Number(id))
  res.status(204).send()
})


app.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}`);
});