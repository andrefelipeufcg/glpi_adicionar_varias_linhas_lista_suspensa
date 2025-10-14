// ==UserScript==
// @name         Colar multilinhas em input a partir do botão clicado
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  Cola várias linhas em uma lista de inputs, iniciando no input onde o botão foi clicado
// @author       Andre Felipe
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  // Delay utilitário
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Insere um botão “Colar Várias Linhas” ao lado de cada input placeholder="Insira uma opção"
  function criarBotoes() {
    document.querySelectorAll('input[placeholder="Insira uma opção"]').forEach((input, idx) => {
      if (input.nextElementSibling?.classList.contains('tm-colar-btn')) return;

      // Cria o botão
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Colar Várias Linhas';
      btn.className = 'tm-colar-btn';
      Object.assign(btn.style, {
        marginLeft: '8px',
        padding: '4px 8px',
        background: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
      });

      // Handler memoriza o índice de partida
      btn.addEventListener('click', async () => {
        const texto = prompt('Cole cada opção em uma nova linha:');
        if (!texto) return;
        const linhas = texto.split('\n').map(l => l.trim()).filter(l => l);
        if (!linhas.length) return;

        btn.disabled = true;
        btn.textContent = '⏳ Colando...';

        for (let i = 0; i < linhas.length; i++) {
          await sleep(200);

          // Reobtém todos os campos
          const campos = document.querySelectorAll('input[placeholder="Insira uma opção"]');
          const campo = campos[idx + i] || campos[campos.length - 1];
          if (!campo) break;

          // Cola inteira
          campo.focus();
          campo.value = linhas[i];
          campo.dispatchEvent(new Event('input', { bubbles: true }));
          campo.dispatchEvent(new Event('change', { bubbles: true }));

          // Simula TAB (keydown, keypress, keyup)
          ['keydown','keypress','keyup'].forEach(type => {
            campo.dispatchEvent(new KeyboardEvent(type, {
              key:'Tab', code:'Tab', keyCode:9, which:9,
              bubbles:true, cancelable:true
            }));
          });
        }

        btn.disabled = false;
        btn.textContent = 'Colar Várias Linhas';
      });

      // Insere o botão após o input
      input.parentNode.insertBefore(btn, input.nextSibling);
    });
  }

  // Observa DOM para inputs dinâmicos
  new MutationObserver(criarBotoes).observe(document.body, { childList: true, subtree: true });
  setTimeout(criarBotoes, 500);
})();
