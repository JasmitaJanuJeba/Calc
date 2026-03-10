import { useState, useMemo } from 'react'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { generatePoints, evaluateExpression, numericalDerivative, criticalPoints, inflectionPoints, formatNumber } from '../utils/mathHelpers'
import { BlockMath, InlineMath } from 'react-katex'
import styles from './Topic.module.css'

const SUBTOPICS = [MVT, CriticalPoints, ConcavityInflection, Optimization, CurveSketching, LinearApprox]

export default function AppDerivativesTopic({ subtopicIndex, color }) {
  const C = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <C color={color} />
}

function MVT({ color }) {
  const [expr, setExpr] = useState('x^3 - x')
  const [a, setA] = useState(-1)
  const [b, setB] = useState(2)

  const fA = useMemo(() => evaluateExpression(expr, a), [expr, a])
  const fB = useMemo(() => evaluateExpression(expr, b), [expr, b])
  const avgSlope = fA !== null && fB !== null ? (fB - fA) / (b - a) : null

  // Find c where f'(c) = average slope
  const cPoints = useMemo(() => {
    if (avgSlope === null) return []
    const pts = []
    for (let x = a + 0.01; x < b; x += 0.01) {
      const d = numericalDerivative(expr, x)
      if (d !== null && Math.abs(d - avgSlope) < 0.05) pts.push(x)
    }
    return pts.slice(0, 3)
  }, [expr, a, b, avgSlope])

  const { xs, ys } = useMemo(() => generatePoints(expr, a - 1, b + 1), [expr, a, b])
  const secantXs = [a, b]
  const secantYs = [fA, fB]

  const steps = [
    {
      title: 'Verify Hypotheses',
      text: `f(x) must be continuous on [${a}, ${b}] and differentiable on (${a}, ${b}).`,
    },
    {
      title: 'Compute f(a) and f(b)',
      formula: `f(${a}) = ${formatNumber(fA)}, \\quad f(${b}) = ${formatNumber(fB)}`,
    },
    {
      title: 'Average Rate of Change',
      formula: `\\frac{f(b)-f(a)}{b-a} = \\frac{${formatNumber(fB)} - ${formatNumber(fA)}}{${b} - ${a}} = ${formatNumber(avgSlope)}`,
    },
    {
      title: 'Find c',
      text: `Set $f'(c) = ${formatNumber(avgSlope)}$ and solve. MVT guarantees at least one such c exists.`,
      formula: cPoints.length > 0 ? `c \\approx ${cPoints.map(c => formatNumber(c, 3)).join(', ')}` : 'c \\text{ found numerically}',
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Mean Value Theorem</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div className={styles.grid2}>
              <CalcInput label="a" value={a} onChange={v => setA(parseFloat(v) || 0)} type="number" />
              <CalcInput label="b" value={b} onChange={v => setB(parseFloat(v) || 1)} type="number" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Average slope</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(avgSlope)}</div>
            </div>
            {cPoints.length > 0 && (
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>c value(s) where f'(c) = avg slope</div>
                <div className={styles.infoValue}>{cPoints.map(c => formatNumber(c, 3)).join(', ')}</div>
              </div>
            )}
          </div>
        </div>
        <GraphPanel
          title="MVT: Tangent Parallel to Secant"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)' },
            { x: secantXs, y: secantYs, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2 }, name: 'Secant line' },
            ...cPoints.map((c, i) => ({
              x: [c - 0.5, c + 0.5],
              y: [evaluateExpression(expr, c) - avgSlope * 0.5, evaluateExpression(expr, c) + avgSlope * 0.5],
              type: 'scatter', mode: 'lines', line: { color: '#10b981', width: 2, dash: 'dash' }, name: i === 0 ? 'Tangent at c' : undefined, showlegend: i === 0
            })),
            ...cPoints.map(c => ({
              x: [c], y: [evaluateExpression(expr, c)],
              type: 'scatter', mode: 'markers', marker: { color: '#10b981', size: 10 }, showlegend: false
            }))
          ]}
          footer="Green tangent lines are parallel to the yellow secant"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Mean Value Theorem"
          answer={`\\exists\\, c \\in (${a},${b}):\\; f'(c) = \\frac{f(b)-f(a)}{b-a} = ${formatNumber(avgSlope)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>MVT Statement</div>
          <div className={styles.conceptBody}>
            <p>If <InlineMath math="f" /> is continuous on <InlineMath math="[a,b]" /> and differentiable on <InlineMath math="(a,b)" />, then <InlineMath math="\exists\, c \in (a,b)" /> such that:</p>
            <BlockMath math="f'(c) = \frac{f(b) - f(a)}{b - a}" />
            <p style={{marginTop:8, fontSize:'0.85rem', color:'rgba(240,240,255,0.5)'}}>Geometric meaning: there's a tangent line parallel to the secant.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CriticalPoints({ color }) {
  const [expr, setExpr] = useState('x^3 - 3*x')

  const { xs, ys } = useMemo(() => generatePoints(expr, -3, 3), [expr])
  const derivPts = useMemo(() => {
    const xs2=[], ys2=[]
    for (let x=-3; x<=3; x+=0.04) { xs2.push(x); ys2.push(numericalDerivative(expr, x)) }
    return {xs: xs2, ys: ys2}
  }, [expr])

  const crits = useMemo(() => criticalPoints(expr, -3, 3), [expr])
  const infls = useMemo(() => inflectionPoints(expr, -3, 3), [expr])

  const steps = [
    {
      title: 'Find f\'(x)',
      text: `Differentiate $f(x) = ${expr}$:`,
      formula: "f'(x) = 3x^2 - 3",
    },
    {
      title: 'Set f\'(x) = 0',
      formula: "3x^2 - 3 = 0 \\Rightarrow x^2 = 1 \\Rightarrow x = \\pm 1",
    },
    {
      title: 'Classify Using First Derivative Test',
      text: 'Check sign of f\'(x) on each side:',
      formula: "f'(-2) = 9 > 0, \\quad f'(0) = -3 < 0 \\Rightarrow x=-1 \\text{ is local max}",
    },
    {
      title: 'Second Derivative Test (Alternative)',
      formula: "f''(x) = 6x: \\quad f''(-1) = -6 < 0 \\Rightarrow \\text{local max}, \\quad f''(1) = 6 > 0 \\Rightarrow \\text{local min}",
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Critical Point Finder</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div>
              {crits.map((p, i) => (
                <div key={i} className={styles.infoBox} style={{ marginBottom: 8 }}>
                  <div className={styles.infoLabel}>{p.type === 'max' ? '📈 Local Max' : '📉 Local Min'}</div>
                  <div className={styles.infoValue}>x = {formatNumber(p.x, 3)}, y = {formatNumber(p.y, 3)}</div>
                </div>
              ))}
              {crits.length === 0 && <p style={{ color: 'rgba(240,240,255,0.4)', fontSize: '0.85rem' }}>No critical points found in [-3, 3]</p>}
            </div>
          </div>
        </div>
        <GraphPanel
          title="f(x), f'(x), and Critical Points"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)' },
            { x: derivPts.xs, y: derivPts.ys, type: 'scatter', mode: 'lines', line: { color: '#ec4899', width: 2, dash: 'dash' }, name: "f'(x)" },
            { x: crits.filter(p => p.type==='max').map(p => p.x), y: crits.filter(p => p.type==='max').map(p => p.y),
              type: 'scatter', mode: 'markers', marker: { color: '#10b981', size: 12, symbol: 'triangle-up' }, name: 'Local Max' },
            { x: crits.filter(p => p.type==='min').map(p => p.x), y: crits.filter(p => p.type==='min').map(p => p.y),
              type: 'scatter', mode: 'markers', marker: { color: '#ef4444', size: 12, symbol: 'triangle-down' }, name: 'Local Min' },
          ]}
          layout={{ yaxis: { range: [-5, 5] } }}
          footer="Green triangles = local max, Red triangles = local min"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Finding Critical Points" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>First & Second Derivative Tests</div>
          <div className={styles.conceptBody}>
            <p><strong>First Derivative Test:</strong></p>
            <ul>
              <li>f' changes + to − → local max</li>
              <li>f' changes − to + → local min</li>
            </ul>
            <p style={{marginTop:10}}><strong>Second Derivative Test:</strong></p>
            <ul>
              <li>f''(c) {'<'} 0 → local max (concave down)</li>
              <li>f''(c) {'>'} 0 → local min (concave up)</li>
              <li>f''(c) = 0 → inconclusive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConcavityInflection({ color }) {
  const [expr, setExpr] = useState('x^4 - 4*x^3 + 4')

  const { xs, ys } = useMemo(() => generatePoints(expr, -1, 4), [expr])
  const d2Pts = useMemo(() => {
    const xs2=[], ys2=[]
    for (let x=-1; x<=4; x+=0.04) {
      xs2.push(x)
      const d1 = (x2) => numericalDerivative(expr, x2)
      const d2 = (d1(x + 1e-5) - d1(x - 1e-5)) / (2e-5)
      ys2.push(d2)
    }
    return {xs: xs2, ys: ys2}
  }, [expr])

  const infls = useMemo(() => inflectionPoints(expr, -1, 4), [expr])

  const steps = [
    { title: 'Find f\'\'(x)', formula: 'f\'\'(x) = 12x^2 - 24x', text: 'Differentiate twice.' },
    { title: 'Find Inflection Points', formula: '12x^2 - 24x = 0 \\Rightarrow 12x(x-2) = 0 \\Rightarrow x = 0, 2' },
    { title: 'Test Intervals', text: 'Check sign of f\'\'(x) in each interval:', formula: 'f\'\'(-1) = 36 > 0 \\text{ (concave up)}, \\quad f\'\'(1) = -12 < 0 \\text{ (concave down)}' },
    { title: 'Conclusion', formula: 'x=0 \\text{ and } x=2 \\text{ are inflection points (concavity changes)}' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Concavity Analysis</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(240,240,255,0.5)', marginBottom: 8 }}>Inflection Points:</p>
              {infls.map((p, i) => (
                <div key={i} className={styles.infoBox} style={{ marginBottom: 8 }}>
                  <div className={styles.infoLabel}>Inflection Point {i+1}</div>
                  <div className={styles.infoValue}>x ≈ {formatNumber(p.x, 3)}, y ≈ {formatNumber(p.y, 3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <GraphPanel
          title="f(x) and f''(x)"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)' },
            { x: d2Pts.xs, y: d2Pts.ys, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2, dash:'dash' }, name: "f''(x)", connectgaps: false },
            { x: infls.map(p=>p.x), y: infls.map(p=>p.y), type: 'scatter', mode: 'markers', marker: { color: '#ec4899', size: 12, symbol:'diamond' }, name: 'Inflection' },
          ]}
          layout={{ yaxis: { range: [-20, 20] } }}
          footer="f'' > 0: concave up ∪, f'' < 0: concave down ∩"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Concavity & Inflection Points" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Concavity Rules</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>f&apos;&apos;(x) &gt; 0 → concave up (∪)</li>
              <li>f&apos;&apos;(x) &lt; 0 → concave down (∩)</li>
              <li>Inflection point: where concavity <strong>changes</strong></li>
              <li>Check: f'' changes sign at the point</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Optimization({ color }) {
  const [L, setL] = useState(100)
  const [type, setType] = useState('fence')

  const configs = {
    fence: {
      title: 'Fence a Rectangular Field',
      desc: `Maximize area with ${L}m of fencing (one side is a wall)`,
      xLabel: 'Width (m)',
      expr: (x) => x * (L - 2 * x),
      optimal: L / 4,
      area: (L / 4) * (L / 2),
      steps: [
        { title: 'Define Variables', text: 'Let x = width. Then length = L - 2x (since one side is wall).' },
        { title: 'Write Objective', formula: 'A(x) = x(L - 2x) = Lx - 2x^2' },
        { title: 'Differentiate & Set to 0', formula: "A'(x) = L - 4x = 0 \\Rightarrow x = \\frac{L}{4}" },
        { title: 'Confirm Maximum', formula: "A''(x) = -4 < 0 \\Rightarrow \\text{maximum!}" },
      ]
    },
    box: {
      title: 'Open-Top Box',
      desc: `Maximize volume of open box from ${L}cm square sheet`,
      xLabel: 'Corner cut (cm)',
      expr: (x) => x * (L - 2 * x) ** 2,
      optimal: L / 6,
      area: (L / 6) * (L - L / 3) ** 2,
      steps: [
        { title: 'Set Up', text: 'Cut squares of side x from corners, fold up.' },
        { title: 'Volume Formula', formula: 'V(x) = x(L - 2x)^2' },
        { title: 'Differentiate', formula: "V'(x) = (L-2x)^2 + x \\cdot 2(L-2x)(-2) = (L-2x)(L-6x)" },
        { title: 'Solve', formula: `V'(x) = 0 \\Rightarrow x = \\frac{L}{6} = ${formatNumber(L/6, 2)}` },
      ]
    }
  }

  const cfg = configs[type]
  const xMax = type === 'fence' ? L / 2 : L / 2
  const xs = useMemo(() => Array.from({length:100}, (_,i) => i * xMax / 100), [xMax])
  const ys = useMemo(() => xs.map(x => Math.max(0, cfg.expr(x))), [xs, cfg])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Optimization Problems</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              <button className={`${styles.exBtn} ${type==='fence'?styles.exBtnActive:''}`} onClick={() => setType('fence')} style={{'--btn-color': color}}>Fence</button>
              <button className={`${styles.exBtn} ${type==='box'?styles.exBtnActive:''}`} onClick={() => setType('box')} style={{'--btn-color': color}}>Box</button>
            </div>
            <p style={{fontSize:'0.85rem', color:'rgba(240,240,255,0.6)'}}>{cfg.desc}</p>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>L = {L}</span>
              <input type="range" min={20} max={200} step={10} value={L} onChange={e => setL(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Optimal x</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(cfg.optimal, 2)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Max value</div>
                <div className={styles.infoValue} style={{ color: '#10b981' }}>{formatNumber(cfg.area, 2)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title={cfg.title}
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: type==='fence' ? 'Area(x)' : 'Volume(x)' },
            { x: [cfg.optimal], y: [cfg.expr(cfg.optimal)], type: 'scatter', mode: 'markers', marker: { color: '#10b981', size: 12 }, name: 'Maximum' }
          ]}
          footer="Green dot = optimal value"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={cfg.steps} color={color} title="Optimization Strategy"
          answer={`x_{\\text{opt}} = \\frac{L}{${type==='fence'?4:6}} = ${formatNumber(cfg.optimal, 2)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Optimization Steps</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Draw a diagram and label variables</li>
              <li>Write the objective function</li>
              <li>Use constraints to reduce to one variable</li>
              <li>Take derivative and set to zero</li>
              <li>Verify it's a max/min (second derivative or closed interval test)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function CurveSketching({ color }) {
  const [expr, setExpr] = useState('x^3 - 3*x^2 - 9*x + 2')

  const { xs, ys } = useMemo(() => generatePoints(expr, -3, 6), [expr])
  const crits = useMemo(() => criticalPoints(expr, -3, 6), [expr])
  const infls = useMemo(() => inflectionPoints(expr, -3, 6), [expr])
  const derivPts = useMemo(() => {
    const xs2=[], ys2=[]
    for (let x=-3; x<=6; x+=0.05) { xs2.push(x); ys2.push(numericalDerivative(expr, x)) }
    return {xs: xs2, ys: ys2}
  }, [expr])

  const steps = [
    { title: 'Domain', text: 'For polynomials: all real numbers.' },
    { title: 'Intercepts', text: 'Find x-intercepts (f(x)=0) and y-intercept (f(0)):', formula: 'f(0) = 2' },
    { title: 'Critical Points', text: `Set f'(x) = 0: ${crits.map(p => `x ≈ ${formatNumber(p.x,2)}`).join(', ')}` },
    { title: 'Inflection Points', text: `Set f''(x) = 0: ${infls.map(p => `x ≈ ${formatNumber(p.x,2)}`).join(', ')}` },
    { title: 'Asymptotes', text: 'Polynomials have no asymptotes. End behavior: as x→±∞, f→±∞.' },
    { title: 'Sketch', text: 'Connect all features smoothly, respecting increases/decreases and concavity.' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Curve Analysis</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Local Maxima</div>
                <div className={styles.infoValue}>{crits.filter(p=>p.type==='max').map(p=>`x≈${formatNumber(p.x,2)}`).join(', ') || 'None'}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Local Minima</div>
                <div className={styles.infoValue}>{crits.filter(p=>p.type==='min').map(p=>`x≈${formatNumber(p.x,2)}`).join(', ') || 'None'}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Complete Curve Sketch"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)' },
            { x: derivPts.xs, y: derivPts.ys, type: 'scatter', mode: 'lines', line: { color: '#a78bfa', width: 1.5, dash: 'dot' }, name: "f'(x)" },
            { x: crits.filter(p=>p.type==='max').map(p=>p.x), y: crits.filter(p=>p.type==='max').map(p=>p.y), type: 'scatter', mode: 'markers', marker: { color: '#10b981', size: 12, symbol:'triangle-up' }, name: 'Local Max' },
            { x: crits.filter(p=>p.type==='min').map(p=>p.x), y: crits.filter(p=>p.type==='min').map(p=>p.y), type: 'scatter', mode: 'markers', marker: { color: '#ef4444', size: 12, symbol:'triangle-down' }, name: 'Local Min' },
            { x: infls.map(p=>p.x), y: infls.map(p=>p.y), type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10, symbol:'diamond' }, name: 'Inflection' },
          ]}
          layout={{ yaxis: { range: [-30, 15] } }}
          footer="All key features annotated automatically"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Curve Sketching Checklist" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>The 7-Step Sketch</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>1. Domain</li><li>2. Intercepts</li><li>3. Symmetry</li>
              <li>4. Asymptotes</li><li>5. Increase/Decrease</li>
              <li>6. Concavity</li><li>7. Sketch!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function LinearApprox({ color }) {
  const [expr, setExpr] = useState('sqrt(x)')
  const [a, setA] = useState(4)
  const [xApprox, setXApprox] = useState(4.1)

  const fa = useMemo(() => evaluateExpression(expr, a), [expr, a])
  const fpa = useMemo(() => numericalDerivative(expr, a), [expr, a])
  const linearApprox = fa + fpa * (xApprox - a)
  const actual = useMemo(() => evaluateExpression(expr, xApprox), [expr, xApprox])
  const error = Math.abs(linearApprox - actual)

  const { xs, ys } = useMemo(() => generatePoints(expr, Math.max(0, a - 3), a + 3), [expr, a])
  const tanXs = [a - 2, a + 2]
  const tanYs = tanXs.map(x => fa + fpa * (x - a))

  const steps = [
    { title: 'Linear Approximation Formula', formula: 'L(x) = f(a) + f\'(a)(x - a)', note: 'Uses the tangent line at x = a to approximate nearby values.' },
    { title: 'Find f(a) and f\'(a)', formula: `f(${a}) = ${formatNumber(fa)}, \\quad f'(${a}) = ${formatNumber(fpa)}` },
    { title: 'Write L(x)', formula: `L(x) = ${formatNumber(fa)} + ${formatNumber(fpa)}(x - ${a})` },
    { title: 'Approximate at x = ' + xApprox, formula: `L(${xApprox}) = ${formatNumber(fa)} + ${formatNumber(fpa)}(${xApprox - a}) = ${formatNumber(linearApprox, 5)}` },
    { title: 'Compare to Actual', formula: `f(${xApprox}) = ${formatNumber(actual, 5)}, \\quad \\text{Error} = ${formatNumber(error, 6)}` }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Linearization Calculator</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div className={styles.grid2}>
              <CalcInput label="Center a" value={a} onChange={v => setA(parseFloat(v)||1)} type="number" />
              <CalcInput label="Approximate at x" value={xApprox} onChange={v => setXApprox(parseFloat(v)||0)} type="number" step="0.1" />
            </div>
            <div className={styles.grid3}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>L(x)</div>
                <div className={styles.infoValue}>{formatNumber(linearApprox, 5)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Actual</div>
                <div className={styles.infoValue}>{formatNumber(actual, 5)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Error</div>
                <div className={styles.infoValue} style={{ color: error > 0.01 ? '#ef4444' : '#10b981' }}>{formatNumber(error, 6)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Linear Approximation"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)' },
            { x: tanXs, y: tanYs, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2 }, name: 'L(x) = tangent' },
            { x: [a], y: [fa], type: 'scatter', mode: 'markers', marker: { color: '#10b981', size: 10 }, name: `Center (${a}, f(${a}))` },
            { x: [xApprox], y: [linearApprox], type: 'scatter', mode: 'markers', marker: { color: '#ec4899', size: 10, symbol:'x' }, name: 'L(x) approx' },
            { x: [xApprox], y: [actual], type: 'scatter', mode: 'markers', marker: { color: '#06b6d4', size: 10, symbol:'circle-open' }, name: 'Actual f(x)' },
          ]}
          footer="Pink X = approximation, Cyan circle = actual value"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Linear Approximation"
          answer={`L(${xApprox}) \\approx ${formatNumber(linearApprox, 4)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Differentials</div>
          <div className={styles.conceptBody}>
            <p><InlineMath math="dy = f'(x)\,dx" /> where <InlineMath math="dx = \Delta x" /></p>
            <BlockMath math="\Delta y \approx dy = f'(a)\,\Delta x" />
            <p style={{marginTop:8, fontSize:'0.85rem', color:'rgba(240,240,255,0.5)'}}>Better approximations near the center point a. Accuracy decreases as x moves away from a.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
