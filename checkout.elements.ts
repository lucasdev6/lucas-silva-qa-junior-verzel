import { Page } from '@playwright/test';

export class CheckoutElements {
  constructor(private readonly page: Page) {}
  get nome() { return this.page.getByLabel('Nome completo', { exact: true }); }
  get email() { return this.page.getByLabel('E-mail', { exact: true }); }
  get cep() { return this.page.getByLabel('CEP', { exact: true }); }
  get confirmar() { return this.page.getByRole('button', { name: 'Confirmar pedido', exact: true }); }
  mensagem(texto: string) { return this.page.getByText(texto, { exact: true }); }
}
