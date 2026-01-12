import { useState, useEffect } from "react";
import { newSeguro, atualizarSeguro } from "../../Services/Seguros";
import { getSegurados } from "../../Services/Segurados";
import { getSeguradoras } from "../../Services/Seguradoras";
import { getCorretor } from "../../Services/corretores";
import { getVehicle } from "../../Services/veiculos";
import FormComponent from "../FormComponent/FormComponent";
import { camposSeguros } from "./FieldsSeguros";
import { CircularProgress, Box } from "@mui/material";
import type { seguro } from "../../Types/seguros.types";

interface FormSegurosProps {
  initialData?: seguro | null;
  onSuccess?: () => void;
}

export default function FormSeguros({ initialData, onSuccess }: FormSegurosProps) {
  const [campos, setCampos] = useState(camposSeguros);
  const [loading, setLoading] = useState(true);
  const isEditMode = !!initialData;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [segurados, seguradoras, corretores, veiculos] = await Promise.all([
          getSegurados(),
          getSeguradoras(),
          getCorretor(),
          getVehicle(),
        ]);

        const camposAtualizados = camposSeguros.map((campo) => {
          if (campo.fieldname === "segurado") {
            return {
              ...campo,
              options: segurados.map((s) => `${s.name}|${s.nome_completo}`),
            };
          }
          if (campo.fieldname === "seguradora") {
            return {
              ...campo,
              options: seguradoras.map((s) => `${s.name}|${s.nome_seguradora}`),
            };
          }
          if (campo.fieldname === "corretor_responsavel") {
            return {
              ...campo,
              options: corretores.map((c) => `${c.name}|${c.nome_completo}`),
            };
          }
          if (campo.fieldname === "veiculo") {
            return {
              ...campo,
              options: veiculos.map((v) => `${v.name}|${v.modelo} • ${v.placa}`),
            };
          }
          return campo;
        });

        setCampos(camposAtualizados);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados do formulário");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      console.log("Dados do Seguro:", data);
      
      // Extrair apenas o ID (name) dos campos select
      const dadosFormatados = {
        ...data,
        segurado: data.segurado?.split("|")[0],
        seguradora: data.seguradora?.split("|")[0],
        corretor_responsavel: data.corretor_responsavel?.split("|")[0],
        veiculo: data.veiculo?.split("|")[0],
      };
      
      if (isEditMode && initialData) {
        await atualizarSeguro(initialData.name, dadosFormatados);
        alert("Seguro atualizado com sucesso!");
      } else {
        await newSeguro(dadosFormatados);
        alert("Seguro cadastrado com sucesso!");
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao salvar seguro:", error);
      alert("Erro ao salvar seguro. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormComponent
      campos={campos}
      titulo={isEditMode ? "Editar Seguro" : "Cadastro de Seguro"}
      subtitulo={isEditMode ? "Atualize os dados do seguro" : "Preencha os dados do seguro para cadastro no sistema"}
      onSubmit={handleSubmit}
      submitButtonText={isEditMode ? "Atualizar Seguro" : "Cadastrar Seguro"}
      initialData={initialData || undefined}
    />
  );
}
