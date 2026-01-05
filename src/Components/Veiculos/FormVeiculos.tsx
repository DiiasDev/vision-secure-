import type { FormEvent } from 'react';
import { secoesVeiculos } from './FieldsVeiculos';

export default function FormVeiculos() {
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formObject: Record<string, string> = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value.toString();
        });
        
        console.log('Dados do Veículo:', formObject);
        
        // Aqui você pode adicionar a lógica para enviar os dados para o backend
        alert('Veículo cadastrado com sucesso!');
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-8">
            <div className="bg-[var(--bg-card)] rounded-2xl p-8 shadow-[var(--shadow-md)] border border-[var(--border-default)]">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    Cadastro de Veículo
                </h1>
                <p className="text-base text-[var(--text-secondary)] mb-8 leading-relaxed">
                    Preencha os dados do veículo para cadastro no sistema
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {secoesVeiculos.map((secao, index) => (
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
                        Cadastrar Veículo
                    </button>
                </form>
            </div>
        </div>
    );
}
