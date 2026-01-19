import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[var(--bg-app)] via-[var(--bg-card)] to-[var(--bg-app)] flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--color-accent)] opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div
        className={`
          relative z-10 max-w-2xl w-full
          transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {/* 404 Large Number */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-20 blur-2xl rounded-full animate-pulse"></div>
              <h1 className="relative text-[120px] sm:text-[140px] font-black bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-clip-text text-transparent leading-none animate-float">
                404
              </h1>
            </div>
          </div>
        </div>

        {/* Alert Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--color-warning)] opacity-20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-danger)] rounded-2xl flex items-center justify-center shadow-xl animate-bounce-slow">
              <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-default)] p-6 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] animate-slide-in-up">
              Página Não Encontrada
            </h2>
            <p className="text-base text-[var(--text-secondary)] animate-slide-in-up delay-100">
              Oops! A página que você está procurando não existe ou foi movida.
            </p>
            <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] animate-slide-in-up delay-200">
              <Search className="w-4 h-4" />
              <p className="text-xs sm:text-sm">
                Verifique o URL ou retorne à página inicial
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 animate-slide-in-up delay-300">
            <button
              onClick={() => navigate(-1)}
              className="
                flex-1 flex items-center justify-center gap-2
                px-5 py-3 rounded-xl
                bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover)]
                text-[var(--text-primary)] font-semibold
                border border-[var(--border-default)]
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-lg
                active:scale-95
                group
              "
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
              Voltar
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="
                flex-1 flex items-center justify-center gap-2
                px-5 py-3 rounded-xl
                bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]
                hover:from-[var(--color-primary-hover)] hover:to-[var(--color-accent-dark)]
                text-white font-bold
                shadow-lg shadow-[var(--color-primary)]/30
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-xl hover:shadow-[var(--color-primary)]/40
                active:scale-95
                group
              "
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              Ir para o Dashboard
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-5 text-center animate-slide-in-up delay-400">
          <p className="text-xs text-[var(--text-muted)] mb-3">Páginas úteis:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Segurados", path: "/segurados/listar" },
              { label: "Seguros", path: "/seguros/listar" },
              { label: "Veículos", path: "/veiculos/listar" }
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="
                  px-3 py-1.5 rounded-lg
                  bg-[var(--bg-hover)] hover:bg-[var(--color-primary)]/10
                  text-[var(--text-secondary)] hover:text-[var(--color-primary)]
                  text-xs font-medium
                  border border-transparent hover:border-[var(--color-primary)]/30
                  transition-all duration-200
                  hover:scale-105
                "
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}