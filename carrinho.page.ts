import { expect, Page } from '@playwright/test';
import { CarrinhoElements } from '../elements/carrinho.elements';
import { NavegacaoElements } from '../elements/navegacao.elements';
import { ResumoPage } from './resumo.page';

export class CarrinhoPage {
  private readonly elements: CarrinhoElements;
  private readonly navegacao: NavegacaoElements;
  private readonly resumo: ResumoPage;
  constructor(private readonly page: Page) {
    this.elements = new CarrinhoElements(page);
    this.navegacao = new NavegacaoElements(page);
    this.resumo = new ResumoPage(page);
  }
  async abrir(subtotal: number) {
    await this.navegacao.carrinho.click();
    await this.resumo.validarSubtotal(subtotal);
    await this.aguardarCalculo();
  }
  async aguardarCalculo() { await expect(this.elements.colunaResumo).toHaveAttribute('aria-busy', 'false'); }
  async remover(nome: string) { await this.elements.remover(nome).click(); }
  async validarProdutoRemovido(nome: string) { await expect(this.elements.produto(nome)).toHaveCount(0); }
  async validarVazio() { await expect(this.elements.vazio).toBeVisible(); }
  async validarContadorVazio() { await expect(this.navegacao.carrinho).toContainText('0'); }
  async aplicarCupom(codigo: string, mensagem?: string) {
    await this.elements.cupom.fill(codigo);
    await this.elements.aplicarCupom.click();
    if (mensagem) await expect(this.elements.alerta).toHaveText(mensagem);
    else await expect(this.elements.removerCupom).toBeVisible();
    await this.aguardarCalculo();
  }
  async removerCupom() { await this.elements.removerCupom.click(); }
  async validarCupomUnico() { await expect(this.elements.cupom).toHaveCount(0); }
  async validarCampoCupomDisponivel() { await expect(this.elements.cupom).toBeVisible(); }
  async aumentar(nome: string) { await this.elements.aumentar(nome).click(); }
  async diminuir(nome: string, vezes = 1) {
    for (let i = 0; i < vezes; i++) await this.elements.diminuir(nome).click();
  }
  async validarQuantidadeMaxima(nome: string) { await expect(this.elements.aumentar(nome)).toBeDisabled(); }
  async validarQuantidadeMinima(nome: string) { await expect(this.elements.diminuir(nome)).toBeDisabled(); }
  async esvaziar() { await this.elements.esvaziar.click(); }
  async finalizarCompra() {
    await this.elements.finalizar.click();
    await expect(this.page).toHaveURL(/\/checkout$/);
  }
  async recarregar() { await this.page.reload(); }
  async validarNovaAbaVazia() {
    const outra = await this.page.context().newPage();
    try {
      await outra.goto('/carrinho');
      await new CarrinhoPage(outra).validarVazio();
    } finally { await outra.close(); }
  }
}
