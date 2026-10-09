import { expect, Page } from '@playwright/test';
import { ConfirmacaoElements } from '../elements/confirmacao.elements';

export class ConfirmacaoPage {
  private readonly elements: ConfirmacaoElements;
  constructor(private readonly page: Page) { this.elements = new ConfirmacaoElements(page); }
  async validarPedidoConfirmado() {
    await expect(this.page).toHaveURL(/\/pedido-confirmado$/);
    await expect(this.elements.numeroPedido).toBeVisible();
  }
  async validarItem(nome: string, quantidade: number) { await expect(this.elements.item(nome, quantidade)).toBeVisible(); }
}
