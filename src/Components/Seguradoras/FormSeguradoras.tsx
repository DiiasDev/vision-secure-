import FormComponent from "../FormComponent/FormComponent";
import { fieldsSeguradoras } from "./FeldsSeguradoras";
import { newSeguradora } from "../../Services/Seguradoras";

export default function FormSeguradoras() {
  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados da Seguradora:", data);
      newSeguradora(data);
      alert("Seguradora cadastrada com sucesso!");
      return true; 
    } catch (error: any) {
      console.error("Erro ao criar Seguradora:", error);
      alert("Erro ao criar seguradora. Tente novamente.");
      throw error; 
    }
  };

  return (
    <FormComponent
      campos={fieldsSeguradoras}
      titulo="Cadastrar Nova Seguradora"
      subtitulo="Preencha os dados abaixo para registrar uma nova seguradora no sistema"
      onSubmit={handleSubmit}
      submitButtonText="Cadastrar Seguradora"
    />
  );
}
