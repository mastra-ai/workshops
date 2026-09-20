# Reusable presentation patterns

These are Mastra authoring defaults learned from the finished talk and its revisions. A new user request overrides them. The timeline’s dates, milestones, feature-launch mapping, and research are bespoke content, not a template or reusable claim.

## Start with the right page

Use the live `export default` array to translate page numbers; insertions change later numbers. Keep the positional `notes` array aligned. A screenshot, title, or uniquely named component can resolve the target more reliably than an ambient browser page. If “embedded page 13” identifies a video by number, ask one focused question before replacing it. Undo only the mistaken edit, preserving unrelated work.

The current-page file may reflect an agent’s preview navigation. Treat it as a hint, especially when it conflicts with explicit wording or supplied screenshots. An old cursor alone is not a reason to interrupt if the user supplied a clear deck/content target.

## Minimal means minimal

- Use a centered h1 for a talk cover, with the real wordmark and optional Talk badge. Presenter names, dates, subtitles, footer deck names, and page counts are opt-in.
- Section dividers and predictions use h2. A section title may pair a main title with a smaller h2 such as a prediction count. Center the actual visible block, accounting for the logo row above it.
- “No titles or text, just code” means exactly that. Explanations, qualifications, chronology notes, and source links belong in `notes`.
- Use the requested casing. Titles follow title case; feature names use readable product casing and preserve acronyms (MCP, GTM, SRE). Prefer capability labels such as Memory, Sandbox, Filesystem, Browser, Modes, Goals, and Background Tasks; don't pluralize every noun mechanically.

## Code that shows the next step

Use a large monospace face, sparse syntax colors, no displayed semicolons, and `...` where the audience already knows the setup. Keep one idea per code page. Show a concrete final call when requested. When introducing a controller/harness, define an abridged `agent` and pass it to the controller so the relationship is visible.

Highlight only the newly introduced lines with a faint yellow marker behind the text; retain syntax highlighting. A useful progression is minimal agent → add workspace/sandbox/browser → discover integrations → add controller. It is a teaching pattern, not mandatory slide order.

Consult the repo’s Mastra and educator skills to verify live APIs before creating real examples. Prefer supported built-in tools and an inspiring, understandable task. Do not freeze a conversation’s chosen model or example API into a universal default. Abridged teaching snippets and runnable examples should be clearly distinguished in notes.

## Feature clouds and structured comparisons

A refined feature cloud is a scattered arrangement of rounded pills, not equal rows. Vary x/y positions, widths, type size, and drift phase. Leave room for motion at the edges and between pills. Feature/use-case capabilities are more prominent; operational essentials such as auth, observability, evals, and guardrails are quieter but still readable. Quiet does not mean absent or unimportant.

Use a regular grid when the audience needs to compare agent roles and responsibilities. With a screenshot on the right, turn the grid into compact left-hand cards and preserve screenshot aspect ratio. A long statement can instead use a narrow left heading and a large right screenshot. Keep copy concise before shrinking type.

For any bespoke timeline/table, align column headings with the actual text or bubble edges. Shorten the left labels and narrow the first column rather than leaving an empty gap to the timeline. These geometry lessons are reusable; the talk’s timeline content is not.

## Websites, videos, screenshots, and local demos

- A full-screen embed occupies the entire 1920×1080 canvas; omit the decorative frame and footer. Always confirm it renders, not just that an iframe exists.
- Use normal iframes only where framing is permitted. If CSP/X-Frame-Options prevents it, use a supplied/captured local snapshot with a live link. Static fetched HTML is another option when CORS and the source page permit it; add a base URL for relative assets and disable scripts. Search, menus, hydration, and other scripted behavior will not work in that mode. Never silently call a snapshot interactive.
- Keep an 80%-opacity “Open live site” overlay in a bottom corner. For auth-sensitive demos, a prominent Demo button may launch the user’s requested browser. Normal HTTPS links are the default. Chrome-specific protocols are platform-dependent; test when permitted and report a launch-verification blocker honestly. Never bypass a browser security rejection.
- Videos autoplay **muted**, loop, expose controls, use `playsInline`, and play only on the active slide. Pause on departure and unmount so thumbnails cannot run competing playback.
- A hosted page cannot embed `file://`. Bundle a self-contained HTML demo into slide assets and import with `?raw`, or serve its entire asset tree. Retain the scripts needed for interaction with appropriately scoped iframe permissions. Check click targets after scaling.
- Preserve image/video content and aspect ratio. Full-screen screenshot templates use `contain` by default; a half-slide closer may use intentional `cover` cropping, after checking that the logo, face, or title remains visible. Do not recreate real screenshots with generated art.

## QR overlays and the closing slide

Generate a real QR encoding the exact destination; decode it to verify. Do not draw fake QR patterns. Keep a white quiet zone, roughly a 200px code inside 24px padding, and a default overall opacity of 0.8. Do not add a visible URL caption unless requested. The anchor destination must match the encoded URL.

QR overlays are siblings of moving content, fixed about 36px from a bottom corner. For a split closer, put the product on the left and the presenter on the right, product QR bottom-left and profile QR bottom-right. Both codes stay static while the screenshots slowly push/pull. Do not put a real presenter’s handle into a generic template; replace its example QR and link together.

A Questions closer needs clear separation between the heading and scan targets. “Try it now” is an appropriate product CTA when requested. Closing slides should remain comfortable to leave on screen.

## Theme and motion

New reusable templates support system, light, and dark. Honor an explicit light-mode venue request without turning every future deck permanently light. Scope variables and animation names to the deck/theme, use the real logo with appropriate contrast, and ensure syntax/quiet-pill colors work in both palettes. External media retain their own appearance.

Floating pills: gently visible drift, varied phase, about 6s for prominent features and 9s for quieter essentials. Split closer: about 16s with a small (48–52%) shared-boundary shift. Demo button: large enough to target live, a short lift/glow, and a moving arrow on hover; give keyboard focus the same treatment. Respect reduced motion, freeze for print, pause off-slide, and never animate the QR codes.

## Practical check

After an edit, inspect only what changed unless there is a new concern. For a new template catalog, inspect every recipe in both modes, including overflow and media controls. The Themes gallery freezes motion, so use a temporary interactive preview for animation/video checks. Keep the completed source deck unchanged during extraction.
