import { Page } from '@playwright/test';

export class ConfirmacaoElements {
  constructor(private readonly page: Page) {}
  get numeroPedido() { return this.page.getByRole('heading', { name: /Pedido VZ-\d{6}/ }); }
  item(nome: string, quantidade: number) {
    return this.page.getByText(`${quantidade}x ${nome}`, { exact: true });
  }
}
