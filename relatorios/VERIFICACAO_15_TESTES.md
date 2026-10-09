# Verificação após separar os testes em describe/test

Foram verificados os mesmos corpos dos 15 testes atuais, com seus Page Objects, pelo navegador da ferramenta e asserções auxiliares: **12 passaram e 3 falharam**. Registros completos: [verificacao-15-tests-interface.jsonl, linhas 1–15](evidencias/verificacao-15-tests-interface.jsonl).

As três falhas são variações do **BUG-02 já conhecido**, cobrança de R$ 19,90 de frete no subtotal exato de R$ 200,00:

| Caso | Resultado observado | Evidência |
|---|---|---|
| CT06 — Sem cupom | Frete R$ 19,90 em vez de grátis | [verificacao-15-tests-interface.jsonl, linha 12](evidencias/verificacao-15-tests-interface.jsonl) |
| CT08 — Com cupom, no carrinho | Total R$ 199,90 em vez de R$ 180,00 | [verificacao-15-tests-interface.jsonl, linha 15](evidencias/verificacao-15-tests-interface.jsonl) |
| CT14 — Com cupom, na confirmação | Total R$ 199,90 em vez de R$ 180,00 | [verificacao-15-tests-interface.jsonl, linha 3](evidencias/verificacao-15-tests-interface.jsonl) |

O formulário com dados válidos e compra acima do limite chegou à confirmação com subtotal R$ 209,90, desconto R$ 20,99, frete grátis e total R$ 188,91. Fonte: [verificacao-15-tests-interface.jsonl, linha 2](evidencias/verificacao-15-tests-interface.jsonl).

Não foi observado problema novo causado pela reorganização nos casos verificados. Isso não é uma garantia sobre cenários não executados. Fonte: todos os resultados em [verificacao-15-tests-interface.jsonl, linhas 1–15](evidencias/verificacao-15-tests-interface.jsonl).

## Limite da execução

O comando oficial `npm test` também foi executado, mas o sandbox bloqueou a inicialização do Chromium com `bootstrap_check_in ... Permission denied (1100)`, antes das ações de teste. A tentativa registrou 15 falhas de infraestrutura; elas não representam 15 falhas funcionais do site. Fonte: [runner-15-tests-bloqueado.txt, linhas 1–6](evidencias/runner-15-tests-bloqueado.txt).

A verificação auxiliar executa os mesmos cenários e Page Objects, mas usa seu próprio mecanismo de asserções com polling. **Não equivale a uma execução bem-sucedida do runner oficial Playwright Test.** Para comprovar a suíte pelo runner oficial, é necessário executar `npm test` em um ambiente que permita iniciar Chromium.
