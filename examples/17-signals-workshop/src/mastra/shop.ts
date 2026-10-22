// Demo 2: the Corner Market shop. The user clicks in a web page (left); the shopper agent (right) is kept
// up to date two ways:
//   - State: ShopLane runs before each model step and emits the shop lane (cart lines with current prices,
//     plus the shopping status). A snapshot when the context window has none, a delta with only what changed
//     since the model last looked, nothing when unchanged.
//   - Notifications: shop events (sale, order, packed/shipped, delay) go through sendNotificationSignal
//     from the server routes in index.ts.
import type {
  ComputeStateSignalArgs,
  ComputeStateSignalResult,
} from "@mastra/core/processors";

export const products = [
  { sku: "oat-milk", name: "Oat milk", price: 4.5, emoji: "🥛" },
  { sku: "coffee", name: "Coffee beans", price: 16, emoji: "☕" },
  { sku: "sourdough", name: "Sourdough loaf", price: 7, emoji: "🍞" },
  { sku: "avocados", name: "Avocados (3)", price: 5, emoji: "🥑" },
  { sku: "bananas", name: "Bananas", price: 2.5, emoji: "🍌" },
  { sku: "candy", name: "Candy", price: 3, emoji: "🍬" },
];
const bySku = new Map(products.map((p) => [p.sku, p]));
export const money = (n: number) => `$${n.toFixed(2)}`;
const name = (sku: string) => bySku.get(sku)?.name ?? sku;

export type Status = "browsing" | "checking out" | "ordered";
export const ORDER_ID = 1042;
type Line = { qty: number; price: number };
// What the model sees: the value carried by snapshots and deltas.
export type ShopValue = { status: Status; items: Record<string, Line> };
type ItemChange = { sku: string; from?: Line; to?: Line };
type ShopDelta = { items: ItemChange[]; status?: { from: Status; to: Status } };

type Shop = {
  qty: Record<string, number>;
  sale: Record<string, number>;
  status: Status;
  stage?: string;
};

const itemLine = ({ sku, from, to }: ItemChange) => {
  if (!to) return `− ${name(sku)}`;
  const each = `${money(to.price)} each`;
  if (!from) return `+ ${to.qty}× ${name(sku)} (${each})`;
  const parts: string[] = [];
  if (to.qty !== from.qty)
    parts.push(
      to.qty > from.qty
        ? `+ ${to.qty - from.qty}× ${name(sku)} (now ${to.qty})`
        : `− ${from.qty - to.qty}× ${name(sku)} (now ${to.qty})`,
    );
  if (to.price !== from.price)
    parts.push(`${name(sku)} now ${each} (was ${money(from.price)})`);
  return parts.join("\n");
};

export class ShopLane {
  readonly id = "shop";
  private shops = new Map<string, Shop>();

  private shop(threadId: string): Shop {
    let s = this.shops.get(threadId);
    if (!s)
      this.shops.set(threadId, (s = { qty: {}, sale: {}, status: "browsing" }));
    return s;
  }
  price(threadId: string, sku: string) {
    return this.shop(threadId).sale[sku] ?? bySku.get(sku)!.price;
  }
  has(threadId: string, sku: string) {
    return (this.shop(threadId).qty[sku] ?? 0) > 0;
  }
  value(threadId: string): ShopValue {
    const s = this.shop(threadId);
    const items: Record<string, Line> = {};
    for (const [sku, qty] of Object.entries(s.qty))
      items[sku] = { qty, price: this.price(threadId, sku) };
    return { status: s.status, items };
  }

