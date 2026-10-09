# Teste técnico QA — Verzel Store

Este projeto reúne o plano de teste, a automação E2E, os resultados e os bugs da história de **cupom de desconto e frete grátis**, considerando os critérios CA01 a CA11. Fonte: [documentação](VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md), linhas 7–21.

## Onde encontrar cada entrega

| Entrega | Local | Conteúdo |
|---|---|---|
| Plano de teste e cenários em Gherkin | [PLANO_TESTE_GHERKIN.md](relatorios/PLANO_TESTE_GHERKIN.md) | Objetivo, dados, pré-condições, cenários e resultado esperado |
| Relatório geral | [RELATORIO_GERAL.md](relatorios/RELATORIO_GERAL.md) | Escopo, resultados por critério, conclusão e pendências |
| Bug de quantidade | [BUG-01_LIMITE_QUANTIDADE_API.md](relatorios/bugs/BUG-01_LIMITE_QUANTIDADE_API.md) | Reprodução, esperado, obtido e impacto da aceitação de seis unidades pela API |
| Bug de frete | [BUG-02_FRETE_NO_LIMITE.md](relatorios/bugs/BUG-02_FRETE_NO_LIMITE.md) | Reprodução e capturas da cobrança de frete no subtotal exato de R$ 200,00 |
| Verificação dos 15 testes atuais | [VERIFICACAO_15_TESTES.md](relatorios/VERIFICACAO_15_TESTES.md) | Resultados da verificação auxiliar e limitação do runner oficial |
| Evidências | [relatorios/evidencias](relatorios/evidencias) | Requisições/respostas, registros de interface, resultados e capturas |
| Automação E2E | [README da automação](automacao-playwright/README.md) | Instalação, execução, configuração e estrutura do projeto |
| Automação funcional de API | [README do k6](automacao-k6/README.md) | Cenários de cupom e frete, execução e resultados da suíte de API |
| Enunciado recebido | [Teste tecnico QA Junior - Verzel.pdf](<Teste tecnico QA Junior - Verzel.pdf>) | Instruções do processo seletivo |
| Documentação de referência | [Documentação da loja](VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md) | História, critérios de aceite, dados e contrato da API |

Para compartilhar relatórios com suas evidências, envie a pasta [relatorios](relatorios) inteira. Os documentos usam caminhos relativos e referências de arquivo e linha. O relatório geral também contém contexto e valores suficientes para ser lido sozinho. Fonte: [RELATORIO_GERAL.md](relatorios/RELATORIO_GERAL.md), linha 11.

## Materiais históricos

[RELATORIO_QA_VERZEL.md](RELATORIO_QA_VERZEL.md) e [evidencias_qa/](evidencias_qa/) preservam análises e evidências anteriores ao recorte atual. Para avaliar a entrega vigente, comece pelos documentos de [relatorios/](relatorios/) e pela suíte em [automacao-playwright/tests/](automacao-playwright/tests/).

## Uso de IA

A IA utilizada foi o Codex, como apoio à análise da história, à execução de testes e à construção da automação. Primeiro, a história e a documentação da loja foram organizadas em um arquivo Markdown (`.md`), permitindo que a IA lesse os critérios de aceite, as regras de negócio e o contrato da API. Esse material serviu de referência para o trabalho: [documentação em Markdown](VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md), linhas 7–21 e 67–267.

Com essa referência, a IA auxiliou no levantamento dos cenários, na realização de requisições de teste à API e na execução assistida de cenários pela interface, como apoio aos testes manuais e exploratórios. Também apoiou a comparação entre os resultados esperados e obtidos, o registro das evidências e a elaboração dos relatórios de bugs e do plano em Gherkin. As formas de execução e suas limitações estão descritas no [relatório geral](relatorios/RELATORIO_GERAL.md), na seção “Ambiente, dados e método”.

Na automação, o Codex foi utilizado para criar os testes E2E em Playwright com TypeScript e organizar o projeto no padrão Page Object, separando seletores, ações, validações e specs. A IA também apoiou a revisão dos cenários para manter o escopo nos critérios de aceite e identificar possíveis duplicações. O código está em [automacao-playwright](automacao-playwright).

Após essas etapas, foi realizada uma análise manual do material produzido para conferir a aderência à história e aos critérios de aceite, revisar os resultados e as evidências e verificar a organização e a clareza dos testes e relatórios. Essa revisão complementou o uso da IA; não significa que todos os testes passaram ou que as pendências registradas foram resolvidas. Os resultados e as limitações permanecem documentados em [VERIFICACAO_15_TESTES.md](relatorios/VERIFICACAO_15_TESTES.md).

