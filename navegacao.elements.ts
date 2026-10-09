import { Page } from '@playwright/test';

export class NavegacaoElements {
  constructor(private readonly page: Page) {}
  get produtos() { return this.page.getByRole('link', { name: 'Produtos', exact: true }); }
  get carrinho() { return this.page.getByRole('link', { name: /^Carrinho/ }); }
}
