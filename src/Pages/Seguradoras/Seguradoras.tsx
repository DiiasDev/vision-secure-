import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import FormSeguradoras from '../../Components/Seguradoras/FormSeguradoras';
import ListaSeguradoras from '../../Components/Seguradoras/ListaSeguradoras';
import type { seguradora } from '../../Types/seguradoras.types';

interface SeguradorasProps {
    initialTab?: number;
}

export default function Seguradoras({ initialTab = 0 }: SeguradorasProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [editingSeguradora, setEditingSeguradora] = useState<seguradora | undefined>(undefined);
    const [refreshList, setRefreshList] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setEditingSeguradora(undefined); // Clear editing state when switching tabs
        // Atualizar a URL quando a tab mudar
        if (newValue === 0) {
            navigate('/seguradoras/listar');
        } else if (newValue === 1) {
            navigate('/seguradoras/criar');
        }
    };

    const handleEdit = (seguradora: seguradora) => {
        setEditingSeguradora(seguradora);
        setActiveTab(1); // Switch to form tab
        navigate('/seguradoras/criar');
    };

    const handleFormSuccess = () => {
        setEditingSeguradora(undefined);
        setActiveTab(0); // Switch back to list tab
        navigate('/seguradoras/listar');
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
                    <Tab icon={<ListIcon />} iconPosition="start" label="Listar Seguradoras" />
                    <Tab icon={<AddIcon />} iconPosition="start" label={editingSeguradora ? "Editar Seguradora" : "Cadastrar Seguradora"} />
                </Tabs>
            </Box>

            <Box sx={{ p: 0 }}>
                {activeTab === 0 && <ListaSeguradoras key={refreshList} onEdit={handleEdit} />}
                {activeTab === 1 && (
                    <div className="p-6">
                        <FormSeguradoras 
                            seguradoraData={editingSeguradora}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                )}
            </Box>
        </div>
    );
}
