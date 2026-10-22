import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { shopPage, splitPage } from "../src/mastra/pages.ts";
import { homePage } from "../src/mastra/home-page.ts";

const script = (html) => html.match(/<script>([\s\S]*?)<\/script>/)[1];

test("split page encodes title and iframe attributes", () => {
  const html = splitPage({
    title: "<demo>",
    left: '/shop?thread="test',
    right: "/agents/reviewer/threads/r",
  });
  assert.ok(html.includes("&#60;demo&#62;"));
  assert.ok(html.includes("/shop?thread=&#34;test"));
  assert.equal((html.match(/<iframe/g) ?? []).length, 2);
});

for (const [name, page] of [
  ["shop", shopPage],
  ["home", homePage],
]) {
  test(`${name} embeds arbitrary thread IDs as script data`, () => {
    const thread = "</script><script>globalThis.injected=true</script>";
    const html = page(thread);
    assert.equal((html.match(/<script>/g) ?? []).length, 1);
    // Compiling verifies the escaping did not break the generated JavaScript.
    new vm.Script(script(html));
    assert.ok(html.includes("\\u003c/script>"));
  });
}

test("home dashboard renders activity as text, not markup", () => {
  const elements = new Map();
  const element = (id) => {
    if (!elements.has(id)) elements.set(id, { classList: { toggle() {} } });
    return elements.get(id);
  };
  const context = vm.createContext({
    document: {
      getElementById: element,
      querySelectorAll: () => [],
      body: { addEventListener() {} },
    },
    fetch: () => new Promise(() => {}),
    setInterval() {},
  });
  vm.runInContext(script(homePage("thread")), context);
  context.input = {
    house: {
      lights: {},
      locks: {},
      thermostat: 20,
      mode: "home",
      views: [],
      alarm: false,
      phone: { ringing: false, lines: [] },
      intercom: [],
      activity: [{ by: "agent", text: "<img src=x onerror=alert(1)>&", at: 0 }],
    },
  };
  vm.runInContext("render(input)", context);
  assert.ok(
    element("act").innerHTML.includes(
      "&lt;img src=x onerror=alert(1)&gt;&amp;",
    ),
  );
  assert.ok(!element("act").innerHTML.includes("<img"));
});
