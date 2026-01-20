import { frappe } from './frappeClient';

export interface LancamentoExtrato {
  data: string;
  descricao: string;
  tipo: string;
  valor: number;
}

export interface DadosComparacao {
  funcionario: string;
  funcionarioId: string;
  cor: string;
  valorPlanilha: number;
  valorBanco: number;
  diferenca: number;
  status: 'ok' | 'divergente';
  detalhes: {
    clientesEncontrados: string[];
    clientesNaoEncontrados: string[];
    lancamentos: LancamentoExtrato[];
  };
}

/**
 * Faz upload do arquivo PDF do extrato bancário e processa os lançamentos
 */
export async function processarExtratoPDF(file: File): Promise<LancamentoExtrato[]> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await frappe.post('/method/vision_secure.api.extrato_controller.processar_extrato_pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('📥 Resposta da API:', response.data);

    // A resposta do Frappe vem em response.data.message.message (aninhado)
    let lancamentos = null;
    
    if (response.data?.message?.message) {
      // Caso 1: Resposta aninhada do Frappe
      lancamentos = response.data.message.message;
    } else if (response.data?.message) {
      // Caso 2: Resposta direta
      lancamentos = response.data.message;
    }

    if (!lancamentos) {
      throw new Error('Resposta inválida do servidor - dados não encontrados');
    }

    if (!Array.isArray(lancamentos)) {
      console.error('❌ Resposta não é um array:', lancamentos);
      throw new Error('Resposta inválida do servidor - esperado um array de lançamentos');
    }

    console.log(`✅ ${lancamentos.length} lançamentos extraídos do PDF`);
    return lancamentos;
    
  } catch (error) {
    console.error('❌ Erro ao processar extrato PDF:', error);
    throw error;
  }
}

/**
 * Filtra apenas os lançamentos de entrada do extrato
 */
export function filtrarEntradas(lancamentos: LancamentoExtrato[]): LancamentoExtrato[] {
  if (!Array.isArray(lancamentos)) {
    console.error('❌ filtrarEntradas: entrada não é um array:', lancamentos);
    return [];
  }
  
  const entradas = lancamentos.filter(lancamento => 
    lancamento.tipo === 'Entrada PIX' && lancamento.valor > 0
  );
  
  console.log(`🔍 Filtragem: ${entradas.length} entradas de ${lancamentos.length} lançamentos totais`);
  return entradas;
}

/**
 * Extrai o nome do cliente da descrição do lançamento
 * Exemplo: "Pix recebido de GABRIEL LEONARDO DIAS" -> "GABRIEL LEONARDO DIAS"
 * Retorna string vazia se não houver nome identificável
 */
export function extrairNomeCliente(descricao: string): string {
  // Remove prefixos comuns
  const descricaoLimpa = descricao
    .replace(/^Pix recebido de\s+/i, '')
    .replace(/^PIX RECEBIDO\s*/i, '')
    .trim();
  
  // Se a descrição original era apenas "PIX RECEBIDO" (sem nome após),
  // retornar vazio para indicar que não há identificação
  if (!descricaoLimpa || descricaoLimpa.length === 0 || descricaoLimpa === descricao) {
    return '';
  }
  
  return descricaoLimpa;
}

/**
 * Normaliza string para comparação (remove acentos, maiúsculas, etc)
 */
function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Verifica se o nome do cliente está na planilha
 */
function verificarClienteNaPlanilha(nomeCliente: string, dadosPlanilha: any[]): boolean {
  const nomeNormalizado = normalizeString(nomeCliente);
  
  return dadosPlanilha.some(linha => {
    const nomeNaPlanilha = normalizeString(linha.cliente || linha.nome || '');
    return nomeNaPlanilha.includes(nomeNormalizado) || nomeNormalizado.includes(nomeNaPlanilha);
  });
}

/**
 * Processa e compara os dados do extrato com as planilhas dos funcionários
 */
