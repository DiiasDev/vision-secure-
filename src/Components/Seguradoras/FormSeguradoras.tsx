import type { FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { secoesSeguradoras } from './FeldsSeguradoras';

export default function FormSeguradoras() {
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formObject: Record<string, string> = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value.toString();
        });
        
        console.log('Dados da Seguradora:', formObject);
        
        // Aqui você pode adicionar a lógica para enviar os dados para o backend
        alert('Seguradora cadastrada com sucesso!');
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-8">
            <div className="bg-[var(--bg-card)] rounded-2xl p-8 shadow-[var(--shadow-md)] border border-[var(--border-default)]">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    Cadastrar Nova Seguradora
                </h1>
                <p className="text-base text-[var(--text-secondary)] mb-8 leading-relaxed">
                    Preencha os dados abaixo para registrar uma nova seguradora no sistema
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {secoesSeguradoras.map((secao, index) => (
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
                                        
                                        {campo.type === 'select' ? (
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
                                        ) : campo.type === 'file' ? (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id={campo.name}
                                                    name={campo.name}
                                                    accept={campo.accept}
                                                    required={campo.required}
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const label = document.getElementById(`${campo.name}-label`);
                                                        if (label && e.target.files?.[0]) {
                                                            label.textContent = e.target.files[0].name;
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={campo.name}
                                                    className="w-full px-4 py-3 text-base text-[var(--input-text)] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg transition-all duration-200 focus-within:border-[var(--input-border-focus)] focus-within:ring-4 focus-within:ring-blue-500/10 cursor-pointer hover:border-[var(--color-primary)] flex items-center gap-3 group"
                                                >
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] group-hover:from-[var(--color-primary-hover)] group-hover:to-[var(--color-accent-dark)] transition-all duration-200 shadow-md flex-shrink-0">
                                                        <Upload className="w-5 h-5 text-white" strokeWidth={2.5} />
                                                    </div>
                                                    <span id={`${campo.name}-label`} className="text-[var(--input-placeholder)] group-hover:text-[var(--color-primary)] transition-colors">
                                                        Nenhum arquivo escolhido
                                                    </span>
                                                </label>
                                            </div>
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
                        className="w-full px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0"
                    >
                        Cadastrar Seguradora
                    </button>
                </form>
            </div>
        </div>
    );
}
