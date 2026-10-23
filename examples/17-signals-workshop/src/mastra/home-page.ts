// HTML for demo 3: the home dashboard the user clicks in. It polls the house every 700 ms, so changes the
// agent makes with its tools show up live.
export function homePage(thread: string) {
  const T = JSON.stringify(thread).replace(/</g, "\\u003c");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Home</title>
<style>
  :root{--bg:#f6f7f9;--card:#fff;--line:#e6e8ee;--muted:#6b7385;--ink:#151922;--on:#f5b301;--ok:#1f9d55;--bad:#d64545}
  *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.4 ui-sans-serif,system-ui,sans-serif;padding:18px}
  h1{font-size:20px;margin:0 0 12px} h1 small{font-size:12px;color:var(--muted);font-weight:400;margin-left:8px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:12px}
  h2{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
  .tile{border:1px solid var(--line);border-radius:10px;padding:6px 10px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#fafbfc;transition:background .3s}
  .tile.on{background:#fff7d6;border-color:#f3d36b} .bulb{font-size:20px;filter:grayscale(1);opacity:.5} .on .bulb{filter:none;opacity:1}
  .row{display:flex;justify-content:space-between;align-items:center;padding:6px 0}
  button{font:inherit;border:1px solid var(--line);background:#fff;border-radius:8px;padding:5px 12px;cursor:pointer}
  .temp{font-size:26px;font-variant-numeric:tabular-nums;min-width:72px;text-align:center}
  .locked{color:var(--ok)} .unlocked{color:var(--bad)}
  .mode button.sel{background:var(--ink);color:#fff;border-color:var(--ink)}
  .events{background:#1b1f2a;color:#e8ebf2;border:none} .events h2{color:#9aa3b5}
  .events button{background:#2a3040;color:#fff;border-color:#3a4256;margin:0 6px 6px 0}
  .events button.smoke{background:#7a1f1f;border-color:#a33}
  .log{font-size:12px;color:#9aa3b5;min-height:16px;margin-top:4px}
  .act{font-size:12.5px;color:var(--muted);margin:0;padding:0;list-style:none} .act li{padding:2px 0}
  .act b{color:var(--ink);font-weight:600}
  .cam{background:#0d1117;color:#c9f7d4;border-color:#0d1117} .cam h2{color:#7ee2a0} .camtext{font:13px/1.45 ui-monospace,Menlo,monospace}
  .alarm{position:sticky;top:0;z-index:5;background:#d01f1f;color:#fff;font-weight:800;text-align:center;padding:8px;border-radius:10px;margin-bottom:10px;letter-spacing:.2em;animation:al .6s steps(2) infinite}
  @keyframes al{50%{background:#5a0b0b}}
  .policebar{background:#1d3a8a;color:#fff;padding:8px 12px;border-radius:10px;margin-bottom:10px;font-size:13px}
  .phone{background:#fff;border:2px solid #1d3a8a;border-radius:12px;padding:8px 12px;margin-bottom:10px;font-size:13px} .phone.ring{animation:rg .5s ease-in-out infinite alternate} @keyframes rg{to{border-color:#7c9cff;box-shadow:0 0 0 4px #c7d4ff}}
  .phone p{margin:3px 0} .phone b{color:#1d3a8a}
  .say{margin-top:8px;background:#fff;color:#151922;border-radius:12px;padding:6px 10px;font:13px ui-sans-serif,system-ui;position:relative} .say:before{content:'🔊 ';}
  .flash{animation:fl 1.2s} @keyframes fl{from{box-shadow:0 0 0 3px #7c5cff}to{box-shadow:0 0 0 0 transparent}}
</style></head><body>
<div id="alarm" class="alarm" hidden>🚨 ALARM 🚨</div><div id="police" class="policebar" hidden></div><div id="phone" class="phone" hidden></div>
<h1>🏠 Home <small>shared with the home agent →</small></h1>
<div class="card cam"><h2>Camera <span id="camname" style="text-transform:none;letter-spacing:0"></span></h2><div id="cam" class="camtext">no camera checked yet</div><div id="say" class="say" hidden></div></div>
<div class="card"><h2>Lights</h2><div class="grid" id="lights"></div></div>
<div class="card"><div class="row"><h2 style="margin:0">Thermostat</h2><span><button id="tdown">−</button> <span class="temp" id="temp"></span> <button id="tup">+</button></span></div></div>
<div class="card"><h2>Doors</h2><div id="doors"></div>
  <div class="row mode"><span>Mode</span><span><button data-mode="home">Home</button> <button data-mode="away">Away</button></span></div></div>
<div class="card events"><h2>Device events (each one notifies the agent)</h2>
  <button data-ev="doorbell">🔔 Doorbell</button><button data-ev="smoke" class="smoke">🔥 Smoke alarm</button>
  <div class="log" id="log"></div></div>
<div class="card"><h2>Activity</h2><ul class="act" id="act"></ul></div>
<script>
const thread = ${T};
const esc = s => String(s).replace(/[&<>"']/g, ch => '&#' + ch.charCodeAt(0) + ';');
const post = (p, b = {}) => fetch('/demo/home/' + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ threadId: thread, ...b }) }).then(r => r.json());
let last = '';
function render(v) {
  const h = v.house, key = JSON.stringify(h);
  if (key === last) return; const first = !last; last = key;
  const L = document.getElementById('lights');
  L.innerHTML = Object.entries(h.lights).map(([r, p]) => '<div class="tile ' + (p ? 'on' : '') + '" data-room="' + esc(r) + '"><span>' + esc(r) + '<br><small style="color:#6b7385">' + (p ? 'on ' + p + '%' : 'off') + '</small></span><span class="bulb">💡</span></div>').join('');
  document.getElementById('temp').textContent = h.thermostat + '°C';
  document.getElementById('doors').innerHTML = Object.entries(h.locks).map(([d, l]) => '<div class="row"><span>' + esc(d) + '</span><span><b class="' + (l ? 'locked' : 'unlocked') + '">' + (l ? '🔒 locked' : '🔓 unlocked') + '</b> <button data-door="' + esc(d) + '">' + (l ? 'Unlock' : 'Lock') + '</button></span></div>').join('');
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('sel', b.dataset.mode === h.mode));
  const v0 = h.views && h.views[0];
  document.getElementById('camname').textContent = v0 ? '· 📷 ' + v0.camera + ' (' + h.views.length + ' views)' : '';
  document.getElementById('cam').textContent = v0 ? v0.text : 'no camera checked yet';
  document.getElementById('alarm').hidden = !h.alarm;
  const pb = document.getElementById('police'); pb.hidden = !h.monitoring; pb.textContent = h.monitoring ? '🛡️ Monitoring: ' + h.monitoring : '';
  const ph = document.getElementById('phone'); ph.hidden = !h.phone.lines.length; ph.classList.toggle('ring', h.phone.ringing);
  ph.innerHTML = (h.phone.ringing ? '<p>📞 <b>ringing…</b></p>' : '<p>📞 <b>call</b></p>') + h.phone.lines.map(l => '<p><b>' + (l.who === 'agent' ? '🤖 agent' : '🛡️ Brightguard') + ':</b> ' + l.text.replace(/</g, '&lt;') + '</p>').join('');
  const s0 = h.intercom && h.intercom[0], sb = document.getElementById('say'); sb.hidden = !s0; sb.textContent = s0 ? s0.camera + ' intercom: "' + s0.message + '"' : '';
  document.getElementById('act').innerHTML = h.activity.map(a => '<li>' + (a.by === 'agent' ? '🤖 <b>agent</b>: ' : a.by === 'device' ? '📟 ' : '👆 you: ') + a.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</li>').join('');
  if (!first && h.activity[0] && h.activity[0].by === 'agent') document.querySelectorAll('.card').forEach(c => { c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); });
}
document.body.addEventListener('click', async e => {
  const t = e.target.closest('[data-room],[data-door],[data-mode],[data-ev],#tup,#tdown'); if (!t) return;
  let v;
  if (t.dataset.room) v = await post('light', { room: t.dataset.room });
  else if (t.dataset.door) v = await post('lock', { door: t.dataset.door });
  else if (t.dataset.mode) v = await post('mode', { mode: t.dataset.mode });
  else if (t.id === 'tup' || t.id === 'tdown') v = await post('thermostat', { by: t.id === 'tup' ? 1 : -1 });
  else if (t.dataset.ev) { document.getElementById('log').textContent = '…'; v = await post(t.dataset.ev); }
  if (v && v.notification) document.getElementById('log').textContent = v.notification.log;
  if (v && v.house) render(v);
});
const tick = () => post('view').then(render).catch(() => {});
tick(); setInterval(tick, 700);
</script></body></html>`;
}
