import api from "../api/axios";
import type { Producto } from "../types/producto";

//listar Productos
export const listarProductosActivos = () =>
    api.get<Producto[]>("/productos/MostrarActivos");//ruta html para ejecutar

//crear Productos
export const crearProductos = (data: Omit<Producto, "idProducto">) =>
    api.post<Producto>("/productos", data);//ruta html para ejecutar

//actualizar Productos
export const actualizarProducto = (
    id: number,
    data: Omit<Producto, "idProducto">,
) => api.put<Producto>(`/productos/modificar/${id}`, data);//ruta html para ejecutar

//anular cliente
export const anularProducto = (id: number) =>
    api.put<Producto>(`/productos/anular/${id}`);//ruta html para ejecutar
