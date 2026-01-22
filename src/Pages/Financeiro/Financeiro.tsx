import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import GestaoFinanceira from "../../Components/GestãoFinanceira/gestãoFinanceira";
import GestaoMetas from "../../Components/GestãoFinanceira/GestaoMetas";

export default function Financeiro() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh' }}>
      {/* Tabs Navigation */}
      <Box 
        sx={{ 
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-default)',
          px: 3,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'var(--text-secondary)',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '1rem',
              minHeight: 56,
              '&.Mui-selected': {
                color: 'var(--color-primary)',
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary)',
              height: 3
            }
          }}
        >
          <Tab label="Dashboard Financeiro" />
          <Tab label="Acerto" />
          <Tab label="Comissões" />
          <Tab label="Metas" />
          <Tab label="Relatórios" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && <GestaoFinanceira />}
        {activeTab === 1 && (
          <Box className="p-6">
            <Box sx={{ color: 'var(--text-primary)' }}>
              Conteúdo de Acerto (a ser implementado)
            </Box>
          </Box>
        )}
        {activeTab === 2 && (
          <Box className="p-6">
            <Box sx={{ color: 'var(--text-primary)' }}>
              Conteúdo de Comissões (a ser implementado)
            </Box>
          </Box>
        )}
        {activeTab === 3 && <GestaoMetas />}
        {activeTab === 4 && (
          <Box className="p-6">
            <Box sx={{ color: 'var(--text-primary)' }}>
              Conteúdo de Relatórios (a ser implementado)
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}