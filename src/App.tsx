import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./Styles/theme.css";
import Header from "./Components/Header/Header";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Segurados from "./Pages/Segurados/Segurados";
import Seguradoras from "./Pages/Seguradoras/Seguradoras";
import Corretores from "./Pages/Corretores/Corretores";
import Veiculos from "./Pages/Veiculos/Veiculos";
import Seguros from "./Pages/Seguros/Seguros";

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
            
            {/* Segurados */}
            <Route path="/segurados" element={<Navigate to="/segurados/listar" replace />} />
            <Route path="/segurados/criar" element={<Segurados initialTab={1} />} />
            <Route path="/segurados/listar" element={<Segurados initialTab={0} />} />
            
            {/* Seguradoras */}
            <Route path="/seguradoras" element={<Navigate to="/seguradoras/listar" replace />} />
            <Route path="/seguradoras/criar" element={<Seguradoras initialTab={1} />} />
            <Route path="/seguradoras/listar" element={<Seguradoras initialTab={0} />} />
            
            {/* Veículos */}
            <Route path="/veiculos" element={<Navigate to="/veiculos/listar" replace />} />
            <Route path="/veiculos/criar" element={<Veiculos />} />
            <Route path="/veiculos/listar" element={<div className="p-6"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Listar Veículos - Em desenvolvimento</h1></div>} />
            
            {/* Corretores */}
            <Route path="/corretores" element={<Navigate to="/corretores/listar" replace />} />
            <Route path="/corretores/criar" element={<Corretores />} />
            <Route path="/corretores/listar" element={<div className="p-6"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Listar Corretores - Em desenvolvimento</h1></div>} />
            
            {/* Seguros */}
            <Route path="/seguros" element={<Navigate to="/seguros/listar" replace />} />
            <Route path="/seguros/criar" element={<Seguros />} />
            <Route path="/seguros/listar" element={<div className="p-6"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Listar Seguros - Em desenvolvimento</h1></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

