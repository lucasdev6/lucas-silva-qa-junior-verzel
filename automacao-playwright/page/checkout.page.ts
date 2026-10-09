import { expect, Page } from '@playwright/test';
import { CheckoutElements } from '../elements/checkout.elements';
import { CarrinhoPage } from './carrinho.page';

export type DadosCliente = { nome: string; email: string; cep: string };

export class CheckoutPage {
  private readonly elements: CheckoutElements;
  constructor(private readonly page: Page) { this.elements = new CheckoutElements(page); }
  async preencher(dados: DadosCliente = { nome: 'Teste QA', email: 'qa@example.com', cep: '01310-100' }) {
    await this.elements.nome.fill(dados.nome);
    await this.elements.email.fill(dados.email);
    await this.elements.cep.fill(dados.cep);
  }
  async enviar() { await this.elements.confirmar.click(); }
  async validarErro(mensagem: string) { await expect(this.elements.mensagem(mensagem)).toBeVisible(); }
  async validarPermaneceNoCheckout() { await expect(this.page).toHaveURL(/\/checkout$/); }
  async validarRedirecionamentoSemItens() {
    await this.page.goto('/checkout');
    await expect(this.page).toHaveURL(/\/carrinho$/);
    await new CarrinhoPage(this.page).validarVazio();
  }
}
