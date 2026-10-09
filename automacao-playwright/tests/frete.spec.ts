import { test } from '../fixtures/loja.fixture';

test.describe('Frete e valores da promoção', () => {
  test.beforeEach(async ({ produtos }) => {
    await produtos.abrir();
  });

  test('CT05 [CA07] cobrar frete abaixo do limite e informar faltante', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial', 1);
    await carrinho.abrir(59.9);
    await resumo.validarFrete(19.9);
    await resumo.validarTotal(79.8);
    await resumo.validarFaltanteFrete(59.9, 19.9);
  });

  test('CT05B [CA07] cobrar frete próximo do limite e informar faltante', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Boné Aba Curva', 4);
    await carrinho.abrir(199.6);
    await resumo.validarFrete(19.9);
    await resumo.validarTotal(219.5);
    await resumo.validarFaltanteFrete(199.6, 19.9);
  });

  test('CT06 [CA06] conceder frete grátis exatamente em duzentos reais', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Mochila Urbana 20L', 2);
    await carrinho.abrir(200);
    await resumo.validarFrete(0);
    await resumo.validarTotal(200);
    await resumo.validarFaltanteFrete(200, 0);
  });

  test('CT07 [CA06] conceder frete grátis acima de duzentos reais', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Jaqueta Corta-Vento', 1);
    await carrinho.abrir(229.9);
    await resumo.validarFrete(0);
    await resumo.validarTotal(229.9);
    await resumo.validarFaltanteFrete(229.9, 0);
  });

  test('CT09 [CA06 CA08 CA11] calcular frete pelo subtotal anterior ao desconto', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Mochila Urbana 20L');
    await produtos.adicionar('Garrafa Térmica 750ml');
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(209.9);
    await carrinho.aplicarCupom('BEMVINDO10');
    await resumo.validarSubtotal(209.9);
    await resumo.validarDesconto(20.99);
    await resumo.validarFrete(0);
    await resumo.validarTotal(188.91);
  });

  test('CT08 [CA01 CA06 CA08] manter frete grátis no limite com cupom', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Mochila Urbana 20L', 2);
    await carrinho.abrir(200);
    await carrinho.aplicarCupom('BEMVINDO10');
    await resumo.validarDesconto(20);
    await resumo.validarFreteETotalSemInterromper(0, 180);
  });
});
