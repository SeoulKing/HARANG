
'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const i18n = window.HarangI18n;
const t = key => i18n.t(key);
const menu = $('.menu-toggle');
function updateMenuLabel() { menu.setAttribute('aria-label', t(menu.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen')); }
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); $('#navigation').classList.remove('open'); updateMenuLabel(); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); $('#navigation').classList.toggle('open', open); updateMenuLabel(); });
$$('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
$('#year').textContent = new Date().getFullYear();

const dialog = $('#info-dialog');
let dialogKey = null;
function renderDialog() {
  if (!dialogKey) return;
  const privacy = dialogKey === 'privacy';
  const data = privacy ? i18n.content.privacy : i18n.content.services[dialogKey];
  $('#dialog-label').textContent = data.label; $('#dialog-title').textContent = data.title;
  $('#dialog-content').innerHTML = data.body; $('#dialog-contact').hidden = privacy;
}
function showDialog(key) { dialogKey = key; renderDialog(); dialog.showModal(); }
$$('[data-service]').forEach(button => button.addEventListener('click', () => showDialog(button.dataset.service)));
$('#privacy-open').addEventListener('click', () => showDialog('privacy'));
$('#dialog-close').addEventListener('click', () => dialog.close());
$('#dialog-contact').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { dialogKey = null; });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});

let selected = 'proposal', running = false, generation = 0, demoStage = -1;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function output(label, status, title, body, facts, warning) {
  $('#output-label').textContent = label; $('#output-status').textContent = status;
  const root = $('#output-content'); root.replaceChildren();
  const heading = document.createElement('strong'); heading.textContent = title; root.append(heading);
  const paragraph = document.createElement('p'); paragraph.textContent = body; root.append(paragraph);
  if (facts) {
    const group = document.createElement('div'); group.className = 'output-facts';
    facts.forEach(fact => { const span = document.createElement('span'); span.textContent = fact; group.append(span); }); root.append(group);
  }
  if (warning) { const note = document.createElement('div'); note.className = 'output-warning'; note.textContent = warning; root.append(note); }
}
function setStep(step) { $$('[data-step]').forEach((element,index) => { element.classList.toggle('active',index === step); element.classList.toggle('complete',index < step); }); }
function renderDemo() {
  const data = i18n.content.scenarios[selected];
  $('#demo-title').textContent = data.title; $('#demo-subtitle').textContent = data.subtitle;
  $('#demo-panel').setAttribute('aria-labelledby','tab-' + selected);
  $$('[data-scenario]').forEach(tab => { const active = tab.dataset.scenario === selected; tab.setAttribute('aria-selected',String(active)); tab.tabIndex = active ? 0 : -1; });
  setStep(demoStage);
  $('#run-demo').hidden = demoStage >= 3; $('#run-demo').disabled = running;
  $('#run-demo').replaceChildren(document.createTextNode(t(running ? 'running' : 'run')));
  if (!running) { const play = document.createElement('span'); play.setAttribute('aria-hidden','true'); play.textContent = '▶'; $('#run-demo').append(document.createTextNode(' '),play); }
  $('#approve-demo').hidden = demoStage !== 3; $('#reset-demo').hidden = demoStage < 0;
  switch (demoStage) {
    case 0: output('INPUT DOCUMENT',t('running'),data.inputTitle,data.input); $('#demo-hint').textContent = t('readHint'); break;
    case 1: output('STRUCTURED REQUIREMENTS',t('structured'),t('structuredTitle'),t('structuredBody'),data.facts); $('#demo-hint').textContent = t('structureHint'); break;
    case 2:
    case 3: output('REVIEW & VALIDATION',t(demoStage === 3 ? 'pending' : 'issues'),data.draftTitle,data.draft,null,data.warning); $('#demo-hint').textContent = t(demoStage === 3 ? 'approvalHint' : 'reviewHint'); break;
    case 4: output('APPROVAL LOG',t('approved'),t('approvedTitle'),data.approved,t('approvedFacts')); $('#demo-hint').textContent = t('completeHint'); break;
    default: output('INPUT DOCUMENT',t('ready'),data.inputTitle,data.input); $('#demo-hint').textContent = t('initialHint');
  }
}
function resetDemo() { generation++; running = false; demoStage = -1; renderDemo(); }
$$('[data-scenario]').forEach(tab => {
  tab.addEventListener('click', () => { selected = tab.dataset.scenario; resetDemo(); });
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$('[data-scenario]'), index = tabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].click(); tabs[next].focus();
  });
});
$('#run-demo').addEventListener('click', async () => {
  if (running) return;
  running = true; const runId = ++generation; demoStage = 0; renderDemo();
  for (const [stage,duration] of [[1,650],[2,1000],[3,800]]) {
    await delay(duration); if (runId !== generation) return;
    demoStage = stage; if (stage === 3) running = false; renderDemo();
  }
});
$('#approve-demo').addEventListener('click', () => { if (demoStage !== 3) return; demoStage = 4; renderDemo(); $('#reset-demo').focus(); });
$('#reset-demo').addEventListener('click', () => { resetDemo(); $('#run-demo').focus(); });

