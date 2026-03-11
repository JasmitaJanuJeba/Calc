import * as math from 'mathjs'

const linspace = (a, b, n = 100) => Array.from({length: n}, (_, i) => a + (b - a) * i / (n - 1))

const nc = (expected, tol = 0.03) => (input) => {
  try {
    const val = +math.evaluate(String(input).trim())
    if (!isFinite(val)) return false
    return Math.abs(val - expected) <= Math.max(0.02, Math.abs(expected) * tol)
  } catch { return false }
}

const BG = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: '#080818',
  font: { color: '#94a3b8', size: 11, family: 'Inter, sans-serif' },
  margin: { l: 44, r: 8, t: 8, b: 40 },
  xaxis: { gridcolor: '#1a1a3a', zerolinecolor: '#2a2a5a' },
  yaxis: { gridcolor: '#1a1a3a', zerolinecolor: '#2a2a5a' },
  showlegend: false,
}

// ─────────────────────────────────────────────
// FAMILY 1: Sliding Ladder (Related Rates + Geometry)
// ─────────────────────────────────────────────
function makeLadder({ id, title, L, x0, dxdt, real, difficultyVal = 2 }) {
  const y0 = Math.sqrt(L * L - x0 * x0)
  const answer = -x0 / y0 * dxdt
  const absAns = Math.abs(answer)
  return {
    id,
    title,
    emoji: '🪜',
    difficulty: difficultyVal,
    color: '#8b5cf6',
    topics: ['Related Rates', 'Implicit Differentiation', 'Pythagorean Theorem'],
    realWorld: real,
    connectionNote: `This problem bridges Related Rates and Geometry: the Pythagorean constraint x²+y²=L² creates an implicit relationship between x and y. Differentiating with respect to time t transforms a static geometric equation into a dynamic rate equation, showing how calculus extends geometry into motion.`,
    intro: `A ${L}-foot ladder leans against a vertical wall. The base slides away from the wall at ${dxdt} ft/s. At the moment when the base is ${x0} ft from the wall, how fast is the top sliding down?`,
    question: `Find dy/dt (ft/s) when x = ${x0} ft. (Negative = sliding down)`,
    latex: `x^2 + y^2 = ${L}^2,\\quad \\frac{dx}{dt} = ${dxdt}\\text{ ft/s},\\quad x = ${x0}`,
    answerLatex: `\\frac{dy}{dt} = -\\frac{x}{y}\\cdot\\frac{dx}{dt} = -\\frac{${x0}}{${y0.toFixed(2)}}\\cdot ${dxdt} \\approx ${answer.toFixed(3)}`,
    answer: answer,
    unit: 'ft/s',
    check: nc(answer),
    slider: { min: 0.5, max: L - 0.5, step: 0.5, default: x0, label: (v) => `x = ${v} ft` },
    getSetupGraph: (sv) => {
      const xv = Math.min(Math.max(sv, 0.1), L - 0.1)
      const yv = Math.sqrt(Math.max(L * L - xv * xv, 0))
      return {
        data: [
          { x: [0, 0], y: [0, L + 1], mode: 'lines', line: { color: '#475569', width: 3 }, name: 'Wall' },
          { x: [0, L + 1], y: [0, 0], mode: 'lines', line: { color: '#475569', width: 3 }, name: 'Floor' },
          { x: [xv, 0], y: [0, yv], mode: 'lines', line: { color: '#8b5cf6', width: 4 }, name: 'Ladder' },
          { x: [xv], y: [0], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: 'Base' },
          { x: [0], y: [yv], mode: 'markers', marker: { color: '#ec4899', size: 12, symbol: 'circle' }, name: 'Top' },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'x (ft)', range: [-1, L + 2] }, yaxis: { ...BG.yaxis, title: 'y (ft)', range: [-1, L + 2] } }
      }
    },
    hints: [
      { title: 'Set up the constraint', text: 'The ladder has fixed length L, so the Pythagorean theorem gives x² + y² = L² at all times.' },
      { title: 'Differentiate implicitly', formula: `2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0` },
      { title: 'Solve for dy/dt', formula: `\\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt}` },
      { title: 'Find y₀ first', formula: `y_0 = \\sqrt{${L}^2 - ${x0}^2} = \\sqrt{${L*L - x0*x0}} = ${y0.toFixed(4)}` },
    ],
    solution: [
      { title: 'Pythagorean Constraint', text: `The ladder length L=${L} ft is constant, so at all times:`, formula: `x^2 + y^2 = ${L}^2` },
      { title: 'Implicit Differentiation', text: 'Differentiate both sides with respect to time t:', formula: `2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0` },
      { title: 'Solve for dy/dt', formula: `\\frac{dy}{dt} = -\\frac{x}{y}\\cdot\\frac{dx}{dt}` },
      {
        title: 'Compute y₀ and substitute',
        formula: `y_0 = \\sqrt{${L}^2 - ${x0}^2} = ${y0.toFixed(4)},\\quad \\frac{dy}{dt} = -\\frac{${x0}}{${y0.toFixed(4)}}\\times ${dxdt} = ${answer.toFixed(4)}\\text{ ft/s}`,
        graph: (() => {
          const xs = linspace(0.1, L - 0.1, 200)
          const dydt = xs.map(x => -x / Math.sqrt(Math.max(L*L - x*x, 0.0001)) * dxdt)
          return {
            data: [
              { x: xs, y: dydt, mode: 'lines', line: { color: '#8b5cf6', width: 3 }, name: 'dy/dt vs x' },
              { x: [x0], y: [answer], mode: 'markers', marker: { color: '#f59e0b', size: 14, symbol: 'star' }, name: 'Answer' },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 'x (ft)' }, yaxis: { ...BG.yaxis, title: 'dy/dt (ft/s)' } }
          }
        })()
      },
    ]
  }
}

const ladderParams = [
  { id: 'cross-ladder-1', title: 'The Sliding Ladder', L: 10, x0: 6, dxdt: 2, real: 'Construction site safety analysis', difficultyVal: 2 },
  { id: 'cross-ladder-2', title: "The Firefighter's Ladder", L: 13, x0: 5, dxdt: 3, real: 'Fire rescue operations', difficultyVal: 2 },
  { id: 'cross-ladder-3', title: 'The Window Washer', L: 15, x0: 9, dxdt: 2, real: 'Building maintenance engineering', difficultyVal: 2 },
  { id: 'cross-ladder-4', title: "The Painter's Ladder", L: 17, x0: 8, dxdt: 1, real: 'Residential painting safety', difficultyVal: 2 },
  { id: 'cross-ladder-5', title: 'The Construction Crane', L: 20, x0: 12, dxdt: 2, real: 'Heavy construction lifting', difficultyVal: 3 },
  { id: 'cross-ladder-6', title: 'The Rescue Ladder', L: 26, x0: 10, dxdt: 3, real: 'Emergency rescue operations', difficultyVal: 3 },
  { id: 'cross-ladder-7', title: "The Gymnast's Beam", L: 10, x0: 8, dxdt: 3, real: 'Sports biomechanics', difficultyVal: 3 },
  { id: 'cross-ladder-8', title: 'The Dock Plank', L: 13, x0: 12, dxdt: 2, real: 'Maritime engineering', difficultyVal: 3 },
  { id: 'cross-ladder-9', title: 'The Greenhouse Prop', L: 15, x0: 12, dxdt: 1, real: 'Agricultural structure design', difficultyVal: 2 },
  { id: 'cross-ladder-10', title: 'The Mine Shaft Support', L: 20, x0: 16, dxdt: 2, real: 'Mining safety engineering', difficultyVal: 3 },
]


// ─────────────────────────────────────────────
// FAMILY 2: Optimal Can (Optimization + Geometry)
// ─────────────────────────────────────────────
function makeOptimalCan({ id, title, V, real, difficultyVal = 2 }) {
  const rOpt = Math.pow(V / (2 * Math.PI), 1 / 3)
  const SrOpt = 2 * Math.PI * rOpt * rOpt + 2 * V / rOpt
  return {
    id,
    title,
    emoji: '🥫',
    difficulty: difficultyVal,
    color: '#10b981',
    topics: ['Optimization', 'Derivatives', 'Geometry', 'Surface Area'],
    realWorld: real,
    connectionNote: `Optimization meets geometry: the surface area formula S(r) = 2πr² + 2πrh combines a circle and rectangle. Setting S'(r)=0 uses derivatives to minimize material cost—a direct application of calculus to industrial design. The optimal can has h=2r (height equals diameter).`,
    intro: `A cylindrical can must hold exactly ${V} cm³ of liquid. Find the radius r (cm) that minimizes the total surface area S = 2πr² + 2πrh, where the volume constraint V = πr²h fixes the height as h = V/(πr²).`,
    question: `Find the radius r (cm) that minimizes surface area. Round to 4 decimal places.`,
    latex: `S(r) = 2\\pi r^2 + \\frac{2V}{r} = 2\\pi r^2 + \\frac{${2*V}}{r}`,
    answerLatex: `r^* = \\left(\\frac{V}{2\\pi}\\right)^{1/3} = \\left(\\frac{${V}}{2\\pi}\\right)^{1/3} \\approx ${rOpt.toFixed(4)}\\text{ cm}`,
    answer: rOpt,
    unit: 'cm',
    check: nc(rOpt),
    slider: { min: 0.5, max: 8, step: 0.1, default: rOpt.toFixed(1) * 1 || 3, label: (v) => `r = ${v} cm` },
    getSetupGraph: (sv) => {
      const rs = linspace(0.5, 8, 200)
      const Ss = rs.map(r => 2 * Math.PI * r * r + 2 * V / r)
      const Scur = 2 * Math.PI * sv * sv + 2 * V / sv
      return {
        data: [
          { x: rs, y: Ss, mode: 'lines', line: { color: '#10b981', width: 3 }, name: 'S(r)' },
          { x: [sv], y: [Scur], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: 'Current r' },
          { x: [rOpt], y: [SrOpt], mode: 'markers', marker: { color: '#ec4899', size: 14, symbol: 'star' }, name: 'Optimal' },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'r (cm)' }, yaxis: { ...BG.yaxis, title: 'S (cm²)' } }
      }
    },
    hints: [
      { title: 'Substitute the constraint', text: 'From V = πr²h, we get h = V/(πr²). Substitute into S.', formula: `S(r) = 2\\pi r^2 + 2\\pi r \\cdot \\frac{V}{\\pi r^2} = 2\\pi r^2 + \\frac{2V}{r}` },
      { title: 'Differentiate S(r)', formula: `S'(r) = 4\\pi r - \\frac{2V}{r^2}` },
      { title: 'Set S\'(r) = 0', formula: `4\\pi r = \\frac{2V}{r^2} \\Rightarrow r^3 = \\frac{V}{2\\pi}` },
      { title: 'Solve for r*', formula: `r^* = \\left(\\frac{${V}}{2\\pi}\\right)^{1/3}` },
    ],
    solution: [
      { title: 'Express h in terms of r', formula: `V = \\pi r^2 h \\Rightarrow h = \\frac{V}{\\pi r^2} = \\frac{${V}}{\\pi r^2}` },
      { title: 'Surface Area as function of r', formula: `S(r) = 2\\pi r^2 + 2\\pi r \\cdot \\frac{${V}}{\\pi r^2} = 2\\pi r^2 + \\frac{${2*V}}{r}` },
      { title: 'Find critical point', formula: `S'(r) = 4\\pi r - \\frac{${2*V}}{r^2} = 0 \\Rightarrow r^3 = \\frac{${V}}{2\\pi}` },
      {
        title: 'Optimal radius and verification',
        formula: `r^* = \\left(\\frac{${V}}{2\\pi}\\right)^{1/3} \\approx ${rOpt.toFixed(4)}\\text{ cm},\\quad h^* = \\frac{${V}}{\\pi(${rOpt.toFixed(4)})^2} \\approx ${(V / (Math.PI * rOpt * rOpt)).toFixed(4)}\\text{ cm}`,
        note: `Note: at the optimum, h = 2r — the can height equals its diameter!`,
        graph: (() => {
          const rs = linspace(0.5, 8, 200)
          const Ss = rs.map(r => 2 * Math.PI * r * r + 2 * V / r)
          return {
            data: [
              { x: rs, y: Ss, mode: 'lines', line: { color: '#10b981', width: 3 }, name: 'S(r)' },
              { x: [rOpt], y: [SrOpt], mode: 'markers', marker: { color: '#ec4899', size: 14, symbol: 'star' }, name: `r* = ${rOpt.toFixed(2)}` },
              { x: [rOpt, rOpt], y: [0, SrOpt], mode: 'lines', line: { color: '#ec4899', width: 2, dash: 'dash' }, name: '' },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 'r (cm)' }, yaxis: { ...BG.yaxis, title: 'S (cm²)' } }
          }
        })()
      },
    ]
  }
}

