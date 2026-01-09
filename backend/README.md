Decisões Técnicas – Backend

Este documento descreve as principais decisões técnicas adotadas no desenvolvimento do backend deste projeto, bem como os critérios utilizados para escolhê-las.
O objetivo é explicitar o raciocínio técnico por trás das escolhas feitas, considerando boas práticas de mercado, clareza arquitetural e aderência ao escopo proposto no desafio.

Stack e Arquitetura Geral

O backend foi desenvolvido utilizando NestJS com TypeScript, adotando uma arquitetura modular baseada em domínio. Cada domínio principal do sistema possui seu próprio módulo, contendo controller, service, entidades e DTOs.

Essa abordagem foi escolhida por:

Incentivar separação clara de responsabilidades

Facilitar manutenção e evolução do código

Tornar regras de negócio mais explícitas e testáveis

Ser amplamente utilizada em projetos reais com NestJS

A estrutura do projeto reflete diretamente os domínios do problema (vagas, tarifas e movimentações), evitando camadas genéricas excessivas e mantendo o código próximo do negócio.

Modelagem de Banco de Dados e Normalização

Antes de iniciar a implementação, foi feita uma análise da modelagem proposta no desafio.
Com base nessa análise, foi possível concluir que o modelo já se encontrava normalizado, atendendo aos principais critérios de normalização esperados para esse tipo de sistema, especialmente até a Terceira Forma Normal (3FN).

Essa conclusão foi baseada nos seguintes fatores:

Cada tabela representa um único conceito do domínio (vagas, movimentações e tarifas)

Não há duplicação de informações entre tabelas

Atributos dependem exclusivamente da chave primária de suas respectivas entidades

Regras de precificação estão centralizadas na tabela de tarifas, evitando dependências transitivas

Dessa forma, optou-se por manter integralmente a modelagem proposta, concentrando os esforços na correta implementação das regras de negócio e não em alterações estruturais desnecessárias.

Integridade Referencial e Exclusão de Vagas

Durante a análise da modelagem, foi considerada a possibilidade de permitir a exclusão de vagas mesmo quando vinculadas a movimentações históricas, por meio de estratégias como:

Soft delete

Nullificação da foreign key

Tabelas intermediárias ou histórico desacoplado

No entanto, observando o escopo e a modelagem explicitamente fornecida no desafio, essa abordagem não se mostrou compatível com o que foi solicitado.
Por esse motivo, a decisão foi preservar a integridade referencial, impedindo a exclusão de vagas que possuam movimentações associadas, respeitando fielmente o modelo entregue.

Essa decisão demonstra aderência ao enunciado e evita introduzir comportamentos não previstos no desafio.

Uso de Migrations (e por que são manuais)

O gerenciamento do schema do banco foi feito exclusivamente via migrations, com synchronize desabilitado.

As migrations foram escritas manualmente, em vez de serem geradas automaticamente a partir das entidades. Essa decisão foi tomada pelos seguintes motivos:

Maior controle sobre o schema final no banco

Evitar mudanças implícitas e não versionadas

Tornar explícitas todas as alterações estruturais

Garantir previsibilidade entre ambientes (dev, test, prod)

Em cenários reais, migrations automáticas podem gerar comandos não desejados, especialmente em bancos já existentes. A escrita manual força uma validação consciente de cada mudança.

Enum no Código vs VARCHAR no Banco

Embora o desafio mencione campos como status, tipo e tipo_veiculo como enums, foi adotada a seguinte estratégia:

Enums no código TypeScript

VARCHAR no banco de dados

Essa decisão foi tomada por motivos técnicos e práticos:

Enums no banco dificultam alterações futuras (exigem ALTER TYPE)

Enums no banco tornam deploys mais arriscados

VARCHAR oferece maior flexibilidade sem perder controle, desde que validado na aplicação

O controle dos valores válidos é garantido no código, por meio de enums TypeScript, validações nos DTOs e regras de negócio no service.

Assim, o banco permanece flexível, enquanto a aplicação mantém consistência e segurança.

Organização das Regras de Negócio

As regras de negócio mais sensíveis — como:

Entrada de veículo

Saída de veículo

Cálculo de valor a pagar

Alteração automática do status da vaga

Foram concentradas nos services, e não nos controllers.

Os controllers atuam apenas como camada de entrada HTTP, delegando completamente a lógica para os services.
Isso facilita testes, manutenção e reutilização futura dessas regras (ex: filas, jobs, integrações).

Seeds de Dados Iniciais

Foram criados seeds apenas para vagas e tarifas.

A decisão de não criar seed para movimentações foi intencional e baseada em critérios técnicos:

Movimentações representam eventos temporais

Seeds de movimentação criariam dados artificiais e pouco realistas

Poderiam mascarar erros em regras de entrada/saída

O fluxo correto é que movimentações sejam criadas via API

Assim, o sistema inicia com dados estruturais prontos, e os dados transacionais surgem a partir do uso real da aplicação.

Testes Automatizados (Escopo Intencional)

O foco dos testes automatizados foi direcionado para os endpoints principais, que representam o núcleo do sistema:

Entrada de movimentação

Saída de movimentação

Consulta de vagas

Atualização de tarifas

Essa escolha prioriza a validação das regras de negócio mais críticas, em vez de buscar cobertura total sem ganho real de valor no contexto do desafio.

Conclusão

As decisões técnicas deste backend foram tomadas com base em três pilares principais:

Aderência ao escopo e à modelagem proposta no desafio

Clareza arquitetural e organização por domínio

Boas práticas utilizadas em projetos reais de médio porte

Sempre que uma alternativa mais sofisticada foi considerada, a decisão final levou em conta o equilíbrio entre robustez técnica, simplicidade e alinhamento com o que foi solicitado pelo desafio.