import { frappe } from "./frappeClient";

export interface DependencyError {
  hasError: true;
  message: string;
  dependencies: {
    doctype: string;
    name: string;
    title?: string;
  }[];
}

export interface DependencySuccess {
  hasError: false;
}

export type DependencyValidationResult = DependencyError | DependencySuccess;

/**
 * Valida se um documento pode ser deletado verificando suas dependências
 */
export async function validateDependencies(
  doctype: string,
  docname: string
): Promise<DependencyValidationResult> {
  try {
    const dependencies: { doctype: string; name: string; title?: string }[] = [];

    switch (doctype) {
      case "Veiculos":
        // Verificar se há seguros vinculados a este veículo
        const segurosVinculados = await frappe.get("/resource/Seguros", {
          params: {
            filters: JSON.stringify({ veiculo: docname }),
            fields: JSON.stringify(["name", "numero_apolice"]),
          },
        });

        if (segurosVinculados.data?.data?.length > 0) {
          segurosVinculados.data.data.forEach((seguro: any) => {
            dependencies.push({
              doctype: "Seguros",
              name: seguro.name,
              title: seguro.numero_apolice,
            });
          });
        }
        break;

      case "Segurados":
        // Verificar se há seguros vinculados a este segurado
        const segurosDoSegurado = await frappe.get("/resource/Seguros", {
          params: {
            filters: JSON.stringify({ segurado: docname }),
            fields: JSON.stringify(["name", "numero_apolice"]),
          },
        });

        if (segurosDoSegurado.data?.data?.length > 0) {
          segurosDoSegurado.data.data.forEach((seguro: any) => {
            dependencies.push({
              doctype: "Seguros",
              name: seguro.name,
              title: seguro.numero_apolice,
            });
          });
        }
        break;

      case "Seguradoras":
        // Verificar se há seguros vinculados a esta seguradora
        const segurosDaSeguradora = await frappe.get("/resource/Seguros", {
          params: {
            filters: JSON.stringify({ seguradora: docname }),
            fields: JSON.stringify(["name", "numero_apolice"]),
          },
        });

        if (segurosDaSeguradora.data?.data?.length > 0) {
          segurosDaSeguradora.data.data.forEach((seguro: any) => {
            dependencies.push({
              doctype: "Seguros",
              name: seguro.name,
              title: seguro.numero_apolice,
            });
          });
        }
        break;

      case "Corretores":
        // Verificar se há seguros vinculados a este corretor
        const segurosDoCorretor = await frappe.get("/resource/Seguros", {
          params: {
            filters: JSON.stringify({ corretor_responsavel: docname }),
            fields: JSON.stringify(["name", "numero_apolice"]),
          },
        });

        if (segurosDoCorretor.data?.data?.length > 0) {
          segurosDoCorretor.data.data.forEach((seguro: any) => {
            dependencies.push({
              doctype: "Seguros",
              name: seguro.name,
              title: seguro.numero_apolice,
            });
          });
        }
        break;

      case "Seguros":
        // Seguros não têm dependências (são o nível mais alto)
        break;

      default:
        console.warn(`Doctype ${doctype} não mapeado para validação de dependências`);
    }

    if (dependencies.length > 0) {
      const dependencyList = dependencies
        .map((dep) => `• ${dep.title || dep.name} (${dep.doctype})`)
        .join("\n");

      return {
        hasError: true,
        message: `Não é possível excluir este registro pois ele está vinculado a:\n\n${dependencyList}\n\nPara excluir, você precisa primeiro remover ou excluir os registros vinculados.`,
        dependencies,
      };
    }

    return { hasError: false };
  } catch (error) {
    console.error("Erro ao validar dependências:", error);
    // Em caso de erro na validação, permitir a exclusão
    return { hasError: false };
  }
}

/**
 * Valida múltiplas exclusões
 */
export async function validateBulkDependencies(
  doctype: string,
  docnames: string[]
): Promise<Map<string, DependencyValidationResult>> {
  const results = new Map<string, DependencyValidationResult>();

  for (const docname of docnames) {
    const result = await validateDependencies(doctype, docname);
    results.set(docname, result);
  }

  return results;
}
