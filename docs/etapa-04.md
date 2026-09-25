# Etapa 04 — Interatividade com JavaScript

**Projeto:** AntiGolpe
**Tag de entrega:** `etapa-04`

---

## 1. Visão geral

Esta etapa adiciona comportamento dinâmico às páginas do AntiGolpe, mantendo a
arquitetura de HTML semântico (Etapa 02) e CSS modular (Etapa 03). Foram
implementadas **5 funcionalidades interativas** (o mínimo exigido é 3), todas
resolvidas em JavaScript puro, sem bibliotecas externas.

---

## 2. Funcionalidades interativas implementadas

### F1 — Simulador de Golpes (jogo completo)

**Como funciona:**
1. Ao carregar `simulador.html`, o JS embaralha o array `CENARIOS` e seleciona 10.
2. Renderiza o cenário atual (canal, remetente, conteúdo) e dois botões de decisão.
3. Ao clicar em "É golpe" ou "É legítimo", o sistema compara com `ehGolpe`,
   registra a resposta, atualiza a pontuação e exibe um painel de feedback com
   a explicação e os sinais de alerta.
4. O botão "Próxima pergunta" avança. Ao final, uma tela de resultado mostra:
   - pontuação total, acertos, erros e aproveitamento;
   - tabela com desempenho agrupado por categoria (via `reduce`);
   - botão "Jogar novamente" que reinicia o estado.
5. A barra `<progress>` é atualizada a cada pergunta.

**Arquivos envolvidos:** `public/simulador.html`, `public/js/simulador.js`, `public/js/utils.js`

**Conceitos aplicados:**
- Array de objetos (`CENARIOS`);
- Estado da aplicação em um objeto `estado`;
- Funções puras (`embaralhar`, `cenarioAtual`, `atualizarProgresso`);
- Funções com efeito no DOM (`renderizarCenario`, `renderizarFeedback`, `finalizar`);
- Manipulação de DOM (`innerHTML`, `querySelectorAll`);
- Tratamento de eventos (`addEventListener('click')`);
- Métodos de iteração (`map`, `find`, `reduce`, `forEach`).

---

### F2 — Verificador de Link com histórico persistente

**Como funciona:**
1. O usuário cola uma URL e envia o formulário.
2. `ns.normalizarUrl()` valida o formato e extrai o `hostname`.
3. `classificar()` procura o hostname em `DOMINIOS_SUSPEITOS` e `DOMINIOS_CONFIAVEIS`
   (match exato ou como subdomínio, ex.: `www.itau.com.br` casa com `itau.com.br`).
4. O resultado é renderizado com classe diferente (suspeito / seguro / desconhecido).
5. Cada consulta é adicionada a um histórico em `localStorage` (limite de 10 itens).
6. O histórico é renderizado em tabela e pode ser limpo pelo usuário.

**Arquivos envolvidos:** `public/verificador.html`, `public/js/verificador.js`, `public/js/utils.js`

**Conceitos aplicados:**
- Objeto `ns.storage` com `get`/`set`/`remove` seguros;
- `Array.prototype.find` para busca na base;
- `Array.prototype.unshift` + `slice` para gerenciar o histórico;
- `new URL()` para parsing de URL;
- Renderização dinâmica de tabela via `map().join('')`;
- Delegação indireta de eventos (botão "Limpar histórico" recriado a cada render).

---

### F3 — Busca e filtros em tempo real na Biblioteca

**Como funciona:**
1. Os artigos vivem em um array `ARTIGOS` no JS (não estão mais fixos no HTML).
2. Ao digitar no campo de busca ou marcar uma categoria/risco, o filtro é reaplicado.
3. `filtrar()` combina os três critérios: termo textual, categorias selecionadas e nível de risco.
4. A lista é re-renderizada com `map().join('')`.
5. Quando nenhum resultado casa, o container `#lista-artigos` fica vazio e o
   bloco `#sem-resultados` é exibido (empty state).
6. O contador de resultados é atualizado dinamicamente.
7. Digitação tem **debounce de 200ms** para evitar re-renderizações a cada tecla.

**Arquivos envolvidos:** `public/biblioteca.html`, `public/js/biblioteca.js`, `public/js/utils.js`

**Conceitos aplicados:**
- `Array.prototype.filter` com múltiplas condições;
- `Array.prototype.map` para renderizar cards;
- `Array.from(...).map()` para coletar checkboxes marcados;
- Função utilitária `debounce`;
- Manipulação do atributo `hidden` para alternar entre lista e empty state.

