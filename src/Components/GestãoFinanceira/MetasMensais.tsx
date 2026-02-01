import { useEffect, useState } from "react";
import MetasMensaisGrafico from "./graficos/MetasMensaisGrafico";
import { Financeiro } from "../../Services/Financeiro";

interface MetaGrafico {
  mes: string;
  meta: number;
  realizado: number;
  status: "atingida" | "nao-atingida" | "em-andamento";
}

export default function MetasMensais() {
  const [data, setData] = useState<MetaGrafico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const financeiro = new Financeiro();
    financeiro
      .getMetasMensaisGrafico()
      .then((dados) => {
        setData(dados);
      })
      .catch((err) => {
        console.error("Erro ao carregar metas mensais:", err);
        setError("Não foi possível carregar as metas.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <MetasMensaisGrafico data={data} loading={loading} error={error} />;
}
