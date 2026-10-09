# PLANO DE TESTE — Cupom de desconto e frete grátis

## Objetivo do teste

Verificar exclusivamente CA01 a CA11 da história: “Como cliente da Verzel Store, quero aplicar um cupom de desconto e ganhar frete grátis em compras maiores, para pagar menos nas minhas compras.” Fontes: [documentacao.md, linha 7](evidencias/documentacao.md), [documentacao.md, linhas 11–21](evidencias/documentacao.md).

Este é um **plano de execução**, não uma declaração de que todos os cenários abaixo foram executados. Os resultados comprovados e as limitações estão em [RELATORIO_GERAL.md](RELATORIO_GERAL.md). A organização segue o exemplo fornecido: objetivo, dados utilizados, pré-condições, cenários e resultado esperado.

## Dados utilizados

| Dado | Valor | Fonte |
|---|---|---|
| P001 — Camiseta Essencial | R$ 59,90 | [documentacao.md, linha 51](evidencias/documentacao.md) |
| P004 — Boné Aba Curva | R$ 49,90 | [documentacao.md, linha 54](evidencias/documentacao.md) |
| P005 — Mochila Urbana 20L | R$ 100,00 | [documentacao.md, linha 55](evidencias/documentacao.md) |
| P007 — Jaqueta Corta-Vento | R$ 229,90 | [documentacao.md, linha 57](evidencias/documentacao.md) |
| P008 — Garrafa Térmica 750ml | R$ 50,00 | [documentacao.md, linha 58](evidencias/documentacao.md) |
| Cupom válido | BEMVINDO10 — 10% | [documentacao.md, linha 64](evidencias/documentacao.md) |
| Cupom expirado | VERAO2026 — expirado em 31/03/2026 | [documentacao.md, linha 65](evidencias/documentacao.md) |
| Cupom inexistente usado na execução | QA_INVALIDO | [api_carrinho.jsonl, linha 7](evidencias/api_carrinho.jsonl) |

Para observar os valores na confirmação, usar os dados fictícios `Teste QA`, `qa@example.com` e `01310-100`. Esses dados são apenas preparação, sem cenários de validação cadastral. Fonte do uso anterior: [api_pedidos.jsonl, linha 1](evidencias/api_pedidos.jsonl).

## Pré-condições

- Loja acessível em https://verzel-store.qa-test-verzel-store.workers.dev; endereço registrado em [interface-anterior.jsonl, linha 20](evidencias/interface-anterior.jsonl).
- Iniciar cada cenário com carrinho sem itens e sem cupom aplicado, para evitar interferência entre casos.
- Usar os produtos e preços da tabela; não alterar preços para simular limites que o catálogo não oferece. Fonte: [documentacao.md, linhas 51–58](evidencias/documentacao.md).
- Para CA10 na API, enviar JSON ao mesmo domínio com cabeçalho `Content-Type: application/json`. Fonte: [documentacao.md, linhas 69–79](evidencias/documentacao.md).
- Para o cenário de troca entre cupons válidos, obter um segundo cupom válido autorizado. Não está disponível nos dados atuais. Fonte: [documentacao.md, linhas 64–65](evidencias/documentacao.md).

As condições de isolamento e organização da execução são preparação do teste, não novos requisitos de aceite.

## Cenários de Teste

### Cupons — CA01 a CA05

Fontes: [documentacao.md, linhas 11–15](evidencias/documentacao.md). CT04B é planejado e depende de dados; não deve ser marcado como aprovado sem execução.

