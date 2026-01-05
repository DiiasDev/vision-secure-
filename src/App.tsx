import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./Styles/theme.css";
import Header from "./Components/Header/Header";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Segurados from "./Pages/Segurados/Segurados";

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
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/segurados" element={<Segurados />} />
            <Route path="/seguradoras" element={<div className="p-6"><h1>Seguradoras - Em desenvolvimento</h1></div>} />
            <Route path="/veiculos" element={<div className="p-6"><h1>Veículos - Em desenvolvimento</h1></div>} />
            <Route path="/corretores" element={<div className="p-6"><h1>Corretores - Em desenvolvimento</h1></div>} />
            <Route path="/seguros" element={<div className="p-6"><h1>Seguros - Em desenvolvimento</h1></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