  // Page actions. Cart edits are allowed while browsing; editing during checkout goes back to browsing (no dead end).
  change(threadId: string, sku: string, by: number) {
    const s = this.shop(threadId);
    if (s.status === "checking out") s.status = "browsing";
    if (!bySku.has(sku) || s.status !== "browsing") return;
    const q = Math.max(0, (s.qty[sku] ?? 0) + by);
    if (q === 0) delete s.qty[sku];
    else s.qty[sku] = q;
  }
  remove(threadId: string, sku: string) {
    const s = this.shop(threadId);
    if (s.status === "checking out") s.status = "browsing";
    if (s.status === "browsing") delete s.qty[sku];
  }
  putOnSale(threadId: string, sku: string, pct: number) {
    const base = bySku.get(sku)!.price;
    this.shop(threadId).sale[sku] =
      Math.round(base * (1 - pct / 100) * 100) / 100;
  }
  setStatus(threadId: string, status: Status) {
    this.shop(threadId).status = status;
  }
  setStage(threadId: string, stage: string) {
    this.shop(threadId).stage = stage;
  }
  view(threadId: string) {
    const s = this.shop(threadId);
    const v = this.value(threadId);
    const lines = Object.entries(v.items).map(([sku, l]) => ({
      ...bySku.get(sku)!,
      qty: l.qty,
      price: l.price,
      total: l.qty * l.price,
      onSale: sku in s.sale,
    }));
    return {
      products: products.map((p) => ({
        ...p,
        price: this.price(threadId, p.sku),
        was: p.sku in s.sale ? p.price : undefined,
      })),
      lines,
      subtotal: lines.reduce((t, l) => t + l.total, 0),
      status: s.status,
      orderId: s.status === "ordered" ? ORDER_ID : undefined,
      stage: s.stage,
    };
  }

  computeStateSignal(args: ComputeStateSignalArgs): ComputeStateSignalResult {
    // The page was never touched: nothing to tell the model.
    if (!this.shops.has(args.threadId)) return;
    const current = this.value(args.threadId);
    const cacheKey = `shop:${JSON.stringify(current)}`;

    if (!args.lastSnapshot || !args.contextWindow.hasSnapshot) {
      const lines = Object.entries(current.items).map(
        ([sku, l]) => `${l.qty}× ${name(sku)} (${money(l.price)} each)`,
      );
      return {
        id: this.id,
        mode: "snapshot",
        tagName: "shop",
        cacheKey,
        contents: [
          ...(lines.length ? lines : ["cart: (empty)"]),
          `status: ${current.status}`,
        ].join("\n"),
        value: current,
        metadata: { value: current },
      };
    }

    // What the model currently sees: the last snapshot with each delta since applied.
    const seen: ShopValue = structuredClone(
      (args.lastSnapshot.metadata?.value as ShopValue | undefined) ?? {
        status: "browsing",
        items: {},
      },
    );
    for (const d of args.deltasSinceSnapshot ?? []) {
      const delta = d.metadata?.delta as ShopDelta | undefined;
      for (const ch of delta?.items ?? []) {
        if (ch.to) seen.items[ch.sku] = ch.to;
        else delete seen.items[ch.sku];
      }
      if (delta?.status) seen.status = delta.status.to;
    }

    // Aggregate everything that changed since the model last looked: one entry per product, plus the status.
    const items: ItemChange[] = [
      ...new Set([...Object.keys(seen.items), ...Object.keys(current.items)]),
    ]
      .map((sku) => ({ sku, from: seen.items[sku], to: current.items[sku] }))
      .filter((ch) => JSON.stringify(ch.from) !== JSON.stringify(ch.to));
    const delta: ShopDelta = {
      items,
      ...(seen.status !== current.status
        ? { status: { from: seen.status, to: current.status } }
        : {}),
    };
    if (items.length === 0 && !delta.status) return;
    return {
      id: this.id,
      mode: "delta",
      tagName: "shop-update",
      cacheKey,
      contents: [
        ...items.map(itemLine),
        ...(delta.status
          ? [`status: ${delta.status.to} (was ${delta.status.from})`]
          : []),
      ].join("\n"),
      value: current,
      delta,
      metadata: { value: current, delta },
    };
  }
}

export const shop = new ShopLane();
