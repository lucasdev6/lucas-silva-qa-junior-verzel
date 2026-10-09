// Fonte: ../../VERZEL_STORE_DOCUMENTACAO_FIEL_COM_INSTRUCAO_CODEX.md:11–21, 51–65, 264–267.
const mochila = (quantidade = 1) => [{ produtoId: 'P005', quantidade }];

// Valores esperados independentes das respostas e dos bugs observados.
export const cenarios = [
  { id: 'API01', nome: 'CA10 rejeita sexta unidade', itens: mochila(6), erro: 'QUANTIDADE_MAXIMA_EXCEDIDA' },
  { id: 'API02', nome: 'CA06 frete grátis em 200 sem cupom', itens: mochila(2), valores: [200, 0, 0, 0, 200] },
  { id: 'API03', nome: 'CA01 CA06 CA08 limite com cupom', itens: mochila(2), cupom: 'BEMVINDO10', valores: [200, 20, 0, 0, 180] },
  { id: 'API04', nome: 'CA08 subtotal antes do desconto', itens: [...mochila(), { produtoId: 'P008', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }], cupom: 'BEMVINDO10', valores: [209.9, 20.99, 0, 0, 188.91] },
  { id: 'API05', nome: 'CA01 CA07 CA09 desconto sem reduzir frete', itens: mochila(), cupom: 'BEMVINDO10', valores: [100, 10, 19.9, 100, 109.9] },
  { id: 'API06', nome: 'CA02 caixa e espaços externos', itens: mochila(), cupom: '  bemvindo10  ', valores: [100, 10, 19.9, 100, 109.9] },
  { id: 'API07', nome: 'CA03 cupom inválido', itens: mochila(), cupom: 'QA_INVALIDO', erroCupom: 'CUPOM_INVALIDO', mensagem: 'Cupom inválido.', valores: [100, 0, 19.9, 100, 119.9] },
  { id: 'API08', nome: 'CA04 cupom expirado', itens: mochila(), cupom: 'VERAO2026', erroCupom: 'CUPOM_EXPIRADO', mensagem: 'Cupom expirado.', valores: [100, 0, 19.9, 100, 119.9] },
  { id: 'API09', nome: 'CA07 CA11 abaixo do limite com centavos', itens: [{ produtoId: 'P002', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }], cupom: 'BEMVINDO10', valores: [199.8, 19.98, 19.9, 0.2, 199.72] },
  { id: 'API10', nome: 'CA10 aceita cinco unidades', itens: mochila(5), valores: [500, 0, 0, 0, 500] },
  { id: 'API11', nome: 'CA06 acima do limite sem cupom', itens: [{ produtoId: 'P007', quantidade: 1 }], valores: [229.9, 0, 0, 0, 229.9] },
  { id: 'API12', nome: 'CA11 valores com centavos', itens: [{ produtoId: 'P004', quantidade: 1 }], cupom: 'BEMVINDO10', valores: [49.9, 4.99, 19.9, 150.1, 64.81] },
];

export const cliente = { nome: 'Teste QA', email: 'qa@example.com', cep: '01310-100' };
