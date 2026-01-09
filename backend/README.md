# Documentação Técnica do Backend - ParkIA

Este documento descreve as principais decisões técnicas adotadas no desenvolvimento do backend do projeto ParkIA, bem como os critérios utilizados para escolhê-las. O objetivo é explicitar o raciocínio técnico por trás das escolhas feitas, considerando boas práticas de mercado, clareza arquitetural e aderência ao escopo proposto.

## Stack e Arquitetura Geral

O backend foi desenvolvido utilizando **NestJS** com **TypeScript**, adotando uma arquitetura modular baseada em domínio. Cada domínio principal do sistema possui seu próprio módulo, contendo controllers, services, entidades e DTOs.

Essa abordagem foi escolhida por:
-   Incentivar separação clara de responsabilidades.
-   Facilitar manutenção e evolução do código.
-   Tornar regras de negócio mais explícitas e testáveis.
-   Ser amplamente utilizada em projetos reais com NestJS.

A estrutura do projeto reflete diretamente os domínios do problema (**vagas**, **tarifas** e **movimentações**), evitando camadas genéricas excessivas e mantendo o código próximo do negócio.

## Decisões Técnicas Principais

### Modelagem de Banco de Dados e Normalização

Após análise da modelagem proposta, concluiu-se que o modelo já se encontrava normalizado, atendendo aos critérios da Terceira Forma Normal (3FN).

Essa conclusão baseou-se nos seguintes fatores:
-   Cada tabela representa um único conceito do domínio.
-   Não há duplicação de informações entre tabelas.
-   Atributos dependem exclusivamente da chave primária de suas respectivas entidades.
-   Regras de precificação estão centralizadas na tabela de tarifas, evitando dependências transitivas.

Optou-se por manter integralmente a modelagem proposta, concentrando esforços na correta implementação das regras de negócio.

### Integridade Referencial e Exclusão de Vagas

Foi considerada a implementação de *soft delete* para vagas com histórico. No entanto, para respeitar estritamente a modelagem fornecida no desafio, a decisão final foi preservar a integridade referencial do banco de dados, impedindo a exclusão física de vagas que possuam movimentações associadas.

### Gerenciamento de Schema (Migrations)

O gerenciamento do banco de dados foi realizado exclusivamente via **migrations manuais**, com a opção `synchronize` do TypeORM desabilitada em produção.

Motivos para escrita manual das migrations:
-   Maior controle sobre o schema final.
-   Evitar mudanças implícitas e não versionadas.
-   Tornar explícitas todas as alterações estruturais.
-   Garantir previsibilidade entre ambientes (dev, test, prod).

### Enum no Código vs VARCHAR no Banco

Embora campos como `status`, `tipo` e `tipo_veiculo` sejam tratados como enums na aplicação, no banco de dados optou-se pelo uso de `VARCHAR`.

**Justificativa:**
-   **Flexibilidade:** Enums nativos do banco dificultam alterações futuras (exigem comandos complexos de `ALTER TYPE`).
-   **Segurança:** O controle dos valores válidos é garantido na camada de aplicação via TypeScript Enums e validação de DTOs (Data Transfer Objects).
-   **Manutenibilidade:** Deploys tornam-se menos arriscados e compatíveis entre versões.

### Organização das Regras de Negócio

As regras de negócio sensíveis (entrada/saída de veículos, cálculo de valor, alteração de status) foram concentradas exclusivamente nos **Services**.

Os **Controllers** atuam apenas como camada de entrada HTTP, delegando a lógica. Isso facilita testes unitários e permite a reutilização futura das regras em outros contextos (ex: filas, jobs, integrações).

## Dados Iniciais (Seeds)

Foram criados scripts de seed apenas para **vagas** e **tarifas**.

A decisão de não criar seed para movimentações foi intencional:
-   Movimentações representam eventos temporais dinâmicos.
-   Dados artificiais poderiam mascarar erros nas regras de entrada/saída.
-   O fluxo ideal é que movimentações sejam geradas pelo uso real da API, garantindo a consistência do fluxo completo.

## Estratégia de Testes

O foco dos testes automatizados (E2E/Integração) foi direcionado para os endpoints críticos do sistema:
-   Entrada de movimentação.
-   Saída de movimentação.
-   Consulta de vagas.
-   Atualização de tarifas.

Essa escolha prioriza a validação das regras de negócio que trazem maior valor e risco ao sistema.

## Conclusão

As decisões técnicas deste backend foram tomadas com base em três pilares principais:
1.  Aderência ao escopo e à modelagem proposta.
2.  Clareza arquitetural e organização por domínio.
3.  Boas práticas de mercado para projetos escaláveis.

O resultado é uma aplicação robusta, simples de manter e alinhada com os requisitos funcionais e não funcionais do desafio.
