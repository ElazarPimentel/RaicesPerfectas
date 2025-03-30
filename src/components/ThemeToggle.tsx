// filename: src/components/ThemeToggle.tsx

import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "dark") {
      setIsDark(true);
      updateTheme(true);
    } else if (savedTheme === "light") {
      setIsDark(false);
      updateTheme(false);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      updateTheme(true);
    } else {
      setIsDark(false);
      updateTheme(false);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return; // Don't override user preference
      const isDarkMode = e.matches;
      setIsDark(isDarkMode);
      updateTheme(isDarkMode);
    };

    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Function to set theme
  const updateTheme = (dark: boolean) => {
    const body = document.body;
    if (dark) {
      body.setAttribute("data-theme", "dark");
      body.classList.remove("light");
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.removeAttribute("data-theme");
      body.classList.remove("dark");
      body.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    updateTheme(newTheme);
  };

  return (
    <label className="theme-switch" htmlFor="checkbox" title="Toggle dark/light mode" aria-label="Toggle dark mode">
      <input type="checkbox" id="checkbox" checked={isDark} onChange={toggleTheme} />
      <span className="slider round"></span>
    </label>
  );
};
