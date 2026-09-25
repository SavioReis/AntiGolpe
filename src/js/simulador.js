/* AntiGolpe — Simulador de Golpes
   Fluxo: sorteia 10 cenários, registra respostas, calcula pontuação,
   exibe feedback e, ao final, uma tabela de desempenho por categoria. */

(function (ns) {
  'use strict';

  /* ---------- Base de cenários (array de objetos) ---------- */
  const CENARIOS = [
    {
      id: 1, canal: 'SMS', remetente: 'BancoX',
      categoria: 'Phishing bancário',
      conteudo: 'BancoX Informa: identificamos uma compra de R$ 2.480,00 em seu cartão. Se não reconhece, cancele agora: bit.ly/bx-cancela24',
      ehGolpe: true,
      explicacao: 'Bancos nunca enviam links encurtados por SMS pedindo cancelamento. O endereço bit.ly/bx-cancela24 é um redirecionador que pode levar a um site falso idêntico ao do banco.',
      sinais: [
        'Urgência artificial ("cancele agora")',
        'Link encurtado em vez do domínio oficial do banco',
        'Remetente que imita o nome da instituição'
      ]
    },
    {
      id: 2, canal: 'E-mail', remetente: 'contato@energia-luz.com.br',
      categoria: 'Falso boleto',
      conteudo: 'Prezado cliente, sua fatura de energia vence hoje. Segue boleto em anexo. Caso já tenha pago, desconsidere.',
      ehGolpe: true,
      explicacao: 'A distribuidora real não usa o domínio "energia-luz.com.br". O boleto em anexo pode ter o beneficiário alterado, desviando o pagamento para a conta do criminoso.',
      sinais: [
        'Domínio diferente do oficial',
        'Boleto em anexo sem código de barras visível no corpo',
        'Assunto com urgência ("vence hoje")'
      ]
    },
    {
      id: 3, canal: 'WhatsApp', remetente: '+55 11 9xxxx-1234',
      categoria: 'Clonagem de WhatsApp',
      conteudo: 'Oi mãe, troquei de número. Tô sem acesso ao meu WhatsApp antigo. Preciso pagar uma conta urgente, você pode fazer um PIX de R$ 890 pra mim? Te devolvo amanhã.',
      ehGolpe: true,
      explicacao: 'O golpe do falso parente explora o vínculo familiar. Sempre confirme por ligação no número antigo antes de transferir qualquer valor.',
      sinais: [
        'Número novo e desconhecido',
        'Pedido de dinheiro com urgência',
        'Alegação de "troquei de número"'
      ]
    },
    {
      id: 4, canal: 'Notificação do app', remetente: 'App do seu banco',
      categoria: 'Comunicação legítima',
      conteudo: 'Sua fatura de novembro fechou em R$ 1.240,00. Vencimento em 20/11. Acesse o app para mais detalhes.',
      ehGolpe: false,
      explicacao: 'Notificação dentro do próprio app do banco, sem link externo, sem pedido de senha ou token, apenas informativa. É o canal correto para esse aviso.',
      sinais: [
        'Chega pelo canal oficial (app instalado)',
        'Não pede senha, código ou dado pessoal',
        'Não contém links externos suspeitos'
      ]
    },
    {
      id: 5, canal: 'SMS', remetente: 'Correios',
      categoria: 'Phishing genérico',
      conteudo: 'Seu pacote está retido na alfândega. Pague a taxa de R$ 4,90 em até 24h para liberação: correios-taxa.top/pagar',
      ehGolpe: true,
      explicacao: 'Os Correios não cobram taxas por SMS nem usam domínios com terminações atípicas como ".top". Este é um golpe recorrente que coleta dados de cartão em um site falso.',
      sinais: [
        'Domínio com terminação atípica (".top")',
        'Prazo curto e valor baixo para parecer inofensivo',
        'Página de pagamento fora do domínio oficial'
      ]
    },
    {
      id: 6, canal: 'E-mail', remetente: 'pedidos@lojaoficial.com.br',
      categoria: 'Comunicação legítima',
      conteudo: 'Olá, Marina! Seu pedido #48291 foi confirmado e será enviado em até 2 dias úteis. Você pode acompanhar o status em Minha Conta.',
      ehGolpe: false,
      explicacao: 'E-mail de confirmação de um pedido que a própria usuária realizou, sem pedido de dados, sem link suspeito e com identificação correta da loja.',
      sinais: [
        'Refere-se a uma compra que a usuária realmente fez',
        'Não pede dados nem cliques',
        'Domínio do remetente corresponde ao oficial'
      ]
    },
    {
      id: 7, canal: 'Ligação', remetente: 'Número desconhecido',
      categoria: 'Falso suporte técnico',
      conteudo: 'Boa tarde, aqui é do Suporte Microsoft. Detectamos um vírus no seu computador. Preciso que você instale o AnyDesk e me dê o código de acesso.',
      ehGolpe: true,
      explicacao: 'A Microsoft nunca liga proativamente para clientes domésticos. O objetivo é obter acesso remoto à máquina para instalar ransomware ou roubar dados.',
      sinais: [
        'Contato proativo de "suporte" que você não procurou',
        'Pedido para instalar software de acesso remoto',
        'Alegação de vírus sem qualquer verificação'
      ]
    },
    {
      id: 8, canal: 'E-mail', remetente: 'novidades@livrariaquevocesegue.com.br',
      categoria: 'Comunicação legítima',
      conteudo: 'Semana do livro com até 40% de desconto. Confira as ofertas no site oficial. Promoção válida até domingo.',
      ehGolpe: false,
      explicacao: 'Newsletter de uma loja que o usuário segue, com promoção real e direcionamento ao site oficial. Não solicita dados nem pagamento por canais alternativos.',
      sinais: [
        'Remetente é uma marca conhecida pelo usuário',
        'Direciona ao site oficial, sem links encurtados',
        'Não pede senha nem dados de cartão'
      ]
    }
  ];

  const TAMANHO_RODADA = 10;

  /* ---------- Estado da aplicação ---------- */
  const estado = {
    ordem: [],
    indice: 0,
    pontuacao: 0,
    acertos: 0,
    respostas: [],
    finalizada: false
  };

  /* ---------- Elementos ---------- */
  const area = document.getElementById('simulador-area');
  const progressoTexto = document.getElementById('progresso-texto');
  const progressoBarra = document.getElementById('progresso-barra');
  const btnEncerrar = document.getElementById('btn-encerrar');

  if (!area) return;

  /* ---------- Funções auxiliares ---------- */

  function embaralhar(arr) {
    const copia = arr.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  function cenarioAtual() {
    return estado.ordem[estado.indice];
  }

  function atualizarProgresso() {
    const total = estado.ordem.length;
    const atual = Math.min(estado.indice + 1, total);

    if (estado.finalizada) {
      progressoTexto.textContent = 'Rodada finalizada · ' + estado.acertos + '/' + total + ' acertos';
      progressoBarra.value = total;
    } else {
      progressoTexto.textContent = 'Pergunta ' + atual + ' de ' + total + ' · Pontuação: ' + estado.pontuacao;
      progressoBarra.value = atual - 1;
    }
    progressoBarra.max = total;
    progressoBarra.setAttribute('aria-valuetext', atual + ' de ' + total);
  }

  /* ---------- Renderização ---------- */

  function renderizarCenario() {
    const c = cenarioAtual();
    if (!c) { finalizar(); return; }

    area.innerHTML =
      '<article class="cenario" aria-labelledby="cenario-titulo">' +
        '<header>' +
          '<span class="cenario__canal">' + ns.escaparHtml(c.canal) +
            ' · remetente: ' + ns.escaparHtml(c.remetente) + '</span>' +
          '<span class="badge badge--info">' + ns.escaparHtml(c.categoria) + '</span>' +
        '</header>' +
        '<h2 id="cenario-titulo" class="visually-hidden">Mensagem recebida</h2>' +
        '<p class="cenario__conteudo">' + ns.escaparHtml(c.conteudo) + '</p>' +
      '</article>' +
      '<div class="decisao" role="group" aria-label="Decisão sobre a mensagem">' +
        '<button type="button" class="btn btn--perigo btn--grande" data-resposta="golpe">🚨 É golpe</button>' +
        '<button type="button" class="btn btn--sucesso btn--grande" data-resposta="legitimo">✅ É legítimo</button>' +
      '</div>';

    const botoes = area.querySelectorAll('[data-resposta]');
    Array.from(botoes).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        responder(e.currentTarget.dataset.resposta);
      });
    });

    atualizarProgresso();
  }

  function renderizarFeedback(c, acertou) {
    const classe = acertou ? 'feedback--correto' : 'feedback--incorreto';
    const titulo = acertou
      ? '✅ Boa! Você reconheceu corretamente.'
      : (c.ehGolpe ? '🚨 Você caiu! Isto é um golpe.' : '⚠️ Era uma mensagem legítima.');

    let sinaisHtml = '';
    if (c.sinais && c.sinais.length) {
      const itens = c.sinais.map(function (s) {
        return '<li>' + ns.escaparHtml(s) + '</li>';
      }).join('');
      sinaisHtml = '<h3>Sinais de alerta</h3><ul>' + itens + '</ul>';
    }

    const ultimo = estado.indice >= estado.ordem.length - 1;
    const rotuloProximo = ultimo ? 'Ver resultado final' : 'Próxima pergunta →';

    area.innerHTML =
      '<article class="cenario" aria-labelledby="cenario-titulo">' +
        '<header>' +
          '<span class="cenario__canal">' + ns.escaparHtml(c.canal) +
            ' · remetente: ' + ns.escaparHtml(c.remetente) + '</span>' +
          '<span class="badge badge--info">' + ns.escaparHtml(c.categoria) + '</span>' +
        '</header>' +
        '<h2 id="cenario-titulo" class="visually-hidden">Mensagem recebida</h2>' +
        '<p class="cenario__conteudo">' + ns.escaparHtml(c.conteudo) + '</p>' +
      '</article>' +
      '<aside class="feedback ' + classe + '" aria-labelledby="feedback-titulo" aria-live="polite">' +
        '<h2 id="feedback-titulo" class="h3">' + titulo + '</h2>' +
        '<p>' + ns.escaparHtml(c.explicacao) + '</p>' +
        sinaisHtml +
      '</aside>' +
      '<div class="mt-6">' +
        '<button type="button" class="btn btn--primario btn--grande" id="btn-proximo">' +
          rotuloProximo +
        '</button>' +
      '</div>';

    const btn = document.getElementById('btn-proximo');
    if (btn) {
      btn.focus();
      btn.addEventListener('click', proxima);
    }
  }

  /* ---------- Fluxo ---------- */

  function iniciar() {
    estado.ordem = embaralhar(CENARIOS).slice(0, TAMANHO_RODADA);
    estado.indice = 0;
    estado.pontuacao = 0;
    estado.acertos = 0;
    estado.respostas = [];
    estado.finalizada = false;
    renderizarCenario();
  }

  function responder(escolha) {
    if (estado.finalizada) return;
    const c = cenarioAtual();
    if (!c) return;

    const escolheuGolpe = escolha === 'golpe';
    const acertou = escolheuGolpe === c.ehGolpe;

    if (acertou) {
      estado.pontuacao += 10;
      estado.acertos += 1;
    }

    estado.respostas.push({ cenarioId: c.id, escolha: escolha, acertou: acertou });
    renderizarFeedback(c, acertou);
    atualizarProgresso();
  }

  function proxima() {
    estado.indice += 1;
    if (estado.indice >= estado.ordem.length) {
      finalizar();
    } else {
      renderizarCenario();
    }
  }

  function finalizar() {
    estado.finalizada = true;
    const total = estado.ordem.length;
    const aproveitamento = total ? Math.round((estado.acertos / total) * 100) : 0;

    /* Agrupa por categoria usando reduce */
    const porCategoria = estado.respostas.reduce(function (acc, r) {
      const c = CENARIOS.find(function (x) { return x.id === r.cenarioId; });
      if (!c) return acc;
      if (!acc[c.categoria]) acc[c.categoria] = { acertos: 0, total: 0 };
      acc[c.categoria].total += 1;
      if (r.acertou) acc[c.categoria].acertos += 1;
      return acc;
    }, {});

    const linhasCategoria = Object.keys(porCategoria).map(function (cat) {
      const d = porCategoria[cat];
      const perc = Math.round((d.acertos / d.total) * 100);
      return '<tr>' +
        '<td>' + ns.escaparHtml(cat) + '</td>' +
        '<td>' + d.acertos + '</td>' +
        '<td>' + (d.total - d.acertos) + '</td>' +
        '<td>' + perc + '%</td>' +
      '</tr>';
    }).join('');

    area.innerHTML =
      '<section class="card" aria-labelledby="resultado-final-titulo">' +
        '<header class="text-center">' +
          '<h2 id="resultado-final-titulo">Rodada concluída</h2>' +
          '<p class="text-muted">Você acertou <strong>' + estado.acertos +
            ' de ' + total + '</strong> cenários.</p>' +
        '</header>' +
        '<dl class="stats mt-6">' +
          '<div class="stat"><dd class="stat__valor">' + estado.pontuacao + '</dd><dt class="stat__rotulo">Pontuação</dt></div>' +
          '<div class="stat"><dd class="stat__valor">' + aproveitamento + '%</dd><dt class="stat__rotulo">Aproveitamento</dt></div>' +
          '<div class="stat"><dd class="stat__valor">' + estado.acertos + '</dd><dt class="stat__rotulo">Acertos</dt></div>' +
          '<div class="stat"><dd class="stat__valor">' + (total - estado.acertos) + '</dd><dt class="stat__rotulo">Erros</dt></div>' +
        '</dl>' +
        '<h3 class="mt-6">Desempenho por categoria</h3>' +
        '<div class="tabela-wrapper">' +
          '<table class="tabela">' +
            '<caption class="visually-hidden">Desempenho por categoria</caption>' +
            '<thead><tr>' +
              '<th scope="col">Categoria</th>' +
              '<th scope="col">Acertos</th>' +
              '<th scope="col">Erros</th>' +
              '<th scope="col">Aproveitamento</th>' +
            '</tr></thead>' +
            '<tbody>' + linhasCategoria + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="mt-6" style="display:flex; gap: var(--esp-3); flex-wrap: wrap;">' +
          '<button type="button" class="btn btn--primario" id="btn-reiniciar">Jogar novamente</button>' +
          '<a class="btn btn--secundario" href="painel.html">Ver meu painel</a>' +
        '</div>' +
      '</section>';

    atualizarProgresso();

    const btn = document.getElementById('btn-reiniciar');
    if (btn) btn.addEventListener('click', iniciar);
  }

  /* ---------- Botão encerrar ---------- */
  if (btnEncerrar) {
    btnEncerrar.addEventListener('click', function () {
      if (!estado.finalizada && estado.respostas.length > 0) {
        if (window.confirm('Encerrar a rodada atual? Seu progresso será finalizado.')) {
          finalizar();
        }
      } else if (estado.finalizada) {
        window.location.href = 'index.html';
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  iniciar();
})(window.AntiGolpe);