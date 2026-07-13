/* ══════════════════════════════════════════════════════════════
   HERO QUOTE WIZARD — Living Water Pools and Spas
   A multi-step, progress-bar quote form that branches by service.
   Step 0 picks the service; the remaining questions depend on it and
   always include a budget question. 7 steps per branch. Frontend-only:
   submit shows a success panel (wire to a real endpoint later).
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var form = document.getElementById('heroQuote');
  if (!form) return;

  var bodyEl = document.getElementById('hqBody');
  var stepEl = document.getElementById('hqStep');
  var fillEl = document.getElementById('hqFill');
  var backBtn = document.getElementById('hqBack');
  var nextBtn = document.getElementById('hqNext');

  var SERVICES = [
    { key: 'pools',    label: 'New Pools' },
    { key: 'spas',     label: 'Spas & Hot Tubs' },
    { key: 'patios',   label: 'Patios & Decking' },
    { key: 'kitchens', label: 'Outdoor Kitchens' }
  ];
  var TIMELINE = ['As soon as possible', '1–3 months', '3–6 months', 'Just exploring'];
  var CONTACT = { key: 'contact', type: 'contact', q: 'Where should we send your quote?' };

  /* Each branch = 6 steps here (+ the shared service step = 7 total).
     Every branch includes a budget question. */
  var FLOWS = {
    pools: [
      { key: 'poolType', type: 'single', q: 'What type of pool are you after?',
        options: ['Gunite / concrete', 'Fiberglass', 'Not sure yet'] },
      { key: 'size', type: 'single', q: 'Roughly what size?',
        options: ['Small (under 400 sq ft)', 'Medium (400–700 sq ft)', 'Large (700+ sq ft)', 'Not sure yet'] },
      { key: 'features', type: 'multi', q: 'Any add-ons you want? (pick any)',
        options: ['Attached spa', 'Tanning ledge', 'Water features', 'LED lighting', 'Automation'] },
      { key: 'timeline', type: 'single', q: 'What’s your timeline?', options: TIMELINE },
      { key: 'budget', type: 'single', q: 'What’s your budget? Custom pools start around $69,999.',
        options: ['$70k – $100k', '$100k – $130k', '$130k – $160k', '$160k+'] },
      CONTACT
    ],
    spas: [
      { key: 'spaType', type: 'single', q: 'What kind of spa?',
        options: ['Spillover (with a pool)', 'Standalone spa / hot tub', 'Not sure yet'] },
      { key: 'context', type: 'single', q: 'How does it fit with a pool?',
        options: ['Add to my existing pool', 'Part of a new pool', 'Standalone'] },
      { key: 'features', type: 'multi', q: 'Any features you want? (pick any)',
        options: ['Custom tile', 'Therapy jets', 'Heating', 'LED lighting'] },
      { key: 'timeline', type: 'single', q: 'What’s your timeline?', options: TIMELINE },
      { key: 'budget', type: 'single', q: 'What’s your budget?',
        options: ['$15k – $25k', '$25k – $40k', '$40k+', 'Not sure yet'] },
      CONTACT
    ],
    patios: [
      { key: 'material', type: 'single', q: 'What material do you like?',
        options: ['Travertine', 'Pavers', 'Stamped concrete', 'Not sure yet'] },
      { key: 'scope', type: 'single', q: 'What’s the scope?',
        options: ['Brand-new patio', 'Replace / expand existing', 'Around a new pool'] },
      { key: 'area', type: 'single', q: 'Roughly how big an area?',
        options: ['Small', 'Medium', 'Large', 'Not sure yet'] },
      { key: 'timeline', type: 'single', q: 'What’s your timeline?', options: TIMELINE },
      { key: 'budget', type: 'single', q: 'What’s your budget?',
        options: ['$10k – $20k', '$20k – $35k', '$35k+', 'Not sure yet'] },
      CONTACT
    ],
    kitchens: [
      { key: 'setup', type: 'single', q: 'What are you picturing?',
        options: ['Grill island', 'Full outdoor kitchen', 'Kitchen + bar', 'Not sure yet'] },
      { key: 'features', type: 'multi', q: 'Which features? (pick any)',
        options: ['Built-in grill', 'Bar seating', 'Fridge / storage', 'Sink', 'Pizza oven'] },
      { key: 'context', type: 'single', q: 'How does it fit your yard?',
        options: ['Standalone', 'Part of a patio project', 'With a new pool'] },
      { key: 'timeline', type: 'single', q: 'What’s your timeline?', options: TIMELINE },
      { key: 'budget', type: 'single', q: 'What’s your budget?',
        options: ['$15k – $30k', '$30k – $50k', '$50k+', 'Not sure yet'] },
      CONTACT
    ]
  };

  var state = { flow: null, step: 0, answers: {} };

  function totalSteps() { return state.flow ? 1 + FLOWS[state.flow].length : 7; }

  function stepDef() {
    if (state.step === 0) {
      return { key: 'service', type: 'service', q: 'What can we help you build?', options: SERVICES };
    }
    return FLOWS[state.flow][state.step - 1];
  }

  function go(n) {
    bodyEl.classList.add('is-swapping');
    setTimeout(function () {
      state.step = n;
      render();
      bodyEl.classList.remove('is-swapping');
    }, 180);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function render() {
    var def = stepDef();
    var total = totalSteps();

    stepEl.textContent = 'Step ' + (state.step + 1) + ' of ' + total;
    fillEl.style.width = Math.round(((state.step + 1) / total) * 100) + '%';
    backBtn.hidden = state.step === 0;
    nextBtn.hidden = true;

    bodyEl.innerHTML = '';
    bodyEl.appendChild(el('p', 'hq-q', def.q));

    if (def.type === 'service' || def.type === 'single') {
      var wrap = el('div', 'hq-options');
      def.options.forEach(function (opt) {
        var isService = def.type === 'service';
        var label = isService ? opt.label : opt;
        var val = isService ? opt.key : opt;
        var key = isService ? 'service' : def.key;
        var btn = el('button', 'hq-opt', label);
        btn.type = 'button';
        if (state.answers[key] === val) btn.classList.add('is-sel');
        btn.addEventListener('click', function () {
          wrap.querySelectorAll('.hq-opt').forEach(function (o) { o.classList.remove('is-sel'); });
          btn.classList.add('is-sel');
          if (isService) {
            if (state.flow !== val) { state.flow = val; state.answers = { service: val, serviceLabel: opt.label }; }
            setTimeout(function () { go(1); }, 220);
          } else {
            state.answers[def.key] = val;
            setTimeout(function () { go(state.step + 1); }, 220);
          }
        });
        wrap.appendChild(btn);
      });
      bodyEl.appendChild(wrap);

    } else if (def.type === 'multi') {
      var arr = state.answers[def.key] || [];
      var wrapM = el('div', 'hq-options');
      def.options.forEach(function (opt) {
        var btn = el('button', 'hq-opt hq-opt-multi', opt);
        btn.type = 'button';
        if (arr.indexOf(opt) >= 0) btn.classList.add('is-sel');
        btn.addEventListener('click', function () {
          var cur = state.answers[def.key] || [];
          var i = cur.indexOf(opt);
          if (i >= 0) cur.splice(i, 1); else cur.push(opt);
          state.answers[def.key] = cur;
          btn.classList.toggle('is-sel');
        });
        wrapM.appendChild(btn);
      });
      bodyEl.appendChild(wrapM);
      nextBtn.hidden = false;
      nextBtn.textContent = 'Continue';

    } else if (def.type === 'contact') {
      var fields = el('div', 'hq-fields');
      fields.innerHTML =
        '<label class="hq-field"><span>Name</span><input type="text" id="hqName" autocomplete="name" required></label>' +
        '<label class="hq-field"><span>Email</span><input type="email" id="hqEmail" autocomplete="email" required></label>' +
        '<label class="hq-field"><span>Phone</span><input type="tel" id="hqPhone" autocomplete="tel"></label>';
      bodyEl.appendChild(fields);
      var err = el('p', 'hq-error');
      bodyEl.appendChild(err);
      // restore any typed values
      ['Name', 'Email', 'Phone'].forEach(function (f) {
        var v = state.answers['contact' + f];
        if (v) fields.querySelector('#hq' + f).value = v;
      });
      var submit = el('button', 'hq-submit', 'Get My Free Quote');
      submit.type = 'button';
      submit.addEventListener('click', function () {
        var name = fields.querySelector('#hqName').value.trim();
        var email = fields.querySelector('#hqEmail').value.trim();
        var phone = fields.querySelector('#hqPhone').value.trim();
        state.answers.contactName = name;
        state.answers.contactEmail = email;
        state.answers.contactPhone = phone;
        if (!name) { err.textContent = 'Please enter your name.'; return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Please enter a valid email.'; return; }
        succeed();
      });
      bodyEl.appendChild(submit);
    }
  }

  function succeed() {
    fillEl.style.width = '100%';
    stepEl.textContent = 'Done';
    backBtn.hidden = true;
    nextBtn.hidden = true;
    bodyEl.innerHTML = '';
    var done = el('div', 'hq-done');
    var icon = el('div', 'hq-done-icon');
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
    done.appendChild(icon);
    done.appendChild(el('h3', null, 'Thanks, ' + (state.answers.contactName || 'there') + '!'));
    done.appendChild(el('p', null,
      'We’ve got your ' + (state.answers.serviceLabel || 'project') +
      ' request. A Living Water specialist will reach out shortly to put together your free quote.'));
    var again = el('button', 'hq-restart', 'Start another request');
    again.type = 'button';
    again.addEventListener('click', function () {
      state = { flow: null, step: 0, answers: {} };
      render();
    });
    done.appendChild(again);
    bodyEl.appendChild(done);
    // Hand-off point for a real backend:
    try { console.log('Living Water quote request:', JSON.parse(JSON.stringify(state.answers))); } catch (e) {}
  }

  nextBtn.addEventListener('click', function () { go(state.step + 1); });
  backBtn.addEventListener('click', function () { if (state.step > 0) go(state.step - 1); });

  render();
})();
