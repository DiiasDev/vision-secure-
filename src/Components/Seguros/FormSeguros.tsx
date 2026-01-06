import { newSeguro } from "../../Services/Seguros";
import FormComponent from "../FormComponent/FormComponent";
import { camposSeguros } from "./FieldsSeguros";

export default function FormSeguros() {
  const handleSubmit = (data: any) => {
    console.log("Dados do Seguro:", data);
    newSeguro(data);
    alert("Seguro cadastrado com sucesso!");
  };

  return (
    <FormComponent
      campos={camposSeguros}
      titulo="Cadastro de Seguro"
      subtitulo="Preencha os dados do seguro para cadastro no sistema"
      onSubmit={handleSubmit}
      submitButtonText="Cadastrar Seguro"
    />
  );
}
