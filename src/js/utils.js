/* AntiGolpe — utilitários compartilhados
   Expostos como window.AntiGolpe.<nome> */

window.AntiGolpe = window.AntiGolpe || {};

(function (ns) {
  'use strict';

  /* ---------- Escapar HTML (previne XSS em conteúdo dinâmico) ---------- */
  ns.escaparHtml = function (texto) {
    if (texto == null) return '';
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  /* ---------- E-mail ---------- */
  ns.validarEmail = function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim());
  };

  /* ---------- URL ---------- */
  ns.normalizarUrl = function (entrada) {
    const valor = String(entrada || '').trim();
    if (!valor) return { ok: false, motivo: 'Informe uma URL.' };
    if (!/^https?:\/\//i.test(valor)) {
      return { ok: false, motivo: 'A URL precisa começar com http:// ou https://.' };
    }
    try {
      const u = new URL(valor);
      if (!u.hostname || !u.hostname.includes('.')) {
        return { ok: false, motivo: 'Endereço inválido.' };
      }
      return { ok: true, hostname: u.hostname.toLowerCase(), url: u.href };
    } catch (e) {
      return { ok: false, motivo: 'Não foi possível interpretar a URL.' };
    }
  };

  /* ---------- Debounce ---------- */
  ns.debounce = function (fn, ms) {
    let t;
    return function () {
      const args = arguments;
      const ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  };

  /* ---------- Datas ---------- */
  ns.formatarData = function (iso) {
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  ns.formatarDataHora = function (iso) {
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  /* ---------- LocalStorage seguro ---------- */
  ns.storage = {
    get: function (chave, padrao) {
      try {
        const raw = localStorage.getItem(chave);
        return raw == null ? padrao : JSON.parse(raw);
      } catch (e) {
        return padrao;
      }
    },
    set: function (chave, valor) {
      try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: function (chave) {
      try { localStorage.removeItem(chave); } catch (e) { /* silencioso */ }
    }
  };

  /* ---------- Mensagens de erro em campos ---------- */
  ns.mostrarErro = function (inputId, mensagem) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const erro = document.getElementById(inputId + '-erro');
    const campo = input.closest('.campo');

    input.setAttribute('aria-invalid', 'true');
    if (campo) campo.classList.add('campo--invalido');
    if (erro) {
      erro.textContent = mensagem;
      erro.hidden = false;
    }
  };

  ns.limparErro = function (inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const erro = document.getElementById(inputId + '-erro');
    const campo = input.closest('.campo');

    input.removeAttribute('aria-invalid');
    if (campo) campo.classList.remove('campo--invalido');
    if (erro) {
      erro.textContent = '';
      erro.hidden = true;
    }
  };

  ns.limparTodosErros = function (form) {
    if (!form) return;
    const invalidos = form.querySelectorAll('[aria-invalid="true"]');
    Array.from(invalidos).forEach(function (el) { ns.limparErro(el.id); });
  };

})(window.AntiGolpe);