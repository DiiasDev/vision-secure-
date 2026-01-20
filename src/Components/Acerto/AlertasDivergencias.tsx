import { AlertTriangle, Info, X } from 'lucide-react';

interface Alerta {
  tipo: 'warning' | 'info' | 'error';
  titulo: string;
  mensagem: string;
}

interface AlertasDivergenciasProps {
  alertas: Alerta[];
  onDismiss?: (index: number) => void;
}

export default function AlertasDivergencias({ alertas, onDismiss = () => {} }: AlertasDivergenciasProps) {
  if (alertas.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
          Alertas e Divergências
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Revise os avisos antes de continuar
        </p>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta, index) => {
          const config = {
            warning: {
              bgColor: 'bg-orange-50',
              borderColor: 'border-orange-200',
              iconColor: 'text-orange-600',
              textColor: 'text-orange-800',
              icon: AlertTriangle
            },
            info: {
              bgColor: 'bg-blue-50',
              borderColor: 'border-blue-200',
              iconColor: 'text-blue-600',
              textColor: 'text-blue-800',
              icon: Info
            },
            error: {
              bgColor: 'bg-red-50',
              borderColor: 'border-red-200',
              iconColor: 'text-red-600',
              textColor: 'text-red-800',
              icon: AlertTriangle
            }
          }[alerta.tipo];

          const Icon = config.icon;

          return (
            <div
              key={index}
              className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-r-lg flex items-start space-x-3`}
            >
              <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <h4 className={`font-semibold ${config.textColor} mb-1`}>{alerta.titulo}</h4>
                <p className={`text-sm ${config.textColor} opacity-90`}>{alerta.mensagem}</p>
              </div>
              <button
                onClick={() => onDismiss(index)}
                className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors flex-shrink-0"
              >
                <X className={`w-4 h-4 ${config.iconColor}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
