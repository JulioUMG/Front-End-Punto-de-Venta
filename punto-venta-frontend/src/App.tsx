import { Routes, Route } from 'react-router-dom'
import Categoria from './pages/Categoria'
import Cliente from './pages/Cliente'
import Producto from './pages/Producto'
import Index from './pages/index'

function App() {
  return (
    <Routes>
      <Route path="" element={<Index />} />
      <Route path="/categorias" element={<Categoria />} />
      <Route path="/cliente" element={<Cliente />} />
      <Route path="/productos" element={<Producto />} />
    </Routes>

  )
}
export default App