import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
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
import { useTarifas } from '@/shared/hooks/useTarifas';
import { DollarSign, Pencil } from 'lucide-react';
import { toast } from 'sonner';

export function Tarifas() {
  const { data: allTarifas = [], updateTarifa } = useTarifas();
  const [editingTarifa, setEditingTarifa] = useState<Tarifa | null>(null);

  const handleEditarTarifa = async () => {
    if (!editingTarifa) return;

    try {
      await updateTarifa({
        id: editingTarifa.id,
        data: {
          valor_primeira_hora: editingTarifa.valor_primeira_hora,
          valor_hora_adicional: editingTarifa.valor_hora_adicional,
          tolerancia_minutos: editingTarifa.tolerancia_minutos,
        }
      });
      setEditingTarifa(null);
      toast.success('Tarifa atualizada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar tarifa');
    }
  };

  return (
    <div className="space-y-6">
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
                  <TableCell>R$ {Number(tarifa.valor_primeira_hora).toFixed(2)}</TableCell>
                  <TableCell>R$ {Number(tarifa.valor_hora_adicional).toFixed(2)}</TableCell>
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
    </div>
  );
}
