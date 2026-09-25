# Etapa 03 — Interface Responsiva com CSS

**Projeto:** AntiGolpe
**Tag de entrega:** `etapa-03`

---

## 1. Objetivo

Transformar a estrutura HTML produzida na Etapa 02 em uma interface
visualmente organizada, responsiva e utilizável em desktop, tablet e
smartphone, com CSS modular e uso explícito de **Flexbox** e **CSS Grid**.

---

## 2. Organização do CSS

O CSS foi dividido em 7 arquivos com responsabilidades distintas, importados
por `css/style.css`:

| Arquivo | Responsabilidade | Destaque |
|---------|------------------|----------|
| `style.css` | Ponto de entrada — só `@import` | Ordem de carregamento documentada |
| `tokens.css` | Variáveis globais (`:root`) | Cores, espaçamentos, raios, tipografia |
| `base.css` | Reset, tipografia, foco, acessibilidade | `clamp()` em títulos, `prefers-reduced-motion` |
| `layout.css` | Estruturas macro | Flexbox no header/footer, Grid no sistema de grids |
| `components.css` | Componentes reutilizáveis | Botões, cards, formulários, tabelas, badges |
| `pages.css` | Estilos específicos por tela | Hero, simulador, verificador, artigo, admin |
| `responsive.css` | Todos os `@media` | Centraliza os 4 breakpoints do projeto |

### Por que essa divisão?

- **Facilita a manutenção:** alterar uma cor exige mexer em um único arquivo (`tokens.css`).
- **Facilita a defesa:** `responsive.css` permite mostrar todos os breakpoints em uma tela só.
- **Espelha a arquitetura:** `layout` cuida do macro, `components` do micro, `pages` do específico.

---

## 3. Breakpoints adotados

O projeto usa **4 breakpoints** (acima do mínimo de 2 exigido), todos com
`max-width` (abordagem desktop-first — a base é o desktop e cada `@media`
adapta para telas menores):

| Breakpoint | Alvo | Principais mudanças |
|------------|------|----------------------|
| `≤ 1024px` | Tablet horizontal | Menu vira hamburguer; ações do header ocultas; artigo em coluna única; footer em 2 colunas |
| `≤ 768px`  | Tablet vertical | Todos os grids colapsam para 1 coluna; stats em 2 colunas; hero mais compacto |
| `≤ 640px`  | Mobile grande | Botões de decisão empilham; grids de stats e formulários viram 1 coluna |
| `≤ 480px`  | Mobile pequeno | Tipografia e paddings reduzidos; tabelas com scroll horizontal |

---

## 4. Uso de Flexbox

Flexbox foi aplicado em **componentes unidimensionais** (linha OU coluna),
onde o alinhamento e a distribuição entre itens são o requisito principal:

| Elemento | Onde | Motivo |
|----------|------|--------|
| `.site-header__inner` | Header do site | Alinhar marca, nav e ações em linha com `align-items: center` |
| `.brand` | Logo + nome | Alinhamento vertical entre ícone e texto |
| `.nav-principal ul` | Navegação | Distribuição horizontal dos links, com `flex-wrap` |
| `.acoes-header` | Botões Entrar / Criar conta | Espaçamento uniforme entre os dois botões |
| `.hero__acoes` | CTAs da home | Empilhamento natural com `flex-wrap` em mobile |
| `.card__meta` | Rodapé dos cards | Metadados em linha com quebra automática |
| `.campo--checkbox` | Checkboxes | Alinhamento entre input e label |
| `.footer-bottom` | Rodapé | Distribuição `justify-content: space-between` |
| `.admin-secao-header` | Cabeçalhos do admin | Título + botão de ação na mesma linha, empilham em mobile |
| `.simulador__topo` | Topo do simulador | Progresso à esquerda, botão à direita |

---

## 5. Uso de CSS Grid

CSS Grid foi aplicado onde há **estrutura bidimensional** — linhas E colunas
com controle simultâneo:

| Elemento | Estratégia | Comportamento responsivo |
|----------|------------|---------------------------|
| `.grid-2` | `repeat(auto-fit, minmax(280px, 1fr))` | Ajusta o número de colunas conforme o espaço |
| `.grid-3` | `repeat(auto-fit, minmax(240px, 1fr))` | Idem, para cards de golpes |
| `.grid-4` | `repeat(auto-fit, minmax(200px, 1fr))` | Idem, para atalhos |
| `.stats` | Grid de KPIs | 4 colunas no desktop → 2 no tablet → 1 no mobile |
| `.conquistas` | `repeat(auto-fill, minmax(120px, 1fr))` | Preenche a linha com quantas couberem |
| `.decisao` | `grid-template-columns: 1fr 1fr` | 2 colunas no desktop → 1 coluna em `≤ 640px` |
| `.footer-grid` | `2fr 1fr 1fr 1fr` | 4 colunas → 2 em `≤ 1024px` → 1 em `≤ 768px` |
| `.artigo-layout` | `minmax(0, 2.5fr) minmax(0, 1fr)` | 2 colunas → 1 em `≤ 1024px` |
| `.form` | Grid vertical com `gap` | Empilhamento automático dos campos |

**Ponto de destaque:** o uso de `minmax(0, Xfr)` no `.artigo-layout` resolve o
clássico problema de overflow de conteúdo longo dentro de uma célula de grid —
um detalhe que costuma aparecer só quando se testa com texto real.

---

## 6. Organização de espaçamentos

Todos os espaçamentos do projeto derivam de **uma escala única** em `tokens.css`:
