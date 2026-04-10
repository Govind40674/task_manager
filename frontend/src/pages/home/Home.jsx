import { useEffect, useState, useContext } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../../api";
import styles from "./Home.module.css";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { ThemeContext } from "../../context/ThemeContext";

function Home() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

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

  const handleToggle = async (id) => {
    await updateTask(id);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const filteredTasks = (tasks || []).filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "uncompleted") return !task.completed;
    return true;
  });

  return (
    <>
      <Header />

      <div className={`${styles.page} ${darkMode ? styles.dark : styles.light}`}>
        <div className={styles.container}>

          <button
            className={styles.toggleBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>

          <h1 className={styles.title}>✨ Task Manager</h1>

          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a task..."
            />
            <button className={styles.addBtn} onClick={handleAdd}>
              Add
            </button>
          </div>

          <div className={styles.filters}>
            <button
              className={filter === "all" ? styles.activeBtn : styles.filterBtn}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={filter === "completed" ? styles.activeBtn : styles.filterBtn}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>

            <button
              className={filter === "uncompleted" ? styles.activeBtn : styles.filterBtn}
              onClick={() => setFilter("uncompleted")}
            >
              Pending
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}

          <div>
            {filteredTasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskInfo}>
                  <span
                    className={`${styles.taskText} ${
                      task.completed ? styles.completed : ""
                    }`}
                  >
                    {task.title}
                  </span>

                  <span className={styles.taskDate}>
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  {!task.completed && (
                    <button
                      className={styles.completeBtn}
                      onClick={() => handleToggle(task.id)}
                    >
                      ✔
                    </button>
                  )}

                  <button
                    className={styles.deleteBtn}
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

      <Footer />
    </>
  );
}

export default Home;