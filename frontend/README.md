# Documentação Técnica do Frontend - ParkIA

Este documento detalha as decisões técnicas, arquiteturais e de design adotadas no desenvolvimento do frontend da aplicação ParkIA. O objetivo é fornecer uma visão clara sobre como a aplicação foi estruturada e as justificativas para as escolhas tecnológicas.

## Visão Geral da Arquitetura

A aplicação foi construída utilizando **React** com **TypeScript**, servida através do **Vite**. A arquitetura segue uma abordagem modular, priorizando a separação de responsabilidades e a manutenibilidade a longo prazo.

### Estrutura de Pastas e Organização

Optou-se por uma estrutura baseada em funcionalidades (Feature-based Architecture) em vez da separação tradicional por tipos de arquivo. Esta decisão visa facilitar a escalabilidade do projeto.

- **src/features/**: Contém o código específico de cada domínio de negócio (ex: Dashboard, Gestão de Vagas, Histórico). Cada funcionalidade encapsula seus próprios componentes, hooks e lógica, mantendo o acoplamento baixo.
- **src/shared/**: Armazena componentes reutilizáveis (UI Kit), utilitários, hooks globais e definições de tipos que são compartilhados por toda a aplicação.

Essa organização permite que um desenvolvedor entenda todo o contexto de uma funcionalidade específica sem precisar navegar por diversas pastas dispersas.

## Decisões Técnicas Principais

### Gerenciamento de Estado e Dados (TanStack Query)

Para a comunicação com a API e gerenciamento do estado do servidor, foi adotada a biblioteca **TanStack Query (React Query)**.

**Justificativa:**
O estado do servidor (dados vindos da API) possui características diferentes do estado da interface (UI). O React Query foi escolhido porque:
1.  **Gerenciamento de Cache:** Automatiza o cacheamento, invalidação e atualização de dados em segundo plano, garantindo que o usuário sempre veja informações atualizadas sem recarregamentos desnecessários.
2.  **Estados de Carregamento e Erro:** Fornece nativamente indicadores de `isLoading` e `isError`, simplificando a lógica nos componentes visuais.
3.  **Otimização de Performance:** Evita requisições duplicadas e gerencia o ciclo de vida dos dados de forma eficiente, reduzindo a carga no backend.
4.  **Eliminação de Boilerplate:** Remove a necessidade de `useEffect` complexos e gerenciamento manual de estado global (como Redux) para dados assíncronos.

### Interface de Usuário e Estilização (Tailwind CSS e shadcn/ui)

A camada visual foi construída utilizando **Tailwind CSS** em conjunto com **shadcn/ui**.

**Justificativa:**
-   **Tailwind CSS:** Permite um desenvolvimento rápido através de classes utilitárias, garantindo consistência no design system (espaçamentos, cores, tipografia) e facilitando a implementação de responsividade.
-   **shadcn/ui:** Diferente de bibliotecas de componentes tradicionais, o shadcn/ui fornece componentes acessíveis (baseados no Radix UI) que são copiados diretamente para o código do projeto. Isso oferece controle total sobre a implementação e estilização, evitando as limitações de customização comuns em bibliotecas "caixa preta" como Material UI ou Bootstrap.

### Experiência do Usuário (UX) e Skeleton Loading

Para melhorar a percepção de performance, implementou-se o padrão de **Skeleton Screens** (telas de esqueleto) em substituição aos indicadores de carregamento tradicionais (spinners).

**Justificativa:**
-   **Percepção de Velocidade:** O Skeleton exibe uma estrutura visual da página antes que os dados sejam carregados, reduzindo a ansiedade do usuário e criando a sensação de que a aplicação é mais rápida.
-   **Estabilidade Visual (CLS):** Ao reservar o espaço que o conteúdo ocupará, evita-se o "Cumulative Layout Shift" (mudança repentina de layout), onde elementos pulam na tela quando os dados chegam.
-   **Consistência:** Os componentes de Skeleton foram centralizados em `src/shared/components/Skeletons.tsx` para garantir uniformidade visual em todas as telas (Dashboard, Vagas, Movimentações).

### Responsividade e Mobile-First

A aplicação foi projetada para ser totalmente responsiva, adaptando-se de desktops a dispositivos móveis pequenos.

**Estratégias adotadas:**
-   **Sidebar Adaptável:** Em telas desktop, a navegação é fixa lateralmente. Em dispositivos móveis, ela se transforma em um menu "Sheet" (gaveta) acessível via botão de hambúrguer, otimizando o espaço de tela.
-   **Vistas Alternativas:** Listas de dados complexas (como tabelas de vagas) são automaticamente convertidas para visualizações em "Cards" em dispositivos móveis, garantindo legibilidade sem a necessidade de rolagem horizontal excessiva.

## Qualidade de Código e Tipagem

O uso estrito de **TypeScript** foi mandatório para garantir a robustez do código. Interfaces claras foram definidas para todas as entidades (Vagas, Movimentações), prevenindo erros em tempo de execução e melhorando a experiência de desenvolvimento com autocompletar e validação estática.