export async function compararExtratoComPlanilhas(
  lancamentosExtrato: LancamentoExtrato[],
  planilhasFuncionarios: Array<{
    file: File;
    funcionarioSelecionado?: string;
    dados?: any[];
  }>,
  funcionarios: Array<{ id: string; nome: string; cor: string }>
): Promise<DadosComparacao[]> {
  
  console.log('📊 Iniciando comparação...');
  console.log('   Lançamentos recebidos:', lancamentosExtrato);
  console.log('   É array?', Array.isArray(lancamentosExtrato));
  console.log('   Tipo:', typeof lancamentosExtrato);
  
  if (!Array.isArray(lancamentosExtrato)) {
    console.error('❌ lancamentosExtrato não é um array:', lancamentosExtrato);
    throw new Error('Dados de lançamentos inválidos - esperado um array');
  }
  
  const entradas = filtrarEntradas(lancamentosExtrato);
  console.log(`   ${entradas.length} entradas filtradas`);
  
  const resultados: DadosComparacao[] = [];

  // Para cada funcionário/planilha
  for (const planilha of planilhasFuncionarios) {
    if (!planilha.funcionarioSelecionado || !planilha.dados) {
      continue;
    }

    const funcionario = funcionarios.find(f => f.id === planilha.funcionarioSelecionado);
    if (!funcionario) {
      continue;
    }

    console.log(`\n👤 Processando funcionário: ${funcionario.nome}`);
    console.log(`   Dados da planilha:`, planilha.dados);

    // Calcular valor total esperado na planilha
    let valorPlanilha = 0;
    const clientesPlanilha: string[] = [];

    planilha.dados.forEach(linha => {
      // Tentar diferentes nomes de colunas para valor
      const valorStr = linha['Valor a Receber (R$)'] || linha['Valor'] || linha['valor'] || linha['Total'] || linha['total'] || '0';
      const valor = parseFloat(String(valorStr).replace(/[^\d,.-]/g, '').replace(',', '.'));
      
      if (!isNaN(valor) && valor > 0) {
        valorPlanilha += valor;
        
        // Coletar nome do cliente
        const nomeCliente = linha['Nome do Cliente'] || linha['Cliente'] || linha['cliente'] || linha['Nome'] || linha['nome'] || '';
        if (nomeCliente) {
          clientesPlanilha.push(String(nomeCliente).trim());
        }
      }
    });

    console.log(`   💰 Valor total esperado (planilha): R$ ${valorPlanilha.toFixed(2)}`);
    console.log(`   👥 Clientes na planilha: ${clientesPlanilha.join(', ')}`);

    // Procurar no extrato os valores que correspondem aos clientes da planilha
    const lancamentosEncontrados: LancamentoExtrato[] = [];
    const clientesEncontrados: Set<string> = new Set();
    const clientesNaoEncontrados: string[] = [...clientesPlanilha];

    for (const lancamento of entradas) {
      const nomeRemetente = extrairNomeCliente(lancamento.descricao);
      
      // Ignorar lançamentos sem identificação do remetente
      if (!nomeRemetente || nomeRemetente.length === 0) {
        console.log(`   ⚠️  Ignorando PIX sem identificação: "${lancamento.descricao}" (R$ ${lancamento.valor})`);
        continue;
      }
      
      const nomeNormalizado = normalizeString(nomeRemetente);
      
      console.log(`   🔍 Verificando lançamento: "${nomeRemetente}" (R$ ${lancamento.valor})`);

      // Verificar se algum cliente da planilha corresponde ao remetente
      let encontrou = false;
      for (let i = 0; i < clientesPlanilha.length; i++) {
        const clientePlanilha = clientesPlanilha[i];
        const clienteNormalizado = normalizeString(clientePlanilha);
        
        // Verificar match parcial (nome ou sobrenome)
        const partesRemetente = nomeNormalizado.split(' ');
        const partesCliente = clienteNormalizado.split(' ');
        
        const temMatch = partesRemetente.some(parteRem => 
          partesCliente.some(parteCli => 
            parteCli.length > 2 && parteRem.includes(parteCli) || parteCli.includes(parteRem)
          )
        );

        if (temMatch) {
          encontrou = true;
          lancamentosEncontrados.push(lancamento);
          clientesEncontrados.add(clientePlanilha);
          
          // Remover da lista de não encontrados
          const index = clientesNaoEncontrados.indexOf(clientePlanilha);
          if (index > -1) {
            clientesNaoEncontrados.splice(index, 1);
          }
          
          console.log(`      ✅ Match encontrado com cliente: "${clientePlanilha}"`);
          break;
        }
      }

      if (!encontrou) {
        console.log(`      ⚠️  Remetente não corresponde a nenhum cliente da planilha`);
      }
    }

    // Calcular valor total encontrado no banco
    const valorBanco = lancamentosEncontrados.reduce((total, lanc) => total + lanc.valor, 0);

    console.log(`   💵 Valor total encontrado (banco): R$ ${valorBanco.toFixed(2)}`);
    console.log(`   ✅ Clientes encontrados: ${Array.from(clientesEncontrados).join(', ')}`);
    console.log(`   ❌ Clientes NÃO encontrados: ${clientesNaoEncontrados.join(', ')}`);

    // Calcular diferença
    const diferenca = valorBanco - valorPlanilha;
    const status: 'ok' | 'divergente' = Math.abs(diferenca) < 0.01 ? 'ok' : 'divergente';

    console.log(`   📊 Diferença: R$ ${diferenca.toFixed(2)} - Status: ${status}`);

    resultados.push({
      funcionario: funcionario.nome,
      funcionarioId: funcionario.id,
      cor: funcionario.cor,
      valorPlanilha,
      valorBanco,
      diferenca,
      status,
      detalhes: {
        clientesEncontrados: Array.from(clientesEncontrados),
        clientesNaoEncontrados,
        lancamentos: lancamentosEncontrados,
      },
    });
  }

  return resultados;
}

/**
 * Gera alertas baseados nos resultados da comparação
 */
export function gerarAlertas(resultados: DadosComparacao[]): Array<{
  tipo: 'warning' | 'info' | 'error';
  titulo: string;
  mensagem: string;
}> {
  const alertas: Array<{ tipo: 'warning' | 'info' | 'error'; titulo: string; mensagem: string }> = [];

  let totalOk = 0;
  let totalDivergente = 0;

  resultados.forEach(resultado => {
    if (resultado.status === 'ok') {
      totalOk++;
    } else {
      totalDivergente++;
      
      const diferencaFormatada = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Math.abs(resultado.diferenca));

      const tipo = resultado.diferenca > 0 ? 'maior' : 'menor';
      
      alertas.push({
        tipo: 'warning',
        titulo: 'Divergência Detectada',
        mensagem: `${resultado.funcionario} possui valor no banco ${diferencaFormatada} ${tipo} que na planilha.`,
      });
    }

    // Alertas para clientes não encontrados
    if (resultado.detalhes.clientesNaoEncontrados.length > 0) {
      alertas.push({
        tipo: 'error',
        titulo: 'Clientes Não Encontrados',
        mensagem: `${resultado.funcionario}: ${resultado.detalhes.clientesNaoEncontrados.length} cliente(s) da planilha não foram encontrados no extrato.`,
      });
    }
  });

  // Alerta de resumo
  if (resultados.length > 0) {
    alertas.push({
      tipo: 'info',
      titulo: 'Informação',
      mensagem: `${totalOk} de ${resultados.length} funcionário(s) com valores conferidos corretamente.`,
    });
  }

  return alertas;
}
