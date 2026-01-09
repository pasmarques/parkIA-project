import { useState } from 'react';
import { Layout } from '@/shared/components/Layout';
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
import { useHistoricoMovimentacoes } from '@/shared/hooks/useMovimentacoes';
import { History, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Historico() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [placaFiltro, setPlacaFiltro] = useState('');

  const { data: historico = [] } = useHistoricoMovimentacoes({
    dataInicio: dataInicio || undefined,
    dataFim: dataFim || undefined
  });

  const filteredHistorico = historico.filter((mov) => {
    if (placaFiltro) {
      return mov.placa.toUpperCase().includes(placaFiltro.toUpperCase());
    }
    return true;
  });

  const totalReceita = filteredHistorico.reduce((acc, mov) => acc + (mov.valor_pago || 0), 0);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
            <p className="mt-1 text-muted-foreground">
              Consulte movimentações anteriores
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="placa-filtro">Placa</Label>
                <Input
                  id="placa-filtro"
                  placeholder="Buscar por placa"
                  value={placaFiltro}
                  onChange={(e) => setPlacaFiltro(e.target.value.toUpperCase())}
                  className="plate-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-inicio">Data Início</Label>
                <Input
                  id="data-inicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-fim">Data Fim</Label>
                <Input
                  id="data-fim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Resultados
                </CardTitle>
                <CardDescription>
                  {filteredHistorico.length} registro(s) encontrado(s)
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total no período</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {totalReceita.toFixed(2)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredHistorico.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <History className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Nenhuma movimentação encontrada</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistorico.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="font-mono font-medium">
                        {mov.placa}
                      </TableCell>
                      <TableCell className="capitalize">{mov.tipo_veiculo}</TableCell>
                      <TableCell>
                        {format(new Date(mov.entrada), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {mov.saida
                          ? format(new Date(mov.saida), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {(mov.valor_pago || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
