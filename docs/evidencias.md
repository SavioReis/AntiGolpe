# Evidências — AntiGolpe

Índice de todas as capturas de tela do projeto. Cada etapa tem sua
própria pasta dentro de `docs/evidencias/`.

## Estrutura

```
docs/evidencias/
├── etapa-03/   9 capturas: 3 telas × 3 tamanhos (responsividade)
└── etapa-04/   16 capturas das funcionalidades interativas
```

## Etapa 03 — Interface responsiva

Mesmas três interfaces da Etapa 02 em três tamanhos. Capturas de página
inteira, na largura exata de cada tamanho.

| Interface | Desktop 1440 × 900 | Tablet 768 × 1024 | Smartphone 390 × 844 |
|-----------|--------------------|-------------------|----------------------|
| Tela 01 — Início | `desktop-tela-01.png` | `tablet-tela-01.png` | `smartphone-tela-01.png` |
| Tela 02 — Simulador | `desktop-tela-02.png` | `tablet-tela-02.png` | `smartphone-tela-02.png` |
| Tela 03 — Biblioteca | `desktop-tela-03.png` | `tablet-tela-03.png` | `smartphone-tela-03.png` |

Detalhes em `docs/etapa-03.md`, seção 8.

## Etapa 04 — Interatividade

Capturas em desktop (1440 px de largura).

| Arquivo | Funcionalidade | O que mostra |
|---------|----------------|--------------|
| `01-simulador-pergunta.png` | Simulador | Pergunta em exibição, progresso "1 de 10" |
| `02-simulador-feedback-correto.png` | Simulador | Feedback de acerto |
| `03-simulador-feedback-errado.png` | Simulador | Feedback de erro |
| `04-simulador-resultado-final.png` | Simulador | Resultado com tabela por categoria |
| `05-verificador-suspeito.png` | Verificador | Veredito "Suspeito" |
| `06-verificador-seguro.png` | Verificador | Veredito "Seguro" (subdomínio `www.`) |
| `07-verificador-erro-url.png` | Verificador | Erro: URL sem `https://` |
| `08-verificador-historico.png` | Verificador | Histórico mantido após recarregar a página |
| `09-biblioteca-filtros.png` | Biblioteca | Filtros "Phishing bancário" + risco "Alto" |
| `10-biblioteca-vazio.png` | Biblioteca | Busca sem resultado ("xyzabc") |
| `11-cadastro-erros.png` | Cadastro | Formulário enviado vazio |
| `12-cadastro-senha-forte.png` | Cadastro | Medidor de força: "Forte" |
| `13-cadastro-sucesso.png` | Cadastro | Painel de sucesso |
| `14-login-erros.png` | Login | E-mail inválido e senha curta |
| `15-denuncia-erros.png` | Denúncia | Campos obrigatórios e descrição curta |
| `16-denuncia-sucesso.png` | Denúncia | Confirmação "PENDENTE" |

## Como as capturas foram feitas

Com o Chromium controlado pelo Playwright, abrindo os arquivos de `src/`
em cada tamanho de tela e executando as ações descritas no roteiro de
testes do `docs/etapa-04.md`.

Para refazer à mão: abrir a página no Chrome, `F12`, modo dispositivo
(`Ctrl+Shift+M`), digitar a resolução em "Dimensions" e usar o menu
⋮ → "Capture full size screenshot". Salvar com o mesmo nome da tabela.
