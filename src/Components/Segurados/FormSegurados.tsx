import FormComponent from "../FormComponent/FormComponent";
import { criarSegurado } from "../../Services/Segurados";
import { fieldsSegurados } from "./FieldsSegurados";



export default function FormSegurados() {
  const handleSubmit = async (data: any) => {
    try {
      await criarSegurado(data);
      alert("Segurado Criado Com Sucesso");
      return true; 
    } catch (error: any) {
      console.error("Erro ao criar Segurado:", error);
      alert("Erro ao criar segurado. Tente novamente.");
      throw error;
    }
  };

  return (
    <FormComponent
      campos={fieldsSegurados}
      titulo="Cadastro de Segurado"
      subtitulo="Preencha os dados do segurado para cadastro no sistema"
      onSubmit={handleSubmit}
      submitButtonText="Cadastrar Segurado"
    />
  );
}
