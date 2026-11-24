import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import dustinAvatar from './assets/dustin-avatar.jpg';
import alexAvatar from './assets/alex-avatar.jpg';
import mastraWordmark from '@assets/Mastra wordmark black.svg';
import greedFont from '@assets/fonts/GreedVF.woff2';
import commitMonoFont from './assets/CommitMonoMastra500-Regular.woff2';
import { useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#020202', text: '#d9d9d9', accent: '#18fb6f' },
  fonts: {
    display: '"Greed", Inter, system-ui, sans-serif',
    body: '"Greed", Inter, system-ui, sans-serif',
  },
  typeScale: { hero: 166, body: 36 },
  radius: 12,
};

const muted = '#a9a9a9';
const dim = '#757575';
const border = '#242424';
const mono = '"Commit Mono", "Geist Mono", Menlo, Consolas, monospace';

if (typeof document !== 'undefined') {
  const style = document.getElementById('mastra-factory-fonts') ?? document.createElement('style');
  style.id = 'mastra-factory-fonts';
  style.textContent = `@font-face { font-family: Greed; src: url("${greedFont}") format("woff2"); font-weight: 100 900; font-display: swap; }
    @font-face { font-family: "Commit Mono"; src: url("${commitMonoFont}") format("woff2"); font-weight: 500; font-display: swap; }`;
  if (!style.isConnected) document.head.appendChild(style);
}

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return <div style={{ position: 'absolute', bottom: 48, left: 120, right: 120, display: 'flex', justifyContent: 'space-between', color: dim, fontFamily: mono, fontSize: 20, letterSpacing: '0.12em' }}>
    <span>MASTRA · FACTORY 101</span><span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>;
};