---

### F4 — Validação de cadastro e login

**Como funciona:**
1. Os formulários têm `novalidate` (a validação nativa é desligada — a lógica é do JS).
2. Ao enviar, todos os erros anteriores são limpos e cada campo é validado.
3. Mensagens de erro inline aparecem em `<p class="campo__erro">` logo abaixo do campo.
4. O atributo `aria-invalid="true"` é aplicado no input inválido; o CSS pinta a borda.
5. O foco vai para o primeiro campo inválido.
6. Se tudo estiver válido, um painel de sucesso é exibido (simulação — não há backend).
7. No cadastro, um medidor de força de senha é atualizado enquanto o usuário digita.

**Arquivos envolvidos:** `public/login.html`, `public/cadastro.html`, `public/js/auth.js`, `public/js/utils.js`

**Conceitos aplicados:**
- Funções `ns.mostrarErro`, `ns.limparErro`, `ns.limparTodosErros`;
- Regex para validar e-mail;
- Validações compostas (senha com letras + números, senhas coincidentes, termos aceitos);
- Estado de força de senha calculado por pontuação;
- Delegação de eventos com `addEventListener('input')`.

---

### F5 — Formulário de denúncia com contador em tempo real

**Como funciona:**
1. O formulário fica no painel do usuário.
2. Ao digitar a descrição, um contador `X/800 caracteres` é atualizado em tempo real.
3. Se faltarem menos de 50 caracteres, o contador fica com destaque (cor de alerta).
4. Ao enviar, valida categoria, canal e descrição (mínimo 20 caracteres).
5. Erros são exibidos inline; o formulário é limpo após sucesso.

**Arquivos envolvidos:** `public/painel.html`, `public/js/denuncia.js`, `public/js/utils.js`

**Conceitos aplicados:**
- Manipulação de `textContent` em tempo real;
- `classList.toggle` para alternar estado visual;
- Validação de tamanho mínimo com `trim()`;
- Reset controlado do formulário.

---

## 3. Matriz de evidências

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
|-----------|----------------------------|------------|-----------|
| **Manipulação do DOM** | Simulador, Verificador, Biblioteca, Auth, Denúncia | `js/simulador.js`, `js/verificador.js`, `js/biblioteca.js`, `js/auth.js`, `js/denuncia.js` | Uso de `innerHTML`, `textContent`, `querySelector`, `setAttribute`, `classList` em todas as funções `renderizar*()` e `mostrarErro()` |
| **Tratamento de eventos** | Cliques no simulador, submits de formulários, digitação em campos de busca, eventos `change` em filtros | `js/simulador.js`, `js/verificador.js`, `js/biblioteca.js`, `js/auth.js`, `js/denuncia.js` | Chamadas a `addEventListener('click' / 'submit' / 'input' / 'change' / 'reset')` em cada módulo |
| **Validação de formulários** | Cadastro, login, verificador de URL, denúncia | `js/auth.js`, `js/verificador.js`, `js/denuncia.js` | Blocos `if` com múltiplas regras + `ns.mostrarErro()` em cada handler de submit |
| **Alteração dinâmica da interface** | Renderização de cenário + feedback, resultado da URL, lista filtrada, mensagens de erro | `js/simulador.js` (`renderizarCenario`, `renderizarFeedback`), `js/verificador.js` (`renderizarResultado`), `js/biblioteca.js` (`renderizarCards`) | Substituição completa de blocos via `innerHTML` com template strings |
| **Uso de funções** | Todo o projeto | Todos os arquivos em `js/` | Declarações `function nome() {}` e IIFEs com `(function (ns) { ... })(window.AntiGolpe)` |
| **Uso de arrays** | Cenários, artigos, domínios, histórico, categorias | `js/simulador.js` (`CENARIOS`), `js/biblioteca.js` (`ARTIGOS`), `js/verificador.js` (`DOMINIOS_SUSPEITOS`, `DOMINIOS_CONFIAVEIS`) | Arrays constantes no topo de cada módulo |
| **Métodos de iteração** | Embaralhar, filtrar, buscar, agregar, renderizar | `js/simulador.js` (`CENARIOS.find`, `respostas.reduce`, `sinais.map`), `js/biblioteca.js` (`ARTIGOS.filter`, `artigos.map`), `js/verificador.js` (`DOMINIOS_SUSPEITOS.find`, `historico.map`) | Uso de `map`, `filter`, `reduce`, `find`, `forEach`, `Array.from` |
| **Tratamento de situações inválidas** | URL vazia/malformada, senha fraca, senhas diferentes, termos não aceitos, busca sem resultados, descrição curta | `js/verificador.js`, `js/auth.js`, `js/denuncia.js`, `js/biblioteca.js` | `ns.mostrarErro()` com mensagens específicas + empty state da biblioteca (`#sem-resultados`) |

