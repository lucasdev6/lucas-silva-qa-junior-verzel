import { Page } from '@playwright/test';

export class ResumoElements {
  constructor(private readonly page: Page) {}
  valor(campo: 'subtotal' | 'desconto' | 'frete' | 'total') {
    return this.page.locator(`[data-valor="${campo}"]`);
  }
  get faltanteFrete() { return this.page.getByText(/Faltam .* para o frete grátis/); }
}
