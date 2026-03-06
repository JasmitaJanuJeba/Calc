import { useState, useMemo } from 'react'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { evaluateExpression, numericalIntegral, formatNumber } from '../utils/mathHelpers'
import { BlockMath } from 'react-katex'
import styles from './Topic.module.css'

const SUBTOPICS = [ParametricCurves, PolarCoords, PolarArea, VectorFunctions, ParticleMotion, ParametricArcLength]

export default function ParametricTopic({ subtopicIndex, color }) {
  const C = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <C color={color} />
}

const CURVES = [
  { name: 'Ellipse', x: '3*cos(t)', y: '2*sin(t)', tMin: 0, tMax: 6.28 },
  { name: 'Lissajous', x: 'sin(3*t)', y: 'sin(2*t)', tMin: 0, tMax: 6.28 },
  { name: 'Cycloid', x: 't - sin(t)', y: '1 - cos(t)', tMin: 0, tMax: 18.85 },
  { name: 'Rose', x: 'sin(2*t)*cos(t)', y: 'sin(2*t)*sin(t)', tMin: 0, tMax: 6.28 },
  { name: 'Spiral', x: 't*cos(t)', y: 't*sin(t)', tMin: 0, tMax: 12.57 },
]

function ParametricCurves({ color }) {
  const [xExpr, setXExpr] = useState('3*cos(t)')
  const [yExpr, setYExpr] = useState('2*sin(t)')
  const [tMin, setTMin] = useState(0)
  const [tMax, setTMax] = useState(6.28)
  const [tVal, setTVal] = useState(1.0)
  const [sel, setSel] = useState(0)

  const { xs, ys } = useMemo(() => {
    const xs = [], ys = []
    for (let t = tMin; t <= tMax; t += (tMax - tMin) / 300) {
      const x = evaluateExpression(xExpr, t)
      const y = evaluateExpression(yExpr, t)
      if (x !== null && y !== null && isFinite(x) && isFinite(y)) { xs.push(x); ys.push(y) }
      else { xs.push(null); ys.push(null) }
    }
    return { xs, ys }
  }, [xExpr, yExpr, tMin, tMax])

  const px = useMemo(() => evaluateExpression(xExpr, tVal), [xExpr, tVal])
  const py = useMemo(() => evaluateExpression(yExpr, tVal), [yExpr, tVal])

  // Velocity / direction
  const dx = useMemo(() => (evaluateExpression(xExpr, tVal + 0.001) - evaluateExpression(xExpr, tVal - 0.001)) / 0.002, [xExpr, tVal])
  const dy = useMemo(() => (evaluateExpression(yExpr, tVal + 0.001) - evaluateExpression(yExpr, tVal - 0.001)) / 0.002, [yExpr, tVal])
  const slope = dx !== 0 ? dy / dx : Infinity

  const steps = [
    { title: 'Parametric Equations', text: 'x(t) and y(t) define a curve by a parameter t.', formula: 'x = 3\\cos t, \\quad y = 2\\sin t' },
    { title: 'Slope dy/dx', formula: '\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}', note: 'Divide y-derivative by x-derivative.' },
    { title: 'For the Ellipse', formula: '\\frac{dy}{dx} = \\frac{2\\cos t}{-3\\sin t} = -\\frac{2}{3}\\cot t' },
    { title: 'At t = ' + tVal, formula: `\\frac{dy}{dx}\\bigg|_{t=${tVal}} = ${formatNumber(slope, 3)}` }
  ]

  function loadCurve(i) {
    setSel(i)
    setXExpr(CURVES[i].x)
    setYExpr(CURVES[i].y)
    setTMin(CURVES[i].tMin)
    setTMax(CURVES[i].tMax)
    setTVal((CURVES[i].tMin + CURVES[i].tMax) / 2)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Parametric Curve Plotter</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {CURVES.map((c, i) => (
                <button key={i} className={`${styles.exBtn} ${sel===i?styles.exBtnActive:''}`}
                  onClick={() => loadCurve(i)} style={{'--btn-color': color}}>
                  {c.name}
                </button>
              ))}
            </div>
            <CalcInput label="x(t)" value={xExpr} onChange={setXExpr} />
            <CalcInput label="y(t)" value={yExpr} onChange={setYExpr} />
            <div className={styles.grid2}>
              <CalcInput label="t min" value={tMin} onChange={v => setTMin(parseFloat(v)||0)} type="number" step="0.1" />
              <CalcInput label="t max" value={tMax} onChange={v => setTMax(parseFloat(v)||1)} type="number" step="0.1" />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>t = {tVal.toFixed(2)}</span>
              <input type="range" min={tMin} max={tMax} step={(tMax-tMin)/100} value={tVal}
                onChange={e => setTVal(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid3}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>x(t)</div>
                <div className={styles.infoValue}>{formatNumber(px, 3)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>y(t)</div>
                <div className={styles.infoValue}>{formatNumber(py, 3)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>dy/dx</div>
                <div className={styles.infoValue} style={{ color }}>{Math.abs(slope) > 100 ? '∞' : formatNumber(slope, 2)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Parametric Curve"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'Curve', connectgaps: false },
            { x: [px], y: [py], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 12 }, name: `t=${tVal.toFixed(2)}` },
          ]}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Parametric Equations" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Parametric Formulas</div>
          <div className={styles.conceptBody}>
            <p>Slope: $\frac{'{'}dy{'}'}{'{'}dx{'}'} = \frac{'{'}dy/dt{'}'}{'{'}dx/dt{'}'}$</p>
            <p style={{margin:'8px 0'}}>Second Derivative:</p>
            <BlockMath math="\frac{d^2y}{dx^2} = \frac{d}{dt}\left[\frac{dy}{dx}\right] \div \frac{dx}{dt}" />
            <p>Arc Length:</p>
            <BlockMath math="L = \int_a^b \sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}\,dt" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PolarCoords({ color }) {
  const [rExpr, setRExpr] = useState('2 + 2*cos(theta)')
  const [thetaMin, setThetaMin] = useState(0)
  const [thetaMax, setThetaMax] = useState(6.28)
  const [theta, setTheta] = useState(0.5)

  const { xs, ys } = useMemo(() => {
    const xs = [], ys = []
    for (let t = thetaMin; t <= thetaMax; t += (thetaMax - thetaMin) / 400) {
      const r = evaluateExpression(rExpr.replace(/theta/g, `(${t})`).replace(/θ/g, `(${t})`), t)
      if (r !== null && isFinite(r)) { xs.push(r * Math.cos(t)); ys.push(r * Math.sin(t)) }
      else { xs.push(null); ys.push(null) }
    }
    return { xs, ys }
  }, [rExpr, thetaMin, thetaMax])

  const r = useMemo(() => evaluateExpression(rExpr.replace(/theta/g, `(${theta})`), theta), [rExpr, theta])
  const px = r !== null ? r * Math.cos(theta) : 0
  const py = r !== null ? r * Math.sin(theta) : 0

  const POLAR_EXAMPLES = [
    { label: 'Cardioid', expr: '2 + 2*cos(theta)', tMax: 6.28 },
    { label: 'Rose r=sin(3θ)', expr: 'sin(3*theta)', tMax: 3.14 },
    { label: 'Limaçon', expr: '3 + cos(theta)', tMax: 6.28 },
    { label: 'Circle r=2', expr: '2', tMax: 6.28 },
    { label: 'Archimedes', expr: 'theta/3', tMax: 12.57 },
  ]

  const steps = [
    { title: 'Polar Coordinates', text: 'Every point is described by (r, θ): r = distance from origin, θ = angle from positive x-axis.' },
    { title: 'Convert to Cartesian', formula: 'x = r\\cos\\theta, \\quad y = r\\sin\\theta' },
    { title: 'Slope in Polar', formula: '\\frac{dy}{dx} = \\frac{\\frac{dr}{d\\theta}\\sin\\theta + r\\cos\\theta}{\\frac{dr}{d\\theta}\\cos\\theta - r\\sin\\theta}' },
    { title: 'At θ = ' + theta.toFixed(2), text: `r = ${formatNumber(r, 3)}, point = (${formatNumber(px, 2)}, ${formatNumber(py, 2)})` }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Polar Curve Plotter</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {POLAR_EXAMPLES.map((e, i) => (
                <button key={i} className={styles.exBtn} style={{'--btn-color': color}}
                  onClick={() => { setRExpr(e.expr); setThetaMax(e.tMax) }}>
                  {e.label}
                </button>
              ))}
            </div>
            <CalcInput label="r(θ) — use 'theta' for θ" value={rExpr} onChange={setRExpr} />
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>θ = {theta.toFixed(2)}</span>
              <input type="range" min={thetaMin} max={thetaMax} step={0.02} value={theta}
                onChange={e => setTheta(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid3}>
              <div className={styles.infoBox}><div className={styles.infoLabel}>r</div><div className={styles.infoValue}>{formatNumber(r,3)}</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>x</div><div className={styles.infoValue}>{formatNumber(px,3)}</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>y</div><div className={styles.infoValue}>{formatNumber(py,3)}</div></div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Polar Curve"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, connectgaps: false, name: 'r(θ)' },
            { x: [0, px], y: [0, py], type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 1.5 }, name: 'radius' },
            { x: [px], y: [py], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10 }, showlegend: false },
          ]}
          layout={{ xaxis: { scaleanchor: 'y' } }}
          footer="Click and drag to explore the curve"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Polar Coordinates" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Polar ↔ Cartesian</div>
          <div className={styles.conceptBody}>
            <p>$x = r\cos\theta, \quad y = r\sin\theta$</p>
            <p style={{marginTop:8}}>$r^2 = x^2 + y^2, \quad \theta = \arctan(y/x)$</p>
            <p style={{marginTop:8}}>Common curves:</p>
            <ul>
              <li>$r = a$: circle of radius a</li>
              <li>$r = a + b\cos\theta$: limaçon/cardioid</li>
              <li>$r = a\cos(n\theta)$: rose with n petals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function PolarArea({ color }) {
  const [rExpr, setRExpr] = useState('2 + 2*cos(theta)')
  const [a, setA] = useState(0)
  const [b, setB] = useState(6.28)

  const area = useMemo(() => {
    let sum = 0
    const n = 2000
    const h = (b - a) / n
    for (let i = 0; i < n; i++) {
      const t = a + (i + 0.5) * h
      const r = evaluateExpression(rExpr.replace(/theta/g, `(${t})`), t)
      if (r !== null && isFinite(r)) sum += 0.5 * r * r * h
    }
    return sum
  }, [rExpr, a, b])

  const { xs, ys } = useMemo(() => {
    const xs = [], ys = []
    for (let t = a; t <= b; t += (b - a) / 400) {
      const r = evaluateExpression(rExpr.replace(/theta/g, `(${t})`), t)
      if (r !== null && isFinite(r) && r >= 0) { xs.push(r * Math.cos(t)); ys.push(r * Math.sin(t)) }
    }
    xs.push(0); ys.push(0)
    return { xs, ys }
  }, [rExpr, a, b])

  const steps = [
    { title: 'Polar Area Formula', formula: 'A = \\frac{1}{2}\\int_\\alpha^\\beta r^2\\,d\\theta', note: 'Derived from sectors: area of sector = ½r²Δθ' },
    { title: 'Example: Cardioid r = 2+2cosθ', formula: 'A = \\frac{1}{2}\\int_0^{2\\pi} (2+2\\cos\\theta)^2\\,d\\theta' },
    { title: 'Expand', formula: '= \\frac{1}{2}\\int_0^{2\\pi} (4 + 8\\cos\\theta + 4\\cos^2\\theta)\\,d\\theta' },
    { title: 'Use cos²θ = (1+cos2θ)/2', formula: '= \\frac{1}{2}[4\\theta + 8\\sin\\theta + 2\\theta + \\sin 2\\theta]_0^{2\\pi} = 6\\pi' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Polar Area Calculator</h4>
          <div className={styles.cardBody}>
            <CalcInput label="r(θ)" value={rExpr} onChange={setRExpr} hint="Use 'theta' for θ" />
            <div className={styles.grid2}>
              <CalcInput label="α (from)" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" step="0.1" />
              <CalcInput label="β (to)" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" step="0.1" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Polar Area</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(area, 4)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Polar Region"
          data={[
            { x: [...xs, xs[0]], y: [...ys, ys[0]], type: 'scatter', mode: 'lines', fill: 'toself', fillcolor: color + '25', line: { color }, name: 'Polar area' },
          ]}
          layout={{ xaxis: { scaleanchor: 'y' } }}
          footer={`Shaded area = ${formatNumber(area, 3)} sq units`}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Polar Area"
          answer={`A = \\frac{1}{2}\\int_{${a}}^{${b}} r^2\\,d\\theta \\approx ${formatNumber(area, 4)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Area Between Polar Curves</div>
          <div className={styles.conceptBody}>
            <BlockMath math="A = \frac{1}{2}\int_\alpha^\beta [r_{\text{outer}}^2 - r_{\text{inner}}^2]\,d\theta" />
            <p style={{marginTop:8, fontSize:'0.85rem', color:'rgba(240,240,255,0.5)'}}>
              Find intersection angles first, then integrate the difference of r².
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function VectorFunctions({ color }) {
  const [xExpr, setXExpr] = useState('cos(t)')
  const [yExpr, setYExpr] = useState('sin(t)')
  const [t, setT] = useState(1.0)

  const n = 200
  const pts = useMemo(() => {
    const xs = [], ys = []
    for (let i = 0; i <= n; i++) {
      const ti = i * 4 * Math.PI / n
      xs.push(evaluateExpression(xExpr, ti))
      ys.push(evaluateExpression(yExpr, ti))
    }
    return { xs, ys }
  }, [xExpr, yExpr])

  const pos = [evaluateExpression(xExpr, t), evaluateExpression(yExpr, t)]
  const vel = [(evaluateExpression(xExpr, t + 0.001) - evaluateExpression(xExpr, t - 0.001)) / 0.002,
               (evaluateExpression(yExpr, t + 0.001) - evaluateExpression(yExpr, t - 0.001)) / 0.002]
  const speed = Math.sqrt(vel[0]**2 + vel[1]**2)

  const steps = [
    { title: 'Vector-Valued Function', formula: '\\vec{r}(t) = \\langle x(t), y(t) \\rangle', note: 'Position vector as function of parameter t' },
    { title: 'Velocity Vector', formula: "\\vec{v}(t) = \\vec{r}'(t) = \\langle x'(t), y'(t) \\rangle" },
    { title: 'Speed (magnitude)', formula: "\\text{speed} = |\\vec{v}(t)| = \\sqrt{[x'(t)]^2 + [y'(t)]^2}" },
    { title: 'Acceleration', formula: "\\vec{a}(t) = \\vec{v}'(t) = \\langle x''(t), y''(t) \\rangle" }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Vector-Valued Functions</h4>
          <div className={styles.cardBody}>
            <CalcInput label="x(t)" value={xExpr} onChange={setXExpr} />
            <CalcInput label="y(t)" value={yExpr} onChange={setYExpr} />
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>t = {t.toFixed(2)}</span>
              <input type="range" min={0} max={12.57} step={0.05} value={t}
                onChange={e => setT(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}><div className={styles.infoLabel}>Position</div><div className={styles.infoValue}>({formatNumber(pos[0],2)}, {formatNumber(pos[1],2)})</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>Speed |v|</div><div className={styles.infoValue} style={{ color }}>{formatNumber(speed, 3)}</div></div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Position Curve + Velocity Vector"
          data={[
            { x: pts.xs, y: pts.ys, type: 'scatter', mode: 'lines', line: { color, width: 2 }, name: 'Path', connectgaps: false },
            { x: [pos[0]], y: [pos[1]], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10 }, name: 'Position' },
            { x: [pos[0], pos[0]+vel[0]*0.3], y: [pos[1], pos[1]+vel[1]*0.3],
              type: 'scatter', mode: 'lines',
              line: { color: '#10b981', width: 2 }, name: 'Velocity' },
          ]}
          layout={{ xaxis: { scaleanchor: 'y' } }}
          footer="Yellow = position, Green arrow = velocity direction"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Vector Functions" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Key Formulas</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>$\vec{'{'}r{'}'} = \langle x(t), y(t) \rangle$</li>
              <li>$\vec{'{'}v{'}'} = \langle x'(t), y'(t) \rangle$</li>
              <li>$|\vec{'{'}v{'}'}| = \sqrt{'{'}(x')^2+(y')^2{'}'}$</li>
              <li>$\vec{'{'}a{'}'} = \langle x''(t), y''(t) \rangle$</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ParticleMotion({ color }) {
  const [xExpr, setXExpr] = useState('t^2 - 4*t')
  const [yExpr, setYExpr] = useState('t^3 - 3*t')
  const [t, setT] = useState(1)

  const pts = useMemo(() => {
    const xs=[], ys=[]
    for (let ti=0; ti<=4; ti+=0.04) {
      xs.push(evaluateExpression(xExpr, ti))
      ys.push(evaluateExpression(yExpr, ti))
    }
    return {xs, ys}
  }, [xExpr, yExpr])

  const pos = [evaluateExpression(xExpr, t), evaluateExpression(yExpr, t)]
  const vx = (evaluateExpression(xExpr, t+0.001) - evaluateExpression(xExpr, t-0.001)) / 0.002
  const vy = (evaluateExpression(yExpr, t+0.001) - evaluateExpression(yExpr, t-0.001)) / 0.002
  const ax = (evaluateExpression(xExpr, t+0.001) - 2*evaluateExpression(xExpr, t) + evaluateExpression(xExpr, t-0.001)) / 0.000001
  const ay = (evaluateExpression(yExpr, t+0.001) - 2*evaluateExpression(yExpr, t) + evaluateExpression(yExpr, t-0.001)) / 0.000001
  const speed = Math.sqrt(vx**2 + vy**2)

  const steps = [
    { title: 'Position', formula: '\\vec{r}(t) = \\langle t^2-4t,\\; t^3-3t \\rangle' },
    { title: 'Velocity', formula: "\\vec{v}(t) = \\langle 2t-4,\\; 3t^2-3 \\rangle" },
    { title: 'When is particle at rest?', formula: '2t-4=0 \\Rightarrow t=2 \\quad \\text{and} \\quad 3t^2-3=0 \\Rightarrow t=\\pm 1', note: 'Particle at rest only if BOTH components are 0 simultaneously.' },
    { title: 'Speed', formula: "\\text{speed} = \\sqrt{(2t-4)^2 + (3t^2-3)^2}" }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Particle Motion</h4>
          <div className={styles.cardBody}>
            <CalcInput label="x(t)" value={xExpr} onChange={setXExpr} />
            <CalcInput label="y(t)" value={yExpr} onChange={setYExpr} />
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>t = {t.toFixed(2)}</span>
              <input type="range" min={0} max={4} step={0.05} value={t} onChange={e => setT(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}><div className={styles.infoLabel}>vₓ</div><div className={styles.infoValue}>{formatNumber(vx,3)}</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>v_y</div><div className={styles.infoValue}>{formatNumber(vy,3)}</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>Speed</div><div className={styles.infoValue} style={{color}}>{formatNumber(speed,3)}</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>|a|</div><div className={styles.infoValue}>{formatNumber(Math.sqrt(ax**2+ay**2),3)}</div></div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Particle Path"
          data={[
            { x: pts.xs, y: pts.ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'Path' },
            { x: [pos[0]], y: [pos[1]], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 12 }, name: 'Position' },
            { x: [pos[0], pos[0]+vx*0.4], y: [pos[1], pos[1]+vy*0.4], type: 'scatter', mode: 'lines', line: { color: '#10b981', width: 2.5 }, name: 'Velocity' },
          ]}
          footer="Gold = particle position, Green = velocity direction"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Particle Motion Analysis" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Motion Analysis</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Moving right: x'(t) {'>'} 0</li>
              <li>Moving left: x'(t) {'<'} 0</li>
              <li>Moving up: y'(t) {'>'} 0</li>
              <li>At rest: v = ⟨0, 0⟩</li>
              <li>Speeding up: v · a {'>'} 0</li>
              <li>Slowing down: v · a {'<'} 0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ParametricArcLength({ color }) {
  const [xExpr, setXExpr] = useState('3*cos(t)')
  const [yExpr, setYExpr] = useState('2*sin(t)')
  const [a, setA] = useState(0)
  const [b, setB] = useState(6.28)

  const arcLen = useMemo(() => {
    let sum = 0
    const n = 2000
    const h = (b - a) / n
    for (let i = 0; i < n; i++) {
      const t = a + (i + 0.5) * h
      const dx = (evaluateExpression(xExpr, t+0.001) - evaluateExpression(xExpr, t-0.001)) / 0.002
      const dy = (evaluateExpression(yExpr, t+0.001) - evaluateExpression(yExpr, t-0.001)) / 0.002
      if (dx !== null && dy !== null && isFinite(dx) && isFinite(dy)) {
        sum += Math.sqrt(dx**2 + dy**2) * h
      }
    }
    return sum
  }, [xExpr, yExpr, a, b])

  const { xs, ys } = useMemo(() => {
    const xs=[], ys=[]
    for (let t=a; t<=b; t+=(b-a)/300) {
      xs.push(evaluateExpression(xExpr, t))
      ys.push(evaluateExpression(yExpr, t))
    }
    return {xs, ys}
  }, [xExpr, yExpr, a, b])

  const steps = [
    { title: 'Arc Length for Parametric', formula: 'L = \\int_a^b \\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2}\\,dt' },
    { title: 'Example: Ellipse x=3cos(t), y=2sin(t)', formula: '\\frac{dx}{dt} = -3\\sin t, \\quad \\frac{dy}{dt} = 2\\cos t' },
    { title: 'Integrand', formula: '\\sqrt{9\\sin^2 t + 4\\cos^2 t}' },
    { title: 'Numerical Result', formula: `L \\approx ${formatNumber(arcLen, 4)}`, note: 'This elliptic integral has no closed form in general.' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Parametric Arc Length</h4>
          <div className={styles.cardBody}>
            <CalcInput label="x(t)" value={xExpr} onChange={setXExpr} />
            <CalcInput label="y(t)" value={yExpr} onChange={setYExpr} />
            <div className={styles.grid2}>
              <CalcInput label="t from" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" step="0.1" />
              <CalcInput label="t to" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" step="0.1" />
            </div>
            <div className={styles.infoBox}><div className={styles.infoLabel}>Arc Length</div><div className={styles.infoValue} style={{color}}>{formatNumber(arcLen, 4)}</div></div>
          </div>
        </div>
        <GraphPanel
          title="Parametric Curve"
          data={[{ x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 3 }, name: `L≈${formatNumber(arcLen,2)}`, connectgaps: false }]}
          layout={{ xaxis: { scaleanchor: 'y' } }}
          footer={`Total arc length ≈ ${formatNumber(arcLen, 3)}`}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Parametric Arc Length"
          answer={`L = \\int_{${a}}^{${b}} \\sqrt{(x')^2+(y')^2}\\,dt \\approx ${formatNumber(arcLen,4)}`} />
      </div>
    </div>
  )
}
