# API Contract - parkIA Backend

Documento com descrição de todos os contratos (rotas, métodos, DTOs, parâmetros e respostas) da API do backend.

---

## 🚗 MÓDULO: VAGAS

### GET `/vagas`
- **Método**: GET
- **Descrição**: Listar vagas (opcionalmente filtrando por status e tipo)
- **Query Parameters**:
  - `status` (string, optional): enum [`livre`, `ocupada`, `manutencao`]
  - `tipo` (string, optional): enum [`carro`, `moto`, `deficiente`]
- **Body**: —
- **Response**: 
  - Status `200`: `Vaga[]`

### GET `/vagas/estatisticas`
- **Método**: GET
- **Descrição**: Retornar estatísticas de ocupação das vagas
- **Query Parameters**: —
- **Body**: —
- **Response**:
  - Status `200`: `VagaEstatisticasDto`
    - `total` (number)
    - `ocupadas` (number)
    - `livres` (number)
    - `percentualOcupacao` (number)

### POST `/vagas`
- **Método**: POST
- **Descrição**: Criar nova vaga
- **Query Parameters**: —
- **Body**: `CreateVagaDto`
  - `numero` (string, required)
  - `tipo` (enum [`carro`, `moto`, `deficiente`], required)
  - `status` (enum [`livre`, `ocupada`, `manutencao`], required)
- **Response**:
  - Status `201`: `Vaga`

### PUT `/vagas/:id`
- **Método**: PUT
- **Descrição**: Atualizar dados de uma vaga
- **Path Parameters**:
  - `id` (string, required)
- **Query Parameters**: —
- **Body**: `UpdateVagaDto`
  - `numero` (string, optional)
  - `tipo` (enum [`carro`, `moto`, `deficiente`], optional)
  - `status` (enum [`livre`, `ocupada`, `manutencao`], optional)
- **Response**:
  - Status `200`: `Vaga`

### DELETE `/vagas/:id`
- **Método**: DELETE
- **Descrição**: Remover vaga (não permitido se ocupada)
- **Path Parameters**:
  - `id` (string, required)
- **Query Parameters**: —
- **Body**: —
- **Response**:
  - Status `204`: void
  - Status `400`: Erro (não é permitido excluir vaga ocupada)

---

## 💰 MÓDULO: TARIFAS

### GET `/tarifas`
- **Método**: GET
- **Descrição**: Listar todas as tarifas de estacionamento
- **Query Parameters**: —
- **Body**: —
- **Response**:
  - Status `200`: `Tarifa[]`

### PUT `/tarifas/:id`
- **Método**: PUT
- **Descrição**: Atualizar dados de uma tarifa
- **Path Parameters**:
  - `id` (string, required)
- **Query Parameters**: —
- **Body**: `UpdateTarifaDto`
  - `tipo_veiculo` (enum [`carro`, `moto`], optional)
  - `valor_primeira_hora` (number, optional)
  - `valor_hora_adicional` (number, optional)
  - `tolerancia_minutos` (number, optional)
- **Response**:
  - Status `200`: `Tarifa`
  - Status `404`: Erro (tarifa não encontrada)

---

## 🚙 MÓDULO: MOVIMENTAÇÕES

### POST `/movimentacoes/entrada`
- **Método**: POST
- **Descrição**: Registrar entrada de veículo
- **Query Parameters**: —
- **Body**: `CreateMovimentacaoDto`
  - `vagaId` (string UUID, required)
  - `placa` (string, required)
  - `tipoVeiculo` (enum [`carro`, `moto`], required)
- **Response**:
  - Status `201`: `Movimentacao`
  - Status `400`: Erro (erro de validação ou regra de negócio)
  - Status `404`: Erro (vaga não encontrada)

### POST `/movimentacoes/saida`
- **Método**: POST
- **Descrição**: Registrar saída de veículo e calcular valor
- **Query Parameters**: —
- **Body**: `RegistrarSaidaDto`
  - `placa` (string, required)
