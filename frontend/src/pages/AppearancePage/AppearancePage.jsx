import "./AppearancePage.css";
import { TiArrowUnsorted } from "react-icons/ti";

import { useState } from "react";

import AppearancePageDropdown from "./AppearancePageDropdown";

import { useTheme } from "../../context/ThemeContext";

function AppearancePage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="AppearancePage">
      <main className="AppearancePage__main">
        <header className="AppearancePage__title">App Appearance</header>
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
              <AppearancePageDropdown
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            )}
          </span>
        </div>
      </main>
    </div>
  );
}

export default AppearancePage;
