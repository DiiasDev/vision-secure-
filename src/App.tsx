import { useState, useEffect } from "react";
import "./App.css";
import "./Styles/theme.css";
import Header from "./Components/Header/Header";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carregar preferência do tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col transition-all duration-300 overflow-hidden">
        <Header
          userName="Usuário"
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onLogout={() => console.log("Logout")}
          notificationsCount={3}
        />
        <main className="flex-1 overflow-auto bg-[var(--bg-app)]">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;

