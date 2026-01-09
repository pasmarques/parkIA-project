import { Routes, Route } from 'react-router-dom';
import DashboardPage from '@/pages/Dashboard';
import MovimentacoesPage from '@/pages/Movimentacoes';
import HistoricoPage from '@/pages/Historico';
import GestaoPage from '@/pages/Gestao';
import NotFoundPage from '@/pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/movimentacoes" element={<MovimentacoesPage />} />
      <Route path="/historico" element={<HistoricoPage />} />
      <Route path="/gestao" element={<GestaoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
