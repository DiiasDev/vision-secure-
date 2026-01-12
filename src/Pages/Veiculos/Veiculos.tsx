import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import FormVeiculos from '../../Components/Veiculos/FormVeiculos';
import ListaVeiculos from '../../Components/Veiculos/ListaVeiculos';
import type { veiculo } from '../../Types/veiculos.types';

interface VeiculosProps {
    initialTab?: number;
}

export default function Veiculos({ initialTab = 0 }: VeiculosProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [editingVeiculo, setEditingVeiculo] = useState<veiculo | undefined>(undefined);
    const [refreshList, setRefreshList] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setEditingVeiculo(undefined); // Clear editing state when switching tabs
        // Atualizar a URL quando a tab mudar
        if (newValue === 0) {
            navigate('/veiculos/listar');
        } else if (newValue === 1) {
            navigate('/veiculos/criar');
        }
    };

    const handleEdit = (veiculo: veiculo) => {
        setEditingVeiculo(veiculo);
        setActiveTab(1); // Switch to form tab
        navigate('/veiculos/criar');
    };

    const handleFormSuccess = () => {
        setEditingVeiculo(undefined);
        setActiveTab(0); // Switch back to list tab
        navigate('/veiculos/listar');
        setRefreshList(prev => prev + 1); // Trigger list refresh
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
                    <Tab icon={<AddIcon />} iconPosition="start" label={editingVeiculo ? "Editar Veículo" : "Cadastrar Veículo"} />
                </Tabs>
            </Box>

            <Box sx={{ p: 0 }}>
                {activeTab === 0 && <ListaVeiculos key={refreshList} onEdit={handleEdit} />}
                {activeTab === 1 && (
                    <div className="p-6">
                        <FormVeiculos 
                            veiculoData={editingVeiculo}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                )}
            </Box>
        </div>
    );
}
