import { expect, Page } from '@playwright/test';
import { ProdutosElements } from '../elements/produtos.elements';
import { NavegacaoElements } from '../elements/navegacao.elements';

export class ProdutosPage {
  private readonly elements: ProdutosElements;
  private readonly navegacao: NavegacaoElements;
  constructor(private readonly page: Page) {
    this.elements = new ProdutosElements(page);
    this.navegacao = new NavegacaoElements(page);
  }
  async abrir() { await this.page.goto('/'); }
  async adicionar(nome: string, quantidade = 1) {
    await this.navegacao.produtos.click();
    for (let i = 0; i < quantidade; i++) await this.elements.adicionar(nome).click();
  }
  async validarLimiteAtingido(nome: string) { await expect(this.elements.adicionar(nome)).toBeDisabled(); }
}
