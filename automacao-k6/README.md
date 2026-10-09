# Automação funcional de API com k6 — Verzel Store

Valida os critérios de cupom e frete da história com chamadas HTTP a `POST /api/carrinho/calcular` e `POST /api/pedidos`. Referência: [documentação, linhas 7–21](../VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md).

A configuração executa **1 usuário virtual, 1 iteração e 27 requisições sequenciais**, com pausa de 0,5 segundo entre chamadas. Não há teste de carga, estresse ou requisito de tempo de resposta. Configuração: [api.test.js, linhas 10–15](tests/api.test.js); pausa: [api.js](helpers/api.js). O enunciado exclui testes de carga e estresse: [enunciado, linha 10](../evidencias_qa/enunciado_pdf.txt).

## Como executar

Instale o k6 conforme a [documentação oficial](https://grafana.com/docs/k6/latest/set-up/install-k6/). No macOS com Homebrew:

```bash
brew install k6
```

Na raiz do projeto:

```bash
cd automacao-k6
mkdir -p resultados
k6 run --no-usage-report tests/api.test.js > resultados/execucao.log 2>&1
cat resultados/execucao.log
```

Executar somente um cenário (API01 a API12 passam pelos dois endpoints; API13 usa somente o cálculo):

```bash
k6 run --no-usage-report -e CASO=API05 tests/api.test.js
```

Usar outro ambiente:

```bash
k6 run --no-usage-report -e BASE_URL=https://endereco-do-ambiente tests/api.test.js
```

A pasta `resultados` precisa existir antes da execução para receber o resumo. Os comandos devem ser executados dentro de `automacao-k6`.

## Cenários e cobertura

Os dados e os valores esperados estão em [cenarios.js](data/cenarios.js), organizados começando pelos limites com bugs previamente registrados.

| ID | Validação | Critérios |
|---|---|---|
| API01 | Rejeitar seis unidades com HTTP 422 e QUANTIDADE_MAXIMA_EXCEDIDA | CA10 |
| API02 | Subtotal 200, sem cupom: frete zero e total 200 | CA06 |
| API03 | Subtotal 200, com cupom: desconto 20 e total 180 | CA01, CA06, CA08 |
| API04 | Subtotal 209,90 e total líquido 188,91: manter frete grátis | CA08 |
| API05 | Subtotal 100: desconto 10, frete 19,90 e total 109,90 | CA01, CA07, CA09 |
| API06 | Normalizar caixa e espaços externos do cupom | CA02 |
| API07 | Cupom inválido: mensagem e ausência de desconto no cálculo; rejeição do pedido | CA03 |
| API08 | Cupom expirado: mensagem e ausência de desconto no cálculo; rejeição do pedido | CA04 |
| API09 | Subtotal 199,80: faltante 0,20, frete 19,90 e total 199,72 | CA07, CA11 |
| API10 | Permitir cinco unidades | CA10 |
| API11 | Subtotal 229,90, sem cupom: frete grátis | CA06 |
| API12 | Subtotal 49,90: desconto 4,99 e total 64,81 | CA11 |
| API13 | Aplicar, recalcular sem cupom e reaplicar: três chamadas | CA05, cobertura parcial |

CA05 tem cobertura parcial na API: o endpoint recebe um único campo `cupom` e não mantém estado entre chamadas. A remoção visual e o bloqueio de outro cupom permanecem na automação E2E. Fontes: [documentação, linha 15](../VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md), [linha 127](../VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md) e [linha 277](../VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md).

A diferença entre os endpoints é intencional: cupom inválido ou expirado retorna 200 com desconto zero no cálculo e 422 no pedido. Fontes: [documentação, linhas 135–145](../VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md) e [linhas 197–203](../VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md). Dados válidos de cliente são apenas preparação para confirmar o pedido, sem novos testes de formulário.

## Estrutura e resultados

- [tests/api.test.js](tests/api.test.js): configuração e organização da execução.
- [data/cenarios.js](data/cenarios.js): entradas e resultados esperados conforme a documentação.
- [helpers/api.js](helpers/api.js): envio HTTP, validações e registro de evidências.
- `resultados/resumo.json`: resumo do k6, incluindo checks por grupo.
- `resultados/execucao.log`: saída da execução quando redirecionada conforme o comando; contém `EVIDENCIAS_JSON=` com requisições, respostas, horário e checks de cada chamada.

Os resultados gerados ficam fora do Git. A regra `checks: rate==1` faz o processo terminar com código diferente de zero se houver check reprovado. Referências: [configuração](tests/api.test.js) e [documentação oficial de thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/).

## Bugs já registrados e verificação desta entrega

Os valores esperados seguem os critérios, sem acomodar os bugs: API01 deve detectar aceitação indevida de seis unidades; API02 e API03 devem detectar frete cobrado no subtotal 200, em ambos os endpoints. Isso corresponde a seis combinações de cenário e endpoint caso os defeitos continuem presentes. Fontes: [BUG-01, linha 5](../relatorios/bugs/BUG-01_LIMITE_QUANTIDADE_API.md) e [BUG-02, linha 5](../relatorios/bugs/BUG-02_FRETE_NO_LIMITE.md).

A tentativa de execução de API05 foi bloqueada por DNS (`lookup: no such host`): **o resultado funcional atual da loja ainda não foi confirmado com k6**. Os artefatos dessa tentativa foram removidos na limpeza; novos resultados serão gerados ao executar os comandos acima. As evidências históricas de referência estão em [api_carrinho.jsonl](../relatorios/evidencias/api_carrinho.jsonl) e [api_pedidos.jsonl](../relatorios/evidencias/api_pedidos.jsonl).
