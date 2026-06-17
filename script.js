const canvas = document.getElementById('canvas');
const label  = document.getElementById('board-label');
const ns     = 'http://www.w3.org/2000/svg';

const VW   = 900;
const TOP  = 40;
const CAP  = 100;
const BASE = 220;
const DESC = 280;
const CX   = 450;

const MID_U = Math.round((TOP  + BASE) / 2);
const MID_L = Math.round((CAP  + BASE) / 2);

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
      [[CX, TOP], [CX-70, BASE]],
      [[CX, TOP], [CX+70, BASE]],
      [[CX-40, MID_U+10], [CX+40, MID_U+10]]
    ],
    lower: [
      [[CX+10, CAP+5], [CX-15, CAP+5], [CX-38, CAP+30], [CX-38, MID_L+20], [CX-15, BASE], [CX+10, BASE], [CX+32, MID_L+20], [CX+32, CAP+5]],
      [[CX+32, CAP+5], [CX+32, BASE]]
    ]
  },
  B: {
    upper: [
      [[CX-50, TOP], [CX-50, BASE]],
      [[CX-50, TOP], [CX+20, TOP], [CX+55, TOP+28], [CX+55, MID_U-5], [CX+20, MID_U], [CX-50, MID_U]],
      [[CX-50, MID_U], [CX+25, MID_U], [CX+58, MID_U+28], [CX+58, BASE-22], [CX+25, BASE], [CX-50, BASE]]
    ],
    lower: [
      [[CX-25, TOP], [CX-25, BASE]],
      [[CX-25, MID_L-5], [CX+2, CAP+2], [CX+28, CAP+2], [CX+48, CAP+22], [CX+48, MID_L+18], [CX+28, BASE], [CX+2, BASE], [CX-25, MID_L+20]]
    ]
  },
  C: {
    upper: [
      [[CX+60, TOP+25], [CX+32, TOP], [CX-2, TOP], [CX-44, TOP+36], [CX-58, MID_U], [CX-44, BASE-36], [CX-2, BASE], [CX+32, BASE], [CX+60, BASE-25]]
    ],
    lower: [
      [[CX+46, CAP+14], [CX+24, CAP+2], [CX, CAP+2], [CX-22, CAP+22], [CX-32, MID_L+10], [CX-22, BASE-8], [CX, BASE], [CX+24, BASE], [CX+46, BASE-14]]
    ]
  },
  D: {
    upper: [
      [[CX-50, TOP], [CX-50, BASE]],
      [[CX-50, TOP], [CX+18, TOP], [CX+62, TOP+45], [CX+62, BASE-45], [CX+18, BASE], [CX-50, BASE]]
    ],
    lower: [
      [[CX+38, TOP], [CX+38, BASE]],
      [[CX+38, MID_L], [CX+15, CAP+2], [CX-8, CAP+2], [CX-32, CAP+22], [CX-32, MID_L+35], [CX-8, BASE], [CX+15, BASE], [CX+38, MID_L+30]]
    ]
  },
  E: {
    upper: [
      [[CX+55, TOP], [CX-50, TOP], [CX-50, BASE], [CX+55, BASE]],
      [[CX-50, MID_U], [CX+36, MID_U]]
    ],
    lower: [
      [[CX-30, MID_L+5], [CX+36, MID_L+5]],
      [[CX+36, MID_L+5], [CX+36, CAP+10], [CX+10, CAP+2], [CX-14, CAP+10], [CX-30, CAP+30], [CX-30, MID_L+30], [CX-14, BASE-8], [CX+10, BASE], [CX+36, BASE-14]]
    ]
  },
  F: {
    upper: [
      [[CX+55, TOP], [CX-50, TOP], [CX-50, BASE]],
      [[CX-50, MID_U], [CX+36, MID_U]]
    ],
    lower: [
      [[CX+30, CAP+10], [CX+14, CAP+2], [CX-2, CAP+14], [CX-2, BASE+20]],
      [[CX-22, MID_L], [CX+22, MID_L]]
    ]
  },
  G: {
    upper: [
      [[CX+60, TOP+25], [CX+32, TOP], [CX-2, TOP], [CX-44, TOP+36], [CX-58, MID_U], [CX-44, BASE-36], [CX-2, BASE], [CX+32, BASE], [CX+60, BASE-25], [CX+60, MID_U+5], [CX+14, MID_U+5]]
    ],
    lower: [
      [[CX+46, CAP+14], [CX+24, CAP+2], [CX, CAP+2], [CX-22, CAP+22], [CX-32, MID_L+10], [CX-22, BASE-8], [CX, BASE], [CX+24, BASE], [CX+46, BASE-12], [CX+46, DESC-10], [CX+24, DESC+5], [CX, DESC]]
    ]
  },
  H: {
    upper: [
      [[CX-50, TOP], [CX-50, BASE]],
      [[CX+50, TOP], [CX+50, BASE]],
      [[CX-50, MID_U], [CX+50, MID_U]]
    ],
    lower: [
      [[CX-25, TOP], [CX-25, BASE]],
      [[CX-25, MID_L+5], [CX+2, CAP+2], [CX+30, CAP+2], [CX+48, CAP+20], [CX+48, BASE]]
    ]
  },
  I: {
    upper: [
      [[CX-36, TOP], [CX+36, TOP]],
      [[CX, TOP], [CX, BASE]],
      [[CX-36, BASE], [CX+36, BASE]]
    ],
    lower: [
      [[CX, CAP+2], [CX, CAP+6]],
      [[CX, CAP+16], [CX, BASE]]
    ]
  },
  J: {
    upper: [
      [[CX-18, TOP], [CX+40, TOP]],
      [[CX+14, TOP], [CX+14, BASE-25], [CX+2, BASE], [CX-24, BASE-5], [CX-40, BASE-28]]
    ],
    lower: [
      [[CX+12, CAP+2], [CX+12, CAP+6]],
      [[CX+12, CAP+16], [CX+12, DESC-10], [CX-2, DESC+5], [CX-20, DESC], [CX-28, DESC-18]]
    ]
  },
  K: {
    upper: [
      [[CX-50, TOP], [CX-50, BASE]],
      [[CX+55, TOP], [CX-50, MID_U]],
      [[CX-50, MID_U], [CX+55, BASE]]
    ],
    lower: [
      [[CX-25, TOP], [CX-25, BASE]],
      [[CX+42, CAP+2], [CX-25, MID_L+18]],
      [[CX-25, MID_L+18], [CX+42, BASE]]
    ]
  },
  L: {
    upper: [
      [[CX-38, TOP], [CX-38, BASE], [CX+48, BASE]]
    ],
    lower: [
      [[CX-14, TOP], [CX-14, BASE], [CX+34, BASE]]
    ]
  },
  M: {
    upper: [
      [[CX-65, BASE], [CX-65, TOP], [CX, MID_U+20], [CX+65, TOP], [CX+65, BASE]]
    ],
    lower: [
      [[CX-32, BASE], [CX-32, CAP+2]],
      [[CX-32, CAP+2], [CX-12, CAP+2], [CX+4, MID_L+8], [CX+4, BASE]],
      [[CX+4, CAP+2], [CX+24, CAP+2], [CX+42, MID_L+8], [CX+42, BASE]]
    ]
  },
  N: {
    upper: [
      [[CX-55, BASE], [CX-55, TOP], [CX+55, BASE], [CX+55, TOP]]
    ],
    lower: [
      [[CX-26, BASE], [CX-26, CAP+2]],
      [[CX-26, CAP+2], [CX+5, CAP+2], [CX+42, MID_L+20], [CX+42, CAP+2]],
      [[CX+42, CAP+2], [CX+42, BASE]]
    ]
  },
  O: {
    upper: [
      [[CX, TOP], [CX+55, TOP+30], [CX+68, MID_U], [CX+55, BASE-30], [CX, BASE], [CX-55, BASE-30], [CX-68, MID_U], [CX-55, TOP+30], [CX, TOP]]
    ],
    lower: [
      [[CX, CAP+2], [CX+38, CAP+10], [CX+50, MID_L+15], [CX+50, MID_L+35], [CX+38, BASE], [CX, BASE], [CX-38, BASE], [CX-50, MID_L+35], [CX-50, MID_L+15], [CX-38, CAP+10], [CX, CAP+2]]
    ]
  },
  P: {
    upper: [
      [[CX-50, TOP], [CX-50, BASE]],
      [[CX-50, TOP], [CX+20, TOP], [CX+55, TOP+28], [CX+55, MID_U-5], [CX+20, MID_U], [CX-50, MID_U]]
    ],
    lower: [
      [[CX-25, CAP+2], [CX-25, DESC+5]],
      [[CX-25, CAP+2], [CX+8, CAP+2], [CX+44, CAP+22], [CX+44, MID_L+32], [CX+8, BASE], [CX-25, BASE]]
    ]
  },
  Q: {
    upper: [
      [[CX, TOP], [CX+55, TOP+30], [CX+68, MID_U], [CX+55, BASE-30], [CX, BASE], [CX-55, BASE-30], [CX-68, MID_U], [CX-55, TOP+30], [CX, TOP]],
      [[CX+26, MID_U+48], [CX+64, BASE+25]]
    ],
    lower: [
      [[CX, CAP+2], [CX+38, CAP+10], [CX+50, MID_L+15], [CX+50, MID_L+35], [CX+38, BASE], [CX, BASE], [CX-38, BASE], [CX-50, MID_L+35], [CX-50, MID_L+15], [CX-38, CAP+10], [CX, CAP+2]],
      [[CX+26, MID_L+42], [CX+54, DESC+5]]
    ]
  },
  R: {
    upper: [
      [[CX-50, TOP], [CX-50, BASE]],
      [[CX-50, TOP], [CX+20, TOP], [CX+55, TOP+28], [CX+55, MID_U-5], [CX+20, MID_U], [CX-50, MID_U]],
      [[CX+10, MID_U], [CX+58, BASE]]
    ],
    lower: [
      [[CX-26, CAP+2], [CX-26, BASE]],
      [[CX-26, CAP+2], [CX, CAP+2], [CX+24, CAP+10], [CX+24, MID_L+5], [CX-26, MID_L+10]]
    ]
  },
  S: {
    upper: [
      [[CX+55, TOP+25], [CX+26, TOP], [CX-6, TOP], [CX-42, TOP+28], [CX-42, MID_U-15], [CX, MID_U], [CX+42, MID_U+15], [CX+42, BASE-28], [CX+6, BASE], [CX-26, BASE], [CX-55, BASE-25]]
    ],
    lower: [
      [[CX+38, CAP+12], [CX+18, CAP+2], [CX-4, CAP+2], [CX-24, CAP+20], [CX-24, MID_L+5], [CX, MID_L+18], [CX+24, MID_L+32], [CX+24, BASE-10], [CX+4, BASE], [CX-18, BASE], [CX-38, BASE-14]]
    ]
  },
  T: {
    upper: [
      [[CX-60, TOP], [CX+60, TOP]],
      [[CX, TOP], [CX, BASE]]
    ],
    lower: [
      [[CX-12, CAP+10], [CX-12, BASE+5], [CX+5, BASE+10]],
      [[CX-32, MID_L], [CX+22, MID_L]]
    ]
  },
  U: {
    upper: [
      [[CX-55, TOP], [CX-55, BASE-30], [CX-30, BASE], [CX, BASE+5], [CX+30, BASE], [CX+55, BASE-30], [CX+55, TOP]]
    ],
    lower: [
      [[CX-26, CAP+2], [CX-26, MID_L+45], [CX-8, BASE], [CX+16, BASE], [CX+42, MID_L+38], [CX+42, CAP+2]]
    ]
  },
  V: {
    upper: [
      [[CX-58, TOP], [CX, BASE], [CX+58, TOP]]
    ],
    lower: [
      [[CX-34, CAP+2], [CX, BASE], [CX+34, CAP+2]]
    ]
  },
  W: {
    upper: [
      [[CX-65, TOP], [CX-32, BASE], [CX, MID_U+28], [CX+32, BASE], [CX+65, TOP]]
    ],
    lower: [
      [[CX-42, CAP+2], [CX-22, BASE], [CX, MID_L+28], [CX+22, BASE], [CX+42, CAP+2]]
    ]
  },
  X: {
    upper: [
      [[CX-55, TOP], [CX+55, BASE]],
      [[CX+55, TOP], [CX-55, BASE]]
    ],
    lower: [
      [[CX-32, CAP+2], [CX+32, BASE]],
      [[CX+32, CAP+2], [CX-32, BASE]]
    ]
  },
  Y: {
    upper: [
      [[CX-55, TOP], [CX, MID_U]],
      [[CX+55, TOP], [CX, MID_U], [CX, BASE]]
    ],
    lower: [
      [[CX-32, CAP+2], [CX, MID_L+22]],
      [[CX+32, CAP+2], [CX, MID_L+22], [CX, DESC+5]]
    ]
  },
  Z: {
    upper: [
      [[CX-55, TOP], [CX+55, TOP], [CX-55, BASE], [CX+55, BASE]]
    ],
    lower: [
      [[CX-32, CAP+2], [CX+32, CAP+2], [CX-32, BASE], [CX+32, BASE]]
    ]
  }
};