---

## 4. Validações implementadas (detalhamento)

| Campo / Contexto | Validação | Mensagem exibida |
|------------------|-----------|------------------|
| Login → e-mail | Não vazio + formato | "Informe seu e-mail." / "Formato de e-mail inválido." |
| Login → senha | Não vazia + mínimo 8 | "Informe sua senha." / "A senha deve ter pelo menos 8 caracteres." |
| Cadastro → nome | Não vazio + mínimo 3 | "Informe seu nome completo (mín. 3 caracteres)." |
| Cadastro → e-mail | Formato | "Formato de e-mail inválido." |
| Cadastro → senha | Mínimo 8 + letras e números | "A senha deve conter letras e números." |
| Cadastro → confirmação | Igual à senha | "As senhas não coincidem." |
| Cadastro → termos | Aceite obrigatório | "É necessário aceitar os termos." |
| Verificador → URL | Formato + `new URL()` | "A URL precisa começar com http:// ou https://." / "Endereço inválido." |
| Denúncia → categoria | Selecionada | "Selecione uma categoria." |
| Denúncia → canal | Selecionado | "Selecione o canal em que recebeu." |
| Denúncia → descrição | Mínimo 20 caracteres | "Descreva com pelo menos 20 caracteres." |

---

## 5. Situações inválidas tratadas

- **URL sem protocolo** (ex.: `itau.com.br`) → erro inline.
- **URL malformada** (ex.: `ht!tp://`) → capturada por `try/catch` em `new URL()`.
- **Senha sem número** ou **sem letra** → erro específico.
- **Confirmação de senha diferente** → erro específico.
- **Termos não aceitos** → erro no checkbox.
- **Busca sem resultados** → empty state com CTA para limpar filtros.
- **Denúncia com descrição curta** → erro específico + foco no campo.
- **LocalStorage indisponível** (modo privado) → `ns.storage` retorna valor padrão silenciosamente.
- **Conteúdo dinâmico** → sempre passa por `ns.escaparHtml()` antes de ir ao DOM (previne XSS).

---

## 6. Instruções para testar

### 6.1 Como executar

```bash
npx serve public
# ou
python -m http.server 8000 --directory public
```

Abrir `http://localhost:3000` (ou `:8000`) no navegador.

### 6.2 Roteiro de testes

**Simulador (`simulador.html`)**
1. Abrir a página — deve mostrar uma pergunta com progresso "Pergunta 1 de 10".
2. Clicar em "É golpe" ou "É legítimo" — deve aparecer o painel de feedback.
3. Responder 10 perguntas — deve exibir a tela de resultado com a tabela por categoria.
4. Clicar em "Jogar novamente" — a rodada recomeça com cenários reembaralhados.

**Verificador (`verificador.html`)**
1. Enviar vazio → erro "Informe uma URL."
2. Enviar `itau.com.br` (sem http) → erro sobre o protocolo.
3. Enviar `https://bx-seguranca-login.com/login` → veredito **Suspeito**.
4. Enviar `https://www.itau.com.br` → veredito **Seguro** (match de subdomínio).
5. Enviar `https://site-aleatorio.com` → veredito **Desconhecido**.
6. Recarregar a página — o histórico deve persistir. Clicar em "Limpar histórico" apaga.

**Biblioteca (`biblioteca.html`)**
1. Digitar "boleto" na busca — filtra em tempo real.
2. Marcar "Phishing bancário" + risco "Alto" — combina os filtros.
3. Buscar "xyzabc" — deve aparecer o empty state.
4. Clicar em "Limpar filtros" — volta aos 8 artigos.

**Cadastro (`cadastro.html`)**
1. Enviar vazio → todos os campos com erro.
2. Senha `12345678` → erro "A senha deve conter letras e números."
3. Digitar senha forte (ex.: `SenhaForte1!`) → medidor mostra "Forte".
4. Confirmação diferente → erro "As senhas não coincidem."
5. Não marcar termos → erro específico.
6. Tudo válido → painel de sucesso.

