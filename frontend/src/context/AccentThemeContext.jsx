import { createContext, useContext, useState, useEffect } from "react";

const AccentThemeContext = createContext();

export function AccentThemeProvider({ children }) {
  const [selectedAccentTheme, setSelectedAccentTheme] = useState(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("accentTheme");
    return savedTheme;
  });

  useEffect(() => {
    const themeMap = {
      "#07de96": "theme-teal",
      "rgb(0, 200, 5)": "theme-green",
      "rgb(255, 80, 1)": "theme-orange",
      "rgb(218, 65, 107)": "theme-pink",
      "rgb(0, 127, 245)": "theme-blue",
    };

    // Remove all theme classes
    document.documentElement.classList.remove(...Object.values(themeMap));

    // Update localStorage
    localStorage.setItem("accentTheme", selectedAccentTheme);

    // Add new theme class
    const newTheme = themeMap[selectedAccentTheme];
    if (newTheme) {
      document.documentElement.classList.add(newTheme);
    }
  }, [selectedAccentTheme]);

  const toggleAccentTheme = (newSelectedAccentTheme) => {
    console.log(newSelectedAccentTheme)
    setSelectedAccentTheme(newSelectedAccentTheme);
  };

  return (
    <AccentThemeContext.Provider
      value={{ selectedAccentTheme, toggleAccentTheme }}
    >
      {children}
    </AccentThemeContext.Provider>
  );
}

export function useAccentTheme() {
  const context = useContext(AccentThemeContext);
  if (!context) {
    throw new Error("useAccentTheme must be used within a AccentThemeProvider");
  }
  return context;
}
