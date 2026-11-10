(function () {
  'use strict';
  var cfg = window.AMAZONA || {};
  var wa = cfg.WHATSAPP || '244921043500';

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* Menu móvel */
  var btn = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* Formulário de orçamento */
  var form = document.getElementById('pedido');
  if (!form) return;
  var estado = document.getElementById('estado');
  var submit = form.querySelector('button[type="submit"]');

  function val(name) { return (form.elements[name].value || '').trim(); }

  function waLink(d) {
    var m = 'Olá, gostaria de pedir um orçamento.' +
      '\nNome: ' + d.nome + '\nTelefone: ' + d.telefone +
      '\nServiço: ' + d.servico +
      '\nÁrea: ' + (d.area ? d.area + ' m²' : 'a indicar') +
      '\nPrazo: ' + (d.prazo || 'a indicar') +
      '\nLocal: ' + (d.local || 'a indicar') +
      (d.mensagem ? '\nNotas: ' + d.mensagem : '');
    return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(m);
  }

  function show(kind, html) {
    estado.className = 'estado ' + kind;
    estado.innerHTML = html;
    estado.hidden = false;
    estado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function finish(d, saved) {
    var link = waLink(d);
    if (saved) {
      show('ok', '<strong>Pedido recebido.</strong> Entraremos em contacto em breve. ' +
        'Se preferir, <a href="' + link + '" target="_blank" rel="noopener">continue no WhatsApp</a>.');
    } else {
      show('ok', '<strong>Pedido preparado.</strong> <a href="' + link + '" target="_blank" rel="noopener">Abrir o WhatsApp</a> para o enviar.');
      window.open(link, '_blank', 'noopener');
    }
    form.reset();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.website.value) return;              // anti-spam
    var d = {
      nome: val('nome'), telefone: val('telefone'), email: val('email'), empresa: val('empresa'),
      servico: val('servico'), area: val('area'), prazo: val('prazo'), local: val('local'),
      mensagem: val('mensagem'), origem: location.hostname || 'site'
    };
    var digits = d.telefone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) {
      show('erro', 'Indique um número de telefone válido, por exemplo 921 043 500.');
      form.elements.telefone.focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = 'A enviar…';
    function restore() { submit.disabled = false; submit.textContent = 'Enviar pedido'; }

    if (!cfg.SHEETS_ENDPOINT) {
      console.warn('SHEETS_ENDPOINT vazio em js/config.js: o pedido segue só por WhatsApp.');
      finish(d, false); restore(); return;
    }
    fetch(cfg.SHEETS_ENDPOINT, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(d) })
      .then(function () { finish(d, true); })
      .catch(function () {
        show('erro', 'Não foi possível enviar agora. <a href="' + waLink(d) + '" target="_blank" rel="noopener">Envie o pedido por WhatsApp</a>.');
      })
      .then(restore);
  });
})();
