import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import FormSeguradoras from '../../Components/Seguradoras/FormSeguradoras';
import ListaSeguradoras from '../../Components/Seguradoras/ListaSeguradoras';

interface SeguradorasProps {
    initialTab?: number;
}

export default function Seguradoras({ initialTab = 0 }: SeguradorasProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        // Atualizar a URL quando a tab mudar
        if (newValue === 0) {
            navigate('/seguradoras/listar');
        } else if (newValue === 1) {
            navigate('/seguradoras/criar');
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
                    <Tab icon={<ListIcon />} iconPosition="start" label="Listar Seguradoras" />
                    <Tab icon={<AddIcon />} iconPosition="start" label="Cadastrar Seguradora" />
                </Tabs>
            </Box>

            <Box sx={{ p: 0 }}>
                {activeTab === 0 && <ListaSeguradoras />}
                {activeTab === 1 && (
                    <div className="p-6">
                        <FormSeguradoras />
                    </div>
                )}
            </Box>
        </div>
    );
}
