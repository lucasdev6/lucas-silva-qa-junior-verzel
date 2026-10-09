# Relatório de testes — Cupom de desconto e frete grátis

## Objetivo e conclusão

Avaliar a história: **“Como cliente da Verzel Store, quero aplicar um cupom de desconto e ganhar frete grátis em compras maiores, para pagar menos nas minhas compras.”** A referência é exclusivamente CA01 a CA11 da documentação. Fontes: [documentacao.md, linha 7](evidencias/documentacao.md) e [documentacao.md, linhas 11–21](evidencias/documentacao.md).

**A entrega não atende integralmente aos critérios de aceite. Foram confirmados dois bugs:** cobrança de frete no subtotal exato de R$ 200,00 (CA06, com impacto também em CA08 quando há cupom) e aceitação de mais de cinco unidades de um produto pela API (CA10). São defeitos diferentes; as duas falhas automatizadas de frete representam variações do mesmo bug. Fontes: [playwright-frete.jsonl, linha 3](evidencias/playwright-frete.jsonl), [playwright-frete.jsonl, linha 6](evidencias/playwright-frete.jsonl) e [api_pedidos.jsonl, linha 1](evidencias/api_pedidos.jsonl).

**Recomendação de QA:** corrigir ambos antes de aprovar a história e repetir os testes dos critérios afetados. É uma avaliação baseada no descumprimento de CA06/CA10; não é uma decisão de negócio sobre publicação. Fontes: [documentacao.md, linha 16](evidencias/documentacao.md), [documentacao.md, linha 20](evidencias/documentacao.md) e evidências citadas acima.

Este documento contém contexto, regras, resultados e reprodução resumida dos bugs. Ele pode ser lido sozinho. A pasta `relatorios` reúne as fontes de apoio e os relatórios detalhados, sem depender de caminhos particulares do computador.

## Ambiente, dados e método

| Informação | Valor | Referência |
|---|---|---|
| Aplicação | Verzel Store — ambiente fictício de testes | [documentacao.md, linhas 269–279](evidencias/documentacao.md) |
| Endereço | https://verzel-store.qa-test-verzel-store.workers.dev | URL registrada em [interface-anterior.jsonl, linha 20](evidencias/interface-anterior.jsonl) |
| Documentação de origem | VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md | Cópia integral: [documentacao.md, linha 1](evidencias/documentacao.md) |
| Camiseta P001 | R$ 59,90 | [documentacao.md, linha 51](evidencias/documentacao.md) |
| Boné P004 | R$ 49,90 | [documentacao.md, linha 54](evidencias/documentacao.md) |
| Mochila P005 | R$ 100,00 | [documentacao.md, linha 55](evidencias/documentacao.md) |
| Garrafa P008 | R$ 50,00 | [documentacao.md, linha 58](evidencias/documentacao.md) |
| Jaqueta P007 | R$ 229,90 | [documentacao.md, linha 57](evidencias/documentacao.md) |
| Cupom válido | BEMVINDO10: 10% | [documentacao.md, linha 64](evidencias/documentacao.md) |
| Cupom expirado | VERAO2026: expirado em 31/03/2026 | [documentacao.md, linha 65](evidencias/documentacao.md) |
| Execução oficial disponível | Playwright / projeto Chromium; início em 07/10/2026 às 01:54:20 UTC | [playwright-frete.jsonl, linha 1](evidencias/playwright-frete.jsonl); original [evidencias/playwright-frete-original.json](evidencias/playwright-frete-original.json) |

Foram usados três conjuntos de evidências, com limites diferentes:

1. **Runner oficial Playwright:** seis testes de frete, quatro aprovados e dois reprovados. Essa execução local registrada substitui a informação anterior de que só havia tentativas bloqueadas para esses seis casos. Fonte: [playwright-frete.jsonl, linhas 1–6](evidencias/playwright-frete.jsonl).
2. **Verificação auxiliar anterior pela interface:** confirma aplicação/normalização de cupons, rejeições, remoção/reaplicação e limite visual de quantidade. Foi executada pela ferramenta de navegador com asserções auxiliares; não é uma execução oficial completa do Playwright Test. Fontes: [interface-anterior.jsonl, linha 1](evidencias/interface-anterior.jsonl), [interface-anterior.jsonl, linhas 11–15](evidencias/interface-anterior.jsonl) e [interface-anterior.jsonl, linha 17](evidencias/interface-anterior.jsonl).
3. **Requisições funcionais anteriores à API:** usadas aqui para comprovar critérios da história, sobretudo o limite exigido pelo CA10. O corpo e a resposta estão registrados, mas esses arquivos não contêm horário de coleta. Fontes: [api_carrinho.jsonl, linha 8](evidencias/api_carrinho.jsonl) e [api_pedidos.jsonl, linha 1](evidencias/api_pedidos.jsonl).

Não foram somados resultados dessas três execuções como se fossem uma única suíte. Esta revisão reorganiza resultados já registrados; não é uma nova execução integral da suíte revisada.

## Escopo

