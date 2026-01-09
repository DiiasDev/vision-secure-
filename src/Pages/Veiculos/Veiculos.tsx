import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import FormVeiculos from '../../Components/Veiculos/FormVeiculos';
import ListaVeiculos from '../../Components/Veiculos/ListaVeiculos';

interface VeiculosProps {
    initialTab?: number;
}

export default function Veiculos({ initialTab = 0 }: VeiculosProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        // Atualizar a URL quando a tab mudar
        if (newValue === 0) {
            navigate('/veiculos/listar');
        } else if (newValue === 1) {
            navigate('/veiculos/criar');
        }
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
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        px: 3,
                        '& .MuiTab-root': {
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.9375rem',
                            minHeight: '56px',
                            '&.Mui-selected': {
                                color: 'var(--color-primary)',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--color-primary)',
                        },
                    }}
                >
                    <Tab icon={<ListIcon />} iconPosition="start" label="Listar Veículos" />
                    <Tab icon={<AddIcon />} iconPosition="start" label="Cadastrar Veículo" />
                </Tabs>
            </Box>

            <Box sx={{ p: 0 }}>
                {activeTab === 0 && <ListaVeiculos />}
                {activeTab === 1 && (
                    <div className="p-6">
                        <FormVeiculos />
                    </div>
                )}
            </Box>
        </div>
    );
}