```gherkin

  @CT01 @CA01 @CA02
  Esquema do Cenário: Aplicar dez por cento ignorando caixa e espaços externos
    Dado que adicionei uma Camiseta Essencial de R$ 59,90 ao carrinho
    Quando aplico literalmente <entrada> no campo de cupom
    Então o cupom BEMVINDO10 deve ser aplicado
    E o desconto sobre os produtos deve ser R$ 5,99
    E o subtotal deve permanecer R$ 59,90

    Exemplos:
      | entrada            |
      | "BEMVINDO10"       |
      | "bemvindo10"       |
      | "  BeMvInDo10  "   |
    # As aspas delimitam a entrada; os espaços dentro delas fazem parte do dado.

  @CT02 @CA03
  Cenário: Rejeitar cupom inexistente
    Dado que adicionei uma Camiseta Essencial de R$ 59,90 ao carrinho
    Quando aplico o cupom "QA_INVALIDO"
    Então devo ver a mensagem "Cupom inválido."
    E o desconto deve ser R$ 0,00
    E o total deve permanecer R$ 79,80

  @CT03 @CA04
  Cenário: Rejeitar cupom expirado
    Dado que adicionei uma Camiseta Essencial de R$ 59,90 ao carrinho
    Quando aplico o cupom "VERAO2026"
    Então devo ver a mensagem "Cupom expirado."
    E o desconto deve ser R$ 0,00
    E o total deve permanecer R$ 79,80

  @CT04 @CA05
  Cenário: Manter somente um cupom e permitir remover e reaplicar
    Dado que adicionei uma Camiseta Essencial de R$ 59,90 ao carrinho
    E apliquei o cupom "BEMVINDO10"
    Então não devo conseguir aplicar outro cupom sem remover o atual
    Quando removo o cupom atual
    Então o desconto deve ser R$ 0,00
    E devo poder informar um cupom novamente
    Quando reaplico o cupom "BEMVINDO10"
    Então apenas BEMVINDO10 deve estar aplicado
    E o desconto deve ser R$ 5,99

  @CT04B @CA05 @pendente_dados
  Cenário: Trocar entre dois cupons válidos sem acumular descontos
    Dado que foi disponibilizado um segundo cupom válido autorizado
    E conheço o percentual documentado desse segundo cupom
    E tenho uma Camiseta Essencial de R$ 59,90 no carrinho
    E o cupom BEMVINDO10 está aplicado
    Quando removo BEMVINDO10
    E aplico o segundo cupom válido
    Então apenas o segundo cupom deve estar aplicado
    E o desconto deve corresponder somente ao percentual do segundo cupom
```

### Frete e base do desconto — CA06 a CA09

Fontes: [documentacao.md, linhas 16–19](evidencias/documentacao.md), [documentacao.md, linha 28](evidencias/documentacao.md), [documentacao.md, linhas 35–36](evidencias/documentacao.md). Os valores esperados no limite seguem a especificação, mesmo que os bugs atuais impeçam aprovação.

```gherkin
  @CT05 @CA07
  Esquema do Cenário: Cobrar frete fixo e mostrar quanto falta abaixo do limite
    Dado que adicionei <quantidade> unidades de "<produto>" ao carrinho
    E o subtotal dos produtos é R$ <subtotal>
    Quando consulto o resumo do carrinho sem cupom
    Então o frete deve ser R$ 19,90
    E devo ver "Faltam R$ <faltante> para o frete grátis."
    E o total deve ser R$ <total>

    Exemplos:
      | produto           | quantidade | subtotal | faltante | total  |
      | Camiseta Essencial | 1          | 59,90    | 140,10   | 79,80  |
      | Boné Aba Curva     | 4          | 199,60   | 0,40     | 219,50 |

  @CT06 @CA06
  Cenário: Conceder frete grátis exatamente em duzentos reais
    Dado que adicionei duas Mochilas Urbanas 20L de R$ 100,00 cada
    E o subtotal dos produtos é R$ 200,00
    Quando consulto o carrinho sem cupom
    Então o frete deve ser grátis
    E o total deve ser R$ 200,00
    E não devo ver mensagem de valor faltante para frete grátis

  @CT07 @CA06
  Cenário: Conceder frete grátis acima de duzentos reais
    Dado que adicionei uma Jaqueta Corta-Vento de R$ 229,90
    Quando consulto o carrinho sem cupom
    Então o frete deve ser grátis
    E o total deve ser R$ 229,90

  @CT08 @CA01 @CA06 @CA08
  Cenário: Preservar frete grátis em duzentos reais após aplicar cupom
    Dado que adicionei duas Mochilas Urbanas 20L de R$ 100,00 cada
    E o subtotal dos produtos é R$ 200,00
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto deve ser R$ 20,00
    E o frete deve ser grátis
    E o total deve ser R$ 180,00
    Quando confirmo a compra com dados válidos
    Então o desconto confirmado deve ser R$ 20,00
    E o frete confirmado deve ser grátis
    E o total confirmado deve ser R$ 180,00

  @CT09 @CA06 @CA08
  Cenário: Usar o subtotal anterior ao desconto para conceder frete grátis
    Dado que adicionei uma Mochila Urbana 20L de R$ 100,00
    E uma Garrafa Térmica 750ml de R$ 50,00
    E uma Camiseta Essencial de R$ 59,90
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal deve permanecer R$ 209,90
    E o desconto deve ser R$ 20,99
    E o frete deve ser grátis mesmo com valor líquido dos produtos de R$ 188,91
    E o total deve ser R$ 188,91
    Quando confirmo a compra com dados válidos
    Então o frete confirmado deve ser grátis
    E o total confirmado deve ser R$ 188,91

  @CT09B @CA09
  Cenário: Não descontar o valor do frete
    Dado que adicionei uma Camiseta Essencial de R$ 59,90
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto deve ser R$ 5,99
    E o frete deve continuar R$ 19,90
    E o total deve ser R$ 73,81
```

