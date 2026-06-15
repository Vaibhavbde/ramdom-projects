import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("Home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default Layout;
