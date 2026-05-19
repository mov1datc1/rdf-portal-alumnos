import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { MisClases } from './pages/MisClases';
import { Progreso } from './pages/Progreso';
import { Estadisticas } from './pages/Estadisticas';
import { Recursos } from './pages/Recursos';
import { VideoFrances } from './pages/VideoFrances';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clases" element={<MisClases />} />
          <Route path="progreso" element={<Progreso />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="recursos" element={<Recursos />} />
          <Route path="video" element={<VideoFrances />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
