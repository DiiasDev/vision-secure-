import FormComponent from "../FormComponent/FormComponent";
import { camposCorretores } from "./FieldsCorretores";
import { newCorretor } from "../../Services/corretores";

export default function FormCorretores() {
    const handleSubmit = (data: any) => {
        console.log('Dados do Corretor:', data);
        newCorretor(data);
        alert('Corretor cadastrado com sucesso!');
    };

    return (
        <FormComponent
            campos={camposCorretores}
            titulo="Cadastro de Corretor"
            subtitulo="Preencha os dados do corretor para cadastro no sistema"
            onSubmit={handleSubmit}
            submitButtonText="Cadastrar Corretor"
        />
    );
}
