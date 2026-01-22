import { frappe } from './frappeClient';
import type { DadosComparacao } from './extratoApi';

interface SalvarAcertoResponse {
  success: boolean;
  message: string;
  acerto_id?: string;
  acerto_url?: string;
}

interface ListarAcertosResponse {
  success: boolean;
  acertos?: Array<{
    name: string;
    data_acerto: string;
    periodo_referencia: string;
    status: string;
    total_comissoes: number;
    total_divergencias: number;
    numero_corretores: number;
    planilha_excel: string;
    creation: string;
  }>;
  message?: string;
}

interface ObterAcertoResponse {
  success: boolean;
  acerto?: {
    name: string;
    data_acerto: string;
    periodo_referencia: string;
    status: string;
    total_comissoes: number;
    total_divergencias: number;
    numero_corretores: number;
    planilha_excel: string;
    nome_arquivo: string;
    tamanho_arquivo: string;
    detalhes_html: string;
    dados_json: string;
    creation: string;
  };
  message?: string;
}

/**
 * Converte um arquivo Excel para base64
 */
async function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Salva um acerto no banco de dados com a planilha Excel anexada
 */
export async function salvarAcerto(
  dadosComparacao: DadosComparacao[],
  arquivoExcel: Blob,
  nomeArquivo: string,
  periodoReferencia?: string
): Promise<SalvarAcertoResponse> {
  try {
    // Converter arquivo para base64
    const arquivoBase64 = await fileToBase64(arquivoExcel);
    
    // Preparar dados da comparação para salvar
    const dadosParaSalvar = dadosComparacao.map(d => ({
      funcionarioId: d.funcionarioId,
      nome: d.funcionario,
      cor: d.cor,
      valorPlanilha: d.valorPlanilha,
      valorBanco: d.valorBanco,
      diferenca: d.diferenca,
      comissao: d.valorPlanilha * 0.7, // 70% de comissão
      status: d.status,
      clientesEncontrados: d.detalhes.clientesEncontrados,
      clientesNaoEncontrados: d.detalhes.clientesNaoEncontrados,
      lancamentos: d.detalhes.lancamentos
    }));

    const response = await frappe.post(
      '/method/vision_secure.api.acerto_controller.salvar_acerto',
      {
        dados_comparacao: JSON.stringify(dadosParaSalvar),
        arquivo_excel_base64: arquivoBase64,
        nome_arquivo: nomeArquivo,
        periodo_referencia: periodoReferencia
      }
    );

    const data = response.data?.message || response.data;
    
    if (data.success) {
      console.log('✅ Acerto salvo:', data);
      return data;
    } else {
      throw new Error(data.message || 'Erro ao salvar acerto');
    }
  } catch (error: any) {
    console.error('❌ Erro ao salvar acerto:', error);
    throw new Error(error.response?.data?.message || error.message || 'Erro ao salvar acerto');
  }
}

/**
 * Lista os acertos salvos
 */
export async function listarAcertos(
  limit: number = 20,
  offset: number = 0
): Promise<ListarAcertosResponse> {
  try {
    const response = await frappe.get(
      '/method/vision_secure.api.acerto_controller.listar_acertos',
      {
        params: { limit, offset }
      }
    );

    const data = response.data?.message || response.data;
    return data;
  } catch (error: any) {
    console.error('❌ Erro ao listar acertos:', error);
    throw new Error(error.response?.data?.message || error.message || 'Erro ao listar acertos');
  }
}

/**
 * Obtém detalhes completos de um acerto
 */
export async function obterAcerto(acertoId: string): Promise<ObterAcertoResponse> {
  try {
    const response = await frappe.get(
      '/method/vision_secure.api.acerto_controller.obter_acerto',
      {
        params: { acerto_id: acertoId }
      }
    );

    const data = response.data?.message || response.data;
    return data;
  } catch (error: any) {
    console.error('❌ Erro ao obter acerto:', error);
    throw new Error(error.response?.data?.message || error.message || 'Erro ao obter acerto');
  }
}