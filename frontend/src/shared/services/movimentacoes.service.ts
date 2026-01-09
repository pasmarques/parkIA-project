import { api } from './api';
import { 
  Movimentacao, 
  CreateMovimentacaoDto, 
  RegistrarSaidaDto, 
  HistoricoFilterDto 
} from '@/shared/types/parking';

export const movimentacoesService = {
  registrarEntrada: async (dto: CreateMovimentacaoDto): Promise<void> => {
    await api.post('/movimentacoes/entrada', dto);
  },

  registrarSaida: async (dto: RegistrarSaidaDto): Promise<void> => {
    await api.post('/movimentacoes/saida', dto);
  },

  listarAtivas: async (): Promise<Movimentacao[]> => {
    const response = await api.get<Movimentacao[]>('/movimentacoes');
    return response.data;
  },

  listarHistorico: async (filter?: HistoricoFilterDto): Promise<Movimentacao[]> => {
    const response = await api.get<Movimentacao[]>('/movimentacoes/historico', { params: filter });
    return response.data;
  },
};