**Login (`login.html`)**
1. E-mail `xxx` → erro "Formato de e-mail inválido."
2. Senha curta → erro de tamanho mínimo.
3. Tudo válido → painel de sucesso.

**Denúncia (`painel.html`)**
1. Digitar na descrição → contador atualiza. Ficar perto de 800 → contador fica amarelo.
2. Enviar com descrição de 10 caracteres → erro "pelo menos 20 caracteres."
3. Preencher tudo → painel de sucesso e formulário é limpo.

---

## 7. Evidências (capturas de tela)

Salvar em `docs/evidencias/etapa-04/` com a seguinte convenção de nomes:

```
01-simulador-pergunta.png           → estado normal (pergunta em exibição)
02-simulador-feedback-correto.png   → feedback de acerto
03-simulador-feedback-errado.png    → feedback de erro
04-simulador-resultado-final.png    → tela de resumo com tabela por categoria
05-verificador-suspeito.png         → veredito suspeito
06-verificador-seguro.png           → veredito seguro
07-verificador-erro-url.png         → erro de URL inválida
08-verificador-historico.png        → histórico persistido após refresh
09-biblioteca-filtros.png           → filtros combinados aplicados
10-biblioteca-vazio.png             → empty state
11-cadastro-erros.png               → múltiplos erros de validação
12-cadastro-senha-forte.png         → medidor de força de senha
13-cadastro-sucesso.png             → painel de sucesso
14-login-erros.png                  → validação do login
15-denuncia-erros.png               → validação da denúncia
16-denuncia-sucesso.png             → confirmação da denúncia
```

---

## 8. Estrutura de arquivos

```
public/
├── js/
│   ├── utils.js         ← helpers compartilhados (carregado por todas as páginas)
│   ├── main.js          ← menu mobile + link ativo
│   ├── simulador.js     ← F1
│   ├── verificador.js   ← F2
│   ├── biblioteca.js    ← F3
│   ├── auth.js          ← F4 (login + cadastro)
│   └── denuncia.js      ← F5
├── css/
│   └── components.css   ← estilos de erro/força de senha (adicionados nesta etapa)
├── simulador.html
├── verificador.html
├── biblioteca.html
├── login.html
├── cadastro.html
├── painel.html
└── (demais páginas da Etapa 03 inalteradas)
```

---

## 9. Decisões de projeto

- **Sem framework.** Os requisitos do enunciado pedem DOM, eventos, arrays e
  funções — implementar tudo com JavaScript puro demonstra domínio dos fundamentos
  e mantém o bundle mínimo.
- **`utils.js` compartilhado.** Evita repetir validação de e-mail, escape de HTML,
  gerenciamento de erro por campo e wrapper de `localStorage` em cinco arquivos.
- **`escaparHtml()` em todo conteúdo dinâmico.** O projeto é sobre segurança; deixar
  uma brecha de XSS no próprio site seria incoerente com o discurso.
- **`novalidate` nos formulários.** Permite controle total da mensagem exibida
  (o `required` do HTML ainda é útil para acessibilidade — leitores de tela o respeitam).
- **Debounce na busca.** Sem ele, cada tecla dispararia um `filter` + `innerHTML`
  com 8 cards — desperdício desnecessário.
- **Persistência apenas no verificador.** Foi o único caso em que fazia sentido
  guardar algo entre sessões; o simulador deve começar "limpo" a cada visita.
- **Estado do simulador em objeto único.** Facilita reset (`iniciar()` só
  reatribui os campos) e mantém o código legível.

---

## 10. Critérios de sucesso atendidos

- [x] Manipulação do DOM — ver seção 2, todos os `renderizar*()`.
- [x] Tratamento de eventos — ver matriz de evidências.
- [x] Validação de formulários — 4 formulários, 11 regras.
- [x] Alteração dinâmica da interface — simulador, verificador, biblioteca, mensagens inline.
- [x] Uso de funções — todos os módulos.
- [x] Uso de arrays — `CENARIOS`, `ARTIGOS`, `DOMINIOS_SUSPEITOS`, histórico.
- [x] Métodos de iteração — `map`, `filter`, `reduce`, `find`, `forEach`.
- [x] Tratamento de situações inválidas — seção 5.
- [x] Pelo menos 3 funcionalidades interativas — **5** implementadas.
- [x] `docs/etapa-04.md` — este documento.
- [x] Matriz de evidências — seção 3.
- [x] Instruções de teste — seção 6.