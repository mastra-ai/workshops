// HTML for demo 2: the Corner Market shop the user clicks in (products, cart, checkout, a store-events panel at the bottom that fires notifications), and the split page (shop left, Studio thread right).
// Both are served by the demo's Mastra server, same origin as Studio, so Studio loads in an iframe.

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

export function splitPage({
  title,
  left,
  right,
  columns = "minmax(380px,38%) 1fr",
}: {
  title: string;
  left: string;
  right: string;
  columns?: string;
}) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
  html,body{margin:0;height:100%;background:#0f1115;font-family:ui-sans-serif,system-ui,sans-serif}
  .split{display:grid;grid-template-columns:${columns};height:100vh;gap:0}
  iframe{width:100%;height:100%;border:0;display:block;background:#fff}
  .left{border-right:1px solid #2a2f3a}
</style></head><body>
<div class="split"><iframe class="left" src="${esc(left)}" title="left"></iframe><iframe src="${esc(right)}" title="right"></iframe></div>
</body></html>`;
}

export function shopPage(threadId: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Corner Market</title>
<style>
  :root{--ink:#1d2330;--muted:#6b7385;--line:#e7e9ef;--accent:#2f6df6;--good:#12805c}
  *{box-sizing:border-box}
  body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:#f6f7fb}
  header{padding:18px 22px 10px;display:flex;align-items:baseline;gap:10px}
  header h1{margin:0;font-size:20px}
  header span{color:var(--muted);font-size:13px}
  main{padding:0 22px 22px;display:grid;gap:16px}
  section{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 16px}
  h2{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}
  .p{display:flex;align-items:center;gap:12px;padding:8px 0;border-top:1px solid var(--line)}
  .p:first-of-type{border-top:0}
  .emoji{font-size:24px;width:32px;text-align:center}
  .name{flex:1;font-weight:600}
  .price{color:var(--muted);font-variant-numeric:tabular-nums;width:64px;text-align:right}
  button{font:inherit;border-radius:9px;border:1px solid var(--line);background:#fff;cursor:pointer;padding:6px 12px}
  button:hover{border-color:#c9cdd8}
  button.add{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:600}
  .qty{display:flex;align-items:center;gap:6px}
  .qty b{width:22px;text-align:center;font-variant-numeric:tabular-nums}
  .qty button{padding:2px 9px}
  .x{color:#a33;border-color:transparent;background:transparent}
  .empty{color:var(--muted);padding:6px 0}
  .totals{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line);display:grid;gap:6px}
  .row{display:flex;justify-content:space-between;font-variant-numeric:tabular-nums}
  .sub{font-weight:700;font-size:17px}
  .flash{animation:flash .6s}
  @keyframes flash{from{background:#eef3ff}to{background:#fff}}
  .was{text-decoration:line-through;color:#a0a6b4;font-size:12px;margin-right:4px}
  .sale{color:#c2410c;font-weight:700}
  .tag{font-size:11px;font-weight:700;color:#fff;background:#c2410c;border-radius:6px;padding:1px 6px;margin-left:6px}
  .status{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}
  .pill{font-size:12px;font-weight:700;border-radius:99px;padding:3px 10px;background:#eef3ff;color:var(--accent)}
  .pill.ordered{background:#e7f6ef;color:var(--good)}
  button.go{background:var(--good);border-color:var(--good);color:#fff;font-weight:600}
  button:disabled{opacity:.45;cursor:default}
  .admin{background:#1d2330;color:#e7e9ef;border-color:#1d2330}
  .admin h2{color:#9aa3b5}
  .admin .btns{display:flex;flex-wrap:wrap;gap:8px}
  .admin button{background:#2b3343;color:#fff;border-color:#3a4356}
  .admin .log{margin-top:8px;font-size:12px;color:#9aa3b5;min-height:16px}
</style></head><body>
<header><h1>🛒 Corner Market</h1><span>your cart is shared with the shopper →</span></header>
<main>
  <section><h2>Products</h2><div id="products"></div></section>
  <section id="cartbox"><h2>Cart</h2><div id="cart"></div>
    <div class="totals"><div class="row sub"><span>Subtotal</span><span id="subtotal"></span></div>
      <div class="status"><span class="pill" id="status"></span><span><button id="checkout" class="go">Checkout</button><button id="order" class="go">Place order</button></span></div>
</div></section>
  <section class="admin"><h2>Store events (each one notifies the shopper)</h2><div class="btns">
    <button data-ev="sale">Put oat milk on sale</button><button data-ev="pack">Pack</button><button data-ev="ship">Ship</button><button data-ev="delay">Delay delivery</button>
  </div><div class="log" id="log"></div></section>
</main>
<script>
const thread = ${JSON.stringify(threadId).replace(/</g, "\\u003c")};
const money = n => '$' + n.toFixed(2);
let last = '';
async function call(path, body) {
  const res = await fetch(path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ threadId: thread, ...body }) } : undefined);
  const v = await res.json();
  render(v);
  if (v.notification) document.getElementById('log').textContent = v.log || ('→ ' + v.notification.priority + ': ' + (v.notification.decision === 'deliver' ? 'delivered now, wakes the agent' : v.notification.decision) + (v.notification.coalescedCount > 1 ? ' (merged ×' + v.notification.coalescedCount + ')' : ''));
}
function render(v) {
  const browsing = v.status === 'browsing';
  const editable = browsing || v.status === 'checking out';
  const key = JSON.stringify([v.lines, v.status]);
  document.getElementById('products').innerHTML = v.products.map(p =>
    '<div class="p"><span class="emoji">' + p.emoji + '</span><span class="name">' + p.name + (p.was ? '<span class="tag">SALE</span>' : '') + '</span><span class="price">' +
    (p.was ? '<span class="was">' + money(p.was) + '</span><span class="sale">' + money(p.price) + '</span>' : money(p.price)) +
    '</span><button class="add" data-add="' + p.sku + '"' + (editable ? '' : ' disabled') + '>Add</button></div>').join('');
  document.getElementById('cart').innerHTML = v.lines.length ? v.lines.map(l =>
    '<div class="p" data-line="' + l.sku + '"><span class="emoji">' + l.emoji + '</span><span class="name">' + l.name + '</span>' +
    '<span class="qty"><button data-dec="' + l.sku + '" aria-label="one less">−</button><b>' + l.qty + '</b><button data-inc="' + l.sku + '" aria-label="one more">+</button></span>' +
    '<span class="price' + (l.onSale ? ' sale' : '') + '">' + money(l.total) + '</span><button class="x" data-rm="' + l.sku + '" aria-label="remove">✕</button></div>').join('')
    : '<div class="empty">Your cart is empty.</div>';
  document.getElementById('subtotal').textContent = money(v.subtotal);
  const st = document.getElementById('status');
  st.textContent = v.status === 'ordered' ? 'ordered · #' + v.orderId + (v.stage ? ' · ' + v.stage : '') : v.status;
  st.className = 'pill' + (v.status === 'ordered' ? ' ordered' : '');
  document.getElementById('checkout').style.display = browsing ? '' : 'none';
  document.getElementById('checkout').disabled = !v.lines.length;
  document.getElementById('order').style.display = v.status === 'checking out' ? '' : 'none';
  document.querySelectorAll('#cart button').forEach(b => (b.disabled = !editable));
  document.querySelectorAll('[data-ev=pack],[data-ev=ship],[data-ev=delay]').forEach(b => (b.disabled = v.status !== 'ordered'));
  if (last && key !== last) { const b = document.getElementById('cartbox'); b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); }
  last = key;
}
document.addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.add) call('/demo/cart/change', { sku: t.dataset.add, by: 1 });
  if (t.dataset.inc) call('/demo/cart/change', { sku: t.dataset.inc, by: 1 });
  if (t.dataset.dec) call('/demo/cart/change', { sku: t.dataset.dec, by: -1 });
  if (t.dataset.rm) call('/demo/cart/remove', { sku: t.dataset.rm });
  if (t.id === 'checkout') call('/demo/shop/checkout', {});
  if (t.id === 'order') call('/demo/shop/order', {});
  if (t.dataset.ev) call('/demo/shop/' + t.dataset.ev, {});
});
// The page always renders the server's cart, so it also follows changes made from the terminal (--auto).
call('/demo/cart/state', {});
setInterval(() => call('/demo/cart/state', {}), 1500);
</script></body></html>`;
}