const Stage = ({ children, label }: { children: ReactNode; label: string }) => <div style={{ width: '100%', height: '100%', position: 'relative', padding: '120px 120px 130px', boxSizing: 'border-box', background: 'var(--osd-bg)', color: 'var(--osd-text)', fontFamily: 'var(--osd-font-body)' }}>
  <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${border} 1px, transparent 1px), linear-gradient(90deg, ${border} 1px, transparent 1px)`, backgroundSize: '96px 96px', opacity: 0.18 }} />
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div style={{ color: 'var(--osd-accent)', fontFamily: mono, fontSize: 24, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 40 }}>{label}</div>
    {children}
  </div>
  <Footer />
</div>;

const Heading = ({ children }: { children: ReactNode }) => <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 88, lineHeight: 1.08, letterSpacing: '-0.04em', margin: '0 0 58px', maxWidth: 1500 }}>{children}</h2>;
const Lead = ({ children }: { children: ReactNode }) => <p style={{ fontSize: 48, lineHeight: 1.4, color: muted, maxWidth: 1450, margin: 0 }}>{children}</p>;
const Item = ({ number, title, detail }: { number: string; title: string; detail: string }) => <div style={{ display: 'flex', alignItems: 'baseline', gap: 34, padding: '28px 0', borderTop: `1px solid ${border}` }}><span style={{ fontFamily: mono, color: 'var(--osd-accent)', fontSize: 27 }}>{number}</span><strong style={{ fontSize: 42, fontWeight: 650, minWidth: 340 }}>{title}</strong><span style={{ color: muted, fontSize: 31, lineHeight: 1.3 }}>{detail}</span></div>;

// Factory onboarding artwork and animation from mastracode/factory-ui.
/** App-owned vector artwork. All scenes share the same surface count so their geometry can morph. */
const DRAWING_SURFACE_COUNT = 8;
type Point = readonly [number, number];
type WorldPoint = readonly [number, number, number];
type DrawingScene = 'factory' | 'codebase' | 'intake' | 'accounts';
type AccountsMode = 'shared' | 'individual' | 'hybrid';
interface Surface {
  opacity?: number;
  outline: Point[];
  marks: Point[];
}
interface DrawingPose {
  surfaces: Surface[];
  links: Point[][];
  building: number;
  scale: number;
  x: number;
  y: number;
  foundation: number;
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const value = Math.max(0, Math.min(1, t));
  return value * value * (3 - 2 * value);
};
const pointBetween = (a: Point, b: Point, t: number): Point => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
const project = ([x, y, z]: WorldPoint): Point => [209 + (x - y) * 0.884, 213 + (x + y) * 0.442 - z * 1.25];
const polygon = (points: readonly Point[]) =>
  points.length ? `M${points.map(p => p.join(',')).join('L')}Z` : '';
/** Smooth the sampled contour so small rounded corners never become visible polygon facets. */
const contour = (points: readonly Point[]) => {
  const midpoint = (index: number) => pointBetween(points[index], points[(index + 1) % points.length], 0.5);
  return `M${midpoint(points.length - 1).join(',')}${points
    .map((point, index) => `Q${point.join(',')} ${midpoint(index).join(',')}`)
    .join('')}Z`;
};
const segments = (points: readonly Point[]) => {
  let path = '';
  for (let i = 0; i + 1 < points.length; i += 2) {
    if (Math.hypot(points[i][0] - points[i + 1][0], points[i][1] - points[i + 1][1]) > 0.01)
      path += `M${points[i].join(',')}L${points[i + 1].join(',')}`;
  }
  return path;
};
const curve = (points: readonly Point[]) =>
  `M${points[0].join(',')}C${points
    .slice(1)
    .map(p => p.join(','))
    .join(' ')}`;
function onCurve(points: readonly Point[], t: number): Point {
  const a = pointBetween(points[0], points[1], t);
  const b = pointBetween(points[1], points[2], t);
  const c = pointBetween(points[2], points[3], t);
  return pointBetween(pointBetween(a, b, t), pointBetween(b, c, t), t);
}

function hull(points: readonly Point[]): Point[] {
  const sorted = points.toSorted((a, b) => a[0] - b[0] || a[1] - b[1]);
  const half = (input: Point[]) => {
    const result: Point[] = [];
    for (const p of input) {
      while (result.length > 1) {
        const a = result[result.length - 2],
          b = result[result.length - 1];
        if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) > 0) break;
        result.pop();
      }
      result.push(p);
    }
    return result.slice(0, -1);
  };
  return [...half(sorted), ...half(sorted.toReversed())];
}

function rounded(points: readonly Point[], radius: number): Point[] {
  return points.flatMap((p, i) => {
    const previous = points[(i + points.length - 1) % points.length],
      next = points[(i + 1) % points.length];
    const inset = (toward: Point) =>
      pointBetween(p, toward, Math.min(0.45, radius / (Math.hypot(toward[0] - p[0], toward[1] - p[1]) || 1)));
    const a = inset(previous),
      b = inset(next);
    return Array.from({ length: 5 }, (_, j) =>
      pointBetween(pointBetween(a, p, j / 4), pointBetween(p, b, j / 4), j / 4),
    );
  });
}

/** Equal perimeter samples make arbitrary outlines compatible without a path-morph dependency. */
function surface(vertices: readonly Point[], marks: Point[] = [], radius = 1.5): Surface {
  // Consistent winding and origin prevent surfaces twisting as their outlines change.
  const signedArea = vertices.reduce(
    (area, p, i) =>
      area + p[0] * vertices[(i + 1) % vertices.length][1] - p[1] * vertices[(i + 1) % vertices.length][0],
    0,
  );
  const ordered = signedArea < 0 ? vertices.toReversed() : [...vertices];
  const first = ordered.reduce(
    (best, point, i) => (point[0] + point[1] < ordered[best][0] + ordered[best][1] ? i : best),
    0,
  );
  const points = rounded([...ordered.slice(first), ...ordered.slice(0, first)], radius);
  const lengths = points.map((p, i) =>
    Math.hypot(p[0] - points[(i + 1) % points.length][0], p[1] - points[(i + 1) % points.length][1]),
  );
  const perimeter = lengths.reduce((sum, length) => sum + length, 0);
  const outline = Array.from({ length: 64 }, (_, i): Point => {
    let remaining = (perimeter * i) / 64;
    for (let edge = 0; edge < lengths.length; edge++) {
      if (remaining <= lengths[edge])
        return pointBetween(points[edge], points[(edge + 1) % points.length], remaining / (lengths[edge] || 1));
      remaining -= lengths[edge];
    }
    return points[0];
  });
  return { outline, marks: Array.from({ length: 8 }, (_, i) => marks[i] ?? vertices[0]) };
}
function panel(x: number, y: number, width: number, height: number, marked = false): Surface {
  const marks: Point[] = marked
    ? [
        [x + 10, y + 14],
        [x + width * 0.6, y + 14],
        [x + 10, y + 22],
        [x + width * 0.4, y + 22],
      ]
    : [];
  return surface(
    [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ],
    marks,
    8,
  );
}
const folded = panel(200, 175, 0, 0);

function withFoldedSurfaces(surfaces: Surface[]): Surface[] {
  return [...surfaces, ...Array.from({ length: DRAWING_SURFACE_COUNT - surfaces.length }, () => folded)];
}
const worldLine = (a: WorldPoint, b: WorldPoint): Point[] => [project(a), project(b)];
const worldPolygon = (points: WorldPoint[]) => polygon(points.map(project));
function box(
  x: number,
  y: number,
  width: number,
  depth: number,
  z: number,
  height: number,
  flushAt: (corner: WorldPoint) => boolean = () => false,
) {
  const corners: WorldPoint[] = [
    [x, y, z],
    [x + width, y, z],
    [x + width, y + depth, z],
    [x, y + depth, z],
  ];
  const vertices = [...corners, ...corners.map(([u, v, w]): WorldPoint => [u, v, w + height])];
  const square = new Set(vertices.filter(flushAt).map(corner => project(corner).join()));
  const top = z + height;
  const crease = (from: WorldPoint, to: WorldPoint) => {
    const roundingInset = (corner: WorldPoint) =>
      flushAt(corner) ? 0 : 2 / Math.hypot(to[0] - from[0], to[1] - from[1]);
    const along = (t: number): WorldPoint => [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, top];
    return worldLine(along(roundingInset(from)), along(1 - roundingInset(to)));
  };
  return {
    silhouette: hull(vertices.map(project)),
    flushCorners: square,
    creaseCorner: project([x + width, y + depth, top]),
    creases: [
      ...crease([x, y + depth, top], [x + width, y + depth, top]),
      ...crease([x + width, y, top], [x + width, y + depth, top]),
    ],
  };
}
function slab(x: number, y: number, width: number, depth: number, z: number, height: number, marked = true): Surface {
  const { silhouette, creases } = box(x, y, width, depth, z, height);
  const top = z + height;
  if (marked)
    for (const offset of [8, 14])
      creases.push(...worldLine([x + 6, y + offset, top], [x + width - 8, y + offset, top]));
  return surface(silhouette, creases);
}
function transformed(shape: Surface, scale: number, x: number, y: number): Surface {
  const move = ([u, v]: Point): Point => [u * scale + x, v * scale + y];
  return { outline: shape.outline.map(move), marks: shape.marks.map(move) };
}
const roofs = [0, 1, 2].map(i => {
  const x = -60 + i * 39;
  const outline = hull(
    [
      [x, 39],
      [x, 70],
      [x + 36, 45],
      [x + 38, 39],
    ].flatMap(([u, z]) => [project([u, -35, z]), project([u, 40, z])]),
  );
  return surface(outline, [
    ...worldLine([x + 1, 40, 68], [x + 35, 40, 44]),
    ...worldLine([x + 35, 40, 44], [x + 35, -34, 44]),
  ]);
});
const miniScale = 0.46,
  miniX = 314 - 222 * miniScale,
  miniY = 148 - 168 * miniScale;
const accountsMiniX = 80 - 209 * miniScale,
  accountsMiniY = 222 - 213 * miniScale;
const repositoryCenter = project([-21, 107, 13]);
const repoX = 116 - repositoryCenter[0] * 1.65,
  repoY = 181 - repositoryCenter[1] * 1.65;
const repository = transformed(slab(-56, 80, 70, 54, 8, 5, false), 1.65, repoX, repoY);
const brackets = [false, true].map(right => {
  const points: WorldPoint[] = [
    [-40, 102],
    [-27, 89],
    [-22, 94],
    [-31, 103],
    [-22, 112],
    [-27, 117],
  ].map(([x, y]) => {
    const u = (right ? -42 - x : x) + 21,
      v = y - 103;
    return [-21 + (u + v) * Math.SQRT1_2, 107 + (-u + v) * Math.SQRT1_2, 14];
  });
  return transformed(surface(points.map(project), [], 1), 1.65, repoX, repoY);
});
const repoOutlet = project([14, 80, 11]);
const approach = project([-31, 64, 7]),
  threshold = project([-31, 34, 7]);
const codeLink: Point[] = [
  [repoOutlet[0] * 1.65 + repoX, repoOutlet[1] * 1.65 + repoY],
  [260, 175],
  [approach[0] * miniScale + miniX, approach[1] * miniScale + miniY],
  [threshold[0] * miniScale + miniX, threshold[1] * miniScale + miniY],
];
const hiddenLink: Point[] = [
  [200, 175],
  [200, 175],
  [200, 175],
  [200, 175],
];

function drawingPose(scene: DrawingScene, mode: AccountsMode): DrawingPose {
  const base: DrawingPose = {
    surfaces: [],
    links: [hiddenLink, hiddenLink, hiddenLink],
    building: 0,
    scale: miniScale,
    x: miniX,
    y: miniY,
    foundation: 1,
  };
  if (scene === 'factory')
    return {
      ...base,
      building: 1,
      scale: 1,
      x: 0,
      y: 0,
      foundation: 0,
      surfaces: withFoldedSurfaces([...roofs, conveyorTicket(0, smooth(0.18)), conveyorTicket(1, smooth(0.53))]),
    };
  if (scene === 'codebase')
    return {
      ...base,
      building: 1,
      links: [codeLink, hiddenLink, hiddenLink],
      surfaces: withFoldedSurfaces([
        ...roofs.map(shape => transformed(shape, miniScale, miniX, miniY)),
        repository,
        ...brackets,
      ]),
    };
  if (scene === 'intake')
    return {
      ...base,
      links: [
        [
          [104, 112],
          [104, 142],
          [80, 150],
          [80, 186],
        ],
        hiddenLink,
        hiddenLink,
      ],
      surfaces: withFoldedSurfaces([panel(28, 48, 148, 64), panel(28, 186, 104, 48), panel(148, 186, 104, 48)]),
    };
  const links = [80, 200, 320].map((x, index): Point[] => {
    const origin = mode === 'shared' ? 200 : x;
    return [
      [origin, 90],
      [origin, 126],
      [x, 126],
      [x, index === 0 ? 185 : 156],
    ];
  });
  return {
    ...base,
    links,
    building: 1,
    x: accountsMiniX,
    y: accountsMiniY,
    surfaces: [
      ...roofs.map(shape => transformed(shape, miniScale, accountsMiniX, accountsMiniY)),
      panel(148, 156, 104, 94),
      panel(268, 156, 104, 94),
      panel(mode === 'shared' ? 148 : 28, 48, 104, 42),
      mode === 'shared' ? folded : panel(148, 48, 104, 42),
      mode === 'shared' ? folded : panel(268, 48, 104, 42),
    ],
  };
}

const jambStrokeClearance = 0.5;
const outsideBay = (x: readonly [number, number], y: readonly [number, number]) =>
  polygon(hull(x.flatMap(u => y.flatMap(v => [project([u, v, -1]), project([u, v, 14])]))));

/** A closed fill with an open outline: the edge against the loading bay is hidden. */
function conveyorOutline(belt: ReturnType<typeof box>) {
  const corners = belt.silhouette.map((point, index, points) => {
    const flush = belt.flushCorners.has(point.join());
    const inset = (neighbor: Point) =>
      pointBetween(
        point,
        neighbor,
        flush ? 0 : Math.min(0.45, 3 / Math.hypot(neighbor[0] - point[0], neighbor[1] - point[1])),
      );
    const before = inset(points[(index + points.length - 1) % points.length]);
    const after = inset(points[(index + 1) % points.length]);
    return { before, after, flush, turn: flush ? '' : `Q${point.join(',')} ${after.join(',')}` };
  });
  const start = `M${corners[corners.length - 1].after.join(',')}`;
  const fill = start + corners.map(corner => `L${corner.before.join(',')}${corner.turn}`).join('') + 'Z';
  const outline =
    start +
    corners
      .map((corner, index) => {
        const previous = corners[(index + corners.length - 1) % corners.length];
        const command = previous.flush && corner.flush ? 'M' : 'L';
        return `${command}${corner.before.join(',')}${corner.turn}`;
      })
      .join('');
  const [a, b, c, d] = belt.creases;
  const crease = `M${a.join(',')}L${b.join(',')}Q${belt.creaseCorner.join(',')} ${d.join(',')}L${c.join(',')}`;
  return { fill, outline: outline + crease };
}

const inputBelt = conveyorOutline(box(-52, 40, 42, 102, 0, 7, ([, v]) => v === 40)),
  outputBelt = conveyorOutline(box(57, -10, 88, 38, 0, 7, ([u]) => u === 57));

// Belts stop at the wall, so they always sit in front of it; tickets cross it and keep only what the shell leaves visible.
const factoryPaths = {
  ticketsVisible: [
    outsideBay([-52, -10 - jambStrokeClearance], [40, 160]),
    outsideBay([57, 160], [-10, 28 - jambStrokeClearance]),
    worldPolygon([
      [-52, 40, 0],
      [-52, 40, 28],
      [-10 - jambStrokeClearance, 40, 28],
      [-10 - jambStrokeClearance, 40, 0],
    ]),
    worldPolygon([
      [57, -10, 0],
      [57, -10, 28],
      [57, 28 - jambStrokeClearance, 28],
      [57, 28 - jambStrokeClearance, 0],
    ]),
  ],
  foundation: contour(slab(-66, -41, 130, 86, -5, 5, false).outline),
  belts: inputBelt.fill + outputBelt.fill,
  beltEdges: inputBelt.outline + outputBelt.outline,
  chimney: contour(slab(30, -34, 16, 16, 0, 93, false).outline),
  chimneyCap: contour(slab(28, -36, 20, 20, 89, 7, false).outline),
  recess:
    worldPolygon([
      [-52, 40, 7],
      [-52, 40, 28],
      [-10, 40, 28],
      [-10, 40, 7],
    ]) +
    worldPolygon([
      [57, -10, 7],
      [57, -10, 28],
      [57, 28, 28],
      [57, 28, 7],
    ]),
  jambs: segments([
    ...worldLine([-52, 40, 28], [-52, 36, 28]),
    ...worldLine([-52, 36, 28], [-52, 36, 7]),
    ...worldLine([-52, 36, 7], [-52, 40, 7]),
    ...worldLine([57, -10, 28], [53, -10, 28]),
    ...worldLine([53, -10, 28], [53, -10, 7]),
    ...worldLine([53, -10, 7], [57, -10, 7]),
  ]),
  wall: worldPolygon([
    [-60, -35, 39],
    [57, -35, 39],
    [57, -35, 0],
    [57, -10, 0],
    [57, -10, 28],
    [57, 28, 28],
    [57, 28, 0],
    [57, 40, 0],
    [-10, 40, 0],
    [-10, 40, 28],
    [-52, 40, 28],
    [-52, 40, 0],
    [-60, 40, 0],
    [-60, 40, 39],
  ]),
  wallMarks: segments([...worldLine([3, 40, 15], [32, 40, 15]), ...worldLine([3, 40, 23], [32, 40, 23])]),
};

function conveyorTicket(index: number, phase: number): Surface {
  return index === 0 ? slab(-48, 112 - 116 * phase, 34, 28, 7, 3) : slab(19 + 92 * phase, -8, 28, 34, 7, 6);
}


type BoardFrame = readonly [time: number, x: number, y: number, opacity: number];
// A second job leaves Build one second after the first arrives. Slots are promoted only once free.
const boardTracks: readonly (readonly BoardFrame[])[] = [
  [
    [0, 28, 186, 1],
    [0.6, 28, 186, 1],
    [1.4, 148, 244, 1],
    [3.5, 148, 244, 1],
    [4.1, 148, 186, 1],
    [5.2, 148, 186, 1],
    [6, 268, 244, 1],
    [7.7, 268, 244, 1],
    [8.3, 268, 186, 1],
    [11.8, 268, 186, 1],
    [12.4, 268, 186, 0],
    [13.2, 28, 186, 0],
    [13.8, 28, 186, 1],
    [14, 28, 186, 1],
  ],
  [
    [0, 148, 186, 1],
    [2.4, 148, 186, 1],
    [3.2, 268, 186, 1],
    [6.8, 268, 186, 1],
    [7.4, 268, 186, 0],
    [9, 28, 186, 0],
    [9.6, 28, 186, 1],
    [10.6, 28, 186, 1],
    [11.4, 148, 186, 1],
    [14, 148, 186, 1],
  ],
];
function boardFrame(seconds: number, index: number): readonly [number, number, number] {
  const track = boardTracks[index],
    time = seconds % 14;
  const end = track.findIndex(frame => frame[0] > time);
  const a = track[Math.max(0, end - 1)],
    b = track[end < 0 ? track.length - 1 : end];
  const t = smooth((time - a[0]) / (b[0] - a[0] || 1));
  if (a[1] !== b[1] && b[2] > a[2]) {
    const position = onCurve(
      [
        [a[1], a[2]],
        [a[1], b[2]],
        [a[1], b[2]],
        [b[1], b[2]],
      ],
      t,
    );
    return [...position, mix(a[3], b[3], t)];
  }
  return [mix(a[1], b[1], t), mix(a[2], b[2], t), mix(a[3], b[3], t)];
}
const interpolatePoints = (from: Point[], to: Point[], t: number) =>
  to.map((point, index) => pointBetween(from[index], point, t));
function interpolateSurface(from: Surface, to: Surface, t: number): Surface {
  return {
    outline: interpolatePoints(from.outline, to.outline, t),
    marks: interpolatePoints(from.marks, to.marks, t),
    opacity: mix(from.opacity ?? 1, to.opacity ?? 1, t),
  };
}
const envelope = (phase: number) => smooth(phase / 0.1) * (1 - smooth((phase - 0.9) / 0.1));
const duration = 760;

/** One clock for geometry and HTML annotations. No React renders or third-party animation runtime per frame. */
function createOnboardingMotion(svg: SVGSVGElement, stage: HTMLElement) {
  const surfaces = Array.from(svg.querySelectorAll<SVGGElement>('[data-surface]'))
    .toSorted((a, b) => Number(a.dataset.surface) - Number(b.dataset.surface))
    .map(group => ({
      group,
      face: group.querySelector<SVGPathElement>('[data-face]'),
      marks: group.querySelector<SVGPathElement>('[data-marks]'),
    }));
  const links = Array.from(svg.querySelectorAll<SVGPathElement>('[data-link]'));
  const packets = Array.from(svg.querySelectorAll<SVGCircleElement>('[data-packet]'));
  const building = Array.from(svg.querySelectorAll<SVGGElement>('[data-building]'));
  const belts = svg.querySelector<SVGGElement>('[data-belts]');
  const foundation = svg.querySelector<SVGPathElement>('[data-foundation]');
  const landing = svg.querySelector<SVGPathElement>('[data-landing]');
  const conveyorClip = svg.querySelector<SVGClipPathElement>('[data-conveyor-clip]');
  const drawn = new WeakMap<SVGGElement, Surface>();
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scene: DrawingScene = 'factory',
    mode: AccountsMode = 'shared';
  let current = drawingPose(scene, mode),
    from = current,
    target = current;
  let initialized = false,
    disposed = false,
    intersecting = true;
  let start = 0,
    elapsed = 0,
    lastTime = 0,
    frame = 0,
    morphing = false;

  const attribute = (element: Element | null | undefined, name: string, value: string) => {
    if (element && element.getAttribute(name) !== value) element.setAttribute(name, value);
  };
  function drawSurface(item: (typeof surfaces)[number], shape: Surface) {
    if (drawn.get(item.group) === shape) return;
    drawn.set(item.group, shape);
    attribute(item.face, 'd', contour(shape.outline));
    attribute(item.marks, 'd', segments(shape.marks));
    const hasArea = shape.outline.some(
      point => Math.hypot(point[0] - shape.outline[0][0], point[1] - shape.outline[0][1]) > 0.05,
    );
    attribute(item.group, 'opacity', String(hasArea ? (shape.opacity ?? 1) : 0));
  }
  function clipToConveyor(group: SVGGElement, clipped: boolean) {
    if (clipped && conveyorClip) attribute(group, 'clip-path', `url(#${conveyorClip.id})`);
    else group.removeAttribute('clip-path');
  }
  function draw(now: number) {
    const settled = media.matches || now - start >= duration + 120;
    const t = media.matches ? 1 : smooth((now - start) / duration);
    const keepBuildingTogether = from.building === 1 && target.building === 1;
    current = settled
      ? { ...target, surfaces: [...target.surfaces] }
      : {
          surfaces: target.surfaces.map((shape, i) =>
            interpolateSurface(
              from.surfaces[i],
              shape,
              keepBuildingTogether || media.matches ? t : smooth((now - start - Math.abs(i - 1) * 24) / duration),
            ),
          ),
          links: target.links.map((link, i) => interpolatePoints(from.links[i], link, t)),
          building: mix(from.building, target.building, t),
          scale: mix(from.scale, target.scale, t),
          x: mix(from.x, target.x, t),
          y: mix(from.y, target.y, t),
          foundation: mix(from.foundation, target.foundation, t),
        };
    const active = initialized && settled;
    morphing = !settled;
    const motion = active && !media.matches;
    building.forEach(group => {
      attribute(group, 'transform', `translate(${current.x} ${current.y}) scale(${current.scale})`);
      attribute(group, 'opacity', String(current.building));
    });
    attribute(belts, 'opacity', String(1 - current.foundation));
    attribute(foundation, 'opacity', String(current.foundation));
    current.links.forEach((points, i) => {
      const visible = points.some(point => Math.hypot(point[0] - points[0][0], point[1] - points[0][1]) > 0.1);
      attribute(links[i], 'd', visible ? curve(points) : '');
    });
    surfaces.forEach((item, i) => {
      const shape = current.surfaces[i];
      const onConveyor = scene === 'factory' && active && (i === 3 || i === 4);
      clipToConveyor(item.group, onConveyor);
      if (onConveyor) {
        const index = i - 3;
        const phase = motion ? (elapsed / 8 + (index === 0 ? 0.18 : 0.53)) % 1 : index === 0 ? 0.18 : 0.82;
        const ticket = { ...conveyorTicket(index, smooth(phase)), opacity: media.matches ? 1 : envelope(phase) };
        current.surfaces[i] = ticket;
        drawSurface(item, ticket);
        return;
      }
      if (scene === 'intake' && active && (i === 1 || i === 2)) {
        const [x, y, alpha] = boardFrame(motion ? elapsed : 0, i - 1);
        const movingShape = { ...panel(x, y, 104, 48), opacity: alpha };
        // Retarget from the actually displayed card if navigation interrupts a job in flight.
        current.surfaces[i] = movingShape;
        drawSurface(item, movingShape);
        stage.style.setProperty(`--intake-${i}-x`, `${(x + 8) / 4}%`);
        stage.style.setProperty(`--intake-${i}-y`, `${(y + 8) / 3.2}%`);
        const labelReveal = media.matches ? 1 : smooth(elapsed / 0.24);
        stage.style.setProperty(`--intake-${i}-opacity`, String(alpha * labelReveal));
        return;
      }
      if (scene === 'intake' && (i === 1 || i === 2)) {
        stage.style.setProperty(`--intake-${i}-opacity`, '0');
      }
      drawSurface(item, shape);
    });
    const empty = [0, 1].every(i => {
      const [x, y, alpha] = boardFrame(motion ? elapsed : 0, i);
      return alpha < 0.01 || x >= 132 || y >= 234;
    });
    attribute(landing, 'opacity', scene === 'intake' && active && empty ? '1' : '0');
    packets.forEach((packet, i) => {
      const shown = motion && scene !== 'factory' && (scene !== 'intake' || i === 0);
      const phase = (elapsed / 4.8 + i / 3) % 1;
      const position = onCurve(current.links[scene === 'codebase' ? 0 : i], smooth(phase));
      attribute(packet, 'cx', String(position[0]));
      attribute(packet, 'cy', String(position[1]));
      attribute(packet, 'opacity', shown ? String(envelope(phase)) : '0');
    });
    attribute(svg, 'data-ready', 'true');
  }
  function visible() {
    return intersecting && !document.hidden && svg.clientWidth > 0 && svg.clientHeight > 0;
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || !visible()) {
      lastTime = 0;
      return;
    }
    if (lastTime && !morphing && !media.matches) elapsed += Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    draw(now);
    if (morphing || !media.matches) frame = requestAnimationFrame(tick);
  }
  function wake() {
    if (disposed) return;
    if (!visible()) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }
  const resize = new ResizeObserver(wake);
  resize.observe(svg);
  const intersection = new IntersectionObserver(entries => {
    intersecting = entries[0]?.isIntersecting ?? false;
    wake();
  });
  intersection.observe(svg);
  const motionChanged = () => {
    start = -duration - 120;
    draw(performance.now());
    wake();
  };
  media.addEventListener('change', motionChanged);
  document.addEventListener('visibilitychange', wake);
  return {
    set(nextScene: DrawingScene, nextMode: AccountsMode) {
      if (initialized && nextScene === scene && nextMode === mode) return;
      from = current;
      target = drawingPose(nextScene, nextMode);
      scene = nextScene;
      mode = nextMode;
      start = initialized ? performance.now() : -duration - 120;
      elapsed = 0;
      lastTime = 0;
      initialized = true;
      draw(performance.now());
      wake();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      media.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', wake);
      svg.removeAttribute('data-ready');
      for (const i of [1, 2])
        for (const axis of ['x', 'y', 'opacity']) stage.style.removeProperty(`--intake-${i}-${axis}`);
    },
  };
}


