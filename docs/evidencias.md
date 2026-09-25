# Evidências — AntiGolpe

Índice de todas as capturas de tela do projeto. Cada etapa tem sua
própria pasta dentro de docs/evidencias/.

## Estrutura

docs/evidencias/
├── desktop/       capturas em 1440×900 (Etapa 03)
├── tablet/        capturas em 768×1024 (Etapa 03)
├── smartphone/    capturas em 375×812 (Etapa 03)
└── etapa-04/      capturas das funcionalidades interativas

## Como capturar

Rodar npm run serve. Abrir o navegador. Apertar F12. Ativar o modo
device toolbar com Ctrl+Shift+M ou Cmd+Shift+M. Escolher a resolução.
Capturar. Salvar com o nome padronizado.

## Etapa 03 — Interface responsiva

Desktop, resolução 1440×900. Capturar as nove páginas: index,
simulador, biblioteca, artigo, verificador, painel, admin, login e
cadastro. Nomes: 01-index.png, 02-simulador.png e assim por diante.

Tablet, resolução 768×1024. Capturar index, simulador, painel e admin,
que são as páginas mais densas.

Smartphone, resolução 375×812. Capturar as mesmas quatro páginas do
tablet.

## Etapa 04 — Interatividade

Dezesseis capturas, cobrindo as cinco funcionalidades interativas.

Simulador: 01-simulador-pergunta.png, 02-simulador-feedback-correto.png,
03-simulador-feedback-errado.png, 04-simulador-resultado-final.png.

Verificador: 05-verificador-suspeito.png, 06-verificador-seguro.png,
07-verificador-erro-url.png, 08-verificador-historico.png.

Biblioteca: 09-biblioteca-filtros.png, 10-biblioteca-vazio.png.

Cadastro e login: 11-cadastro-erros.png, 12-cadastro-senha-forte.png,
13-cadastro-sucesso.png, 14-login-erros.png.

Denúncia: 15-denuncia-erros.png, 16-denuncia-sucesso.png.

## Estado

Nenhuma captura foi feita ainda. Precisa ser feito antes da auditoria do
meio do semestre.

## Automação opcional

Dá pra automatizar com Playwright:

    npx playwright install chromium
    npx playwright screenshot --viewport-size=1440,900 src/index.html docs/evidencias/desktop/01-index.png

Repetir trocando resolução e arquivo de saída.

## Convenção de nomes

Prefixo numérico com dois dígitos, nome em minúsculas sem acento, hífen
entre as partes. Formato: NN-pagina-estado.png.