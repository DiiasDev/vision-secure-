import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import FormCorretores from '../../Components/Corretores/FormCorretores';
import ListaCorretores from '../../Components/Corretores/ListaCorretores';
import type { corretor } from '../../Types/corretores.types';

interface CorretoresProps {
    initialTab?: number;
}

export default function Corretores({ initialTab = 0 }: CorretoresProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [editingCorretor, setEditingCorretor] = useState<corretor | undefined>(undefined);
    const [refreshList, setRefreshList] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setEditingCorretor(undefined); // Clear editing state when switching tabs
        // Atualizar a URL quando a tab mudar
        if (newValue === 0) {
            navigate('/corretores/listar');
        } else if (newValue === 1) {
            navigate('/corretores/criar');
        }
    };

    const handleEdit = (corretor: corretor) => {
        setEditingCorretor(corretor);
        setActiveTab(1); // Switch to form tab
        navigate('/corretores/criar');
    };

    const handleFormSuccess = () => {
        setEditingCorretor(undefined);
        setActiveTab(0); // Switch back to list tab
        navigate('/corretores/listar');
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
                    <Tab icon={<ListIcon />} iconPosition="start" label="Listar Corretores" />
                    <Tab icon={<AddIcon />} iconPosition="start" label={editingCorretor ? "Editar Corretor" : "Cadastrar Corretor"} />
                </Tabs>
            </Box>

            <Box sx={{ p: 0 }}>
                {activeTab === 0 && <ListaCorretores key={refreshList} onEdit={handleEdit} />}
                {activeTab === 1 && (
                    <div className="p-6">
                        <FormCorretores 
                            corretorData={editingCorretor}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                )}
            </Box>
        </div>
    );
}
