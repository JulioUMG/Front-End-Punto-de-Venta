import { Link } from 'react-router-dom';

export default function Index() {
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Navegación */}
                <div className="bg-white shadow-sm rounded-2xl mb-8 p-3">
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/productos" className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:-translate-y-1 hover:shadow-md">
                            Productos
                        </Link>
                        <Link to="/cliente" className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:-translate-y-1 hover:shadow-md">
                            Clientes
                        </Link>
                        <Link to="/categorias" className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:-translate-y-1 hover:shadow-md">
                            Categorías
                        </Link>
                        <Link to="/" className="px-5 py-2.5 bg-sky-500 text-white font-medium rounded-xl border border-sky-500 shadow-sm transition-all duration-300 hover:bg-sky-600 hover:-translate-y-1 hover:shadow-md">
                            Inicio
                        </Link>
                    </div>
                </div>

                {/* Bienvenida y acceso a las pantallas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-800">Punto de venta</h1>
                    <p className="text-gray-500 mt-2">Selecciona una opción para continuar.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                        <Link to="/productos" className="border border-gray-200 rounded-xl p-5 transition-all duration-200 hover:border-sky-400 hover:bg-sky-50 hover:shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
                            <p className="text-sm text-gray-500 mt-2">Consulta y administra tu inventario.</p>
                        </Link>
                        <Link to="/cliente" className="border border-gray-200 rounded-xl p-5 transition-all duration-200 hover:border-sky-400 hover:bg-sky-50 hover:shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800">Clientes</h2>
                            <p className="text-sm text-gray-500 mt-2">Consulta y administra tus clientes.</p>
                        </Link>
                        <Link to="/categorias" className="border border-gray-200 rounded-xl p-5 transition-all duration-200 hover:border-sky-400 hover:bg-sky-50 hover:shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800">Categorías</h2>
                            <p className="text-sm text-gray-500 mt-2">Organiza las categorías de tus productos.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
