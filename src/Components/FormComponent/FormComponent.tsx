import type { FormEvent } from 'react';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea';
    placeholder?: string;
    required?: boolean;
    defaultValue?: string;
}

interface FormComponentProps {
    campos: FormField[];
    titulo: string;
    subtitulo?: string;
    sessao?: string;
    onSubmit: (data: FormData) => void;
    submitButtonText?: string;
}

export default function FormComponent({
    campos,
    titulo,
    subtitulo,
    sessao,
    onSubmit,
    submitButtonText = 'Enviar'
}: FormComponentProps) {
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);
    };

    return (
        <section className="w-full max-w-4xl mx-auto p-8">
            {sessao && (
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 pb-3 border-b-2 border-[var(--color-primary)]">
                    {sessao}
                </h2>
            )}
            
            <div className="bg-[var(--bg-card)] rounded-2xl p-8 shadow-[var(--shadow-md)] border border-[var(--border-default)]">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {titulo}
                </h1>
                {subtitulo && (
                    <p className="text-base text-[var(--text-secondary)] mb-8 leading-relaxed">
                        {subtitulo}
                    </p>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campos.map((campo) => (
                            <div 
                                key={campo.name} 
                                className={campo.type === 'textarea' ? 'md:col-span-2' : ''}
                            >
                                <label 
                                    htmlFor={campo.name}
                                    className="block text-sm font-semibold text-[var(--text-primary)] mb-2"
                                >
                                    {campo.label}
                                    {campo.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {campo.type === 'textarea' ? (
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
                    
                    <button 
                        type="submit" 
                        className="w-full px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 mt-8"
                    >
                        {submitButtonText}
                    </button>
                </form>
            </div>
        </section>
    );
}

