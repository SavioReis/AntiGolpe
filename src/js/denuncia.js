/* AntiGolpe — Validação do formulário de denúncia no painel */

(function (ns) {
  'use strict';

  const form = document.getElementById('form-denuncia');
  if (!form) return;

  const categoria = document.getElementById('den-categoria');
  const canal = document.getElementById('den-canal');
  const descricao = document.getElementById('den-descricao');
  const contador = document.getElementById('den-contador');
  const feedback = document.getElementById('denuncia-feedback');
  const MAX = 800;
  const MIN_DESC = 20;

  function atualizarContador() {
    const len = descricao.value.length;
    const restante = MAX - len;
    contador.textContent = len + '/' + MAX + ' caracteres';
    contador.classList.toggle('campo__ajuda--alerta', restante < 50);
  }

  descricao.addEventListener('input', function () {
    ns.limparErro('den-descricao');
    atualizarContador();
  });

  [categoria, canal].forEach(function (el) {
    el.addEventListener('change', function () { ns.limparErro(el.id); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ns.limparTodosErros(form);
    if (feedback) feedback.hidden = true;

    let ok = true;

    if (!categoria.value) {
      ns.mostrarErro('den-categoria', 'Selecione uma categoria.');
      ok = false;
    }
    if (!canal.value) {
      ns.mostrarErro('den-canal', 'Selecione o canal em que recebeu.');
      ok = false;
    }

    const desc = descricao.value.trim();
    if (!desc) {
      ns.mostrarErro('den-descricao', 'Descreva o golpe recebido.');
      ok = false;
    } else if (desc.length < MIN_DESC) {
      ns.mostrarErro('den-descricao', 'Descreva com pelo menos ' + MIN_DESC + ' caracteres.');
      ok = false;
    }

    if (!ok) {
      const primeiro = form.querySelector('[aria-invalid="true"]');
      if (primeiro) primeiro.focus();
      return;
    }

    feedback.className = 'feedback feedback--correto mt-4';
    feedback.innerHTML =
      '<h3 class="mt-0">Denúncia registrada</h3>' +
      '<p class="mb-0">Obrigado! Sua denúncia foi registrada como <strong>PENDENTE</strong> ' +
      'e será analisada pela equipe de moderação. Nesta etapa os dados ficam apenas no cliente.</p>';
    feedback.hidden = false;

    form.reset();
    atualizarContador();
  });

  atualizarContador();
})(window.AntiGolpe);