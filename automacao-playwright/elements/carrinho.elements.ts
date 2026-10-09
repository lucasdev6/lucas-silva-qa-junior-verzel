import { Page } from '@playwright/test';

export class CarrinhoElements {
  constructor(private readonly page: Page) {}
  get vazio() { return this.page.getByRole('heading', { name: 'Seu carrinho está vazio' }); }
  get colunaResumo() { return this.page.locator('.coluna-resumo'); }
  get cupom() { return this.page.getByLabel('Cupom de desconto', { exact: true }); }
  get aplicarCupom() { return this.page.getByRole('button', { name: 'Aplicar cupom', exact: true }); }
  get removerCupom() { return this.page.getByRole('button', { name: 'Remover cupom', exact: true }); }
  get alerta() { return this.page.getByRole('alert'); }
  get esvaziar() { return this.page.getByRole('button', { name: 'Esvaziar carrinho', exact: true }); }
  get finalizar() { return this.page.getByRole('link', { name: 'Finalizar compra', exact: true }); }
  remover(nome: string) { return this.page.getByRole('button', { name: `Remover ${nome} do carrinho`, exact: true }); }
  aumentar(nome: string) { return this.page.getByRole('button', { name: `Aumentar quantidade de ${nome}`, exact: true }); }
  diminuir(nome: string) { return this.page.getByRole('button', { name: `Diminuir quantidade de ${nome}`, exact: true }); }
  produto(nome: string) { return this.page.getByRole('heading', { name: nome, exact: true }); }
}
