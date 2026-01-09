export type SpotStatus = 'livre' | 'ocupada' | 'manutencao';
export type SpotType = 'carro' | 'moto' | 'deficiente';
export type VehicleType = 'carro' | 'moto';

export interface Vaga {
  id: string;
  numero: string;
  status: SpotStatus;
  tipo: SpotType;
  created_at: string;
  updated_at: string;
}

export interface Movimentacao {
  id: string;
  vaga_id: string;
  vaga?: Vaga;
  placa: string;
  tipo_veiculo: VehicleType;
  entrada: string;
  saida: string | null;
  valor_pago: number | null;
}

export interface Tarifa {
  id: string;
  tipo_veiculo: VehicleType;
  valor_primeira_hora: number;
  valor_hora_adicional: number;
  tolerancia_minutos: number;
}

export interface Estatisticas {
  total: number;
  ocupadas: number;
  livres: number;
  manutencao: number;
  percentual_ocupacao: number;
  receita_dia: number;
}
