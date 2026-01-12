import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import FormSeguros from '../../Components/Seguros/FormSeguros';
import ListaSeguros from '../../Components/Seguros/ListaSeguros';
import type { seguro } from '../../Types/seguros.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`seguro-tabpanel-${index}`}
      aria-labelledby={`seguro-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

interface SegurosProps {
  initialTab?: number;
}

export default function Seguros({ initialTab = 0 }: SegurosProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [editingSeguro, setEditingSeguro] = useState<seguro | null>(null);
  const [refreshList, setRefreshList] = useState(0);
  
  // Determinar o valor atual do tab baseado na rota
  const currentTab = location.pathname === '/seguros/criar' ? 1 : 0;

  // Sincronizar a rota quando o componente montar
  useEffect(() => {
    if (initialTab === 1 && location.pathname !== '/seguros/criar') {
      navigate('/seguros/criar', { replace: true });
    } else if (initialTab === 0 && location.pathname !== '/seguros/listar') {
      navigate('/seguros/listar', { replace: true });
    }
  }, [initialTab, location.pathname, navigate]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      setEditingSeguro(null);
      navigate('/seguros/listar');
    } else {
      navigate('/seguros/criar');
    }
  };

  const handleEdit = (seguro: seguro) => {
    setEditingSeguro(seguro);
    navigate('/seguros/criar');
  };

  const handleFormSuccess = () => {
    setEditingSeguro(null);
    setRefreshList(prev => prev + 1);
    navigate('/seguros/listar');
  };

  return (
    <div>
      <Box 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'var(--border-default)',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <Tabs 
          value={currentTab} 
          onChange={handleChange} 
          aria-label="seguros tabs"
          sx={{
            '& .MuiTab-root': {
              color: 'var(--text-secondary)',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              minHeight: '48px',
              '&.Mui-selected': {
                color: 'var(--color-primary)',
              },
              '&:hover': {
                color: 'var(--text-primary)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary)',
              height: '3px',
            },
          }}
        >
          <Tab label="Lista de Seguros" />
          <Tab label={editingSeguro ? "Editar Seguro" : "Cadastrar Seguro"} />
        </Tabs>
      </Box>
      <TabPanel value={currentTab} index={0}>
        <ListaSeguros key={refreshList} onEdit={handleEdit} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <FormSeguros initialData={editingSeguro} onSuccess={handleFormSuccess} />
      </TabPanel>
    </div>
  );
}
