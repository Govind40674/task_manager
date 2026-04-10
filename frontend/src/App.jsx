import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);

  // ✅ Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // ✅ Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      setTasks(res.data.data);
    } catch {
      setError("Failed to load tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      await createTask({ title });
      setTitle("");
      fetchTasks();
    } catch {
      setError("Error adding task");
    }
  };

  // Toggle complete
  const handleToggle = async (id) => {
    await updateTask(id);
    fetchTasks();
  };

  // Delete task
  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "uncompleted") return !task.completed;
    return true;
  });

  return (
    <div className={`page ${darkMode ? "dark" : "light"}`}>
      <div className="container">

        {/* 🌙 Toggle Theme */}
        <button
          className="toggleBtn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1 className="title">✨ Task Manager</h1>

        {/* Input */}
        <div className="inputContainer">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a task..."
          />
          <button className="addBtn" onClick={handleAdd}>
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={filter === "all" ? "activeBtn" : "filterBtn"}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "completed" ? "activeBtn" : "filterBtn"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          <button
            className={filter === "uncompleted" ? "activeBtn" : "filterBtn"}
            onClick={() => setFilter("uncompleted")}
          >
            Pending
          </button>
        </div>

        {/* States */}
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {/* Tasks */}
        <div>
          {filteredTasks.map((task) => (
            <div key={task.id} className="taskCard">

              {/* Left Side */}
              <div className="taskInfo">
                <span
                  className={`taskText ${task.completed ? "completed" : ""}`}
                >
                  {task.title}
                </span>

                <span className="taskDate">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </span>

                {task.completed && task.completedAt && (
                  <span className="taskDate">
                    Completed: {new Date(task.completedAt).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Right Side */}
              <div>
                {!task.completed && (
                  <button
                    className="completeBtn"
                    onClick={() => handleToggle(task.id)}
                  >
                    ✔
                  </button>
                )}

                <button
                  className="deleteBtn"
                  onClick={() => handleDelete(task.id)}
                >
                  ✕
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;