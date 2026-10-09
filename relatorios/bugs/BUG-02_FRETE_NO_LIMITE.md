# BUG-02 — Cobrança indevida de frete no subtotal de R$ 200,00

## Resumo

A Verzel Store cobra R$ 19,90 de frete quando o subtotal dos produtos é exatamente R$ 200,00. A documentação inclui esse valor no frete grátis. O problema ocorre sem cupom e com BEMVINDO10, inclusive na confirmação da compra. Fontes: [documentacao.md, linha 16](../evidencias/documentacao.md), [documentacao.md, linha 18](../evidencias/documentacao.md); [playwright-frete.jsonl, linha 3](../evidencias/playwright-frete.jsonl), [playwright-frete.jsonl, linha 6](../evidencias/playwright-frete.jsonl).

| Campo | Informação |
|---|---|
| História | Aplicar cupom e ganhar frete grátis para pagar menos |
| Critérios afetados | CA06 e CA08 na combinação com cupom |
| Ambiente | https://verzel-store.qa-test-verzel-store.workers.dev |
| Camada | Carrinho e confirmação; cálculo/pedido da API também reproduzem |
| Severidade / prioridade sugeridas | Alta / alta, pelo acréscimo indevido de R$ 19,90 |
| Situação | Confirmado nas evidências; correção ainda não verificada |

Referências da tabela: história/critério em [documentacao.md, linha 7](../evidencias/documentacao.md), [documentacao.md, linha 16](../evidencias/documentacao.md), [documentacao.md, linha 18](../evidencias/documentacao.md); interface em [interface-anterior.jsonl, linha 20](../evidencias/interface-anterior.jsonl), [interface-anterior.jsonl, linha 23](../evidencias/interface-anterior.jsonl); API em [api_carrinho.jsonl, linhas 2–3](../evidencias/api_carrinho.jsonl) e [api_pedidos.jsonl, linhas 2–3](../evidencias/api_pedidos.jsonl). A prioridade é uma avaliação de QA baseada nesse impacto.

## Pré-condições e dados

Abrir a loja com carrinho vazio. Usar P005 — Mochila Urbana 20L, R$ 100,00 cada; duas unidades formam subtotal R$ 200,00. Cupom válido BEMVINDO10 dá 10% sobre produtos. Fontes: [documentacao.md, linha 55](../evidencias/documentacao.md), [documentacao.md, linha 64](../evidencias/documentacao.md).

## Passos de reprodução

1. Acessar o endereço da loja.
2. Adicionar duas Mochilas Urbanas 20L.
3. Abrir o carrinho e conferir o frete e o total.
4. Aplicar BEMVINDO10 e conferir novamente.
5. Finalizar a compra com dados válidos e conferir os mesmos valores na confirmação.

Roteiro reproduzido nas evidências [interface-anterior.jsonl, linha 20](../evidencias/interface-anterior.jsonl), [interface-anterior.jsonl, linha 23](../evidencias/interface-anterior.jsonl); execução oficial com falha em [playwright-frete.jsonl, linha 3](../evidencias/playwright-frete.jsonl), [playwright-frete.jsonl, linha 6](../evidencias/playwright-frete.jsonl).

## Resultado esperado e obtido

| Situação | Subtotal | Desconto | Frete esperado | Frete obtido | Total esperado | Total obtido |
|---|---:|---:|---:|---:|---:|---:|
| Sem cupom, carrinho | 200,00 | 0,00 | 0,00 | 19,90 | 200,00 | 219,90 |
| BEMVINDO10, carrinho e confirmação | 200,00 | 20,00 | 0,00 | 19,90 | 180,00 | 199,90 |

Valores em reais. Esperado por CA01, CA06, CA08 e fórmula de total: [documentacao.md, linha 11](../evidencias/documentacao.md), [documentacao.md, linha 16](../evidencias/documentacao.md), [documentacao.md, linha 18](../evidencias/documentacao.md), [documentacao.md, linha 28](../evidencias/documentacao.md). Obtido: [interface-anterior.jsonl, linha 20](../evidencias/interface-anterior.jsonl), [interface-anterior.jsonl, linha 23](../evidencias/interface-anterior.jsonl); asserções oficiais: [playwright-frete.jsonl, linha 3](../evidencias/playwright-frete.jsonl), [playwright-frete.jsonl, linha 6](../evidencias/playwright-frete.jsonl).

O carrinho sem cupom ainda mostra “Faltam R$ 0,00 para o frete grátis.”. Fonte: [interface-anterior.jsonl, linha 20](../evidencias/interface-anterior.jsonl).

## Evidência resumida

```text
Sem cupom: subtotal 200,00 / frete 19,90 / total 219,90.
Com cupom: subtotal 200,00 / desconto 20,00 / frete 19,90 / total 199,90.
Playwright: esperado “Grátis”; recebido “R$ 19,90”.
```

Fontes: [interface-anterior.jsonl, linha 20](../evidencias/interface-anterior.jsonl), [interface-anterior.jsonl, linha 23](../evidencias/interface-anterior.jsonl); [playwright-frete.jsonl, linha 3](../evidencias/playwright-frete.jsonl), [playwright-frete.jsonl, linha 6](../evidencias/playwright-frete.jsonl). Esses trechos permitem entender a falha sem abrir outro relatório.

## Capturas da execução oficial

As capturas preservadas junto ao resultado local mostram a falha nos cenários sem cupom e com cupom. Elas são material de apoio aos valores transcritos acima; as asserções completas estão em [playwright-frete.jsonl, linha 3](../evidencias/playwright-frete.jsonl) e [playwright-frete.jsonl, linha 6](../evidencias/playwright-frete.jsonl).

![Carrinho no limite sem cupom](../evidencias/frete-sem-cupom-screenshot.png)

![Confirmação no limite com cupom](../evidencias/frete-com-cupom-screenshot.png)

## Critérios de reteste

Validar subtotal abaixo de 200, exatamente 200 e acima de 200, com e sem cupom; garantir frete pelo subtotal anterior ao desconto. A cobrança deve ser zero em 200 e acima. Fontes: CA06–CA09 em [documentacao.md, linhas 16–19](../evidencias/documentacao.md). Cenários: CT05–CT09 do plano.

Não sei a causa exata ou a linha do backend responsável; não foi fornecido esse código-fonte. Este relatório descreve o comportamento comprovado pelas respostas e telas citadas.
