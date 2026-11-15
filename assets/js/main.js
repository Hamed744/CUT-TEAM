/* ═══ CUT TEAM — A.GHANBARY — interactions ═══ */
(function () {
  'use strict';

  var WA = '989338135292';                 // شماره واتساپ مربی
  var TG = 'Amirfitclub';                  // آیدی تلگرام پشتیبانی (بدون @)
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  function fa(n) {
    return String(n).replace(/\d/g, function (d) { return FA[+d]; });
  }
  function group(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  }

  /* ── preloader ─────────────────────────────────────────── */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var b = $('#boot');
      if (b) { b.classList.add('done'); setTimeout(function () { b.remove(); }, 600); }
      var r = $('.rail'); if (r) r.classList.add('on');
    }, 520);
  });

  /* ── header: sticky state + read progress ──────────────── */
  var nav = $('#nav'), prog = $('#navProg'), fab = $('#fabs');
  function onScroll() {
    var y = window.scrollY || 0;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('stuck', y > 24);
    if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (fab) fab.classList.toggle('on', y > 520);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── mobile menu ───────────────────────────────────────── */
  var burger = $('#burger'), menu = $('#menu');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    });
    $$('#menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── scroll rail: one plate per section (signature) ────── */
  var sections = $$('section[data-rail]');
  var stack = $('#railStack');
  var plates = [];
  if (stack) {
    sections.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'plate';
      b.dataset.i = i % 8;
      b.dataset.label = s.dataset.rail;
      b.setAttribute('aria-label', 'رفتن به بخش ' + s.dataset.rail);
      b.addEventListener('click', function () { s.scrollIntoView({ behavior: 'smooth' }); });
      stack.appendChild(b);
      plates.push(b);
    });
  }

  var links = $$('#menu a');
  function markActive() {
    var mid = window.scrollY + window.innerHeight * 0.35;
    var idx = -1;
    sections.forEach(function (s, i) { if (s.offsetTop <= mid) idx = i; });
    plates.forEach(function (p, i) { p.classList.toggle('lit', i <= idx); });
    var id = idx >= 0 ? sections[idx].id : '';
    links.forEach(function (a) { a.classList.toggle('here', a.getAttribute('href') === '#' + id); });
  }
  window.addEventListener('scroll', markActive, { passive: true });
  markActive();

  /* ── reveal on scroll ──────────────────────────────────── */
  var items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        setTimeout(function () { el.classList.add('in'); }, (i % 4) * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── stat counters ─────────────────────────────────────── */
  var counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    $$('.stat dd[data-count]').forEach(function (el) {
      var target = +el.dataset.count, t0 = null, dur = 1400;
      function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - k, 3);
        el.textContent = fa(Math.round(target * eased)) + (k === 1 && target >= 100 ? '+' : '');
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if ('IntersectionObserver' in window) {
    var statsEl = $('.stats');
    if (statsEl) {
      new IntersectionObserver(function (e, o) {
        if (e[0].isIntersecting) { runCounters(); o.disconnect(); }
      }, { threshold: 0.4 }).observe(statsEl);
    }
  } else { runCounters(); }

  /* ── calorie estimator ─────────────────────────────────── */
  var C = {
    sex: $('#cSex'), age: $('#cAge'), h: $('#cH'), w: $('#cW'),
    act: $('#cAct'), goal: $('#cGoal'),
    kcal: $('#outKcal'), p: $('#outP'), c: $('#outC'), f: $('#outF'), bmi: $('#outBmi'),
    fill: $('#gaugeFill'), needle: $('#gaugeNeedle')
  };
  function calc() {
    if (!C.kcal) return;
    var age = +C.age.value || 28, h = +C.h.value || 178, w = +C.w.value || 78;
    var bmr = 10 * w + 6.25 * h - 5 * age + (C.sex.value === 'm' ? 5 : -161);
    var tdee = bmr * (+C.act.value);
    var kcal = Math.round(tdee * (1 + (+C.goal.value)) / 10) * 10;

    var pro = Math.round(w * 2);
    var fat = Math.round(w * 1);
    var carb = Math.max(0, Math.round((kcal - pro * 4 - fat * 9) / 4));

    C.kcal.textContent = fa(group(kcal));
    C.p.textContent = fa(pro) + ' گرم';
    C.f.textContent = fa(fat) + ' گرم';
    C.c.textContent = fa(carb) + ' گرم';

    var bmi = w / Math.pow(h / 100, 2);
    C.bmi.textContent = fa(bmi.toFixed(1).replace('.', '٫'));

    // gauge: 1400 → 4200 kcal mapped onto a 180° arc
    var k = Math.min(1, Math.max(0, (kcal - 1400) / 2800));
    if (C.fill) C.fill.style.strokeDashoffset = String(252 - 252 * k);
    if (C.needle) C.needle.style.transform = 'rotate(' + (-90 + 180 * k) + 'deg)';
  }
  ['cSex', 'cAge', 'cH', 'cW', 'cAct', 'cGoal'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { el.addEventListener('input', calc); el.addEventListener('change', calc); }
  });
  calc();

  /* ── plan cards → preselect in form ────────────────────── */
  $$('[data-plan]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = $('#fPlan');
      if (!sel) return;
      $$('option', sel).forEach(function (o) {
        if (o.textContent.trim() === a.dataset.plan) o.selected = true;
      });
      setTimeout(function () { $('#fName') && $('#fName').focus({ preventScroll: true }); }, 700);
    });
  });

  /* ── form → WhatsApp / Telegram ────────────────────────── */
  var form = $('#waForm'), hint = $('#formHint'), tgBtn = $('#tgBtn');

  function validate() {
    var name = $('#fName');
    if (!name.value.trim()) {
      name.closest('.field').classList.add('err');
      hint.textContent = 'لطفاً نام و نام خانوادگی را وارد کن.';
      hint.classList.add('bad');
      name.focus();
      return false;
    }
    name.closest('.field').classList.remove('err');
    hint.classList.remove('bad');
    return true;
  }
  function buildMessage() {
    var v = function (id) { var e = document.getElementById(id); return e && e.value.trim() ? e.value.trim() : '—'; };
    return [
      'سلام استاد قنبری 👋',
      'از سایت تیم کات برای دریافت برنامه پیام می‌دهم.',
      '',
      '• نام: ' + v('fName'),
      '• سن: ' + v('fAge'),
      '• شهر: ' + v('fCity'),
      '• قد: ' + v('fH') + ' سانتی‌متر',
      '• وزن: ' + v('fW') + ' کیلوگرم',
      '• برنامهٔ مورد نظر: ' + v('fPlan'),
      '• سطح تمرینی: ' + v('fLevel'),
      '• روزهای در دسترس: ' + v('fDays'),
      '• هدف: ' + v('fGoal'),
      '• توضیحات: ' + v('fNote')
    ].join('\n');
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!validate()) return;
      hint.textContent = 'در حال باز کردن واتساپ…';
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(buildMessage()), '_blank', 'noopener');
      setTimeout(function () {
        hint.textContent = 'اگر واتساپ باز نشد، مستقیم به شماره ۰۹۳۳۸۱۳۵۲۹۲ پیام بده.';
      }, 1200);
    });

    if (tgBtn) {
      tgBtn.addEventListener('click', function () {
        if (!validate()) return;
        var msg = buildMessage();
        // تلگرام همیشه متن آماده را نمی‌پذیرد؛ برای اطمینان، پیام در کلیپ‌بورد هم کپی می‌شود.
        try { if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(function () {}); } catch (e) {}
        hint.textContent = 'در حال باز کردن تلگرام… اگر پیام خالی بود، آن را Paste کن (کپی شده است).';
        window.open('https://t.me/' + TG + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      });
    }

    $$('#waForm input, #waForm select, #waForm textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var f = el.closest('.field'); if (f) f.classList.remove('err');
      });
    });
  }

  /* ── lightbox ──────────────────────────────────────────── */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbClose = $('#lbClose'), lastFocus = null;
  function openLb(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLb() {
    lb.hidden = true; lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      openLb(b.dataset.full, img ? img.alt : '');
    });
  });
  if (lb) {
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lb.hidden) closeLb();
    });
  }

  /* ── accordion: keep one open ──────────────────────────── */
  var qas = $$('.qa');
  qas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      qas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ── smooth anchor offset under fixed header ───────────── */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - 66;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ── year ──────────────────────────────────────────────── */
  var yEl = $('#year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());
})();
