# AntiGolpe

Aplicação web que ensina pessoas a reconhecerem golpes digitais.

## O problema

Muita gente não percebe os sinais de um golpe no momento em que ele
acontece. As informações existem, mas estão espalhadas, em linguagem
técnica, ou em lugares que a pessoa não consulta na hora do aperto. O
AntiGolpe ataca isso de dois jeitos: treino ativo (simulador de golpes)
e uma base colaborativa (artigos + verificador de links).

## O que tem

- Simulador de golpes: 10 cenários sorteados por rodada, pontuação,
  feedback a cada resposta e resumo final por categoria.
- Verificador de links: cola uma URL e o sistema classifica como
  suspeito, seguro ou desconhecido. Guarda histórico no navegador.
- Biblioteca: busca e filtros em tempo real por categoria e risco.
- Cadastro e login: validação campo a campo com mensagens inline e
  medidor de força de senha.
- Painel do usuário: estatísticas, conquistas e formulário para
  denunciar golpes.
- Área administrativa: gestão visual de cenários, artigos, domínios
  suspeitos e moderação de denúncias (ainda sem backend).

## Tecnologias

Cliente: HTML5 semântico, CSS3 (Flexbox e Grid) e JavaScript puro
(ES2022+), sem framework.

Servidor (previsto para a próxima etapa): Node.js + Express, sessão com
express-session, senhas com bcrypt, validação com Zod, segurança com
helmet e rate limit.

Persistência (prevista): Prisma ORM, SQLite em desenvolvimento e
PostgreSQL em produção.

Testes: Vitest + jsdom.

As decisões técnicas estão registradas em docs/arquitetura.md.

## Estrutura

antigolpe/
├── README.md
├── package.json
├── vitest.config.js
├── docs/
│   ├── proposta.md
│   ├── arquitetura.md
│   ├── evidencias.md
│   ├── etapa-02.md
│   ├── etapa-03.md
│   ├── etapa-04.md
│   └── evidencias/
├── src/
│   ├── *.html
│   ├── css/
│   └── js/
└── tests/
    ├── README.md
    └── utils.test.js

## Como rodar

Precisa de Node.js 20 ou superior.

    npm install
    npm run serve

Abre em http://localhost:3000.

Se preferir sem npm:

    python -m http.server 8000 --directory src

Ou simplesmente abrir src/index.html no navegador.

## Como rodar os testes

    npm test

Em modo watch:

    npm run test:watch

## Roteiro rápido pra testar

Simulador: abrir src/simulador.html, responder as 10 perguntas, ver o
resumo final e clicar em "Jogar novamente".

Verificador: abrir src/verificador.html e testar três URLs.
https://bx-seguranca-login.com/login dá suspeito.
https://www.itau.com.br dá seguro.
https://site-aleatorio.com dá desconhecido.
Recarregar a página pra ver o histórico persistir.

Biblioteca: abrir src/biblioteca.html, digitar "boleto" na busca e
marcar filtros. Buscar "xyzabc" pra ver o estado vazio.

Cadastro: abrir src/cadastro.html, enviar vazio pra ver os erros.
Digitar SenhaForte1! pra ver o medidor de força.

Denúncia: abrir src/painel.html, digitar na descrição pra ver o
contador. Enviar com menos de 20 caracteres pra ver o erro.

## Limitações conhecidas

Não tem backend: tudo roda no navegador com arrays em JS e
localStorage.

Não tem autenticação real: os formulários de login e cadastro apenas
simulam sucesso.

Não tem testes de integração entre módulos nem testes end-to-end.

Os documentos das etapas 02 e 03 mencionam a pasta public/, que foi
renomeada para src/ quando a estrutura do repositório foi ajustada.

## Status das etapas

Etapa 01 (proposta) concluída.
Etapa 02 (HTML semântico) concluída.
Etapa 03 (CSS responsivo) concluída.
Etapa 04 (JavaScript) concluída.