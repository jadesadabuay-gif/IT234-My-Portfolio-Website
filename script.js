/* =====================================================================
   script.js — ดึงข้อมูลจาก data/portfolio.json แล้วสร้างหน้าเว็บ
   หมายเหตุ: ต้องเปิดผ่าน Local Server (เช่น Live Server) หรือ GitHub Pages
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let D;

/* ---------- ไอคอนของกลุ่มทักษะ ---------- */
const ICONS = {
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  design: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>',
  code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>'
};

/* ---------- กราฟิกประกอบผลงาน (SVG) ---------- */
const table = (x, y, w, name, rows) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${24 + rows.length * 18}" rx="8" class="s1" fill="none" stroke-width="1.6"/>` +
  `<path d="M${x} ${y + 24}h${w}" class="s1" stroke-width="1.6"/>` +
  `<text x="${x + 10}" y="${y + 16}" fill="currentColor" font-weight="700">${name}</text>` +
  rows.map((r, i) => `<text x="${x + 10}" y="${y + 41 + i * 18}" fill="currentColor" opacity=".8">${r}</text>`).join('');
const VIS = {
  erd: `<svg viewBox="0 0 420 250" role="img" aria-label="แผนภาพความสัมพันธ์ของตารางข้อมูล">
    <path d="M130 50L150 92M290 50L270 92M210 138V162" class="s1" fill="none" stroke-width="1.6" stroke-dasharray="5 5"/>
    <circle cx="150" cy="92" r="5" fill="#FF4D8D"/><circle cx="270" cy="92" r="5" fill="#FF4D8D"/><circle cx="210" cy="162" r="5" fill="#FF4D8D"/>
    ${table(10, 10, 120, 'customers', ['id PK', 'name', 'email'])}${table(290, 10, 120, 'products', ['id PK', 'name', 'price'])}
    ${table(150, 62, 120, 'orders', ['id PK', 'customer_id FK', 'total'])}${table(150, 162, 120, 'payments', ['id PK', 'order_id FK'])}</svg>`,
  wire: `<svg viewBox="0 0 300 220" role="img" aria-label="โครงหน้าจอเว็บไซต์พอร์ทัล">
    <rect x="10" y="10" width="280" height="200" rx="14" class="s1" fill="none" stroke-width="2"/>
    <path d="M10 40h280" class="s1" stroke-width="2"/><circle cx="26" cy="25" r="4" fill="#FF4D8D"/><circle cx="40" cy="25" r="4" class="s1" fill="none" stroke-width="1.5"/>
    <rect x="26" y="54" width="248" height="22" rx="11" class="s1" fill="none" stroke-width="1.6"/>
    <rect x="26" y="88" width="248" height="46" rx="8" fill="#2441FF"/>
    <rect x="26" y="146" width="76" height="50" rx="8" class="s1" fill="none" stroke-width="1.6"/>
    <rect x="112" y="146" width="76" height="50" rx="8" class="s1" fill="none" stroke-width="1.6"/>
    <rect x="198" y="146" width="76" height="50" rx="8" fill="#FF4D8D"/></svg>`,
  chart: `<svg viewBox="0 0 420 240" role="img" aria-label="แดชบอร์ดกราฟยอดขาย">
    <path d="M30 20v190h370" class="s1" fill="none" stroke-width="2"/>
    ${[60, 95, 75, 130, 110, 160, 145, 185].map((h, i) => `<rect x="${48 + i * 43}" y="${210 - h}" width="28" height="${h}" rx="4" fill="${i % 2 ? '#FF4D8D' : '#2441FF'}"/>`).join('')}
    <polyline points="62,140 105,118 148,128 191,92 234,100 277,64 320,72 363,34" fill="none" stroke="#C9F5E4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="363" cy="34" r="6" fill="#C9F5E4"/></svg>`
};

/* ---------- ส่วนประกอบ ---------- */
const head = (t, d) => `<div class="sh rv"><h2>${esc(t)}</h2>${d ? `<p>${esc(d)}</p>` : ''}</div>`;

