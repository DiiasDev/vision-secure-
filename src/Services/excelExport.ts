import * as XLSX from 'xlsx';
import type { DadosComparacao } from './extratoApi';

/**
 * Exporta o relatório de comparação detalhado para Excel com formatação profissional
 */
export function exportarRelatorioDetalhado(
  dadosComparacao: DadosComparacao[],
  percentualComissao: number = 70
): void {
  
  const wb = XLSX.utils.book_new();
  const formatoMoeda = '#,##0.00';
  
  // ==================== ABA 1: RESUMO GERAL ====================
  const resumoData: any[][] = [];
  
  resumoData.push(['RELATÓRIO DE ACERTO DE COMISSÕES']);
  resumoData.push([]);
  resumoData.push(['Empresa:', 'Vision Secure']);
  resumoData.push(['Data:', new Date().toLocaleDateString('pt-BR')]);
  resumoData.push(['Hora:', new Date().toLocaleTimeString('pt-BR')]);
  resumoData.push(['Percentual de Comissão:', `${percentualComissao}%`]);
  resumoData.push([]);
  resumoData.push([]);

  let totalGeralPlanilha = 0;
  let totalGeralBanco = 0;
  let totalGeralComissao = 0;

  dadosComparacao.forEach(dado => {
    const comissao = dado.valorPlanilha * (percentualComissao / 100);
    totalGeralPlanilha += dado.valorPlanilha;
    totalGeralBanco += dado.valorBanco;
    totalGeralComissao += comissao;
  });

  resumoData.push(['RESUMO EXECUTIVO']);
  resumoData.push([]);
  resumoData.push(['Total de Corretores:', dadosComparacao.length]);
  resumoData.push(['Total Faturado (Planilhas):', totalGeralPlanilha]);
  resumoData.push(['Total Recebido (Banco):', totalGeralBanco]);
  resumoData.push(['Diferença:', totalGeralPlanilha - totalGeralBanco]);
  resumoData.push(['Total de Comissões:', totalGeralComissao]);
  resumoData.push([]);
  resumoData.push([]);

  resumoData.push(['DETALHAMENTO POR CORRETOR']);
  resumoData.push([]);
  const headerRow = resumoData.length;
  resumoData.push(['Corretor', 'Total Planilha (R$)', 'Total Banco (R$)', 'Diferença (R$)', 'Status', `Comissão ${percentualComissao}% (R$)`, 'Clientes Encontrados', 'Clientes Faltantes']);

  dadosComparacao.forEach(dado => {
    const comissao = dado.valorPlanilha * (percentualComissao / 100);
    const clientesEncontrados = dado.detalhes.clientesEncontrados?.length || 0;
    const clientesFaltantes = dado.detalhes.clientesNaoEncontrados?.length || 0;

    resumoData.push([
      dado.funcionario,
      dado.valorPlanilha,
      dado.valorBanco,
      dado.diferenca,
      dado.status === 'ok' ? 'OK' : 'DIVERGENTE',
      comissao,
      clientesEncontrados,
      clientesFaltantes
    ]);
  });

  resumoData.push([]);
  resumoData.push([
    'TOTAL GERAL',
    totalGeralPlanilha,
    totalGeralBanco,
    totalGeralPlanilha - totalGeralBanco,
    '',
    totalGeralComissao,
    '',
    ''
  ]);

  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);

  wsResumo['!cols'] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
    { wch: 22 },
    { wch: 20 },
    { wch: 20 },
  ];

  const dataStartRow = headerRow;
  const dataEndRow = resumoData.length - 2;
  wsResumo['!autofilter'] = { ref: `A${dataStartRow + 1}:H${dataEndRow}` };

  const firstDataRow = headerRow + 2;
  const lastDataRow = resumoData.length - 2;
  
  for (let i = firstDataRow; i <= lastDataRow; i++) {
    ['B', 'C', 'D', 'F'].forEach(col => {
      const cell = `${col}${i}`;
      if (wsResumo[cell] && typeof wsResumo[cell].v === 'number') {
        wsResumo[cell].z = formatoMoeda;
      }
    });
  }

  const totalRow = resumoData.length;
  ['B', 'C', 'D', 'F'].forEach(col => {
    const cell = `${col}${totalRow}`;
    if (wsResumo[cell] && typeof wsResumo[cell].v === 'number') {
      wsResumo[cell].z = formatoMoeda;
    }
  });

  ['B13', 'B14', 'B15', 'B16'].forEach(cell => {
    if (wsResumo[cell] && typeof wsResumo[cell].v === 'number') {
      wsResumo[cell].z = formatoMoeda;
    }
  });

  XLSX.utils.book_append_sheet(wb, wsResumo, '📊 Resumo Geral');

  // ==================== ABA 2: DETALHAMENTO POR CORRETOR ====================
  dadosComparacao.forEach((dado, index) => {
    const detalhesData: any[][] = [];
    
    detalhesData.push([`CORRETOR: ${dado.funcionario.toUpperCase()}`]);
    detalhesData.push([]);
    detalhesData.push(['RESUMO FINANCEIRO']);
    detalhesData.push([]);
    detalhesData.push(['Descrição', 'Valor (R$)']);
    detalhesData.push(['Total Esperado (Planilha)', dado.valorPlanilha]);
    detalhesData.push(['Total Encontrado (Banco)', dado.valorBanco]);
    detalhesData.push(['Diferença', dado.diferenca]);
    detalhesData.push(['Status', dado.status === 'ok' ? 'OK' : 'DIVERGENTE']);
    detalhesData.push([]);
    detalhesData.push(['CÁLCULO DA COMISSÃO']);
    detalhesData.push([]);
    detalhesData.push(['Base de Cálculo', dado.valorPlanilha]);
    detalhesData.push(['Percentual', `${percentualComissao}%`]);
    detalhesData.push(['VALOR A RECEBER', dado.valorPlanilha * (percentualComissao / 100)]);
    detalhesData.push([]);
    detalhesData.push([]);
    detalhesData.push(['LANÇAMENTOS ENCONTRADOS NO EXTRATO BANCÁRIO']);
    detalhesData.push([]);
    
    const lancHeaderRow = detalhesData.length;
    detalhesData.push(['Nº', 'Cliente', 'Data', 'Valor (R$)', 'Tipo', 'Descrição Completa']);

    if (dado.detalhes.lancamentos && dado.detalhes.lancamentos.length > 0) {
      dado.detalhes.lancamentos.forEach((lanc, idx) => {
        const nomeCliente = lanc.descricao.replace(/^Pix recebido de\s+/i, '').trim();
        detalhesData.push([
          idx + 1,
          nomeCliente,
          lanc.data,
          lanc.valor,
          lanc.tipo,
          lanc.descricao
        ]);
      });

      const subtotalEncontrados = dado.detalhes.lancamentos.reduce((acc: number, lanc) => acc + lanc.valor, 0);
      detalhesData.push([]);
      detalhesData.push(['', 'SUBTOTAL', '', subtotalEncontrados, '', '']);
    } else {
      detalhesData.push(['', 'Nenhum lançamento encontrado', '', '', '', '']);
    }

    detalhesData.push([]);
    detalhesData.push([]);
    detalhesData.push(['CLIENTES NÃO ENCONTRADOS NO EXTRATO']);
    detalhesData.push([]);
    
    if (dado.detalhes.clientesNaoEncontrados && dado.detalhes.clientesNaoEncontrados.length > 0) {
      detalhesData.push(['Nº', 'Nome do Cliente']);
      dado.detalhes.clientesNaoEncontrados.forEach((cliente, idx) => {
        detalhesData.push([idx + 1, cliente]);
      });
    } else {
      detalhesData.push(['✓ Todos os clientes da planilha foram encontrados no extrato!']);
    }

    const wsDetalhe = XLSX.utils.aoa_to_sheet(detalhesData);

    wsDetalhe['!cols'] = [
      { wch: 8 },
      { wch: 30 },
      { wch: 12 },
      { wch: 18 },
      { wch: 20 },
      { wch: 50 },
    ];

    if (dado.detalhes.lancamentos && dado.detalhes.lancamentos.length > 0) {
      const filterEndRow = lancHeaderRow + dado.detalhes.lancamentos.length + 1;
      wsDetalhe['!autofilter'] = { ref: `A${lancHeaderRow + 1}:F${filterEndRow}` };
    }

    ['B6', 'B7', 'B8', 'B13', 'B15'].forEach(cell => {
      if (wsDetalhe[cell] && typeof wsDetalhe[cell].v === 'number') {
        wsDetalhe[cell].z = formatoMoeda;
      }
    });

    const startLanc = lancHeaderRow + 2;
    const numLanc = dado.detalhes.lancamentos?.length || 0;
    for (let i = 0; i < numLanc; i++) {
      const row = startLanc + i;
      const cell = `D${row}`;
      if (wsDetalhe[cell]) {
        wsDetalhe[cell].z = formatoMoeda;
      }
    }

    const subtotalRow = startLanc + numLanc + 1;
    const subtotalCell = `D${subtotalRow}`;
    if (wsDetalhe[subtotalCell]) {
      wsDetalhe[subtotalCell].z = formatoMoeda;
    }

    const nomeAba = `${index + 1}. ${dado.funcionario.substring(0, 25)}`;
    XLSX.utils.book_append_sheet(wb, wsDetalhe, nomeAba);
  });

  // ==================== ABA 3: TODOS OS LANÇAMENTOS ====================
  const todosLancamentosData: any[][] = [];
  
  todosLancamentosData.push(['EXTRATO CONSOLIDADO - TODOS OS LANÇAMENTOS']);
  todosLancamentosData.push([]);
  todosLancamentosData.push(['Total de Lançamentos:', dadosComparacao.reduce((acc, d) => acc + (d.detalhes.lancamentos?.length || 0), 0)]);
  todosLancamentosData.push([]);
  todosLancamentosData.push([]);

  const lancGlobalHeaderRow = todosLancamentosData.length;
  todosLancamentosData.push(['Nº', 'Corretor', 'Cliente', 'Data', 'Valor (R$)', 'Tipo', 'Status']);

  let numeroGlobal = 1;
  dadosComparacao.forEach(dado => {
    if (dado.detalhes.lancamentos && dado.detalhes.lancamentos.length > 0) {
      dado.detalhes.lancamentos.forEach(lanc => {
        const nomeCliente = lanc.descricao.replace(/^Pix recebido de\s+/i, '').trim();
        todosLancamentosData.push([
          numeroGlobal++,
          dado.funcionario,
          nomeCliente,
          lanc.data,
          lanc.valor,
          lanc.tipo,
          'Encontrado'
        ]);
      });
    }
  });

  const totalTodosLancamentos = dadosComparacao.reduce((acc: number, dado) => {
    return acc + (dado.detalhes.lancamentos?.reduce((sum: number, lanc) => sum + lanc.valor, 0) || 0);
  }, 0);

  todosLancamentosData.push([]);
  todosLancamentosData.push(['', '', 'TOTAL GERAL', '', totalTodosLancamentos, '', '']);

  const wsTodos = XLSX.utils.aoa_to_sheet(todosLancamentosData);

  wsTodos['!cols'] = [
    { wch: 8 },
    { wch: 25 },
    { wch: 30 },
    { wch: 12 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
  ];

  const todosEndRow = todosLancamentosData.length - 2;
  wsTodos['!autofilter'] = { ref: `A${lancGlobalHeaderRow + 1}:G${todosEndRow}` };

  const startTodosData = lancGlobalHeaderRow + 2;
  const endTodosData = todosLancamentosData.length - 2;
  for (let i = startTodosData; i <= endTodosData; i++) {
    const cell = `E${i}`;
    if (wsTodos[cell]) {
      wsTodos[cell].z = formatoMoeda;
    }
  }

  const totalCell = `E${todosLancamentosData.length}`;
  if (wsTodos[totalCell]) {
    wsTodos[totalCell].z = formatoMoeda;
  }

  XLSX.utils.book_append_sheet(wb, wsTodos, '📋 Todos os Lançamentos');

  // ==================== ABA 4: DIVERGÊNCIAS E ALERTAS ====================
  const divergenciasData: any[][] = [];
  
  divergenciasData.push(['RELATÓRIO DE DIVERGÊNCIAS E ALERTAS']);
  divergenciasData.push([]);
  
  let totalDivergencias = 0;
  let totalClientesFaltantes = 0;

  dadosComparacao.forEach(dado => {
    if (dado.status === 'divergente') totalDivergencias++;
    totalClientesFaltantes += dado.detalhes.clientesNaoEncontrados?.length || 0;
  });

  divergenciasData.push(['Total de Divergências de Valores:', totalDivergencias]);
  divergenciasData.push(['Total de Clientes Não Encontrados:', totalClientesFaltantes]);
  divergenciasData.push([]);
  divergenciasData.push([]);

  const divHeaderRow = divergenciasData.length;
  divergenciasData.push(['Nº', 'Corretor', 'Tipo de Alerta', 'Descrição', 'Valor (R$)']);

  let numAlerta = 1;
  dadosComparacao.forEach(dado => {
    if (dado.status === 'divergente') {
      divergenciasData.push([
        numAlerta++,
        dado.funcionario,
        'DIVERGÊNCIA DE VALORES',
        `Diferença de R$ ${Math.abs(dado.diferenca).toFixed(2)} entre planilha e banco`,
        dado.diferenca
      ]);
    }

    if (dado.detalhes.clientesNaoEncontrados && dado.detalhes.clientesNaoEncontrados.length > 0) {
      dado.detalhes.clientesNaoEncontrados.forEach(cliente => {
        divergenciasData.push([
          numAlerta++,
          dado.funcionario,
          'CLIENTE NÃO ENCONTRADO',
          `Cliente "${cliente}" consta na planilha mas não foi encontrado no extrato bancário`,
          ''
        ]);
      });
    }
  });

  if (divergenciasData.length <= divHeaderRow + 1) {
    divergenciasData.push([1, '', 'SEM DIVERGÊNCIAS', '✓ Parabéns! Todos os valores conferem e todos os clientes foram encontrados.', '']);
  }

  const wsDivergencias = XLSX.utils.aoa_to_sheet(divergenciasData);

  wsDivergencias['!cols'] = [
    { wch: 8 },
    { wch: 25 },
    { wch: 30 },
    { wch: 65 },
    { wch: 18 },
  ];

  const divEndRow = divergenciasData.length;
  wsDivergencias['!autofilter'] = { ref: `A${divHeaderRow + 1}:E${divEndRow}` };

  for (let i = divHeaderRow + 2; i <= divergenciasData.length; i++) {
    const cell = `E${i}`;
    if (wsDivergencias[cell] && typeof wsDivergencias[cell].v === 'number') {
      wsDivergencias[cell].z = formatoMoeda;
    }
  }

  XLSX.utils.book_append_sheet(wb, wsDivergencias, '⚠️ Divergências');

  // ==================== GERAR E BAIXAR ARQUIVO ====================
  const nomeArquivo = `Acerto_Comissoes_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);

  console.log(`✅ Relatório exportado: ${nomeArquivo}`);
}
