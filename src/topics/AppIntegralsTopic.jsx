import { useState, useMemo, useRef, useEffect } from 'react'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { generatePoints, evaluateExpression, numericalIntegral, formatNumber } from '../utils/mathHelpers'
import { BlockMath } from 'react-katex'
import styles from './Topic.module.css'

const SUBTOPICS = [AreaBetweenCurves, DiskWasher, ShellMethod, ArcLength, SurfaceArea, NetChange]

export default function AppIntegralsTopic({ subtopicIndex, color }) {
  const C = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <C color={color} />
}

function AreaBetweenCurves({ color }) {
  const [f, setF] = useState('x^2')
  const [g, setG] = useState('x + 2')
  const [a, setA] = useState(-1)
  const [b, setB] = useState(2)

  const area = useMemo(() => numericalIntegral(`abs((${f})-(${g}))`, a, b), [f, g, a, b])

  const { xs: xsF, ys: ysF } = useMemo(() => generatePoints(f, a - 0.5, b + 0.5), [f, a, b])
  const { xs: xsG, ys: ysG } = useMemo(() => generatePoints(g, a - 0.5, b + 0.5), [g, a, b])

  const fillXs = useMemo(() => {
    const pts = []
    for (let x = a; x <= b; x += (b - a) / 200) pts.push(x)
    return pts
  }, [a, b])
  const fillF = useMemo(() => fillXs.map(x => evaluateExpression(f, x)), [fillXs, f])
  const fillG = useMemo(() => fillXs.map(x => evaluateExpression(g, x)), [fillXs, g])

  const steps = [
    { title: 'Find Intersection Points', text: 'Set f(x) = g(x) and solve:', formula: 'x^2 = x + 2 \\Rightarrow x^2 - x - 2 = 0 \\Rightarrow (x-2)(x+1) = 0' },
    { title: 'Determine Which is on Top', text: 'Test a point in (−1, 2), e.g., x=0:', formula: 'f(0) = 0, \\quad g(0) = 2 \\Rightarrow g(x) \\geq f(x) \\text{ on } [-1, 2]' },
    { title: 'Set Up the Integral', formula: 'A = \\int_{-1}^{2} [g(x) - f(x)]\\,dx = \\int_{-1}^{2} [(x+2) - x^2]\\,dx' },
    { title: 'Evaluate', formula: '= \\left[\\frac{x^2}{2} + 2x - \\frac{x^3}{3}\\right]_{-1}^{2} = \\frac{9}{2}' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Area Between Curves</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x) — top curve" value={f} onChange={setF} />
            <CalcInput label="g(x) — bottom curve" value={g} onChange={setG} />
            <div className={styles.grid2}>
              <CalcInput label="a (left)" value={a} onChange={v => setA(parseFloat(v) || 0)} type="number" />
              <CalcInput label="b (right)" value={b} onChange={v => setB(parseFloat(v) || 1)} type="number" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Area between curves</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(area, 5)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Area Between f(x) and g(x)"
          data={[
            { x: [...fillXs, ...fillXs.slice().reverse()], y: [...fillF, ...fillG.slice().reverse()],
              type: 'scatter', mode: 'lines', fill: 'toself', fillcolor: color + '25',
              line: { color: 'transparent' }, name: 'Area', hoverinfo: 'skip' },
            { x: xsF, y: ysF, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)' },
            { x: xsG, y: ysG, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2.5 }, name: 'g(x)' },
          ]}
          footer="Shaded region = area between curves"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Area Between Curves"
          answer={`A = \\int_{${a}}^{${b}} |f(x)-g(x)|\\,dx \\approx ${formatNumber(area, 4)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Formula</div>
          <div className={styles.conceptBody}>
            <BlockMath math="A = \int_a^b [f_{\text{top}}(x) - f_{\text{bottom}}(x)]\,dx" />
            <p style={{marginTop:10, fontSize:'0.85rem', color:'rgba(240,240,255,0.5)'}}>
              Or if bounded by y:
            </p>
            <BlockMath math="A = \int_c^d [x_{\text{right}} - x_{\text{left}}]\,dy" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DiskWasher({ color }) {
  const [f, setF] = useState('sqrt(x)')
  const [g, setG] = useState('0')
  const [a, setA] = useState(0)
  const [b, setB] = useState(4)
  const [axis, setAxis] = useState('x')
  const [method, setMethod] = useState('disk')

  const volume = useMemo(() => {
    if (method === 'disk') {
      return Math.PI * numericalIntegral(`(${f})^2`, a, b)
    } else {
      return Math.PI * numericalIntegral(`(${f})^2 - (${g})^2`, a, b)
    }
  }, [f, g, a, b, method])

  // 3D-like cross sections
  const { xs, ys } = useMemo(() => generatePoints(f, a, b), [f, a, b])
  const { xs: xsG, ys: ysG } = useMemo(() => generatePoints(g, a, b), [g, a, b])

  // Animated revolution - use canvas
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    let frame = 0
    const anim = () => {
      frame++
      setAngle(frame * 0.02)
      animRef.current = requestAnimationFrame(anim)
    }
    animRef.current = requestAnimationFrame(anim)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const steps = [
    { title: 'Set Up (Disk Method)', text: 'Rotating f(x) around the x-axis. Each cross section is a disk.', formula: 'r(x) = f(x) = \\sqrt{x}' },
    { title: 'Volume of Each Disk', formula: 'dV = \\pi [r(x)]^2\\,dx = \\pi (\\sqrt{x})^2\\,dx = \\pi x\\,dx' },
    { title: 'Integrate', formula: 'V = \\pi \\int_0^4 x\\,dx = \\pi \\left[\\frac{x^2}{2}\\right]_0^4 = 8\\pi' },
    { title: 'Washer Method', text: 'When rotating region between f and g:', formula: 'V = \\pi \\int_a^b \\left([R(x)]^2 - [r(x)]^2\\right)dx' }
  ]

  // Generate revolution cross sections for visualization
  const revData = useMemo(() => {
    const data = []
    const nSlices = 30
    const nTheta = 24
    for (let i = 0; i < nSlices; i++) {
      const x = a + (b - a) * i / nSlices
      const R = Math.max(0, evaluateExpression(f, x) || 0)
      const r = Math.max(0, evaluateExpression(g, x) || 0)
      const theta = Array.from({ length: nTheta + 1 }, (_, j) => j * 2 * Math.PI / nTheta + angle)
      data.push({
        x: theta.map(() => x),
        y: theta.map(t => R * Math.cos(t)),
        z: theta.map(t => R * Math.sin(t)),
        type: 'scatter3d', mode: 'lines',
        line: { color: color, width: 2 }, showlegend: false, hoverinfo: 'skip'
      })
      if (r > 0) {
        data.push({
          x: theta.map(() => x),
          y: theta.map(t => r * Math.cos(t)),
          z: theta.map(t => r * Math.sin(t)),
          type: 'scatter3d', mode: 'lines',
          line: { color: '#f59e0b', width: 1.5 }, showlegend: false, hoverinfo: 'skip'
        })
      }
    }
    // Add the curve itself
    data.push({
      x: xs, y: ys, z: ys.map(() => 0),
      type: 'scatter3d', mode: 'lines', line: { color: '#f0f0ff', width: 3 }, name: 'f(x)'
    })
    return data
  }, [f, g, a, b, xs, ys, color, angle])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Volume of Revolution</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              <button className={`${styles.exBtn} ${method==='disk'?styles.exBtnActive:''}`}
                onClick={() => setMethod('disk')} style={{'--btn-color': color}}>Disk</button>
              <button className={`${styles.exBtn} ${method==='washer'?styles.exBtnActive:''}`}
                onClick={() => setMethod('washer')} style={{'--btn-color': color}}>Washer</button>
            </div>
            <CalcInput label="f(x) — outer radius" value={f} onChange={setF} />
            {method === 'washer' && <CalcInput label="g(x) — inner radius" value={g} onChange={setG} />}
            <div className={styles.grid2}>
              <CalcInput label="a" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" />
              <CalcInput label="b" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Volume (cubic units)</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(volume, 4)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="2D Cross-Section"
          data={[
            { x: [...xs, ...xs.slice().reverse()], y: [...ys, ...ys.map(y => -y).reverse()],
              type: 'scatter', mode: 'lines', fill: 'toself', fillcolor: color + '25',
              line: { color, width: 2 }, name: 'Revolution region' },
            method === 'washer' && { x: [...xsG, ...xsG.slice().reverse()], y: [...ysG, ...ysG.map(y => -y).reverse()],
              type: 'scatter', mode: 'lines', fill: 'toself', fillcolor: '#0a0a1a',
              line: { color: '#f59e0b', width: 1.5 }, name: 'Hollow region' },
          ].filter(Boolean)}
          footer="Reflected region shows what gets rotated"
        />
      </div>
      <div className={styles.right}>
        <div style={{ background: '#12122a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 12, marginBottom: 16 }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(240,240,255,0.5)', marginBottom: 8, textAlign: 'center' }}>
            🌀 3D Revolution Animation
          </p>
          <GraphPanel
            title=""
            data={revData}
            layout={{
              scene: {
                xaxis: { title: { text: 'x' }, color: '#666' },
                yaxis: { title: { text: 'y' }, color: '#666' },
                zaxis: { title: { text: 'z' }, color: '#666' },
                bgcolor: 'rgba(18,18,42,0)',
                camera: { eye: { x: 1.5, y: 1.5, z: 0.8 } },
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              font: { color: '#aaa' },
              margin: { l: 0, r: 0, t: 0, b: 0 },
            }}
            height={280}
          />
        </div>
        <StepByStep steps={steps} color={color} title="Disk/Washer Method"
          answer={`V = \\pi\\int_{${a}}^{${b}} [f(x)]^2\\,dx \\approx ${formatNumber(volume, 3)}`} />
      </div>
    </div>
  )
}

function ShellMethod({ color }) {
  const [f, setF] = useState('sqrt(x)')
  const [a, setA] = useState(0)
  const [b, setB] = useState(4)

  const volume = useMemo(() => 2 * Math.PI * numericalIntegral(`x * (${f})`, a, b), [f, a, b])

  const { xs, ys } = useMemo(() => generatePoints(f, a, b), [f, a, b])

  // Shell visualization
  const shellData = useMemo(() => {
    const shells = []
    const nShells = 15
    for (let i = 0; i < nShells; i++) {
      const x0 = a + (b - a) * i / nShells
      const x1 = a + (b - a) * (i + 1) / nShells
      const h = Math.max(0, evaluateExpression(f, (x0 + x1) / 2) || 0)
      const r = (x0 + x1) / 2
      // Cylinder outline
      const theta = Array.from({ length: 25 }, (_, j) => j * 2 * Math.PI / 24)
      shells.push({
        x: theta.map(t => r * Math.cos(t)),
        y: theta.map(t => r * Math.sin(t)),
        z: theta.map(() => h),
        type: 'scatter3d', mode: 'lines',
        line: { color, width: 1.5 }, showlegend: false, hoverinfo: 'skip'
      })
      // Vertical line
      shells.push({
        x: [r, r], y: [0, 0], z: [0, h],
        type: 'scatter3d', mode: 'lines',
        line: { color: '#f59e0b', width: 2 }, showlegend: false, hoverinfo: 'skip'
      })
    }
    return shells
  }, [f, a, b, color])

  const steps = [
    { title: 'Shell Method Idea', text: 'Instead of disks (perpendicular), use cylindrical shells (parallel to axis).', note: 'Shell method is often easier when the region is awkward to integrate with disks.' },
    { title: 'Shell Volume Formula', formula: 'dV = 2\\pi r \\cdot h(r) \\cdot dr', text: 'r = distance from axis, h = height of shell' },
    { title: 'Set Up Integral (rotation about y-axis)', formula: 'V = 2\\pi \\int_a^b x \\cdot f(x)\\,dx' },
    { title: 'Evaluate for f(x) = √x, [0,4]', formula: 'V = 2\\pi \\int_0^4 x\\sqrt{x}\\,dx = 2\\pi \\int_0^4 x^{3/2}\\,dx = 2\\pi \\cdot \\frac{2}{5}x^{5/2}\\Big|_0^4 = \\frac{128\\pi}{5}' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Shell Method Calculator</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x) = height" value={f} onChange={setF} />
            <div className={styles.grid2}>
              <CalcInput label="a" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" />
              <CalcInput label="b" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Volume (about y-axis)</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(volume, 4)}</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#12122a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 12 }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(240,240,255,0.5)', marginBottom: 4, textAlign: 'center' }}>🧅 Cylindrical Shells 3D View</p>
          <GraphPanel
            title=""
            data={shellData}
            layout={{
              scene: {
                xaxis: { color: '#666' }, yaxis: { color: '#666' }, zaxis: { color: '#666', title: { text: 'height' } },
                bgcolor: 'rgba(18,18,42,0)',
                camera: { eye: { x: 1.8, y: 1.2, z: 1 } },
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              font: { color: '#aaa' },
              margin: { l: 0, r: 0, t: 0, b: 0 },
            }}
            height={280}
          />
        </div>
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Shell Method"
          answer={`V = 2\\pi\\int_{${a}}^{${b}} x\\,f(x)\\,dx \\approx ${formatNumber(volume, 3)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Disk vs Shell</div>
          <div className={styles.conceptBody}>
            <table className={styles.numTable}>
              <thead><tr><th>Method</th><th>Rotation</th><th>Formula</th></tr></thead>
              <tbody>
                <tr><td>Disk</td><td>About x</td><td>π∫[f(x)]²dx</td></tr>
                <tr><td>Disk</td><td>About y</td><td>π∫[f(y)]²dy</td></tr>
                <tr><td>Shell</td><td>About y</td><td>2π∫x·f(x)dx</td></tr>
                <tr><td>Shell</td><td>About x</td><td>2π∫y·f(y)dy</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArcLength({ color }) {
  const [expr, setExpr] = useState('x^(3/2)')
  const [a, setA] = useState(0)
  const [b, setB] = useState(4)

  const arcLen = useMemo(() => {
    let sum = 0
    const n = 1000
    const h = (b - a) / n
    for (let i = 0; i < n; i++) {
      const x = a + i * h
      const x2 = a + (i + 1) * h
      const y1 = evaluateExpression(expr, x)
      const y2 = evaluateExpression(expr, x2)
      if (y1 !== null && y2 !== null && isFinite(y1) && isFinite(y2)) {
        sum += Math.sqrt(h ** 2 + (y2 - y1) ** 2)
      }
    }
    return sum
  }, [expr, a, b])

  const { xs, ys } = useMemo(() => generatePoints(expr, a, b), [expr, a, b])

  const steps = [
    { title: 'Arc Length Formula', formula: 'L = \\int_a^b \\sqrt{1 + [f\'(x)]^2}\\,dx' },
    { title: 'Compute f\'(x)', text: `For $f(x) = x^{3/2}$: $f'(x) = \\frac{3}{2}x^{1/2}$`, formula: "[f'(x)]^2 = \\frac{9}{4}x" },
    { title: 'Set Up Integral', formula: 'L = \\int_0^4 \\sqrt{1 + \\frac{9}{4}x}\\,dx' },
    { title: 'Use Substitution', formula: 'u = 1 + \\frac{9}{4}x, \\quad du = \\frac{9}{4}dx \\Rightarrow L = \\frac{8}{27}(1+\\frac{9}{4}x)^{3/2}\\Big|_0^4' },
    { title: 'Evaluate', formula: '= \\frac{8}{27}(10)^{3/2} - \\frac{8}{27} \\approx 9.073' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Arc Length Calculator</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div className={styles.grid2}>
              <CalcInput label="a" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" />
              <CalcInput label="b" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Arc Length</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(arcLen, 4)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Curve Arc Length"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 4 }, name: `L ≈ ${formatNumber(arcLen, 3)}` },
          ]}
          footer={`Total arc length = ${formatNumber(arcLen, 4)} units`}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Arc Length"
          answer={`L = \\int_{${a}}^{${b}} \\sqrt{1 + [f'(x)]^2}\\,dx \\approx ${formatNumber(arcLen, 4)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Arc Length Formulas</div>
          <div className={styles.conceptBody}>
            <p>Cartesian:</p>
            <BlockMath math="L = \int_a^b \sqrt{1+(f'(x))^2}\,dx" />
            <p>Parametric:</p>
            <BlockMath math="L = \int_\alpha^\beta \sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}\,dt" />
            <p>Polar:</p>
            <BlockMath math="L = \int_\alpha^\beta \sqrt{r^2+\left(\frac{dr}{d\theta}\right)^2}\,d\theta" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SurfaceArea({ color }) {
  const [expr, setExpr] = useState('sqrt(4 - x^2)')
  const [a, setA] = useState(-1)
  const [b, setB] = useState(1)

  const sa = useMemo(() => {
    let sum = 0
    const n = 500
    const h = (b - a) / n
    for (let i = 0; i < n; i++) {
      const x = a + (i + 0.5) * h
      const y = evaluateExpression(expr, x)
      const dy = (evaluateExpression(expr, x + 1e-6) - evaluateExpression(expr, x - 1e-6)) / 2e-6
      if (y !== null && isFinite(y) && dy !== null && isFinite(dy) && y > 0) {
        sum += 2 * Math.PI * y * Math.sqrt(1 + dy * dy) * h
      }
    }
    return sum
  }, [expr, a, b])

  const steps = [
    { title: 'Surface Area Formula', formula: 'S = 2\\pi\\int_a^b f(x)\\sqrt{1+[f\'(x)]^2}\\,dx', note: 'For rotation about the x-axis' },
    { title: 'Example: Sphere (upper semicircle)', formula: 'f(x) = \\sqrt{4-x^2}, \\quad f\'(x) = \\frac{-x}{\\sqrt{4-x^2}}' },
    { title: 'Simplify the integrand', formula: '1+[f\'(x)]^2 = 1 + \\frac{x^2}{4-x^2} = \\frac{4}{4-x^2}' },
    { title: 'Integral', formula: 'S = 2\\pi\\int_{-2}^{2} \\sqrt{4-x^2} \\cdot \\frac{2}{\\sqrt{4-x^2}}\\,dx = 4\\pi\\int_{-2}^{2}dx = 16\\pi' }
  ]

  const { xs, ys } = useMemo(() => generatePoints(expr, a, b), [expr, a, b])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Surface Area of Revolution</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} />
            <div className={styles.grid2}>
              <CalcInput label="a" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" />
              <CalcInput label="b" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Surface Area</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(sa, 4)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Curve Revolved (Cross Section)"
          data={[
            { x: [...xs, ...xs.slice().reverse()], y: [...ys, ...ys.map(y => -y).reverse()],
              type: 'scatter', mode: 'lines', fill: 'toself', fillcolor: color + '20', line: { color }, name: 'Revolution' },
          ]}
          footer="This curve, when rotated around x-axis, creates the surface"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Surface Area of Revolution"
          answer={`S = 2\\pi\\int_{${a}}^{${b}} f(x)\\sqrt{1+(f')^2}\\,dx \\approx ${formatNumber(sa, 3)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Surface Area Formulas</div>
          <div className={styles.conceptBody}>
            <p>About x-axis:</p>
            <BlockMath math="S = 2\pi\int_a^b f(x)\sqrt{1+[f'(x)]^2}\,dx" />
            <p style={{marginTop:8}}>About y-axis:</p>
            <BlockMath math="S = 2\pi\int_a^b x\sqrt{1+[f'(x)]^2}\,dx" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NetChange({ color }) {
  const [vExpr, setVExpr] = useState('3*t^2 - 12*t + 9')
  const [a, setA] = useState(0)
  const [b, setB] = useState(4)

  const { xs, ys } = useMemo(() => generatePoints(vExpr, a - 0.2, b + 0.2), [vExpr, a, b])
  const displacement = useMemo(() => numericalIntegral(vExpr, a, b), [vExpr, a, b])
  const totalDist = useMemo(() => numericalIntegral(`abs(${vExpr})`, a, b), [vExpr, a, b])

  const steps = [
    { title: 'Net Change Theorem', formula: '\\int_a^b F\'(x)\\,dx = F(b) - F(a)', note: 'The definite integral gives the NET change, not total.' },
    { title: 'Displacement vs Distance', text: 'v(t) = velocity. Displacement = ∫v dt (can be negative)', formula: '\\text{Displacement} = \\int_0^4 v(t)\\,dt' },
    { title: 'Total Distance', text: 'Count all movement regardless of direction:', formula: '\\text{Distance} = \\int_0^4 |v(t)|\\,dt' },
    { title: 'Find when v = 0', text: 'Object changes direction where v(t) = 0:', formula: '3t^2 - 12t + 9 = 0 \\Rightarrow t = 1, 3' }
  ]

  // Position function
  const posData = useMemo(() => {
    const xs2=[], ys2=[]
    for (let t = a; t <= b; t += (b-a)/200) {
      xs2.push(t)
      ys2.push(numericalIntegral(vExpr, a, t))
    }
    return {xs: xs2, ys: ys2}
  }, [vExpr, a, b])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Net Change & Motion</h4>
          <div className={styles.cardBody}>
            <CalcInput label="v(t) — velocity function" value={vExpr} onChange={setVExpr} hint="Positive = forward, negative = backward" />
            <div className={styles.grid2}>
              <CalcInput label="t start" value={a} onChange={v => setA(parseFloat(v)||0)} type="number" />
              <CalcInput label="t end" value={b} onChange={v => setB(parseFloat(v)||1)} type="number" />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Displacement (net)</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(displacement, 3)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Total Distance</div>
                <div className={styles.infoValue} style={{ color: '#f59e0b' }}>{formatNumber(totalDist, 3)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Velocity v(t)"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'v(t)', fill: 'tozeroy', fillcolor: color + '20' },
            { x: [a, b], y: [0, 0], type: 'scatter', mode: 'lines', line: { color: 'rgba(255,255,255,0.2)', width: 1 }, showlegend: false },
          ]}
          footer="Area above x-axis = forward; area below = backward"
        />
      </div>
      <div className={styles.right}>
        <GraphPanel
          title="Position s(t) = ∫v dt"
          data={[{ x: posData.xs, y: posData.ys, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2.5 }, name: 's(t)' }]}
          footer="Position = accumulated displacement"
        />
        <StepByStep steps={steps} color={color} title="Net Change Theorem"
          answer={`\\text{Displacement} = ${formatNumber(displacement, 3)},\\; \\text{Distance} = ${formatNumber(totalDist, 3)}`} />
      </div>
    </div>
  )
}
