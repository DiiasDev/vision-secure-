import { useState } from 'react';
import './Dashboard.css';
import { StatCard, FilterBar, ClientTable } from '../../Components/Dashboards';
import type { ClientData } from '../../Components/Dashboards';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentIcon from '@mui/icons-material/Assignment';

const mockData: ClientData[] = [
  {
    id: 1,
    name: 'Gabriel Dias',
    code: '6dc-2534',
    phone: '(19) 99329-2661',
    insuranceType: 'Auto',
    vehicleModel: 'Toyota Corolla',
    policyNumber: 'ABC-1234',
    insuranceCompany: 'Porto Seguros',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Porto_Seguro_logo.svg/512px-Porto_Seguro_logo.svg.png',
    dueDate: '15/06/2026',
    paymentStatus: 'paid',
    broker: 'Carlos Silva',
    plate: 'ABC-1234',
    cpf: '123.456.789-00',
    notes: 'Cliente quer renovar com as mesmas coberturas, prefere trocar de carro em junho',
    avatar: '👨',
  },
  {
    id: 2,
    name: 'Maria Souza',
    code: '7ab-8921',
    phone: '(19) 99329-2661',
    insuranceType: 'Transporte',
    policyNumber: 'XYZ-5678',
    insuranceCompany: 'Allianz',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Allianz_logo.svg/512px-Allianz_logo.svg.png',
    dueDate: '02/06/2026',
    paymentStatus: 'pending',
    broker: 'Ana Paula',
    cpf: '987.654.321-00',
    notes: 'Cliente solicitou orçamento para expansão de cobertura',
    avatar: '👩',
  },
  {
    id: 3,
    name: 'Pedro Lima',
    code: '5cd-1122',
    phone: '(11) 5679-1543',
    insuranceType: 'Auto',
    vehicleModel: 'Honda Civic',
    policyNumber: 'DEF-9012',
    insuranceCompany: 'Bradesco',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Bradesco_logo.svg/512px-Bradesco_logo.svg.png',
    dueDate: '20/06/2026',
    paymentStatus: 'paid',
    broker: 'Carlos Silva',
    plate: 'XYZ-7890',
    cpf: '456.789.123-00',
    notes: 'Veículo recém adquirido, primeira apólice',
    avatar: '👨',
  },
  {
    id: 4,
    name: 'Ana Carvalho',
    code: '9ef-3344',
    phone: '(11) 90765-2350',
    insuranceType: 'Transporte',
    policyNumber: 'GHI-3456',
    insuranceCompany: 'MAPFRE',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Mapfre_logo.svg/512px-Mapfre_logo.svg.png',
    dueDate: '10/06/2026',
    paymentStatus: 'pending',
    broker: 'Ana Paula',
    cpf: '321.654.987-00',
    notes: 'Aguardando documentação para renovação',
    avatar: '👩',
  },
  {
    id: 5,
    name: 'Ricardo Santos',
    code: '2gh-5566',
    phone: '(11) 90572-2257',
    insuranceType: 'Auto',
    vehicleModel: 'Volkswagen Polo',
    policyNumber: 'JKL-7890',
    insuranceCompany: 'Tokio Marine',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Tokio_Marine_logo.svg/512px-Tokio_Marine_logo.svg.png',
    dueDate: '05/05/2026',
    paymentStatus: 'overdue',
    broker: 'Roberto Lima',
    plate: 'LMN-4567',
    cpf: '789.123.456-00',
    notes: 'Cliente não respondeu às tentativas de contato',
    avatar: '👨',
  },
  {
    id: 6,
    name: 'Juliana Costa',
    code: '3kl-7788',
    phone: '(11) 91234-5678',
    insuranceType: 'Auto',
    vehicleModel: 'Fiat Argo',
    policyNumber: 'MNO-2345',
    insuranceCompany: 'Liberty Seguros',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Liberty_Mutual_logo.svg/512px-Liberty_Mutual_logo.svg.png',
    dueDate: '28/01/2026',
    paymentStatus: 'overdue',
    broker: 'Carlos Silva',
    plate: 'DEF-3456',
    cpf: '159.753.486-00',
    notes: 'Cliente com histórico de renovação regular, prefere contato por WhatsApp',
    avatar: '👩',
  },
  {
    id: 7,
    name: 'Fernando Oliveira',
    code: '4mn-9900',
    phone: '(11) 98765-4321',
    insuranceType: 'Transporte',
    policyNumber: 'PQR-6789',
    insuranceCompany: 'Azul Seguros',
    insuranceCompanyLogo: 'https://via.placeholder.com/100/0066CC/FFFFFF?text=AZUL',
    dueDate: '18/02/2026',
    paymentStatus: 'pending',
    broker: 'Ana Paula',
    cpf: '753.951.852-00',
    notes: 'Empresa de logística, necessita cobertura para frota completa',
    avatar: '👨',
  },
  {
    id: 8,
    name: 'Carla Mendonça',
    code: '5op-1122',
    phone: '(11) 97654-3210',
    insuranceType: 'Auto',
    vehicleModel: 'Chevrolet Onix',
    policyNumber: 'STU-9012',
    insuranceCompany: 'Porto Seguros',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Porto_Seguro_logo.svg/512px-Porto_Seguro_logo.svg.png',
    dueDate: '10/03/2026',
    paymentStatus: 'paid',
    broker: 'Roberto Lima',
    plate: 'GHI-7890',
    cpf: '852.963.741-00',
    notes: 'Cliente satisfeito com o atendimento, indicou 2 novos clientes',
    avatar: '👩',
  },
  {
    id: 9,
    name: 'Marcos Silva',
    code: '6pq-3344',
    phone: '(19) 99329-2661',
    insuranceType: 'Vida',
    policyNumber: 'VID-1001',
    insuranceCompany: 'SulAmérica',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/SulAm%C3%A9rica_logo.svg/512px-SulAm%C3%A9rica_logo.svg.png',
    dueDate: '10/01/2026',
    paymentStatus: 'pending',
    broker: 'Carlos Silva',
    cpf: '147.258.369-00',
    notes: 'Seguro de vida com cobertura para invalidez e doenças graves',
    avatar: '👨',
  },
  {
    id: 10,
    name: 'Patricia Alves',
    code: '7rs-5566',
    phone: '(11) 99999-8765',
    insuranceType: 'Vida',
    policyNumber: 'VID-1002',
    insuranceCompany: 'Bradesco',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Bradesco_logo.svg/512px-Bradesco_logo.svg.png',
    dueDate: '15/01/2026',
    paymentStatus: 'pending',
    broker: 'Ana Paula',
    cpf: '258.369.147-00',
    notes: 'Cliente solicitou aumento de cobertura recentemente',
    avatar: '👩',
  },
  {
    id: 11,
    name: 'Roberto Ferreira',
    code: '8tu-7788',
    phone: '(11) 97777-4321',
    insuranceType: 'Vida',
    policyNumber: 'VID-1003',
    insuranceCompany: 'Porto Seguros',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Porto_Seguro_logo.svg/512px-Porto_Seguro_logo.svg.png',
    dueDate: '05/01/2026',
    paymentStatus: 'overdue',
    broker: 'Roberto Lima',
    cpf: '369.147.258-00',
    notes: 'Pagamento atrasado, enviar lembrete urgente',
    avatar: '👨',
  },
  {
    id: 12,
    name: 'Camila Rodrigues',
    code: '9vw-9900',
    phone: '(19) 99329-2661',
    insuranceType: 'Vida',
    policyNumber: 'VID-1004',
    insuranceCompany: 'MAPFRE',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Mapfre_logo.svg/512px-Mapfre_logo.svg.png',
    dueDate: '03/01/2026',
    paymentStatus: 'overdue',
    broker: 'Ana Paula',
    cpf: '741.852.963-00',
    notes: 'Cliente solicitou parcelamento do valor em atraso',
    avatar: '👩',
  },
  {
    id: 13,
    name: 'Lucas Martins',
    code: '1xy-2211',
    phone: '(11) 95555-3333',
    insuranceType: 'Vida',
    policyNumber: 'VID-1005',
    insuranceCompany: 'Allianz',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Allianz_logo.svg/512px-Allianz_logo.svg.png',
    dueDate: '20/01/2026',
    paymentStatus: 'paid',
    broker: 'Carlos Silva',
    cpf: '951.753.852-00',
    notes: 'Pagamento antecipado, cliente preferencial',
    avatar: '👨',
  },
  {
    id: 14,
    name: 'Fernanda Costa',
    code: '2za-4433',
    phone: '(19) 99329-2661',
    insuranceType: 'Vida',
    policyNumber: 'VID-1006',
    insuranceCompany: 'Liberty Seguros',
    insuranceCompanyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Liberty_Mutual_logo.svg/512px-Liberty_Mutual_logo.svg.png',
    dueDate: '25/01/2026',
    paymentStatus: 'paid',
    broker: 'Roberto Lima',
    cpf: '357.159.753-00',
    notes: 'Renovação automática ativada',
    avatar: '👩',
  },
];

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'expiring'>('all');
  const itemsPerPage = 5;

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (newFilter: 'all' | 'expiring') => {
    setFilter(newFilter);
    setPage(1); // Reset para página 1 quando mudar o filtro
  };

  const filteredData = filter === 'expiring' 
    ? mockData.filter(item => item.paymentStatus !== 'paid')
    : mockData;

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Calcular estatísticas
  const expiring30Days = mockData.filter(item => {
    const dueDate = new Date(item.dueDate.split('/').reverse().join('-'));
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 15;
  }).length;

  const expiring15Days = mockData.filter(item => {
    const dueDate = new Date(item.dueDate.split('/').reverse().join('-'));
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 15 && diffDays > 5;
  }).length;

  const expiring5Days = mockData.filter(item => {
    const dueDate = new Date(item.dueDate.split('/').reverse().join('-'));
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  }).length;

  return (
    <div className="min-h-screen p-8 pb-24" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Olá, Valdir! Confira os vencimentos próximos:
        </h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            count={expiring30Days}
            label="Seguros Vencem em 30 Dias"
            color="orange"
            IconComponent={CalendarMonthIcon}
          />
          <StatCard
            count={expiring15Days}
            label="Vencem em 15 Dias"
            color="amber"
            IconComponent={AccessTimeIcon}
          />
          <StatCard
            count={expiring5Days}
            label="Vence em 5 Dias"
            color="red"
            IconComponent={NotificationsActiveIcon}
          />
        </div>
      </div>

      {/* Table Section */}
      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <AssignmentIcon sx={{ fontSize: 24, color: 'var(--color-primary)' }} />
            Lista de Clientes e Seguros
          </h2>
          <FilterBar filter={filter} onFilterChange={handleFilterChange} />
        </div>

        <ClientTable
          data={paginatedData}
          page={page}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}