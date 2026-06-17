const canvas = document.getElementById('canvas');
const label  = document.getElementById('board-label');

const ns = 'http://www.w3.org/2000/svg';

const VW   = 900;
const TOP  = 30;
const XHT  = 80;
const BASE = 200;
const DESC = 250;
const CX   = 400;

const MID_U = Math.round((TOP  + BASE) / 2);
const MID_L = Math.round((XHT  + BASE) / 2);

function el(tag, attrs) {
  const e = document.createElementNS(ns, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function smooth(pts) {
  if (pts.length < 2) return `M${pts[0][0]},${pts[0][1]}`;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i+1][0]) / 2;
    const my = (pts[i][1] + pts[i+1][1]) / 2;
    d += ` Q${pts[i][0]},${pts[i][1]} ${mx},${my}`;
  }
  const l = pts[pts.length - 1];
  d += ` L${l[0]},${l[1]}`;
  return d;
}

const STROKES = {
  A: {
    upper: [
      [[CX, TOP],        [CX-65, BASE]],
      [[CX, TOP],        [CX+65, BASE]],
      [[CX-38, MID_U+10],[CX+38, MID_U+10]]
    ],
    lower: [
      [[CX+42, XHT+5], [CX+42, XHT], [CX+24, XHT-5], [CX, XHT], [CX-18, XHT+20], [CX-18, XHT+60], [CX, BASE], [CX+24, BASE-4], [CX+42, MID_L+25]],
      [[CX+42, MID_L+25], [CX+42, BASE]]
    ]
  },
  B: {
    upper: [
      [[CX-45, TOP],  [CX-45, BASE]],
      [[CX-45, TOP],  [CX+20, TOP],   [CX+50, TOP+25],  [CX+50, TOP+55],  [CX+20, MID_U],  [CX-45, MID_U]],
      [[CX-45, MID_U],[CX+25, MID_U], [CX+55, MID_U+28],[CX+55, MID_U+58],[CX+25, BASE],   [CX-45, BASE]]
    ],
    lower: [
      [[CX-22, TOP],  [CX-22, BASE]],
      [[CX-22, MID_L],[CX+5,  XHT],   [CX+30, XHT],     [CX+48, MID_L+5], [CX+48, MID_L+38],[CX+30, BASE],[CX+5, BASE],[CX-22, MID_L+42]]
    ]
  },
  C: {
    upper: [
      [[CX+55, TOP+22],[CX+30, TOP],   [CX-5,  TOP],     [CX-44, TOP+34],  [CX-56, MID_U],  [CX-44, MID_U+58],[CX-5,BASE],[CX+30,BASE],[CX+55,BASE-22]]
    ],
    lower: [
      [[CX+48, XHT+8],[CX+26, XHT],   [CX,    XHT],     [CX-22, XHT+20],  [CX-32, MID_L+10],[CX-22, BASE-5],[CX,BASE],[CX+26,BASE],[CX+48,BASE-12]]
    ]
  },
  D: {
    upper: [
      [[CX-45, TOP],  [CX-45, BASE]],
      [[CX-45, TOP],  [CX+15, TOP],   [CX+58, TOP+40],  [CX+58, MID_U+20],[CX+15, BASE],   [CX-45, BASE]]
    ],
    lower: [
      [[CX+42, TOP],  [CX+42, BASE]],
      [[CX+42, MID_L+2],[CX+18,XHT],  [CX-8,  XHT],     [CX-30, XHT+20],  [CX-30, MID_L+35],[CX-8,BASE],[CX+18,BASE],[CX+42,MID_L+42]]
    ]
  },
  E: {
    upper: [
      [[CX+50, TOP],  [CX-45, TOP],   [CX-45, BASE],    [CX+50, BASE]],
      [[CX-45, MID_U],[CX+32, MID_U]]
    ],
    lower: [
      [[CX-28, MID_L+22],[CX+36,MID_L+22],[CX+44,MID_L+5],[CX+30,XHT],[CX+4,XHT],[CX-20,XHT+20],[CX-28,MID_L+22],[CX-20,BASE-5],[CX+4,BASE],[CX+30,BASE],[CX+44,BASE-12]]
    ]
  },
  F: {
    upper: [
      [[CX+50, TOP],  [CX-45, TOP],   [CX-45, BASE]],
      [[CX-45, MID_U],[CX+32, MID_U]]
    ],
    lower: [
      [[CX+30, XHT+10],[CX+14,XHT],   [CX-4,  XHT+12],  [CX-4,  DESC]],
      [[CX-24, MID_L], [CX+20, MID_L]]
    ]
  },
  G: {
    upper: [
      [[CX+55, TOP+22],[CX+30, TOP],   [CX-5,  TOP],     [CX-44, TOP+34],  [CX-56, MID_U],  [CX-44,MID_U+58],[CX-5,BASE],[CX+30,BASE],[CX+55,BASE-22],[CX+55,MID_U+10],[CX+12,MID_U+10]]
    ],
    lower: [
      [[CX+48, XHT+8],[CX+26, XHT],   [CX,    XHT],     [CX-22, XHT+20],  [CX-32, MID_L+10],[CX-22,BASE-5],[CX,BASE],[CX+26,BASE],[CX+48,BASE-12],[CX+48,DESC-10],[CX+26,DESC],[CX,DESC-5]]
    ]
  },
  H: {
    upper: [
      [[CX-45, TOP],  [CX-45, BASE]],
      [[CX+45, TOP],  [CX+45, BASE]],
      [[CX-45, MID_U],[CX+45, MID_U]]
    ],
    lower: [
      [[CX-22, TOP],  [CX-22, BASE]],
      [[CX-22, MID_L+5],[CX+4,XHT],   [CX+30, XHT],     [CX+46, MID_L+8], [CX+46, BASE]]
    ]
  },
  I: {
    upper: [
      [[CX-35, TOP],  [CX+35, TOP]],
      [[CX, TOP],     [CX, BASE]],
      [[CX-35, BASE], [CX+35, BASE]]
    ],
    lower: [
      [[CX, XHT+2],   [CX, XHT+4]],
      [[CX, XHT+14],  [CX, BASE]]
    ]
  },
  J: {
    upper: [
      [[CX-15, TOP],  [CX+38, TOP]],
      [[CX+12, TOP],  [CX+12, MID_U+52],[CX-5,BASE],    [CX-30, BASE-5],  [CX-42, MID_U+40]]
    ],
    lower: [
      [[CX+10, XHT+2],[CX+10, XHT+4]],
      [[CX+10, XHT+14],[CX+10,MID_L+50],[CX-5,DESC],    [CX-22, DESC-8],  [CX-30, DESC-22]]
    ]
  },
  K: {
    upper: [
      [[CX-45, TOP],  [CX-45, BASE]],
      [[CX+50, TOP],  [CX-45, MID_U]],
      [[CX-45, MID_U],[CX+50, BASE]]
    ],
    lower: [
      [[CX-22, TOP],  [CX-22, BASE]],
      [[CX+40, XHT],  [CX-22, MID_L+20]],
      [[CX-22, MID_L+20],[CX+40,BASE]]
    ]
  },
  L: {
    upper: [
      [[CX-35, TOP],  [CX-35, BASE],   [CX+45, BASE]]
    ],
    lower: [
      [[CX-12, TOP],  [CX-12, BASE],   [CX+32, BASE]]
    ]
  },
  M: {
    upper: [
      [[CX-60, BASE], [CX-60, TOP],    [CX, MID_U+18],   [CX+60, TOP],     [CX+60, BASE]]
    ],
    lower: [
      [[CX-30, BASE], [CX-30, XHT]],
      [[CX-30, XHT],  [CX-10, XHT],    [CX+4,  MID_L+5], [CX+4,  BASE]],
      [[CX+4,  XHT],  [CX+24, XHT],    [CX+40, MID_L+5], [CX+40, BASE]]
    ]
  },
  N: {
    upper: [
      [[CX-50, BASE], [CX-50, TOP],    [CX+50, BASE],    [CX+50, TOP]]
    ],
    lower: [
      [[CX-24, BASE], [CX-24, XHT]],
      [[CX-24, XHT],  [CX+4,  XHT],    [CX+40, MID_L+18],[CX+40, XHT]],
      [[CX+40, XHT],  [CX+40, BASE]]
    ]
  },
  O: {
    upper: [
      [[CX, TOP],[CX+50,TOP+28],[CX+62,MID_U],[CX+50,MID_U+58],[CX,BASE],[CX-50,MID_U+58],[CX-62,MID_U],[CX-50,TOP+28],[CX,TOP]]
    ],
    lower: [
      [[CX,XHT],[CX+36,XHT],[CX+48,MID_L+18],[CX+48,MID_L+38],[CX+36,BASE],[CX,BASE],[CX-36,BASE],[CX-48,MID_L+38],[CX-48,MID_L+18],[CX-36,XHT],[CX,XHT]]
    ]
  },
  P: {
    upper: [
      [[CX-45, TOP],  [CX-45, BASE]],
      [[CX-45, TOP],  [CX+18, TOP],    [CX+50, TOP+26],  [CX+50, MID_U-18],[CX+18, MID_U],  [CX-45, MID_U]]
    ],
    lower: [
      [[CX-22, XHT],  [CX-22, DESC]],
      [[CX-22, XHT],  [CX+8,  XHT],    [CX+42, XHT+18],  [CX+42, MID_L+35],[CX+8,  BASE],   [CX-22, BASE]]
    ]
  },
  Q: {
    upper: [
      [[CX,TOP],[CX+50,TOP+28],[CX+62,MID_U],[CX+50,MID_U+58],[CX,BASE],[CX-50,MID_U+58],[CX-62,MID_U],[CX-50,TOP+28],[CX,TOP]],
      [[CX+24, MID_U+45],[CX+60, BASE+22]]
    ],
    lower: [
      [[CX,XHT],[CX+36,XHT],[CX+48,MID_L+18],[CX+48,MID_L+38],[CX+36,BASE],[CX,BASE],[CX-36,BASE],[CX-48,MID_L+38],[CX-48,MID_L+18],[CX-36,XHT],[CX,XHT]],
      [[CX+24, MID_L+42],[CX+52, DESC]]
    ]
  },
  R: {
    upper: [
      [[CX-45, TOP],  [CX-45, BASE]],
      [[CX-45, TOP],  [CX+18, TOP],    [CX+50, TOP+26],  [CX+50, MID_U-18],[CX+18, MID_U],  [CX-45, MID_U]],
      [[CX+8,  MID_U],[CX+55, BASE]]
    ],
    lower: [
      [[CX-24, XHT],  [CX-24, BASE]],
      [[CX-24, MID_L+8],[CX,XHT],      [CX+22, XHT],     [CX+36, MID_L+5], [CX+30, MID_L+22],[CX-24,MID_L+25]]
    ]
  },
  S: {
    upper: [
      [[CX+50,TOP+22],[CX+24,TOP],[CX-8,TOP],[CX-40,TOP+26],[CX-40,MID_U-15],[CX,MID_U],[CX+40,MID_U+15],[CX+40,BASE-26],[CX+8,BASE],[CX-24,BASE],[CX-50,BASE-22]]
    ],
    lower: [
      [[CX+38,XHT+8],[CX+20,XHT],[CX-2,XHT],[CX-22,XHT+18],[CX-22,MID_L+5],[CX,MID_L+18],[CX+22,MID_L+32],[CX+22,BASE-8],[CX+2,BASE],[CX-20,BASE],[CX-38,BASE-10]]
    ]
  },
  T: {
    upper: [
      [[CX-55, TOP],  [CX+55, TOP]],
      [[CX, TOP],     [CX, BASE]]
    ],
    lower: [
      [[CX-10, XHT+8],[CX-10, BASE+2], [CX+4,  BASE+8]],
      [[CX-30, MID_L],[CX+20, MID_L]]
    ]
  },
  U: {
    upper: [
      [[CX-50,TOP],[CX-50,MID_U+52],[CX-28,BASE],[CX,BASE+5],[CX+28,BASE],[CX+50,MID_U+52],[CX+50,TOP]]
    ],
    lower: [
      [[CX-24,XHT],[CX-24,MID_L+45],[CX-8,BASE],[CX+14,BASE],[CX+40,MID_L+38],[CX+40,XHT]]
    ]
  },
  V: {
    upper: [[[CX-55, TOP], [CX, BASE], [CX+55, TOP]]],
    lower:  [[[CX-32, XHT],[CX, BASE], [CX+32, XHT]]]
  },
  W: {
    upper: [[[CX-60,TOP],[CX-30,BASE],[CX,MID_U+28],[CX+30,BASE],[CX+60,TOP]]],
    lower:  [[[CX-40,XHT],[CX-20,BASE],[CX,MID_L+28],[CX+20,BASE],[CX+40,XHT]]]
  },
  X: {
    upper: [[[CX-50,TOP],[CX+50,BASE]],[[CX+50,TOP],[CX-50,BASE]]],
    lower:  [[[CX-30,XHT],[CX+30,BASE]],[[CX+30,XHT],[CX-30,BASE]]]
  },
  Y: {
    upper: [
      [[CX-50, TOP],  [CX, MID_U]],
      [[CX+50, TOP],  [CX, MID_U], [CX, BASE]]
    ],
    lower: [
      [[CX-30, XHT],  [CX, MID_L+22]],
      [[CX+30, XHT],  [CX, MID_L+22],[CX, DESC]]
    ]
  },
  Z: {
    upper: [[[CX-50,TOP],[CX+50,TOP],[CX-50,BASE],[CX+50,BASE]]],
    lower:  [[[CX-30,XHT],[CX+30,XHT],[CX-30,BASE],[CX+30,BASE]]]
  }
};

const DIGIT_STROKES = {
  '0': [[[CX,TOP],[CX+52,TOP+28],[CX+62,MID_U],[CX+52,MID_U+58],[CX,BASE],[CX-52,MID_U+58],[CX-62,MID_U],[CX-52,TOP+28],[CX,TOP]]],
  '1': [[[CX-15,TOP+25],[CX+10,TOP],[CX+10,BASE]],[[CX-20,BASE],[CX+35,BASE]]],
  '2': [[[CX-40,TOP+25],[CX-20,TOP],[CX+20,TOP],[CX+44,TOP+25],[CX+44,MID_U-10],[CX-40,BASE],[CX+46,BASE]]],
  '3': [[[CX-40,TOP+15],[CX,TOP],[CX+38,TOP+20],[CX+38,MID_U-10],[CX,MID_U]],[[CX,MID_U],[CX+42,MID_U+15],[CX+42,BASE-15],[CX,BASE],[CX-40,BASE-15]]],
  '4': [[[CX+28,BASE],[CX+28,TOP],[CX-40,MID_U+15],[CX+46,MID_U+15]]],
  '5': [[[CX+38,TOP],[CX-36,TOP],[CX-40,MID_U-5],[CX+10,MID_U-5],[CX+42,MID_U+20],[CX+42,BASE-20],[CX+10,BASE],[CX-36,BASE-15]]],
  '6': [[[CX+38,TOP+18],[CX+15,TOP],[CX-15,TOP],[CX-44,TOP+30],[CX-50,MID_U],[CX-44,MID_U+55],[CX-10,BASE],[CX+20,BASE],[CX+46,MID_U+55],[CX+46,MID_U+18],[CX+20,MID_U-5],[CX-10,MID_U-5],[CX-44,MID_U+18]]],
  '7': [[[CX-42,TOP],[CX+46,TOP],[CX-10,BASE]]],
  '8': [[[CX,MID_U],[CX+40,TOP+40],[CX+40,TOP+20],[CX+22,TOP],[CX,TOP],[CX-22,TOP],[CX-40,TOP+20],[CX-40,TOP+40],[CX,MID_U],[CX+44,MID_U+30],[CX+44,BASE-20],[CX+22,BASE],[CX,BASE],[CX-22,BASE],[CX-44,BASE-20],[CX-44,MID_U+30],[CX,MID_U]]],
  '9': [[[CX-46,BASE-18],[CX-22,BASE],[CX+10,BASE],[CX+44,BASE-30],[CX+50,MID_U],[CX+44,TOP+38],[CX+10,TOP+5],[CX-22,TOP+5],[CX-44,TOP+38],[CX-44,MID_U+18],[CX-22,MID_U+5],[CX+10,MID_U+5],[CX+44,MID_U+18]]]
};

function makeMultiDigitStrokes(numStr) {
  if (numStr.length === 1) return DIGIT_STROKES[numStr] || [];
  const spacing = numStr.length === 2 ? 160 : 120;
  const total   = (numStr.length - 1) * spacing;
  const startX  = -total / 2;
  const combined = [];
  numStr.split('').forEach((ch, i) => {
    const offsetX = startX + i * spacing;
    (DIGIT_STROKES[ch] || []).forEach(stroke => {
      combined.push(stroke.map(([x, y]) => [x + offsetX, y]));
    });
  });
  return combined;
}

let activeBtn   = null;
let animId      = null;
let loopId      = null;
let strokeEls   = [];
let strokeIndex = 0;
let strokeProg  = 0;
let isRunning   = false;
let lastTs      = 0;

const LS_KEY = 'hw_active';

function svgEl(tag, attrs) {
  const e = document.createElementNS(ns, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function ns_path(d, stroke, sw, dash) {
  const p = svgEl('path', { d, fill: 'none', stroke, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  if (dash) p.setAttribute('stroke-dasharray', dash);
  return p;
}

function pathLen(d) {
  const tmp = svgEl('path', { d });
  canvas.appendChild(tmp);
  const l = tmp.getTotalLength();
  canvas.removeChild(tmp);
  return l;
}

function clearAll() {
  cancelAnimationFrame(animId);
  clearTimeout(loopId);
  while (canvas.firstChild) canvas.removeChild(canvas.firstChild);
  strokeEls   = [];
  strokeIndex = 0;
  strokeProg  = 0;
  isRunning   = false;
}

function startStrokes(strokes, displayChar) {
  clearAll();
  if (!strokes || strokes.length === 0) return;

  const bgEl = svgEl('text', {
    x: CX, y: BASE + 15,
    'font-size': 210,
    'font-family': 'Georgia, serif',
    fill: '#e8eaf6',
    opacity: 0.07,
    'text-anchor': 'middle'
  });
  bgEl.textContent = displayChar;
  canvas.appendChild(bgEl);

  strokes.forEach(pts => {
    canvas.appendChild(ns_path(smooth(pts), '#c5cce8', 1.5, '5,4'));
  });

  strokes.forEach((pts, i) => {
    const d   = smooth(pts);
    const len = pathLen(d);
    const p   = ns_path(d, '#1a1a2e', 5.5, null);
    p.style.strokeDasharray  = len;
    p.style.strokeDashoffset = len;
    canvas.appendChild(p);
    strokeEls.push({ el: p, len, d });

    const numEl = svgEl('text', {
      x: pts[0][0] - 14, y: pts[0][1] - 9,
      'font-size': 12, 'font-family': 'sans-serif',
      fill: '#e53935', 'font-weight': 'bold'
    });
    numEl.textContent = i + 1;
    canvas.appendChild(numEl);

    canvas.appendChild(svgEl('circle', { cx: pts[0][0], cy: pts[0][1], r: 5, fill: '#e5393560' }));
  });

  const cursor = svgEl('circle', { cx: -30, cy: -30, r: 9, fill: '#e53935' });
  canvas.appendChild(cursor);
  canvas._cursor = cursor;

  const nameEl = svgEl('text', {
    x: VW - 55, y: BASE + 10,
    'font-size': 26, 'font-family': 'Georgia, serif',
    fill: '#3344aa', opacity: 0.45, 'text-anchor': 'middle'
  });
  nameEl.textContent = displayChar;
  canvas.appendChild(nameEl);

  label.textContent = `Writing "${displayChar}" — ${strokes.length} stroke${strokes.length !== 1 ? 's' : ''}`;

  isRunning   = true;
  strokeIndex = 0;
  strokeProg  = 0;
  lastTs      = 0;
  animId      = requestAnimationFrame(tick);
}

function tick(ts) {
  if (!isRunning) return;
  const dt = Math.min((ts - (lastTs || ts)) / 1000, 0.05);
  lastTs = ts;

  if (strokeIndex >= strokeEls.length) {
    isRunning = false;
    const cur = canvas._cursor;
    if (cur) cur.setAttribute('cx', -30);
    loopId = setTimeout(() => {
      strokeEls.forEach(({ el, len }) => { el.style.strokeDashoffset = len; });
      strokeIndex = 0;
      strokeProg  = 0;
      isRunning   = true;
      animId      = requestAnimationFrame(tick);
    }, 900);
    return;
  }

  const { el: pathEl, len, d } = strokeEls[strokeIndex];
  strokeProg += 180 * dt;
  const p = Math.min(strokeProg, len);
  pathEl.style.strokeDashoffset = len - p;

  const tmp = document.createElementNS(ns, 'path');
  tmp.setAttribute('d', d);
  canvas.appendChild(tmp);
  const pt = tmp.getPointAtLength(p);
  canvas.removeChild(tmp);

  const cur = canvas._cursor;
  if (cur) { cur.setAttribute('cx', pt.x); cur.setAttribute('cy', pt.y); }

  if (strokeProg >= len) { strokeIndex++; strokeProg = 0; }

  animId = requestAnimationFrame(tick);
}

function activateBtn(btn) {
  if (activeBtn) activeBtn.classList.remove('active');
  btn.classList.add('active');
  activeBtn = btn;
}

function handleUpperClick(ch, btn) {
  activateBtn(btn);
  const def = STROKES[ch];
  if (!def) return;
  saveState(ch, 'upper');
  startStrokes(def.upper, ch);
}

function handleLowerClick(ch, btn) {
  activateBtn(btn);
  const def = STROKES[ch];
  if (!def) return;
  saveState(ch, 'lower');
  startStrokes(def.lower, ch.toLowerCase());
}

function handleNumClick(numStr, btn) {
  activateBtn(btn);
  saveState(numStr, 'num');
  startStrokes(makeMultiDigitStrokes(numStr), numStr);
}

function saveState(val, mode) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ val, mode })); } catch(e) {}
}