function render() {
  const { hero: h, about: a, skills: s, projects: p, workflow: w, contact: c, footer: f } = D;

  $('#navLinks').innerHTML = D.nav.map((n) => `<a href="#${n.id}" data-id="${n.id}">${esc(n.label)}</a>`).join('');

  $('#heroTxt').innerHTML = `
    <h1><span class="ln l1"><span>${esc(h.line1)}</span></span><span class="ln l2"><span>${esc(h.line2)}</span></span></h1>
    <p class="en fd">${esc(h.en)}</p>
    <p class="lead fd">${esc(h.desc)}</p>
    <div class="btns fd"><a class="btn" href="#projects">${esc(h.btn1)}</a><a class="btn ghost" href="#about">${esc(h.btn2)}</a></div>`;
  const items = h.ticker.map((t) => `<span>${esc(t)}</span>`).join('');
  $('#marquee').innerHTML = `<div class="mq">${items}${items}</div>`;

  $('#about').innerHTML = `<div class="wrap"><h2 class="rv">${esc(a.title)}</h2><div class="rv"><p class="txt">${esc(a.text)}</p>
    <dl class="facts">${a.facts.map((x) => `<div><dt>${esc(x.k)}</dt><dd>${esc(x.v)}</dd></div>`).join('')}</dl></div></div>`;

  $('#skills').innerHTML = `<div class="wrap">${head(s.title, s.desc)}<div class="groups">${s.groups.map((g) => `
    <article class="group t-${g.tone} rv"><div class="g-hd"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[g.icon]}</svg>${esc(g.name)}</div>
    <p class="g-note">${esc(g.note)}</p><ul>${g.items.map((i) => `<li><b>${esc(i.n)}</b><span>${esc(i.d)}</span></li>`).join('')}</ul></article>`).join('')}</div></div>`;

  $('#projects').innerHTML = `<div class="wrap">${head(p.title, p.desc)}<div class="pg">${p.items.map((x, i) => `
    <article class="card c${i + 1} rv"><div class="vis">${VIS[x.visual]}</div><div class="body">
    <span class="pno">${esc(x.no)}</span><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p>
    <ul class="tags">${x.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    <button class="pbtn" data-i="${i}" aria-haspopup="dialog">${esc(p.btn)}</button></div></article>`).join('')}</div></div>`;

  $('#workflow').innerHTML = `<div class="wrap">${head(w.title, w.desc)}
    <div class="steps rv" id="steps" role="tablist">${w.steps.map((x, i) => `<button class="stp" role="tab" data-i="${i}"><span class="n">0${i + 1}</span><strong>${esc(x.t)}</strong></button>`).join('')}</div>
    <div class="panel rv" id="panel" aria-live="polite"></div></div>`;

  $('#contact').innerHTML = `<div class="wrap"><h2 class="rv">${esc(c.title)}</h2><p class="d rv">${esc(c.desc)}</p>
    <div class="ch rv">${c.channels.map((x) => `<a href="${esc(x.href)}" ${x.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}><span class="lb">${esc(x.label)}</span><span>${esc(x.value)}</span><span class="ar" aria-hidden="true">↗</span></a>`).join('')}</div>
    <button class="cp" id="copyBtn" style="margin:24px 0 0">${esc(c.copy)}</button></div>`;

  $('#footer').innerHTML = `<p class="fname">${esc(D.owner)}</p><div class="fbar"><span>© ${D.year} ${esc(D.owner)} · ${esc(f.text)}</span><a href="#home">${esc(f.top)}</a></div>`;
}

