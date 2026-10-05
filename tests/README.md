# Testes — AntiGolpe

Testes automatizados do projeto. Escritos em Vitest com ambiente jsdom,
que simula window, document e localStorage dentro do Node.

## Como rodar

    npm install
    npm test

Ou em modo watch:

    npm run test:watch

## O que está sendo testado

Por enquanto, apenas as funções de src/js/utils.js, que são puras ou
quase puras e não dependem de uma página específica:

validarEmail, que aceita formatos válidos e rejeita inválidos.
escaparHtml, que neutraliza caracteres perigosos antes de ir pro DOM.
normalizarUrl, que aceita URLs com protocolo e rejeita sem.
debounce, que agrupa chamadas consecutivas.
storage, que grava, lê e remove do localStorage.
formatarData, que transforma ISO em data brasileira.

O simulador (tests/simulador.test.js) também é testado. O teste monta o
HTML mínimo da página, carrega utils.js e simulador.js e clica nos
botões como um usuário faria:

a rodada tem 10 perguntas;
a categoria não aparece antes da resposta;
o feedback aparece depois de responder;
o resultado final aparece após 10 respostas;
encerrar no meio calcula o resultado sobre as perguntas respondidas.

Testes da biblioteca e dos formulários de login e cadastro vêm conforme
o projeto evoluir.

## Por que testar

Além de evitar regressão quando algo mudar, os testes servem como
documentação executável. O próprio teste descreve o que a função
deveria fazer.

## Limitações

Sem testes de integração entre módulos. Sem testes end-to-end. Sem
testes de acessibilidade.