const FOREGROUND_SURFACES = [0, 1, 2];
const BACKGROUND_SURFACES = Array.from(
  { length: DRAWING_SURFACE_COUNT - FOREGROUND_SURFACES.length },
  (_, index) => FOREGROUND_SURFACES.length + index,
);

/** The SVG stays mounted between steps; only its coordinates and the separate HTML labels change. */
function OnboardingIllustration({ scene, mode }: { scene: DrawingScene; mode: AccountsMode }) {
  const svg = useRef<SVGSVGElement>(null);
  const id = useId().replace(/\W/g, '');
  const motion = useRef<ReturnType<typeof createOnboardingMotion> | undefined>(undefined);
  useEffect(() => {
    const element = svg.current;
    const stage = element?.parentElement;
    if (!element || !stage) return;
    const drawing = createOnboardingMotion(element, stage);
    motion.current = drawing;
    return () => {
      drawing.destroy();
      motion.current = undefined;
    };
  }, []);
  useEffect(() => {
    motion.current?.set(scene, mode);
  }, [scene, mode]);
  return (
    <svg
      ref={svg}
      viewBox="0 0 400 320"
      aria-hidden="true"
      className="factory-onboarding-sketch" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      data-scene={scene}
    >
      <defs>
        <clipPath id={`${id}-conveyor`} data-conveyor-clip>
          {factoryPaths.ticketsVisible.map(region => (
            <path key={region} d={region} />
          ))}
        </clipPath>
      </defs>
      <path
        data-landing
        d={`${contour(panel(28, 186, 104, 48).outline)}M76,210h8M80,206v8`}
        className="onboarding-landing"
      />
      <g data-building>
        <path data-foundation d={factoryPaths.foundation} className="onboarding-sketch-surface" />
        <path d={factoryPaths.chimney} className="onboarding-sketch-surface" />
        <path d={factoryPaths.chimneyCap} className="onboarding-sketch-surface" />
        <path d={factoryPaths.recess} className="onboarding-sketch-surface onboarding-recess" />
        <path d={factoryPaths.jambs} />
      </g>
      <g data-building>
        <path d={factoryPaths.wall} className="onboarding-sketch-surface" />
        <path d={factoryPaths.wallMarks} className="onboarding-sketch-detail" />
        <g data-belts>
          <path d={factoryPaths.belts} className="onboarding-sketch-surface" stroke="none" />
          <path d={factoryPaths.beltEdges} />
        </g>
      </g>
      {[0, 1, 2].map(index => (
        <path key={index} data-link className="onboarding-sketch-link" />
      ))}
      {BACKGROUND_SURFACES.map(index => (
        <g key={index} data-surface={index}>
          <path data-face className="onboarding-sketch-surface" />
          <path data-marks className="onboarding-sketch-detail" />
        </g>
      ))}
      {[0, 1, 2].map(index => (
        <circle key={index} data-packet r={3} className="onboarding-sketch-surface" />
      ))}
      {FOREGROUND_SURFACES.map(index => (
        <g key={index} data-surface={index}>
          <path data-face className="onboarding-sketch-surface" />
          <path data-marks className="onboarding-sketch-detail" />
        </g>
      ))}
    </svg>
  );
}

