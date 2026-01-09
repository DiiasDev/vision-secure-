import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import FormSeguros from '../../Components/Seguros/FormSeguros';
import ListaSeguros from '../../Components/Seguros/ListaSeguros';

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
  const [value, setValue] = useState(initialTab);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
          value={value} 
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
          <Tab label="Cadastrar Seguro" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ListaSeguros />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FormSeguros />
      </TabPanel>
    </div>
  );
}
