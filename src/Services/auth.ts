import { FrappeApp } from "frappe-js-sdk";
import { getAllCorretoresForAuth } from "./corretores";

const frappe = new FrappeApp(import.meta.env.VITE_FRAPPE_URL || "http://localhost:8000");

// Usuário padrão (administrador)
const DEFAULT_ADMIN = {
  username: "Valdir Dias",
  password: "Brasil1036",
  displayName: "Valdir Dias",
  isAdmin: true,
};

// Senha padrão para corretores
const DEFAULT_CORRETOR_PASSWORD = "123456";

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAuthenticated") === "true";
};

// Obter nome do usuário logado
export const getLoggedUser = (): string | null => {
  return localStorage.getItem("userName");
};

// Verificar se o usuário é administrador
export const isAdmin = (): boolean => {
  return localStorage.getItem("isAdmin") === "true";
};

// Obter ID do corretor logado (se não for admin)
export const getCorretorId = (): string | null => {
  return localStorage.getItem("corretorId");
};

// Fazer login
export const authenticateUser = async (
  username: string,
  password: string
): Promise<boolean> => {
  try {
    // 1. Verificar se é o administrador
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", DEFAULT_ADMIN.displayName);
      localStorage.setItem("isAdmin", "true");
      localStorage.removeItem("corretorId");
      console.log("✅ Login realizado como Administrador");
      return true;
    }

    // 2. Buscar corretor pelo nome completo
    try {
      console.log("🔍 Buscando corretor com nome:", username);
      const corretores = await getAllCorretoresForAuth();
      console.log("📋 Corretores encontrados:", corretores.length);
      console.log("📋 Lista de corretores:", corretores.map(c => ({
        nome: c.nome_completo,
        ativo: c.ativo_no_sistema,
        name: c.name
      })));
      
      // Normalizar nome para comparação (remover acentos e comparar case-insensitive)
      const normalizeString = (str: string) => {
        return str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };
      
      const corretor = corretores.find((c) => {
        const nomeCorretor = normalizeString(c.nome_completo);
        const nomeInput = normalizeString(username);
        const isAtivo = String(c.ativo_no_sistema) === "1";
        
        console.log(`🔎 Comparando: "${nomeCorretor}" vs "${nomeInput}", ativo: ${isAtivo}`);
        
        return nomeCorretor === nomeInput && isAtivo;
      });

      if (corretor) {
        console.log("✅ Corretor encontrado:", corretor.nome_completo);
        
        if (password === DEFAULT_CORRETOR_PASSWORD) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userName", corretor.nome_completo);
          localStorage.setItem("isAdmin", "false");
          localStorage.setItem("corretorId", corretor.name || "");
          console.log(`✅ Login realizado como Corretor: ${corretor.nome_completo}`);
          return true;
        } else {
          console.log("❌ Senha incorreta para corretor");
        }
      } else {
        console.log("❌ Corretor não encontrado ou inativo");
      }
    } catch (corretorError) {
      console.error("⚠️ Erro ao buscar corretores:", corretorError);
    }

    // 3. Tentar autenticar com Frappe se disponível
    try {
      const response = await frappe.auth().loginWithUsernamePassword({
        username,
        password,
      });

      if (response) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", username);
        localStorage.setItem("isAdmin", "false");
        console.log("✅ Login realizado via Frappe");
        return true;
      }
    } catch (frappeError) {
      console.warn("⚠️ Frappe não disponível ou credenciais inválidas:", frappeError);
    }

    return false;
  } catch (error) {
    console.error("❌ Erro ao autenticar:", error);
    return false;
  }
};

// Fazer logout
export const logoutUser = async (): Promise<void> => {
  try {
    // Tentar logout do Frappe se estiver conectado
    try {
      await frappe.auth().logout();
    } catch (error) {
      console.warn("⚠️ Não foi possível fazer logout do Frappe:", error);
    }
  } catch (error) {
    console.error("❌ Erro ao fazer logout:", error);
  } finally {
    // Sempre limpar o localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("corretorId");
    console.log("✅ Logout realizado com sucesso");
  }
};