Incluídos: desconto de 10%; normalização; cupom inválido/expirado; cupom único e remoção; frete inclusivo em R$ 200,00; faltante; uso do subtotal anterior ao desconto; não descontar o frete; limite de cinco unidades na interface e API; duas casas decimais. Fonte: [documentacao.md, linhas 11–21](evidencias/documentacao.md).

Retirados deste relatório, do plano e dos specs ativos: validação de nome/e-mail/CEP, checkout vazio, persistência/isolamento entre abas, cupom vazio e regras de esvaziamento do carrinho. A confirmação da compra permanece somente como ponto de observação dos valores de cupom/frete; preencher dados válidos é preparação, não um teste desses campos. Referência de escopo: [documentacao.md, linhas 11–21](evidencias/documentacao.md); nome/e-mail/CEP e isolamento estão fora desse recorte, em [documentacao.md, linhas 40–42](evidencias/documentacao.md) e [documentacao.md, linha 273](evidencias/documentacao.md).

## Resultado por critério de aceite

“Conforme nas amostras” significa que os dados executados atenderam à regra; não significa cobertura de todas as combinações possíveis. “Parcial” identifica a limitação explicitamente.

| Critério | Regra resumida | Resultado observado | Situação e fonte |
|---|---|---|---|
| CA01 | 10% sobre produtos | R$ 59,90 → desconto R$ 5,99; total com frete R$ 73,81 | Conforme nas amostras. [interface-anterior.jsonl, linha 11](evidencias/interface-anterior.jsonl) |
| CA02 | Ignorar caixa e espaços externos | BEMVINDO10, bemvindo10 e “  BeMvInDo10  ” aplicados | Conforme nas amostras. [interface-anterior.jsonl, linhas 11–13](evidencias/interface-anterior.jsonl) |
| CA03 | Inexistente: “Cupom inválido.”, sem desconto | QA_INVALIDO rejeitado; desconto zero | Conforme na verificação auxiliar; mensagem exigida no cenário registrado. [interface-anterior.jsonl, linha 14](evidencias/interface-anterior.jsonl); resposta com mensagem em [api_carrinho.jsonl, linha 7](evidencias/api_carrinho.jsonl) |
| CA04 | Expirado: “Cupom expirado.”, sem desconto | VERAO2026 rejeitado; desconto zero | Conforme na verificação auxiliar; resposta com mensagem em API. [interface-anterior.jsonl, linha 15](evidencias/interface-anterior.jsonl); [api_carrinho.jsonl, linha 6](evidencias/api_carrinho.jsonl) |
| CA05 | Somente um cupom; remover para trocar | Campo indisponível após aplicar; remoção/reaplicação verificadas | **Parcial:** não existe segundo cupom válido fornecido para comprovar troca entre dois válidos. [interface-anterior.jsonl, linha 17](evidencias/interface-anterior.jsonl); [documentacao.md, linhas 64–65](evidencias/documentacao.md) |
| CA06 | Frete grátis a partir de R$ 200,00, inclusive | R$ 229,90 passou; exatamente R$ 200,00 cobrou R$ 19,90 | **Reprovado — BUG-02.** [playwright-frete.jsonl, linhas 3–4](evidencias/playwright-frete.jsonl) |
| CA07 | Abaixo de R$ 200,00: frete R$ 19,90 e faltante | R$ 59,90 → falta R$ 140,10; R$ 199,60 → falta R$ 0,40 | Conforme nas amostras. [playwright-frete.jsonl, linhas 1–2](evidencias/playwright-frete.jsonl); texto visível em [interface-anterior.jsonl, linhas 18–19](evidencias/interface-anterior.jsonl) |
| CA08 | Frete pelo subtotal antes do desconto | R$ 209,90 → líquido R$ 188,91, frete zero; em R$ 200,00 com cupom houve cobrança | Conforme acima do limite, **reprovado no limite por BUG-02**. [playwright-frete.jsonl, linhas 5–6](evidencias/playwright-frete.jsonl) |
| CA09 | Desconto não incide no frete | Subtotal 59,90, desconto 5,99 e frete mantido em 19,90 | Conforme nas amostras. [interface-anterior.jsonl, linha 11](evidencias/interface-anterior.jsonl) |
| CA10 | Máximo 5 por produto na interface e API | Interface bloqueia sexta unidade; API calcula e confirma 6 | **Reprovado — BUG-01.** [interface-anterior.jsonl, linha 1](evidencias/interface-anterior.jsonl); [api_carrinho.jsonl, linha 8](evidencias/api_carrinho.jsonl); [api_pedidos.jsonl, linha 1](evidencias/api_pedidos.jsonl) |
| CA11 | Valores com duas casas decimais | 5,99 de desconto / 73,81 total; 20,99 / 188,91 | Conforme nas amostras disponíveis; não foi demonstrado caso de meia fração de centavo. [interface-anterior.jsonl, linha 11](evidencias/interface-anterior.jsonl), [interface-anterior.jsonl, linha 22](evidencias/interface-anterior.jsonl) |

