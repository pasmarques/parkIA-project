import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tarifasService } from '@/shared/services/tarifas.service';
import { UpdateTarifaDto } from '@/shared/types/parking';

export function useTarifas() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tarifas'],
    queryFn: tarifasService.findAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTarifaDto }) =>
      tarifasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifas'] });
    },
  });

  return {
    ...query,
    updateTarifa: updateMutation.mutateAsync,
  };
}
