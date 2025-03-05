import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button className="ThemeToggle" onClick={toggleTheme}>
      {isDarkMode ? (
        <FaSun className="ThemeToggle__icon" />
      ) : (
        <FaMoon className="ThemeToggle__icon" />
      )}
    </button>
  );
}

export default ThemeToggle;