const Cover: Page = () => <div style={{ width: '100%', height: '100%', position: 'relative', background: '#07090b', color: 'var(--osd-text)', fontFamily: 'var(--osd-font-body)' }}><div style={{ position: 'absolute', inset: 56, borderRadius: 64, background: '#040506' }} /><div style={{ position: 'absolute', inset: 92, borderRadius: 42, border: '1px solid #29332d', background: '#090c11', padding: '88px 96px', boxSizing: 'border-box', overflow: 'hidden' }}><div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div role="img" aria-label="Mastra" style={{ width: 332, height: 84, background: 'var(--osd-text)', mask: `url("${mastraWordmark}") center / contain no-repeat`, WebkitMask: `url("${mastraWordmark}") center / contain no-repeat` }} /><div style={{ border: '1px solid #29332d', background: '#111913', borderRadius: 999, padding: '12px 22px', fontSize: 28, letterSpacing: '.1em', textTransform: 'uppercase' }}>Workshop</div></div><div style={{ position: 'absolute', right: 0, bottom: 0, width: 480, height: 384, opacity: 0.8, pointerEvents: 'none' }}><style>{`.factory-onboarding-sketch { fill: none; stroke: #67726c; stroke-width: 1px; stroke-linecap: round; stroke-linejoin: round; } .factory-onboarding-sketch * { vector-effect: non-scaling-stroke; } .factory-onboarding-sketch .onboarding-sketch-surface { fill: #111913; } .factory-onboarding-sketch .onboarding-sketch-link, .factory-onboarding-sketch .onboarding-sketch-detail { stroke: #58675c; } .factory-onboarding-sketch .onboarding-recess { fill: #090c11; } .factory-onboarding-sketch .onboarding-landing { opacity: 0; }`}</style><OnboardingIllustration scene="factory" mode="shared" /></div><div style={{ position: 'absolute', top: 172, bottom: 88, left: 96, right: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><h1 style={{ position: 'relative', fontSize: 108, fontWeight: 520, lineHeight: 1.1, margin: 0, textWrap: 'balance' }}>Factory 101</h1></div></div></div>;

const HostLink = ({ href, icon, children }: { href: string; icon: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--osd-accent)', textDecoration: 'none', border: `1px solid ${border}`, borderRadius: 12, padding: '12px 18px', background: '#101810', whiteSpace: 'nowrap' }}><span aria-hidden>{icon}</span>{children} ↗</a>
);

const Host = ({ avatar, name, specialty, bio, website, websiteUrl, twitter, twitterUrl }: { avatar: string; name: string; specialty: string; bio: string; website: string; websiteUrl: string; twitter: string; twitterUrl: string }) => (
  <div style={{ flex: 1, minWidth: 0, borderTop: '3px solid var(--osd-accent)', paddingTop: 36, display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: 'var(--osd-accent)', fontFamily: mono, fontSize: 25, letterSpacing: '0.12em', minHeight: 60 }}>{specialty}</div>
        <h3 style={{ fontSize: 72, letterSpacing: '-0.04em', margin: '20px 0 0', whiteSpace: 'nowrap' }}>{name}</h3>
      </div>
      <img src={avatar} alt={name} style={{ width: 160, height: 160, flexShrink: 0, objectFit: 'cover', borderRadius: '50%', border: `2px solid ${border}` }} />
    </div>
    <p style={{ fontSize: 34, color: muted, lineHeight: 1.4, margin: '28px 0 0', minHeight: 144 }}>{bio}</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto', paddingTop: 32, fontFamily: mono, fontSize: 23 }}>
      <HostLink href={websiteUrl} icon="◎">{website}</HostLink>
      <HostLink href={twitterUrl} icon="𝕏">@{twitter}</HostLink>
    </div>
  </div>
);

const Intros: Page = () => <Stage label="01 / YOUR HOSTS"><Heading>Meet your builders.</Heading><div style={{ display: 'flex', gap: 44, marginTop: 55 }}>
  <Host avatar={dustinAvatar} name="Dustin Schau" specialty="PRODUCT × ENGINEERING" bio="Mastra advisor. Former product & engineering leader at Gatsby and Postman." website="dustinschau.com" websiteUrl="https://dustinschau.com" twitter="schaudustin" twitterUrl="https://twitter.com/schaudustin" />
  <Host avatar={alexAvatar} name="Alex Booker" specialty="DEVELOPER EXPERIENCE × EDUCATION" bio="Leads Observability & Evals at Mastra. Engineer-turned-educator and former Scrimba Podcast host." website="booker.codes" websiteUrl="https://www.booker.codes/" twitter="bookercodes" twitterUrl="https://twitter.com/bookercodes" />
</div></Stage>;

const Goals: Page = () => <Stage label="02 / GOALS"><Heading>What you’ll leave with.</Heading><Item number="01" title="Understand" detail="What a factory is—and what powers Mastra’s." /><Item number="02" title="Build" detail="A factory end to end, alongside Dustin and Alex." /><Item number="03" title="Use" detail="Take home a factory for building your own software factory." /></Stage>;

const Definition: Page = () => <Stage label="03 / DEFINITION"><Heading>What is a factory?</Heading><p style={{ fontSize: 58, lineHeight: 1.35, maxWidth: 1470, margin: 0 }}>An <span style={{ color: 'var(--osd-accent)' }}>automated way</span> to produce increasingly high-quality, specialized inputs into a system—while controlling each step as desired.</p></Stage>;

const WorkflowStep = ({ title }: { title: string }) => <div style={{ flex: 1, padding: '30px 12px', textAlign: 'center', border: `1px solid ${border}`, fontFamily: mono, fontSize: 27, color: 'var(--osd-accent)' }}>{title}</div>;

const BuildingBlocks: Page = () => <Stage label="04 / WORKFLOW ENGINE"><Heading>Familiar Mastra building blocks,<br />assembled into a factory.</Heading><div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 64 }}><WorkflowStep title="INTAKE" /><span style={{ color: muted }}>→</span><WorkflowStep title="TRIAGE" /><span style={{ color: muted }}>→</span><WorkflowStep title="PLAN" /><span style={{ color: muted }}>→</span><WorkflowStep title="BUILD" /><span style={{ color: muted }}>→</span><WorkflowStep title="REVIEW" /><span style={{ color: muted }}>→</span><WorkflowStep title="SHIPPED" /></div><p style={{ fontSize: 36, color: muted, margin: '52px 0 34px' }}>Customize each stage’s skills, tools, and approvals.</p><div style={{ borderTop: `2px solid ${border}`, paddingTop: 30, fontFamily: mono, fontSize: 29, lineHeight: 1.5 }}><span style={{ color: muted }}>POWERED BY</span><div style={{ color: 'var(--osd-text)', marginTop: 14 }}>MEMORY <span style={{ color: 'var(--osd-accent)' }}>·</span> CODING AGENT <span style={{ color: 'var(--osd-accent)' }}>·</span> CLOUD WORKSPACES <span style={{ color: 'var(--osd-accent)' }}>·</span> CONNECTORS</div></div></Stage>;

