import { useState } from 'react';
import { Layout } from '@/shared/components/Layout';
import { StatCard } from '@/shared/components/StatCard';
import { SpotGrid } from '@/shared/components/SpotGrid';
import { useDashboard } from '@/shared/hooks/useDashboard';
import { useVagas } from '@/shared/hooks/useVagas';
import { useMovimentacoesAtivas } from '@/shared/hooks/useMovimentacoes';
import { ParkingCircle, Car, CheckCircle, Wrench, DollarSign } from 'lucide-react';
import { Vaga } from '@/shared/types/parking';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { cn } from '@/shared/lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading, isError } = useDashboard();
  const { data: allVagas = [] } = useVagas();
  const { data: activeMovimentacoes = [] } = useMovimentacoesAtivas();
  const [selectedSpot, setSelectedSpot] = useState<Vaga | null>(null);

  const handleSpotClick = (vaga: Vaga) => {
    setSelectedSpot(vaga);
  };

  const getMovimentacaoForVaga = (vagaId: string) => {
    return activeMovimentacoes.find(m => m.vaga.id === vagaId);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (isError || !stats) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-2 text-destructive">Erro ao carregar dados do dashboard.</p>
          <p className="text-sm text-muted-foreground">Verifique se o backend está rodando em http://localhost:3000</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Visão geral do estacionamento em tempo real
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total de Vagas"
            value={stats.total}
            icon={<ParkingCircle className="h-6 w-6" />}
          />
          <StatCard
            title="Ocupadas"
            value={stats.ocupadas}
            subtitle={`${stats.percentualOcupacao}% ocupação`}
            icon={<Car className="h-6 w-6" />}
            variant="danger"
          />
          <StatCard
            title="Livres"
            value={stats.livres}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <StatCard
            title="Manutenção"
            value={stats.manutencao}
            icon={<Wrench className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Receita do Dia"
            value={`R$ ${(stats.receitaDoDia || 0).toFixed(2).replace('.', ',')}`}
            icon={<DollarSign className="h-6 w-6" />}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Mapa de Vagas
          </h2>
          <SpotGrid vagas={allVagas} onSpotClick={handleSpotClick} />
        </div>
      </div>

      <Dialog open={!!selectedSpot} onOpenChange={() => setSelectedSpot(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Vaga {selectedSpot?.numero}</DialogTitle>
            <DialogDescription>Detalhes da vaga selecionada</DialogDescription>
          </DialogHeader>
          
          {selectedSpot && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                    selectedSpot.status === 'ocupada' && "bg-spot-occupied text-white",
                    selectedSpot.status === 'livre' && "bg-spot-free text-white",
                    selectedSpot.status === 'manutencao' && "bg-spot-maintenance text-white"
                  )}>
                    {selectedSpot.status === 'ocupada' && 'Ocupada'}
                    {selectedSpot.status === 'livre' && 'Livre'}
                    {selectedSpot.status === 'manutencao' && 'Manutenção'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                  <p className="font-medium capitalize">{selectedSpot.tipo}</p>
                </div>
              </div>

              {selectedSpot.status === 'ocupada' && (
                <div className="rounded-lg bg-muted p-4 space-y-3">
                  <p className="font-semibold text-foreground">Veículo Atual</p>
                  {(() => {
                    const mov = getMovimentacaoForVaga(selectedSpot.id);
                    if (mov) {
                      const entrada = new Date(mov.entrada);
                      const diffMs = Date.now() - entrada.getTime();
                      const hours = Math.floor(diffMs / (1000 * 60 * 60));
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      
                      return (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Placa: </span>
                            <span className="font-mono font-semibold">{mov.placa}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tipo: </span>
                            <span className="capitalize">{mov.tipo_veiculo}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Tempo: </span>
                            <span className="font-semibold text-primary">{hours}h {minutes}min</span>
                          </div>
                        </div>
                      );
                    }
                    return <p className="text-sm text-muted-foreground">Informações não disponíveis</p>;
                  })()}
                </div>
              )}

              {selectedSpot.status === 'livre' && (
                <div className="rounded-lg bg-spot-free/10 border border-spot-free/20 p-4">
                  <p className="text-sm text-muted-foreground">
                    Esta vaga está disponível para estacionamento.
                  </p>
                </div>
              )}

              {selectedSpot.status === 'manutencao' && (
                <div className="rounded-lg bg-spot-maintenance/10 border border-spot-maintenance/20 p-4">
                  <p className="text-sm text-muted-foreground">
                    Esta vaga está em manutenção e não pode ser utilizada.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