const canParams = [
  { id: 'cross-can-1', title: 'The Mini Pill Container', V: 100, real: 'Pharmaceutical packaging', difficultyVal: 1 },
  { id: 'cross-can-2', title: 'The Soda Can', V: 200, real: 'Beverage industry design', difficultyVal: 1 },
  { id: 'cross-can-3', title: 'The Soup Can', V: 300, real: 'Food packaging optimization', difficultyVal: 2 },
  { id: 'cross-can-4', title: 'The Standard Soda Can', V: 355, real: 'Standard 12oz can design', difficultyVal: 2 },
  { id: 'cross-can-5', title: 'The Pint Can', V: 500, real: 'Paint and chemical storage', difficultyVal: 2 },
  { id: 'cross-can-6', title: 'The Paint Can', V: 750, real: 'Hardware industry', difficultyVal: 2 },
  { id: 'cross-can-7', title: 'The 1-Liter Bottle', V: 1000, real: 'Liquid container design', difficultyVal: 2 },
  { id: 'cross-can-8', title: 'The 1.5-Liter Bottle', V: 1500, real: 'Large beverage packaging', difficultyVal: 3 },
]


// ─────────────────────────────────────────────
// FAMILY 3: Rocket Height (Integration + Physics)
// ─────────────────────────────────────────────
function makeRocket({ id, title, v0, real, difficultyVal = 2 }) {
  const tmax = v0 / 32
  const hmax = v0 * v0 / 64
  return {
    id,
    title,
    emoji: '🚀',
    difficulty: difficultyVal,
    color: '#f59e0b',
    topics: ['Integration', 'Physics', 'FTC', 'Antiderivatives'],
    realWorld: real,
    connectionNote: `Physics meets calculus: velocity v(t)=v₀-32t is the derivative of height. Finding maximum height requires integrating v(t) from 0 to the zero-crossing time t*=v₀/32. This demonstrates the Fundamental Theorem of Calculus—area under the velocity curve equals displacement.`,
    intro: `A rocket is launched straight up with initial velocity v₀ = ${v0} ft/s. Air resistance is ignored; only gravity (32 ft/s²) acts. The velocity function is v(t) = ${v0} - 32t.`,
    question: `Find the maximum height h_max (ft) reached by the rocket.`,
    latex: `v(t) = ${v0} - 32t,\\quad h(t) = \\int_0^t v(s)\\,ds = ${v0}t - 16t^2`,
    answerLatex: `h_{\\max} = \\frac{v_0^2}{64} = \\frac{${v0}^2}{64} = ${hmax}\\text{ ft}`,
    answer: hmax,
    unit: 'ft',
    check: nc(hmax),
    slider: { min: 0, max: 2 * tmax, step: 0.1, default: tmax, label: (v) => `t = ${v.toFixed(1)} s` },
    getSetupGraph: (sv) => {
      const ts = linspace(0, 2 * tmax, 200)
      const hs = ts.map(t => v0 * t - 16 * t * t)
      const hcur = v0 * sv - 16 * sv * sv
      const vcur = v0 - 32 * sv
      return {
        data: [
          { x: ts, y: hs, mode: 'lines', line: { color: '#f59e0b', width: 3 }, name: 'h(t)' },
          { x: [sv], y: [Math.max(0, hcur)], mode: 'markers', marker: { color: '#ec4899', size: 12, symbol: 'rocket-ne' }, name: `h(${sv.toFixed(1)})` },
          { x: [tmax], y: [hmax], mode: 'markers', marker: { color: '#10b981', size: 14, symbol: 'star' }, name: `Max: ${hmax} ft` },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (s)' }, yaxis: { ...BG.yaxis, title: 'h (ft)' } }
      }
    },
    hints: [
      { title: 'Integrate velocity to get height', formula: `h(t) = \\int_0^t v(s)\\,ds = \\int_0^t (${v0} - 32s)\\,ds` },
      { title: 'Find when rocket stops rising', formula: `v(t^*) = 0 \\Rightarrow ${v0} - 32t^* = 0 \\Rightarrow t^* = \\frac{${v0}}{32} = ${tmax}` },
      { title: 'Evaluate h at t*', formula: `h(${tmax}) = ${v0}\\cdot${tmax} - 16\\cdot${tmax}^2` },
      { title: 'Simplify', formula: `h_{\\max} = \\frac{v_0^2}{64} = \\frac{${v0}^2}{64} = ${hmax}\\text{ ft}` },
    ],
    solution: [
      { title: 'Integrate to find h(t)', formula: `h(t) = \\int_0^t (${v0} - 32s)\\,ds = ${v0}t - 16t^2` },
      { title: 'Find time of maximum height', formula: `v(t^*) = 0 \\Rightarrow t^* = \\frac{${v0}}{32} = ${tmax}\\text{ s}` },
      { title: 'Calculate maximum height', formula: `h_{\\max} = ${v0}(${tmax}) - 16(${tmax})^2 = ${v0*tmax} - ${16*tmax*tmax} = ${hmax}\\text{ ft}` },
      {
        title: 'Verification via velocity graph',
        text: 'The shaded area under v(t) from 0 to t* equals h_max (FTC):',
        formula: `h_{\\max} = \\int_0^{${tmax}} (${v0} - 32t)\\,dt = ${hmax}\\text{ ft}`,
        graph: (() => {
          const ts = linspace(0, 2 * tmax + 0.5, 200)
          const vs = ts.map(t => v0 - 32 * t)
          const tShade = linspace(0, tmax, 100)
          const vShade = tShade.map(t => v0 - 32 * t)
          return {
            data: [
              { x: ts, y: vs, mode: 'lines', line: { color: '#f59e0b', width: 3 }, name: 'v(t)' },
              { x: [...tShade, tmax, 0], y: [...vShade, 0, 0], fill: 'toself', fillcolor: 'rgba(245,158,11,0.3)', line: { color: 'transparent' }, name: `Area = ${hmax} ft` },
              { x: [tmax], y: [0], mode: 'markers', marker: { color: '#10b981', size: 12, symbol: 'circle' }, name: `t* = ${tmax}s` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (s)' }, yaxis: { ...BG.yaxis, title: 'v (ft/s)' }, showlegend: true }
          }
        })()
      },
    ]
  }
}

const rocketParams = [
  { id: 'cross-rocket-1', title: 'The Model Rocket', v0: 96, real: 'Model rocketry competition', difficultyVal: 1 },
  { id: 'cross-rocket-2', title: 'The Sports Ball Launch', v0: 128, real: 'Projectile motion in athletics', difficultyVal: 1 },
  { id: 'cross-rocket-3', title: 'The Fireworks Shell', v0: 160, real: 'Pyrotechnics engineering', difficultyVal: 2 },
  { id: 'cross-rocket-4', title: 'The Water Rocket', v0: 192, real: 'Physics classroom demonstrations', difficultyVal: 2 },
  { id: 'cross-rocket-5', title: 'The Javelin Throw', v0: 224, real: 'Track and field biomechanics', difficultyVal: 2 },
  { id: 'cross-rocket-6', title: 'The Artillery Shell', v0: 256, real: 'Ballistics and defense engineering', difficultyVal: 2 },
  { id: 'cross-rocket-7', title: 'The Signal Flare', v0: 288, real: 'Maritime safety equipment', difficultyVal: 3 },
  { id: 'cross-rocket-8', title: 'The Research Rocket', v0: 320, real: 'Atmospheric science research', difficultyVal: 3 },
]


// ─────────────────────────────────────────────
// FAMILY 4: Epidemic Spread (Logistic DiffEq + Inflection)
// ─────────────────────────────────────────────
function makeEpidemic({ id, title, K, r, real, difficultyVal = 3 }) {
  const tInflect = Math.log(K - 1) / r
  return {
    id,
    title,
    emoji: '🦠',
    difficulty: difficultyVal,
    color: '#ec4899',
    topics: ['Differential Equations', 'Logistic Growth', 'Inflection Points', 'Epidemiology'],
    realWorld: real,
    connectionNote: `Differential equations model real-world dynamics: the logistic model dP/dt = rP(1-P/K) describes epidemic spread. Finding when spread is fastest requires the second derivative P''(t)=0 — an inflection point of the solution curve, connecting DiffEq solutions to calculus analysis.`,
    intro: `An epidemic spreads through a population of K=${K} people. Starting from 1 infected person, the logistic model gives P(t) = K/(1+(K-1)e^{-rt}) where r=${r} is the growth rate.`,
    question: `Find the time t (days) when the epidemic spreads fastest (inflection point of P(t)).`,
    latex: `P(t) = \\frac{${K}}{1 + ${K-1}\\,e^{-${r}t}}`,
    answerLatex: `t^* = \\frac{\\ln(K-1)}{r} = \\frac{\\ln(${K-1})}{${r}} \\approx ${tInflect.toFixed(4)}\\text{ days}`,
    answer: tInflect,
    unit: 'days',
    check: nc(tInflect),
    slider: { min: 0, max: 3 * tInflect, step: 0.5, default: Math.round(tInflect), label: (v) => `t = ${v} days` },
    getSetupGraph: (sv) => {
      const tEnd = Math.max(3 * tInflect, 20)
      const ts = linspace(0, tEnd, 300)
      const Ps = ts.map(t => K / (1 + (K - 1) * Math.exp(-r * t)))
      const Pcur = K / (1 + (K - 1) * Math.exp(-r * sv))
      const dPcur = r * Pcur * (1 - Pcur / K)
      const tRange = 2
      const tLine = [sv - tRange, sv + tRange]
      const PLine = tLine.map(t => Pcur + dPcur * (t - sv))
      return {
        data: [
          { x: ts, y: Ps, mode: 'lines', line: { color: '#ec4899', width: 3 }, name: 'P(t)' },
          { x: [sv], y: [Pcur], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: 'Current' },
          { x: tLine, y: PLine, mode: 'lines', line: { color: '#f59e0b', width: 2, dash: 'dash' }, name: 'Tangent' },
          { x: [tInflect], y: [K / 2], mode: 'markers', marker: { color: '#10b981', size: 14, symbol: 'star' }, name: 'Inflection' },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (days)' }, yaxis: { ...BG.yaxis, title: 'P(t) (infected)' } }
      }
    },
    hints: [
      { title: 'The inflection point is where P grows fastest', text: 'This happens when P\'\'(t) = 0, or equivalently when dP/dt is maximized.' },
      { title: 'Use the symmetry of logistic growth', text: 'For the logistic curve, the inflection point occurs when P = K/2.', formula: `P(t^*) = \\frac{K}{2} = ${K/2}` },
      { title: 'Solve P(t*) = K/2', formula: `\\frac{${K}}{1+(${K-1})e^{-${r}t^*}} = ${K/2} \\Rightarrow 1 + (${K-1})e^{-${r}t^*} = 2` },
      { title: 'Solve for t*', formula: `e^{-${r}t^*} = \\frac{1}{${K-1}} \\Rightarrow t^* = \\frac{\\ln(${K-1})}{${r}}` },
    ],
    solution: [
      { title: 'Logistic Model Setup', formula: `P(t) = \\frac{${K}}{1 + ${K-1}\\,e^{-${r}t}},\\quad P'(t) = r P(1 - P/K)` },
      { title: 'Inflection at P = K/2', text: 'The logistic curve inflects when P = K/2, since P\'\'=0 at this point:', formula: `P(t^*) = \\frac{${K}}{2} = ${K/2}` },
      { title: 'Solve for t*', formula: `1 + ${K-1}\\,e^{-${r}t^*} = 2 \\Rightarrow e^{-${r}t^*} = \\frac{1}{${K-1}} \\Rightarrow t^* = \\frac{\\ln(${K-1})}{${r}}` },
      {
        title: 'Result with rate diagram',
        formula: `t^* = \\frac{\\ln ${K-1}}{${r}} \\approx ${tInflect.toFixed(4)}\\text{ days}`,
        graph: (() => {
          const tEnd = Math.max(3 * tInflect, 20)
          const ts = linspace(0, tEnd, 300)
          const Ps = ts.map(t => K / (1 + (K - 1) * Math.exp(-r * t)))
          const dPs = Ps.map(P => r * P * (1 - P / K))
          return {
            data: [
              { x: ts, y: dPs, mode: 'lines', line: { color: '#ec4899', width: 3 }, name: "P'(t)" },
              { x: [tInflect], y: [r * K / 4], mode: 'markers', marker: { color: '#f59e0b', size: 14, symbol: 'star' }, name: 'Max rate' },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (days)' }, yaxis: { ...BG.yaxis, title: "P'(t)" } }
          }
        })()
      },
    ]
  }
}

const epidemicParams = [
  { id: 'cross-epi-1', title: 'The Campus Flu', K: 1000, r: 0.5, real: 'University disease modeling', difficultyVal: 2 },
  { id: 'cross-epi-2', title: 'The Town Outbreak', K: 500, r: 1, real: 'Public health management', difficultyVal: 2 },
  { id: 'cross-epi-3', title: 'The Regional Epidemic', K: 2000, r: 0.5, real: 'Regional health planning', difficultyVal: 3 },
  { id: 'cross-epi-4', title: 'The City Spread', K: 1000, r: 1, real: 'Urban epidemiology', difficultyVal: 3 },
  { id: 'cross-epi-5', title: 'The State Wave', K: 5000, r: 0.5, real: 'Statewide disease control', difficultyVal: 3 },
  { id: 'cross-epi-6', title: 'The Fast Spreader', K: 10000, r: 1, real: 'Highly contagious pathogen modeling', difficultyVal: 3 },
  { id: 'cross-epi-7', title: 'The School Virus', K: 500, r: 2, real: 'School outbreak response', difficultyVal: 2 },
  { id: 'cross-epi-8', title: 'The Rapid Campus Spread', K: 1000, r: 2, real: 'Fast-spreading pathogen', difficultyVal: 3 },
]


// ─────────────────────────────────────────────
// FAMILY 5: Ferris Wheel Speed (Parametric + Derivatives)
// ─────────────────────────────────────────────
function makeFerrisWheel({ id, title, R, T, h_center, real, difficultyVal = 2 }) {
  const speed = R * 2 * Math.PI / T
  return {
    id,
    title,
    emoji: '🎡',
    difficulty: difficultyVal,
    color: '#06b6d4',
    topics: ['Parametric Equations', 'Derivatives', 'Pythagorean Identity', 'Circular Motion'],
    realWorld: real,
    connectionNote: `Parametric calculus meets trigonometry: x(t)=R·cos(ωt), y(t)=h+R·sin(ωt) describes circular motion. The speed magnitude ||v|| = sqrt((dx/dt)²+(dy/dt)²) = R·ω is constant despite the velocity vector rotating — this beautiful result uses the Pythagorean identity sin²+cos²=1.`,
    intro: `A Ferris wheel of radius R=${R} m has its center at height ${h_center} m. One full rotation takes T=${T} seconds. Position: x(t)=R·cos(2πt/T), y(t)=${h_center}+R·sin(2πt/T).`,
    question: `Find the constant speed (m/s) of a passenger on the Ferris wheel.`,
    latex: `\\text{speed} = \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}`,
    answerLatex: `\\text{speed} = \\frac{2\\pi R}{T} = \\frac{2\\pi \\cdot ${R}}{${T}} = \\frac{${2*R}\\pi}{${T}} \\approx ${speed.toFixed(4)}\\text{ m/s}`,
    answer: speed,
    unit: 'm/s',
    check: nc(speed),
    slider: { min: 0, max: T, step: 1, default: 0, label: (v) => `t = ${v} s` },
    getSetupGraph: (sv) => {
      const theta = linspace(0, 2 * Math.PI, 200)
      const cx = theta.map(th => R * Math.cos(th))
      const cy = theta.map(th => h_center + R * Math.sin(th))
      const angle = 2 * Math.PI * sv / T
      const px = R * Math.cos(angle)
      const py = h_center + R * Math.sin(angle)
      const vx = -R * 2 * Math.PI / T * Math.sin(angle)
      const vy = R * 2 * Math.PI / T * Math.cos(angle)
      const scale = T / (4 * Math.PI)
      return {
        data: [
          { x: cx, y: cy, mode: 'lines', line: { color: '#06b6d4', width: 2 }, name: 'Track' },
          { x: [0, px], y: [h_center, py], mode: 'lines', line: { color: '#475569', width: 2 }, name: 'Spoke' },
          { x: [px], y: [py], mode: 'markers', marker: { color: '#f59e0b', size: 14, symbol: 'circle' }, name: 'Passenger' },
          { x: [px, px + vx * scale], y: [py, py + vy * scale], mode: 'lines+markers', line: { color: '#ec4899', width: 3 }, marker: { color: '#ec4899', size: 8, symbol: 'arrow', angleref: 'previous' }, name: 'Velocity' },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'x (m)', range: [-R*1.5, R*1.5] }, yaxis: { ...BG.yaxis, title: 'y (m)', scaleanchor: 'x', scaleratio: 1 } }
      }
    },
    hints: [
      { title: 'Differentiate parametric equations', formula: `\\frac{dx}{dt} = -R\\cdot\\frac{2\\pi}{T}\\sin\\left(\\frac{2\\pi t}{T}\\right),\\quad \\frac{dy}{dt} = R\\cdot\\frac{2\\pi}{T}\\cos\\left(\\frac{2\\pi t}{T}\\right)` },
      { title: 'Speed formula', formula: `\\text{speed} = \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}` },
      { title: 'Apply Pythagorean identity', formula: `= R\\frac{2\\pi}{T}\\sqrt{\\sin^2\\!\\left(\\frac{2\\pi t}{T}\\right) + \\cos^2\\!\\left(\\frac{2\\pi t}{T}\\right)} = R\\frac{2\\pi}{T}\\cdot 1` },
      { title: 'The speed is constant!', formula: `\\text{speed} = \\frac{2\\pi R}{T} = \\frac{2\\pi \\cdot ${R}}{${T}} \\approx ${speed.toFixed(4)}\\text{ m/s}` },
    ],
    solution: [
      { title: 'Differentiate position', formula: `\\frac{dx}{dt} = -\\frac{2\\pi R}{T}\\sin\\left(\\frac{2\\pi t}{T}\\right),\\quad \\frac{dy}{dt} = \\frac{2\\pi R}{T}\\cos\\left(\\frac{2\\pi t}{T}\\right)` },
      { title: 'Compute speed magnitude', formula: `\\text{speed} = \\sqrt{\\frac{4\\pi^2 R^2}{T^2}\\sin^2\\!\\theta + \\frac{4\\pi^2 R^2}{T^2}\\cos^2\\!\\theta}` },
      { title: 'Factor and simplify', formula: `= \\frac{2\\pi R}{T}\\sqrt{\\sin^2\\!\\theta + \\cos^2\\!\\theta} = \\frac{2\\pi R}{T}` },
      {
        title: 'Velocity components and constant speed',
        formula: `\\text{speed} = \\frac{2\\pi \\cdot ${R}}{${T}} = ${speed.toFixed(4)}\\text{ m/s}`,
        graph: (() => {
          const ts = linspace(0, T, 200)
          const vx = ts.map(t => -R * 2*Math.PI/T * Math.sin(2*Math.PI*t/T))
          const vy = ts.map(t => R * 2*Math.PI/T * Math.cos(2*Math.PI*t/T))
          const sp = ts.map(() => speed)
          return {
            data: [
              { x: ts, y: vx, mode: 'lines', line: { color: '#8b5cf6', width: 2 }, name: 'vx(t)' },
              { x: ts, y: vy, mode: 'lines', line: { color: '#10b981', width: 2 }, name: 'vy(t)' },
              { x: ts, y: sp, mode: 'lines', line: { color: '#f59e0b', width: 3, dash: 'dash' }, name: 'speed (const)' },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (s)' }, yaxis: { ...BG.yaxis, title: 'v (m/s)' }, showlegend: true }
          }
        })()
      },
    ]
  }
}

const ferrisParams = [
  { id: 'cross-ferris-1', title: 'The County Fair Wheel', R: 20, T: 60, h_center: 25, real: 'Amusement park engineering', difficultyVal: 2 },
  { id: 'cross-ferris-2', title: 'The Carnival Ride', R: 25, T: 50, h_center: 30, real: 'Carnival ride design', difficultyVal: 2 },
  { id: 'cross-ferris-3', title: 'The City Observation Wheel', R: 30, T: 40, h_center: 35, real: 'Urban attraction engineering', difficultyVal: 2 },
  { id: 'cross-ferris-4', title: 'The Kiddie Ferris Wheel', R: 12, T: 30, h_center: 15, real: 'Small amusement rides', difficultyVal: 1 },
  { id: 'cross-ferris-5', title: 'The Thrill Wheel', R: 16, T: 20, h_center: 20, real: 'High-speed amusement design', difficultyVal: 2 },
  { id: 'cross-ferris-6', title: 'The Slow Giant Wheel', R: 18, T: 60, h_center: 22, real: 'Scenic observation rides', difficultyVal: 2 },
  { id: 'cross-ferris-7', title: 'The Mid-Speed Wheel', R: 24, T: 40, h_center: 28, real: 'Standard amusement design', difficultyVal: 2 },
  { id: 'cross-ferris-8', title: 'The Grand Ferris Wheel', R: 35, T: 70, h_center: 40, real: 'Landmark observation wheel', difficultyVal: 3 },
]


// ─────────────────────────────────────────────
// FAMILY 6: Drug Decay (Exponential + Logarithms)
// ─────────────────────────────────────────────
function makeDrug({ id, title, D0, t_half, target_frac, real, difficultyVal = 2 }) {
  const answer = t_half * Math.log2(1 / target_frac)
  const targetDose = D0 * target_frac
  return {
    id,
    title,
    emoji: '💊',
    difficulty: difficultyVal,
    color: '#10b981',
    topics: ['Exponential Decay', 'Logarithms', 'Differential Equations', 'Half-Life'],
    realWorld: real,
    connectionNote: `Exponential decay models drug metabolism: C(t)=C₀·e^(-λt) where λ=ln2/t½. Finding when concentration reaches a target requires solving an exponential equation with natural logs — bridging differential equations (the ODE dC/dt=-λC) with algebraic manipulation.`,
    intro: `A patient receives ${D0} mg of a drug. The drug has a half-life of ${t_half} hours, so C(t) = ${D0}·e^(-(ln 2)/${t_half}·t). Find when concentration reaches ${targetDose} mg (${target_frac*100}% of initial dose).`,
    question: `Find the time t (hours) when C(t) = ${targetDose} mg.`,
    latex: `C(t) = ${D0}\\,e^{-\\frac{\\ln 2}{${t_half}}t},\\quad C(t^*) = ${targetDose}`,
    answerLatex: `t^* = ${t_half}\\cdot\\log_2\\!\\left(\\frac{1}{${target_frac}}\\right) = ${answer.toFixed(4)}\\text{ h}`,
    answer: answer,
    unit: 'h',
    check: nc(answer),
    slider: { min: 0, max: 4 * t_half, step: 0.5, default: Math.round(answer), label: (v) => `t = ${v} h` },
    getSetupGraph: (sv) => {
      const tEnd = 4 * t_half
      const ts = linspace(0, tEnd, 200)
      const Cs = ts.map(t => D0 * Math.exp(-Math.LN2 / t_half * t))
      const Ccur = D0 * Math.exp(-Math.LN2 / t_half * sv)
      return {
        data: [
          { x: ts, y: Cs, mode: 'lines', line: { color: '#10b981', width: 3 }, name: 'C(t)' },
          { x: [0, tEnd], y: [targetDose, targetDose], mode: 'lines', line: { color: '#ec4899', width: 2, dash: 'dash' }, name: `Target: ${targetDose} mg` },
          { x: [sv], y: [Ccur], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: `C(${sv.toFixed(1)})` },
          { x: [answer], y: [targetDose], mode: 'markers', marker: { color: '#ec4899', size: 14, symbol: 'star' }, name: `t* = ${answer.toFixed(2)}h` },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (hours)' }, yaxis: { ...BG.yaxis, title: 'C (mg)' } }
      }
    },
    hints: [
      { title: 'Set up the equation', formula: `${D0}\\,e^{-\\frac{\\ln 2}{${t_half}}t^*} = ${targetDose}` },
      { title: 'Divide both sides by D₀', formula: `e^{-\\frac{\\ln 2}{${t_half}}t^*} = ${target_frac}` },
      { title: 'Take natural log of both sides', formula: `-\\frac{\\ln 2}{${t_half}}t^* = \\ln(${target_frac}) \\Rightarrow t^* = -\\frac{${t_half}}{\\ln 2}\\ln(${target_frac})` },
      { title: 'Simplify using log rules', formula: `t^* = ${t_half}\\cdot\\frac{\\ln(1/${target_frac})}{\\ln 2} = ${t_half}\\cdot\\log_2\\!\\left(\\frac{1}{${target_frac}}\\right) = ${answer.toFixed(4)}\\text{ h}` },
    ],
    solution: [
      { title: 'Drug decay model', formula: `C(t) = ${D0}\\,e^{-\\frac{\\ln 2}{${t_half}}t}` },
      { title: 'Solve C(t*) = target', formula: `${D0}\\,e^{-\\frac{\\ln 2}{${t_half}}t^*} = ${targetDose} \\Rightarrow e^{-\\frac{\\ln 2}{${t_half}}t^*} = ${target_frac}` },
      { title: 'Apply logarithm', formula: `t^* = -\\frac{${t_half}}{\\ln 2}\\cdot\\ln(${target_frac}) = ${t_half}\\cdot\\log_2\\!\\left(\\frac{1}{${target_frac}}\\right)` },
      {
        title: 'Result with half-life markers',
        formula: `t^* = ${answer.toFixed(4)}\\text{ hours} = ${Math.round(answer/t_half)} \\times t_{1/2}`,
        graph: (() => {
          const tEnd = 4.5 * t_half
          const ts = linspace(0, tEnd, 200)
          const Cs = ts.map(t => D0 * Math.exp(-Math.LN2 / t_half * t))
          const halfMarkers = Array.from({length: 5}, (_, i) => (i+1) * t_half).filter(t => t <= tEnd)
          return {
            data: [
              { x: ts, y: Cs, mode: 'lines', line: { color: '#10b981', width: 3 }, name: 'C(t)' },
              { x: halfMarkers, y: halfMarkers.map(t => D0 * Math.exp(-Math.LN2 / t_half * t)), mode: 'markers', marker: { color: '#8b5cf6', size: 10, symbol: 'diamond' }, name: 'Half-life marks' },
              { x: [0, tEnd], y: [targetDose, targetDose], mode: 'lines', line: { color: '#ec4899', width: 2, dash: 'dash' }, name: 'Target' },
              { x: [answer], y: [targetDose], mode: 'markers', marker: { color: '#f59e0b', size: 14, symbol: 'star' }, name: `t* = ${answer.toFixed(2)}h` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (h)' }, yaxis: { ...BG.yaxis, title: 'C (mg)' } }
          }
        })()
      },
    ]
  }
}

const drugParams = [
  { id: 'cross-drug-1', title: 'The Aspirin Dose', D0: 100, t_half: 6, target_frac: 0.25, real: 'Pharmacokinetics of aspirin', difficultyVal: 2 },
  { id: 'cross-drug-2', title: 'The Antibiotic Course', D0: 200, t_half: 4, target_frac: 0.25, real: 'Antibiotic dosing schedules', difficultyVal: 2 },
  { id: 'cross-drug-3', title: 'The Pain Reliever', D0: 500, t_half: 8, target_frac: 0.125, real: 'Long-acting analgesics', difficultyVal: 2 },
  { id: 'cross-drug-4', title: 'The Sleep Aid', D0: 100, t_half: 12, target_frac: 0.125, real: 'Sedative drug clearance', difficultyVal: 2 },
  { id: 'cross-drug-5', title: 'The Quick-Act Drug', D0: 400, t_half: 6, target_frac: 0.5, real: 'Rapid-action medications', difficultyVal: 1 },
  { id: 'cross-drug-6', title: 'The Cough Syrup', D0: 100, t_half: 3, target_frac: 0.25, real: 'OTC medication timing', difficultyVal: 1 },
  { id: 'cross-drug-7', title: 'The Long-Act Medication', D0: 800, t_half: 5, target_frac: 0.0625, real: 'Extended-release drugs', difficultyVal: 3 },
  { id: 'cross-drug-8', title: 'The Daily Supplement', D0: 250, t_half: 10, target_frac: 0.5, real: 'Vitamin and supplement dosing', difficultyVal: 1 },
]


// ─────────────────────────────────────────────
// FAMILY 7: Bouncing Ball (Geometric Series + Integration)
// ─────────────────────────────────────────────
function makeBouncingBall({ id, title, h0, r, real, difficultyVal = 2 }) {
  const answer = h0 * (1 + r) / (1 - r)
  return {
    id,
    title,
    emoji: '⚽',
    difficulty: difficultyVal,
    color: '#f59e0b',
    topics: ['Geometric Series', 'Infinite Series', 'Convergence', 'Sigma Notation'],
    realWorld: real,
    connectionNote: `Geometric series models physical reality: each bounce covers h₀·rⁿ meters (down) + h₀·rⁿ meters (up). The total distance is a geometric series sum — showing how calculus/series analysis solves seemingly infinite problems with a finite answer. The ratio r<1 guarantees convergence.`,
    intro: `A ball is dropped from ${h0} meters. Each bounce reaches ${r*100}% of the previous height (restitution coefficient r=${r}). The ball bounces infinitely many times (theoretically).`,
    question: `Find the total distance (m) traveled by the ball.`,
    latex: `D = h_0 + 2h_0 r + 2h_0 r^2 + \\cdots = h_0 + \\frac{2h_0 r}{1-r} = h_0\\cdot\\frac{1+r}{1-r}`,
    answerLatex: `D = ${h0}\\cdot\\frac{1+${r}}{1-${r}} = ${h0}\\cdot\\frac{${1+r}}{${1-r}} = ${answer.toFixed(4)}\\text{ m}`,
    answer: answer,
    unit: 'm',
    check: nc(answer),
    slider: { min: 1, max: 12, step: 1, default: 5, label: (v) => `Show ${v} bounces` },
    getSetupGraph: (sv) => {
      const n = Math.round(sv)
      const heights = Array.from({length: n + 1}, (_, i) => h0 * Math.pow(r, i))
      const partialSum = heights[0] + heights.slice(1).reduce((s, h) => s + 2 * h, 0)
      return {
        data: [
          { x: Array.from({length: n + 1}, (_, i) => i), y: heights, type: 'bar', marker: { color: '#f59e0b', opacity: 0.8 }, name: 'Bounce height' },
          { x: [0, n], y: [partialSum, partialSum], mode: 'lines', line: { color: '#ec4899', width: 2, dash: 'dash' }, name: `Partial sum: ${partialSum.toFixed(2)}m` },
          { x: [0, n], y: [answer, answer], mode: 'lines', line: { color: '#10b981', width: 2, dash: 'dot' }, name: `Total: ${answer.toFixed(2)}m` },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'Bounce #' }, yaxis: { ...BG.yaxis, title: 'Height (m)' }, showlegend: true }
      }
    },
    hints: [
      { title: 'List the distances', text: 'Drop: h₀. Then each bounce goes up and comes down.', formula: `D = h_0 + 2h_0 r + 2h_0 r^2 + \\cdots` },
      { title: 'Factor out', formula: `D = h_0 + 2h_0 r(1 + r + r^2 + \\cdots) = h_0 + \\frac{2h_0 r}{1-r}` },
      { title: 'Combine over common denominator', formula: `D = \\frac{h_0(1-r) + 2h_0 r}{1-r} = \\frac{h_0(1+r)}{1-r}` },
      { title: 'Substitute values', formula: `D = \\frac{${h0}(1+${r})}{1-${r}} = \\frac{${h0*(1+r)}}{${1-r}} = ${answer.toFixed(4)}\\text{ m}` },
    ],
    solution: [
      { title: 'Model the distances', formula: `D = h_0 + 2h_0 r + 2h_0 r^2 + \\cdots = h_0 + 2h_0\\sum_{n=1}^{\\infty} r^n` },
      { title: 'Geometric series formula', formula: `\\sum_{n=1}^{\\infty} r^n = \\frac{r}{1-r}\\quad(\\text{for }|r|<1)` },
      { title: 'Apply the formula', formula: `D = h_0 + 2h_0 \\cdot \\frac{r}{1-r} = h_0\\left(1 + \\frac{2r}{1-r}\\right) = \\frac{h_0(1+r)}{1-r}` },
      {
        title: 'Convergence visualization',
        formula: `D = \\frac{${h0}(1+${r})}{1-${r}} = ${answer.toFixed(4)}\\text{ m}`,
        graph: (() => {
          const ns = Array.from({length: 15}, (_, i) => i)
          const partialSums = ns.map(n => {
            const hs = Array.from({length: n + 1}, (_, i) => h0 * Math.pow(r, i))
            return hs[0] + hs.slice(1).reduce((s, h) => s + 2 * h, 0)
          })
          return {
            data: [
              { x: ns, y: partialSums, mode: 'lines+markers', line: { color: '#f59e0b', width: 3 }, marker: { color: '#f59e0b', size: 8 }, name: 'Partial sum' },
              { x: [0, 14], y: [answer, answer], mode: 'lines', line: { color: '#10b981', width: 2, dash: 'dash' }, name: `Limit: ${answer.toFixed(2)}m` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 'Number of bounces n' }, yaxis: { ...BG.yaxis, title: 'Total distance (m)' }, showlegend: true }
          }
        })()
      },
    ]
  }
}

const ballParams = [
  { id: 'cross-ball-1', title: 'The Tennis Ball Drop', h0: 10, r: 0.8, real: 'Sports equipment testing', difficultyVal: 2 },
  { id: 'cross-ball-2', title: 'The Rubber Ball', h0: 6, r: 0.75, real: 'Toy physics experiments', difficultyVal: 2 },
  { id: 'cross-ball-3', title: 'The Basketball Drop', h0: 12, r: 0.5, real: 'Basketball court physics', difficultyVal: 1 },
  { id: 'cross-ball-4', title: 'The Super Ball', h0: 20, r: 0.9, real: 'High-restitution ball design', difficultyVal: 2 },
  { id: 'cross-ball-5', title: 'The Golf Ball', h0: 8, r: 0.6, real: 'Golf ball physics', difficultyVal: 1 },
  { id: 'cross-ball-6', title: 'The Ping Pong Ball', h0: 15, r: 0.8, real: 'Table tennis equipment', difficultyVal: 2 },
  { id: 'cross-ball-7', title: 'The Bouncy Castle Ball', h0: 9, r: 0.75, real: 'Inflatable play equipment', difficultyVal: 2 },
  { id: 'cross-ball-8', title: 'The Steel Ball', h0: 10, r: 0.5, real: 'Materials science testing', difficultyVal: 1 },
]


// ─────────────────────────────────────────────
// FAMILY 8: Arc Length (Parametric + Integration)
// ─────────────────────────────────────────────
function makeArcLength({ id, title, curve, tmax, real, difficultyVal = 3 }) {
  let answer, integrandFn, xFn, yFn, dxFn, dyFn
  if (curve === 'quad') {
    // x=t², y=2t³/3, dx/dt=2t, dy/dt=2t²
    // speed = sqrt(4t²+4t⁴) = 2t*sqrt(1+t²)
    // L = integral_0^tmax 2t*sqrt(1+t²) dt = 2/3*(1+tmax²)^(3/2) - 2/3
    answer = 2 / 3 * (Math.pow(1 + tmax * tmax, 1.5) - 1)
    xFn = t => t * t
    yFn = t => 2 * t * t * t / 3
    dxFn = t => 2 * t
    dyFn = t => 2 * t * t
    integrandFn = t => 2 * t * Math.sqrt(1 + t * t)
  } else {
    // x=t³, y=3t²/2, dx/dt=3t², dy/dt=3t
    // speed = sqrt(9t⁴+9t²) = 3t*sqrt(t²+1)
    // L = integral_0^tmax 3t*sqrt(t²+1) dt = (t²+1)^(3/2) - 1
    answer = Math.pow(tmax * tmax + 1, 1.5) - 1
    xFn = t => t * t * t
    yFn = t => 3 * t * t / 2
    dxFn = t => 3 * t * t
    dyFn = t => 3 * t
    integrandFn = t => 3 * t * Math.sqrt(t * t + 1)
  }
  return {
    id,
    title,
    emoji: '📐',
    difficulty: difficultyVal,
    color: '#8b5cf6',
    topics: ['Arc Length', 'Parametric Equations', 'Integration', 'Chain Rule'],
    realWorld: real,
    connectionNote: `Arc length bridges parametric equations and integration: L = ∫√((dx/dt)²+(dy/dt)²) dt combines the chain rule (differentiating parametric equations) with integration (summing infinitely many small arc lengths ds = √(dx²+dy²)). It's calculus measuring curve geometry.`,
    intro: curve === 'quad'
      ? `A particle moves along the parametric curve x(t) = t², y(t) = 2t³/3 for t ∈ [0, ${tmax}].`
      : `A particle moves along the parametric curve x(t) = t³, y(t) = 3t²/2 for t ∈ [0, ${tmax}].`,
    question: `Find the arc length L of the curve from t = 0 to t = ${tmax}.`,
    latex: curve === 'quad'
      ? `L = \\int_0^{${tmax}} \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}\\,dt = \\int_0^{${tmax}} 2t\\sqrt{1+t^2}\\,dt`
      : `L = \\int_0^{${tmax}} \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}\\,dt = \\int_0^{${tmax}} 3t\\sqrt{t^2+1}\\,dt`,
    answerLatex: curve === 'quad'
      ? `L = \\frac{2}{3}\\left[(1+t^2)^{3/2}\\right]_0^{${tmax}} = \\frac{2}{3}\\left[(1+${tmax}^2)^{3/2} - 1\\right] \\approx ${answer.toFixed(4)}`
      : `L = \\left[(t^2+1)^{3/2}\\right]_0^{${tmax}} - 1 = (${tmax}^2+1)^{3/2} - 1 \\approx ${answer.toFixed(4)}`,
    answer: answer,
    unit: 'units',
    check: nc(answer),
    slider: { min: 0, max: tmax, step: tmax / 20, default: tmax / 2, label: (v) => `t up to ${v.toFixed(2)}` },
    getSetupGraph: (sv) => {
      const ts = linspace(0, Math.max(sv, 0.01), 100)
      const xs = ts.map(xFn)
      const ys = ts.map(yFn)
      const xAll = linspace(0, tmax, 200).map(xFn)
      const yAll = linspace(0, tmax, 200).map(yFn)
      return {
        data: [
          { x: xAll, y: yAll, mode: 'lines', line: { color: '#475569', width: 2 }, name: 'Full curve' },
          { x: xs, y: ys, mode: 'lines', line: { color: '#8b5cf6', width: 4 }, name: `Arc 0→${sv.toFixed(1)}` },
          { x: [xs[xs.length - 1]], y: [ys[ys.length - 1]], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: 'End point' },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'x' }, yaxis: { ...BG.yaxis, title: 'y' } }
      }
    },
    hints: [
      { title: 'Arc length formula for parametric curves', formula: `L = \\int_a^b \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}\\,dt` },
      curve === 'quad'
        ? { title: 'Compute derivatives', formula: `\\frac{dx}{dt} = 2t,\\quad \\frac{dy}{dt} = 2t^2` }
        : { title: 'Compute derivatives', formula: `\\frac{dx}{dt} = 3t^2,\\quad \\frac{dy}{dt} = 3t` },
      curve === 'quad'
        ? { title: 'Simplify the integrand', formula: `\\sqrt{(2t)^2 + (2t^2)^2} = \\sqrt{4t^2(1+t^2)} = 2t\\sqrt{1+t^2}` }
        : { title: 'Simplify the integrand', formula: `\\sqrt{(3t^2)^2 + (3t)^2} = \\sqrt{9t^2(t^2+1)} = 3t\\sqrt{t^2+1}` },
      { title: 'Use u-substitution', formula: curve === 'quad' ? `u = 1+t^2,\\quad du = 2t\\,dt` : `u = t^2+1,\\quad du = 2t\\,dt` },
    ],
    solution: [
      { title: 'Parametric derivatives', formula: curve === 'quad' ? `\\frac{dx}{dt} = 2t,\\quad \\frac{dy}{dt} = 2t^2` : `\\frac{dx}{dt} = 3t^2,\\quad \\frac{dy}{dt} = 3t` },
      { title: 'Simplified integrand', formula: curve === 'quad' ? `\\sqrt{4t^2 + 4t^4} = 2t\\sqrt{1+t^2}` : `\\sqrt{9t^4 + 9t^2} = 3t\\sqrt{t^2+1}` },
      { title: 'U-substitution', formula: curve === 'quad'
        ? `u = 1+t^2 \\Rightarrow \\int 2t\\sqrt{u}\\frac{du}{2t} = \\frac{2}{3}u^{3/2}\\Big|_1^{1+${tmax}^2}`
        : `u = t^2+1 \\Rightarrow \\int 3t\\sqrt{u}\\frac{du}{2t} = u^{3/2}\\Big|_1^{${tmax}^2+1}` },
      {
        title: 'Final answer and integrand visualization',
        formula: curve === 'quad'
          ? `L = \\frac{2}{3}\\left[(1+${tmax}^2)^{3/2} - 1\\right] \\approx ${answer.toFixed(4)}`
          : `L = (${tmax}^2+1)^{3/2} - 1 \\approx ${answer.toFixed(4)}`,
        graph: (() => {
          const ts = linspace(0, tmax, 200)
          const integrand = ts.map(integrandFn)
          return {
            data: [
              { x: ts, y: integrand, mode: 'lines', line: { color: '#8b5cf6', width: 3 }, name: 'Integrand' },
              { x: [...ts, tmax, 0], y: [...integrand, 0, 0], fill: 'toself', fillcolor: 'rgba(139,92,246,0.3)', line: { color: 'transparent' }, name: `Area = ${answer.toFixed(2)}` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 't' }, yaxis: { ...BG.yaxis, title: 'ds/dt' } }
          }
        })()
      },
    ]
  }
}

const arcParams = [
  { id: 'cross-arc-1', title: 'The Quadratic Path I', curve: 'quad', tmax: 1, real: 'Roller coaster track length', difficultyVal: 2 },
  { id: 'cross-arc-2', title: 'The Quadratic Path II', curve: 'quad', tmax: 2, real: 'River bend measurement', difficultyVal: 2 },
  { id: 'cross-arc-3', title: 'The Quadratic Path III', curve: 'quad', tmax: 3, real: 'Road curve engineering', difficultyVal: 3 },
  { id: 'cross-arc-4', title: 'The Quadratic Path IV', curve: 'quad', tmax: 4, real: 'Pipeline routing', difficultyVal: 3 },
  { id: 'cross-arc-5', title: 'The Quadratic Path V', curve: 'quad', tmax: 5, real: 'Ski slope geometry', difficultyVal: 3 },
  { id: 'cross-arc-6', title: 'The Cubic Path I', curve: 'cubic', tmax: 1, real: 'Cable suspension analysis', difficultyVal: 2 },
  { id: 'cross-arc-7', title: 'The Cubic Path II', curve: 'cubic', tmax: 2, real: 'Airplane flight path', difficultyVal: 3 },
  { id: 'cross-arc-8', title: 'The Cubic Path III', curve: 'cubic', tmax: 3, real: 'Satellite orbital segment', difficultyVal: 3 },
]


// ─────────────────────────────────────────────
// FAMILY 9: Water Tank Draining (Related Rates + Volume)
// ─────────────────────────────────────────────
function makeWaterTank({ id, title, k, dVdt, h0, real, difficultyVal = 2 }) {
  const answer = dVdt / (Math.PI * k * k * h0 * h0)
  return {
    id,
    title,
    emoji: '🪣',
    difficulty: difficultyVal,
    color: '#06b6d4',
    topics: ['Related Rates', 'Volume', 'Chain Rule', 'Geometry'],
    realWorld: real,
    connectionNote: `Related rates with 3D geometry: the cone's volume V=πk²h³/3 links volume to height via the similar triangles ratio r/h=k. Differentiating V with respect to t gives dV/dt in terms of dh/dt — converting the volume rate into a height rate using implicit differentiation.`,
    intro: `An inverted cone-shaped tank has r/h = ${k} (similar triangles). Water drains at ${Math.abs(dVdt)} m³/min (dV/dt = ${dVdt}). When the water height is h = ${h0} m, find how fast the water level drops.`,
    question: `Find dh/dt (m/min) when h = ${h0} m.`,
    latex: `V = \\frac{\\pi k^2 h^3}{3} = \\frac{\\pi \\cdot ${k}^2 \\cdot h^3}{3},\\quad \\frac{dV}{dt} = ${dVdt}\\text{ m}^3/\\text{min}`,
    answerLatex: `\\frac{dh}{dt} = \\frac{dV/dt}{\\pi k^2 h^2} = \\frac{${dVdt}}{\\pi \\cdot ${k}^2 \\cdot ${h0}^2} \\approx ${answer.toFixed(4)}\\text{ m/min}`,
    answer: answer,
    unit: 'm/min',
    check: nc(answer),
    slider: { min: 0.5, max: 3 * h0, step: 0.5, default: h0, label: (v) => `h = ${v} m` },
    getSetupGraph: (sv) => {
      const hv = Math.max(sv, 0.1)
      const rv = k * hv
      const maxH = 3 * h0
      const maxR = k * maxH
      const waterXLeft = [-rv, 0, rv, -rv]
      const waterYBottom = [0, 0, 0, 0]
      const waterXFill = [-rv, rv, 0]
      const waterYFill = [hv, hv, 0]
      return {
        data: [
          { x: [-maxR, 0, maxR, -maxR], y: [maxH, 0, maxH, maxH], mode: 'lines', line: { color: '#475569', width: 3 }, name: 'Tank' },
          { x: waterXFill, y: waterYFill, fill: 'toself', fillcolor: 'rgba(6,182,212,0.3)', line: { color: '#06b6d4', width: 2 }, name: `Water h=${hv.toFixed(1)}m` },
          { x: [-rv, rv], y: [hv, hv], mode: 'lines', line: { color: '#06b6d4', width: 3 }, name: 'Water level' },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'r (m)', range: [-maxR*1.1, maxR*1.1] }, yaxis: { ...BG.yaxis, title: 'h (m)', range: [-0.5, maxH*1.1] } }
      }
    },
    hints: [
      { title: 'Use similar triangles', text: `Since r/h = ${k}, we have r = ${k}h at all times.` },
      { title: 'Volume formula with substitution', formula: `V = \\frac{\\pi r^2 h}{3} = \\frac{\\pi (${k}h)^2 h}{3} = \\frac{\\pi\\cdot ${k*k} h^3}{3}` },
      { title: 'Differentiate with respect to t', formula: `\\frac{dV}{dt} = \\pi k^2 h^2 \\frac{dh}{dt} = \\pi\\cdot ${k*k}\\cdot h^2\\cdot\\frac{dh}{dt}` },
      { title: 'Solve for dh/dt at h₀', formula: `\\frac{dh}{dt} = \\frac{${dVdt}}{\\pi\\cdot ${k*k}\\cdot ${h0*h0}} \\approx ${answer.toFixed(4)}\\text{ m/min}` },
    ],
    solution: [
      { title: 'Similar triangles give r = kh', formula: `r = ${k}h \\Rightarrow V = \\frac{\\pi(${k}h)^2 h}{3} = \\frac{${k*k}\\pi h^3}{3}` },
      { title: 'Differentiate V with respect to t', formula: `\\frac{dV}{dt} = ${k*k}\\pi h^2\\frac{dh}{dt}` },
      { title: 'Solve for dh/dt', formula: `\\frac{dh}{dt} = \\frac{dV/dt}{${k*k}\\pi h^2}` },
      {
        title: 'Evaluate at h₀ with V(h) curve',
        formula: `\\frac{dh}{dt}\\bigg|_{h=${h0}} = \\frac{${dVdt}}{${k*k}\\pi \\cdot ${h0}^2} = ${answer.toFixed(4)}\\text{ m/min}`,
        graph: (() => {
          const hs = linspace(0.1, 3 * h0, 200)
          const Vs = hs.map(h => k*k*Math.PI*h*h*h/3)
          return {
            data: [
              { x: hs, y: Vs, mode: 'lines', line: { color: '#06b6d4', width: 3 }, name: 'V(h)' },
              { x: [h0], y: [k*k*Math.PI*h0*h0*h0/3], mode: 'markers', marker: { color: '#f59e0b', size: 14, symbol: 'star' }, name: `h₀=${h0}` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 'h (m)' }, yaxis: { ...BG.yaxis, title: 'V (m³)' } }
          }
        })()
      },
    ]
  }
}

const tankParams = [
  { id: 'cross-tank-1', title: 'The Draining Funnel', k: 0.5, dVdt: -2, h0: 4, real: 'Chemical processing funnels', difficultyVal: 2 },
  { id: 'cross-tank-2', title: 'The Water Tower', k: 1, dVdt: -3, h0: 3, real: 'Municipal water distribution', difficultyVal: 2 },
  { id: 'cross-tank-3', title: 'The Coffee Dripper', k: 0.5, dVdt: -1, h0: 2, real: 'Pour-over coffee physics', difficultyVal: 1 },
  { id: 'cross-tank-4', title: 'The Reservoir Drain', k: 1, dVdt: -4, h0: 2, real: 'Reservoir flood control', difficultyVal: 2 },
  { id: 'cross-tank-5', title: 'The Irrigation Tank', k: 0.5, dVdt: -4, h0: 8, real: 'Agricultural water management', difficultyVal: 3 },
  { id: 'cross-tank-6', title: 'The Industrial Vat', k: 2, dVdt: -8, h0: 2, real: 'Chemical plant operations', difficultyVal: 2 },
  { id: 'cross-tank-7', title: 'The Oil Separator', k: 1, dVdt: -6, h0: 6, real: 'Petroleum separation processes', difficultyVal: 3 },
  { id: 'cross-tank-8', title: 'The Lab Beaker', k: 0.5, dVdt: -3, h0: 6, real: 'Laboratory fluid dynamics', difficultyVal: 3 },
]


// ─────────────────────────────────────────────
// FAMILY 10: Spring Work (Integration + Physics)
// ─────────────────────────────────────────────
function makeSpringWork({ id, title, k_spring, xmax, real, difficultyVal = 1 }) {
  const answer = k_spring * xmax * xmax / 2
  return {
    id,
    title,
    emoji: '🔩',
    difficulty: difficultyVal,
    color: '#10b981',
    topics: ['Definite Integrals', 'Physics', "Hooke's Law", 'Work'],
    realWorld: real,
    connectionNote: `Integration gives physical meaning: Hooke's Law F=kx says force varies with displacement. Work = ∫F dx integrates variable force over displacement — you can't just multiply F×d when F changes. This shows how integration solves physics problems that algebra alone cannot.`,
    intro: `A spring with spring constant k=${k_spring} N/m obeys Hooke's Law: F(x) = ${k_spring}x newtons when stretched x meters from equilibrium.`,
    question: `Find the work W (joules) done to stretch the spring from x=0 to x=${xmax} m.`,
    latex: `W = \\int_0^{${xmax}} F(x)\\,dx = \\int_0^{${xmax}} ${k_spring}x\\,dx`,
    answerLatex: `W = \\frac{${k_spring}\\cdot ${xmax}^2}{2} = \\frac{${k_spring * xmax * xmax}}{2} = ${answer}\\text{ J}`,
    answer: answer,
    unit: 'J',
    check: nc(answer),
    slider: { min: 0, max: xmax, step: xmax / 20, default: xmax / 2, label: (v) => `x = ${v.toFixed(2)} m` },
    getSetupGraph: (sv) => {
      const xs = linspace(0, xmax, 200)
      const Fs = xs.map(x => k_spring * x)
      const xShade = linspace(0, sv, 100)
      const FShade = xShade.map(x => k_spring * x)
      const Fcur = k_spring * sv
      const wPartial = k_spring * sv * sv / 2
      return {
        data: [
          { x: [...xShade, sv, 0], y: [...FShade, 0, 0], fill: 'toself', fillcolor: 'rgba(16,185,129,0.3)', line: { color: 'transparent' }, name: `W = ${wPartial.toFixed(2)} J` },
          { x: xs, y: Fs, mode: 'lines', line: { color: '#10b981', width: 3 }, name: `F(x) = ${k_spring}x` },
          { x: [sv], y: [Fcur], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: `F(${sv.toFixed(2)})=${Fcur.toFixed(2)}N` },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'x (m)' }, yaxis: { ...BG.yaxis, title: 'F (N)' } }
      }
    },
    hints: [
      { title: "Hooke's Law and variable force", text: 'F(x)=kx changes as x changes, so we cannot use W=Fd.', formula: `F(x) = ${k_spring}x\\text{ N}` },
      { title: 'Work as integral of force', formula: `W = \\int_0^{${xmax}} F(x)\\,dx = \\int_0^{${xmax}} ${k_spring}x\\,dx` },
      { title: 'Antiderivative', formula: `W = ${k_spring}\\cdot\\frac{x^2}{2}\\Big|_0^{${xmax}}` },
      { title: 'Evaluate', formula: `W = \\frac{${k_spring}\\cdot${xmax}^2}{2} = ${answer}\\text{ J}` },
    ],
    solution: [
      { title: "Hooke's Law: variable force", formula: `F(x) = ${k_spring}x,\\quad W \\ne F \\cdot d\\text{ (force varies!)}` },
      { title: 'Definite integral for work', formula: `W = \\int_0^{${xmax}} ${k_spring}x\\,dx = ${k_spring}\\cdot\\frac{x^2}{2}\\Bigg|_0^{${xmax}}` },
      { title: 'Evaluate the integral', formula: `W = \\frac{${k_spring}\\cdot${xmax*xmax}}{2} - 0 = ${answer}\\text{ J}` },
      {
        title: 'Geometric interpretation: triangle area',
        text: 'The work equals the area of the triangle under F(x)=kx:',
        formula: `W = \\frac{1}{2}\\cdot base\\cdot height = \\frac{1}{2}\\cdot ${xmax}\\cdot ${k_spring*xmax} = ${answer}\\text{ J}`,
        graph: (() => {
          const xs = linspace(0, xmax, 200)
          const Fs = xs.map(x => k_spring * x)
          return {
            data: [
              { x: [...xs, xmax, 0], y: [...Fs, 0, 0], fill: 'toself', fillcolor: 'rgba(16,185,129,0.3)', line: { color: '#10b981', width: 2 }, name: `W = ${answer} J` },
              { x: xs, y: Fs, mode: 'lines', line: { color: '#10b981', width: 3 }, name: `F=${k_spring}x` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 'x (m)' }, yaxis: { ...BG.yaxis, title: 'F (N)' } }
          }
        })()
      },
    ]
  }
}

const springParams = [
  { id: 'cross-spring-1', title: 'The Door Spring', k_spring: 8, xmax: 3, real: 'Door closure mechanisms', difficultyVal: 1 },
  { id: 'cross-spring-2', title: 'The Bungee Cord', k_spring: 6, xmax: 4, real: 'Bungee jumping physics', difficultyVal: 1 },
  { id: 'cross-spring-3', title: 'The Car Suspension', k_spring: 10, xmax: 5, real: 'Automotive engineering', difficultyVal: 2 },
  { id: 'cross-spring-4', title: 'The Watch Spring', k_spring: 4, xmax: 3, real: 'Mechanical watch mechanisms', difficultyVal: 1 },
  { id: 'cross-spring-5', title: 'The Valve Spring', k_spring: 12, xmax: 2, real: 'Engine valve timing', difficultyVal: 1 },
  { id: 'cross-spring-6', title: 'The Trampoline Spring', k_spring: 5, xmax: 4, real: 'Gymnastics equipment', difficultyVal: 1 },
  { id: 'cross-spring-7', title: 'The Industrial Press', k_spring: 9, xmax: 6, real: 'Manufacturing press design', difficultyVal: 2 },
  { id: 'cross-spring-8', title: 'The Shock Absorber', k_spring: 3, xmax: 5, real: 'Vehicle shock absorption', difficultyVal: 1 },
]

// ─────────────────────────────────────────────
// FAMILY 11: Consumer Surplus (Integration + Economics)
// ─────────────────────────────────────────────
function makeConsumerSurplus({ id, title, a, P_e, Q_eq, real, difficultyVal = 2 }) {
  const answer = 2 * Q_eq * Q_eq * Q_eq / 3
  return {
    id,
    title,
    emoji: '📊',
    difficulty: difficultyVal,
    color: '#ec4899',
    topics: ['Definite Integrals', 'Economics', 'Area Between Curves', 'Demand Functions'],
    realWorld: real,
    connectionNote: `Economics meets integration: consumer surplus is the area between the demand curve D(q) and the market price line P_e. This integral ∫₀^Q(D(q)-P_e)dq measures total consumer benefit — a direct application of "area between curves" from calculus to microeconomics.`,
    intro: `The demand function for a product is D(q) = ${a} - q². The equilibrium price is P_e = ${P_e} and equilibrium quantity Q_eq = ${Q_eq} (verify: ${a} - ${Q_eq}² = ${P_e}).`,
    question: `Find the consumer surplus CS = ∫₀^${Q_eq} (D(q) - P_e) dq.`,
    latex: `CS = \\int_0^{${Q_eq}} \\left[(${a} - q^2) - ${P_e}\\right]dq = \\int_0^{${Q_eq}} \\left[${a - P_e} - q^2\\right]dq`,
    answerLatex: `CS = \\left[(${a-P_e})q - \\frac{q^3}{3}\\right]_0^{${Q_eq}} = (${a-P_e})\\cdot ${Q_eq} - \\frac{${Q_eq}^3}{3} = \\frac{2\\cdot${Q_eq}^3}{3} = ${answer.toFixed(4)}`,
    answer: answer,
    unit: 'dollars',
    check: nc(answer),
    slider: { min: 0, max: Q_eq, step: Q_eq / 20, default: Q_eq / 2, label: (v) => `Q = ${v.toFixed(2)}` },
    getSetupGraph: (sv) => {
      const qs = linspace(0, Q_eq * 1.2, 200)
      const Ds = qs.map(q => a - q * q)
      const qShade = linspace(0, sv, 100)
      const shadeY = qShade.map(q => Math.max(a - q * q - P_e, 0))
      return {
        data: [
          { x: [...qShade, sv, 0], y: [...shadeY, 0, 0], fill: 'toself', fillcolor: 'rgba(236,72,153,0.3)', line: { color: 'transparent' }, name: 'CS area' },
          { x: qs, y: Ds, mode: 'lines', line: { color: '#ec4899', width: 3 }, name: `D(q) = ${a}-q²` },
          { x: [0, Q_eq * 1.2], y: [P_e, P_e], mode: 'lines', line: { color: '#10b981', width: 2, dash: 'dash' }, name: `P_e = ${P_e}` },
          { x: [Q_eq], y: [P_e], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: `Equilibrium` },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 'Quantity q' }, yaxis: { ...BG.yaxis, title: 'Price P' } }
      }
    },
    hints: [
      { title: 'Consumer surplus definition', text: 'CS is the area between the demand curve and the market price line.', formula: `CS = \\int_0^{Q_{eq}} [D(q) - P_e]\\,dq` },
      { title: 'Substitute and simplify', formula: `CS = \\int_0^{${Q_eq}} [(${a} - q^2) - ${P_e}]\\,dq = \\int_0^{${Q_eq}} [${a-P_e} - q^2]\\,dq` },
      { title: 'Antiderivative', formula: `= \\left[${a-P_e}q - \\frac{q^3}{3}\\right]_0^{${Q_eq}}` },
      { title: 'Evaluate', formula: `= ${(a-P_e)*Q_eq} - \\frac{${Q_eq*Q_eq*Q_eq}}{3} = ${(a-P_e)*Q_eq} - ${(Q_eq*Q_eq*Q_eq/3).toFixed(4)} = ${answer.toFixed(4)}` },
    ],
    solution: [
      { title: 'Verify equilibrium condition', formula: `D(${Q_eq}) = ${a} - ${Q_eq}^2 = ${a - Q_eq*Q_eq} = ${P_e} = P_e \\checkmark` },
      { title: 'Consumer surplus integral', formula: `CS = \\int_0^{${Q_eq}} [${a}-q^2-${P_e}]\\,dq = \\int_0^{${Q_eq}} [${a-P_e}-q^2]\\,dq` },
      { title: 'Integrate term by term', formula: `CS = \\left[${a-P_e}q - \\frac{q^3}{3}\\right]_0^{${Q_eq}} = ${(a-P_e)*Q_eq} - \\frac{${Q_eq**3}}{3}` },
      {
        title: 'Result with surplus area',
        formula: `CS = \\frac{2\\cdot${Q_eq}^3}{3} = \\frac{${2*Q_eq**3}}{3} \\approx ${answer.toFixed(4)}\\text{ dollars}`,
        graph: (() => {
          const qs = linspace(0, Q_eq * 1.2, 200)
          const Ds = qs.map(q => a - q * q)
          const qFull = linspace(0, Q_eq, 100)
          const CSarea = qFull.map(q => a - q * q - P_e)
          return {
            data: [
              { x: [...qFull, Q_eq, 0], y: [...CSarea, 0, 0], fill: 'toself', fillcolor: 'rgba(236,72,153,0.35)', line: { color: '#ec4899', width: 1 }, name: `CS = ${answer.toFixed(2)}` },
              { x: qs, y: Ds, mode: 'lines', line: { color: '#ec4899', width: 3 }, name: 'D(q)' },
              { x: [0, Q_eq * 1.2], y: [P_e, P_e], mode: 'lines', line: { color: '#10b981', width: 2, dash: 'dash' }, name: `P_e=${P_e}` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 'Quantity q' }, yaxis: { ...BG.yaxis, title: 'Price P' } }
          }
        })()
      },
    ]
  }
}

const surplusParams = [
  { id: 'cross-cs-1', title: 'The Electronics Market', a: 100, P_e: 64, Q_eq: 6, real: 'Consumer electronics pricing', difficultyVal: 2 },
  { id: 'cross-cs-2', title: 'The Gadget Store', a: 64, P_e: 55, Q_eq: 3, real: 'Technology product demand', difficultyVal: 1 },
  { id: 'cross-cs-3', title: 'The Appliance Market', a: 144, P_e: 63, Q_eq: 9, real: 'Home appliance economics', difficultyVal: 3 },
  { id: 'cross-cs-4', title: 'The Food Market', a: 81, P_e: 45, Q_eq: 6, real: 'Agricultural commodity pricing', difficultyVal: 2 },
  { id: 'cross-cs-5', title: 'The Clothing Store', a: 50, P_e: 34, Q_eq: 4, real: 'Apparel demand analysis', difficultyVal: 2 },
  { id: 'cross-cs-6', title: 'The Toy Market', a: 75, P_e: 50, Q_eq: 5, real: 'Toy industry consumer analysis', difficultyVal: 2 },
  { id: 'cross-cs-7', title: 'The Book Market', a: 120, P_e: 84, Q_eq: 6, real: 'Publishing market economics', difficultyVal: 2 },
  { id: 'cross-cs-8', title: 'The Sports Gear Market', a: 36, P_e: 11, Q_eq: 5, real: 'Sports equipment demand', difficultyVal: 2 },
]


// ─────────────────────────────────────────────
// FAMILY 12: Population Doubling (Exponential Growth + Logs)
// ─────────────────────────────────────────────
function makePopulation({ id, title, P0, Td, t_query, real, difficultyVal = 1 }) {
  const answer = P0 * Math.pow(2, t_query / Td)
  return {
    id,
    title,
    emoji: '👥',
    difficulty: difficultyVal,
    color: '#8b5cf6',
    topics: ['Exponential Growth', 'Doubling Time', 'Logarithms', 'Differential Equations'],
    realWorld: real,
    connectionNote: `Exponential growth models many natural phenomena: P(t)=P₀·2^(t/Td) comes from the ODE dP/dt=(ln2/Td)P. The doubling time Td is the key parameter — found by solving P(Td)=2P₀. This connects DiffEq solutions to logarithmic arithmetic with real-world population data.`,
    intro: `A population starts at ${P0} individuals and doubles every ${Td} years. The model is P(t) = ${P0} · 2^(t/${Td}).`,
    question: `Find the population P(${t_query}) after ${t_query} years.`,
    latex: `P(t) = ${P0}\\cdot 2^{t/${Td}},\\quad P(${t_query}) = ?`,
    answerLatex: `P(${t_query}) = ${P0}\\cdot 2^{${t_query}/${Td}} = ${P0}\\cdot 2^{${(t_query/Td).toFixed(2)}} \\approx ${Math.round(answer)}`,
    answer: answer,
    unit: 'individuals',
    check: nc(answer, 0.02),
    slider: { min: 0, max: 3 * Td, step: Td / 10, default: t_query, label: (v) => `t = ${v.toFixed(0)} yrs` },
    getSetupGraph: (sv) => {
      const tEnd = Math.max(3 * Td, t_query * 1.2)
      const ts = linspace(0, tEnd, 200)
      const Ps = ts.map(t => P0 * Math.pow(2, t / Td))
      const Pcur = P0 * Math.pow(2, sv / Td)
      const doublings = Array.from({length: 4}, (_, i) => (i + 1) * Td).filter(t => t <= tEnd)
      return {
        data: [
          { x: ts, y: Ps, mode: 'lines', line: { color: '#8b5cf6', width: 3 }, name: 'P(t)' },
          { x: doublings, y: doublings.map(t => P0 * Math.pow(2, t / Td)), mode: 'markers', marker: { color: '#06b6d4', size: 10, symbol: 'diamond' }, name: 'Doubling marks' },
          { x: [sv], y: [Pcur], mode: 'markers', marker: { color: '#f59e0b', size: 12, symbol: 'circle' }, name: `P(${sv.toFixed(0)})` },
        ],
        layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (years)' }, yaxis: { ...BG.yaxis, title: 'Population' } }
      }
    },
    hints: [
      { title: 'The doubling model', formula: `P(t) = P_0 \\cdot 2^{t/T_d} = ${P0} \\cdot 2^{t/${Td}}` },
      { title: 'Substitute t = t_query', formula: `P(${t_query}) = ${P0} \\cdot 2^{${t_query}/${Td}}` },
      { title: 'Simplify the exponent', formula: `\\frac{${t_query}}{${Td}} = ${(t_query/Td).toFixed(4)}\\text{ doublings}` },
      { title: 'Compute', formula: `P(${t_query}) = ${P0} \\cdot ${Math.pow(2, t_query/Td).toFixed(4)} \\approx ${Math.round(answer)}` },
    ],
    solution: [
      { title: 'Doubling time model from ODE', formula: `\\frac{dP}{dt} = \\frac{\\ln 2}{T_d}P \\Rightarrow P(t) = P_0 e^{(\\ln 2/T_d)t} = P_0\\cdot 2^{t/T_d}` },
      { title: 'Apply the formula', formula: `P(${t_query}) = ${P0}\\cdot 2^{${t_query}/${Td}} = ${P0}\\cdot 2^{${(t_query/Td).toFixed(4)}}` },
      { title: 'Evaluate', formula: `P(${t_query}) \\approx ${P0} \\times ${Math.pow(2, t_query/Td).toFixed(4)} = ${answer.toFixed(2)}\\approx ${Math.round(answer)}` },
      {
        title: 'Log-scale visualization',
        text: 'On a log scale, exponential growth appears as a straight line:',
        formula: `\\log_2 P = \\log_2(${P0}) + \\frac{t}{${Td}}`,
        graph: (() => {
          const tEnd = Math.max(3 * Td, t_query * 1.2)
          const ts = linspace(0, tEnd, 200)
          const logPs = ts.map(t => Math.log2(P0 * Math.pow(2, t / Td)))
          return {
            data: [
              { x: ts, y: logPs, mode: 'lines', line: { color: '#8b5cf6', width: 3 }, name: 'log₂P(t)' },
              { x: [t_query], y: [Math.log2(answer)], mode: 'markers', marker: { color: '#f59e0b', size: 14, symbol: 'star' }, name: `t=${t_query}` },
            ],
            layout: { ...BG, xaxis: { ...BG.xaxis, title: 't (years)' }, yaxis: { ...BG.yaxis, title: 'log₂ P' } }
          }
        })()
      },
    ]
  }
}

const popParams = [
  { id: 'cross-pop-1', title: 'The Startup Employees', P0: 100, Td: 10, t_query: 30, real: 'Company growth modeling', difficultyVal: 1 },
  { id: 'cross-pop-2', title: 'The Bacteria Culture', P0: 200, Td: 5, t_query: 20, real: 'Microbiology lab work', difficultyVal: 1 },
  { id: 'cross-pop-3', title: 'The Forest Population', P0: 50, Td: 20, t_query: 60, real: 'Wildlife conservation', difficultyVal: 2 },
  { id: 'cross-pop-4', title: 'The City Growth', P0: 1000, Td: 10, t_query: 40, real: 'Urban planning', difficultyVal: 2 },
  { id: 'cross-pop-5', title: 'The Yeast Colony', P0: 500, Td: 25, t_query: 75, real: 'Fermentation biology', difficultyVal: 2 },
  { id: 'cross-pop-6', title: 'The Viral Spread', P0: 100, Td: 15, t_query: 45, real: 'Viral content sharing', difficultyVal: 2 },
  { id: 'cross-pop-7', title: 'The Investment Fund', P0: 250, Td: 8, t_query: 32, real: 'Compound growth finance', difficultyVal: 2 },
  { id: 'cross-pop-8', title: 'The Species Recovery', P0: 100, Td: 10, t_query: 50, real: 'Endangered species recovery', difficultyVal: 2 },
]


// ─────────────────────────────────────────────
// BUILD THE ARRAY
// ─────────────────────────────────────────────
export const CROSS_PROBLEMS = [
  ...ladderParams.map(p => makeLadder(p)),
  ...canParams.map(p => makeOptimalCan(p)),
  ...rocketParams.map(p => makeRocket(p)),
  ...epidemicParams.map(p => makeEpidemic(p)),
  ...ferrisParams.map(p => makeFerrisWheel(p)),
  ...drugParams.map(p => makeDrug(p)),
  ...ballParams.map(p => makeBouncingBall(p)),
  ...arcParams.map(p => makeArcLength(p)),
  ...tankParams.map(p => makeWaterTank(p)),
  ...springParams.map(p => makeSpringWork(p)),
  ...surplusParams.map(p => makeConsumerSurplus(p)),
  ...popParams.map(p => makePopulation(p)),
]
