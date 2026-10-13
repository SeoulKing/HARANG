'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const menu = $('.menu-toggle');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '메뉴 열기'); $('#navigation').classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); $('#navigation').classList.toggle('open', open); });
$$('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
$('#year').textContent = new Date().getFullYear();

const services = {
  discover: { label: '01 / DISCOVER', title: '업무 진단 & AX 전략', body: '<p>기술을 고르기 전에, 실제로 바꿀 가치가 있는 업무를 찾습니다.</p><ul><li>반복 업무와 병목을 확인하는 업무 인터뷰</li><li>입력 자료, 산출물, 사용 도구와 접근 권한 분석</li><li>자동화 후보의 우선순위와 위험도 정리</li><li>사람이 맡을 판단과 AI에 맡길 작업 구분</li></ul><p>산출물: 업무 현황과 도입 우선순위, 파일럿 제안 범위.</p>' },
  build: { label: '02 / BUILD', title: 'AI 워크플로 설계 & 구축', body: '<p>하나의 업무를 대상으로 작동하는 파일럿을 설계합니다.</p><ul><li>요청서·이메일·문서의 요구사항 구조화</li><li>정해진 형식에 맞춘 문서 초안 작성</li><li>기존 도구의 연동 가능 여부와 실행 권한 검토</li><li>담당자의 검토와 승인이 포함된 프로토타입</li></ul><p>산출물: 합의한 범위의 프로토타입, 테스트 결과와 사용 안내. 실제 연동 범위는 진단 후 확정합니다.</p>' },
  validate: { label: '03 / VALIDATE', title: 'AI 안전성 검증 & 개선', body: '<p>AI가 의도한 작업을 정해진 권한 안에서 수행하는지 확인합니다.</p><ul><li>누락, 근거 없는 내용과 모순 점검</li><li>도구 호출과 권한 초과 가능성 확인</li><li>민감한 자료의 접근·전송 범위 검토</li><li>승인 없는 실행 차단과 처리 기록 설계</li></ul><p>산출물: 테스트 결과, 발견된 위험과 개선 제안. 검증 대상과 기준은 고객 업무에 맞춰 협의합니다.</p>' }
};
const dialog = $('#info-dialog');
function showDialog(data, contact = true) { $('#dialog-label').textContent = data.label; $('#dialog-title').textContent = data.title; $('#dialog-content').innerHTML = data.body; $('#dialog-contact').hidden = !contact; dialog.showModal(); }
$$('[data-service]').forEach(button => button.addEventListener('click', () => showDialog(services[button.dataset.service])));
$('#dialog-close').addEventListener('click', () => dialog.close());
$('#dialog-contact').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
$('#privacy-open').addEventListener('click', () => showDialog({ label: 'INFORMATION', title: '정보 처리 안내', body: '<p>이 홈페이지의 데모는 미리 준비된 가상 자료를 사용하며, 실제 AI 서비스를 호출하거나 외부 시스템에 데이터를 보내지 않습니다.</p><p>문의 양식에 작성한 내용은 홈페이지 서버에 저장되지 않습니다. 문의 버튼을 누르면 사용 중인 이메일 앱으로 이름, 회사, 회신 주소와 문의 내용을 전달하며, 실제 발송은 이메일 앱에서 직접 진행합니다.</p><p>이 홈페이지는 문의 내용이나 데모 입력을 저장하는 데이터베이스, 방문 분석 도구 또는 추적용 쿠키를 사용하지 않습니다. 웹 호스팅 서비스에서는 서비스 운영을 위해 접속 기록을 처리할 수 있으며, 웹폰트를 불러올 때는 폰트 제공 서버에 네트워크 요청이 발생합니다.</p><p>문의: <a href="mailto:contact@harang.xyz">contact@harang.xyz</a></p>' }, false));

const scenarios = {
  proposal: { title: '고객 요청서에서 제안서 초안까지', subtitle: 'BRIEF → PROPOSAL', inputTitle: '브랜드 캠페인 제안 요청', input: '신규 브랜드의 콘텐츠 캠페인을 준비하고 있습니다. 4주 일정으로 SNS 콘텐츠 기획과 제작 제안을 부탁드립니다. 예산은 협의 예정입니다.', facts: ['목적: 신규 브랜드 캠페인', '일정: 4주', '범위: SNS 기획·제작'], draftTitle: '제안서 초안 · 브랜드 콘텐츠 캠페인', draft: '1주차: 브랜드·타깃 분석 → 2주차: 콘텐츠 기획 → 3주차: 제작·검토 → 4주차: 게시 준비. 세부 산출물은 협의 후 확정합니다.', warning: '확인 필요: 예산과 콘텐츠 수량이 정해지지 않았습니다. 담당자 검토 후 확정해 주세요.', approved: '제안서 초안의 검토·승인이 기록되었습니다. 실제 이메일 발송은 진행되지 않습니다.' },
  meeting: { title: '회의 메모에서 실행할 일까지', subtitle: 'NOTES → ACTION ITEMS', inputTitle: '콘텐츠 팀 주간 회의 메모', input: '다음 주 캠페인 초안이 필요합니다. 민지는 카피를, 준호는 디자인을 준비합니다. 초안 검토 회의 일정은 아직 정하지 않았습니다.', facts: ['민지: 카피 초안', '준호: 디자인 초안', '목표: 다음 주 캠페인'], draftTitle: '회의 요약 · 캠페인 준비', draft: '담당자별 할 일을 정리했습니다. 민지 — 캠페인 카피 작성. 준호 — 콘텐츠 디자인 준비. 다음 단계 — 초안 검토 회의 일정 조율.', warning: '확인 필요: 정확한 마감일과 검토 회의 일정이 없습니다. 담당자가 정한 뒤 공유해 주세요.', approved: '회의 요약의 검토·승인이 기록되었습니다. 실제 일정 등록이나 알림 발송은 진행되지 않습니다.' },
  support: { title: '고객 문의에서 답변 초안까지', subtitle: 'INQUIRY → RESPONSE', inputTitle: '서비스 연동 관련 고객 문의', input: '현재 사용 중인 문서 관리 도구와 연결할 수 있을까요? 팀원은 15명이고, 고객 문서에 개인정보가 포함되어 있습니다. 도입 절차가 궁금합니다.', facts: ['유형: 서비스 연동 문의', '규모: 15명 팀', '주의: 개인정보 포함'], draftTitle: '답변 초안 · 도입 상담 안내', draft: '사용 중인 도구와 연동 범위를 먼저 확인하겠습니다. 초기 진단은 가상 자료로 진행하고, 실제 개인정보의 접근·전송 범위는 별도로 협의합니다.', warning: '확인 필요: 도구명과 API 제공 범위가 확인되지 않았습니다. 연동 가능 여부를 단정하지 마세요.', approved: '답변 초안의 검토·승인이 기록되었습니다. 실제 고객에게 발송되지 않습니다.' }
};
let selected = 'proposal';
let running = false;
let generation = 0;
let awaitingApproval = false;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function output(label, status, title, body, facts, warning) {
  $('#output-label').textContent = label; $('#output-status').textContent = status;
  const root = $('#output-content'); root.replaceChildren();
  const heading = document.createElement('strong'); heading.textContent = title; root.append(heading);
  const paragraph = document.createElement('p'); paragraph.textContent = body; root.append(paragraph);
  if (facts) { const group = document.createElement('div'); group.className = 'output-facts'; facts.forEach(fact => { const span = document.createElement('span'); span.textContent = fact; group.append(span); }); root.append(group); }
  if (warning) { const note = document.createElement('div'); note.className = 'output-warning'; note.textContent = warning; root.append(note); }
}
function setStep(step) { $$('[data-step]').forEach((el, i) => { el.classList.toggle('active', i === step); el.classList.toggle('complete', i < step); }); }
function resetDemo() {
  generation++; running = false; awaitingApproval = false; const data = scenarios[selected];
  $('#demo-title').textContent = data.title; $('#demo-subtitle').textContent = data.subtitle;
  $('#demo-panel').setAttribute('aria-labelledby', `tab-${selected}`);
  $$('[data-scenario]').forEach(tab => { const active = tab.dataset.scenario === selected; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  output('INPUT DOCUMENT', '실행 준비', data.inputTitle, data.input);
  setStep(-1); $('#run-demo').hidden = false; $('#run-demo').disabled = false; $('#run-demo').innerHTML = '데모 실행 <span aria-hidden="true">▶</span>';
  $('#approve-demo').hidden = true; $('#reset-demo').hidden = true; $('#demo-hint').textContent = '실행 버튼을 눌러 업무 흐름을 체험해 보세요.';
}
$$('[data-scenario]').forEach(tab => {
  tab.addEventListener('click', () => { selected = tab.dataset.scenario; resetDemo(); });
  tab.addEventListener('keydown', event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const tabs = $$('[data-scenario]'); const index = tabs.indexOf(tab); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; tabs[next].click(); tabs[next].focus(); });
});
$('#run-demo').addEventListener('click', async () => {
  if (running) return; running = true; const runId = ++generation; const data = scenarios[selected];
  $('#run-demo').disabled = true; $('#run-demo').textContent = '흐름 실행 중…'; $('#reset-demo').hidden = false; setStep(0);
  $('#demo-hint').textContent = '가상 요청서를 읽고 있습니다.';
  await delay(650); if (runId !== generation) return;
  setStep(1); output('STRUCTURED REQUIREMENTS', '요구사항 정리 완료', '요청의 핵심 정보를 정리했습니다.', '입력 자료에 있는 정보만 정리합니다. 확인되지 않은 조건은 담당자에게 남깁니다.', data.facts);
  $('#demo-hint').textContent = '요구사항을 정리하고 초안을 작성합니다.';
  await delay(1000); if (runId !== generation) return;
  setStep(2); output('REVIEW & VALIDATION', '확인할 항목 발견', data.draftTitle, data.draft, null, data.warning);
  $('#demo-hint').textContent = '누락된 조건을 표시하고 담당자의 검토를 기다립니다.';
  await delay(800); if (runId !== generation) return;
  setStep(3); $('#output-status').textContent = '사람의 승인 대기'; $('#run-demo').hidden = true; $('#approve-demo').hidden = false;
  $('#demo-hint').textContent = '초안과 확인 항목을 살펴본 후 승인해 주세요.'; running = false; awaitingApproval = true;
});
$('#approve-demo').addEventListener('click', () => { if (!awaitingApproval) return; awaitingApproval = false; $$('[data-step]').forEach(el => { el.classList.remove('active'); el.classList.add('complete'); }); const data = scenarios[selected]; output('APPROVAL LOG', '데모 승인 완료', '담당자의 승인이 기록되었습니다.', data.approved, ['검토: 완료', '승인: 완료', '외부 실행: 없음']); $('#approve-demo').hidden = true; $('#demo-hint').textContent = '흐름이 완료되었습니다. 다른 시나리오도 체험해 보세요.'; $('#reset-demo').focus(); });
$('#reset-demo').addEventListener('click', () => { resetDemo(); $('#run-demo').focus(); });

let toastTimer;
function toast(text) { $('#toast').textContent = text; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 3500); }
$('#copy-email').addEventListener('click', async () => { try { await navigator.clipboard.writeText('contact@harang.xyz'); toast('이메일 주소를 복사했습니다.'); } catch { toast('contact@harang.xyz — 주소를 직접 복사해 주세요.'); } });
$('#contact-form').addEventListener('submit', event => {
  event.preventDefault(); const fields = new FormData(event.currentTarget);
  const body = `이름: ${fields.get('name')}\n회사 / 팀: ${fields.get('company') || '미입력'}\n회신 이메일: ${fields.get('email')}\n\n문의 내용:\n${fields.get('message')}`;
  const subject = `[HARANG 프로젝트 문의] ${fields.get('company') || fields.get('name')}`;
  const emailLink = document.createElement('a'); emailLink.href = `mailto:contact@harang.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; emailLink.click();
  $('#form-status').hidden = false; $('#form-status').textContent = '이메일 앱에서 내용을 확인하고 발송해 주세요. 앱이 열리지 않으면 contact@harang.xyz로 직접 문의해 주세요.';
});

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
