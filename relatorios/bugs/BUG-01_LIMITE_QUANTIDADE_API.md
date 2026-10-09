# BUG-01 — API aceita mais de cinco unidades do mesmo produto

## Resumo

CA10 determina no máximo cinco unidades de cada produto por pedido, tanto na interface quanto na API. A interface bloqueia a sexta unidade, mas a API calcula e confirma uma requisição com seis unidades. Fontes: [documentacao.md, linha 20](../evidencias/documentacao.md); [interface-anterior.jsonl, linha 1](../evidencias/interface-anterior.jsonl); [api_carrinho.jsonl, linha 8](../evidencias/api_carrinho.jsonl); [api_pedidos.jsonl, linha 1](../evidencias/api_pedidos.jsonl).

| Campo | Informação |
|---|---|
| Critério afetado | CA10 |
| Endereço | https://verzel-store.qa-test-verzel-store.workers.dev |
| Endpoints | POST /api/carrinho/calcular e POST /api/pedidos |
| Severidade / prioridade sugeridas | Alta / alta: pedido contrário ao limite explícito |
| Situação | Confirmado nas evidências anteriores; correção não verificada |

Referências: [documentacao.md, linha 20](../evidencias/documentacao.md), [documentacao.md, linha 127](../evidencias/documentacao.md), [documentacao.md, linha 183](../evidencias/documentacao.md); requisições/respostas em [api_carrinho.jsonl, linha 8](../evidencias/api_carrinho.jsonl) e [api_pedidos.jsonl, linha 1](../evidencias/api_pedidos.jsonl). A prioridade é avaliação de QA.

## Pré-condições e dados

Usar P005 — Mochila Urbana 20L, R$ 100,00 — e enviar quantidade 6. Não é necessário login para as rotas documentadas; login está fora do escopo da loja. Dados de cliente são fictícios e apenas viabilizam a confirmação. Fontes: [documentacao.md, linha 55](../evidencias/documentacao.md), [documentacao.md, linhas 207–218](../evidencias/documentacao.md), [documentacao.md, linha 279](../evidencias/documentacao.md).

## Passos para reproduzir

1. Enviar POST para `https://verzel-store.qa-test-verzel-store.workers.dev/api/carrinho/calcular`, com `Content-Type: application/json` e este corpo:

```json
{"itens":[{"produtoId":"P005","quantidade":6}]}
```

2. Conferir se a API rejeita a quantidade.
3. Enviar POST para `https://verzel-store.qa-test-verzel-store.workers.dev/api/pedidos`, com o mesmo cabeçalho e este corpo:

```json
{
  "cliente": {"nome":"Teste QA","email":"qa@example.com","cep":"01310-100"},
  "itens": [{"produtoId":"P005","quantidade":6}]
}
```

4. Conferir se o pedido foi rejeitado.

Os corpos acima são os dados registrados em [api_carrinho.jsonl, linha 8](../evidencias/api_carrinho.jsonl) e [api_pedidos.jsonl, linha 1](../evidencias/api_pedidos.jsonl).

## Esperado

Rejeitar as duas requisições com HTTP 422 e código `QUANTIDADE_MAXIMA_EXCEDIDA`, sem confirmar pedido com seis unidades. Fontes: CA10 em [documentacao.md, linha 20](../evidencias/documentacao.md) e erro documentado em [documentacao.md, linha 264](../evidencias/documentacao.md).

## Obtido

| Requisição | HTTP | Quantidade retornada | Subtotal | Consequência |
|---|---:|---:|---:|---|
| Calcular carrinho | 200 | 6 | R$ 600,00 | Quantidade aceita no cálculo |
| Confirmar pedido | 201 | 6 | R$ 600,00 | Pedido fictício VZ-924307 confirmado |

Fontes: [api_carrinho.jsonl, linha 8](../evidencias/api_carrinho.jsonl); [api_pedidos.jsonl, linha 1](../evidencias/api_pedidos.jsonl). Os pedidos deste ambiente são fictícios e não são armazenados; não houve cobrança real. Fonte: [documentacao.md, linhas 274–275](../evidencias/documentacao.md).

## Impacto

O limite que existe na interface não garante que o pedido recebido pela API cumpra CA10. Esta é uma falha funcional de validação de quantidade; não há comprovação de invasão ou de acesso a dados de terceiros. Base da conclusão: CA10 e as requisições/respostas citadas.

## Critérios de reteste

Enviar quantidade 5 e 6 a cada endpoint. Quantidade 5 deve permanecer permitida; 6 deve retornar 422. Repetir a verificação visual da vitrine e do botão de aumento do carrinho. Fonte: [documentacao.md, linha 20](../evidencias/documentacao.md), [documentacao.md, linha 264](../evidencias/documentacao.md); cenários CT10 e CT11 do plano.

Não sei a causa ou a linha responsável no código do servidor; a evidência demonstra a ausência do bloqueio nesses caminhos, não sua implementação interna.
