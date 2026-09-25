/* AntiGolpe — Busca e filtros da biblioteca (tempo real) */

(function (ns) {
  'use strict';

  const ARTIGOS = [
    { id: 'A1', titulo: 'Phishing bancário por SMS',           resumo: 'Mensagens que imitam bancos para roubar senhas e códigos de verificação.',                       categoria: 'phishing',    categoriaLabel: 'Phishing bancário',   risco: 'alto',  tempoLeitura: 5 },
    { id: 'A2', titulo: 'Boleto adulterado por e-mail',        resumo: 'Como criminosos alteram dados bancários em boletos e como conferir antes de pagar.',              categoria: 'boleto',      categoriaLabel: 'Falso boleto',        risco: 'alto',  tempoLeitura: 4 },
    { id: 'A3', titulo: 'Clonagem de WhatsApp',                resumo: 'Por que alguém se passa por um conhecido no WhatsApp e como confirmar antes de transferir.',       categoria: 'whatsapp',    categoriaLabel: 'Clonagem de WhatsApp', risco: 'medio', tempoLeitura: 6 },
    { id: 'A4', titulo: 'Falsas centrais de atendimento',      resumo: 'Ligações que se passam por bancos ou operadoras para capturar tokens e senhas.',                  categoria: 'phishing',    categoriaLabel: 'Phishing bancário',   risco: 'alto',  tempoLeitura: 5 },
    { id: 'A5', titulo: 'Falso marketplace em redes sociais',  resumo: 'Perfis com preços muito abaixo do mercado que somem após o pagamento via PIX.',                    categoria: 'marketplace', categoriaLabel: 'Falso marketplace',   risco: 'medio', tempoLeitura: 4 },
    { id: 'A6', titulo: 'Golpe do falso parente',              resumo: 'Mensagens pedindo dinheiro urgente em nome de familiares com número novo.',                       categoria: 'whatsapp',    categoriaLabel: 'Clonagem de WhatsApp', risco: 'alto',  tempoLeitura: 3 },
    { id: 'A7', titulo: 'Como verificar um link suspeito',     resumo: 'Passo a passo para inspecionar URLs antes de clicar, incluindo encurtadores.',                    categoria: 'phishing',    categoriaLabel: 'Phishing bancário',   risco: 'baixo', tempoLeitura: 7 },
    { id: 'A8', titulo: 'SMS de taxa dos Correios',            resumo: 'Mensagens com pequenas cobranças que levam a sites falsos para capturar cartão.',                categoria: 'phishing',    categoriaLabel: 'Phishing bancário',   risco: 'alto',  tempoLeitura: 4 }
  ];

  const RISCOS = { alto: 'Alto', medio: 'Médio', baixo: 'Baixo' };

  const form = document.getElementById('form-filtros');
  const inputBusca = document.getElementById('q');
  const listaEl = document.getElementById('lista-artigos');
  const contadorEl = document.getElementById('contador-resultados');
  const vazioEl = document.getElementById('sem-resultados');

  if (!form) return;

  /* ---------- Leitura de filtros ---------- */

  function lerFiltros() {
    const termo = inputBusca.value.trim().toLowerCase();
    const categorias = Array.from(
      form.querySelectorAll('input[name="cat"]:checked')
    ).map(function (c) { return c.value; });

    const riscoInput = form.querySelector('input[name="risco"]:checked');
    const risco = riscoInput ? riscoInput.value : '';

    return { termo: termo, categorias: categorias, risco: risco };
  }

  /* ---------- Filtragem ---------- */

  function filtrar(artigos, filtros) {
    return artigos.filter(function (a) {
      if (filtros.categorias.length && filtros.categorias.indexOf(a.categoria) === -1) return false;
      if (filtros.risco && a.risco !== filtros.risco) return false;
      if (filtros.termo) {
        const alvo = (a.titulo + ' ' + a.resumo + ' ' + a.categoriaLabel).toLowerCase();
        if (alvo.indexOf(filtros.termo) === -1) return false;
      }
      return true;
    });
  }

  /* ---------- Renderização ---------- */

  function renderizarCards(artigos) {
    if (!artigos.length) {
      listaEl.innerHTML = '';
      vazioEl.hidden = false;
      contadorEl.textContent = 'Nenhum artigo encontrado.';
      return;
    }
    vazioEl.hidden = true;
    contadorEl.textContent = artigos.length === 1
      ? '1 artigo encontrado.'
      : artigos.length + ' artigos encontrados.';

    listaEl.innerHTML = artigos.map(function (a) {
      return '<article class="card card--interativo">' +
        '<span class="badge badge--risco-' + a.risco + '">Risco ' + RISCOS[a.risco] + '</span>' +
        '<h3 class="card__titulo mt-4">' + ns.escaparHtml(a.titulo) + '</h3>' +
        '<p>' + ns.escaparHtml(a.resumo) + '</p>' +
        '<footer class="card__meta">' +
          '<span>' + ns.escaparHtml(a.categoriaLabel) + '</span>' +
          '<span>·</span>' +
          '<span>' + a.tempoLeitura + ' min de leitura</span>' +
        '</footer>' +
        '<p class="mt-4 mb-0"><a href="artigo.html?id=' + encodeURIComponent(a.id) + '">Ler artigo →</a></p>' +
      '</article>';
    }).join('');
  }

  function atualizar() {
    const filtros = lerFiltros();
    const resultado = filtrar(ARTIGOS, filtros);
    renderizarCards(resultado);
  }

  /* ---------- Eventos ---------- */

  const atualizarDebounced = ns.debounce(atualizar, 200);

  inputBusca.addEventListener('input', atualizarDebounced);
  form.addEventListener('change', atualizar);
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  const btnLimpar = document.getElementById('btn-limpar');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', function () {
      form.reset();
      atualizar();
      inputBusca.focus();
    });
  }
  const btnLimparVazio = document.getElementById('btn-limpar-vazio');
  if (btnLimparVazio) {
    btnLimparVazio.addEventListener('click', function () {
      form.reset();
      atualizar();
      inputBusca.focus();
    });
  }

  /* Estado inicial */
  atualizar();
})(window.AntiGolpe);