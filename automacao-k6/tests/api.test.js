import { group } from 'k6';
import { cenarios } from '../data/cenarios.js';
import { executarCaso } from '../helpers/api.js';

if (__ENV.CASO && ![...cenarios.map(caso => caso.id), 'API13'].includes(__ENV.CASO)) {
  throw new Error('CASO desconhecido: ' + __ENV.CASO);
}

export const options = {
  scenarios: {
    funcional: { executor: 'shared-iterations', vus: 1, iterations: 1, maxDuration: '10m' },
  },
  thresholds: { checks: ['rate==1'] },
};

export default function () {
  const registros = [];
  for (const endpoint of ['/api/carrinho/calcular', '/api/pedidos']) {
    group(endpoint, () => {
      cenarios.filter(caso => !__ENV.CASO || caso.id === __ENV.CASO).forEach(caso => {
        group(`${caso.id} ${caso.nome}`, () => executarCaso(endpoint, caso, registros));
      });
    });
  }
  // CA05: recálculo sem cupom e reaplicação. A API é sem estado; a interação visual fica no E2E.
  if (!__ENV.CASO || __ENV.CASO === 'API13') {
    group('API13 CA05 remover e reaplicar no cálculo', () => {
      const itens = [{ produtoId: 'P005', quantidade: 1 }];
      executarCaso('/api/carrinho/calcular', { id: 'API13-aplicar', nome: 'Aplicar cupom', itens, cupom: 'BEMVINDO10', valores: [100, 10, 19.9, 100, 109.9] }, registros);
      executarCaso('/api/carrinho/calcular', { id: 'API13-remover', nome: 'Recalcular sem cupom', itens, valores: [100, 0, 19.9, 100, 119.9] }, registros);
      executarCaso('/api/carrinho/calcular', { id: 'API13-reaplicar', nome: 'Reaplicar cupom', itens, cupom: 'BEMVINDO10', valores: [100, 10, 19.9, 100, 109.9] }, registros);
    });
  }
  // Um VU/uma iteração: não mistura registros de usuários concorrentes.
  console.log('EVIDENCIAS_JSON=' + JSON.stringify(registros));
}

export function handleSummary(data) {
  return {
    'resultados/resumo.json': JSON.stringify(data, null, 2),
    stdout: `\nChecks aprovados: ${data.metrics.checks?.values.passes || 0}; reprovados: ${data.metrics.checks?.values.fails || 0}. Detalhes em resultados/resumo.json.\n`,
  };
}
