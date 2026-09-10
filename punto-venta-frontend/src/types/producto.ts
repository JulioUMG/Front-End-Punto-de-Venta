export interface Producto {

    idProducto: number | null;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    idCategoria: number;
}
export interface ApiMensaje {
    mensaje: string;
}