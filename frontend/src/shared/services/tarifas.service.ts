import { api } from './api';
import { 
  Tarifa, 
  UpdateTarifaDto 
} from '@/shared/types/parking';

export const tarifasService = {
  findAll: async (): Promise<Tarifa[]> => {
    const response = await api.get<Tarifa[]>('/tarifas');
    return response.data;
  },

  update: async (id: string, dto: UpdateTarifaDto): Promise<Tarifa> => {
    const response = await api.put<Tarifa>(`/tarifas/${id}`, dto);
    return response.data;
  },
};
