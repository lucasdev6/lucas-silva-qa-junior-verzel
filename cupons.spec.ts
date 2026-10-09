import { test } from '../fixtures/loja.fixture';

test.describe('Cupons de desconto', () => {
  test.beforeEach(async ({ produtos }) => {
    await produtos.abrir();
  });

  test('CT01 [CA01 CA09 CA11] aplicar cupom de dez por cento', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(59.9);
    await carrinho.aplicarCupom('BEMVINDO10');
    await resumo.validarSubtotal(59.9);
    await resumo.validarDesconto(5.99);
    await resumo.validarFrete(19.9);
    await resumo.validarTotal(73.81);
  });

  test('CT01B [CA02] aceitar cupom em letras minúsculas', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(59.9);
    await carrinho.aplicarCupom('bemvindo10');
    await resumo.validarSubtotal(59.9);
    await resumo.validarDesconto(5.99);
    await resumo.validarFrete(19.9);
    await resumo.validarTotal(73.81);
  });

  test('CT01C [CA02] ignorar caixa mista e espaços externos', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(59.9);
    await carrinho.aplicarCupom('  BeMvInDo10  ');
    await resumo.validarSubtotal(59.9);
    await resumo.validarDesconto(5.99);
    await resumo.validarFrete(19.9);
    await resumo.validarTotal(73.81);
  });

  test('CT02 [CA03] rejeitar cupom inexistente', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(59.9);
    await carrinho.aplicarCupom('QA_INVALIDO', 'Cupom inválido.');
    await resumo.validarDesconto(0);
    await resumo.validarTotal(79.8);
  });

  test('CT03 [CA04] rejeitar cupom expirado', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(59.9);
    await carrinho.aplicarCupom('VERAO2026', 'Cupom expirado.');
    await resumo.validarDesconto(0);
    await resumo.validarTotal(79.8);
  });

  test('CT04 [CA05] manter cupom único, remover e reaplicar', async ({ produtos, carrinho, resumo }) => {
    await produtos.adicionar('Camiseta Essencial');
    await carrinho.abrir(59.9);
    await carrinho.aplicarCupom('BEMVINDO10');
    await carrinho.validarCupomUnico();
    await resumo.validarDesconto(5.99);
    await resumo.validarTotal(73.81);
    await carrinho.removerCupom();
    await resumo.validarDesconto(0);
    await resumo.validarTotal(79.8);
    await carrinho.validarCampoCupomDisponivel();
    await carrinho.aplicarCupom('BEMVINDO10');
    await carrinho.validarCupomUnico();
    await resumo.validarTotal(73.81);
  });
});
