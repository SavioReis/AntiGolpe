# Etapa 02 — Protótipo Estrutural com HTML Semântico

**Projeto:** AntiGolpe
**Tag de entrega:** `etapa-02`

---

## 1. Funcionalidades representadas no protótipo

O protótipo cobre, em HTML estático, as principais jornadas previstas na
especificação da Etapa 01. Nenhuma lógica de servidor, persistência ou
autenticação real foi implementada — o objetivo é estruturar as interfaces.

| Funcionalidade da Etapa 01 | Interface que a representa |
|----------------------------|-----------------------------|
| F1 — Autenticação | `login.html`, `cadastro.html` |
| F2 — Simulador de golpes | `simulador.html` |
| F3 — Biblioteca de golpes | `biblioteca.html`, `artigo.html` |
| F4 — Verificador de link | `verificador.html` |
| F5 — Painel de progresso | `painel.html` |
| F6 — Ranking | representado por card em `painel.html` (a página dedicada depende de dados reais de vários usuários, então fica para quando houver backend) |
| F7 — Denúncia colaborativa | formulário em `painel.html` |
| F8 — Módulo administrativo | `admin.html` |
| Landing / apresentação | `index.html` |

---

## 2. Páginas criadas

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Home com hero, estatísticas, "como funciona", golpes comuns e CTA. |
| `simulador.html` | Interface de jogo: progresso, cenário exibido como mensagem, botões de decisão e painel de feedback. |
| `biblioteca.html` | Listagem de artigos com filtros por categoria, nível de risco e busca textual. |
| `artigo.html` | Detalhe de um artigo, com breadcrumb, seções (como funciona, sinais de alerta, como se proteger) e sidebar de relacionados. |
| `verificador.html` | Formulário de consulta de URL, bloco de resultado com veredito e tabela de histórico. |
| `login.html` | Formulário de autenticação com e-mail, senha e "manter conectado". |
| `cadastro.html` | Formulário de criação de conta com fieldset de dados de acesso + preferências. |
| `painel.html` | Dashboard do usuário: KPIs, tabela de desempenho, histórico, conquistas e formulário de denúncia. |
| `admin.html` | Painel administrativo com navegação por seções, CRUD visual de cenários/artigos/domínios e moderação de denúncias. |

Total: **9 páginas**, acima do mínimo de 3 exigido.

---

## 3. Decisões relacionadas à estrutura HTML

### 3.1 Semântica estrutural

- **`<header>` de site** com `nav` + `aria-label="Navegação principal"` — o mesmo bloco se repete em todas as páginas, o que facilita extrair esse trecho para um template/partial quando houver renderização no servidor.
- **`<main>` único por página**, envolvendo apenas o conteúdo específico da tela — nunca o cabeçalho nem o rodapé.
- **`<section>` para agrupar conteúdo temático** (hero, estatísticas, como funciona). Cada `<section>` referencia seu próprio título via `aria-labelledby`.
- **`<article>` para conteúdo autocontido e reutilizável**: cards de golpes, cenário do simulador, artigo da biblioteca.
- **`<aside>`** para blocos complementares (feedback do simulador, sidebar de artigos relacionados).
- **`<footer>`** de site com 3 blocos `nav` (Recursos / Conta / Sobre), cada um com `aria-labelledby`.

### 3.2 Formulários

- **Todo `<input>` tem `<label>` associado via `for`/`id`.** Nenhum placeholder substitui o label.
- **`<fieldset>` + `<legend>`** usados em `cadastro.html` (Dados de acesso / Preferências) e nos filtros de `biblioteca.html` (Categoria / Nível de risco) para agrupar campos relacionados semanticamente.
- **Tipos semânticos de input**: `email`, `password`, `search`, `url`, `checkbox`, `radio`, `select`, `textarea` — em vez de tudo como `text`.
- **Atributos de acessibilidade**: `autocomplete`, `required`, `minlength`, `maxlength`, `pattern`, `aria-describedby` apontando para textos de ajuda.
- **Botões com `type` explícito** (`submit`, `reset`, `button`) para evitar comportamento inesperado.

### 3.3 Tabelas de dados

- Todas as tabelas usam `<caption>` (visível ou `.visually-hidden`), `<thead>`, `<tbody>`, `<th scope="col">`.
- Usadas apenas para dados tabulares reais (histórico, desempenho, listagens administrativas) — **nunca para layout**.

### 3.4 Hierarquia de títulos

- **Um único `<h1>` por página**, seguido de `<h2>` por seção e `<h3>` para subitens.
- Nenhum salto de nível (ex.: h2 → h4) para não quebrar navegação por leitores de tela.
- Títulos puramente decorativos foram evitados; quando o título de seção seria redundante, usamos `class="visually-hidden"`.

### 3.5 Acessibilidade

- **`aria-current="page"`** marca o link ativo da navegação (definido pelo `main.js`, mas também presente nos HTMLs iniciais).
- **`:focus-visible`** com outline azul definido no CSS — navegação por teclado em todos os controles.
- **`aria-expanded`** no botão de menu mobile, alternado pelo JS.
- **`aria-label` em navs** para diferenciar os múltiplos `<nav>` de uma mesma página (principal, breadcrumb, footer).
- **Textos alternativos**: ícones decorativos recebem `aria-hidden="true"`; ícones informativos teriam `alt` (não houve necessidade nesta etapa).
- **`lang="pt-BR"`** em todas as páginas.

### 3.6 Organização de arquivos

Os arquivos estão separados por tipo dentro de `src/`:

```
src/
├── index.html, simulador.html, biblioteca.html, artigo.html,
│   verificador.html, login.html, cadastro.html, painel.html, admin.html
├── css/   ← estilos (detalhados na Etapa 03)
└── js/    ← scripts (detalhados na Etapa 04)
```

- **Um arquivo HTML por tela.** Cada página corresponde a uma interface da
  proposta (T1 a T7). Isso deixa claro qual arquivo editar para mudar
  uma tela.
- **Nomes em português, minúsculos e sem acento** (`verificador.html`,
  não `Verificador de Link.html`), para evitar problemas de URL e de
  diferença entre maiúsculas e minúsculas no servidor.
- **Caminhos relativos** (`css/style.css`, `js/main.js`, `painel.html`):
  o site funciona abrindo direto do disco ou servido por qualquer
  servidor estático, sem configuração.
- **Um único ponto de entrada de CSS** (`css/style.css`) incluído em todas
  as páginas, para que nenhuma página fique com estilo diferente por
  esquecer um arquivo.
- **Scripts no fim do `<body>` com `defer`**, para que o HTML seja
  exibido antes de o JavaScript carregar.

> Observação: na época desta etapa a pasta se chamava `public/`. Ela foi
> renomeada para `src/` para seguir a estrutura padrão pedida nas regras
> da disciplina.