const Choices: Page = () => <Stage label="05 / YOUR FACTORY"><Heading>Yours, not ours.</Heading><Lead>Choose what enters, what runs, and when a person steps in.</Lead><div style={{ display: 'flex', gap: 26, marginTop: 94 }}><Capability number="01 / INTAKE" title="Where does work begin?" detail="An issue, board, or Slack conversation." /><Capability number="02 / STAGES" title="What happens next?" detail="Customize triage, planning, tools, and the model." /><Capability number="03 / APPROVAL" title="Who signs off?" detail="Put a human gate where your team needs one." /></div></Stage>;

const Capability = ({ number, title, detail }: { number: string; title: string; detail: string }) => <div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 28 }}><div style={{ color: 'var(--osd-accent)', fontFamily: mono, fontSize: 26 }}>{number}</div><h3 style={{ fontSize: 40, margin: '22px 0 14px' }}>{title}</h3><p style={{ color: muted, fontSize: 29, lineHeight: 1.35, margin: 0 }}>{detail}</p></div>;

const BentoCard = ({ icon, title, lead, detail }: { icon: string; title: string; lead: string; detail: string }) => <div style={{ background: '#101010', border: `1px solid ${border}`, borderRadius: 18, padding: '28px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280 }}><div style={{ color: 'var(--osd-accent)', fontFamily: mono, fontSize: 60, lineHeight: 1 }}>{icon}</div><div><h3 style={{ fontSize: 36, margin: '0 0 10px' }}>{title}</h3><p style={{ fontSize: 26, lineHeight: 1.3, color: muted, margin: 0 }}><strong style={{ color: 'var(--osd-text)', fontWeight: 500 }}>{lead}</strong> {detail}</p></div></div>;

const MastraFactory: Page = () => <Stage label="06 / MASTRA"><Heading>What Factory gives you.</Heading><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 40 }}><BentoCard icon="▣" title="Previews" lead="See it, then ship it." detail="Try the live app before opening the diff." /><BentoCard icon="⬡" title="Cloud sandboxes" lead="Off your laptop." detail="Every agent gets its own ready-to-run workspace." /><BentoCard icon="↗" title="Slack-native" lead="Ship from the thread." detail="File work, answer questions, and approve plans." /><BentoCard icon="⌘" title="Infinite control and customization" lead="Yours, not ours." detail="Choose boards, stages, approvals, and models." /></div></Stage>;

