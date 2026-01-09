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

export interface Tarifa {
  id: string;
  tipo_veiculo: VehicleType;
  valor_primeira_hora: number;
  valor_hora_adicional: number;
  tolerancia_minutos: number;
}

export interface Movimentacao {
  vaga_id: string;
  id: string;
  vaga: Vaga;
  placa: string;
  tipo_veiculo: VehicleType;
  entrada: string;
  saida: string | null;
  valor_pago: number | null;
}

export interface SaidaResponse extends Movimentacao {
  tempo_permanencia_minutos: number;
  tarifa_aplicada: {
    tipo_veiculo: VehicleType;
    valor_primeira_hora: number;
    valor_hora_adicional: number;
    tolerancia_minutos: number;
  };
}

export interface VagaEstatisticasDto {
  total: number;
  ocupadas: number;
  livres: number;
  percentualOcupacao: number;
}

// DTOs para criação e atualização

export interface CreateVagaDto {
  numero: string;
  tipo: SpotType;
  status: SpotStatus;
}

export interface UpdateVagaDto extends Partial<CreateVagaDto> {}

export interface VagaFilterDto {
  status?: SpotStatus;
  tipo?: SpotType;
}

export interface CreateTarifaDto {
  tipo_veiculo: VehicleType;
  valor_primeira_hora: number;
  valor_hora_adicional: number;
  tolerancia_minutos?: number;
}

export interface UpdateTarifaDto extends Partial<CreateTarifaDto> {}

export interface CreateMovimentacaoDto {
  vagaId: string;
  placa: string;
  tipoVeiculo: VehicleType;
}

export interface RegistrarSaidaDto {
  placa: string;
}

export interface HistoricoFilterDto {
  dataInicio?: string;
  dataFim?: string;
}
