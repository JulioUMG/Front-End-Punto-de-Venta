import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import {
    listarProductosActivos,
    crearProductos,
    actualizarProducto,
    anularProducto
} from "../services/productoServices";
import type { Producto } from "../types/producto";


const formInicial: Producto = {
    idProducto: null,
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    idCategoria: 0


};
//funciones
function Productos() {
    //estados de la vista
    const [productos, setProductos] = useState<Producto[]>([]);
    const [form, setForm] = useState<Producto>(formInicial);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState("");

    //cargar las categorias del backend
    const cargarProductos = async () => {
        try {
            const respuesta = await listarProductosActivos();
            setProductos(respuesta.data);
        } catch (error) {
            console.error("Error al listar Productos", error);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    //funcion Guardar
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (modoEdicion && form.idProducto !== null) {
                await actualizarProducto(form.idProducto, form);
                setMensaje("Producto actualizado correctamente");
            } else {
                await crearProductos(form);
                setMensaje("Producto creada correctamente");
            }
            setForm(formInicial);
            setModoEdicion(false);
            cargarProductos();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al guardar Producto: ", error);
        }
    };

    //funcion para Modificar
    const handleModificar = (Producto: Producto) => {
        setForm(Producto);
        setModoEdicion(true);
    };

    //anular categoria
    const handleAnular = async (idProducto: number) => {
        const confirmar = window.confirm("¿Seguro que deseas anular este Producto?");
        if (!confirmar) return;
        try {
            await anularProducto(idProducto);
            setMensaje("Producto anulada correctamente");
            cargarProductos();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al anular el producto", error);
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
            <h2>Ingresar/Modificar Productos</h2>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value={form.nombre}
                        onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="descripcion">Descripcion:</label>
                    <input type="text" id="descripcion" name="descripcion"
                        value={form.descripcion} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="precio">Precio:</label>
                    <input type="text" id="precio" name="precio" value={form.precio}
                        onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="stock">Stock:</label>
                    <input type="text" id="stock" name="stock"
                        value={form.stock} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="idCategoria">ID Categoria:</label>
                    <input type="text" id="idCategoria" name="idCategoria"
                        value={form.idCategoria} onChange={handleChange} />
                </div>

                <button type="submit">Guardar</button>
            </form>
            <h2>Listado de Productos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>ID Categoria</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.idProducto}>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.precio}</td>
                            <td>{producto.stock}</td>
                            <td>{producto.idCategoria}</td>
                            <td>
                                <button onClick={() => handleModificar(producto)}>Modificar</button>
                            </td>
                            <td>
                                <button onClick={() => producto.idProducto !== null && handleAnular(producto.idProducto)}>Eliminar</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default Productos; 