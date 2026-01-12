import FormComponent from "../FormComponent/FormComponent";
import { camposCorretores } from "./FieldsCorretores";
import { newCorretor, atualizarCorretor } from "../../Services/corretores";
import type { corretor } from "../../Types/corretores.types";

interface FormCorretoresProps {
    corretorData?: corretor;
    onSuccess?: () => void;
}

export default function FormCorretores({ corretorData, onSuccess }: FormCorretoresProps) {
    const isEditing = !!corretorData;

    const handleSubmit = async (data: any) => {
        try {
            console.log('Dados do Corretor:', data);
            if (isEditing && corretorData?.name) {
                await atualizarCorretor(corretorData.name, data);
                alert('Corretor atualizado com sucesso!');
            } else {
                await newCorretor(data);
                alert('Corretor cadastrado com sucesso!');
            }
            if (onSuccess) onSuccess();
            return true;
        } catch (error: any) {
            console.error('Erro ao salvar Corretor:', error);
            alert(`Erro ao ${isEditing ? 'atualizar' : 'criar'} corretor. Tente novamente.`);
            throw error;
        }
    };

    return (
        <FormComponent
            campos={camposCorretores}
            titulo={isEditing ? "Editar Corretor" : "Cadastro de Corretor"}
            subtitulo={isEditing ? "Atualize os dados do corretor" : "Preencha os dados do corretor para cadastro no sistema"}
            onSubmit={handleSubmit}
            submitButtonText={isEditing ? "Atualizar Corretor" : "Cadastrar Corretor"}
            initialData={corretorData}
        />
    );
}
