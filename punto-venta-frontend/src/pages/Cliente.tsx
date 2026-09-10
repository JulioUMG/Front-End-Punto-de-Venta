import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import {
    listarClientesActivos,
    crearCliente,
    actualizarCliente,
    anularCliente
} from "../services/clienteServices";
import type { Cliente } from "../types/cliente";


const formInicial: Cliente = {
    idCliente: null,
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",


};
//funciones
function Clientes() {
    //estados de la vista
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [form, setForm] = useState<Cliente>(formInicial);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState("");

    //cargar las categorias del backend
    const cargarClientes = async () => {
        try {
            const respuesta = await listarClientesActivos();
            setClientes(respuesta.data);
        } catch (error) {
            console.error("Error al listar Clientesssssssssssssss", error);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    //funcion Guardar
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (modoEdicion && form.idCliente !== null) {
                await actualizarCliente(form.idCliente, form);
                setMensaje("Cliente actualizado correctamente");
            } else {
                await crearCliente(form);
                setMensaje("Cliente creada correctamente");
            }
            setForm(formInicial);
            setModoEdicion(false);
            cargarClientes();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al guardar Cliente", error);
        }
    };

    //funcion para Modificar
    const handleModificar = (cliente: Cliente) => {
        setForm(cliente);
        setModoEdicion(true);
    };

    //anular categoria
    const handleAnular = async (idCliente: number) => {
        const confirmar = window.confirm("¿Seguro que deseas anular este Cliente?");
        if (!confirmar) return;
        try {
            await anularCliente(idCliente);
            setMensaje("Cliente anulada correctamente");
            cargarClientes();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al anular al Cliente", error);
        }
    };

    //mensaje de error
    const obtenerMensajeError = (error: unknown): string => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.mensaje ?? error.message;
        }
        if (error instanceof Error) {
            return error.message;
        }
        return "Ocurrió un error inesperado";
    };

    //codigo html basico
    return (
        <div>
            <Link to="/productos">
                <button>
                    Productos
                </button>
            </Link>
            <Link to="/cliente">
                <button>
                    Cliente
                </button>
            </Link>
            <Link to="/categorias">
                <button>
                    Categoria
                </button>
            </Link>
            <Link to="/">
                <button>
                    Inicio
                </button>
            </Link>
            <h2>Ingresar/Modificar Clientes</h2>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value={form.nombre}
                        onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="apellido">Apellido:</label>
                    <input type="text" id="apellido" name="apellido"
                        value={form.apellido} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" value={form.email}
                        onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="telefono">Telefono:</label>
                    <input type="text" id="telefono" name="telefono"
                        value={form.telefono} onChange={handleChange} />
                </div>

                <button type="submit">Guardar</button>
            </form>
            <h2>Listado de Clientes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.idCliente}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>
                                <button onClick={() => handleModificar(cliente)}>Modificar</button>
                            </td>
                            <td>
                                <button onClick={() => cliente.idCliente !== null && handleAnular(cliente.idCliente)}>Eliminar</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default Clientes; 