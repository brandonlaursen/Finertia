import "./AppearancePage.css";
import { useState } from "react";
import { TiArrowUnsorted } from "react-icons/ti";

import { useTheme } from "../../context/ThemeContext";

function AppearancePage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  function handleToggleTheme(theme) {
    if (theme === "dark" && isDarkMode) {
      return;
    }
    if (theme === "dark" && !isDarkMode) {
      toggleTheme();
      return;
    }
    if (theme === "light" && isDarkMode) {
      toggleTheme();
      return;
    }
    if (theme === "light" && !isDarkMode) {
      return;
    }
  }
  return (
    <div className="AppearancePage">
      <div className="AppearancePage__content">
        <span className="AppearancePage__title">App Appearance</span>
        <div className="AppearancePage__theme">
          <span className="AppearancePage__subtitle">Theme</span>

          <span
            className={`AppearancePage__dropdown__menu ${
              showDropdown && "AppearancePage__dropdown__menu--active"
            }`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{isDarkMode ? "Dark" : "Light"}</span>
            <TiArrowUnsorted className="AppearancePage__dropdown__arrows" />
            {showDropdown && (
              <div className="AppearancePage__dropdown">
                <span
                  className={`AppearancePage__dropdown__option ${
                    !isDarkMode && "AppearancePage__dropdown__option--selected"
                  }`}
                  onClick={() => handleToggleTheme("light")}
                >
                  Light
                </span>
                <span
                  className={`AppearancePage__dropdown__option ${
                    isDarkMode && "AppearancePage__dropdown__option--selected"
                  }`}
                  onClick={() => handleToggleTheme("dark")}
                >
                  Dark
                </span>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AppearancePage;
