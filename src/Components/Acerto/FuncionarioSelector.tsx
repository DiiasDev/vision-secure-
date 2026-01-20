import { User, Tag } from 'lucide-react';

interface Funcionario {
  id: string;
  nome: string;
  cor: string;
}

interface FuncionarioSelectorProps {
  funcionarios: Funcionario[];
  selectedFuncionarios?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export default function FuncionarioSelector({
  funcionarios,
  selectedFuncionarios = [],
  onSelectionChange = () => {}
}: FuncionarioSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
          Selecione os Funcionários
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Escolha quais funcionários fazem parte deste acerto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funcionarios.map((funcionario) => {
          const isSelected = selectedFuncionarios.includes(funcionario.id);
          
          return (
            <div
              key={funcionario.id}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-md'
                  : 'border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--color-primary)] hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: funcionario.cor }}
                >
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-primary)]">{funcionario.nome}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Tag className="w-3 h-3 text-[var(--text-muted)]" />
                    <p className="text-xs text-[var(--text-muted)]">
                      {isSelected ? 'Selecionado' : 'Clique para selecionar'}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
