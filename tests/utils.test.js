/* AntiGolpe — testes das funções utilitárias compartilhadas */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

beforeAll(() => {
  const caminho = resolve(__dirname, '../src/js/utils.js');
  const codigo = readFileSync(caminho, 'utf-8');
  (0, eval)(codigo);
});

const ns = () => window.AntiGolpe;

describe('AntiGolpe / utils', () => {

  describe('validarEmail', () => {
    it('aceita e-mail válido', () => {
      expect(ns().validarEmail('usuario@exemplo.com')).toBe(true);
    });
    it('aceita e-mail com subdomínio', () => {
      expect(ns().validarEmail('a@b.co.uk')).toBe(true);
    });
    it('rejeita e-mail sem @', () => {
      expect(ns().validarEmail('usuarioexemplo.com')).toBe(false);
    });
    it('rejeita e-mail sem TLD', () => {
      expect(ns().validarEmail('usuario@exemplo')).toBe(false);
    });
    it('rejeita e-mail vazio', () => {
      expect(ns().validarEmail('')).toBe(false);
    });
    it('rejeita null/undefined', () => {
      expect(ns().validarEmail(null)).toBe(false);
      expect(ns().validarEmail(undefined)).toBe(false);
    });
  });

  describe('escaparHtml', () => {
    it('neutraliza < >', () => {
      const saida = ns().escaparHtml('<script>alert(1)</script>');
      expect(saida).not.toContain('<script>');
      expect(saida).toContain('&lt;script&gt;');
    });
    it('neutraliza & e aspas', () => {
      const saida = ns().escaparHtml('a & b "c" \'d\'');
      expect(saida).toContain('&amp;');
      expect(saida).toContain('&quot;');
      expect(saida).toContain('&#39;');
    });
    it('retorna string vazia para null e undefined', () => {
      expect(ns().escaparHtml(null)).toBe('');
      expect(ns().escaparHtml(undefined)).toBe('');
    });
    it('mantém texto sem caracteres especiais intacto', () => {
      expect(ns().escaparHtml('texto normal')).toBe('texto normal');
    });
  });

  describe('normalizarUrl', () => {
    it('aceita URL https válida', () => {
      const r = ns().normalizarUrl('https://itau.com.br/login');
      expect(r.ok).toBe(true);
      expect(r.hostname).toBe('itau.com.br');
    });
    it('aceita URL http', () => {
      const r = ns().normalizarUrl('http://exemplo.com');
      expect(r.ok).toBe(true);
    });
    it('normaliza hostname para minúsculo', () => {
      const r = ns().normalizarUrl('https://ITAU.com.BR');
      expect(r.ok).toBe(true);
      expect(r.hostname).toBe('itau.com.br');
    });
    it('rejeita URL sem protocolo', () => {
      const r = ns().normalizarUrl('itau.com.br');
      expect(r.ok).toBe(false);
      expect(r.motivo).toMatch(/http/i);
    });
    it('rejeita string vazia', () => {
      const r = ns().normalizarUrl('');
      expect(r.ok).toBe(false);
    });
    it('rejeita URL malformada', () => {
      const r = ns().normalizarUrl('https://');
      expect(r.ok).toBe(false);
    });
  });

  describe('debounce', () => {
    it('agrupa chamadas consecutivas em uma só', async () => {
      let chamadas = 0;
      const fn = ns().debounce(() => { chamadas++; }, 50);
      fn(); fn(); fn();
      expect(chamadas).toBe(0);
      await new Promise((r) => setTimeout(r, 90));
      expect(chamadas).toBe(1);
    });
    it('respeita o tempo configurado', async () => {
      let chamadas = 0;
      const fn = ns().debounce(() => { chamadas++; }, 30);
      fn();
      await new Promise((r) => setTimeout(r, 60));
      expect(chamadas).toBe(1);
    });
  });

  describe('storage', () => {
    it('grava e lê valor', () => {
      ns().storage.set('teste-chave', { a: 1, b: 'x' });
      expect(ns().storage.get('teste-chave', null)).toEqual({ a: 1, b: 'x' });
    });
    it('retorna padrão quando a chave não existe', () => {
      expect(ns().storage.get('chave-inexistente', 'padrao')).toBe('padrao');
    });
    it('remove chave', () => {
      ns().storage.set('chave-para-remover', 42);
      ns().storage.remove('chave-para-remover');
      expect(ns().storage.get('chave-para-remover', null)).toBe(null);
    });
    it('não lança exceção se o valor não for JSON válido', () => {
      localStorage.setItem('invalido', 'não é json');
      expect(() => ns().storage.get('invalido', 'fallback')).not.toThrow();
      expect(ns().storage.get('invalido', 'fallback')).toBe('fallback');
    });
  });

  describe('formatarData', () => {
    it('formata data ISO como dd/mm/aaaa', () => {
      const saida = ns().formatarData('2025-11-08');
      expect(saida).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
    it('retorna string vazia para entrada inválida', () => {
      expect(ns().formatarData('data-invalida')).toBe('');
    });
  });
});