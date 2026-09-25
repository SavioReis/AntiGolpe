/* AntiGolpe — Verificador de link
   Classifica URL contra base local e persiste histórico em localStorage. */

(function (ns) {
  'use strict';

  const DOMINIOS_SUSPEITOS = [
    { dominio: 'bx-seguranca-login.com',    categoria: 'Phishing bancário',  confianca: 92, reportes: 42, ultimaDenuncia: '2025-11-08' },
    { dominio: 'promo-black-friday-2025.xyz', categoria: 'Falso marketplace', confianca: 65, reportes: 12, ultimaDenuncia: '2025-11-01' },
    { dominio: 'itau-seguranca.net',        categoria: 'Phishing bancário',  confianca: 88, reportes: 30, ultimaDenuncia: '2025-11-12' },
    { dominio: 'correios-rastreio.top',     categoria: 'Phishing genérico',  confianca: 75, reportes: 18, ultimaDenuncia: '2025-11-05' },
    { dominio: 'bb-atualiza-conta.com',     categoria: 'Phishing bancário',  confianca: 90, reportes: 27, ultimaDenuncia: '2025-11-10' }
  ];

  const DOMINIOS_CONFIAVEIS = [
    'itau.com.br', 'bb.com.br', 'bradesco.com.br', 'caixa.gov.br',
    'nubank.com.br', 'gov.br', 'correios.com.br', 'mercadolivre.com.br'
  ];

  const CHAVE_HISTORICO = 'antigolpe:historico-verificador';
  const MAX_HISTORICO = 10;

  const form = document.getElementById('form-verificador');
  const input = document.getElementById('url');
  const resultadoEl = document.getElementById('resultado-verificador');
  const historicoEl = document.getElementById('historico');

  if (!form) return;

  /* ---------- Classificação ---------- */

  function classificar(hostname) {
    const suspeito = DOMINIOS_SUSPEITOS.find(function (d) {
      return hostname === d.dominio || hostname.endsWith('.' + d.dominio);
    });
    if (suspeito) return { veredito: 'suspeito', dados: suspeito };

    const confiavel = DOMINIOS_CONFIAVEIS.find(function (d) {
      return hostname === d || hostname.endsWith('.' + d);
    });
    if (confiavel) return { veredito: 'seguro', dominio: confiavel };

    return { veredito: 'desconhecido' };
  }

  /* ---------- Renderização ---------- */

  function renderizarResultado(hostname, classificacao) {
    const mapa = {
      suspeito:     { classe: 'resultado--suspeito',     titulo: '🚨 Suspeito' },
      seguro:       { classe: 'resultado--seguro',       titulo: '✅ Seguro' },
      desconhecido: { classe: 'resultado--desconhecido', titulo: '⚠️ Desconhecido' }
    };
    const info = mapa[classificacao.veredito];
    let corpo = '';

    if (classificacao.veredito === 'suspeito') {
      const d = classificacao.dados;
      corpo =
        '<p>O domínio <strong>' + ns.escaparHtml(hostname) + '</strong> foi sinalizado ' +
        '<strong>' + d.reportes + ' vezes</strong> nos últimos 30 dias.</p>' +
        '<dl class="grid grid-3 mt-4">' +
          '<div><dt class="text-muted">Nível de confiança</dt><dd><strong>' + d.confianca + '%</strong></dd></div>' +
          '<div><dt class="text-muted">Última denúncia</dt><dd><time datetime="' + d.ultimaDenuncia + '">' + ns.formatarData(d.ultimaDenuncia) + '</time></dd></div>' +
          '<div><dt class="text-muted">Categoria</dt><dd>' + ns.escaparHtml(d.categoria) + '</dd></div>' +
        '</dl>';
    } else if (classificacao.veredito === 'seguro') {
      corpo =
        '<p>O domínio <strong>' + ns.escaparHtml(hostname) + '</strong> consta na lista de ' +
        'domínios oficiais conhecidos. Ainda assim, confirme sempre pelo aplicativo ou site oficial.</p>';
    } else {
      corpo =
        '<p>O domínio <strong>' + ns.escaparHtml(hostname) + '</strong> não está em nossa base. ' +
        'Isso <em>não significa que é seguro</em>. Verifique se o endereço corresponde exatamente ' +
        'ao site oficial antes de prosseguir.</p>';
    }

    resultadoEl.innerHTML =
      '<section class="resultado ' + info.classe + '" aria-labelledby="resultado-titulo" aria-live="polite">' +
        '<h2 id="resultado-titulo">Resultado: <span>' + info.titulo + '</span></h2>' +
        corpo +
      '</section>';
  }

  function renderizarHistorico() {
    if (!historicoEl) return;
    const historico = ns.storage.get(CHAVE_HISTORICO, []);

    if (!historico.length) {
      historicoEl.innerHTML =
        '<div class="card text-center">' +
          '<p class="text-muted mb-0">Nenhuma consulta ainda. Verifique uma URL acima.</p>' +
        '</div>';
      return;
    }

    const mapaBadge = { suspeito: 'badge--risco-alto', seguro: 'badge--risco-baixo', desconhecido: 'badge--risco-medio' };
    const mapaLabel = { suspeito: 'Suspeito', seguro: 'Seguro', desconhecido: 'Desconhecido' };

    const linhas = historico.map(function (h) {
      return '<tr>' +
        '<td><code>' + ns.escaparHtml(h.hostname) + '</code></td>' +
        '<td><span class="badge ' + mapaBadge[h.veredito] + '">' + mapaLabel[h.veredito] + '</span></td>' +
        '<td><time datetime="' + h.quando + '">' + ns.formatarDataHora(h.quando) + '</time></td>' +
      '</tr>';
    }).join('');

    historicoEl.innerHTML =
      '<div class="tabela-wrapper">' +
        '<table class="tabela">' +
          '<caption class="visually-hidden">Histórico de consultas</caption>' +
          '<thead><tr>' +
            '<th scope="col">URL</th>' +
            '<th scope="col">Veredito</th>' +
            '<th scope="col">Quando</th>' +
          '</tr></thead>' +
          '<tbody>' + linhas + '</tbody>' +
        '</table>' +
      '</div>' +
      '<p class="mt-4"><button type="button" class="btn btn--secundario" id="btn-limpar-historico">Limpar histórico</button></p>';

    const btnLimpar = document.getElementById('btn-limpar-historico');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', function () {
        ns.storage.remove(CHAVE_HISTORICO);
        renderizarHistorico();
      });
    }
  }

  function adicionarAoHistorico(item) {
    const historico = ns.storage.get(CHAVE_HISTORICO, []);
    historico.unshift(item);
    const cortado = historico.slice(0, MAX_HISTORICO);
    ns.storage.set(CHAVE_HISTORICO, cortado);
    renderizarHistorico();
  }

  /* ---------- Eventos ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ns.limparErro('url');

    const parsed = ns.normalizarUrl(input.value);
    if (!parsed.ok) {
      ns.mostrarErro('url', parsed.motivo);
      input.focus();
      return;
    }

    const classificacao = classificar(parsed.hostname);
    renderizarResultado(parsed.hostname, classificacao);
    adicionarAoHistorico({
      hostname: parsed.hostname,
      url: parsed.url,
      veredito: classificacao.veredito,
      quando: new Date().toISOString()
    });
  });

  form.addEventListener('reset', function () {
    ns.limparErro('url');
    resultadoEl.innerHTML = '';
  });

  input.addEventListener('input', function () { ns.limparErro('url'); });

  /* Estado inicial */
  renderizarHistorico();
})(window.AntiGolpe);