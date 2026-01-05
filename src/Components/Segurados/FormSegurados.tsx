import { useState, useMemo, type FormEvent } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from '@mui/x-date-pickers/locales';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { secoesSegurados } from './FieldsSegurados';

export default function FormSegurados() {
    const [dataNascimento, setDataNascimento] = useState<Dayjs | null>(null);
    
    // Detectar tema atual
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Criar tema MUI adaptado ao tema do sistema
    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? 'dark' : 'light',
                    primary: {
                        main: isDarkMode ? '#3b82f6' : '#2563eb',
                    },
                    background: {
                        paper: isDarkMode ? '#1e293b' : '#ffffff',
                        default: isDarkMode ? '#0f172a' : '#ffffff',
                    },
                    text: {
                        primary: isDarkMode ? '#f8fafc' : '#0f172a',
                        secondary: isDarkMode ? '#cbd5e1' : '#475569',
                    },
                },
            }),
        [isDarkMode]
    );

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formObject: Record<string, string> = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value.toString();
        });
        
        // Adicionar data de nascimento ao objeto
        if (dataNascimento) {
            formObject.dataNascimento = dataNascimento.format('DD/MM/YYYY');
        }
        
        console.log('Dados do Segurado:', formObject);
        
        // Aqui você pode adicionar a lógica para enviar os dados para o backend
        alert('Segurado cadastrado com sucesso!');
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <LocalizationProvider 
                dateAdapter={AdapterDayjs} 
                adapterLocale="pt-br"
                localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
            >
                <div className="w-full max-w-7xl mx-auto p-8">
                    <div className="bg-[var(--bg-card)] rounded-2xl p-8 shadow-[var(--shadow-md)] border border-[var(--border-default)]">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                            Cadastro de Segurado
                        </h1>
                        <p className="text-base text-[var(--text-secondary)] mb-8 leading-relaxed">
                            Preencha os dados do segurado para cadastro no sistema
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {secoesSegurados.map((secao, index) => (
                                <div key={index} className="space-y-6">
                                    <h2 className="text-xl font-bold text-[var(--text-primary)] pb-2 border-b-2 border-[var(--border-default)]">
                                        {secao.title}
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {secao.fields.map((campo) => (
                                            <div 
                                                key={campo.name} 
                                                className={campo.fullWidth ? 'lg:col-span-3 md:col-span-2' : ''}
                                            >
                                                <label 
                                                    htmlFor={campo.name}
                                                    className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
                                                >
                                                    {campo.label}
                                                    {campo.required && <span className="text-red-500 ml-1">*</span>}
                                                </label>
                                                {campo.type === 'date' ? (
                                                    <DatePicker
                                                        value={dataNascimento}
                                                        onChange={(newValue) => setDataNascimento(newValue)}
                                                        format="DD/MM/YYYY"
                                                        slotProps={{
                                                            textField: {
                                                                required: campo.required,
                                                                fullWidth: true,
                                                                placeholder: campo.placeholder,
                                                                sx: {
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: '0.5rem',
                                                                        fontSize: '1rem',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                ) : campo.type === 'select' ? (
                                                    <select
                                                        id={campo.name}
                                                        name={campo.name}
                                                        required={campo.required}
                                                        defaultValue={campo.defaultValue}
                                                        className="w-full px-4 py-3 text-base text-[var(--input-text)] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg transition-all duration-200 focus:outline-none focus:border-[var(--input-border-focus)] focus:ring-4 focus:ring-blue-500/10"
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {campo.options?.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : campo.type === 'textarea' ? (
                                                    <textarea
                                                        id={campo.name}
                                                        name={campo.name}
                                                        placeholder={campo.placeholder}
                                                        required={campo.required}
                                                        defaultValue={campo.defaultValue}
                                                        className="w-full px-4 py-3 text-base text-[var(--input-text)] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg transition-all duration-200 placeholder:text-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-border-focus)] focus:ring-4 focus:ring-blue-500/10 min-h-[120px] resize-y"
                                                    />
                                                ) : (
                                                    <input
                                                        type={campo.type}
                                                        id={campo.name}
                                                        name={campo.name}
                                                        placeholder={campo.placeholder}
                                                        required={campo.required}
                                                        defaultValue={campo.defaultValue}
                                                        className="w-full px-4 py-3 text-base text-[var(--input-text)] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg transition-all duration-200 placeholder:text-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-border-focus)] focus:ring-4 focus:ring-blue-500/10"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                type="submit" 
                                className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 mt-8"
                            >
                                Cadastrar Segurado
                            </button>
                        </form>
                    </div>
                </div>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
