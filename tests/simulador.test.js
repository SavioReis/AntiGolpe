/* AntiGolpe — testes do simulador (simulador.js)
   Monta o HTML mínimo da página, carrega utils.js + simulador.js
   e verifica o comportamento pelo DOM, como o usuário veria. */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ler = (arq) => readFileSync(resolve(__dirname, '../src/js/', arq), 'utf-8');

function montarPagina() {
  document.body.innerHTML = `
    <p id="progresso-texto"></p>
    <progress id="progresso-barra" value="0" max="10"></progress>
    <button id="btn-encerrar" type="button">Encerrar rodada</button>
    <section id="simulador-area"></section>
  `;
  window.AntiGolpe = {};
  (0, eval)(ler('utils.js'));
  (0, eval)(ler('simulador.js'));
}

const area = () => document.getElementById('simulador-area');
const progresso = () => document.getElementById('progresso-texto').textContent;
const clicar = (seletor) => area().querySelector(seletor).click();

describe('AntiGolpe / simulador', () => {
  beforeEach(montarPagina);

  it('a rodada tem 10 perguntas (há cenários suficientes)', () => {
    expect(progresso()).toContain('Pergunta 1 de 10');
  });

  it('não mostra a categoria antes da resposta (não entrega o gabarito)', () => {
    expect(area().querySelector('.badge')).toBeNull();
    expect(area().textContent).not.toContain('Comunicação legítima');
  });

  it('mostra feedback e a categoria depois de responder', () => {
    clicar('[data-resposta="golpe"]');
    expect(area().querySelector('.feedback')).not.toBeNull();
    expect(area().querySelector('#btn-proximo')).not.toBeNull();
  });

  it('chega ao resultado final após 10 respostas', () => {
    for (let i = 0; i < 10; i++) {
      clicar('[data-resposta="golpe"]');
      clicar('#btn-proximo');
    }
    expect(area().textContent).toContain('Rodada concluída');
    expect(area().textContent).toContain('de 10 cenários');
  });

  it('encerrar no meio calcula sobre as perguntas respondidas', () => {
    window.confirm = () => true;
    for (let i = 0; i < 3; i++) {
      clicar('[data-resposta="golpe"]');
      clicar('#btn-proximo');
    }
    document.getElementById('btn-encerrar').click();
    expect(area().textContent).toContain('de 3 cenários');
  });
});
