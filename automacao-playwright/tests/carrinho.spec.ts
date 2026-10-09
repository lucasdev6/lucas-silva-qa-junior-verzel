import { test } from '../fixtures/loja.fixture';

test.describe('Limite de quantidade por produto', () => {
  test.beforeEach(async ({ produtos }) => {
    await produtos.abrir();
  });

  test('CT10 [CA10] limitar cada produto a cinco unidades na interface', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial', 5);
    await produtos.validarLimiteAtingido('Camiseta Essencial');
    await carrinho.abrir(299.5);
    await carrinho.validarQuantidadeMaxima('Camiseta Essencial');
    await resumo.validarSubtotal(299.5);
  });
});
