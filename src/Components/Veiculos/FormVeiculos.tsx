import FormComponent from "../FormComponent/FormComponent";
import { fieldsVeiculos } from "./FieldsVeiculos";
import { newVehicle, atualizarVeiculo } from "../../Services/veiculos";
import type { veiculo } from "../../Types/veiculos.types";

interface FormVeiculosProps {
  veiculoData?: veiculo;
  onSuccess?: () => void;
}

export default function FormVeiculos({ veiculoData, onSuccess }: FormVeiculosProps) {
  const isEditing = !!veiculoData;

  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados do Veículo:", data);
      if (isEditing && veiculoData?.name) {
        await atualizarVeiculo(veiculoData.name, data);
        alert("Veículo atualizado com sucesso!");
      } else {
        await newVehicle(data);
        alert("Veículo cadastrado com sucesso!");
      }
      if (onSuccess) onSuccess();
      return true; 
    } catch (error: any) {
      console.error("Erro ao salvar Veículo:", error);
      alert(`Erro ao ${isEditing ? 'atualizar' : 'criar'} veículo. Tente novamente.`);
      throw error;
    }
  };

  return (
    <FormComponent
      campos={fieldsVeiculos}
      titulo={isEditing ? "Editar Veículo" : "Cadastro de Veículo"}
      subtitulo={isEditing ? "Atualize os dados do veículo" : "Preencha os dados do veículo para cadastro no sistema"}
      onSubmit={handleSubmit}
      submitButtonText={isEditing ? "Atualizar Veículo" : "Cadastrar Veículo"}
      initialData={veiculoData}
    />
  );
}
