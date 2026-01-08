import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { PersonAdd as PersonAddIcon, List as ListIcon } from '@mui/icons-material';
import FormSegurados from '../../Components/Segurados/FormSegurados';
import ListarSegurados from '../../Components/Seguros/ListaSegurados';

interface SeguradosProps {
    initialTab?: number;
}

export default function Segurados({ initialTab = 0 }: SeguradosProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        // Atualizar a URL quando a tab mudar
        if (newValue === 0) {
            navigate('/segurados/listar');
        } else if (newValue === 1) {
            navigate('/segurados/criar');
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
                    <Tab icon={<ListIcon />} iconPosition="start" label="Listar Segurados" />
                    <Tab icon={<PersonAddIcon />} iconPosition="start" label="Cadastrar Segurado" />
                </Tabs>
            </Box>

            <Box sx={{ p: 0 }}>
                {activeTab === 0 && <ListarSegurados />}
                {activeTab === 1 && (
                    <div className="p-6">
                        <FormSegurados />
                    </div>
                )}
            </Box>
        </div>
    );
}
