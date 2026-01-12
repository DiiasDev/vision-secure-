import FormComponent from "../FormComponent/FormComponent";
import { fieldsSeguradoras } from "./FeldsSeguradoras";
import { newSeguradora, atualizarSeguradora } from "../../Services/Seguradoras";
import type { seguradora } from "../../Types/seguradoras.types";

interface FormSeguradorasProps {
  seguradoraData?: seguradora;
  onSuccess?: () => void;
}

export default function FormSeguradoras({ seguradoraData, onSuccess }: FormSeguradorasProps) {
  const isEditing = !!seguradoraData;

  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados da Seguradora:", data);
      if (isEditing && seguradoraData?.name) {
        await atualizarSeguradora(seguradoraData.name, data);
        alert("Seguradora atualizada com sucesso!");
      } else {
        await newSeguradora(data);
        alert("Seguradora cadastrada com sucesso!");
      }
      if (onSuccess) onSuccess();
      return true; 
    } catch (error: any) {
      console.error("Erro ao salvar Seguradora:", error);
      alert(`Erro ao ${isEditing ? 'atualizar' : 'criar'} seguradora. Tente novamente.`);
      throw error; 
    }
  };

  return (
    <FormComponent
      campos={fieldsSeguradoras}
      titulo={isEditing ? "Editar Seguradora" : "Cadastrar Nova Seguradora"}
      subtitulo={isEditing ? "Atualize os dados da seguradora" : "Preencha os dados abaixo para registrar uma nova seguradora no sistema"}
      onSubmit={handleSubmit}
      submitButtonText={isEditing ? "Atualizar Seguradora" : "Cadastrar Seguradora"}
      initialData={seguradoraData}
    />
  );
}