let toastTimer, toastKey = null;
function toast(key) {
  toastKey = key; $('#toast').textContent = t(key); $('#toast').hidden = false; clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').hidden = true; toastKey = null; },3500);
}
$('#copy-email').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('contact@harang.xyz'); toast('copySuccess'); } catch { toast('copyFailed'); }
});
function updateEmailLinks() {
  const compose = new URL('https://mail.google.com/mail/');
  compose.searchParams.set('view', 'cm');
  compose.searchParams.set('fs', '1');
  compose.searchParams.set('to', 'contact@harang.xyz');
  compose.searchParams.set('su', t('emailSubject'));
  $('#email-gmail').href = compose.href;
  $('#email-app').href = 'mailto:contact@harang.xyz?subject=' + encodeURIComponent(t('emailSubject'));
}
window.addEventListener('harang:languagechange', () => {
  updateMenuLabel(); renderDemo(); if (dialog.open) renderDialog();
  if (toastKey) $('#toast').textContent = t(toastKey);
  updateEmailLinks();
});
updateMenuLabel(); renderDemo(); updateEmailLinks();



// A lightweight, code-drawn torus represents connected workflows. No image assets needed.
const canvas = $('#orbit');
const context = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let width = 0, height = 0, frame = 0, lastFrame = 0, orbitVisible = true;
function resizeOrbit() { const rect = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2); width = rect.width; height = rect.height; canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); context.setTransform(dpr, 0, 0, dpr, 0, 0); if (reducedMotion.matches) drawOrbit(0); }
function drawOrbit(time) {
  context.clearRect(0, 0, width, height);
  const scale = Math.min(width * .32, height * .37), rotation = time * .000045;
  const angle = -.5 + Math.sin(rotation) * .08, tilt = 1.08;
  const points = [];
  for (let ring = 0; ring < 48; ring++) {
    const v = ring / 48 * Math.PI * 2;
    for (let point = 0; point < 155; point++) {
      const u = point / 155 * Math.PI * 2 + rotation;
      const radius = 1 + .43 * Math.cos(v);
      let x = radius * Math.cos(u), y = radius * Math.sin(u), z = .43 * Math.sin(v);
      const ry = y * Math.cos(tilt) - z * Math.sin(tilt), rz = y * Math.sin(tilt) + z * Math.cos(tilt);
      const rx = x * Math.cos(angle) - ry * Math.sin(angle), yy = x * Math.sin(angle) + ry * Math.cos(angle);
      const perspective = 3.8 / (3.8 + rz);
      points.push({ x: width * .52 + rx * scale * perspective, y: height * .49 + yy * scale * perspective, z: rz, glow: Math.cos(v + u * .6) });
    }
  }
  points.sort((a,b) => b.z - a.z);
  for (const point of points) {
    const alpha = Math.max(.12, .72 - point.z * .35);
    context.fillStyle = point.glow > .6 ? `rgba(221,255,172,${alpha})` : `rgba(164,213,89,${alpha * .8})`;
    const size = Math.max(.5, 1.1 - point.z * .25) * Math.min(1, width / 500);
    context.fillRect(point.x, point.y, size, size);
  }
}
function animate(time) { if (orbitVisible && !document.hidden && time - lastFrame > 45) { drawOrbit(time); lastFrame = time; } frame = requestAnimationFrame(animate); }
new ResizeObserver(resizeOrbit).observe(canvas);
new IntersectionObserver(entries => { orbitVisible = entries[0].isIntersecting; }).observe(canvas);
reducedMotion.addEventListener('change', () => { cancelAnimationFrame(frame); if (reducedMotion.matches) drawOrbit(0); else frame = requestAnimationFrame(animate); });
resizeOrbit(); if (!reducedMotion.matches) frame = requestAnimationFrame(animate);
