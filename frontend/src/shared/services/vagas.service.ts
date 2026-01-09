import { api } from './api';
import { 
  Vaga, 
  CreateVagaDto, 
  UpdateVagaDto, 
  VagaFilterDto, 
  VagaEstatisticasDto 
} from '@/shared/types/parking';

export const vagasService = {
  findAll: async (filter?: VagaFilterDto): Promise<Vaga[]> => {
    const response = await api.get<Vaga[]>('/vagas', { params: filter });
    return response.data;
  },

  estatisticas: async (): Promise<VagaEstatisticasDto> => {
    const response = await api.get<VagaEstatisticasDto>('/vagas/estatisticas');
    return response.data;
  },

  create: async (dto: CreateVagaDto): Promise<Vaga> => {
    const response = await api.post<Vaga>('/vagas', dto);
    return response.data;
  },

  update: async (id: string, dto: UpdateVagaDto): Promise<Vaga> => {
    const response = await api.put<Vaga>(`/vagas/${id}`, dto);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/vagas/${id}`);
  },
};