- **Response**:
  - Status `201`: `Movimentacao` + computed fields
    - Retorna `Movimentacao` com campos adicionais:
      - `tempo_permanencia_minutos` (number)
      - `tarifa_aplicada` (object com: `tipo_veiculo`, `valor_primeira_hora`, `valor_hora_adicional`, `tolerancia_minutos`)
  - Status `404`: Erro (movimentação ativa não encontrada)

### GET `/movimentacoes`
- **Método**: GET
- **Descrição**: Listar movimentações ativas (veículos no pátio)
- **Query Parameters**: —
- **Body**: —
- **Response**:
  - Status `200`: `Movimentacao[]` (com relação `vaga` preenchida)

### GET `/movimentacoes/historico`
- **Método**: GET
- **Descrição**: Listar histórico de movimentações com filtro por data
- **Query Parameters**:
  - `dataInicio` (string date YYYY-MM-DD, optional)
  - `dataFim` (string date YYYY-MM-DD, optional)
- **Body**: —
- **Response**:
  - Status `200`: `Movimentacao[]` (saídas registradas)

---

## 📋 ENTITIES & DTOs

### Entity: Vaga
```
{
  id: string,
  numero: string,
  status: enum [livre, ocupada, manutencao],
  tipo: enum [carro, moto, deficiente],
  created_at: Date,
  updated_at: Date
}
```

### Entity: Tarifa
```
{
  id: string,
  tipo_veiculo: enum [carro, moto],
  valor_primeira_hora: number,
  valor_hora_adicional: number,
  tolerancia_minutos: number (default: 15)
}
```

### Entity: Movimentacao
```
{
  id: string,
  vaga: Vaga (relation),
  placa: string,
  tipo_veiculo: enum [carro, moto],
  entrada: Date,
  saida: Date | null,
  valor_pago: number | null
}
```

### DTO: CreateVagaDto
```
{
  numero: string (required),
  tipo: enum [carro, moto, deficiente] (required),
  status: enum [livre, ocupada, manutencao] (required)
}
```

### DTO: UpdateVagaDto
```
{
  numero: string (optional),
  tipo: enum [carro, moto, deficiente] (optional),
  status: enum [livre, ocupada, manutencao] (optional)
}
```

### DTO: CreateTarifaDto
```
{
  tipo_veiculo: enum [carro, moto] (required),
  valor_primeira_hora: number (required),
  valor_hora_adicional: number (required),
  tolerancia_minutos: number (optional)
}
```

### DTO: UpdateTarifaDto
```
{
  tipo_veiculo: enum [carro, moto] (optional),
  valor_primeira_hora: number (optional),
  valor_hora_adicional: number (optional),
  tolerancia_minutos: number (optional)
}
```

### DTO: CreateMovimentacaoDto
```
{
  vagaId: string UUID (required),
  placa: string (required),
  tipoVeiculo: enum [carro, moto] (required)
}
```

### DTO: RegistrarSaidaDto
```
{
  placa: string (required)
}
```

### DTO: HistoricoFilterDto
```
{
  dataInicio: string date YYYY-MM-DD (optional),
  dataFim: string date YYYY-MM-DD (optional)
}
```

### DTO: VagaEstatisticasDto
```
{
  total: number,
  ocupadas: number,
  livres: number,
  percentualOcupacao: number
}
```

---

## 📌 Notas Importantes

1. **Erros não documentados explicitamente**: Endpoints retornam erros padrão do NestJS (400, 404, 500) quando aplicável. Detalhes específicos consultá-los via controller/service.

2. **Relação Vaga**: Movimentações incluem a entidade `Vaga` completa (com `numero`, `status`, `tipo`).

3. **Cálculo de tarifa**: Na saída, o backend automaticamente calcula o tempo de permanência e aplica a tarifa correspondente ao tipo de veículo.

4. **Tolerância**: Tarifas possuem `tolerancia_minutos` (padrão 15) — períodos menores que esse valor não geram cobrança adicional.

---

**Documento gerado em**: 08 de janeiro de 2026  
**Status**: Pronto para refatoração do frontend
