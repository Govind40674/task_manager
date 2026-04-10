import React, { useContext } from "react";
import styles from "./Header.module.css";
import { ThemeContext } from "../../context/ThemeContext";

function Header() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>✨ Task Manager</div>

      <div className={styles.right}>
        <button
          className={styles.toggleBtn}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

export default Header;