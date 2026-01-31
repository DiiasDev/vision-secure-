import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Backups from "../Financeiro/Backups";
import Metas from "../Financeiro/Metas";

export default function Configuracoes() {
  const [tab, setTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box className="p-6 w-full">
      <Tabs
        value={tab}
        onChange={handleChange}
        aria-label="Configurações Tabs"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Tab label="Backups" />
        <Tab label="Metas" />
      </Tabs>
      <Box>
        {tab === 0 && <Backups />}
        {tab === 1 && <Metas />}
      </Box>
    </Box>
  );
}
