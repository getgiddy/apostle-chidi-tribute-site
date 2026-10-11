/* Renders both pages from window.TRIBUTE (js/content.js). No dependencies. */
(function () {
  'use strict';

  var T = window.TRIBUTE;
  if (!T) return;

  var doc = document;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  var ICON = {
    play: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>',
    close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>',
    prev: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 6l-6 6 6 6"></path></svg>',
    next: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 6l6 6-6 6"></path></svg>'
  };

  /* ---------- helpers ---------- */

  // Small element builder. `html` is only ever given the static ICON strings above;
  // all content from content.js goes through `text`, so it is never parsed as markup.
  function h(tag, attrs, kids) {
    var el = doc.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    [].concat(kids || []).forEach(function (kid) {
      if (kid) el.appendChild(typeof kid === 'string' ? doc.createTextNode(kid) : kid);
    });
    return el;
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function numberWord(n) {
    var words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    return words[n] || String(n);
  }

  // "The ones *you* | raised" -> lead span, accent word, key span. Text only; nothing is parsed as HTML.
  function accentNodes(text) {
    return text.split(/\*([^*]+)\*/).map(function (piece, i) {
      if (!piece) return null;
      return i % 2 ? h('em', { text: piece }) : doc.createTextNode(piece);
    });
  }
  function titleNodes(title) {
    var parts = String(title).split('|').map(function (s) { return s.trim(); });
    if (parts.length < 2) return accentNodes(parts[0]);
    return [
      h('span', { class: 't-lead' }, accentNodes(parts[0])),
      doc.createTextNode(' '),
      h('span', { class: 't-key' }, accentNodes(parts.slice(1).join(' ')))
    ];
  }
  function fill(el, nodes) {
    el.textContent = '';
    nodes.forEach(function (node) { if (node) el.appendChild(node); });
  }

  function lookup(path) {
    return path.split('.').reduce(function (obj, key) { return obj == null ? obj : obj[key]; }, T);
  }

  /* ---------- data ---------- */

  var chapters = (T.chapters || []).map(function (c, i) {
    c.number = pad(i + 1);
    return c;
  });
  var chapterById = {};
  chapters.forEach(function (c) { chapterById[c.id] = c; });

  var items = (T.testimonies || []).filter(function (t) { return chapterById[t.chapter]; });

  function pick(chapterId, type) {
    return items.filter(function (t) { return t.chapter === chapterId && t.type === type; });
  }

  /* ---------- static text bindings ---------- */

  function bindText() {
    doc.querySelectorAll('[data-bind]').forEach(function (el) {
      var value = lookup(el.getAttribute('data-bind'));
      if (value == null || value === '') {
        (el.closest('[data-optional]') || el).hidden = true;
      } else {
        el.textContent = value;
      }
    });

    var nameEl = doc.querySelector('[data-name-lines]');
    var lines = T.honoree && T.honoree.nameLines;
    if (nameEl && lines && lines.length) {
      nameEl.textContent = '';
      lines.forEach(function (line, i) {
        if (i) nameEl.appendChild(doc.createTextNode(' '));
        nameEl.appendChild(h('span', { class: i === lines.length - 1 ? 't-key' : 't-lead', text: line }));
      });
    }

    doc.querySelectorAll('[data-title]').forEach(function (el) {
      var value = lookup(el.getAttribute('data-title'));
      if (value) fill(el, titleNodes(value));
    });

    var signoff = doc.querySelector('[data-signoff]');
    if (signoff) {
      var parts = [T.occasion.church, T.occasion.year].filter(Boolean);
      signoff.textContent = parts.join(' · ');
      signoff.hidden = !parts.length;
    }
  }

  /* ---------- background video ---------- */

  var bgVideos = [];
  var bgHeld = false; // true while the player is open
  var canAutoplay = !reduceMotion && !saveData && 'IntersectionObserver' in window;

  function syncBg(video) {
    if (video._inView && !bgHeld) {
      if (!video.getAttribute('src')) video.src = video.getAttribute('data-src');
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stays */ });
    } else {
      video.pause();
    }
  }

  var bgObserver = canAutoplay ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target._inView = entry.isIntersecting;
      syncBg(entry.target);
    });
  }, { threshold: 0.15 }) : null;

  // Background videos load and play only while on screen. With reduced motion or
  // data saver on, the poster image is shown instead and nothing is downloaded.
  function registerBg(video, src, poster) {
    if (!video || !src) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    if (poster) video.poster = poster;
    video.setAttribute('data-src', src);
    bgVideos.push(video);
    if (bgObserver) bgObserver.observe(video);
  }

  function holdBg(hold) {
    bgHeld = hold;
    bgVideos.forEach(syncBg);
  }

  /* ---------- video player ---------- */

  var player = (function () {
    var dlg, video, kicker, nameEl, roleEl, foot, count, list = [], index = 0, opener = null;

    function build() {
      video = h('video', { controls: true, playsinline: true, preload: 'metadata' });
      kicker = h('span', { class: 'eyebrow eyebrow--gold' });
      nameEl = h('span', { class: 'player__name' });
      roleEl = h('span', { class: 'player__role' });
      count = h('span', { class: 'player__count', 'aria-live': 'polite' });
      foot = h('div', { class: 'player__foot' }, [
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Previous video', html: ICON.prev, onclick: function () { step(-1); } }),
        count,
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Next video', html: ICON.next, onclick: function () { step(1); } })
      ]);
      var stage = h('div', { class: 'player__stage' }, video);
      dlg = h('dialog', { class: 'player', 'aria-label': 'Video player' }, [
        h('div', { class: 'player__bar' }, [
          h('div', { class: 'player__meta' }, [kicker, nameEl, roleEl]),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Close video', html: ICON.close, onclick: close })
        ]),
        stage,
        foot
      ]);
      dlg.addEventListener('close', onClose);
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target === stage) close(); });
      dlg.addEventListener('keydown', function (e) {
        if (e.target === video || list.length < 2) return;
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      });
      video.addEventListener('ended', function () { if (index < list.length - 1) step(1); });
      doc.body.appendChild(dlg);
    }

    function show() {
      var item = list[index];
      var chapter = chapterById[item.chapter];
      kicker.textContent = chapter ? chapter.number + ' · ' + chapter.label : (item.kicker || '');
      kicker.hidden = !kicker.textContent;
      nameEl.textContent = item.name || item.title || '';
      roleEl.textContent = item.role || '';
      roleEl.hidden = !item.role;
      count.textContent = (index + 1) + ' / ' + list.length;
      foot.hidden = list.length < 2;
      if (item.poster) video.poster = item.poster; else video.removeAttribute('poster');
      video.src = item.src;
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* the viewer can press play */ });
    }

    function step(delta) {
      index = (index + delta + list.length) % list.length;
      show();
    }

    function open(videos, startAt, from) {
      if (!videos || !videos.length) return;
      if (!dlg) build();
      list = videos;
      index = startAt || 0;
      opener = from || doc.activeElement;
      holdBg(true);
      doc.documentElement.classList.add('is-locked');
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      show();
    }

    function close() {
      if (dlg.close) dlg.close(); else { dlg.removeAttribute('open'); onClose(); }
    }

    function onClose() {
      video.pause();
      video.removeAttribute('src');
      video.load();
      doc.documentElement.classList.remove('is-locked');
      holdBg(false);
      if (opener && opener.focus) opener.focus();
    }

    return { open: open };
  })();

  /* ---------- shared pieces ---------- */

  function ring() {
    return h('span', { class: 'play__ring', 'aria-hidden': 'true', html: ICON.play });
  }

  function who(t) {
    return h('figcaption', { class: 'quote__who' }, [
      h('span', { class: 'quote__name', text: t.name }),
      t.role ? h('span', { class: 'quote__role', text: t.role }) : null
    ]);
  }

  function chapterLink(chapter, label) {
    return h('a', { class: 'link', href: 'voices.html#' + chapter.id, text: label || 'More from this chapter' });
  }

  // A poster image with a play ring; opens `playlist` at `index`.
  function mediaButton(t, playlist, index, className, extra) {
    return h('button', {
      class: 'media ' + className, type: 'button',
      'aria-label': 'Play video testimony from ' + t.name,
      onclick: function (e) { player.open(playlist, index, e.currentTarget); }
    }, [
      t.poster ? h('img', { src: t.poster, alt: '', loading: 'lazy', decoding: 'async' }) : null,
      ring(),
      extra || null,
      h('span', { class: 'media__caption' }, [
        h('span', { class: 'media__name', text: t.name }),
        t.role ? h('span', { class: 'media__role', text: t.role }) : null
      ])
    ]);
  }

  /* ---------- home page ---------- */

  function chapterHead(c) {
    return [
      h('p', { class: 'eyebrow', text: c.number + ' · ' + c.label }),
      h('h2', { class: 'display', id: 'title-' + c.id }, titleNodes(c.title))
    ];
  }

  function panel(c, playlist) {
    var centered = c.layout === 'center';
    var featured = playlist[0];
    var more = playlist.slice(1, 4);
    var head = chapterHead(c);
    head[0].className = 'eyebrow eyebrow--gold';

    var bg = h('div', { class: 'bg', 'aria-hidden': 'true' });
    if (c.video) {
      var video = h('video', { preload: 'none', tabindex: '-1' });
      registerBg(video, c.video, c.poster);
      bg.appendChild(video);
    } else if (c.poster || (featured && featured.poster)) {
      bg.appendChild(h('img', { src: c.poster || featured.poster, alt: '', loading: 'lazy' }));
    }

    var text = h('div', { class: 'panel__text' }, head.concat([
      c.intro ? h('p', { class: 'panel__intro', text: c.intro }) : null,
      featured ? h('button', {
        class: 'play', type: 'button',
        onclick: function (e) { player.open(playlist, 0, e.currentTarget); }
      }, [ring(), h('span', {}, ['Play video', h('span', { class: 'play__who', text: ' · ' + featured.name })])]) : null
    ]));

    var thumbs = more.length ? h('div', { class: 'panel__more' }, [
      h('p', { class: 'eyebrow eyebrow--mist', text: 'More voices' }),
      h('div', { class: 'thumbs' }, more.map(function (t, i) {
        return h('button', {
          class: 'thumb', type: 'button', 'aria-label': 'Play video testimony from ' + t.name,
          onclick: function (e) { player.open(playlist, i + 1, e.currentTarget); }
        }, [
          h('span', { class: 'thumb__img', html: ICON.play }, t.poster ? h('img', { src: t.poster, alt: '', loading: 'lazy', decoding: 'async' }) : null),
          h('span', { class: 'thumb__name', text: t.name })
        ]);
      }))
    ]) : null;

    return h('section', {
      class: 'panel' + (centered ? ' panel--center' : '') + (c.flip ? ' panel--flip' : ''),
      'aria-labelledby': 'title-' + c.id
    }, [bg, h('div', { class: 'panel__inner' }, [text, thumbs])]);
  }

  function spread(c, t) {
    return h('section', { class: 'spread', 'aria-label': 'A written testimony: ' + c.label }, [
      h('figure', { class: 'quote quote--spread' }, [
        h('blockquote', { text: t.quote }),
        h('span', { class: 'quote__rule', 'aria-hidden': 'true' }),
        who(t),
        chapterLink(c)
      ])
    ]);
  }

  function quoteRow(c, texts) {
    return h('section', { class: 'row', 'aria-label': 'Written testimonies: ' + c.label }, [
      h('div', { class: 'row__inner' }, [
        h('div', { class: 'row__grid' }, texts.map(function (t) {
          return h('figure', { class: 'quote quote--col' }, [h('blockquote', { text: t.quote }), who(t)]);
        })),
        h('div', {}, chapterLink(c))
      ])
    ]);
  }

  function split(c, playlist, texts) {
    var featured = playlist[0];
    var t = texts[0];
    var body = h('div', { class: 'split__body' }, chapterHead(c).concat([
      c.intro ? h('p', { class: 'split__intro', text: c.intro }) : null,
      t ? h('figure', { class: 'quote quote--inline' }, [
        h('blockquote', { text: t.quote }),
        h('figcaption', {}, [t.name, t.role ? h('span', { text: ' · ' + t.role }) : null])
      ]) : null,
      chapterLink(c)
    ]));
    return h('section', { class: 'split' + (c.flip ? ' split--flip' : ''), 'aria-labelledby': 'title-' + c.id }, [
      featured ? mediaButton(featured, playlist, 0, 'split__media') : null,
      body
    ]);
  }

  function renderChapter(mount) {
    var c = chapterById[mount.getAttribute('data-chapter')];
    if (!c) { mount.remove(); return; }
    var videos = pick(c.id, 'video');
    var featured = videos.filter(function (v) { return v.featured; })[0] || videos[0];
    var playlist = featured ? [featured].concat(videos.filter(function (v) { return v !== featured; })) : [];
    var texts = pick(c.id, 'text');

    mount.id = 'ch-' + c.id;
    if (c.layout === 'split') {
      mount.appendChild(split(c, playlist, texts));
    } else {
      mount.appendChild(panel(c, playlist));
      if (texts.length) mount.appendChild(c.layout === 'center' ? quoteRow(c, texts.slice(0, 3)) : spread(c, texts[0]));
    }
  }

  function renderYears(mount) {
    var y = T.years;
    if (!y || !y.photos || !y.photos.length) { mount.remove(); return; }
    mount.appendChild(h('div', { class: 'years__inner' }, [
      h('h2', { class: 'years__heading', text: y.heading }),
      h('div', { class: 'years__grid' }, y.photos.map(function (p) {
        return h('figure', {}, [
          h('img', { src: p.src, alt: p.caption || '', loading: 'lazy', decoding: 'async', width: 800, height: 1000 }),
          p.caption ? h('figcaption', { text: p.caption }) : null
        ]);
      }))
    ]));
  }

  function initHome() {
    doc.querySelectorAll('video[data-media]').forEach(function (video) {
      var block = T[video.getAttribute('data-media')] || {};
      registerBg(video, block.video, block.poster);
    });

    var filmButton = doc.querySelector('[data-play-film]');
    var film = T.hero && T.hero.film;
    if (filmButton) {
      if (film && film.src) {
        filmButton.addEventListener('click', function () {
          player.open([{ src: film.src, poster: film.poster, title: film.title, kicker: T.honoree.name }], 0, filmButton);
        });
      } else {
        filmButton.hidden = true;
      }
    }

    var meta = doc.querySelector('[data-story-meta]');
    if (meta) {
      var parts = [];
      if (T.occasion.yearsInMinistry) parts.push(T.occasion.yearsInMinistry + ' years of ministry');
      parts.push(items.length + ' voices');
      parts.push(numberWord(chapters.length) + ' chapters');
      meta.textContent = parts.join('. ') + '.';
    }

    var indexNav = doc.querySelector('[data-chapter-index]');
    if (indexNav) {
      chapters.forEach(function (c) {
        indexNav.appendChild(h('a', { href: '#ch-' + c.id }, [h('span', { class: 'num', text: c.number }), c.label]));
      });
    }

    doc.querySelectorAll('[data-chapter]').forEach(renderChapter);
    doc.querySelectorAll('[data-years]').forEach(renderYears);

    var header = doc.querySelector('[data-header]');
    var hero = doc.querySelector('.hero');
    if (header && hero) {
      var onScroll = function () {
        header.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 90);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    }
  }

  /* ---------- every testimony page ---------- */

  // Alternate video and written cards inside each chapter so the grid has rhythm.
  function interleaved() {
    var out = [];
    chapters.forEach(function (c) {
      var v = pick(c.id, 'video');
      var t = pick(c.id, 'text');
      for (var i = 0; i < Math.max(v.length, t.length); i++) {
        if (v[i]) out.push(v[i]);
        if (t[i]) out.push(t[i]);
      }
    });
    return out;
  }

  function initVoices(grid) {
    var all = interleaved();
    var state = { type: 'all', chapter: 'all' };
    var tabs = [].slice.call(doc.querySelectorAll('.tab[data-type]'));
    var chipsMount = doc.querySelector('[data-chips]');
    var showing = doc.querySelector('[data-showing]');
    var empty = doc.querySelector('[data-empty]');
    var reset = doc.querySelector('[data-reset]');
    var chips = [];

    function setText(selector, value) {
      var el = doc.querySelector(selector);
      if (el) el.textContent = value;
    }
    setText('[data-count-all]', all.length);
    setText('[data-count-video]', all.filter(function (t) { return t.type === 'video'; }).length);
    setText('[data-count-text]', all.filter(function (t) { return t.type === 'text'; }).length);

    function chip(id, label) {
      var b = h('button', {
        class: 'chip', type: 'button', id: 'chapter-' + id, 'data-chapter-filter': id, text: label,
        onclick: function () { state.chapter = id; writeHash(); render(); }
      });
      chips.push(b);
      return b;
    }
    if (chipsMount) {
      chipsMount.appendChild(chip('all', 'All chapters'));
      chapters.forEach(function (c) { chipsMount.appendChild(chip(c.id, c.label)); });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { state.type = tab.getAttribute('data-type'); render(); });
    });
    if (reset) reset.addEventListener('click', function () { state.type = 'all'; state.chapter = 'all'; writeHash(); render(); });

    // voices.html#home opens with that chapter selected.
    function readHash() {
      var id = (window.location.hash || '').replace('#', '');
      state.chapter = chapterById[id] ? id : 'all';
    }
    function writeHash() {
      try {
        window.history.replaceState(null, '', state.chapter === 'all' ? window.location.pathname + window.location.search : '#' + state.chapter);
      } catch (e) { /* history is unavailable in some embedded views */ }
    }

    function videoCard(t, playlist) {
      var c = chapterById[t.chapter];
      return mediaButton(t, playlist, playlist.indexOf(t), 'card card--video', h('span', { class: 'card__chapter', text: c.label }));
    }
    function textCard(t) {
      var c = chapterById[t.chapter];
      return h('figure', { class: 'card card--text' }, [
        h('p', { class: 'eyebrow', text: c.label }),
        h('blockquote', { text: t.quote }),
        who(t)
      ]);
    }

    function render() {
      var list = all.filter(function (t) {
        return (state.type === 'all' || t.type === state.type) && (state.chapter === 'all' || t.chapter === state.chapter);
      });
      var playlist = list.filter(function (t) { return t.type === 'video'; });
      grid.textContent = '';
      list.forEach(function (t) { grid.appendChild(t.type === 'video' ? videoCard(t, playlist) : textCard(t)); });
      tabs.forEach(function (tab) { tab.setAttribute('aria-pressed', String(tab.getAttribute('data-type') === state.type)); });
      chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-chapter-filter') === state.chapter)); });
      if (showing) showing.textContent = 'Showing ' + list.length + ' of ' + all.length;
      if (empty) empty.hidden = list.length > 0;
    }

    window.addEventListener('hashchange', function () { readHash(); render(); });
    readHash();
    render();
  }

  /* ---------- start ---------- */

  bindText();
  var grid = doc.querySelector('[data-grid]');
  if (grid) initVoices(grid); else initHome();
})();