/* ---------- Workflow แบบกดเลือก + เลื่อนอัตโนมัติเมื่ออยู่ในหน้าจอ ---------- */
function initSteps() {
  const steps = D.workflow.steps, btns = $$('.stp'), panel = $('#panel');
  let cur = -1, timer = null, manual = false;
  const set = (i) => {
    cur = i;
    btns.forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('past', k < i); b.setAttribute('aria-selected', k === i); });
    $('#steps').style.setProperty('--p', `${i * 25}%`);
    const x = steps[i];
    panel.innerHTML = `<div class="pn in">0${i + 1}</div><div class="in"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><ul class="chips">${x.o.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></div>`;
  };
  btns.forEach((b) => b.addEventListener('click', () => { manual = true; clearInterval(timer); set(+b.dataset.i); }));
  set(0);
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting && !manual) timer = setInterval(() => set((cur + 1) % steps.length), 4500);
  }, { threshold: 0.4 }).observe($('#workflow'));
}

/* ---------- หน้าต่างรายละเอียดผลงาน ---------- */
function initDialog() {
  const dlg = $('#dlg');
  $$('.pbtn').forEach((b) => b.addEventListener('click', () => {
    const x = D.projects.items[b.dataset.i], d = x.detail;
    $('#dlgBody').innerHTML = `<button class="x" aria-label="ปิดหน้าต่าง" id="xBtn">✕</button><span class="pno" style="color:transparent;-webkit-text-stroke:1.5px var(--cobalt)">${esc(x.no)}</span>
      <h3 id="dlgTitle">${esc(x.title)}</h3><p>${esc(d.overview)}</p><h4>สิ่งที่ทำ</h4><ul>${d.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <h4>ผลลัพธ์</h4><p>${esc(d.result)}</p><ul class="tags">${x.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
    dlg.showModal();
    $('#xBtn').addEventListener('click', () => dlg.close());
  }));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

/* ---------- พฤติกรรมของหน้าเว็บ ---------- */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
function initUI() {
  // เมนูมือถือ
  const menu = $('#menuBtn'), links = $('#navLinks');
  menu.addEventListener('click', () => { const o = links.classList.toggle('open'); menu.setAttribute('aria-expanded', o); });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });
  // แสดงองค์ประกอบเมื่อเลื่อนมาถึง
  const rv = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.rv').forEach((el) => rv.observe(el));
  // ไฮไลต์เมนูตามส่วนที่กำลังดู
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) $$('.links a').forEach((a) => a.classList.toggle('on', a.dataset.id === e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach((s) => spy.observe(s));
  // ปุ่มกลับด้านบน
  const top = $('#toTop');
  addEventListener('scroll', () => top.classList.toggle('show', scrollY > 600), { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  // คัดลอกอีเมล
  const mail = D.contact.channels.find((c) => c.copy);
  $('#copyBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(mail.value); toast(D.contact.copied); }
    catch { const r = document.createRange(); r.selectNodeContents($('.ch a span:nth-child(2)')); getSelection().removeAllRanges(); getSelection().addRange(r); toast(mail.value); }
  });
}

/* ---------- เริ่มทำงาน ---------- */
async function init() {
  const num = $('#ldNum'), bar = $('#ldBar'); let pct = 0;
  const tick = setInterval(() => { pct = Math.min(pct + 4, 90); num.textContent = pct; bar.style.width = pct + '%'; }, 40);
  const wait = new Promise((r) => setTimeout(r, 900));
  try {
    const res = await fetch('data/portfolio.json');
    if (!res.ok) throw new Error(res.status);
    D = await res.json();
    render(); initSteps(); initDialog(); initUI();
  } catch (err) {
    console.error(err);
    $('main').innerHTML = `<p class="err">${'ไม่สามารถโหลดไฟล์ data/portfolio.json ได้ กรุณาเปิดเว็บไซต์ผ่าน Local Server เช่น Live Server ใน VS Code แล้วลองใหม่อีกครั้ง'}</p>`;
  }
  await wait; clearInterval(tick);
  num.textContent = 100; bar.style.width = '100%';
  setTimeout(() => { $('#loader').classList.add('done'); document.body.classList.add('ready'); }, 250);
}
init();
