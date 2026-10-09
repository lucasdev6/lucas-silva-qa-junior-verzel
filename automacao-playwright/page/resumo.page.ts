import { expect, Page } from '@playwright/test';
import { ResumoElements } from '../elements/resumo.elements';
import { moeda } from './moeda';

// Componente compartilhado pelo carrinho, checkout e confirmação.
export class ResumoPage {
  private readonly elements: ResumoElements;
  constructor(page: Page) { this.elements = new ResumoElements(page); }
  async validarSubtotal(valor: number) { await expect(this.elements.valor('subtotal')).toHaveText(moeda(valor)); }
  async validarDesconto(valor: number) {
    await expect(this.elements.valor('desconto')).toHaveText(valor > 0 ? `- ${moeda(valor)}` : moeda(0));
  }
  async validarFrete(valor: number) {
    await expect(this.elements.valor('frete')).toHaveText(valor === 0 ? 'Grátis' : moeda(valor));
  }
  async validarTotal(valor: number) { await expect(this.elements.valor('total')).toHaveText(moeda(valor)); }
  async validarFaltanteFrete(subtotal: number, frete: number) {
    if (frete === 0) await expect(this.elements.faltanteFrete).toHaveCount(0);
    else await expect(this.elements.faltanteFrete).toHaveText(`Faltam ${moeda(200 - subtotal)} para o frete grátis.`);
  }
  async validarFreteETotalSemInterromper(frete: number, total: number) {
    await expect.soft(this.elements.valor('frete')).toHaveText(frete === 0 ? 'Grátis' : moeda(frete), { timeout: 2000 });
    await expect.soft(this.elements.valor('total')).toHaveText(moeda(total), { timeout: 2000 });
  }
}
