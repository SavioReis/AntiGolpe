/* AntiGolpe — Validação dos formulários de login e cadastro */

(function (ns) {
  'use strict';

  /* =========================================================
     LOGIN
     ========================================================= */
  const formLogin = document.getElementById('form-login');

  if (formLogin) {
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const feedback = document.getElementById('login-feedback');

    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      ns.limparTodosErros(formLogin);
      if (feedback) feedback.hidden = true;

      let ok = true;

      if (!email.value.trim()) {
        ns.mostrarErro('email', 'Informe seu e-mail.');
        ok = false;
      } else if (!ns.validarEmail(email.value)) {
        ns.mostrarErro('email', 'Formato de e-mail inválido.');
        ok = false;
      }

      if (!senha.value) {
        ns.mostrarErro('senha', 'Informe sua senha.');
        ok = false;
      } else if (senha.value.length < 8) {
        ns.mostrarErro('senha', 'A senha deve ter pelo menos 8 caracteres.');
        ok = false;
      }

      if (!ok) {
        const primeiro = formLogin.querySelector('[aria-invalid="true"]');
        if (primeiro) primeiro.focus();
        return;
      }

      feedback.className = 'feedback feedback--correto mt-4';
      feedback.innerHTML =
        '<h3 class="mt-0">Login validado</h3>' +
        '<p class="mb-0">Nesta etapa, os dados são validados apenas no cliente. ' +
        'A autenticação real com bcrypt + sessão será implementada no backend.</p>';
      feedback.hidden = false;
    });

    ['email', 'senha'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { ns.limparErro(id); });
    });
  }

  /* =========================================================
     CADASTRO
     ========================================================= */
  const formCad = document.getElementById('form-cadastro');

  if (formCad) {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const senha2 = document.getElementById('senha2');
    const termos = document.getElementById('termos');
    const medidor = document.getElementById('forca-senha');
    const feedback = document.getElementById('cadastro-feedback');

    function forcaSenha(valor) {
      let pontos = 0;
      if (valor.length >= 8) pontos++;
      if (valor.length >= 12) pontos++;
      if (/[a-z]/.test(valor) && /[A-Z]/.test(valor)) pontos++;
      if (/\d/.test(valor)) pontos++;
      if (/[^A-Za-z0-9]/.test(valor)) pontos++;
      if (pontos <= 2) return { nivel: 'fraca', rotulo: 'Fraca' };
      if (pontos <= 3) return { nivel: 'media', rotulo: 'Média' };
      return { nivel: 'forte', rotulo: 'Forte' };
    }

    senha.addEventListener('input', function () {
      ns.limparErro('senha');
      if (!senha.value) {
        medidor.textContent = '';
        medidor.className = 'campo__ajuda';
        return;
      }
      const f = forcaSenha(senha.value);
      medidor.textContent = 'Força da senha: ' + f.rotulo;
      medidor.className = 'campo__ajuda forca-senha forca-senha--' + f.nivel;
    });

    senha2.addEventListener('input', function () { ns.limparErro('senha2'); });
    nome.addEventListener('input', function () { ns.limparErro('nome'); });
    email.addEventListener('input', function () { ns.limparErro('email'); });
    termos.addEventListener('change', function () { ns.limparErro('termos'); });

    formCad.addEventListener('submit', function (e) {
      e.preventDefault();
      ns.limparTodosErros(formCad);
      if (feedback) feedback.hidden = true;

      let ok = true;

      if (!nome.value.trim() || nome.value.trim().length < 3) {
        ns.mostrarErro('nome', 'Informe seu nome completo (mín. 3 caracteres).');
        ok = false;
      }

      if (!email.value.trim()) {
        ns.mostrarErro('email', 'Informe seu e-mail.');
        ok = false;
      } else if (!ns.validarEmail(email.value)) {
        ns.mostrarErro('email', 'Formato de e-mail inválido.');
        ok = false;
      }

      if (!senha.value) {
        ns.mostrarErro('senha', 'Crie uma senha.');
        ok = false;
      } else if (senha.value.length < 8) {
        ns.mostrarErro('senha', 'A senha deve ter pelo menos 8 caracteres.');
        ok = false;
      } else if (!/[A-Za-z]/.test(senha.value) || !/\d/.test(senha.value)) {
        ns.mostrarErro('senha', 'A senha deve conter letras e números.');
        ok = false;
      }

      if (senha2.value !== senha.value) {
        ns.mostrarErro('senha2', 'As senhas não coincidem.');
        ok = false;
      }

      if (!termos.checked) {
        ns.mostrarErro('termos', 'É necessário aceitar os termos.');
        ok = false;
      }

      if (!ok) {
        const primeiro = formCad.querySelector('[aria-invalid="true"]');
        if (primeiro) primeiro.focus();
        return;
      }

      feedback.className = 'feedback feedback--correto mt-4';
      feedback.innerHTML =
        '<h3 class="mt-0">Cadastro validado</h3>' +
        '<p class="mb-0">Todos os campos passaram pelas validações do cliente. ' +
        'A criação real da conta e o hash de senha serão implementados no backend.</p>';
      feedback.hidden = false;
    });
  }
})(window.AntiGolpe);