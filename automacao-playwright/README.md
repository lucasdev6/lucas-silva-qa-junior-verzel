# Verzel Store — automação E2E

Suíte Playwright em TypeScript para validar cupons, frete, limite de quantidade e os valores da promoção na confirmação da compra. São 15 testes de interface organizados em quatro specs. Fonte: [listagem dos testes](../relatorios/evidencias/listagem-suite-atual.txt), linhas 1–17.

## Requisitos e instalação

Utilize Node.js 22 ou superior, npm e acesso à internet. A partir da raiz `teste vaga`:

```sh
cd automacao-playwright
npm ci
npx playwright install chromium
```

Os comandos das próximas seções devem ser executados dentro de `automacao-playwright`.

## Executar os testes

| Comando | Finalidade |
|---|---|
| `npm test` | Executar toda a suíte sem janela visível |
| `npm run test:headed` | Executar a suíte com navegador visível |
| `npm run test:ui` | Abrir a interface do Playwright Test |
| `npm run test:demo` | Executar CT13: formulário e confirmação com cupom e frete grátis |
| `npx playwright test tests/cupons.spec.ts` | Executar somente os testes de cupons |
| `npx playwright test --grep CT01B` | Executar um cenário pelo identificador |
| `npx playwright test --list` | Listar os testes disponíveis |
| `npm run report` | Abrir o relatório HTML da última tentativa local |

Os scripts estão em [package.json](package.json), linhas 5–10. O cenário da demonstração está em [checkout.spec.ts](tests/checkout.spec.ts), linha 8.

## Configuração

O arquivo [playwright.config.ts](playwright.config.ts), linhas 5–18, define Chromium, um worker, zero retries e a URL padrão:

```text
https://verzel-store.qa-test-verzel-store.workers.dev
```

As variáveis opcionais são:

| Variável | Finalidade | Padrão |
|---|---|---|
| `BASE_URL` | Endereço do ambiente a testar | URL acima |
| `SLOW_MO` | Pausa entre ações, em milissegundos | 800 na demonstração; 0 nos demais comandos |

Para desacelerar a demonstração no macOS/Linux:

```sh
SLOW_MO=1500 npm run test:demo
```

## Arquitetura e manutenção

```text
automacao-playwright/
├── elements/             # Locators por tela ou componente
├── page/                 # Ações e validações dos Page Objects
├── fixtures/             # Instâncias isoladas por teste
├── tests/
│   ├── carrinho.spec.ts   # Limite de quantidade
│   ├── cupons.spec.ts     # Aplicação, normalização, rejeição e remoção
│   ├── frete.spec.ts      # Limites, faltante e base do cálculo
│   └── checkout.spec.ts   # Formulário válido e valores na confirmação
├── playwright.config.ts
├── package.json
└── package-lock.json
```

Cada spec usa `test.describe` e declara cada cenário em um `test`. O spec chama métodos de [page](page); ações e asserções ficam nos Page Objects, enquanto os seletores ficam em [elements](elements). A fixture fornece instâncias por teste. Exemplos: [cupons.spec.ts](tests/cupons.spec.ts), linha 3; [carrinho.page.ts](page/carrinho.page.ts), linha 6; [loja.fixture.ts](fixtures/loja.fixture.ts), linha 16.

Ao adicionar um cenário, mantenha esse padrão: seletores em [elements](elements), métodos em [page](page) e sequência do cenário no spec correspondente. Prepare os dados dentro do próprio teste ou de seu `beforeEach`, sem depender de outro cenário.

## Relatórios e evidências gerados

| Caminho | Conteúdo |
|---|---|
| `playwright-report/index.html` | Relatório HTML |
| `test-results/results.json` | Resultado estruturado |
| `test-results/` | Screenshots, vídeos e traces de falhas, quando o navegador consegue iniciar |

A retenção dos anexos está configurada em [playwright.config.ts](playwright.config.ts), linhas 10–17. Esses diretórios são gerados e ignorados pelo Git. `npm run report` abre a última tentativa local; confira a data e os erros antes de interpretá-la.

## Falha conhecida

CT06, CT08 e CT14 exigem frete grátis no subtotal exato de R$ 200,00. A loja cobra frete nessa condição, portanto esses testes podem falhar pelo BUG-02. Referências: [frete.spec.ts](tests/frete.spec.ts), linhas 24 e 52; [checkout.spec.ts](tests/checkout.spec.ts), linha 28; [relatório do bug](../relatorios/bugs/BUG-02_FRETE_NO_LIMITE.md), linha 5.

Para o plano, os resultados registrados, as limitações da execução e a localização das demais entregas, consulte o [README da raiz](../readme.md).
