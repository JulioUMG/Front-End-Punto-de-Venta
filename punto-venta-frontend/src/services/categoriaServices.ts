import api from "../api/axios";
import type { Categoria } from "../types/categoria";
//listar categorias activas
export const listarCategoriasActivas = () =>
    api.get<Categoria[]>("/categorias/mostrarActivos");

//crear categorias
export const crearCategoria = (data: Omit<Categoria, "idCategoria">) =>
    api.post<Categoria>("/categorias", data);

//modificar categorias
export const actualizarCategoria = (
    id: number,
    data: Omit<Categoria, "idCategoria">,
) => api.put<Categoria>(`/categorias/modificar/${id}`, data);
export const anularCategoria = (id: number) =>
    api.put<Categoria>(`/categorias/anular/${id}`);