const Demo: Page = () => <Stage label="07 / LIVE DEMO + TRY IT YOURSELF"><Heading>Here’s the plan.</Heading><Lead>We’ll build a factory from scratch, then show how Mastra uses its own.</Lead><div style={{ display: 'flex', gap: 32, marginTop: 54 }}><div style={{ flex: 1, border: `1px solid ${border}`, padding: 30, fontSize: 34 }}>01 / Build a factory together</div><div style={{ flex: 1, border: `1px solid ${border}`, padding: 30, fontSize: 34 }}>02 / See Mastra’s factory in action</div></div><div style={{ borderTop: `1px solid ${border}`, marginTop: 52, paddingTop: 32 }}><div style={{ fontSize: 34, color: muted }}>Your turn: copy the setup prompt from the workshop chat into your coding agent.</div><div style={{ fontSize: 30, lineHeight: 1.4, color: 'var(--osd-accent)', marginTop: 24, maxWidth: 1500 }}>Set up Mastra Factory for me. Ask me what to name my factory, then run npx create-factory &lt;factory-name&gt;. Next, run cd &lt;factory-name&gt; &amp;&amp; npm run dev and open http://localhost:4111.</div><div style={{ fontFamily: mono, fontSize: 26, color: muted, marginTop: 18 }}>mastra.ai/factory</div></div></Stage>;

