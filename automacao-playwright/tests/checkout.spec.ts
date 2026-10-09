import { test } from '../fixtures/loja.fixture';

test.describe('Formulário de checkout e confirmação da promoção', () => {
  test.beforeEach(async ({ produtos }) => {
    await produtos.abrir();
  });

  test('CT13 [CA01 CA06 CA08 CA11] preencher formulário e confirmar compra com cupom e frete grátis', async ({ produtos, carrinho, checkout, confirmacao, resumo }) => {
    await produtos.adicionar('Mochila Urbana 20L');
    await produtos.adicionar('Garrafa Térmica 750ml');
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(209.9);
    await carrinho.aplicarCupom('BEMVINDO10');
    await resumo.validarTotal(188.91);
    await carrinho.finalizarCompra();
    await checkout.preencher({ nome: 'Teste QA', email: 'qa@example.com', cep: '01310-100' });
    await checkout.enviar();
    await confirmacao.validarPedidoConfirmado();
    await confirmacao.validarItem('Mochila Urbana 20L', 1);
    await confirmacao.validarItem('Garrafa Térmica 750ml', 1);
    await confirmacao.validarItem('Camiseta Essencial', 1);
    await resumo.validarSubtotal(209.9);
    await resumo.validarDesconto(20.99);
    await resumo.validarFrete(0);
    await resumo.validarTotal(188.91);
  });

  test('CT14 [CA01 CA06 CA08] confirmar valores da promoção no limite de duzentos reais', async ({ produtos, carrinho, checkout, confirmacao, resumo }) => {
    await produtos.adicionar('Mochila Urbana 20L', 2);
    await carrinho.abrir(200);
    await carrinho.aplicarCupom('BEMVINDO10');
    await carrinho.finalizarCompra();
    await checkout.preencher({ nome: 'Teste QA', email: 'qa@example.com', cep: '01310-100' });
    await checkout.enviar();
    await confirmacao.validarPedidoConfirmado();
    await confirmacao.validarItem('Mochila Urbana 20L', 2);
    await resumo.validarSubtotal(200);
    await resumo.validarDesconto(20);
    await resumo.validarFreteETotalSemInterromper(0, 180);
  });
});
