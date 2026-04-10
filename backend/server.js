


const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let tasks = [];

// Helper function to find task
const findTask = (id) => tasks.find((t) => t.id === id);


// ✅ GET all tasks
app.get("/tasks", (req, res) => {
  res.json({
    success: true,
    data: tasks
  });
});


// ✅ CREATE new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validation
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Title is required"
    });
  }

  const newTask = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask
  });
});


// ✅ UPDATE task (toggle completed)
app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: "Task not found"
    });
  }

  task.completed = !task.completed;

  // ✅ Add completion date
  if (task.completed) {
    task.completedAt = new Date();
  } else {
    task.completedAt = null;
  }

  res.json({
    success: true,
    data: task
  });
});


// ✅ DELETE task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const taskExists = findTask(id);

  if (!taskExists) {
    return res.status(404).json({
      success: false,
      error: "Task not found"
    });
  }

  tasks = tasks.filter((t) => t.id !== id);

  res.json({
    success: true,
    message: "Task deleted"
  });
});


// ✅ Global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});