import FormComponent from "../FormComponent/FormComponent";
import { criarSegurado, atualizarSegurado } from "../../Services/Segurados";
import { fieldsSegurados } from "./FieldsSegurados";
import type { segurado } from "../../Types/segurados.types";

interface FormSeguradosProps {
  seguradoData?: segurado;
  onSuccess?: () => void;
}

export default function FormSegurados({ seguradoData, onSuccess }: FormSeguradosProps) {
  const isEditing = !!seguradoData;

  const handleSubmit = async (data: any) => {
    try {
      if (isEditing && seguradoData?.name) {
        await atualizarSegurado(seguradoData.name, data);
        alert("Segurado atualizado com sucesso!");
      } else {
        await criarSegurado(data);
        alert("Segurado criado com sucesso!");
      }
      if (onSuccess) onSuccess();
      return true; 
    } catch (error: any) {
      console.error("Erro ao salvar Segurado:", error);
      alert(`Erro ao ${isEditing ? 'atualizar' : 'criar'} segurado. Tente novamente.`);
      throw error;
    }
  };

  return (
    <FormComponent
      campos={fieldsSegurados}
      titulo={isEditing ? "Editar Segurado" : "Cadastro de Segurado"}
      subtitulo={isEditing ? "Atualize os dados do segurado" : "Preencha os dados do segurado para cadastro no sistema"}
      onSubmit={handleSubmit}
      submitButtonText={isEditing ? "Atualizar Segurado" : "Cadastrar Segurado"}
      initialData={seguradoData}
    />
  );
}
