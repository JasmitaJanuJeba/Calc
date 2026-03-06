import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { generatePoints, evaluateExpression, numericalIntegral, riemannSum, formatNumber } from '../utils/mathHelpers'
import { BlockMath } from 'react-katex'
import styles from './Topic.module.css'

const SUBTOPICS = [RiemannSums, FundamentalTheorem, USub, IntByParts, PartialFractions, ImproperIntegrals]

export default function IntegralsTopic({ subtopicIndex, color }) {
  const C = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <C color={color} />
}

function RiemannSums({ color }) {
  const [expr, setExpr] = useState('x^2')
  const [a, setA] = useState(0)
  const [b, setB] = useState(2)
  const [n, setN] = useState(8)
  const [method, setMethod] = useState('midpoint')

  const sum = useMemo(() => riemannSum(expr, a, b, n, method), [expr, a, b, n, method])
  const exact = useMemo(() => numericalIntegral(expr, a, b), [expr, a, b])

  const { xs, ys } = useMemo(() => generatePoints(expr, a - 0.5, b + 0.5), [expr, a, b])

  // Build rectangles
  const rectShapes = useMemo(() => {
    const h = (b - a) / n
    return Array.from({ length: n }, (_, i) => {
      let xRect
      if (method === 'left') xRect = a + i * h
      else if (method === 'right') xRect = a + (i + 1) * h
      else xRect = a + (i + 0.5) * h
      const height = evaluateExpression(expr, xRect)
      return { x0: a + i * h, x1: a + (i + 1) * h, y0: 0, y1: height }
    }).filter(r => r.y1 !== null && isFinite(r.y1))
  }, [expr, a, b, n, method])

  const steps = [
    {
      title: 'Partition the Interval',
      text: `Divide [${a}, ${b}] into ${n} equal subintervals of width $\\Delta x = \\frac{${b}-${a}}{${n}} = ${formatNumber((b-a)/n, 3)}$`,
    },
    {
      title: 'Choose Sample Points',
      text: `Using ${method} method: for each subinterval, evaluate f at the ${method} endpoint.`,
    },
    {
      title: 'Sum the Rectangles',
      formula: `R_${n} = \\sum_{i=1}^{${n}} f(x_i^*) \\Delta x \\approx ${formatNumber(sum, 5)}`,
    },
    {
      title: 'Compare to Exact',
      formula: `\\int_{${a}}^{${b}} f(x)\\,dx = ${formatNumber(exact, 5)}, \\quad \\text{Error} = ${formatNumber(Math.abs(sum - exact), 5)}`,
      note: 'As n → ∞, the Riemann sum approaches the exact integral.',
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Riemann Sum Calculator</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div className={styles.grid2}>
              <CalcInput label="a (lower)" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" />
              <CalcInput label="b (upper)" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" />
            </div>
            <div className={styles.btnRow}>
              {['left','midpoint','right'].map(m => (
                <button key={m} className={`${styles.exBtn} ${method===m?styles.exBtnActive:''}`}
                  onClick={() => setMethod(m)} style={{'--btn-color': color}}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>n = {n}</span>
              <input type="range" min={1} max={50} value={n} onChange={e => setN(+e.target.value)} style={{'--slider-color': color}} />
              <span style={{color: 'rgba(240,240,255,0.4)', fontSize:'0.8rem'}}>50</span>
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Riemann Sum</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(sum, 5)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Exact Integral</div>
                <div className={styles.infoValue}>{formatNumber(exact, 5)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Riemann Rectangles"
          data={[
            ...rectShapes.map((r, i) => ({
              x: [r.x0, r.x0, r.x1, r.x1, r.x0],
              y: [0, r.y1, r.y1, 0, 0],
              type: 'scatter', mode: 'lines', fill: 'toself',
              fillcolor: color + '30', line: { color, width: 0.5 },
              showlegend: i === 0, name: 'Rectangles', hoverinfo: 'skip'
            })),
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color: '#f0f0ff', width: 2 }, name: 'f(x)' },
          ]}
          footer={`${n} rectangles using ${method} rule`}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Riemann Sums"
          answer={`\\int_{${a}}^{${b}} f(x)\\,dx \\approx ${formatNumber(sum, 4)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Riemann Sum Definition</div>
          <div className={styles.conceptBody}>
            <BlockMath math="\int_a^b f(x)\,dx = \lim_{n \to \infty} \sum_{i=1}^n f(x_i^*)\,\Delta x" />
            <ul style={{marginTop: 12}}>
              <li>Left: sample at left endpoint</li>
              <li>Right: sample at right endpoint</li>
              <li>Midpoint: most accurate</li>
              <li>Trapezoidal: average of L & R</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function FundamentalTheorem({ color }) {
  const [expr, setExpr] = useState('x^2')
  const [a, setA] = useState(0)
  const [b, setB] = useState(3)
  const [t, setT] = useState(2)

  const integral = useMemo(() => numericalIntegral(expr, a, b), [expr, a, b])
  const { xs, ys } = useMemo(() => generatePoints(expr, a - 0.5, b + 0.5), [expr, a, b])

  // Shaded area
  const areaXs = useMemo(() => {
    const pts = []
    for (let x = a; x <= b; x += (b-a)/200) pts.push(x)
    return pts
  }, [a, b])
  const areaYs = useMemo(() => areaXs.map(x => evaluateExpression(expr, x)), [areaXs, expr])

  // F(t) = integral from a to t
  const Fxs = useMemo(() => {
    const pts = [], fvals = []
    for (let x = a; x <= b + 0.1; x += (b-a)/100) {
      pts.push(x)
      fvals.push(numericalIntegral(expr, a, x))
    }
    return { xs: pts, ys: fvals }
  }, [expr, a, b])

  const steps = [
    {
      title: 'FTC Part 1',
      text: 'If $F(x) = \\int_a^x f(t)\\,dt$, then $F\'(x) = f(x)$.',
      formula: '\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)',
      note: 'Differentiation and integration are inverse operations!',
    },
    {
      title: 'FTC Part 2',
      text: 'To evaluate a definite integral, find an antiderivative F, then:',
      formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
    },
    {
      title: `Apply to ∫₀³ x² dx`,
      text: 'Antiderivative of x² is x³/3',
      formula: '\\int_0^3 x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^3 = \\frac{27}{3} - \\frac{0}{3} = 9',
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>FTC Explorer</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div className={styles.grid2}>
              <CalcInput label="a" value={a} onChange={v=>setA(parseFloat(v)||0)} type="number" />
              <CalcInput label="b" value={b} onChange={v=>setB(parseFloat(v)||1)} type="number" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>∫ₐᵇ f(x) dx</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(integral, 5)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Area Under the Curve"
          data={[
            {
              x: [...areaXs, b, a], y: [...areaYs, 0, 0],
              type: 'scatter', mode: 'lines', fill: 'toself',
              fillcolor: color + '25', line: { color: 'transparent' }, name: 'Area', hoverinfo: 'skip'
            },
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)' },
            { x: [a, a], y: [0, evaluateExpression(expr, a)], type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 1.5, dash:'dash' }, showlegend:false },
            { x: [b, b], y: [0, evaluateExpression(expr, b)], type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 1.5, dash:'dash' }, showlegend:false },
          ]}
          footer={`Shaded area = ${formatNumber(integral, 4)}`}
        />
      </div>
      <div className={styles.right}>
        <GraphPanel
          title="F(x) = ∫ₐˣ f(t)dt (Accumulation Function)"
          data={[
            { x: Fxs.xs, y: Fxs.ys, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2.5 }, name: 'F(x)' },
          ]}
          footer="F'(x) = f(x) — the derivative of the accumulation function is f"
        />
        <StepByStep steps={steps} color={color} title="Fundamental Theorem of Calculus"
          answer={`\\int_{${a}}^{${b}} f(x)\\,dx = ${formatNumber(integral, 4)}`} />
      </div>
    </div>
  )
}

function USub({ color }) {
  const examples = [
    {
      label: '∫ 2x·cos(x²) dx',
      steps: [
        { title: 'Choose u', text: 'Let $u = x^2$ (the "inside" function)', formula: 'u = x^2' },
        { title: 'Find du', formula: 'du = 2x\\,dx \\Rightarrow dx = \\frac{du}{2x}' },
        { title: 'Substitute', formula: '\\int 2x \\cos(x^2)\\,dx = \\int \\cos(u)\\,du' },
        { title: 'Integrate', formula: '= \\sin(u) + C' },
        { title: 'Back-substitute', formula: '= \\sin(x^2) + C' },
      ], answer: '\\sin(x^2) + C'
    },
    {
      label: '∫ 3x²·e^(x³) dx',
      steps: [
        { title: 'Choose u', text: 'Let $u = x^3$', formula: 'u = x^3' },
        { title: 'Find du', formula: 'du = 3x^2\\,dx' },
        { title: 'Substitute', formula: '\\int 3x^2 e^{x^3}\\,dx = \\int e^u\\,du' },
        { title: 'Integrate', formula: '= e^u + C' },
        { title: 'Back-substitute', formula: '= e^{x^3} + C' },
      ], answer: 'e^{x^3} + C'
    },
    {
      label: '∫ x/(x²+1) dx',
      steps: [
        { title: 'Choose u', text: 'Let $u = x^2 + 1$', formula: 'u = x^2 + 1' },
        { title: 'Find du', formula: 'du = 2x\\,dx \\Rightarrow x\\,dx = \\frac{du}{2}' },
        { title: 'Substitute', formula: '\\int \\frac{x}{x^2+1}\\,dx = \\frac{1}{2}\\int \\frac{du}{u}' },
        { title: 'Integrate', formula: '= \\frac{1}{2}\\ln|u| + C' },
        { title: 'Back-substitute', formula: '= \\frac{1}{2}\\ln(x^2+1) + C' },
      ], answer: '\\frac{1}{2}\\ln(x^2+1) + C'
    }
  ]
  const [sel, setSel] = useState(0)
  const ex = examples[sel]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>U-Substitution Examples</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {examples.map((e, i) => (
                <button key={i} className={`${styles.exBtn} ${sel===i?styles.exBtnActive:''}`}
                  onClick={() => setSel(i)} style={{'--btn-color': color}}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>U-Sub Strategy</div>
          <div className={styles.conceptBody}>
            <p>Look for: $\int f(g(x)) \cdot g'(x)\,dx$</p>
            <BlockMath math="\int f(g(x))\,g'(x)\,dx = \int f(u)\,du" />
            <ul style={{marginTop:10}}>
              <li>Choose u = inner function</li>
              <li>Compute du/dx, solve for dx</li>
              <li>Everything must convert to u!</li>
              <li>Back-substitute after integrating</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <StepByStep steps={ex.steps} color={color} title="U-Substitution" answer={ex.answer} />
      </div>
    </div>
  )
}

function IntByParts({ color }) {
  const examples = [
    {
      label: '∫ x·eˣ dx',
      u: 'x', dv: 'e^x\\,dx', v: 'e^x', du: 'dx',
      steps: [
        { title: 'Choose u and dv (use LIATE)', text: 'LIATE: Logarithmic, Inverse trig, Algebraic, Trig, Exponential', formula: 'u = x, \\quad dv = e^x\\,dx' },
        { title: 'Find du and v', formula: 'du = dx, \\quad v = e^x' },
        { title: 'Apply Formula', formula: '\\int x e^x\\,dx = xe^x - \\int e^x\\,dx' },
        { title: 'Integrate Remaining', formula: '= xe^x - e^x + C = e^x(x-1) + C' },
      ], answer: 'e^x(x-1) + C'
    },
    {
      label: '∫ x·sin(x) dx',
      u: 'x', dv: '\\sin x\\,dx', v: '-\\cos x', du: 'dx',
      steps: [
        { title: 'Choose u and dv', formula: 'u = x, \\quad dv = \\sin x\\,dx' },
        { title: 'Find du and v', formula: 'du = dx, \\quad v = -\\cos x' },
        { title: 'Apply Formula', formula: '\\int x\\sin x\\,dx = -x\\cos x - \\int(-\\cos x)\\,dx' },
        { title: 'Simplify', formula: '= -x\\cos x + \\sin x + C' },
      ], answer: '-x\\cos x + \\sin x + C'
    },
    {
      label: '∫ ln(x) dx',
      u: '\\ln x', dv: 'dx', v: 'x', du: '1/x dx',
      steps: [
        { title: 'Choose u and dv', text: 'ln(x) is Logarithmic (first in LIATE)', formula: 'u = \\ln x, \\quad dv = dx' },
        { title: 'Find du and v', formula: 'du = \\frac{1}{x}dx, \\quad v = x' },
        { title: 'Apply Formula', formula: '\\int \\ln x\\,dx = x\\ln x - \\int x \\cdot \\frac{1}{x}\\,dx' },
        { title: 'Simplify', formula: '= x\\ln x - \\int 1\\,dx = x\\ln x - x + C' },
      ], answer: 'x\\ln x - x + C'
    }
  ]
  const [sel, setSel] = useState(0)
  const ex = examples[sel]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Integration by Parts</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {examples.map((e, i) => (
                <button key={i} className={`${styles.exBtn} ${sel===i?styles.exBtnActive:''}`}
                  onClick={() => setSel(i)} style={{'--btn-color': color}}>
                  {e.label}
                </button>
              ))}
            </div>
            <div style={{marginTop: 12}}>
              <BlockMath math="\int u\,dv = uv - \int v\,du" />
            </div>
            <div className={styles.grid2} style={{marginTop: 8}}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>u = </div>
                <div className={styles.infoValue}><BlockMath math={ex.u} /></div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>dv = </div>
                <div className={styles.infoValue}><BlockMath math={ex.dv} /></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>LIATE Rule</div>
          <div className={styles.conceptBody}>
            <p>Choose u in this priority order:</p>
            <ul>
              <li><strong style={{color:'#a78bfa'}}>L</strong>ogarithmic (ln x)</li>
              <li><strong style={{color:'#ec4899'}}>I</strong>nverse trig (arctan x)</li>
              <li><strong style={{color:'#06b6d4'}}>A</strong>lgebraic (x², x, 3)</li>
              <li><strong style={{color:'#10b981'}}>T</strong>rig (sin x, cos x)</li>
              <li><strong style={{color:'#f59e0b'}}>E</strong>xponential (eˣ)</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <StepByStep steps={ex.steps} color={color} title="Integration by Parts" answer={ex.answer} />
      </div>
    </div>
  )
}

function PartialFractions({ color }) {
  const steps = [
    {
      title: 'Factor the Denominator',
      text: 'Decompose the denominator into irreducible factors:',
      formula: '\\frac{2x+3}{x^2-x-2} = \\frac{2x+3}{(x-2)(x+1)}',
    },
    {
      title: 'Set Up Partial Fractions',
      formula: '\\frac{2x+3}{(x-2)(x+1)} = \\frac{A}{x-2} + \\frac{B}{x+1}',
    },
    {
      title: 'Clear the Denominator',
      formula: '2x+3 = A(x+1) + B(x-2)',
    },
    {
      title: 'Solve for A and B',
      text: 'Plug in strategic x values:',
      formula: 'x=2: 7 = 3A \\Rightarrow A = \\frac{7}{3} \\qquad x=-1: 1 = -3B \\Rightarrow B = -\\frac{1}{3}',
    },
    {
      title: 'Integrate Each Term',
      formula: '\\int \\frac{2x+3}{x^2-x-2}\\,dx = \\frac{7}{3}\\ln|x-2| - \\frac{1}{3}\\ln|x+1| + C',
    }
  ]

  const { xs: xsL, ys: ysL } = useMemo(() => generatePoints('7/(3*(x-2))', -3, 1.5), [])
  const { xs: xsR, ys: ysR } = useMemo(() => generatePoints('7/(3*(x-2))', 2.5, 6), [])
  const { xs, ys } = useMemo(() => generatePoints('(2*x+3)/((x-2)*(x+1))', -3, 6), [])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <GraphPanel
          title="Partial Fraction Decomposition"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, connectgaps: false, name: 'f(x)' },
          ]}
          layout={{ yaxis: { range: [-10, 10] } }}
          footer="Notice the vertical asymptotes where denominator = 0"
        />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>When to Use Partial Fractions</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Denominator has distinct linear factors: $\frac{A}{x-a} + \frac{B}{x-b}$</li>
              <li>Repeated linear factors: $\frac{A}{x-a} + \frac{B}{(x-a)^2}$</li>
              <li>Irreducible quadratic: $\frac{Ax+B}{x^2+bx+c}$</li>
            </ul>
            <p style={{marginTop:10, fontSize:'0.85rem', color:'rgba(240,240,255,0.4)'}}>
              Degree of numerator must be less than denominator (do long division first if not!)
            </p>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Partial Fractions"
          answer="\\frac{7}{3}\\ln|x-2| - \\frac{1}{3}\\ln|x+1| + C" />
      </div>
    </div>
  )
}

function ImproperIntegrals({ color }) {
  const [type, setType] = useState('infinite')
  const [expr, setExpr] = useState('1/x^2')
  const [limit, setLimit] = useState(100)

  const approxVal = useMemo(() => numericalIntegral(expr, 1, limit), [expr, limit])

  const configs = {
    infinite: {
      title: '∫₁^∞ 1/x² dx',
      steps: [
        { title: 'Replace ∞ with t', formula: '\\int_1^\\infty \\frac{1}{x^2}\\,dx = \\lim_{t \\to \\infty} \\int_1^t \\frac{1}{x^2}\\,dx' },
        { title: 'Evaluate the definite integral', formula: '= \\lim_{t \\to \\infty} \\left[-\\frac{1}{x}\\right]_1^t = \\lim_{t \\to \\infty} \\left(-\\frac{1}{t} + 1\\right)' },
        { title: 'Take the limit', formula: '= 0 + 1 = 1', note: 'Integral converges! The infinite region has finite area.' }
      ],
      answer: '\\int_1^\\infty \\frac{1}{x^2}\\,dx = 1'
    },
    discontinuous: {
      title: '∫₀¹ 1/√x dx',
      steps: [
        { title: 'Replace singularity with limit', formula: '\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx = \\lim_{t \\to 0^+} \\int_t^1 x^{-1/2}\\,dx' },
        { title: 'Integrate', formula: '= \\lim_{t \\to 0^+} \\left[2\\sqrt{x}\\right]_t^1 = \\lim_{t \\to 0^+} (2 - 2\\sqrt{t})' },
        { title: 'Take the limit', formula: '= 2 - 0 = 2', note: 'Despite the singularity at x=0, the integral converges!' }
      ],
      answer: '\\int_0^1 \\frac{1}{\\sqrt{x}}\\,dx = 2'
    }
  }
  const cfg = configs[type]

  const { xs, ys } = useMemo(() => generatePoints(expr, 1, 10), [expr])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Improper Integral Types</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              <button className={`${styles.exBtn} ${type==='infinite'?styles.exBtnActive:''}`}
                onClick={()=>{setType('infinite');setExpr('1/x^2')}} style={{'--btn-color': color}}>
                Infinite Bounds
              </button>
              <button className={`${styles.exBtn} ${type==='discontinuous'?styles.exBtnActive:''}`}
                onClick={()=>{setType('discontinuous');setExpr('1/sqrt(x)')}} style={{'--btn-color': color}}>
                Discontinuity
              </button>
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>t = {limit}</span>
              <input type="range" min={2} max={1000} step={10} value={limit}
                onChange={e => setLimit(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>∫₁ᵗ f(x) dx → (as t→∞)</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(approxVal, 5)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Improper Integral Area"
          data={[{ x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, connectgaps: false, fill: 'tozeroy', fillcolor: color + '20', name: 'f(x)' }]}
          layout={{ yaxis: { range: [-0.5, 5] } }}
          footer="The shaded region extends to ∞ but has finite area!"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={cfg.steps} color={color} title={cfg.title} answer={cfg.answer} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>p-Test for ∫₁^∞ 1/xᵖ dx</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>$p > 1$: integral <strong style={{color:'#10b981'}}>converges</strong></li>
              <li>$p \leq 1$: integral <strong style={{color:'#ef4444'}}>diverges</strong></li>
            </ul>
            <p style={{marginTop:10}}>$\int_1^\infty \frac{'{'}1{'}'}{'{'}x^p{'}'}dx = \frac{'{'}1{'}'}{'{'}p-1{'}'}$ when $p > 1$</p>
          </div>
        </div>
      </div>
    </div>
  )
}
