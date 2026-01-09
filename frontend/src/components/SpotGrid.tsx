import { Vaga, SpotType } from '@/types/parking';
import { SpotCard } from './SpotCard';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Bike, Accessibility, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpotGridProps {
  vagas: Vaga[];
  onSpotClick?: (vaga: Vaga) => void;
}

const filterOptions: { value: SpotType | 'todos'; label: string; icon: React.ElementType }[] = [
  { value: 'todos', label: 'Todos', icon: LayoutGrid },
  { value: 'carro', label: 'Carros', icon: Car },
  { value: 'moto', label: 'Motos', icon: Bike },
  { value: 'deficiente', label: 'PCD', icon: Accessibility },
];

// Labels are now generated dynamically as "Setor X"

export function SpotGrid({ vagas, onSpotClick }: SpotGridProps) {
  const [filter, setFilter] = useState<SpotType | 'todos'>('todos');

  const filteredVagas = filter === 'todos' 
    ? vagas 
    : vagas.filter(v => v.tipo === filter);

  // Group vagas by sector (first letter of numero)
  const vagasBySector = useMemo(() => {
    const grouped: Record<string, Vaga[]> = {};
    
    filteredVagas.forEach(vaga => {
      const sector = vaga.numero.charAt(0);
      if (!grouped[sector]) {
        grouped[sector] = [];
      }
      grouped[sector].push(vaga);
    });

    // Sort sectors alphabetically
    const sortedSectors = Object.keys(grouped).sort();
    return sortedSectors.map(sector => ({
      sector,
      label: `Setor ${sector}`,
      vagas: grouped[sector].sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })),
    }));
  }, [filteredVagas]);

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.value}
              variant={filter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(option.value)}
              className={cn(
                'gap-2 transition-all',
                filter === option.value && 'shadow-md'
              )}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-spot-free" />
          <span className="text-muted-foreground">Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-spot-occupied" />
          <span className="text-muted-foreground">Ocupada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-spot-maintenance" />
          <span className="text-muted-foreground">Manutenção</span>
        </div>
      </div>

      {/* Grid by Sector */}
      <div className="space-y-6">
        {vagasBySector.map(({ sector, label, vagas: sectorVagas }) => (
          <div key={sector} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{label}</h3>
              <span className="text-xs text-muted-foreground">
                ({sectorVagas.filter(v => v.status === 'livre').length}/{sectorVagas.length} livres)
              </span>
            </div>
            <div className="spot-grid">
              {sectorVagas.map((vaga) => (
                <SpotCard 
                  key={vaga.id} 
                  vaga={vaga} 
                  onClick={onSpotClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
