# PLANO DE TESTE

## Objetivo do teste

Descreve o propósito principal do teste.

Deve informar de forma clara **o que será validado**, **qual funcionalidade, alteração ou comportamento está sendo testado** e **qual resultado geral se espera confirmar com a execução dos testes**.

O objetivo deve ser direto e resumido, sem listar todos os cenários individualmente.

---

## Dados utilizados

Descreve quais informações, valores, registros, arquivos ou massas de dados serão necessários para executar os testes.

Esta seção deve indicar os tipos de dados necessários para validar os cenários, podendo incluir:

- dados válidos;
- dados inválidos;
- valores mínimos e máximos;
- registros previamente cadastrados;
- dados específicos exigidos pelas regras de negócio;
- arquivos ou documentos necessários;
- combinações de dados relevantes para os testes.

Não é necessário informar valores reais quando eles não forem conhecidos. Nesse caso, deve-se descrever apenas o tipo de dado necessário.

---

## Pré-condições

Descreve tudo o que precisa estar previamente preparado ou configurado antes da execução dos testes.

As pré-condições representam estados, configurações, registros, parâmetros ou situações necessárias para que determinado cenário possa ser executado corretamente.

Devem ser incluídas apenas condições realmente necessárias para o teste.

Exemplos de pré-condições podem envolver:

- registros previamente existentes;
- parâmetros configurados;
- funcionalidades previamente executadas;
- determinadas situações ou estados do sistema;
- dados que precisam estar cadastrados antes do início do teste.

---

## Cenários de Teste

Descreve os testes que devem ser executados para validar a funcionalidade.

Os cenários devem ser criados com base nos requisitos, regras de negócio, critérios de aceite e comportamentos esperados.

Todos os cenários devem ser escritos em **Gherkin**, utilizando a estrutura:

- **DADO**: descreve o contexto inicial ou a condição necessária para o cenário.
- **QUANDO**: descreve a ação executada pelo usuário ou pelo sistema.
- **ENTÃO**: descreve o resultado esperado após a execução da ação.

Quando necessário, também pode ser utilizado:

- **E**: complementa uma condição, ação ou resultado já iniciado.

Estrutura esperada:

```gherkin
Cenário: Descrição do comportamento a ser validado

DADO que determinada condição inicial esteja atendida
QUANDO uma determinada ação for realizada
ENTÃO o sistema deve apresentar o comportamento esperado
```

Quando houver mais de uma condição ou resultado:

```gherkin
Cenário: Descrição do comportamento a ser validado

DADO que determinada condição inicial esteja atendida
E que outra condição necessária esteja configurada
QUANDO uma determinada ação for realizada
E outra ação complementar for executada
ENTÃO o sistema deve apresentar o comportamento esperado
E deve manter ou apresentar outra condição esperada
```

Os cenários devem contemplar, sempre que aplicável:

- fluxo principal;
- fluxos alternativos;
- cenários positivos;
- cenários negativos;
- validações;
- exceções;
- limites;
- mensagens apresentadas pelo sistema;
- regras de negócio;
- impactos em funcionalidades relacionadas.

Cada cenário deve validar um comportamento de forma clara e objetiva.

---

## Resultado esperado

Descreve o comportamento geral que o sistema deve apresentar após a execução correta dos testes.

Deve resumir o resultado esperado da funcionalidade como um todo, considerando os requisitos e regras definidas.

O resultado esperado deve indicar que:

- a funcionalidade apresenta o comportamento previsto;
- as regras de negócio são respeitadas;
- as validações são aplicadas corretamente;
- os dados são tratados de forma adequada;
- não são introduzidos comportamentos incorretos nas funcionalidades relacionadas.
