import * as XLSX from 'xlsx';

export interface ProcessedFileData {
  fileName: string;
  sheets: string[];
  data: Record<string, any[]>;
  rowCount: number;
}

/**
 * Processa um arquivo Excel e retorna os dados estruturados
 */
export async function processExcelFile(file: File): Promise<ProcessedFileData> {
  console.log('📊 Processando arquivo Excel:', file.name);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const processedData: Record<string, any[]> = {};
        let totalRows = 0;
        
        // Processar cada planilha
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          
          // Extrair dados com cabeçalhos
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            defval: ''
          });
          
          processedData[sheetName] = jsonData as any[];
          totalRows += jsonData.length;
          console.log(`  📄 Sheet "${sheetName}": ${jsonData.length} linhas`);
        });
        
        console.log(`✅ Arquivo processado com sucesso! ${workbook.SheetNames.length} sheets, ${totalRows} linhas totais`);
        
        resolve({
          fileName: file.name,
          sheets: workbook.SheetNames,
          data: processedData,
          rowCount: totalRows
        });
      } catch (error) {
        console.error('❌ Erro ao processar Excel:', error);
        reject(new Error(`Erro ao processar arquivo Excel: ${error}`));
      }
    };
    
    reader.onerror = () => {
      console.error('❌ Erro ao ler arquivo');
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    reader.readAsBinaryString(file);
  });
}

/**
 * Processa um arquivo PDF e extrai o texto
 */
export async function processPDFFile(file: File): Promise<string> {
  // Para PDF, vamos retornar o nome do arquivo por enquanto
  // A biblioteca pdf-parse funciona melhor no backend
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Por enquanto, apenas confirmamos que o arquivo foi carregado
      resolve(`PDF carregado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Detecta o funcionário pelo nome do arquivo
 */
export function detectarFuncionarioPorNome(
  fileName: string,
  funcionarios: Array<{ id: string; nome: string }>
): string | undefined {
  const nomeArquivo = fileName
    .toLowerCase()
    .replace('.xlsx', '')
    .replace('.xls', '')
    .replace('.csv', '')
    .replace(/[_-]/g, ' ')
    .trim();
  
  console.log('🔍 Detectando funcionário para arquivo:', fileName);
  console.log('📝 Nome normalizado:', nomeArquivo);
  console.log('👥 Funcionários disponíveis:', funcionarios.map(f => f.nome));
  
  // Busca por correspondência no nome
  const funcionarioEncontrado = funcionarios.find(func => {
    const nomeFunc = func.nome.toLowerCase();
    const palavrasNome = nomeFunc.split(' ').filter(p => p.length > 2);
    
    console.log(`  ➜ Testando "${func.nome}":`, palavrasNome);
    
    // Verifica se alguma palavra significativa do nome está no arquivo
    const encontrado = palavrasNome.some(palavra => {
      const match = nomeArquivo.includes(palavra);
      if (match) {
        console.log(`    ✅ Match encontrado: "${palavra}"`);
      }
      return match;
    });
    
    return encontrado;
  });

  if (funcionarioEncontrado) {
    console.log(`✅ Funcionário detectado: ${funcionarioEncontrado.nome} (ID: ${funcionarioEncontrado.id})`);
  } else {
    console.log('❌ Nenhum funcionário detectado automaticamente');
  }
  console.log('---');

  return funcionarioEncontrado?.id;
}

/**
 * Valida se o arquivo é do tipo permitido
 */
export function validarTipoArquivo(
  file: File,
  tiposPermitidos: string[]
): boolean {
  const extensao = file.name.split('.').pop()?.toLowerCase();
  if (!extensao) return false;
  
  // Aceita tanto ".pdf" quanto "pdf"
  return tiposPermitidos.some(tipo => 
    tipo.toLowerCase() === `.${extensao}` || tipo.toLowerCase() === extensao
  );
}

/**
 * Formata o tamanho do arquivo para exibição
 */
export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
