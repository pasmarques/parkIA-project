import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vagasService } from '@/shared/services/vagas.service';
import { CreateVagaDto, UpdateVagaDto, VagaFilterDto } from '@/shared/types/parking';

export function useVagas(filter?: VagaFilterDto) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['vagas', filter],
    queryFn: () => vagasService.findAll(filter),
    refetchInterval: 5000,
  });

  const createMutation = useMutation({
    mutationFn: vagasService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVagaDto }) =>
      vagasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vagasService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return {
    ...query,
    createVaga: createMutation.mutateAsync,
    updateVaga: updateMutation.mutateAsync,
    deleteVaga: deleteMutation.mutateAsync,
  };
}
