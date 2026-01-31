import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import GestaoFinanceira from "../../Components/GestãoFinanceira/gestãoFinanceira";
import GestaoMetas from "../../Components/GestãoFinanceira/GestaoMetas";
import Acerto from "../../Components/GestãoFinanceira/Acerto";
import Backup from "../../Components/GestãoFinanceira/Backup";
import Relatorios from "../../Components/GestãoFinanceira/Relatorios";

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
          <Tab label="Relatórios" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && <GestaoFinanceira />}
        {activeTab === 1 && <Acerto />}
        {activeTab === 4 && <Relatorios />}
      </Box>
    </Box>
  );
}