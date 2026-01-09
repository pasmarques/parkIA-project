import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { vagas as initialVagas, tarifas as initialTarifas } from '@/data/mockData';
import { Vaga, Tarifa, SpotStatus, SpotType, VehicleType } from '@/types/parking';
import { ParkingCircle, Plus, Pencil, Trash2, DollarSign, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function Gestao() {
  const [allVagas, setAllVagas] = useState<Vaga[]>(initialVagas);
  const [allTarifas, setAllTarifas] = useState<Tarifa[]>(initialTarifas);
  
  const [novaVaga, setNovaVaga] = useState({
    numero: '',
    tipo: 'carro' as SpotType,
  });
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const [editingTarifa, setEditingTarifa] = useState<Tarifa | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCriarVaga = () => {
    if (!novaVaga.numero) {
      toast.error('Digite o número da vaga');
      return;
    }

    if (allVagas.some(v => v.numero.toUpperCase() === novaVaga.numero.toUpperCase())) {
      toast.error('Já existe uma vaga com este número');
      return;
    }

    const nova: Vaga = {
      id: `vaga-${Date.now()}`,
      numero: novaVaga.numero.toUpperCase(),
      status: 'livre',
      tipo: novaVaga.tipo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setAllVagas([...allVagas, nova]);
    setNovaVaga({ numero: '', tipo: 'carro' });
    toast.success(`Vaga ${nova.numero} criada com sucesso`);
  };

  const handleEditarVaga = () => {
    if (!editingVaga) return;

    setAllVagas(allVagas.map(v => 
      v.id === editingVaga.id 
        ? { ...editingVaga, updated_at: new Date().toISOString() }
        : v
    ));
    setEditingVaga(null);
    toast.success('Vaga atualizada com sucesso');
  };

  const handleExcluirVaga = (vaga: Vaga) => {
    if (vaga.status === 'ocupada') {
      toast.error('Não é possível excluir uma vaga ocupada');
      return;
    }

    setAllVagas(allVagas.filter(v => v.id !== vaga.id));
    toast.success(`Vaga ${vaga.numero} excluída`);
  };

  const handleEditarTarifa = () => {
    if (!editingTarifa) return;

    setAllTarifas(allTarifas.map(t => 
      t.id === editingTarifa.id ? editingTarifa : t
    ));
    setEditingTarifa(null);
    toast.success('Tarifa atualizada com sucesso');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie vagas e tarifas do estacionamento
          </p>
        </div>

        <Tabs defaultValue="vagas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vagas" className="gap-2">
              <ParkingCircle className="h-4 w-4" />
              Vagas
            </TabsTrigger>
            <TabsTrigger value="tarifas" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Tarifas
            </TabsTrigger>
          </TabsList>

          {/* Vagas Tab */}
          <TabsContent value="vagas" className="space-y-6">
            {/* Nova Vaga */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nova Vaga
                </CardTitle>
                <CardDescription>
                  Adicione uma nova vaga ao estacionamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <Label htmlFor="numero-vaga">Número da Vaga</Label>
                    <Input
                      id="numero-vaga"
                      placeholder="Ex: E1, F2"
                      value={novaVaga.numero}
                      onChange={(e) => setNovaVaga(prev => ({ ...prev, numero: e.target.value.toUpperCase() }))}
                      className="font-mono uppercase"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <Label htmlFor="tipo-vaga">Tipo</Label>
                    <Select
                      value={novaVaga.tipo}
                      onValueChange={(value) => setNovaVaga(prev => ({ ...prev, tipo: value as SpotType }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carro">Carro</SelectItem>
                        <SelectItem value="moto">Moto</SelectItem>
                        <SelectItem value="deficiente">PCD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleCriarVaga} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Criar Vaga
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Vagas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Todas as Vagas
                </CardTitle>
                <CardDescription>
                  {allVagas.length} vaga(s) cadastrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allVagas.map((vaga) => (
                      <TableRow key={vaga.id}>
                        <TableCell className="font-mono font-medium">
                          {vaga.numero}
                        </TableCell>
                        <TableCell className="capitalize">{vaga.tipo}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            vaga.status === 'livre' 
                              ? 'bg-spot-free/10 text-spot-free'
                              : vaga.status === 'ocupada'
                              ? 'bg-spot-occupied/10 text-spot-occupied'
                              : 'bg-spot-maintenance/10 text-spot-maintenance'
                          }`}>
                            {vaga.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingVaga({ ...vaga })}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Vaga</DialogTitle>
                                  <DialogDescription>
                                    Altere os dados da vaga {vaga.numero}
                                  </DialogDescription>
                                </DialogHeader>
                                {editingVaga && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Número</Label>
                                      <Input
                                        value={editingVaga.numero}
                                        onChange={(e) => setEditingVaga(prev => 
                                          prev ? { ...prev, numero: e.target.value.toUpperCase() } : null
                                        )}
                                        className="font-mono uppercase"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Tipo</Label>
                                      <Select
                                        value={editingVaga.tipo}
                                        onValueChange={(value) => setEditingVaga(prev => 
                                          prev ? { ...prev, tipo: value as SpotType } : null
                                        )}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="carro">Carro</SelectItem>
                                          <SelectItem value="moto">Moto</SelectItem>
                                          <SelectItem value="deficiente">PCD</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select
                                        value={editingVaga.status}
                                        onValueChange={(value) => setEditingVaga(prev => 
                                          prev ? { ...prev, status: value as SpotStatus } : null
                                        )}
                                        disabled={editingVaga.status === 'ocupada'}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="livre">Livre</SelectItem>
                                          <SelectItem value="ocupada" disabled>Ocupada</SelectItem>
                                          <SelectItem value="manutencao">Manutenção</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button onClick={handleEditarVaga}>
                                    Salvar Alterações
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleExcluirVaga(vaga)}
                              disabled={vaga.status === 'ocupada'}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tarifas Tab */}
          <TabsContent value="tarifas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tabela de Tarifas
                </CardTitle>
                <CardDescription>
                  Configure os valores cobrados por tipo de veículo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Veículo</TableHead>
                      <TableHead>1ª Hora</TableHead>
                      <TableHead>Hora Adicional</TableHead>
                      <TableHead>Tolerância</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTarifas.map((tarifa) => (
                      <TableRow key={tarifa.id}>
                        <TableCell className="font-medium capitalize">
                          {tarifa.tipo_veiculo}
                        </TableCell>
                        <TableCell>R$ {tarifa.valor_primeira_hora.toFixed(2)}</TableCell>
                        <TableCell>R$ {tarifa.valor_hora_adicional.toFixed(2)}</TableCell>
                        <TableCell>{tarifa.tolerancia_minutos} min</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingTarifa({ ...tarifa })}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Tarifa</DialogTitle>
                                <DialogDescription>
                                  Altere os valores para {tarifa.tipo_veiculo}
                                </DialogDescription>
                              </DialogHeader>
                              {editingTarifa && (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Valor 1ª Hora (R$)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editingTarifa.valor_primeira_hora}
                                      onChange={(e) => setEditingTarifa(prev => 
                                        prev ? { ...prev, valor_primeira_hora: parseFloat(e.target.value) || 0 } : null
                                      )}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Valor Hora Adicional (R$)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={editingTarifa.valor_hora_adicional}
                                      onChange={(e) => setEditingTarifa(prev => 
                                        prev ? { ...prev, valor_hora_adicional: parseFloat(e.target.value) || 0 } : null
                                      )}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Tolerância (minutos)</Label>
                                    <Input
                                      type="number"
                                      value={editingTarifa.tolerancia_minutos}
                                      onChange={(e) => setEditingTarifa(prev => 
                                        prev ? { ...prev, tolerancia_minutos: parseInt(e.target.value) || 0 } : null
                                      )}
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button onClick={handleEditarTarifa}>
                                  Salvar Alterações
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
