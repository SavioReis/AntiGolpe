/* AntiGolpe — comportamentos globais (menu, link ativo) */

(function () {
  'use strict';

  /* Menu mobile */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-principal');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const aberto = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!aberto));
      toggle.setAttribute('aria-expanded', String(!aberto));
    });
  }

  /* Marca link ativo automaticamente */
  const paginaAtual = location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-principal a');
  Array.from(links).forEach(function (link) {
    const destino = link.getAttribute('href');
    if (destino === paginaAtual && !link.hasAttribute('aria-current')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();