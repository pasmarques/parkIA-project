import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Movimentacao } from '@/shared/types/parking';

export const exportarHistoricoPdf = (movimentacoes: Movimentacao[], periodo?: { inicio?: string, fim?: string }) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Histórico de Movimentações', 14, 22);

  doc.setFontSize(10);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, 14, 30);
  
  if (periodo?.inicio || periodo?.fim) {
    const inicio = periodo.inicio ? format(new Date(periodo.inicio), "dd/MM/yyyy", { locale: ptBR }) : 'Início';
    const fim = periodo.fim ? format(new Date(periodo.fim), "dd/MM/yyyy", { locale: ptBR }) : 'Fim';
    doc.text(`Período: ${inicio} até ${fim}`, 14, 36);
  }

  const tableData = movimentacoes.map(mov => [
    mov.placa,
    mov.tipo_veiculo.charAt(0).toUpperCase() + mov.tipo_veiculo.slice(1),
    format(new Date(mov.entrada), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    mov.saida ? format(new Date(mov.saida), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '-',
    mov.valor_pago ? `R$ ${Number(mov.valor_pago).toFixed(2)}` : '-'
  ]);

  const total = movimentacoes.reduce((acc, mov) => acc + (mov.valor_pago || 0), 0);
  tableData.push(['', '', '', 'TOTAL', `R$ ${total.toFixed(2)}`]);

  autoTable(doc, {
    head: [['Placa', 'Tipo', 'Entrada', 'Saída', 'Valor']],
    body: tableData,
    startY: 45,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }, // Azul padrão
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });

  doc.save('historico-movimentacoes.pdf');
};
