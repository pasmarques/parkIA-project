import { useState } from 'react';
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Vaga, SpotStatus, SpotType } from '@/shared/types/parking';
import { Plus, Pencil, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface VagasProps {
  vagas: Vaga[];
  onUpdateVagas: (vagas: Vaga[]) => void;
}

export function Vagas({ vagas: allVagas, onUpdateVagas: setAllVagas }: VagasProps) {
  const [novaVaga, setNovaVaga] = useState({
    numero: '',
    tipo: 'carro' as SpotType,
  });
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);

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

  return (
    <div className="space-y-6">
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
    </div>
  );
}
