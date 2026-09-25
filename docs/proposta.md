# AntiGolpe — Proposta e Especificação do Projeto

**Disciplina:** TCS 1
**Etapa:** 01 — Proposta e Especificação
**Tag de entrega:** `etapa-01`

---

## 1. Nome da aplicação

**AntiGolpe** — Plataforma educativa e colaborativa de prevenção a golpes digitais.

---

## 2. Descrição do problema

A popularização de serviços digitais (bancos, marketplaces, mensageria e redes
sociais) ampliou drasticamente a superfície de ataque disponível para
criminosos. Golpes como *phishing*, falsos funcionários de banco, boletos
fraudulentos, perfis clonados em redes sociais, links maliciosos e fraudes via
PIX tornaram-se rotineiros e atingem, sobretudo, usuários com baixo letramento
digital.

O problema central é que **as pessoas não reconhecem os sinais de alerta de um
golpe no momento em que ele acontece**. As informações existem, mas estão
dispersas, em linguagem técnica ou em canais que o usuário não consulta
justamente quando precisa. Além disso, golpes evoluem rapidamente, e material
estático fica desatualizado — é necessária uma base de conhecimento alimentada
continuamente.

O AntiGolpe ataca esse problema por duas frentes complementares:

1. **Educação ativa:** o usuário treina o reconhecimento de golpes em um
   simulador interativo, com feedback imediato sobre cada escolha.
2. **Inteligência coletiva:** usuários e administradores alimentam uma base
   consultável de golpes, domínios e números suspeitos.

---

## 3. Público-alvo

- **Primário:** usuários comuns de internet, com pouca familiaridade com
  segurança digital — incluindo idosos, pessoas em processo de inclusão digital
  e usuários de aplicativos bancários.
- **Secundário:** professores, agentes de educação digital, instituições de
  ensino e empresas que queiram treinar colaboradores.
- **Terciário:** administradores da plataforma, responsáveis por curadoria de
  conteúdo e moderação das denúncias.

---

## 4. Objetivo principal

Desenvolver uma aplicação web que **reduza a probabilidade de o usuário cair em
golpes digitais**, por meio de treinamento interativo, consulta rápida a uma
base colaborativa de golpes conhecidos e verificação de links suspeitos —
registrando o progresso individual do usuário ao longo do tempo.

---

## 5. Funcionalidades da aplicação

### Obrigatórias (escopo base)

| # | Funcionalidade | Descrição |
|---|----------------|-----------|
| F1 | **Autenticação de usuários** | Cadastro, login e logout com senha armazenada via hash (bcrypt) e sessão em cookie seguro. |
| F2 | **Simulador de golpes** | O usuário recebe situações realistas (SMS, e-mail, mensagem de app) e decide se é golpe ou legítimo. Cada resposta gera feedback explicativo. |
| F3 | **Biblioteca de golpes** | Repositório de artigos sobre tipos de golpe, com busca textual e filtro por categoria e nível de risco. |
| F4 | **Verificador de link** | O usuário cola uma URL e o sistema consulta a base de domínios suspeitos, retornando um veredito e a justificativa. |
| F5 | **Painel de progresso** | Área do usuário com pontuação, histórico de tentativas, taxa de acerto por categoria de golpe e conquistas desbloqueadas. |
| F6 | **Ranking de usuários** | Classificação por pontuação acumulada, com filtro por período. |
| F7 | **Denúncia colaborativa de golpes** | Usuário autenticado registra um golpe recebido (descrição, categoria, canal, dados do remetente). Denúncias entram em moderação. |
| F8 | **Módulo administrativo** | Área restrita para CRUD de cenários, artigos e domínios suspeitos, além de moderação de denúncias. |

### Desejáveis (evolução, se houver tempo)

- Comparativo "você acertou X% vs. média dos usuários Y%".
- Exportação do histórico pessoal em PDF.
- API pública (JSON) de consulta a domínios suspeitos.

---

## 6. Entidades e conceitos do domínio

| Entidade | Descrição | Atributos principais |
|----------|-----------|----------------------|
| **Usuario** | Pessoa cadastrada na plataforma. | id, nome, email, senha_hash, papel (USER/ADMIN), pontuacao_total, criado_em |
| **TipoGolpe** | Categoria taxonômica do golpe (ex.: phishing bancário, falso boleto, clonagem de WhatsApp). | id, nome, slug, descricao, nivel_risco |
| **Cenario** | Situação simulada exibida no quiz. | id, tipo_golpe_id, titulo, conteudo (texto/canal), eh_golpe (bool), explicacao, dificuldade |
| **Tentativa** | Uma sessão de jogo do usuário no simulador. | id, usuario_id, iniciada_em, finalizada_em, pontuacao |
| **Resposta** | Resposta do usuário a um cenário dentro de uma tentativa. | id, tentativa_id, cenario_id, escolha (bool), correta (bool), respondida_em |
| **Artigo** | Conteúdo educativo da biblioteca. | id, tipo_golpe_id, titulo, slug, corpo, autor_id, publicado_em, visualizacoes |
| **DominioSuspeito** | Domínio/URL sinalizado como malicioso. | id, dominio, motivo, origem, nivel_confianca, reportado_em |
| **Denuncia** | Relato de golpe enviado pela comunidade. | id, usuario_id, tipo_golpe_id, canal, descricao, identificador_remetente, status (PENDENTE/APROVADA/REJEITADA), criado_em |
| **Conquista** | Badge desbloqueável por marcos de desempenho. | id, nome, descricao, criterio, icone |

> **Relacionamentos principais:** Usuario 1—N Tentativa; Tentativa 1—N Resposta;
> Cenario 1—N Resposta; TipoGolpe 1—N Cenario; TipoGolpe 1—N Artigo;
> TipoGolpe 1—N Denuncia; Usuario N—N Conquista (via UsuarioConquista).

