# Arquitetura — AntiGolpe

Este documento registra as decisões técnicas do projeto, conforme pedido
pelas regras da disciplina. Foi escrito pra servir de apoio na auditoria
e pra qualquer pessoa que for mexer no código depois.

## Visão geral

O AntiGolpe é uma aplicação web educativa. Três frentes:

- Simulador interativo, onde o usuário treina o reconhecimento de golpes.
- Biblioteca de artigos categorizados, com busca e filtros.
- Verificador de links, que consulta uma base local de domínios suspeitos.

A evolução do projeto é incremental. Cada etapa adiciona uma camada sem
retrabalho: HTML semântico na 02, CSS modular na 03, JavaScript na 04 e
backend a partir da 05.

## Stack

No cliente, uso HTML5 semântico, CSS3 com Flexbox e Grid, e JavaScript
puro (ES2022+). A escolha por JavaScript puro foi consciente: os
requisitos das etapas 02 a 04 pedem manipulação de DOM, eventos, arrays
e funções, e um framework só adicionaria complexidade sem resolver nada
que já não estivesse resolvido. O bundle final é praticamente zero e o
professor consegue ver os fundamentos no código.

No servidor, a previsão é Node.js 20 com Express, sessão com
express-session, hash de senha com bcrypt, validação com Zod, cabeçalhos
seguros com helmet e rate limit com express-rate-limit. Como o tema do
projeto é segurança, faz sentido que a própria aplicação siga as práticas
que ensina.

Na persistência, a previsão é Prisma ORM com SQLite em desenvolvimento e
PostgreSQL em produção. Optei por modelo relacional em vez de MongoDB
porque o domínio tem relacionamentos fortes (usuário → tentativas →
respostas, categoria → cenários → artigos). SQLite também facilita a
demo local, sem exigir servidor de banco de dados rodando.

Para testes, uso Vitest com jsdom. Isso permite rodar a lógica do
navegador dentro do Node sem precisar abrir um browser de verdade.

## Mudanças em relação à proposta

A proposta (docs/proposta.md) previa Tailwind, EJS e Chart.js no
cliente. Troquei Tailwind por CSS próprio porque a Etapa 03 avalia
justamente Flexbox, Grid e media queries escritos à mão. EJS e Chart.js
ficaram para quando houver servidor e dados reais. A tabela completa
com os motivos está na seção 9 da proposta.

## Estrutura de pastas

src/ guarda tudo que o navegador consome: HTML, CSS e JS.
docs/ guarda a documentação do projeto.
tests/ guarda os testes automatizados.
package.json e vitest.config.js ficam na raiz.

Cada arquivo tem um papel único. Não misturo camadas.

## Decisões técnicas

### Sem framework de front-end

A Etapa 04 exige DOM, eventos, arrays e funções. Um framework resolveria
isso, mas traria build step, bundler e mais uma camada pra explicar na
auditoria. Preferi JavaScript puro, com arquivos separados por
responsabilidade. Perco um pouco de ergonomia na renderização e ganho
clareza, zero dependência e alinhamento direto com o que a disciplina
pede.

### utils.js compartilhado

Cinco módulos precisavam das mesmas coisas: validar e-mail, escapar
HTML, mostrar erro em campo, usar localStorage. Concentrei tudo em
utils.js, exposto como window.AntiGolpe. O trade-off é depender de um
objeto global, mas em troca evito duplicação e mantenho os módulos
independentes entre si.

### Escapar HTML em todo conteúdo dinâmico

O projeto é sobre segurança, então deixar XSS no próprio site seria
incoerente. Toda string que vai pro DOM via innerHTML passa por
escaparHtml() antes. Está em simulador.js, verificador.js e
biblioteca.js.

### CSS dividido em sete arquivos

Um CSS único de quase 700 linhas dificulta achar breakpoints e mexer em
tokens de design. Dividi por responsabilidade: tokens, base, layout,
components, pages e responsive, com um style.css que só faz os imports.
O arquivo responsive.css concentra todos os @media, então a auditoria
consegue ver os quatro breakpoints de uma vez.

### Desktop-first com quatro breakpoints

Mobile-first é o padrão moderno, mas o produto é usado principalmente em
desktop (ferramenta de consulta e treino). Então a base é desktop e os
@media são max-width em 1024, 768, 640 e 480 pixels. O mínimo exigido
era dois breakpoints; entreguei quatro.

### localStorage só no verificador

O histórico de consultas faz sentido entre sessões, então persiste. O
progresso do simulador não: cada rodada deve começar limpa. Por isso o
localStorage aparece só no verificador.

### novalidate nos formulários

A validação nativa do HTML tem mensagem fixa por navegador, em idioma do
sistema, e não dá pra customizar. Preferi desligar com novalidate e
controlar tudo em JS, com mensagens inline em português e aria-invalid
para acessibilidade. Perco em simplicidade, ganho em consistência.

### Testes com Vitest e jsdom

O código é do navegador, então testar em Node exige simular window,
document e localStorage. jsdom faz isso. Não cobre layout nem CSS, mas
cobre a lógica crítica em milissegundos.

## Fluxo de dados hoje

O usuário interage com a página HTML. A página carrega os scripts JS.
Cada módulo tem seu próprio array local (CENARIOS em simulador.js,
ARTIGOS em biblioteca.js, DOMINIOS_SUSPEITOS em verificador.js). O
módulo valida a entrada, aplica a regra e renderiza via innerHTML com
escape. O DOM é atualizado.

Quando o backend entrar, esses arrays viram chamadas fetch para a API
Express. As funções de renderização continuam as mesmas.

## Modelo de dados previsto

Já está descrito em docs/proposta.md, seção 6. As entidades são Usuario,
TipoGolpe, Cenario, Tentativa, Resposta, Artigo, DominioSuspeito,
Denuncia e Conquista. A migração vai ser incremental: primeiro as
tabelas usadas pelo simulador e pelo verificador, depois as demais.

## Segurança

O que já está implementado: escape de HTML em conteúdo dinâmico e
validação no cliente.

O que está previsto para a próxima etapa: validação no servidor com Zod,
hash de senha com bcrypt, proteção CSRF, cabeçalhos HTTP seguros com
helmet e rate limiting.

## Testes

Hoje cobrem utils.js (validarEmail, escaparHtml, normalizarUrl,
debounce, storage e formatarData) e o simulador (tests/simulador.test.js).
O teste do simulador monta o HTML mínimo da página no jsdom, carrega o
script e clica nos botões como um usuário faria. Ele verifica que a
rodada tem 10 perguntas, que a categoria não aparece antes da resposta e
que encerrar no meio calcula o resultado só sobre o que foi respondido. A estratégia é evoluir em três
camadas: unitário (atual), integração com Supertest na próxima etapa e
end-to-end mais adiante.

## Limitações

Sem backend. Sem autenticação real. Sem testes de integração ou E2E.