### Quantidades e valores monetários — CA10 e CA11

Fontes: [documentacao.md, linhas 20–21](evidencias/documentacao.md), [documentacao.md, linha 264](evidencias/documentacao.md). A API entra somente porque CA10 exige explicitamente a mesma regra nela e na interface.

```gherkin
  @CT10 @CA10
  Cenário: Impedir mais de cinco unidades do mesmo produto pela interface
    Dado que adicionei cinco Camisetas Essenciais de R$ 59,90 cada
    Quando tento incluir uma sexta unidade pelos controles da loja
    Então a interface não deve permitir ultrapassar cinco unidades desse produto
    E o subtotal das cinco unidades deve permanecer R$ 299,50

  @CT11 @CA10 @api
  Esquema do Cenário: Aplicar o limite de cinco unidades também na API
    Dado que preparei um corpo JSON com o produto P005 e quantidade <quantidade>
    E para a rota de pedidos informei dados válidos de cliente
    Quando envio POST para "<rota>" com Content-Type application/json
    Então o status HTTP deve ser <status>
    E o resultado deve ser "<resultado>"

    Exemplos:
      | rota                   | quantidade | status | resultado                   |
      | /api/carrinho/calcular  | 5          | 200    | cinco unidades aceitas       |
      | /api/carrinho/calcular  | 6          | 422    | QUANTIDADE_MAXIMA_EXCEDIDA    |
      | /api/pedidos            | 5          | 201    | cinco unidades aceitas       |
      | /api/pedidos            | 6          | 422    | QUANTIDADE_MAXIMA_EXCEDIDA    |

  @CT12 @CA11
  Cenário: Exibir os valores monetários com duas casas decimais
    Dado que adicionei uma Camiseta Essencial de R$ 59,90
    Quando aplico o cupom "BEMVINDO10"
    Então devo ver subtotal de R$ 59,90
    E desconto de R$ 5,99
    E frete de R$ 19,90
    E total de R$ 73,81
    E todos esses valores devem ser exibidos com duas casas decimais
```

A amostra de CT12 valida precisão e apresentação dos valores disponíveis; não demonstra como o sistema resolve exatamente meia fração de centavo. Não sei esse comportamento sem uma massa capaz de produzi-lo. Fonte dos preços fixos: [documentacao.md, linhas 51–58](evidencias/documentacao.md), [documentacao.md, linha 276](evidencias/documentacao.md).

## Resultado esperado

A história atende ao recorte quando todos os critérios CA01–CA11 são satisfeitos: desconto correto sobre produtos, normalização, rejeições com mensagens corretas, um cupom por vez, frete/faltante corretos pelo subtotal anterior ao desconto, limite de cinco unidades em ambas as camadas e valores com duas casas decimais. Fontes: [documentacao.md, linhas 11–21](evidencias/documentacao.md).

O plano não exige login, cadastro, pagamento online, validações cadastrais ou persistência entre abas. O preenchimento de dados válidos serve apenas para observar o valor final da promoção. Referência do recorte: [documentacao.md, linhas 11–21](evidencias/documentacao.md).

## Interpretações adotadas

- As seções e a ordem do documento seguem [exemplo-pano-teste.md](../exemplo-pano-teste.md); os dados de fornecedores do exemplo não se aplicam a esta história.
- CA10 exige cobertura na API, portanto o plano não se limita a E2E visual. Fonte: [documentacao.md, linha 20](evidencias/documentacao.md).
- CA05: reaplicar o mesmo cupom não comprova troca entre dois cupons válidos. CT04B permanece pendente de dados e não deve ser automatizado com um código inventado. Fonte: [documentacao.md, linhas 64–65](evidencias/documentacao.md).
- Os três blocos Gherkin são trechos de uma única funcionalidade, apresentados por assunto para leitura. Este arquivo é um plano em Markdown, não uma suíte Cucumber executável.
