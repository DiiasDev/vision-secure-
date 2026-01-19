export interface ClientData {
  id: number;
  name: string;
  code: string;
  phone: string;
  insuranceType: string;
  vehicleModel?: string;
  policyNumber: string;
  insuranceCompany: string;
  insuranceCompanyLogo: string;
  dueDate: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  broker: string;
  plate?: string;
  cpf: string;
  notes: string;
  avatar: string;
}

export interface StatCardProps {
  count: number;
  label: string;
  color: 'orange' | 'amber' | 'red';
  IconComponent: React.ComponentType<{ className?: string }>;
}

export interface FilterBarProps {
  filter: 'all' | 'expiring';
  onFilterChange: (filter: 'all' | 'expiring') => void;
  totalAll: number;
  totalExpiring: number;
}
