/*
 * REVIEW ONLY. Lets a reviewer flip between the two type treatments (D and E).
 * Remove this file and its <script> tag once one is chosen, and set
 * <html data-type="..."> to the winner.
 */
(function () {
  'use strict';
  var KEY = 'tribute-type';
  var root = document.documentElement;
  var options = [
    { id: 'd', label: 'D', name: 'League Gothic with italic serif' },
    { id: 'e', label: 'E', name: 'Archivo, wide against narrow' }
  ];

  function stored() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(value) {
    try { window.localStorage.setItem(KEY, value); } catch (e) { /* choice just won't carry across pages */ }
  }

  var current = stored() || root.getAttribute('data-type') || 'd';
  root.setAttribute('data-type', current);

  function build() {
    var style = document.createElement('style');
    style.textContent =
      '.type-review{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:30;' +
      'display:flex;align-items:center;gap:4px;padding:4px 4px 4px 14px;background:#fff;color:#0A0A0A;' +
      'border:1px solid #0A0A0A;border-radius:999px;font:600 12px/1 system-ui,sans-serif;letter-spacing:.04em;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.28)}' +
      '.type-review span{margin-right:6px}' +
      '.type-review button{min-width:44px;height:40px;border:0;border-radius:999px;background:transparent;color:#0A0A0A;' +
      'font:700 13px/1 system-ui,sans-serif;cursor:pointer}' +
      '.type-review button[aria-pressed="true"]{background:#0A0A0A;color:#fff}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.className = 'type-review';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Type treatment (review only)');
    var label = document.createElement('span');
    label.textContent = 'Type';
    bar.appendChild(label);

    var buttons = options.map(function (option) {
      var b = document.createElement('button');
      b.type = 'button';
      b.id = 'type-' + option.id;
      b.textContent = option.label;
      b.title = option.name;
      b.setAttribute('aria-label', 'Type ' + option.label + ': ' + option.name);
      b.addEventListener('click', function () {
        current = option.id;
        root.setAttribute('data-type', current);
        store(current);
        sync();
      });
      bar.appendChild(b);
      return b;
    });

    function sync() {
      buttons.forEach(function (b, i) { b.setAttribute('aria-pressed', String(options[i].id === current)); });
    }
    sync();
    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
