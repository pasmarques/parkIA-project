import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movimentacoesService } from '@/shared/services/movimentacoes.service';
import { HistoricoFilterDto } from '@/shared/types/parking';

export function useMovimentacoesAtivas() {
  return useQuery({
    queryKey: ['movimentacoes', 'ativas'],
    queryFn: movimentacoesService.listarAtivas,
    refetchInterval: 5000,
  });
}

export function useHistoricoMovimentacoes(filter?: HistoricoFilterDto) {
  return useQuery({
    queryKey: ['movimentacoes', 'historico', filter],
    queryFn: () => movimentacoesService.listarHistorico(filter),
  });
}

export function useMovimentacoesActions() {
  const queryClient = useQueryClient();

  const registrarEntrada = useMutation({
    mutationFn: movimentacoesService.registrarEntrada,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const registrarSaida = useMutation({
    mutationFn: movimentacoesService.registrarSaida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return {
    registrarEntrada: registrarEntrada.mutateAsync,
    registrarSaida: registrarSaida.mutateAsync,
    isEntradaPending: registrarEntrada.isPending,
    isSaidaPending: registrarSaida.isPending,
  };
}
