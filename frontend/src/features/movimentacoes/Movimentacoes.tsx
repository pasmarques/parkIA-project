import { useState } from 'react';
import { Layout } from '@/shared/components/Layout';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useVagas } from '@/shared/hooks/useVagas';
import { useTarifas } from '@/shared/hooks/useTarifas';
import { useMovimentacoesAtivas, useMovimentacoesActions } from '@/shared/hooks/useMovimentacoes';
import { VehicleType } from '@/shared/types/parking';
import { LogIn, LogOut, Car, Bike, Clock, CheckCircle, Accessibility } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

export default function Movimentacoes() {
  const { data: allVagas = [] } = useVagas({ status: 'livre' });
  const { data: activeMovimentacoes = [] } = useMovimentacoesAtivas();
  const { data: allTarifas = [] } = useTarifas();
  const { registrarEntrada, registrarSaida } = useMovimentacoesActions();

  const [entradaForm, setEntradaForm] = useState({
    vagaId: '',
    placa: '',
    tipoVeiculo: '' as VehicleType | '',
  });
  const [saidaPlaca, setSaidaPlaca] = useState('');
  const [saidaDialog, setSaidaDialog] = useState<{
    placa: string;
    valor: number;
    tempo: string;
  } | null>(null);

  const validarPlaca = (placa: string): boolean => {
    const padrao1 = /^[A-Z]{3}-\d{4}$/;
    const padrao2 = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    return padrao1.test(placa.toUpperCase()) || padrao2.test(placa.toUpperCase());
  };

  const calcularValor = (entrada: Date, saida: Date, tipoVeiculo: VehicleType): number => {
    const tarifa = allTarifas.find(t => t.tipo_veiculo === tipoVeiculo);
    if (!tarifa) return 0;

    const diffMs = saida.getTime() - entrada.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes <= tarifa.tolerancia_minutos) {
      return 0;
    }

    const diffHours = Math.ceil(diffMinutes / 60);
    
    const valorPrimeiraHora = Number(tarifa.valor_primeira_hora);
    const valorHoraAdicional = Number(tarifa.valor_hora_adicional);

    if (diffHours <= 1) {
      return valorPrimeiraHora;
    }

    return valorPrimeiraHora + (diffHours - 1) * valorHoraAdicional;
  };

  const handleEntrada = async () => {
    if (!entradaForm.vagaId || !entradaForm.placa || !entradaForm.tipoVeiculo) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!validarPlaca(entradaForm.placa)) {
      toast.error('Formato de placa inválido. Use ABC-1234 ou ABC1D23');
      return;
    }

    try {
      await registrarEntrada({
        vagaId: entradaForm.vagaId,
        placa: entradaForm.placa,
        tipoVeiculo: entradaForm.tipoVeiculo as VehicleType,
      });
      
      toast.success(`Entrada registrada para ${entradaForm.placa.toUpperCase()}`);
      setEntradaForm({ vagaId: '', placa: '', tipoVeiculo: '' });
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message;
      
      if (errorMessage) {
        // Se for array (erros de validação), pega o primeiro
        const message = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
        toast.error(message);
      } else {
        toast.error('Não foi possível registrar a entrada. Verifique se a vaga está livre.');
      }
    }
  };

  const handleBuscarSaida = (placaOverride?: string) => {
    const placaBusca = placaOverride || saidaPlaca;

    if (!placaBusca) {
      toast.error('Digite a placa do veículo');
      return;
    }

    const mov = activeMovimentacoes.find(m => m.placa.toUpperCase() === placaBusca.toUpperCase() && !m.saida);
    
    if (!mov) {
      toast.error('Veículo não encontrado no pátio');
      return;
    }

    try {
      const entradaDate = new Date(mov.entrada);
      if (isNaN(entradaDate.getTime())) {
        console.error('Data de entrada inválida:', mov.entrada);
        toast.error('Erro nos dados da movimentação: Data de entrada inválida');
        return;
      }

      let valor = calcularValor(entradaDate, new Date(), mov.tipo_veiculo);
      if (typeof valor !== 'number' || isNaN(valor)) {
        console.warn('Valor calculado inválido, definindo como 0');
        valor = 0;
      }

      const tempo = formatDuration(entradaDate);

      setSaidaDialog({
        placa: mov.placa,
        valor,
        tempo,
      });
    } catch (error) {
      console.error('Erro ao processar movimentação:', error, mov);
      toast.error('Erro ao processar dados da movimentação');
    }
  };

  const handleConfirmarSaida = async () => {
    if (!saidaDialog) return;

    try {
      const mov = await registrarSaida({ placa: saidaDialog.placa });
      
      toast.success(`Saída registrada. Valor: R$ ${Number(mov.valor_pago).toFixed(2)}`);
      
      setSaidaDialog(null);
      setSaidaPlaca('');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
         const message = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
         toast.error(message);
      } else {
        toast.error('Erro ao registrar saída');
      }
    }
  };

  const formatDuration = (entrada: Date) => {
    const now = new Date();
    const diff = now.getTime() - entrada.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getVehicleIcon = (tipo: VehicleType) => {
    return tipo === 'moto' ? Bike : Car;
  };

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
          <p className="mt-1 text-muted-foreground">
            Registrar entrada e saída de veículos
          </p>
        </div>

        <Tabs defaultValue="entrada" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="entrada" className="gap-2">
              <LogIn className="h-4 w-4" />
              Entrada
            </TabsTrigger>
            <TabsTrigger value="saida" className="gap-2">
              <LogOut className="h-4 w-4" />
              Saída
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entrada" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Registrar Entrada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa do Veículo</Label>
                    <Input
                      id="placa"
                      placeholder="ABC-1234 ou ABC1D23"
                      value={entradaForm.placa}
                      onChange={(e) => setEntradaForm(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))}
                      className="plate-input"
                      maxLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Veículo</Label>
                    <Select
                      value={entradaForm.tipoVeiculo}
                      onValueChange={(value) => setEntradaForm(prev => ({ ...prev, tipoVeiculo: value as VehicleType }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Carro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carro">
                          <span className="flex items-center gap-2">
                            <Car className="h-4 w-4" /> Carro
                          </span>
                        </SelectItem>
                        <SelectItem value="moto">
                          <span className="flex items-center gap-2">
                            <Bike className="h-4 w-4" /> Moto
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vaga">Vaga</Label>
                    <Select
                      value={entradaForm.vagaId}
                      onValueChange={(value) => setEntradaForm(prev => ({ ...prev, vagaId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma vaga livre" />
                      </SelectTrigger>
                      <SelectContent>
                        {allVagas.map((vaga) => (
                          <SelectItem key={vaga.id} value={vaga.id}>
                            {vaga.numero} - {vaga.tipo === 'deficiente' ? 'Deficiente' : vaga.tipo.charAt(0).toUpperCase() + vaga.tipo.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleEntrada} className="w-full">
                    Registrar Entrada
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vagas Disponíveis ({allVagas.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {allVagas.slice(0, 12).map((vaga) => (
                      <button
                        key={vaga.id}
                        onClick={() => setEntradaForm(prev => ({ ...prev, vagaId: vaga.id }))}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all hover:border-primary",
                          entradaForm.vagaId === vaga.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border"
                        )}
                      >
                        <span className="font-semibold">{vaga.numero}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {vaga.tipo === 'deficiente' ? (
                            <span className="flex items-center gap-1">
                              <Accessibility className="h-3 w-3" /> Deficiente
                            </span>
                          ) : vaga.tipo === 'moto' ? 'Moto' : 'Carro'}
                        </span>
                      </button>
                    ))}
                  </div>
                  {allVagas.length > 12 && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      +{allVagas.length - 12} vagas disponíveis
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saida" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    Registrar Saída
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="saida-placa">Buscar por Placa</Label>
                    <div className="flex gap-2">
                      <Input
                        id="saida-placa"
                        placeholder="ABC-1234"
                        value={saidaPlaca}
                        onChange={(e) => setSaidaPlaca(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleBuscarSaida();
                          }
                        }}
                        className="plate-input flex-1"
                        maxLength={8}
                      />
                      <Button type="button" onClick={() => handleBuscarSaida()} variant="outline">
                        Buscar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Veículos no Pátio ({activeMovimentacoes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1 p-4 pt-0">
                      {activeMovimentacoes.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          <Car className="mx-auto mb-2 h-12 w-12 opacity-50" />
                          <p>Nenhum veículo no pátio</p>
                        </div>
                      ) : (
                        activeMovimentacoes.map((mov) => {
                          const Icon = getVehicleIcon(mov.tipo_veiculo);
                          return (
                            <button
                              type="button"
                              key={mov.id}
                              onClick={(e) => {
                                e.preventDefault();
                                setSaidaPlaca(mov.placa);
                                handleBuscarSaida(mov.placa);
                              }}
                              className="flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <div className="text-left">
                                  <p className="font-mono font-semibold">{mov.placa}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Vaga {mov.vaga?.numero || '-'}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">
                                {formatDuration(new Date(mov.entrada))}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!saidaDialog} onOpenChange={() => setSaidaDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Saída</DialogTitle>
            <DialogDescription>
              Revise os dados antes de confirmar
            </DialogDescription>
          </DialogHeader>
          
          {saidaDialog && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placa</span>
                  <span className="font-mono font-medium">{saidaDialog.placa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo de permanência</span>
                  <span className="font-medium">{saidaDialog.tempo}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">Valor a pagar</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {typeof saidaDialog.valor === 'number' && !isNaN(saidaDialog.valor) ? saidaDialog.valor.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              {saidaDialog.valor === 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-spot-free/10 p-3 text-sm text-spot-free">
                  <CheckCircle className="h-4 w-4" />
                  Dentro do período de tolerância (gratuito)
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaidaDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarSaida}>
              Confirmar Saída
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