As regras completas estão em [documentacao.md, linhas 11–21](evidencias/documentacao.md). O plano em [PLANO_TESTE_GHERKIN.md](PLANO_TESTE_GHERKIN.md) descreve os cenários planejados; um cenário estar escrito no plano não significa que já foi executado.

## Bugs confirmados — prioridade alta

### BUG-02 — Frete cobrado em compra de exatamente R$ 200,00

**Reprodução pela interface:** abrir a loja, adicionar duas Mochilas Urbanas 20L de R$ 100,00 e abrir o carrinho. Sem cupom, esperar frete grátis e total R$ 200,00; o observado foi frete R$ 19,90 e total R$ 219,90. Fonte: [interface-anterior.jsonl, linha 20](evidencias/interface-anterior.jsonl); falha oficial: [playwright-frete.jsonl, linha 3](evidencias/playwright-frete.jsonl).

Com BEMVINDO10, esperar subtotal R$ 200,00, desconto R$ 20,00, frete zero e total R$ 180,00. O carrinho e a confirmação exibiram total R$ 199,90. **Impacto: acréscimo indevido de R$ 19,90 nessa condição.** Fontes: [playwright-frete.jsonl, linha 6](evidencias/playwright-frete.jsonl); confirmação em [interface-anterior.jsonl, linha 23](evidencias/interface-anterior.jsonl); regras em [documentacao.md, linha 11](evidencias/documentacao.md), [documentacao.md, linha 16](evidencias/documentacao.md), [documentacao.md, linha 18](evidencias/documentacao.md) e [documentacao.md, linha 28](evidencias/documentacao.md).

A mensagem “Faltam R$ 0,00 para o frete grátis.” aparece na variação sem cupom. Ela é evidência adicional da inconsistência, não um terceiro bug independente. Fonte: [interface-anterior.jsonl, linha 20](evidencias/interface-anterior.jsonl).

Detalhamento: [bugs/BUG-02_FRETE_NO_LIMITE.md](bugs/BUG-02_FRETE_NO_LIMITE.md).

### BUG-01 — API confirma produto com mais de cinco unidades

**Reprodução:** enviar um cálculo ou pedido com `produtoId: "P005"` e `quantidade: 6`. O esperado é rejeição; a API devolveu HTTP 200 no cálculo e HTTP 201 no pedido, com seis unidades e subtotal R$ 600,00. **Impacto: pedido em desacordo com CA10, apesar do bloqueio visual.** Fontes: [documentacao.md, linha 20](evidencias/documentacao.md), [documentacao.md, linha 264](evidencias/documentacao.md); [api_carrinho.jsonl, linha 8](evidencias/api_carrinho.jsonl); [api_pedidos.jsonl, linha 1](evidencias/api_pedidos.jsonl).

Detalhamento: [bugs/BUG-01_LIMITE_QUANTIDADE_API.md](bugs/BUG-01_LIMITE_QUANTIDADE_API.md).

## Pendências para aprovação

- Corrigir BUG-01 e BUG-02 e repetir suas reproduções. Referência: critérios CA06/CA10 em [documentacao.md, linha 16](evidencias/documentacao.md), [documentacao.md, linha 20](evidencias/documentacao.md).
- Executar integralmente a suíte atual, já recortada para os critérios, e guardar o relatório oficial novo. Os resultados acima pertencem às execuções descritas na seção de método.
- Para concluir a troca entre dois cupons válidos de CA05, obter um segundo código válido autorizado. **Não sei se essa troca funciona** com os dados fornecidos; só há BEMVINDO10 válido e VERAO2026 expirado. Fonte: [documentacao.md, linhas 64–65](evidencias/documentacao.md).
- A causa exata no código-fonte do backend é desconhecida: as respostas demonstram o comportamento, não a linha responsável pela implementação. Fontes: [api_carrinho.jsonl, linha 2](evidencias/api_carrinho.jsonl), [api_carrinho.jsonl, linha 8](evidencias/api_carrinho.jsonl).

## Interpretações adotadas

- CA10 permanece no escopo mesmo sendo uma regra de quantidade, porque é um critério explícito e exige interface e API. Fonte: [documentacao.md, linha 20](evidencias/documentacao.md).
- Os seis testes oficiais de frete foram executados antes deste recorte; seus resultados podem fundamentar os mesmos critérios, mas não comprovam execução integral dos specs atuais. Fonte: [playwright-frete.jsonl, linhas 1–6](evidencias/playwright-frete.jsonl).
- Valores JSON como `19.9` representam R$ 19,90; não são bug de arredondamento apenas por omitir o zero final. Fonte: [documentacao.md, linhas 81–87](evidencias/documentacao.md).

## Como conferir as referências

A notação `arquivo:linha` indica a linha real do arquivo dentro desta pasta. Para linhas de JSONL, cada linha contém um registro completo. As tabelas e reproduções acima contêm os dados essenciais para entender este documento sozinho; a pasta de evidências permite conferir a origem. Nenhuma linha de código do backend foi inventada.
