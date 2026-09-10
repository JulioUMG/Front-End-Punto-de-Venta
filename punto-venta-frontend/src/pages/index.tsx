import { Link } from 'react-router-dom';

export default function Index() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>FRONT-END CON REACT</h1>
            <p>Selecciona una opción para continuar:</p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                <Link to="/categorias">
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Categorías
                    </button>
                </Link>

                <Link to="/cliente">
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Clientes
                    </button>
                </Link>

                <Link to="/productos">
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Productos
                    </button>
                </Link>
            </div>
        </div>
    );
}