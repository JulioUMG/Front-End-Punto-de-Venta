import api from "../api/axios";
import type { Cliente } from "../types/cliente";

//listar clientes
export const listarClientesActivos = () =>
    api.get<Cliente[]>("/clientes/mostrarActivos");//ruta html para ejecutar

//crear clientes
export const crearCliente = (data: Omit<Cliente, "idCliente">) =>
    api.post<Cliente>("/clientes", data);//ruta html para ejecutar

//actualizar clientes
export const actualizarCliente = (
    id: number,
    data: Omit<Cliente, "idCliente">,
) => api.put<Cliente>(`/clientes/${id}`, data);//ruta html para ejecutar

//anular cliente
export const anularCliente = (id: number) =>
    api.put<Cliente>(`/clientes/anular/${id}`);//ruta html para ejecutar
