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
const XMID  = Math.round((CAP  + BASE) / 2);
const TASC  = TOP + 24;
const HW    = 36;

function curveD(pts) {
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

function lineD(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
  return d;
}

function strokeD(s) {
  return s.line ? lineD(s.pts) : curveD(s.pts);
}

function ln(pts) { return { pts, line: true }; }
function cv(pts) { return { pts, line: false }; }

const STROKES = {
  A: {
    upper: [
      ln([[CX, TOP], [CX-70, BASE]]),
      ln([[CX, TOP], [CX+70, BASE]]),
      ln([[CX-40, MID_U+10], [CX+40, MID_U+10]])
    ],
    lower: [
      cv([[CX+HW*0.6, CAP+8], [CX-HW*0.2, CAP-2], [CX-HW, CAP+18], [CX-HW, XMID], [CX-HW, BASE-18], [CX-HW*0.2, BASE+4], [CX+HW*0.6, BASE-4], [CX+HW, XMID+18], [CX+HW, XMID-15]]),
      ln([[CX+HW, CAP-2], [CX+HW, BASE]])
    ]
  },
  B: {
    upper: [
      ln([[CX-50, TOP], [CX-50, BASE]]),
      cv([[CX-50, TOP], [CX+20, TOP], [CX+55, TOP+28], [CX+55, MID_U-5], [CX+20, MID_U], [CX-50, MID_U]]),
      cv([[CX-50, MID_U], [CX+25, MID_U], [CX+58, MID_U+28], [CX+58, BASE-22], [CX+25, BASE], [CX-50, BASE]])
    ],
    lower: [
      ln([[CX-HW, TOP], [CX-HW, BASE]]),
      cv([[CX-HW, XMID-18], [CX-HW*0.05, XMID-32], [CX+HW, XMID-8], [CX+HW, XMID+28], [CX-HW*0.05, BASE+6], [CX-HW, BASE-12]])
    ]
  },
  C: {
    upper: [
      cv([[CX+60, TOP+25], [CX+32, TOP], [CX-2, TOP], [CX-44, TOP+36], [CX-58, MID_U], [CX-44, BASE-36], [CX-2, BASE], [CX+32, BASE], [CX+60, BASE-25]])
    ],
    lower: [
      cv([[CX+HW*0.85, CAP+20], [CX+HW*0.2, CAP-2], [CX-HW*0.4, CAP+4], [CX-HW, XMID-8], [CX-HW, XMID+8], [CX-HW*0.4, BASE-4], [CX+HW*0.2, BASE+2], [CX+HW*0.85, BASE-20]])
    ]
  },
  D: {
    upper: [
      ln([[CX-50, TOP], [CX-50, BASE]]),
      cv([[CX-50, TOP], [CX+18, TOP], [CX+62, TOP+45], [CX+62, BASE-45], [CX+18, BASE], [CX-50, BASE]])
    ],
    lower: [
      cv([[CX+HW, XMID-18], [CX+HW*0.05, XMID-32], [CX-HW, XMID-8], [CX-HW, XMID+28], [CX+HW*0.05, BASE+6], [CX+HW, BASE-12]]),
      ln([[CX+HW, TOP], [CX+HW, BASE]])
    ]
  },
  E: {
    upper: [
      ln([[CX+55, TOP], [CX-50, TOP], [CX-50, BASE], [CX+55, BASE]]),
      ln([[CX-50, MID_U], [CX+36, MID_U]])
    ],
    lower: [
      ln([[CX-HW, XMID+4], [CX+HW, XMID+4]]),
      cv([[CX+HW, XMID-2], [CX+HW*0.3, CAP-4], [CX-HW*0.3, CAP+2], [CX-HW, XMID-2], [CX-HW, XMID+22], [CX-HW*0.3, BASE+4], [CX+HW*0.4, BASE-2], [CX+HW*0.85, BASE-22]])
    ]
  },
  F: {
    upper: [
      ln([[CX+55, TOP], [CX-50, TOP], [CX-50, BASE]]),
      ln([[CX-50, MID_U], [CX+36, MID_U]])
    ],
    lower: [
      cv([[CX+18, TOP+4], [CX, TOP], [CX-16, TOP+14], [CX-16, XMID], [CX-16, BASE]]),
      ln([[CX-30, CAP+6], [CX+14, CAP+6]])
    ]
  },
  G: {
    upper: [
      cv([[CX+60, TOP+25], [CX+32, TOP], [CX-2, TOP], [CX-44, TOP+36], [CX-58, MID_U], [CX-44, BASE-36], [CX-2, BASE], [CX+32, BASE], [CX+60, BASE-25]]),
      ln([[CX+60, BASE-25], [CX+60, MID_U+5], [CX+14, MID_U+5]])
    ],
    lower: [
      cv([[CX+HW*0.6, CAP+8], [CX-HW*0.2, CAP-2], [CX-HW, CAP+18], [CX-HW, XMID], [CX-HW, BASE-18], [CX-HW*0.2, BASE+4], [CX+HW*0.6, BASE-4], [CX+HW, XMID+18], [CX+HW, XMID-15]]),
      cv([[CX+HW, CAP-2], [CX+HW, DESC-22], [CX+HW*0.3, DESC+2], [CX-HW*0.5, DESC-8], [CX-HW*0.85, DESC-22]])
    ]
  },
  H: {
    upper: [
      ln([[CX-50, TOP], [CX-50, BASE]]),
      ln([[CX+50, TOP], [CX+50, BASE]]),
      ln([[CX-50, MID_U], [CX+50, MID_U]])
    ],
    lower: [
      ln([[CX-HW, TOP], [CX-HW, BASE]]),
      cv([[CX-HW, XMID-12], [CX-HW*0.1, XMID-34], [CX+HW*0.7, XMID-26], [CX+HW, XMID+2], [CX+HW, BASE]])
    ]
  },
  I: {
    upper: [
      ln([[CX-36, TOP], [CX+36, TOP]]),
      ln([[CX, TOP], [CX, BASE]]),
      ln([[CX-36, BASE], [CX+36, BASE]])
    ],
    lower: [
      ln([[CX, CAP-2], [CX, BASE]]),
      ln([[CX, TOP+2], [CX, TOP+12]])
    ]
  },
  J: {
    upper: [
      ln([[CX-18, TOP], [CX+40, TOP]]),
      cv([[CX+14, TOP], [CX+14, BASE-25], [CX+2, BASE], [CX-24, BASE-5], [CX-40, BASE-28]])
    ],
    lower: [
      ln([[CX, TOP+2], [CX, TOP+12]]),
      cv([[CX, CAP-2], [CX, DESC-18], [CX-10, DESC+2], [CX-26, DESC-8], [CX-34, DESC-22]])
    ]
  },
  K: {
    upper: [
      ln([[CX-50, TOP], [CX-50, BASE]]),
      ln([[CX+55, TOP], [CX-50, MID_U]]),
      ln([[CX-50, MID_U], [CX+55, BASE]])
    ],
    lower: [
      ln([[CX-HW, TOP], [CX-HW, BASE]]),
      ln([[CX+HW*0.9, XMID-30], [CX-HW, XMID+4]]),
      ln([[CX-HW, XMID+4], [CX+HW, BASE]])
    ]
  },
  L: {
    upper: [
      ln([[CX-38, TOP], [CX-38, BASE], [CX+48, BASE]])
    ],
    lower: [
      cv([[CX, TOP], [CX, BASE-6], [CX+12, BASE]])
    ]
  },
  M: {
    upper: [
      ln([[CX-65, BASE], [CX-65, TOP], [CX, MID_U+20], [CX+65, TOP], [CX+65, BASE]])
    ],
    lower: [
      ln([[CX-HW*1.4, BASE], [CX-HW*1.4, CAP-2]]),
      cv([[CX-HW*1.4, XMID-14], [CX-HW*0.7, XMID-32], [CX-HW*0.05, XMID-22], [CX, XMID+4], [CX, BASE]]),
      cv([[CX, XMID-22], [CX+HW*0.7, XMID-34], [CX+HW*1.3, XMID-18], [CX+HW*1.3, XMID+8], [CX+HW*1.3, BASE]])
    ]
  },
  N: {
    upper: [
      ln([[CX-55, BASE], [CX-55, TOP], [CX+55, BASE], [CX+55, TOP]])
    ],
    lower: [
      ln([[CX-HW, CAP-2], [CX-HW, BASE]]),
      cv([[CX-HW, XMID-12], [CX-HW*0.1, XMID-34], [CX+HW*0.7, XMID-26], [CX+HW, XMID+2], [CX+HW, BASE]])
    ]
  },
  O: {
    upper: [
      cv([[CX, TOP], [CX+55, TOP+30], [CX+68, MID_U], [CX+55, BASE-30], [CX, BASE], [CX-55, BASE-30], [CX-68, MID_U], [CX-55, TOP+30], [CX, TOP]])
    ],
    lower: [
      cv([[CX, CAP-2], [CX+HW*0.95, CAP+14], [CX+HW, XMID], [CX+HW*0.95, BASE-14], [CX, BASE+2], [CX-HW*0.95, BASE-14], [CX-HW, XMID], [CX-HW*0.95, CAP+14], [CX, CAP-2]])
    ]
  },
  P: {
    upper: [
      ln([[CX-50, TOP], [CX-50, BASE]]),
      cv([[CX-50, TOP], [CX+20, TOP], [CX+55, TOP+28], [CX+55, MID_U-5], [CX+20, MID_U], [CX-50, MID_U]])
    ],
    lower: [
      ln([[CX-HW, CAP-2], [CX-HW, DESC]]),
      cv([[CX-HW, XMID-18], [CX-HW*0.05, XMID-32], [CX+HW, XMID-8], [CX+HW, XMID+28], [CX-HW*0.05, BASE+6], [CX-HW, BASE-12]])
    ]
  },
  Q: {
    upper: [
      cv([[CX, TOP], [CX+55, TOP+30], [CX+68, MID_U], [CX+55, BASE-30], [CX, BASE], [CX-55, BASE-30], [CX-68, MID_U], [CX-55, TOP+30], [CX, TOP]]),
      ln([[CX+26, MID_U+48], [CX+64, BASE+25]])
    ],
    lower: [
      cv([[CX+HW, XMID-18], [CX+HW*0.05, XMID-32], [CX-HW, XMID-8], [CX-HW, XMID+28], [CX+HW*0.05, BASE+6], [CX+HW, BASE-12]]),
      ln([[CX+HW, CAP-2], [CX+HW, DESC+6], [CX+HW+12, DESC+10]])
    ]
  },
  R: {
    upper: [
      ln([[CX-50, TOP], [CX-50, BASE]]),
      cv([[CX-50, TOP], [CX+20, TOP], [CX+55, TOP+28], [CX+55, MID_U-5], [CX+20, MID_U], [CX-50, MID_U]]),
      ln([[CX+10, MID_U], [CX+58, BASE]])
    ],
    lower: [
      ln([[CX-HW*0.7, CAP-2], [CX-HW*0.7, BASE]]),
      cv([[CX-HW*0.7, XMID-14], [CX-HW*0.1, XMID-32], [CX+HW*0.7, XMID-26]])
    ]
  },
  S: {
    upper: [
      cv([[CX+55, TOP+25], [CX+26, TOP], [CX-6, TOP], [CX-42, TOP+28], [CX-42, MID_U-15], [CX, MID_U], [CX+42, MID_U+15], [CX+42, BASE-28], [CX+6, BASE], [CX-26, BASE], [CX-55, BASE-25]])
    ],
    lower: [
      cv([[CX+HW*0.85, CAP+18], [CX+HW*0.3, CAP-2], [CX-HW*0.4, CAP+6], [CX-HW*0.55, XMID-10], [CX-HW*0.1, XMID], [CX+HW*0.5, XMID+12], [CX+HW*0.6, XMID+24], [CX+HW*0.4, BASE-4], [CX-HW*0.3, BASE+4], [CX-HW*0.85, BASE-18]])
    ]
  },
  T: {
    upper: [
      ln([[CX-60, TOP], [CX+60, TOP]]),
      ln([[CX, TOP], [CX, BASE]])
    ],
    lower: [
      cv([[CX, TASC], [CX, BASE-8], [CX+14, BASE]]),
      ln([[CX-22, CAP+6], [CX+22, CAP+6]])
    ]
  },
  U: {
    upper: [
      cv([[CX-55, TOP], [CX-55, BASE-30], [CX-30, BASE], [CX, BASE+5], [CX+30, BASE], [CX+55, BASE-30], [CX+55, TOP]])
    ],
    lower: [
      cv([[CX-HW, CAP-2], [CX-HW, BASE-18], [CX-HW*0.3, BASE+4], [CX+HW*0.5, BASE-2], [CX+HW, XMID+10]]),
      ln([[CX+HW, CAP-2], [CX+HW, BASE]])
    ]
  },
  V: {
    upper: [
      ln([[CX-58, TOP], [CX, BASE], [CX+58, TOP]])
    ],
    lower: [
      ln([[CX-HW, CAP-2], [CX, BASE], [CX+HW, CAP-2]])
    ]
  },
  W: {
    upper: [
      ln([[CX-65, TOP], [CX-32, BASE], [CX, MID_U+28], [CX+32, BASE], [CX+65, TOP]])
    ],
    lower: [
      ln([[CX-HW*1.3, CAP-2], [CX-HW*0.65, BASE], [CX, XMID-10], [CX+HW*0.65, BASE], [CX+HW*1.3, CAP-2]])
    ]
  },
  X: {
    upper: [
      ln([[CX-55, TOP], [CX+55, BASE]]),
      ln([[CX+55, TOP], [CX-55, BASE]])
    ],
    lower: [
      ln([[CX-HW, CAP-2], [CX+HW, BASE]]),
      ln([[CX+HW, CAP-2], [CX-HW, BASE]])
    ]
  },
  Y: {
    upper: [
      ln([[CX-55, TOP], [CX, MID_U]]),
      ln([[CX+55, TOP], [CX, MID_U], [CX, BASE]])
    ],
    lower: [
      ln([[CX-HW, CAP-2], [CX, XMID+10]]),
      cv([[CX+HW, CAP-2], [CX, XMID+10], [CX-HW*0.4, DESC-2], [CX-HW*0.9, DESC-14]])
    ]
  },
  Z: {
    upper: [
      ln([[CX-55, TOP], [CX+55, TOP], [CX-55, BASE], [CX+55, BASE]])
    ],
    lower: [
      ln([[CX-HW*0.85, CAP+2], [CX+HW*0.85, CAP+2], [CX-HW*0.85, BASE-2], [CX+HW*0.85, BASE-2]])
    ]
  }
};

const DIGIT_STROKES = {
  '0': [cv([[CX,TOP],[CX+55,TOP+30],[CX+65,MID_U],[CX+55,BASE-30],[CX,BASE],[CX-55,BASE-30],[CX-65,MID_U],[CX-55,TOP+30],[CX,TOP]])],
  '1': [ln([[CX-18,TOP+28],[CX+10,TOP],[CX+10,BASE]]),ln([[CX-22,BASE],[CX+38,BASE]])],
  '2': [cv([[CX-42,TOP+28],[CX-22,TOP],[CX+22,TOP],[CX+46,TOP+28],[CX+46,MID_U-8]]),ln([[CX+46,MID_U-8],[CX-42,BASE],[CX+48,BASE]])],
  '3': [cv([[CX-42,TOP+18],[CX,TOP],[CX+40,TOP+22],[CX+40,MID_U-10],[CX,MID_U]]),cv([[CX,MID_U],[CX+44,MID_U+18],[CX+44,BASE-18],[CX,BASE],[CX-42,BASE-18]])],
  '4': [ln([[CX+30,BASE],[CX+30,TOP],[CX-42,MID_U+18],[CX+48,MID_U+18]])],
  '5': [ln([[CX+40,TOP],[CX-38,TOP],[CX-42,MID_U-5]]),cv([[CX-42,MID_U-5],[CX+12,MID_U-5],[CX+44,MID_U+22],[CX+44,BASE-22],[CX+12,BASE],[CX-38,BASE-18]])],
  '6': [cv([[CX+40,TOP+20],[CX+16,TOP],[CX-16,TOP],[CX-46,TOP+32],[CX-52,MID_U],[CX-46,BASE-28],[CX-10,BASE],[CX+22,BASE],[CX+48,BASE-28],[CX+48,MID_U+20],[CX+22,MID_U-5],[CX-10,MID_U-5],[CX-46,MID_U+20]])],
  '7': [ln([[CX-44,TOP],[CX+48,TOP],[CX-8,BASE]])],
  '8': [cv([[CX,MID_U],[CX+42,TOP+42],[CX+42,TOP+22],[CX+24,TOP],[CX,TOP],[CX-24,TOP],[CX-42,TOP+22],[CX-42,TOP+42],[CX,MID_U],[CX+46,MID_U+32],[CX+46,BASE-22],[CX+24,BASE],[CX,BASE],[CX-24,BASE],[CX-46,BASE-22],[CX-46,MID_U+32],[CX,MID_U]])],
  '9': [cv([[CX-48,BASE-20],[CX-24,BASE],[CX+10,BASE],[CX+46,BASE-32],[CX+52,MID_U],[CX+46,TOP+40],[CX+10,TOP+5],[CX-24,TOP+5],[CX-46,TOP+40],[CX-46,MID_U+20],[CX-24,MID_U+5],[CX+10,MID_U+5],[CX+46,MID_U+20]])]
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
      combined.push({ pts: stroke.pts.map(([x, y]) => [x + offsetX, y]), line: stroke.line });
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

  strokes.forEach(s => {
    canvas.appendChild(ns_path(strokeD(s), '#c5cce8', 1.5, '5,4'));
  });

  strokes.forEach((s, i) => {
    const pts = s.pts;
    const d   = strokeD(s);
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