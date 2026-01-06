import { frappe } from "./frappeClient"
import type { veiculo } from "../Types/veiculos.types"

export async function newVehicle(dados: veiculo){
    try{
        const {data} = await frappe.post("/resource/Veiculos Segurados", dados)
        return data.data
    }catch(error: any){
        console.error("Erro ao cadastrar veiculo", error)
    }
}