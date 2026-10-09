import { test as base } from '@playwright/test';
import { ProdutosPage } from '../page/produtos.page';
import { CarrinhoPage } from '../page/carrinho.page';
import { CheckoutPage } from '../page/checkout.page';
import { ConfirmacaoPage } from '../page/confirmacao.page';
import { ResumoPage } from '../page/resumo.page';

type LojaFixtures = {
  produtos: ProdutosPage;
  carrinho: CarrinhoPage;
  checkout: CheckoutPage;
  confirmacao: ConfirmacaoPage;
  resumo: ResumoPage;
};

export const test = base.extend<LojaFixtures>({
  produtos: async ({ page }, use) => { await use(new ProdutosPage(page)); },
  carrinho: async ({ page }, use) => { await use(new CarrinhoPage(page)); },
  checkout: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  confirmacao: async ({ page }, use) => { await use(new ConfirmacaoPage(page)); },
  resumo: async ({ page }, use) => { await use(new ResumoPage(page)); },
});
