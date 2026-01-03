import type { StatCardProps } from './types';

export function StatCard({ count, label, color, IconComponent }: StatCardProps) {
  const colorClasses = {
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-lg px-5 py-4 transition-shadow duration-200 hover:shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-semibold ${colors.text} mb-1`}>
            {count}
          </div>
          <div className={`text-xs font-medium ${colors.text} opacity-75`}>
            {label}
          </div>
        </div>
        <div
          className={`${colors.iconBg} w-12 h-12 rounded-lg flex items-center justify-center`}
        >
          <IconComponent className={`${colors.iconColor} w-6 h-6`} />
        </div>
      </div>
    </div>
  );
}