const Quality: Page = () => <Stage label="08 / MASTRA'S RESULTS"><Heading>What changed at Mastra.</Heading><div style={{ display: 'flex', gap: 34, marginTop: 70 }}><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 28 }}><div style={{ fontFamily: mono, fontSize: 23, color: muted }}>MEDIAN TIME IN TRIAGE</div><div style={{ fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)', margin: '28px 0 18px' }}>6.9h → 11m</div><div style={{ fontSize: 25, color: muted }}>August → November 11</div></div><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 28 }}><div style={{ fontFamily: mono, fontSize: 23, color: muted }}>ISSUE → MERGED PR</div><div style={{ fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)', margin: '28px 0 18px' }}>56.4h → 28.2h</div><div style={{ fontSize: 25, color: muted }}>Median; before Factory vs. Factory PRs</div></div><div style={{ flex: 1, borderTop: '3px solid var(--osd-accent)', paddingTop: 28 }}><div style={{ fontFamily: mono, fontSize: 23, color: muted }}>MERGED PRS / ENGINEER / WEEK</div><div style={{ fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)', margin: '28px 0 18px' }}>9.5 → 16.9</div><div style={{ fontSize: 25, color: muted }}>Human + Factory output; +79%</div></div></div><div style={{ marginTop: 72, fontSize: 22, color: dim, fontFamily: mono }}>Source: mastra.ai/blog/announcing-new-capabilities-in-mastra-factory</div></Stage>;

const Start: Page = () => <Stage label="09 / Q&A"><div style={{ marginTop: 140 }}><h2 style={{ fontSize: 142, lineHeight: 1.05, letterSpacing: '-0.05em', margin: 0 }}>Questions<span style={{ color: 'var(--osd-accent)' }}>?</span></h2><p style={{ fontSize: 42, color: muted, marginTop: 50 }}>Let’s talk about your factory.</p></div></Stage>;

export const meta: SlideMeta = { title: 'Factory 101', createdAt: '2026-11-24T21:28:36.150Z' };
export default [Cover, Intros, Goals, Definition, BuildingBlocks, Choices, MastraFactory, Demo, Quality, Start] satisfies Page[];
