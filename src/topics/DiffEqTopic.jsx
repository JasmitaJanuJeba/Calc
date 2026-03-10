import { useState, useMemo } from 'react'
import * as math from 'mathjs'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { generatePoints, evaluateExpression, formatNumber } from '../utils/mathHelpers'
import { BlockMath, InlineMath } from 'react-katex'
import styles from './Topic.module.css'

function evalDE(expr, xVal, yVal) {
  try {
    const result = math.evaluate(expr, { x: xVal, y: yVal })
    if (typeof result === 'number' && isFinite(result)) return result
    return null
  } catch {
    return null
  }
}

const SUBTOPICS = [SeparableEq, SlopeFields, EulersMethod, ExpGrowth, LogisticGrowth, GeneralSolutions]

export default function DiffEqTopic({ subtopicIndex, color }) {
  const C = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <C color={color} />
}

function SeparableEq({ color }) {
  const examples = [
    {
      label: 'dy/dx = xy',
      steps: [
        { title: 'Separate Variables', text: 'Move all y terms to one side, x terms to the other:', formula: '\\frac{dy}{y} = x\\,dx' },
        { title: 'Integrate Both Sides', formula: '\\int \\frac{dy}{y} = \\int x\\,dx \\Rightarrow \\ln|y| = \\frac{x^2}{2} + C' },
        { title: 'Solve for y', formula: '|y| = e^{x^2/2 + C} = Ae^{x^2/2}' },
        { title: 'General Solution', formula: 'y = Ce^{x^2/2}', note: 'C absorbs the ± and the constant A.' }
      ],
      answer: 'y = Ce^{x^2/2}',
      solutionExpr: (c, x) => c * Math.exp(x * x / 2)
    },
    {
      label: 'dy/dx = -2xy²',
      steps: [
        { title: 'Separate Variables', formula: '\\frac{dy}{y^2} = -2x\\,dx' },
        { title: 'Integrate Both Sides', formula: '-\\frac{1}{y} = -x^2 + C' },
        { title: 'Solve for y', formula: 'y = \\frac{1}{x^2 - C}' },
        { title: 'General Solution', formula: 'y = \\frac{1}{x^2 + C}' }
      ],
      answer: 'y = \\frac{1}{x^2 + C}',
      solutionExpr: (c, x) => 1 / (x * x + c)
    }
  ]
  const [sel, setSel] = useState(0)
  const ex = examples[sel]

  const solutionCurves = useMemo(() => {
    return [-2, -1, 0, 1, 2].map(c => ({
      xs: [], ys: []
    })).map((_, i) => {
      const c = [-2, -1, 0, 1, 2][i]
      const xs = [], ys = []
      for (let x = -3; x <= 3; x += 0.05) {
        const y = ex.solutionExpr(c, x)
        if (Math.abs(y) < 10) { xs.push(x); ys.push(y) }
        else { xs.push(x); ys.push(null) }
      }
      return { xs, ys, c }
    })
  }, [ex])

  const colors = ['#7c3aed','#ec4899','#06b6d4','#10b981','#f59e0b']

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Separable Equations</h4>
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
        <GraphPanel
          title="Family of Solutions (different C values)"
          data={solutionCurves.map(({ xs, ys, c }, i) => ({
            x: xs, y: ys, type: 'scatter', mode: 'lines',
            line: { color: colors[i % 5], width: 2 }, name: `C = ${c}`, connectgaps: false
          }))}
          layout={{ yaxis: { range: [-5, 5] } }}
          footer="Each curve is a different particular solution"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={ex.steps} color={color} title="Separable Differential Equation" answer={ex.answer} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Separable DE Strategy</div>
          <div className={styles.conceptBody}>
            <BlockMath math="\frac{dy}{dx} = f(x) \cdot g(y)" />
            <ol style={{paddingLeft: 16, lineHeight: 2}}>
              <li>Rewrite: <InlineMath math="\frac{dy}{g(y)} = f(x)\,dx" /></li>
              <li>Integrate both sides</li>
              <li>Solve for y (if possible)</li>
              <li>Apply initial condition to find C</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlopeFields({ color }) {
  const [deExpr, setDeExpr] = useState('x - y')
  const [y0, setY0] = useState(0)

  // Generate slope field
  const slopeField = useMemo(() => {
    const arrows = { x: [], y: [], u: [], v: [] }
    for (let x = -3; x <= 3; x += 0.5) {
      for (let y = -3; y <= 3; y += 0.5) {
        try {
          const slope2 = evalDE(deExpr, x, y) ?? 0
          const len = 0.25 / Math.sqrt(1 + slope2 * slope2)
          if (isFinite(slope2) && !isNaN(slope2)) {
            arrows.x.push(x - len)
            arrows.y.push(y - len * slope2)
            arrows.u.push(2 * len)
            arrows.v.push(2 * len * slope2)
          }
        } catch {}
      }
    }
    return arrows
  }, [deExpr])

  // Euler method to trace solution
  const solution = useMemo(() => {
    const pts = [[0, y0]]
    let x = 0, y = y0
    const h = 0.05
    for (let i = 0; i < 120; i++) {
      const slope = evalDE(deExpr, x, y)
      if (slope === null || !isFinite(slope) || isNaN(slope)) break
      y += slope * h
      x += h
      if (Math.abs(y) < 10) pts.push([x, y])
      else break
    }
    // Backwards
    x = 0; y = y0
    const back = [[0, y0]]
    for (let i = 0; i < 60; i++) {
      const slope = evalDE(deExpr, x, y)
      if (slope === null || !isFinite(slope) || isNaN(slope)) break
      y -= slope * h
      x -= h
      if (Math.abs(y) < 10) back.push([x, y])
      else break
    }
    const all = [...back.slice(1).reverse(), ...pts]
    return { xs: all.map(p => p[0]), ys: all.map(p => p[1]) }
  }, [deExpr, y0])

  const steps = [
    { title: 'What is a Slope Field?', text: 'A slope field shows the direction of solutions by drawing small arrows with slope = dy/dx at each point.', note: 'Each arrow shows the slope of any solution curve passing through that point.' },
    { title: 'Read the Field', text: `At each point (x,y), slope = dy/dx = ${deExpr}` },
    { title: 'Sketch a Solution', text: 'Start at an initial condition and follow the arrows — that traces a particular solution.' },
    { title: 'This is qualitative analysis!', text: 'Slope fields let you understand behavior without solving the DE algebraically.' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Slope Field Visualizer</h4>
          <div className={styles.cardBody}>
            <CalcInput label="dy/dx = " value={deExpr} onChange={setDeExpr} hint="Use x and y (e.g. x-y, x*y, sin(x)+y)" />
            <CalcInput label="Initial y(0) = " value={y0} onChange={v => setY0(parseFloat(v)||0)} type="number" step="0.5" />
          </div>
        </div>
        <GraphPanel
          title="Slope Field + Particular Solution"
          data={[
            ...slopeField.x.map((x, i) => ({
              x: [slopeField.x[i], slopeField.x[i] + slopeField.u[i]],
              y: [slopeField.y[i], slopeField.y[i] + slopeField.v[i]],
              type: 'scatter', mode: 'lines',
              line: { color: 'rgba(167,139,250,0.4)', width: 1.2 },
              showlegend: false, hoverinfo: 'skip'
            })),
            { x: solution.xs, y: solution.ys, type: 'scatter', mode: 'lines', line: { color, width: 3 }, name: `y(0)=${y0}` },
            { x: [0], y: [y0], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10 }, name: 'IC' },
          ]}
          layout={{ xaxis: { range: [-3, 6] }, yaxis: { range: [-3.5, 3.5] } }}
          footer="Orange arrows show slope at each point; colored curve = particular solution"
          height={400}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Slope Fields" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Reading Slope Fields</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Arrows with slope = 0 → solution is flat there</li>
              <li>Arrows with large slope → rapid change</li>
              <li>Equilibrium: where dy/dx = 0 always (horizontal line)</li>
              <li>Isoclines: curves where slope is constant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function EulersMethod({ color }) {
  const [deExpr, setDeExpr] = useState('x + y')
  const [x0, setX0] = useState(0)
  const [y0s, setY0s] = useState(1)
  const [h, setH] = useState(0.2)
  const [steps2, setSteps2] = useState(10)

  const eulerPts = useMemo(() => {
    const pts = [{ x: x0, y: y0s, dy: null }]
    let x = x0, y = y0s
    for (let i = 0; i < steps2; i++) {
      const dy = evalDE(deExpr, x, y)
      if (dy === null || !isFinite(dy)) break
      const yn = y + dy * h
      pts.push({ x: parseFloat((x + h).toFixed(6)), y: parseFloat(yn.toFixed(6)), dy: parseFloat(dy.toFixed(4)) })
      x = x + h; y = yn
    }
    return pts
  }, [deExpr, x0, y0s, h, steps2])

  const stepsData = [
    { title: 'Euler\'s Method Formula', formula: 'y_{n+1} = y_n + h \\cdot f(x_n, y_n)', note: "A numerical approximation — useful when we can't solve the DE analytically!" },
    { title: 'Step 1', formula: `y_1 = y_0 + h \\cdot f(${x0}, ${y0s}) = ${y0s} + ${h} \\cdot ${formatNumber(evalDE(deExpr, x0, y0s) ?? 0, 3)} = ${eulerPts[1]?.y ?? '...'}` },
    { title: 'Repeat', text: 'Continue applying the formula for each step.' },
    { title: 'Accuracy', text: 'Smaller h = more accurate but more steps.', note: 'Error is approximately O(h) per step.' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Euler's Method</h4>
          <div className={styles.cardBody}>
            <CalcInput label="dy/dx = f(x,y)" value={deExpr} onChange={setDeExpr} />
            <div className={styles.grid2}>
              <CalcInput label="x₀" value={x0} onChange={v => setX0(parseFloat(v)||0)} type="number" step="0.1" />
              <CalcInput label="y₀" value={y0s} onChange={v => setY0s(parseFloat(v)||0)} type="number" step="0.1" />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>h = {h}</span>
              <input type="range" min={0.05} max={1} step={0.05} value={h}
                onChange={e => setH(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>n = {steps2}</span>
              <input type="range" min={2} max={20} step={1} value={steps2}
                onChange={e => setSteps2(+e.target.value)} style={{'--slider-color': color}} />
            </div>
          </div>
        </div>
        <div style={{ maxHeight: 200, overflowY: 'auto', background: '#12122a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
          <table className={styles.numTable} style={{ width: '100%' }}>
            <thead><tr><th>n</th><th>xₙ</th><th>yₙ</th><th>dy/dx</th></tr></thead>
            <tbody>
              {eulerPts.map((p, i) => (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{formatNumber(p.x, 3)}</td>
                  <td style={{ color }}>{formatNumber(p.y, 4)}</td>
                  <td>{p.dy !== null ? formatNumber(p.dy, 3) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.right}>
        <GraphPanel
          title="Euler's Method Steps"
          data={[
            { x: eulerPts.map(p => p.x), y: eulerPts.map(p => p.y),
              type: 'scatter', mode: 'lines+markers',
              line: { color, width: 2 }, marker: { color, size: 7 }, name: "Euler's" },
          ]}
          footer={`Step size h = ${h}. Smaller h = more accurate`}
        />
        <StepByStep steps={stepsData} color={color} title="Euler's Method"
          answer={`y(${formatNumber(eulerPts[eulerPts.length-1]?.x,2)}) \\approx ${formatNumber(eulerPts[eulerPts.length-1]?.y,4)}`} />
      </div>
    </div>
  )
}

function ExpGrowth({ color }) {
  const [k, setK] = useState(0.3)
  const [y0, setY0] = useState(100)
  const [type, setType] = useState('growth')

  const kVal = type === 'decay' ? -Math.abs(k) : Math.abs(k)
  const xs = useMemo(() => Array.from({ length: 100 }, (_, i) => i * 0.2), [])
  const ys = useMemo(() => xs.map(t => y0 * Math.exp(kVal * t)), [xs, y0, kVal])

  const halfLife = Math.abs(Math.log(2) / kVal)
  const doubling = Math.log(2) / Math.abs(kVal)

  const steps = [
    { title: 'Differential Equation', formula: '\\frac{dP}{dt} = kP', note: 'k > 0: growth, k < 0: decay' },
    { title: 'Separate and Integrate', formula: '\\int \\frac{dP}{P} = \\int k\\,dt \\Rightarrow \\ln P = kt + C' },
    { title: 'Solve', formula: 'P(t) = P_0 e^{kt}' },
    { title: 'Doubling Time / Half-Life', formula: type === 'growth' ? `T_2 = \\frac{\\ln 2}{k} \\approx ${formatNumber(doubling, 2)}` : `t_{1/2} = \\frac{\\ln 2}{|k|} \\approx ${formatNumber(halfLife, 2)}` }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Exponential Model</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              <button className={`${styles.exBtn} ${type==='growth'?styles.exBtnActive:''}`} onClick={() => setType('growth')} style={{'--btn-color': color}}>Growth</button>
              <button className={`${styles.exBtn} ${type==='decay'?styles.exBtnActive:''}`} onClick={() => setType('decay')} style={{'--btn-color': color}}>Decay</button>
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>k = {Math.abs(k).toFixed(2)}</span>
              <input type="range" min={0.05} max={1} step={0.05} value={Math.abs(k)}
                onChange={e => setK(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>P₀ = {y0}</span>
              <input type="range" min={10} max={500} step={10} value={y0}
                onChange={e => setY0(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>{type === 'growth' ? 'Doubling time' : 'Half-life'}</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(type === 'growth' ? doubling : halfLife, 2)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>P(10)</div>
                <div className={styles.infoValue}>{formatNumber(y0 * Math.exp(kVal * 10), 1)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title={`P(t) = P₀e^{${formatNumber(kVal,2)}t}`}
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'P(t)' },
            { x: [type==='growth'?doubling:halfLife], y: [y0*Math.exp(kVal*(type==='growth'?doubling:halfLife))],
              type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10 },
              name: type==='growth' ? 'Doubling' : 'Half-life' }
          ]}
          footer={type === 'growth' ? `Doubles every ${formatNumber(doubling,2)} units` : `Halves every ${formatNumber(halfLife,2)} units`}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Exponential Growth/Decay"
          answer={`P(t) = ${y0}e^{${formatNumber(kVal,2)}t}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Applications</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Population growth (k {'>'} 0)</li>
              <li>Radioactive decay (k {'<'} 0)</li>
              <li>Newton's Law of Cooling</li>
              <li>Compound interest</li>
              <li>Carbon-14 dating</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function LogisticGrowth({ color }) {
  const [r, setR] = useState(0.5)
  const [K, setK] = useState(1000)
  const [P0, setP0] = useState(50)

  const xs = useMemo(() => Array.from({ length: 100 }, (_, i) => i * 0.3), [])
  const ys = useMemo(() => {
    return xs.map(t => K / (1 + ((K - P0) / P0) * Math.exp(-r * t)))
  }, [xs, r, K, P0])

  const inflPoint = Math.log((K - P0) / P0) / r

  const steps = [
    { title: 'Logistic Equation', formula: '\\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right)', note: 'K = carrying capacity. Growth slows as P approaches K.' },
    { title: 'Separate Variables', formula: '\\int \\frac{dP}{P(1-P/K)} = \\int r\\,dt' },
    { title: 'Partial Fractions', formula: '\\frac{1}{P(1-P/K)} = \\frac{1}{P} + \\frac{1/K}{1-P/K}' },
    { title: 'Solution', formula: 'P(t) = \\frac{K}{1 + \\frac{K-P_0}{P_0}e^{-rt}}' },
    { title: 'Inflection Point', formula: `P = \\frac{K}{2} \\text{ at } t \\approx ${formatNumber(inflPoint, 2)}`, note: 'Population grows fastest at P = K/2 (half the carrying capacity)' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Logistic Growth Model</h4>
          <div className={styles.cardBody}>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>r = {r}</span>
              <input type="range" min={0.05} max={2} step={0.05} value={r} onChange={e => setR(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>K = {K}</span>
              <input type="range" min={100} max={5000} step={100} value={K} onChange={e => setK(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>P₀ = {P0}</span>
              <input type="range" min={10} max={K-10} step={10} value={Math.min(P0, K-10)} onChange={e => setP0(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Carrying Cap K</div>
                <div className={styles.infoValue} style={{ color }}>{K}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Inflection t ≈</div>
                <div className={styles.infoValue}>{formatNumber(Math.max(0, inflPoint), 2)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Logistic Curve"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'P(t)' },
            { x: [xs[0], xs[xs.length-1]], y: [K, K], type: 'scatter', mode: 'lines', line: { color: '#ef4444', width: 1.5, dash: 'dash' }, name: `Carrying cap K=${K}` },
            { x: [Math.max(0, inflPoint)], y: [K/2], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10 }, name: 'Inflection' }
          ]}
          footer="Growth is fastest at K/2, then slows as it approaches K"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Logistic Growth"
          answer={`P(t) = \\frac{${K}}{1 + \\frac{${K-P0}}{${P0}}e^{-${r}t}}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Key Properties</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>P → K as t → ∞ (approaches carrying capacity)</li>
              <li>Fastest growth at P = K/2</li>
              <li>S-shaped (sigmoidal) curve</li>
              <li>dP/dt {'>'} 0 for all t (always increasing)</li>
              <li>Inflection point at P = K/2</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeneralSolutions({ color }) {
  const steps = [
    { title: 'General vs Particular Solution', text: 'A general solution contains an arbitrary constant C. A particular solution uses an initial condition to find C.', formula: 'y = Ce^{2x} \\quad \\text{(general)}' },
    { title: 'Initial Condition', text: 'Given y(0) = 3:', formula: '3 = Ce^{0} = C \\Rightarrow C = 3' },
    { title: 'Particular Solution', formula: 'y = 3e^{2x} \\quad \\text{(particular)}' },
    { title: 'Verify', text: 'Check by differentiating:', formula: "y' = 6e^{2x} = 2(3e^{2x}) = 2y \\checkmark" }
  ]

  const xs = useMemo(() => Array.from({ length: 60 }, (_, i) => (i - 10) * 0.1), [])
  const [C, setC] = useState(3)

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>General vs Particular Solutions</h4>
          <div className={styles.cardBody}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(240,240,255,0.6)' }}>dy/dx = 2y → General solution: y = Ce²ˣ</p>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>C = {C}</span>
              <input type="range" min={-4} max={4} step={0.5} value={C} onChange={e => setC(+e.target.value)} style={{'--slider-color': color}} />
            </div>
          </div>
        </div>
        <GraphPanel
          title="Family of Solutions y = Ce²ˣ"
          data={[
            ...[-3,-2,-1,1,2,3].map((c, i) => ({
              x: xs, y: xs.map(x => c * Math.exp(2 * x)),
              type: 'scatter', mode: 'lines',
              line: { color: `rgba(167,139,250,${0.3 + i*0.08})`, width: 1.5 },
              name: `C=${c}`, connectgaps: false
            })),
            {
              x: xs, y: xs.map(x => C * Math.exp(2 * x)),
              type: 'scatter', mode: 'lines',
              line: { color, width: 3 }, name: `C=${C} (selected)`
            }
          ]}
          layout={{ yaxis: { range: [-10, 10] } }}
          footer="Particular solution highlighted in color"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Finding Particular Solutions" answer={`y = ${C}e^{2x}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>IVP (Initial Value Problem)</div>
          <div className={styles.conceptBody}>
            <p>An IVP gives both the DE and an initial condition:</p>
            <BlockMath math="\frac{dy}{dx} = 2y, \quad y(0) = 3" />
            <p style={{marginTop:8, fontSize:'0.85rem', color:'rgba(240,240,255,0.5)'}}>
              Initial condition picks exactly ONE curve from the family of solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
