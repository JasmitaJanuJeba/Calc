import { useState, useMemo } from 'react'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { generatePoints, evaluateExpression, numericalDerivative, formatNumber } from '../utils/mathHelpers'
import { BlockMath, InlineMath } from 'react-katex'
import styles from './Topic.module.css'

const SUBTOPICS = [PowerRule, ProductQuotient, ChainRule, ImplicitDiff, InverseTrig, RelatedRates]

export default function DerivativesTopic({ subtopicIndex, color }) {
  const C = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <C color={color} />
}

function PowerRule({ color }) {
  const [expr, setExpr] = useState('x^3 - 2*x^2 + x - 1')
  const [xVal, setXVal] = useState('2')

  const { xs, ys } = useMemo(() => generatePoints(expr, -3, 4), [expr])
  const derivPoints = useMemo(() => {
    const xs2 = [], ys2 = []
    for (let x = -3; x <= 4; x += 0.05) {
      xs2.push(x)
      ys2.push(numericalDerivative(expr, x))
    }
    return { xs: xs2, ys: ys2 }
  }, [expr])

  const x0 = parseFloat(xVal)
  const slope = useMemo(() => numericalDerivative(expr, x0), [expr, x0])
  const y0 = useMemo(() => evaluateExpression(expr, x0), [expr, x0])

  // Tangent line
  const tanXs = [-3, 4]
  const tanYs = tanXs.map(x => y0 + slope * (x - x0))

  const steps = [
    {
      title: 'Identify Each Term',
      text: 'Apply the Power Rule to each term: $\\frac{d}{dx}[x^n] = nx^{n-1}$',
      formula: '\\frac{d}{dx}[x^3 - 2x^2 + x - 1]',
    },
    {
      title: 'Differentiate Term by Term',
      text: 'Use linearity of derivatives:',
      formula: '= \\frac{d}{dx}[x^3] - 2\\frac{d}{dx}[x^2] + \\frac{d}{dx}[x] - \\frac{d}{dx}[1]',
    },
    {
      title: 'Apply Power Rule',
      text: 'Bring down the exponent, reduce by 1:',
      formula: '= 3x^2 - 4x + 1 - 0 = 3x^2 - 4x + 1',
    },
    {
      title: 'Evaluate at a Point',
      text: `Find the slope of the tangent line at $x = ${xVal}$:`,
      formula: `f'(${xVal}) = 3(${xVal})^2 - 4(${xVal}) + 1 = ${formatNumber(slope)}`,
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Interactive Derivative Calculator</h4>
          <div className={styles.cardBody}>
            <CalcInput label="f(x)" value={expr} onChange={setExpr} hint="Use ^ for powers" />
            <CalcInput label="Point x₀" value={xVal} onChange={setXVal} hint="Evaluate derivative at this x" />
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>f(x₀)</div>
                <div className={styles.infoValue}>{formatNumber(y0)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>f'(x₀) = slope</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(slope)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="f(x), f'(x), and Tangent Line"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color: '#06b6d4', width: 2.5 }, name: 'f(x)' },
            { x: derivPoints.xs, y: derivPoints.ys, type: 'scatter', mode: 'lines', line: { color: '#ec4899', width: 2, dash: 'dash' }, name: "f'(x)" },
            { x: tanXs, y: tanYs, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2 }, name: 'Tangent line' },
            { x: [x0], y: [y0], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10 }, name: `(${xVal}, f(${xVal}))` },
          ]}
          layout={{ yaxis: { range: [-10, 15] } }}
          footer="Yellow dashed = tangent line at x₀"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Power Rule" answer={`f'(x) = 3x^2 - 4x + 1`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Differentiation Rules</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Power: $\frac{'{'} d {'}'}{'{'} dx {'}'}[x^n] = nx^{'{'}n-1{'}'}$</li>
              <li>Constant: $\frac{'{'} d {'}'}{'{'} dx {'}'}[c] = 0$</li>
              <li>Sum/Diff: $(f \pm g)' = f' \pm g'$</li>
              <li>Constant Multiple: $(cf)' = cf'$</li>
              <li>$\frac{'{'} d {'}'}{'{'} dx {'}'}[e^x] = e^x$</li>
              <li>$\frac{'{'} d {'}'}{'{'} dx {'}'}[\ln x] = \frac{'{'}1{'}'}{'{'}x{'}'}$</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductQuotient({ color }) {
  const examples = [
    {
      label: 'Product', type: 'product',
      f: 'x^2', g: 'sin(x)',
      latex: '\\frac{d}{dx}[x^2 \\sin x] = 2x\\sin x + x^2 \\cos x',
      steps: [
        { title: 'Identify f and g', text: 'Let $f(x) = x^2$ and $g(x) = \\sin x$' },
        { title: 'Product Rule Formula', formula: '(fg)\' = f\'g + fg\'' },
        { title: 'Differentiate each', text: "$f'(x) = 2x$, $g'(x) = \\cos x$" },
        { title: 'Apply', formula: '= 2x \\cdot \\sin x + x^2 \\cdot \\cos x' },
      ]
    },
    {
      label: 'Quotient', type: 'quotient',
      f: 'sin(x)', g: 'x',
      latex: '\\frac{d}{dx}\\left[\\frac{\\sin x}{x}\\right] = \\frac{x\\cos x - \\sin x}{x^2}',
      steps: [
        { title: 'Identify f and g', text: 'Let $f(x) = \\sin x$ and $g(x) = x$' },
        { title: 'Quotient Rule Formula', formula: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}" },
        { title: 'Differentiate each', text: "$f'(x) = \\cos x$, $g'(x) = 1$" },
        { title: 'Apply', formula: '= \\frac{(\\cos x)(x) - (\\sin x)(1)}{x^2} = \\frac{x\\cos x - \\sin x}{x^2}' },
      ]
    },
  ]
  const [sel, setSel] = useState(0)
  const ex = examples[sel]

  const fullExpr = ex.type === 'product' ? `(${ex.f})*(${ex.g})` : `(${ex.f})/(${ex.g})`
  const { xs, ys } = useMemo(() => generatePoints(fullExpr, -5, 5), [fullExpr])
  const derivPts = useMemo(() => {
    const xs2=[], ys2=[]
    for (let x=-5; x<=5; x+=0.05) { xs2.push(x); ys2.push(numericalDerivative(fullExpr, x)) }
    return {xs: xs2, ys: ys2}
  }, [fullExpr])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Product & Quotient Rule</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {examples.map((e, i) => (
                <button key={i} className={`${styles.exBtn} ${sel===i?styles.exBtnActive:''}`}
                  onClick={() => setSel(i)} style={{'--btn-color': color}}>
                  {e.label} Rule
                </button>
              ))}
            </div>
            <div style={{ padding: '12px 0' }}>
              <BlockMath math={ex.latex} />
            </div>
          </div>
        </div>
        <GraphPanel
          title="Function and its Derivative"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)', connectgaps: false },
            { x: derivPts.xs, y: derivPts.ys, type: 'scatter', mode: 'lines', line: { color: '#ec4899', width: 2, dash:'dash' }, name: "f'(x)", connectgaps: false },
          ]}
          layout={{ yaxis: { range: [-5, 5] } }}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={ex.steps} color={color} title={`${ex.label} Rule`} answer={ex.latex} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>The Rules</div>
          <div className={styles.conceptBody}>
            <p style={{marginBottom:12}}><strong>Product Rule:</strong></p>
            <BlockMath math="(fg)' = f'g + fg'" />
            <p style={{margin:'12px 0'}}><strong>Quotient Rule:</strong></p>
            <BlockMath math="\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}" />
            <p style={{fontSize:'0.82rem', color:'rgba(240,240,255,0.4)', marginTop:8}}>
              Memory trick: "LO d(HI) minus HI d(LO), all over LO squared"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChainRule({ color }) {
  const [outer, setOuter] = useState('sin(u)')
  const [inner, setInner] = useState('x^2')
  const [xVal, setXVal] = useState('1')

  const composed = useMemo(() => outer.replace('u', `(${inner})`), [outer, inner])
  const { xs, ys } = useMemo(() => generatePoints(composed, -3, 3), [composed])
  const derivPts = useMemo(() => {
    const xs2=[], ys2=[]
    for (let x=-3; x<=3; x+=0.04) { xs2.push(x); ys2.push(numericalDerivative(composed, x)) }
    return {xs: xs2, ys: ys2}
  }, [composed])

  const x0 = parseFloat(xVal)
  const slopeVal = useMemo(() => numericalDerivative(composed, x0), [composed, x0])

  const steps = [
    {
      title: 'Identify Outer and Inner Functions',
      text: `Outer: $f(u) = ${outer}$,  Inner: $g(x) = ${inner}$`,
      note: 'The chain rule handles compositions: h(x) = f(g(x))',
    },
    {
      title: 'Chain Rule Formula',
      formula: "h'(x) = f'(g(x)) \\cdot g'(x)",
      text: 'Derivative of outer (evaluated at inner) times derivative of inner',
    },
    {
      title: 'Compute Each Part',
      text: `Derivative of outer with u = g(x), times derivative of inner`,
    },
    {
      title: 'Evaluate at x = ' + xVal,
      formula: `h'(${xVal}) \\approx ${formatNumber(slopeVal)}`,
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Chain Rule Builder</h4>
          <div className={styles.cardBody}>
            <CalcInput label="Outer f(u)" value={outer} onChange={setOuter} hint="Use u as the variable (e.g. sin(u), u^3, e^u)" />
            <CalcInput label="Inner g(x)" value={inner} onChange={setInner} hint="e.g. x^2, 3*x+1" />
            <CalcInput label="Point x₀" value={xVal} onChange={setXVal} />
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>h(x) = f(g(x))</div>
              <div className={styles.infoValue} style={{ fontSize: '0.85rem', fontFamily:'JetBrains Mono' }}>{composed}</div>
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>h(x₀)</div>
                <div className={styles.infoValue}>{formatNumber(evaluateExpression(composed, x0))}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>h'(x₀)</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(slopeVal)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="h(x) = f(g(x)) and h'(x)"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'h(x)', connectgaps: false },
            { x: derivPts.xs, y: derivPts.ys, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2, dash:'dash' }, name: "h'(x)", connectgaps: false },
          ]}
          layout={{ yaxis: { range: [-5, 5] } }}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Chain Rule" answer="h'(x) = f'(g(x)) \\cdot g'(x)" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Chain Rule Examples</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>$\frac{'{'}d{'}'}{'{'}dx{'}'}[\sin(x^2)] = \cos(x^2) \cdot 2x$</li>
              <li>$\frac{'{'}d{'}'}{'{'}dx{'}'}[e^{'{'}3x{'}'}] = e^{'{'}3x{'}'} \cdot 3$</li>
              <li>$\frac{'{'}d{'}'}{'{'}dx{'}'}[(x^2+1)^5] = 5(x^2+1)^4 \cdot 2x$</li>
              <li>$\frac{'{'}d{'}'}{'{'}dx{'}'}[\ln(x^2+1)] = \frac{'{'}2x{'}'}{'{'}x^2+1{'}'}$</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImplicitDiff({ color }) {
  const steps = [
    {
      title: 'Start with the Implicit Equation',
      text: 'Consider the unit circle: $x^2 + y^2 = 1$',
      note: 'y is an implicit function of x — we cannot easily solve for y first.',
    },
    {
      title: 'Differentiate Both Sides',
      text: 'Differentiate every term with respect to x. Remember: $\\frac{d}{dx}[y^n] = ny^{n-1}\\frac{dy}{dx}$ (chain rule!)',
      formula: '\\frac{d}{dx}[x^2 + y^2] = \\frac{d}{dx}[1]',
    },
    {
      title: 'Apply the Chain Rule to y Terms',
      formula: '2x + 2y \\frac{dy}{dx} = 0',
    },
    {
      title: 'Solve for dy/dx',
      formula: '2y\\frac{dy}{dx} = -2x \\Rightarrow \\frac{dy}{dx} = -\\frac{x}{y}',
    },
    {
      title: 'Evaluate at a Point',
      text: 'At $(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}})$:',
      formula: "\\frac{dy}{dx} = -\\frac{1/\\sqrt{2}}{1/\\sqrt{2}} = -1",
    }
  ]

  // Generate circle
  const circleData = useMemo(() => {
    const t = [], xs = [], ys = []
    for (let i = 0; i <= 360; i++) {
      const rad = i * Math.PI / 180
      xs.push(Math.cos(rad))
      ys.push(Math.sin(rad))
    }
    return { xs, ys }
  }, [])

  const [point, setPoint] = useState(45)
  const px = Math.cos(point * Math.PI / 180)
  const py = Math.sin(point * Math.PI / 180)
  const slope = -px / py
  const tanLen = 0.5
  const tanXs = [px - tanLen, px + tanLen]
  const tanYs = [py - slope * tanLen, py + slope * tanLen]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Circle: x² + y² = 1</h4>
          <div className={styles.cardBody}>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>Angle: {point}°</span>
              <input type="range" min={0} max={360} value={point} onChange={e => setPoint(+e.target.value)}
                style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Point</div>
                <div className={styles.infoValue}>({formatNumber(px, 3)}, {formatNumber(py, 3)})</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>dy/dx = -x/y</div>
                <div className={styles.infoValue} style={{ color }}>{Math.abs(py) < 0.01 ? '±∞' : formatNumber(slope)}</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Implicit Curve and Tangent"
          data={[
            { x: circleData.xs, y: circleData.ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'x²+y²=1' },
            { x: tanXs, y: tanYs, type: 'scatter', mode: 'lines', line: { color: '#f59e0b', width: 2 }, name: 'Tangent' },
            { x: [px], y: [py], type: 'scatter', mode: 'markers', marker: { color: '#f59e0b', size: 10 }, name: 'Point' },
          ]}
          layout={{ xaxis: { range: [-1.5, 1.5] }, yaxis: { range: [-1.5, 1.5], scaleanchor: 'x' } }}
          footer="Drag the slider to move the point along the circle"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Implicit Differentiation"
          answer="\\frac{dy}{dx} = -\\frac{x}{y}" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Key Insight</div>
          <div className={styles.conceptBody}>
            <p>When differentiating $y$ with respect to $x$, always multiply by $\frac{'{'} dy {'}'}{'{'} dx {'}'}$:</p>
            <p style={{margin:'8px 0'}}>$\frac{'{'}d{'}'}{'{'}dx{'}'}[y^2] = 2y\frac{'{'}dy{'}'}{'{'}dx{'}'}$</p>
            <p>$\frac{'{'}d{'}'}{'{'}dx{'}'}[\sin y] = \cos y \cdot \frac{'{'}dy{'}'}{'{'}dx{'}'}$</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InverseTrig({ color }) {
  const derivs = [
    { name: '\\arcsin x', deriv: '\\frac{1}{\\sqrt{1-x^2}}', expr: '1/sqrt(1-x^2)', domain: [-0.99, 0.99] },
    { name: '\\arccos x', deriv: '-\\frac{1}{\\sqrt{1-x^2}}', expr: '-1/sqrt(1-x^2)', domain: [-0.99, 0.99] },
    { name: '\\arctan x', deriv: '\\frac{1}{1+x^2}', expr: '1/(1+x^2)', domain: [-5, 5] },
    { name: '\\text{arcsec} x', deriv: '\\frac{1}{|x|\\sqrt{x^2-1}}', expr: '1/(abs(x)*sqrt(x^2-1))', domain: [-5, -1.01] },
  ]
  const [sel, setSel] = useState(0)
  const d = derivs[sel]
  const { xs, ys } = useMemo(() => generatePoints(d.expr, d.domain[0], d.domain[1]), [d])

  const steps = [
    { title: 'Memorize the Formula', text: `The derivative of $${d.name}$ is:`, formula: `\\frac{d}{dx}[${d.name}] = ${d.deriv}` },
    { title: 'Example Problem', text: `Differentiate $f(x) = ${d.name}(3x)$ using the chain rule:`, formula: `f'(x) = ${d.deriv.replace('x', '3x')} \\cdot 3` },
    { title: 'Simplify', text: 'Factor out and simplify if possible.', note: 'These formulas come from implicit differentiation of the original trig functions.' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Inverse Trig Derivatives</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {derivs.map((d, i) => (
                <button key={i} className={`${styles.exBtn} ${sel===i?styles.exBtnActive:''}`}
                  onClick={() => setSel(i)} style={{'--btn-color': color}}>
                  <InlineMath math={d.name} />
                </button>
              ))}
            </div>
            <div style={{padding:'10px 0'}}>
              <BlockMath math={`\\frac{d}{dx}[${d.name}] = ${d.deriv}`} />
            </div>
          </div>
        </div>
        <GraphPanel
          title={`d/dx[${derivs[sel].name}] = ${derivs[sel].deriv}`}
          data={[{ x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, connectgaps: false }]}
          layout={{ yaxis: { range: [-5, 5] } }}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Inverse Trig" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>All 6 Formulas</div>
          <div className={styles.conceptBody}>
            <ul>
              <li><InlineMath math={"(\\arcsin x)' = \\frac{1}{\\sqrt{1-x^2}}"} /></li>
              <li><InlineMath math={"(\\arccos x)' = -\\frac{1}{\\sqrt{1-x^2}}"} /></li>
              <li><InlineMath math={"(\\arctan x)' = \\frac{1}{1+x^2}"} /></li>
              <li><InlineMath math={"(\\operatorname{arccot} x)' = -\\frac{1}{1+x^2}"} /></li>
              <li><InlineMath math={"(\\operatorname{arcsec} x)' = \\frac{1}{|x|\\sqrt{x^2-1}}"} /></li>
              <li><InlineMath math={"(\\operatorname{arccsc} x)' = -\\frac{1}{|x|\\sqrt{x^2-1}}"} /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function RelatedRates({ color }) {
  const [radius, setRadius] = useState(3)
  const [dRdt, setDRdt] = useState(2)

  const dAdt = 2 * Math.PI * radius * dRdt
  const dVdt = 4 * Math.PI * radius ** 2 * dRdt

  const steps = [
    {
      title: 'Identify What\'s Changing',
      text: 'A balloon is being inflated. Radius r is increasing at dr/dt = ' + dRdt + ' cm/s.',
      note: 'Related rates connect rates of change of different quantities.',
    },
    {
      title: 'Write the Equation',
      text: 'Area of a sphere: $A = 4\\pi r^2$',
    },
    {
      title: 'Differentiate Implicitly with Respect to t',
      formula: '\\frac{dA}{dt} = 8\\pi r \\cdot \\frac{dr}{dt}',
    },
    {
      title: 'Substitute Known Values',
      formula: `\\frac{dA}{dt} = 8\\pi (${radius})(${dRdt}) = ${formatNumber(dAdt, 2)} \\text{ cm}^2/\\text{s}`,
    }
  ]

  // Sphere visualization sizes
  const sizes = [1, 2, 3, 4, 5].map(t => ({ t, r: radius + dRdt * t * 0.1 }))

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Expanding Sphere</h4>
          <div className={styles.cardBody}>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>r = {radius} cm</span>
              <input type="range" min={1} max={10} step={0.5} value={radius} onChange={e => setRadius(+e.target.value)}
                style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>dr/dt = {dRdt}</span>
              <input type="range" min={0.5} max={5} step={0.5} value={dRdt} onChange={e => setDRdt(+e.target.value)}
                style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>dA/dt (surface area)</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(dAdt, 2)} cm²/s</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>dV/dt (volume)</div>
                <div className={styles.infoValue} style={{ color: '#06b6d4' }}>{formatNumber(dVdt, 2)} cm³/s</div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Sphere Growth Over Time"
          data={[{
            x: [0, 1, 2, 3, 4, 5],
            y: [0, 1, 2, 3, 4, 5].map(t => 4 * Math.PI * (radius + dRdt * t * 0.1) ** 2),
            type: 'scatter', mode: 'lines+markers',
            line: { color, width: 2.5 },
            marker: { color, size: 8 },
            name: 'Surface Area (cm²)'
          }]}
          layout={{ xaxis: { title: { text: 'Time (s)' } }, yaxis: { title: { text: 'A (cm²)' } } }}
          footer="Surface area grows quadratically as radius increases linearly"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Related Rates"
          answer={`\\frac{dA}{dt} = 8\\pi r \\cdot \\frac{dr}{dt} = ${formatNumber(dAdt, 2)} \\text{ cm}^2/\\text{s}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Strategy</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Draw a diagram</li>
              <li>Label all variables and rates</li>
              <li>Find a geometric equation relating them</li>
              <li>Differentiate both sides with respect to t</li>
              <li>Substitute known values and solve</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