function restoreState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const { val, mode } = JSON.parse(raw);
    if (mode === 'upper') {
      const btn = document.querySelector(`#grid-upper [data-ch="${val}"]`);
      if (btn) handleUpperClick(val, btn);
    } else if (mode === 'lower') {
      const btn = document.querySelector(`#grid-lower [data-ch="${val}"]`);
      if (btn) handleLowerClick(val, btn);
    } else if (mode === 'num') {
      const btn = document.querySelector(`#grid-nums [data-num="${val}"]`);
      if (btn) handleNumClick(val, btn);
    }
  } catch(e) {}
}

const CHARS     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const gridUpper = document.getElementById('grid-upper');
const gridLower = document.getElementById('grid-lower');
const gridNums  = document.getElementById('grid-nums');

CHARS.split('').forEach(ch => {
  const btnU = document.createElement('button');
  btnU.className   = 'char-btn upper-btn';
  btnU.textContent = ch;
  btnU.dataset.ch  = ch;
  btnU.addEventListener('click', () => handleUpperClick(ch, btnU));
  gridUpper.appendChild(btnU);

  const btnL = document.createElement('button');
  btnL.className   = 'char-btn lower-btn';
  btnL.textContent = ch.toLowerCase();
  btnL.dataset.ch  = ch;
  btnL.addEventListener('click', () => handleLowerClick(ch, btnL));
  gridLower.appendChild(btnL);
});

for (let n = 0; n <= 100; n++) {
  const s   = String(n);
  const btn = document.createElement('button');
  btn.className    = 'char-btn num-btn';
  btn.textContent  = s;
  btn.dataset.num  = s;
  btn.addEventListener('click', () => handleNumClick(s, btn));
  gridNums.appendChild(btn);
}

document.addEventListener('keydown', e => {
  const ch = e.key.toUpperCase();
  if (ch.length === 1 && ch >= 'A' && ch <= 'Z') {
    if (e.shiftKey) {
      const btn = gridUpper.querySelector(`[data-ch="${ch}"]`);
      if (btn) btn.click();
    } else {
      const btn = gridLower.querySelector(`[data-ch="${ch}"]`);
      if (btn) btn.click();
    }
  }
});

restoreState();