import FormComponent from "../FormComponent/FormComponent";
import { fieldsVeiculos } from "./FieldsVeiculos";
import { newVehicle } from "../../Services/veiculos";

export default function FormVeiculos() {
  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados do Veículo:", data);
      newVehicle(data);
      alert("Veículo cadastrado com sucesso!");
      return true; 
    } catch (error: any) {
      console.error("Erro ao criar Veículo:", error);
      alert("Erro ao criar veículo. Tente novamente.");
      throw error;
    }
  };

  return (
    <FormComponent
      campos={fieldsVeiculos}
      titulo="Cadastro de Veículo"
      subtitulo="Preencha os dados do veículo para cadastro no sistema"
      onSubmit={handleSubmit}
      submitButtonText="Cadastrar Veículo"
    />
  );
}
