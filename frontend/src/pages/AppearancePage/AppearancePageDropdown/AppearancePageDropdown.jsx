import "./AppearancePageDropdown.css";

function AppearancePageDropdown({ toggleTheme, isDarkMode }) {
  function handleToggleTheme(theme) {
    if (
      (theme === "dark" && !isDarkMode) ||
      (theme === "light" && isDarkMode)
    ) {
      toggleTheme();
    }
  }

  return (
    <div className="AppearancePageDropdown">
      <span
        className={`AppearancePageDropdown__option ${
          !isDarkMode && "AppearancePageDropdown__option--selected"
        }`}
        onClick={() => handleToggleTheme("light")}
      >
        Light
      </span>
      <span
        className={`AppearancePageDropdown__option ${
          isDarkMode && "AppearancePageDropdown__option--selected"
        }`}
        onClick={() => handleToggleTheme("dark")}
      >
        Dark
      </span>
    </div>
  );
}

export default AppearancePageDropdown;