const DIGIT_STROKES = {
  '0': [[[CX,TOP],[CX+55,TOP+30],[CX+65,MID_U],[CX+55,BASE-30],[CX,BASE],[CX-55,BASE-30],[CX-65,MID_U],[CX-55,TOP+30],[CX,TOP]]],
  '1': [[[CX-18,TOP+28],[CX+10,TOP],[CX+10,BASE]],[[CX-22,BASE],[CX+38,BASE]]],
  '2': [[[CX-42,TOP+28],[CX-22,TOP],[CX+22,TOP],[CX+46,TOP+28],[CX+46,MID_U-8],[CX-42,BASE],[CX+48,BASE]]],
  '3': [[[CX-42,TOP+18],[CX,TOP],[CX+40,TOP+22],[CX+40,MID_U-10],[CX,MID_U]],[[CX,MID_U],[CX+44,MID_U+18],[CX+44,BASE-18],[CX,BASE],[CX-42,BASE-18]]],
  '4': [[[CX+30,BASE],[CX+30,TOP],[CX-42,MID_U+18],[CX+48,MID_U+18]]],
  '5': [[[CX+40,TOP],[CX-38,TOP],[CX-42,MID_U-5],[CX+12,MID_U-5],[CX+44,MID_U+22],[CX+44,BASE-22],[CX+12,BASE],[CX-38,BASE-18]]],
  '6': [[[CX+40,TOP+20],[CX+16,TOP],[CX-16,TOP],[CX-46,TOP+32],[CX-52,MID_U],[CX-46,BASE-28],[CX-10,BASE],[CX+22,BASE],[CX+48,BASE-28],[CX+48,MID_U+20],[CX+22,MID_U-5],[CX-10,MID_U-5],[CX-46,MID_U+20]]],
  '7': [[[CX-44,TOP],[CX+48,TOP],[CX-8,BASE]]],
  '8': [[[CX,MID_U],[CX+42,TOP+42],[CX+42,TOP+22],[CX+24,TOP],[CX,TOP],[CX-24,TOP],[CX-42,TOP+22],[CX-42,TOP+42],[CX,MID_U],[CX+46,MID_U+32],[CX+46,BASE-22],[CX+24,BASE],[CX,BASE],[CX-24,BASE],[CX-46,BASE-22],[CX-46,MID_U+32],[CX,MID_U]]],
  '9': [[[CX-48,BASE-20],[CX-24,BASE],[CX+10,BASE],[CX+46,BASE-32],[CX+52,MID_U],[CX+46,TOP+40],[CX+10,TOP+5],[CX-24,TOP+5],[CX-46,TOP+40],[CX-46,MID_U+20],[CX-24,MID_U+5],[CX+10,MID_U+5],[CX+46,MID_U+20]]]
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
    x: CX, y: BASE + 18,
    'font-size': 230,
    'font-family': 'Arial, sans-serif',
    fill: '#e8eaf6',
    opacity: 0.06,
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