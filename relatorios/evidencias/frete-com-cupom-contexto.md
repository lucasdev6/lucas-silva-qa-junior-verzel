# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: frete.spec.ts >> E2E frete grátis no limite 200 com cupom até a confirmação
- Location: tests/frete.spec.ts:36:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('[data-valor="frete"]')
Expected: "Grátis"
Received: "R$ 19,90"
Timeout:  2000ms

Call log:
  - Expect "soft toHaveText" with timeout 2000ms
  - waiting for locator('[data-valor="frete"]')
    21 × locator resolved to <dd data-valor="frete">R$ 19,90</dd>
       - unexpected value "R$ 19,90"

```

```yaml
- definition: R$ 19,90
```

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('[data-valor="total"]')
Expected: "R$ 180,00"
Received: "R$ 199,90"
Timeout:  2000ms

Call log:
  - Expect "soft toHaveText" with timeout 2000ms
  - waiting for locator('[data-valor="total"]')
    21 × locator resolved to <dd data-valor="total">R$ 199,90</dd>
       - unexpected value "R$ 199,90"

```

```yaml
- definition: R$ 199,90
```

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('[data-valor="frete"]')
Expected: "Grátis"
Received: "R$ 19,90"
Timeout:  2000ms

Call log:
  - Expect "soft toHaveText" with timeout 2000ms
  - waiting for locator('[data-valor="frete"]')
    21 × locator resolved to <dd data-valor="frete">R$ 19,90</dd>
       - unexpected value "R$ 19,90"

```

```yaml
- definition: R$ 19,90
```

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('[data-valor="total"]')
Expected: "R$ 180,00"
Received: "R$ 199,90"
Timeout:  2000ms

Call log:
  - Expect "soft toHaveText" with timeout 2000ms
  - waiting for locator('[data-valor="total"]')
    21 × locator resolved to <dd data-valor="total">R$ 199,90</dd>
       - unexpected value "R$ 199,90"

```

```yaml
- definition: R$ 199,90
```

# Test source

```ts
  1  | import { expect, Page } from '@playwright/test';
  2  | import { ResumoElements } from '../elements/resumo.elements';
  3  | import { moeda } from './moeda';
  4  | 
  5  | // Componente compartilhado pelo carrinho, checkout e confirmação.
  6  | export class ResumoPage {
  7  |   private readonly elements: ResumoElements;
  8  |   constructor(page: Page) { this.elements = new ResumoElements(page); }
  9  |   async validarSubtotal(valor: number) { await expect(this.elements.valor('subtotal')).toHaveText(moeda(valor)); }
  10 |   async validarDesconto(valor: number) {
  11 |     await expect(this.elements.valor('desconto')).toHaveText(valor > 0 ? `- ${moeda(valor)}` : moeda(0));
  12 |   }
  13 |   async validarFrete(valor: number) {
  14 |     await expect(this.elements.valor('frete')).toHaveText(valor === 0 ? 'Grátis' : moeda(valor));
  15 |   }
  16 |   async validarTotal(valor: number) { await expect(this.elements.valor('total')).toHaveText(moeda(valor)); }
  17 |   async validarFaltanteFrete(subtotal: number, frete: number) {
  18 |     if (frete === 0) await expect(this.elements.faltanteFrete).toHaveCount(0);
  19 |     else await expect(this.elements.faltanteFrete).toHaveText(`Faltam ${moeda(200 - subtotal)} para o frete grátis.`);
  20 |   }
  21 |   async validarFreteETotalSemInterromper(frete: number, total: number) {
  22 |     await expect.soft(this.elements.valor('frete')).toHaveText(frete === 0 ? 'Grátis' : moeda(frete), { timeout: 2000 });
> 23 |     await expect.soft(this.elements.valor('total')).toHaveText(moeda(total), { timeout: 2000 });
     |                                                     ^ Error: expect(locator).toHaveText(expected) failed
  24 |   }
  25 | }
  26 | 
```