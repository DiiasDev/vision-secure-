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
        <section className="form-section">
            {sessao && <h2 className="session-title">{sessao}</h2>}
            
            <div className="form-container">
                <h1 className="form-title">{titulo}</h1>
                {subtitulo && <p className="form-subtitle">{subtitulo}</p>}
                
                <form onSubmit={handleSubmit}>
                    {campos.map((campo) => (
                        <div key={campo.name} className="form-field">
                            <label htmlFor={campo.name}>{campo.label}</label>
                            {campo.type === 'textarea' ? (
                                <textarea
                                    id={campo.name}
                                    name={campo.name}
                                    placeholder={campo.placeholder}
                                    required={campo.required}
                                    defaultValue={campo.defaultValue}
                                />
                            ) : (
                                <input
                                    type={campo.type}
                                    id={campo.name}
                                    name={campo.name}
                                    placeholder={campo.placeholder}
                                    required={campo.required}
                                    defaultValue={campo.defaultValue}
                                />
                            )}
                        </div>
                    ))}
                    
                    <button type="submit" className="submit-button">
                        {submitButtonText}
                    </button>
                </form>
            </div>
        </section>
    );
}

