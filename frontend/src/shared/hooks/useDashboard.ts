import { useQuery } from '@tanstack/react-query';
import { vagasService } from '@/shared/services/vagas.service';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: vagasService.estatisticas,
    refetchInterval: 5000,
  });
}
