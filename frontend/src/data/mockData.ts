import { Vaga, Movimentacao, Tarifa, VehicleType } from '@/types/parking';

// Generate parking spots
const generateVagas = (): Vaga[] => {
  const vagas: Vaga[] = [];
  const rows = ['A', 'B', 'C', 'D'];
  const statuses: ('livre' | 'ocupada' | 'manutencao')[] = ['livre', 'ocupada', 'manutencao'];
  const types: ('carro' | 'moto' | 'deficiente')[] = ['carro', 'moto', 'deficiente'];
  
  let id = 1;
  rows.forEach((row) => {
    for (let i = 1; i <= 8; i++) {
      const status = Math.random() < 0.4 ? 'ocupada' : Math.random() < 0.1 ? 'manutencao' : 'livre';
      const tipo = row === 'D' ? 'deficiente' : row === 'C' && i <= 4 ? 'moto' : 'carro';
      
      vagas.push({
        id: `vaga-${id}`,
        numero: `${row}${i}`,
        status,
        tipo,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      id++;
    }
  });
  
  return vagas;
};

export let vagas: Vaga[] = generateVagas();

export const tarifas: Tarifa[] = [
  {
    id: 'tarifa-1',
    tipo_veiculo: 'carro',
    valor_primeira_hora: 10.00,
    valor_hora_adicional: 5.00,
    tolerancia_minutos: 15,
  },
  {
    id: 'tarifa-2',
    tipo_veiculo: 'moto',
    valor_primeira_hora: 5.00,
    valor_hora_adicional: 2.50,
    tolerancia_minutos: 15,
  },
];

const placas = ['ABC-1234', 'XYZ-5678', 'DEF-9012', 'GHI-3456', 'JKL-7890', 'MNO-2345', 'PQR-6789'];

export let movimentacoes: Movimentacao[] = vagas
  .filter(v => v.status === 'ocupada')
  .map((vaga, index) => ({
    id: `mov-${index + 1}`,
    vaga_id: vaga.id,
    vaga,
    placa: placas[index % placas.length],
    tipo_veiculo: vaga.tipo === 'moto' ? 'moto' : 'carro' as VehicleType,
    entrada: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(),
    saida: null,
    valor_pago: null,
  }));

export const historicoMovimentacoes: Movimentacao[] = [
  {
    id: 'hist-1',
    vaga_id: 'vaga-1',
    placa: 'RST-1111',
    tipo_veiculo: 'carro',
    entrada: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    saida: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    valor_pago: 15.00,
  },
  {
    id: 'hist-2',
    vaga_id: 'vaga-5',
    placa: 'UVW-2222',
    tipo_veiculo: 'moto',
    entrada: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    saida: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    valor_pago: 7.50,
  },
];

// Helper functions
export const getEstatisticas = () => {
  const total = vagas.length;
  const ocupadas = vagas.filter(v => v.status === 'ocupada').length;
  const livres = vagas.filter(v => v.status === 'livre').length;
  const manutencao = vagas.filter(v => v.status === 'manutencao').length;
  const percentual_ocupacao = Math.round((ocupadas / total) * 100);
  
  const receitaDia = historicoMovimentacoes
    .filter(m => m.saida && new Date(m.saida).toDateString() === new Date().toDateString())
    .reduce((acc, m) => acc + (m.valor_pago || 0), 0);

  return {
    total,
    ocupadas,
    livres,
    manutencao,
    percentual_ocupacao,
    receita_dia: receitaDia + 125.50, // Mock additional revenue
  };
};

export const validarPlaca = (placa: string): boolean => {
  const padrao1 = /^[A-Z]{3}-\d{4}$/;
  const padrao2 = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  return padrao1.test(placa.toUpperCase()) || padrao2.test(placa.toUpperCase());
};

export const calcularValor = (entrada: Date, saida: Date, tipoVeiculo: VehicleType): number => {
  const tarifa = tarifas.find(t => t.tipo_veiculo === tipoVeiculo);
  if (!tarifa) return 0;

  const diffMs = saida.getTime() - entrada.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes <= tarifa.tolerancia_minutos) {
    return 0;
  }

  const diffHours = Math.ceil(diffMinutes / 60);
  
  if (diffHours <= 1) {
    return tarifa.valor_primeira_hora;
  }

  return tarifa.valor_primeira_hora + (diffHours - 1) * tarifa.valor_hora_adicional;
};

export const registrarEntrada = (vagaId: string, placa: string, tipoVeiculo: VehicleType): Movimentacao | null => {
  const vaga = vagas.find(v => v.id === vagaId);
  if (!vaga || vaga.status !== 'livre') return null;

  // Check vehicle compatibility
  if (tipoVeiculo === 'carro' && vaga.tipo === 'moto') return null;

  const novaMovimentacao: Movimentacao = {
    id: `mov-${Date.now()}`,
    vaga_id: vagaId,
    vaga,
    placa: placa.toUpperCase(),
    tipo_veiculo: tipoVeiculo,
    entrada: new Date().toISOString(),
    saida: null,
    valor_pago: null,
  };

  vaga.status = 'ocupada';
  movimentacoes.push(novaMovimentacao);

  return novaMovimentacao;
};

export const registrarSaida = (placa: string): { movimentacao: Movimentacao; valor: number } | null => {
  const index = movimentacoes.findIndex(m => m.placa.toUpperCase() === placa.toUpperCase() && !m.saida);
  if (index === -1) return null;

  const movimentacao = movimentacoes[index];
  const saida = new Date();
  const valor = calcularValor(new Date(movimentacao.entrada), saida, movimentacao.tipo_veiculo);

  movimentacao.saida = saida.toISOString();
  movimentacao.valor_pago = valor;

  const vaga = vagas.find(v => v.id === movimentacao.vaga_id);
  if (vaga) {
    vaga.status = 'livre';
  }

  historicoMovimentacoes.push({ ...movimentacao });
  movimentacoes.splice(index, 1);

  return { movimentacao, valor };
};
