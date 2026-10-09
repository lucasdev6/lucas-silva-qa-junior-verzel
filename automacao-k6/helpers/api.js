import http from 'k6/http';
import { check, sleep } from 'k6';
import { cliente } from '../data/cenarios.js';

export function executarCaso(endpoint, caso, registros) {
  const pedido = endpoint === '/api/pedidos';
  const payload = { itens: caso.itens };
  if (caso.cupom !== undefined) payload.cupom = caso.cupom;
  if (pedido) payload.cliente = cliente;
  const url = (__ENV.BASE_URL || 'https://verzel-store.qa-test-verzel-store.workers.dev').replace(/\/$/, '') + endpoint;
  const resposta = http.post(url, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
    timeout: '15s',
    responseCallback: http.expectedStatuses(200, 201, 422),
    tags: { caso: caso.id, endpoint },
  });
  let corpo = null;
  try { corpo = resposta.json(); } catch (_) { /* O check de JSON registra a falha. */ }
  const erro = caso.erro || (pedido ? caso.erroCupom : null);
  const status = erro ? 422 : (pedido ? 201 : 200);
  const verificacoes = {
    [`${caso.id} HTTP ${status}`]: () => resposta.status === status,
    [`${caso.id} resposta JSON`]: () => corpo !== null && typeof corpo === 'object' && !Array.isArray(corpo),
  };
  if (erro) {
    verificacoes[`${caso.id} código ${erro}`] = () => corpo?.erro?.codigo === erro;
    if (caso.mensagem) verificacoes[`${caso.id} mensagem de erro`] = () => corpo?.erro?.mensagem === caso.mensagem;
  } else {
    const campos = ['subtotal', 'desconto', 'frete', 'valorFaltanteFreteGratis', 'total'];
    campos.forEach((campo, i) => {
      verificacoes[`${caso.id} ${campo} = ${caso.valores[i]}`] = () => typeof corpo?.[campo] === 'number' && Math.abs(corpo[campo] - caso.valores[i]) < 1e-8;
      verificacoes[`${caso.id} ${campo} até 2 casas`] = () => typeof corpo?.[campo] === 'number' && Math.abs(corpo[campo] * 100 - Math.round(corpo[campo] * 100)) < 1e-8;
    });
    verificacoes[`${caso.id} indicador frete grátis`] = () => corpo?.freteGratis === (caso.valores[2] === 0);
    verificacoes[`${caso.id} itens e quantidades`] = () => Array.isArray(corpo?.itens) && corpo.itens.length === caso.itens.length && caso.itens.every(item => corpo.itens.some(recebido => recebido.produtoId === item.produtoId && recebido.quantidade === item.quantidade));
    verificacoes[`${caso.id} cupom`] = () => caso.cupom === undefined
      ? corpo?.cupom === null
      : corpo?.cupom?.codigo === caso.cupom.trim().toUpperCase() && corpo?.cupom?.aplicado === !caso.erroCupom;
    if (caso.mensagem) verificacoes[`${caso.id} mensagem cupom`] = () => corpo?.cupom?.mensagem === caso.mensagem;
  }
  const resultados = {};
  Object.entries(verificacoes).forEach(([nome, avaliar]) => {
    let passou = false;
    try { passou = avaliar(); } catch (_) { /* Check falso em resposta inesperada. */ }
    resultados[nome] = passou;
  });
  const passou = check(resultados, Object.fromEntries(Object.keys(resultados).map(nome => [nome, valores => valores[nome]])), { caso: caso.id, endpoint });
  registros.push({ caso: caso.id, nome: caso.nome, endpoint, instante: new Date().toISOString(), request: payload, status: resposta.status, response: corpo ?? resposta.body, erroTransporte: resposta.error || null, passou, checks: resultados });
  console.log(`${passou ? 'PASSOU' : 'FALHOU'} ${caso.id} ${endpoint} ${caso.nome}`);
  sleep(0.5);
  return passou;
}
