import { Vaga } from '@/shared/types/parking';
import { Car, Bike, Accessibility } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SpotCardProps {
  vaga: Vaga;
  onClick?: (vaga: Vaga) => void;
}

const typeIcons = {
  carro: Car,
  moto: Bike,
  deficiente: Accessibility,
};

export function SpotCard({ vaga, onClick }: SpotCardProps) {
  const Icon = typeIcons[vaga.tipo];

  return (
    <button
      onClick={() => onClick?.(vaga)}
      className={cn(
        'spot-card',
        vaga.status === 'livre' && 'free',
        vaga.status === 'ocupada' && 'occupied',
        vaga.status === 'manutencao' && 'maintenance'
      )}
    >
      <Icon className="mb-1 h-5 w-5" />
      <span>{vaga.numero}</span>
    </button>
  );
}

