import { createContext, useContext, useState, useEffect } from "react";

const AccentThemeContext = createContext();

export function AccentThemeProvider({ children }) {
  const [selectedAccentTheme, setSelectedAccentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("accentTheme");
    return savedTheme;
  });

  useEffect(() => {
    const themeMap = {
      "rgb(7, 222, 150)": "theme-teal",
      "rgb(0, 200, 5)": "theme-green",
      "rgb(255, 105, 97)": "theme-coral",
      "rgb(255, 80, 1)": "theme-orange",
      "rgb(218, 65, 107)": "theme-pink",
      "rgb(0, 188, 212)": "theme-cyan",
      "rgb(0, 127, 245)": "theme-blue",
      "rgb(220, 38, 38)": "theme-red",
      "rgb(136, 58, 234)": "theme-purple",
      "rgb(255, 193, 7)": "theme-yellow",
      "rgb(45, 45, 45)": "theme-grey",
      "rgb(230, 190, 255)": "theme-lavender",
    };

    document.documentElement.classList.remove(...Object.values(themeMap));

    localStorage.setItem("accentTheme", selectedAccentTheme);

    const newTheme = themeMap[selectedAccentTheme];
    if (newTheme) {
      document.documentElement.classList.add(newTheme);
    }
  }, [selectedAccentTheme]);

  const toggleAccentTheme = (newSelectedAccentTheme) => {
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
