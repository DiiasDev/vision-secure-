import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fields } from "../../FieldsForm/AuthFields";
import { authenticateUser } from "../../Services/auth";
import "../../Styles/theme.css";
import { Alert } from "@mui/material";

export default function FormAuth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setError(null);
    setLoading(true);

    try {
      const success = await authenticateUser(data.username, data.password);
      
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "var(--bg-gradient)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center font-bold text-2xl"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
              color: "var(--text-inverse)",
              boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
            }}
          >
            A
          </div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Asha Corretora
          </h1>
          <p 
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Sistema de Gestão de Seguros
          </p>
        </div>

        {/* Card de Login */}
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Bem-vindo de volta
          </h2>
          <p 
            className="mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Entre com suas credenciais para continuar
          </p>

          {error && (
            <Alert severity="error" className="mb-4" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit({
              username: formData.get('username'),
              password: formData.get('password')
            });
          }}>
            {fields.map((field) => (
              <div key={field.fieldname} className="mb-4">
                <label 
                  htmlFor={field.fieldname}
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {field.label}
                  {field.required && <span style={{ color: "var(--color-danger)" }}> *</span>}
                </label>
                <input
                  type={field.fieldtype}
                  id={field.fieldname}
                  name={field.fieldname}
                  required={field.required}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-default)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all mt-6"
              style={{
                background: loading 
                  ? "var(--button-disabled)" 
                  : "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(37, 99, 235, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p 
          className="text-center text-sm mt-6"
          style={{ color: "var(--text-secondary)" }}
        >
          © 2026 Asha Corretora. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
