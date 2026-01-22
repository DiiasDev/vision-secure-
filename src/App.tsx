import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import Financeiro from "./Pages/Financeiro/Financeiro";
import Acerto from "./Pages/Financeiro/Acerto";
import NotFound from "./Pages/NotFound/NotFound";
import Auth from "./Pages/Auth/Auth";
import ProtectedRoute from "./Components/ProtectedRoute";
import { isAuthenticated, getLoggedUser } from "./Services/auth";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [userName, setUserName] = useState(getLoggedUser() || "Usuário");
  const navigate = useNavigate();

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

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setIsAuth(auth);
      if (auth) {
        setUserName(getLoggedUser() || "Usuário");
      }
    };

    checkAuth();
    
    // Verificar periodicamente se ainda está autenticado
    const interval = setInterval(checkAuth, 5000);
    
    return () => clearInterval(interval);
  }, [navigate]);

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
    <Routes>
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={
          isAuth ? <Navigate to="/dashboard" replace /> : <Auth />
        } 
      />

      {/* Rotas Protegidas */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col transition-all duration-300 overflow-hidden">
                <Header
                  userName={userName}
                  isDarkMode={isDarkMode}
                  onToggleTheme={toggleTheme}
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
                    <Route path="/veiculos/criar" element={<Veiculos initialTab={1} />} />
                    <Route path="/veiculos/listar" element={<Veiculos initialTab={0} />} />
                    
                    {/* Corretores */}
                    <Route path="/corretores" element={<Navigate to="/corretores/listar" replace />} />
                    <Route path="/corretores/criar" element={<Corretores initialTab={1} />} />
                    <Route path="/corretores/listar" element={<Corretores initialTab={0} />} />
                    
                    {/* Seguros */}
                    <Route path="/seguros" element={<Navigate to="/seguros/listar" replace />} />
                    <Route path="/seguros/criar" element={<Seguros initialTab={1} />} />
                    <Route path="/seguros/listar" element={<Seguros initialTab={0} />} />
                    
                    {/* Financeiro */}
                    <Route path="/financeiro" element={<Navigate to="/financeiro/acerto" replace />} />
                    <Route path="/financeiro/acerto" element={<Acerto />} />
                    <Route path="/financeiro/gestao" element={<Financeiro />} />
                    
                    {/* 404 - Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

