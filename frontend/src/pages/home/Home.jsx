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
      setTasks(res.data.data || []);
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

  /* ✅ Reusable Task Card */
  const TaskCard = ({ task }) => (
    <div className={styles.taskCard}>
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
  );

  return (
    <>
      <Header />

      <div className={`${styles.page} ${darkMode ? styles.dark : styles.light}`}>
        <div className={styles.container}>

          {/* Theme Toggle */}
          <button
            className={styles.toggleBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>

          <h1 className={styles.title}>✨ Task Manager</h1>

          {/* Input */}
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

          {/* Tabs */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${
                filter === "all" ? styles.activeBtn : ""
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={`${styles.filterBtn} ${
                filter === "completed" ? styles.activeBtn : ""
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>

            <button
              className={`${styles.filterBtn} ${
                filter === "uncompleted" ? styles.activeBtn : ""
              }`}
              onClick={() => setFilter("uncompleted")}
            >
              Pending
            </button>
          </div>

          {/* Loading / Error */}
          {loading && <p>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {/* Sections */}
          <div>
            {filter === "all" && (
              <>
                <h3 className={styles.sectionTitle}>All Tasks</h3>
                {tasks.length === 0 ? (
                  <p>No tasks available</p>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </>
            )}

            {filter === "completed" && (
              <>
                <h3 className={styles.sectionTitle}>Completed Tasks</h3>
                {tasks.filter((t) => t.completed).length === 0 ? (
                  <p>No completed tasks</p>
                ) : (
                  tasks
                    .filter((t) => t.completed)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                )}
              </>
            )}

            {filter === "uncompleted" && (
              <>
                <h3 className={styles.sectionTitle}>Pending Tasks</h3>
                {tasks.filter((t) => !t.completed).length === 0 ? (
                  <p>No pending tasks</p>
                ) : (
                  tasks
                    .filter((t) => !t.completed)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                )}
              </>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;