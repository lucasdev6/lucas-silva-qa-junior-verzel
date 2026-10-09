import { Page } from '@playwright/test';

export class ProdutosElements {
  constructor(private readonly page: Page) {}
  adicionar(nome: string) {
    return this.page.getByRole('article')
      .filter({ has: this.page.getByRole('heading', { name: nome, exact: true }) })
      .getByRole('button', { name: 'Adicionar ao carrinho' });
  }
}
