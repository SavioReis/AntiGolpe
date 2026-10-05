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
- **Facilita a revisão:** `responsive.css` reúne todos os breakpoints em um só lugar.
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

**Sobre o `minmax(0, Xfr)` no `.artigo-layout`:** por padrão, uma coluna
`1fr` não encolhe abaixo do tamanho do seu conteúdo mais largo (uma URL
longa, por exemplo), o que empurra o layout para fora da tela. Usar
`minmax(0, …)` permite que a coluna encolha.

> **Correção feita depois:** a página `artigo.html` aplicava essas colunas
> com um `style=""` inline em vez da classe `.artigo-layout`. Como o estilo
> inline tem prioridade, a media query de `≤ 1024px` nunca era aplicada e,
> no smartphone, a página ficava com duas colunas e rolagem lateral. O
> HTML passou a usar `class="artigo-layout"` e todos os estilos inline do
> projeto foram trocados por classes (`.container--estreito`,
> `.container--login`, `.acoes-linha`).

---

## 6. Organização de espaçamentos

Todos os espaçamentos do projeto derivam de **uma escala única** em `tokens.css`:

| Token | Valor | Uso típico |
|-------|-------|------------|
| `--esp-1` | 0,25rem (4px) | Espaço entre ícone e texto |
| `--esp-2` | 0,5rem (8px) | Espaço interno de badges e listas |
| `--esp-3` | 0,75rem (12px) | `gap` entre botões |
| `--esp-4` | 1rem (16px) | Margem lateral do container, `gap` padrão de grids |
| `--esp-5` | 1,5rem (24px) | Padding dos cards |
| `--esp-6` | 2rem (32px) | Espaço entre blocos de uma seção |
| `--esp-7` | 3rem (48px) | Espaço entre seções da página |
| `--esp-8` | 4rem (64px) | Padding do hero |

Nenhum componente usa valores "soltos" como `13px` ou `22px`: sempre um
token. No breakpoint de `≤ 480px`, os tokens maiores são redefinidos
(`--esp-7: 2rem`, `--esp-8: 2.5rem`), então todos os espaçamentos grandes
diminuem juntos no celular sem precisar alterar cada componente.

---

## 7. Adaptações para telas menores

- **Menu:** em `≤ 1024px` a navegação vira um menu recolhível aberto pelo
  botão "☰ Menu" (`main.js` alterna `data-open` e `aria-expanded`). Os
  botões "Entrar" e "Criar conta" saem do cabeçalho (continuam no rodapé).
- **Cards e listas:** os grids `auto-fit` reduzem o número de colunas
  sozinhos; em `≤ 768px` são forçados para 1 coluna.
- **Formulários:** campos ocupam 100% da largura; em `≤ 640px` os grupos
  de filtros da biblioteca empilham.
- **Simulador:** os botões "É golpe" / "É legítimo" ficam lado a lado no
  desktop e empilham em `≤ 640px`, para ficarem grandes o suficiente para
  o toque.
- **Tabelas:** não são espremidas; ficam dentro de `.tabela-wrapper` com
  rolagem horizontal própria (só a tabela rola, não a página).
- **Tipografia:** títulos usam `clamp()` em `base.css`, então diminuem
  gradualmente com a largura da tela.

---

## 8. Evidências

Capturas feitas com o Chromium (Playwright) em página inteira, na largura
exata de cada viewport pedido. Pasta: `docs/evidencias/etapa-03/`.

| Interface | Desktop (1440 × 900) | Tablet (768 × 1024) | Smartphone (390 × 844) |
|-----------|----------------------|---------------------|------------------------|
| Tela 01 — Início (`index.html`) | `desktop-tela-01.png` | `tablet-tela-01.png` | `smartphone-tela-01.png` |
| Tela 02 — Simulador (`simulador.html`) | `desktop-tela-02.png` | `tablet-tela-02.png` | `smartphone-tela-02.png` |
| Tela 03 — Biblioteca (`biblioteca.html`) | `desktop-tela-03.png` | `tablet-tela-03.png` | `smartphone-tela-03.png` |

O que observar em cada tamanho:

- **Desktop:** menu horizontal completo, estatísticas em 4 colunas, cards
  da biblioteca em 4 colunas e opções de filtro distribuídas em linha.
- **Tablet:** menu recolhido no botão "☰ Menu", estatísticas em 2 colunas,
  cards em 1 coluna.
- **Smartphone:** tudo em 1 coluna, botões do simulador empilhados e em
  largura total, rodapé em coluna única.

Como refazer as capturas manualmente: abrir a página no Chrome, `F12`,
ativar o modo dispositivo (`Ctrl+Shift+M`), digitar a resolução em
"Dimensions" e usar o menu ⋮ → "Capture full size screenshot".

---

## 9. Localização dos arquivos CSS

| Arquivo | O que tem de responsividade |
|---------|-----------------------------|
| `src/css/responsive.css` | **Todas as media queries** (1024, 768, 640 e 480px) e `prefers-reduced-motion` |
| `src/css/layout.css` | Grids `auto-fit`/`minmax` (`.grid-2/3/4`), Flexbox do header e do footer |
| `src/css/components.css` | `.stats`, `.tabela-wrapper` (rolagem horizontal), `.acoes-linha` |
| `src/css/pages.css` | `.artigo-layout`, `.decisao`, `.simulador__topo` |
| `src/css/base.css` | Títulos com `clamp()` |
| `src/css/tokens.css` | Escala de espaçamentos |
