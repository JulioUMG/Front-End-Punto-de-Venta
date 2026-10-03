import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import autoTable from "jspdf-autotable";
import {
    listarCategoriasActivas,
    crearCategoria,
    actualizarCategoria,
    anularCategoria
} from "../services/categoriaServices";
import type { Categoria } from "../types/categoria";


const formInicial: Categoria = {
    idCategoria: null,
    nombre: "",
    descripcion: ""
};

function Categorias() {
    //estados de la vista
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [form, setForm] = useState<Categoria>(formInicial);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState("");

    //cargar las categorias del backend
    const cargarCategorias = async () => {
        try {
            const respuesta = await listarCategoriasActivas();
            setCategorias(respuesta.data);
        } catch (error) {
            console.error("Error al listar categorías", error);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    //funcion Guardar
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (modoEdicion && form.idCategoria !== null) {
                await actualizarCategoria(form.idCategoria, form);
                setMensaje("Categoría actualizada correctamente");
            } else {
                await crearCategoria(form);
                setMensaje("Categoría creada correctamente");
            }
            setForm(formInicial);
            setModoEdicion(false);
            cargarCategorias();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al guardar categoría", error);
        }
    };

    //funcion para Modificar
    const handleModificar = (categoria: Categoria) => {
        setForm(categoria);
        setModoEdicion(true);
    };

    //anular categoria
    const handleAnular = async (idCategoria: number) => {
        const confirmar = window.confirm("¿Seguro que deseas anular esta categoría?");
        if (!confirmar) return;
        try {
            await anularCategoria(idCategoria);
            setMensaje("Categoría anulada correctamente");
            cargarCategorias();
        } catch (error) {
            setMensaje(obtenerMensajeError(error));
            console.error("Error al anular la categoría", error);
        }
    };



    // Crear el documento una sola vez para descargarlo o visualizarlo.
    const generarPDF = () => {
        const doc = new jsPDF();
        //imagen
        const logo = "data:image/png;base64,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";
        doc.addImage(logo, "PNG", 160, 8, 15, 15);

        doc.text("Listado de Categorías", 14, 15);

        const columnas = ["Nombre", "Descripción"];
        const filas = categorias.map((categoria) => [
            categoria.nombre,
            categoria.descripcion
        ]);

        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 25,
            headStyles: { fillColor: [22, 101, 52] },
            alternateRowStyles: { fillColor: [220, 252, 231] },
        });

        return doc;
    };

    const exportarPDF = () => {
        try {
            const doc = generarPDF();
            doc.save("categorias.pdf");
        } catch (error) {
            setMensaje("Error al exportar PDF: " + obtenerMensajeError(error));
        }
    };

    // Abrir el mismo reporte en otra pestaña, como indica el manual.
    const verPDF = () => {
        try {
            const doc = generarPDF();
            const url = doc.output("bloburl");
            window.open(url, "_blank");
        } catch (error) {
            setMensaje("Error al visualizar PDF: " + obtenerMensajeError(error));
        }
    };

    const exportarExcel = async () => {
        try {
            // Crear el libro, el título y la fecha.
            const libro = new ExcelJS.Workbook();
            const hoja = libro.addWorksheet("Categorías");

            hoja.addRow(["Listado de Categorías"]).font = { size: 16, bold: true };
            hoja.addRow(["Fecha: " + new Date().toLocaleDateString()]);
            hoja.addRow([]);

            // Encabezados y bordes, siguiendo el ejemplo del manual.
            const encabezado = hoja.addRow(["Nombre", "Descripción"]);
            encabezado.eachCell((celda) => {
                celda.font = { bold: true, color: { argb: "FFFFFFFF" } };
                celda.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF166534" },
                };
                celda.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            // Agregar los registros con filas alternadas en verde claro.
            categorias.forEach((categoria, indice) => {
                const fila = hoja.addRow([
                    categoria.nombre,
                    categoria.descripcion
                ]);

                fila.eachCell((celda) => {
                    celda.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                    if (indice % 2 === 1) {
                        celda.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFDCFCE7" },
                        };
                    }
                });
            });

            hoja.getColumn(1).width = 30;
            hoja.getColumn(2).width = 60;

            // Generar el archivo y descargarlo en el navegador.
            const buffer = await libro.xlsx.writeBuffer();
            const blob = new Blob([new Uint8Array(buffer)], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.download = "categorias.xlsx";
            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            setMensaje("Error al exportar Excel: " + obtenerMensajeError(error));
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

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">

            <div className="max-w-6xl mx-auto">

                {/* PANEL DE NAVEGACION */}
                <div className="bg-white shadow-sm rounded-2xl mb-8 p-3">
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/reportes" className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:-translate-y-1 hover:shadow-md">
                            Reportes
                        </Link>

                        <Link to="/productos">
                            <button className=" px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl   border border-gray-200   transition-all duration-300     hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:-translate-y-1 hover:shadow-md">Productos</button>
                        </Link>
                        <Link to="/cliente">
                            <button className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:-translate-y-1 hover:shadow-md"> Clientes</button>
                        </Link>

                        <Link to="/categorias">
                            <button
                                className="
                                px-5 py-2.5
                                bg-sky-500
                                text-white
                                font-medium
                                rounded-xl
                                border border-sky-500
                                shadow-sm
                                transition-all duration-300
                                hover:bg-sky-600
                                hover:-translate-y-1
                                hover:shadow-md
                            "
                            >
                                Categorías
                            </button>
                        </Link>

                        <Link to="/">
                            <button
                                className="
                                px-5 py-2.5
                                bg-white
                                text-gray-700
                                font-medium
                                rounded-xl
                                border border-gray-200
                                transition-all duration-300
                                hover:bg-gray-800
                                hover:text-white
                                hover:border-gray-800
                                hover:-translate-y-1
                                hover:shadow-md
                            "
                            >
                                Inicio
                            </button>
                        </Link>

                    </div>
                </div>

                {/* Título */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Categorías
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Administra las categorías de tus productos.
                    </p>
                </div>

                {/* Mensaje */}
                {mensaje && (
                    <div
                        className="
                        mb-6
                        bg-sky-50
                        border border-sky-200
                        text-sky-700
                        px-4 py-3
                        rounded-xl
                    "
                    >
                        {mensaje}
                    </div>
                )}

                {/* Formulario */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

                    <h2 className="text-xl font-semibold text-gray-800 mb-5">
                        Ingresar / Modificar categoría
                    </h2>



                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="nombre"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej. Electrónica"
                                    className="
                                    w-full
                                    px-4 py-3
                                    rounded-xl
                                    border border-gray-300
                                    bg-gray-50
                                    text-gray-800
                                    outline-none
                                    transition-all duration-200
                                    focus:bg-white
                                    focus:border-sky-500
                                    focus:ring-4
                                    focus:ring-sky-100
                                    "
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="descripcion"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Descripción
                                </label>

                                <input
                                    type="text"
                                    id="descripcion"
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción de la categoría"
                                    className="
                                    w-full
                                    px-4 py-3
                                    rounded-xl
                                    border border-gray-300
                                    bg-gray-50
                                    text-gray-800
                                    outline-none
                                    transition-all duration-200
                                    focus:bg-white
                                    focus:border-sky-500
                                    focus:ring-4
                                    focus:ring-sky-100
                                    "
                                />
                            </div>

                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="
                                px-6 py-3
                                bg-sky-500
                                text-white
                                font-semibold
                                rounded-xl
                                shadow-sm
                                transition-all duration-300
                                hover:bg-sky-600
                                hover:shadow-md
                                hover:-translate-y-0.5
                                active:translate-y-0
                            "
                            >
                                Guardar categoría
                            </button>
                        </div>

                    </form>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Listado de categorías
                        </h2>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <button type="button" onClick={verPDF}
                                className="px-4 py-2 bg-white text-sky-700 font-medium border border-sky-300 rounded-lg transition-colors hover:bg-sky-50">
                                Ver PDF
                            </button>
                            <button type="button" onClick={exportarPDF}
                                className="px-4 py-2 bg-sky-500 text-white font-medium rounded-lg transition-colors hover:bg-sky-600">
                                Exportar PDF
                            </button>
                            <button type="button" onClick={exportarExcel}
                                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg transition-colors hover:bg-green-700">
                                Exportar Excel
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            Categorías registradas actualmente.
                        </p>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>

                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Modificar
                                    </th>

                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Eliminar
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {categorias.map((categoria) => (

                                    <tr
                                        key={categoria.idCategoria}
                                        className="
                                        transition-colors duration-200
                                        hover:bg-sky-50/50
                                    "
                                    >

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {categoria.nombre}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {categoria.descripcion}
                                        </td>

                                        <td className="px-6 py-4 text-center">

                                            <button
                                                onClick={() => handleModificar(categoria)}
                                                className="
                                                px-4 py-2
                                                text-sm
                                                font-medium
                                                text-amber-700
                                                bg-amber-50
                                                border border-amber-200
                                                rounded-lg
                                                transition-all duration-200
                                                hover:bg-amber-500
                                                hover:text-white
                                                hover:border-amber-500
                                                hover:shadow-sm
                                            "
                                            >
                                                Modificar
                                            </button>

                                        </td>

                                        <td className="px-6 py-4 text-center">

                                            <button
                                                onClick={() =>
                                                    categoria.idCategoria !== null &&
                                                    handleAnular(categoria.idCategoria)
                                                }
                                                className="
                                                px-4 py-2
                                                text-sm
                                                font-medium
                                                text-red-600
                                                bg-red-50
                                                border border-red-200
                                                rounded-lg
                                                transition-all duration-200
                                                hover:bg-red-500
                                                hover:text-white
                                                hover:border-red-500
                                                hover:shadow-sm
                                            "
                                            >
                                                Eliminar
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Categorias; 