---

## 7. Telas / interfaces

### T1 — Home / Landing
Apresenta a proposta, o impacto esperado (estatísticas agregadas da própria
base), atalhos para o simulador, biblioteca e verificador de links. Exibe CTA de
cadastro e, se autenticado, resumo do progresso.

### T2 — Simulador de Golpes
Interface de jogo. Exibe o cenário (aparência de SMS, e-mail ou mensagem de
app), dois botões de decisão (**"É golpe"** / **"É legítimo"**) e, após a
resposta, um painel de feedback com os sinais de alerta destacados. Barra de
progresso da tentativa e pontuação parcial no topo.

### T3 — Biblioteca de Golpes
Listagem em cards com busca textual e filtros (categoria, nível de risco).
Clique abre a página de detalhe do artigo, com exemplos reais, sinais de alerta
e "como se proteger".

### T4 — Verificador de Link
Campo único para colar a URL. Resultado em destaque: **Seguro / Suspeito /
Desconhecido**, com motivos e nível de confiança. Histórico das últimas
consultas do usuário.

### T5 — Painel do Usuário (Dashboard)
Cards de pontuação total, taxa de acerto geral, gráfico de desempenho por
categoria, histórico de tentativas e galeria de conquistas.

### T6 — Ranking
Tabela ordenável por pontuação, com filtros por período (semana, mês, geral) e
destaque da posição do próprio usuário.

### T7 — Área Administrativa
CRUD de cenários, artigos e domínios suspeitos; fila de moderação de denúncias;
visualização de métricas gerais (usuários ativos, cenários mais errados,
domínios mais consultados).

---

## 8. Operações da aplicação

| # | Operação | Tipo | Descrição |
|---|----------|------|-----------|
| O1 | `POST /auth/registrar` | Escrita | Cria usuário com validação de e-mail único e hash de senha. |
| O2 | `POST /auth/login` | Escrita | Autentica e abre sessão. |
| O3 | `GET /simulador` | Leitura | Sorteia N cenários (respeitando dificuldade e tipos já vistos) e cria uma Tentativa. |
| O4 | `POST /simulador/responder` | Escrita | Registra a Resposta, calcula acerto e devolve feedback. |
| O5 | `POST /simulador/finalizar` | Escrita | Fecha a Tentativa, consolida pontuação e avalia conquistas. |
| O6 | `GET /biblioteca?q=&categoria=` | Leitura | Busca e filtra artigos publicados. |
| O7 | `POST /verificador` | Leitura | Normaliza a URL informada e consulta a base de domínios suspeitos. |
| O8 | `POST /denuncias` | Escrita | Registra denúncia da comunidade com status PENDENTE. |
| O9 | `PATCH /admin/denuncias/:id` | Escrita | Aprova ou rejeita denúncia (apenas ADMIN). |
| O10 | `GET /ranking?periodo=` | Leitura | Retorna ranking agregado por período. |
| O11 | `PUT /admin/cenarios/:id` | Escrita | Atualiza cenário existente (apenas ADMIN). |
| O12 | `DELETE /admin/dominios/:id` | Escrita | Remove domínio suspeito (apenas ADMIN). |

---

## 9. Tecnologias

### Cliente
- **HTML5** semântico e **CSS3** (layout responsivo com Flexbox/Grid)
- **JavaScript (ES2022+)** para interatividade do simulador e do verificador
- **EJS** como template engine (renderização no servidor)
- **Tailwind CSS** para estilização consistente e responsiva
- **Chart.js** para os gráficos do painel do usuário

### Servidor
- **Node.js 20 LTS**
- **Express 4** — roteamento e middlewares
- **express-session** + `connect-sqlite3` — gerenciamento de sessão
- **bcrypt** — hash de senhas
- **helmet** — cabeçalhos HTTP de segurança
- **csurf** (ou `csrf-csrf`) — proteção contra CSRF
- **Zod** — validação e sanitização de entrada
- **express-rate-limit** — mitigação de força bruta e abuso
- **Vitest + Supertest** — testes automatizados

### Persistência
- **Prisma ORM** — modelagem, migrações e acesso a dados
- **SQLite** em desenvolvimento (arquivo local, zero configuração)
- **PostgreSQL** em produção (mesma modelagem Prisma, sem reescrita)

> **Nota de coerência:** sendo um projeto sobre segurança digital, a própria
> aplicação adota as boas práticas que ensina — hash de senha, consultas
> parametrizadas via ORM, validação server-side, proteção CSRF e cabeçalhos
> seguros.

---

## 10. Arquitetura da solução

```mermaid
flowchart TB
    subgraph Cliente["🖥️ Cliente (Navegador)"]
        UI[HTML + CSS + JS]
        CH[Chart.js]
    end

    subgraph Servidor["⚙️ Servidor Node.js"]
        EXP[Express<br/>Rotas + Middlewares]
        AUTH[Auth<br/>bcrypt + session]
        SVC[Serviços de Domínio<br/>Simulador · Biblioteca<br/>Verificador · Ranking]
        VAL[Validação Zod]
        SEC[Helmet · CSRF<br/>Rate Limit]
    end

    subgraph Dados["🗄️ Persistência"]
        ORM[Prisma ORM]
        DB[(SQLite dev<br/>PostgreSQL prod)]
    end

    UI -->|HTTP/HTTPS| EXP
    CH -.->|JSON| EXP
    EXP --> SEC
    SEC --> VAL
    VAL --> AUTH
    VAL --> SVC
    AUTH --> SVC
    SVC --> ORM
    ORM --> DB