export interface Cliente {
    idCliente: number | null;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    //fechaRegistro: Date;
}
export interface ApiMensaje {
    mensaje: string;
}