import { useState, useMemo } from 'react'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { evaluateExpression, formatNumber } from '../utils/mathHelpers'
import { BlockMath, InlineMath } from 'react-katex'
import styles from './Topic.module.css'

const SUBTOPICS = [ConvergenceTests, GeometricSeries, PSeries, TaylorSeries, MaclaurinSeries, ErrorBounds]

export default function SeriesTopic({ subtopicIndex, color }) {
  const C = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <C color={color} />
}

function ConvergenceTests({ color }) {
  const tests = [
    {
      name: 'Ratio Test',
      formula: 'L = \\lim_{n\\to\\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|',
      rules: ['L < 1: converges absolutely', 'L > 1: diverges', 'L = 1: inconclusive'],
      example: '\\sum \\frac{n!}{2^n}',
      solution: 'L = \\lim \\frac{(n+1)!}{2^{n+1}} \\cdot \\frac{2^n}{n!} = \\lim \\frac{n+1}{2} = \\infty > 1 \\Rightarrow \\text{Diverges}',
      steps: [
        { title: 'Apply Ratio Test', formula: 'L = \\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right|' },
        { title: 'Compute', formula: '= \\lim_{n\\to\\infty} \\frac{(n+1)!}{2^{n+1}} \\cdot \\frac{2^n}{n!} = \\lim_{n\\to\\infty} \\frac{n+1}{2} = \\infty' },
        { title: 'Conclude', text: 'Since L > 1, the series diverges.', formula: '\\text{DIVERGES}' }
      ]
    },
    {
      name: 'Integral Test',
      formula: '\\int_1^\\infty f(x)\\,dx',
      rules: ['Integral converges ↔ series converges', 'f must be positive, continuous, decreasing'],
      example: '\\sum \\frac{1}{n^2}',
      solution: '\\int_1^\\infty \\frac{1}{x^2}\\,dx = 1 < \\infty \\Rightarrow \\text{Converges}',
      steps: [
        { title: 'Verify Conditions', text: 'f(x) = 1/x² is positive, continuous, and decreasing for x ≥ 1.' },
        { title: 'Evaluate the Integral', formula: '\\int_1^\\infty \\frac{1}{x^2}\\,dx = \\left[-\\frac{1}{x}\\right]_1^\\infty = 1' },
        { title: 'Conclude', text: 'Integral converges → series converges.', formula: '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6} \\approx 1.645' }
      ]
    },
    {
      name: 'Alternating Series Test',
      formula: '\\sum (-1)^n b_n',
      rules: ['bₙ → 0 as n → ∞', 'bₙ is eventually decreasing', 'Both conditions → converges'],
      example: '\\sum \\frac{(-1)^n}{n}',
      solution: 'b_n = 1/n → 0, decreasing \\Rightarrow \\text{Converges}',
      steps: [
        { title: 'Identify bₙ', formula: 'b_n = \\frac{1}{n}' },
        { title: 'Check bₙ → 0', formula: '\\lim_{n\\to\\infty} \\frac{1}{n} = 0 \\checkmark' },
        { title: 'Check Decreasing', formula: 'b_{n+1} = \\frac{1}{n+1} < \\frac{1}{n} = b_n \\checkmark' },
        { title: 'Conclude', text: 'Both conditions satisfied → series converges.', formula: '\\sum_{n=1}^\\infty \\frac{(-1)^n}{n} \\text{ converges}' }
      ]
    },
    {
      name: 'Comparison Test',
      formula: '\\text{If } 0 \\leq a_n \\leq b_n',
      rules: ['bₙ converges → aₙ converges', 'aₙ diverges → bₙ diverges'],
      example: '\\sum \\frac{1}{n^2 + n}',
      solution: '\\frac{1}{n^2+n} < \\frac{1}{n^2}, \\text{ and } \\sum \\frac{1}{n^2} \\text{ converges} \\Rightarrow \\text{Converges}',
      steps: [
        { title: 'Find Comparison', text: 'Note: n² + n > n², so 1/(n²+n) < 1/n²' },
        { title: 'Identify Known Series', formula: '\\sum \\frac{1}{n^2} \\text{ converges (p-series, p=2>1)}' },
        { title: 'Apply Comparison', formula: '0 < \\frac{1}{n^2+n} < \\frac{1}{n^2}' },
        { title: 'Conclude', text: 'By comparison test → converges.' }
      ]
    }
  ]
  const [sel, setSel] = useState(0)
  const test = tests[sel]

  // Partial sum visualization
  const partialSums = useMemo(() => {
    const xs = [], ys = []
    let sum = 0
    for (let n = 1; n <= 50; n++) {
      if (sel === 0) { /* skip - diverges too fast */ }
      else if (sel === 1) sum += 1 / (n * n)
      else if (sel === 2) sum += Math.pow(-1, n) / n
      else sum += 1 / (n * n + n)
      xs.push(n)
      ys.push(sum)
    }
    return { xs, ys }
  }, [sel])

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Convergence Tests</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {tests.map((t, i) => (
                <button key={i} className={`${styles.exBtn} ${sel===i?styles.exBtnActive:''}`}
                  onClick={() => setSel(i)} style={{'--btn-color': color}}>
                  {t.name}
                </button>
              ))}
            </div>
            <div style={{padding:'10px 0'}}>
              <BlockMath math={`\\text{Example: } ${test.example}`} />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Result</div>
              <div style={{ fontSize: '0.85rem', overflowX: 'auto' }}>
                <BlockMath math={test.solution} />
              </div>
            </div>
            <ul style={{paddingLeft:16, fontSize:'0.85rem', color:'rgba(240,240,255,0.6)', lineHeight:1.8}}>
              {test.rules.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
        {sel > 0 && (
          <GraphPanel
            title="Partial Sums Sₙ"
            data={[
              { x: partialSums.xs, y: partialSums.ys, type: 'scatter', mode: 'lines+markers',
                line: { color, width: 2 }, marker: { color, size: 4 }, name: 'Sₙ' }
            ]}
            footer="Partial sums approaching the limit = convergence"
          />
        )}
      </div>
      <div className={styles.right}>
        <StepByStep steps={test.steps} color={color} title={test.name} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Test Flowchart</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>1. Divergence Test: if aₙ ↛ 0, diverges</li>
              <li>2. Geometric/p-series: recognize form</li>
              <li>3. Alternating series: use AST</li>
              <li>4. Ratio/Root test: for factorial/exponential</li>
              <li>5. Integral/Comparison: for rational</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeometricSeries({ color }) {
  const [a, setA] = useState(1)
  const [r, setR] = useState(0.5)
  const [n, setN] = useState(10)

  const partialSum = a * (1 - Math.pow(r, n)) / (1 - r)
  const infiniteSum = Math.abs(r) < 1 ? a / (1 - r) : null
  const converges = Math.abs(r) < 1

  const xs = useMemo(() => Array.from({length:20},(_, i)=>i+1), [])
  const terms = useMemo(() => xs.map(k => a * Math.pow(r, k-1)), [xs, a, r])
  const sums = useMemo(() => {
    let s = 0
    return xs.map(k => { s += a * Math.pow(r, k-1); return s })
  }, [xs, a, r])

  const steps = [
    { title: 'Geometric Series Form', formula: '\\sum_{n=0}^{\\infty} ar^n = a + ar + ar^2 + \\cdots', note: 'Converges if and only if |r| < 1' },
    { title: 'Partial Sum Formula', formula: 'S_n = a\\frac{1-r^n}{1-r}' },
    { title: 'Infinite Sum', formula: converges ? `S = \\frac{a}{1-r} = \\frac{${a}}{1-${r}} = ${formatNumber(a/(1-r), 4)}` : '\\text{Diverges since } |r| \\geq 1' },
    { title: `After ${n} terms`, formula: `S_{${n}} = ${formatNumber(partialSum, 4)}` }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Geometric Series</h4>
          <div className={styles.cardBody}>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>a = {a}</span>
              <input type="range" min={0.1} max={5} step={0.1} value={a} onChange={e => setA(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>r = {r.toFixed(2)}</span>
              <input type="range" min={-1.5} max={1.5} step={0.05} value={r} onChange={e => setR(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>n = {n}</span>
              <input type="range" min={1} max={20} step={1} value={n} onChange={e => setN(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>Sₙ (partial)</div>
                <div className={styles.infoValue} style={{ color }}>{formatNumber(partialSum, 4)}</div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoLabel}>S∞</div>
                <div className={styles.infoValue} style={{ color: converges ? '#10b981' : '#ef4444' }}>
                  {converges ? formatNumber(infiniteSum, 4) : '∞ (diverges)'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Terms and Partial Sums"
          data={[
            { x: xs, y: terms, type: 'bar', marker: { color: color + 'aa' }, name: 'Terms aₙ' },
            { x: xs, y: sums, type: 'scatter', mode: 'lines+markers', line: { color: '#f59e0b', width: 2 }, marker: { color: '#f59e0b', size: 6 }, name: 'Sₙ' },
            converges ? { x: [1, 20], y: [infiniteSum, infiniteSum], type: 'scatter', mode: 'lines', line: { color: '#10b981', dash: 'dash', width: 1.5 }, name: 'S∞' } : null,
          ].filter(Boolean)}
          footer={converges ? `Series converges to ${formatNumber(infiniteSum, 3)}` : 'Series diverges!'}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Geometric Series"
          answer={converges ? `S = \\frac{${a}}{1-${r}} = ${formatNumber(infiniteSum, 4)}` : '\\text{Diverges}'} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Key Facts</div>
          <div className={styles.conceptBody}>
            <BlockMath math="\sum_{n=0}^\infty ar^n = \frac{a}{1-r}, \quad |r| < 1" />
            <ul style={{marginTop:10}}>
              <li>|r| {'<'} 1: converges to a/(1-r)</li>
              <li>|r| ≥ 1: diverges</li>
              <li>r = 0.5: sums to 2a</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function PSeries({ color }) {
  const [p, setP] = useState(2)
  const [n, setN] = useState(30)

  const converges = p > 1
  const partial = useMemo(() => {
    let s = 0
    for (let k = 1; k <= n; k++) s += 1 / Math.pow(k, p)
    return s
  }, [p, n])

  const exact = p === 2 ? Math.PI ** 2 / 6 : null

  const xs = useMemo(() => Array.from({length:n},(_, i)=>i+1), [n])
  const partialSums = useMemo(() => {
    let s = 0
    return xs.map(k => { s += 1/Math.pow(k, p); return s })
  }, [xs, p])

  const steps = [
    { title: 'p-Series Form', formula: '\\sum_{n=1}^\\infty \\frac{1}{n^p}', note: 'Converges if and only if p > 1' },
    { title: `For p = ${p}`, text: `Since p = ${p} ${converges ? '> 1, the series converges' : '≤ 1, the series diverges'}.` },
    { title: 'Special Cases', formula: 'p=1: \\text{harmonic series, diverges}; \\quad p=2: \\frac{\\pi^2}{6}' },
    { title: `Partial Sum S_${n}`, formula: `S_{${n}} = ${formatNumber(partial, 5)}${p===2 ? `, \\quad \\frac{\\pi^2}{6} \\approx ${formatNumber(Math.PI**2/6, 5)}` : ''}` }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>p-Series ∑ 1/nᵖ</h4>
          <div className={styles.cardBody}>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>p = {p.toFixed(1)}</span>
              <input type="range" min={0.2} max={4} step={0.1} value={p} onChange={e => setP(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>n = {n}</span>
              <input type="range" min={5} max={100} step={5} value={n} onChange={e => setN(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.resultBox} style={{ borderColor: converges ? '#10b981' : '#ef4444', background: (converges ? '#10b981' : '#ef4444') + '14' }}>
              p = {p.toFixed(1)} {converges ? '> 1 → CONVERGES ✓' : '≤ 1 → DIVERGES ✗'}
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Sₙ after {n} terms</div>
              <div className={styles.infoValue} style={{ color }}>{formatNumber(partial, 5)}</div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="Partial Sums Growing"
          data={[
            { x: xs, y: partialSums, type: 'scatter', mode: 'lines', line: { color, width: 2 }, name: `p=${p.toFixed(1)}` },
            p === 2 ? { x: [1, n], y: [Math.PI**2/6, Math.PI**2/6], type: 'scatter', mode: 'lines', line: { color: '#10b981', dash:'dash', width:1.5 }, name: 'π²/6' } : null
          ].filter(Boolean)}
          footer={converges ? 'Partial sums converge' : 'Partial sums grow without bound'}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="p-Series Test" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>p-Series Summary</div>
          <div className={styles.conceptBody}>
            <BlockMath math="\sum_{n=1}^\infty \frac{1}{n^p} \begin{cases} \text{converges} & p > 1 \\ \text{diverges} & p \leq 1 \end{cases}" />
            <ul style={{marginTop:12}}>
              <li>p=1: harmonic series (diverges, slowly)</li>
              <li>p=2: <InlineMath math="\pi^2/6 \approx 1.645" /></li>
              <li>p=4: <InlineMath math="\pi^4/90 \approx 1.082" /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaylorSeries({ color }) {
  const [func, setFunc] = useState('sin')
  const [center, setCenter] = useState(0)
  const [degree, setDegree] = useState(5)

  const funcConfigs = {
    sin: {
      expr: (x) => Math.sin(x),
      terms: (n, x, a) => {
        const k = 2 * n + 1
        return Math.pow(-1, n) * Math.pow(x - a, k) / factorial(k)
      },
      latex: '\\sin x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!}',
      maxN: 4,
    },
    cos: {
      expr: (x) => Math.cos(x),
      terms: (n, x, a) => {
        const k = 2 * n
        return Math.pow(-1, n) * Math.pow(x - a, k) / factorial(k)
      },
      latex: '\\cos x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n}}{(2n)!}',
      maxN: 4,
    },
    exp: {
      expr: (x) => Math.exp(x),
      terms: (n, x, a) => Math.pow(x - a, n) / factorial(n),
      latex: 'e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}',
      maxN: 6,
    },
    ln: {
      expr: (x) => Math.log(x),
      terms: (n, x, a) => n === 0 ? 0 : Math.pow(-1, n+1) * Math.pow(x - 1, n) / n,
      latex: '\\ln x = \\sum_{n=1}^\\infty \\frac{(-1)^{n+1}(x-1)^n}{n}',
      maxN: 5,
    }
  }
  const cfg = funcConfigs[func]

  function factorial(n) {
    if (n <= 0) return 1
    let r = 1; for (let i = 1; i <= n; i++) r *= i; return r
  }

  const taylorApprox = (x, deg) => {
    let sum = 0
    for (let n = 0; n <= deg; n++) { try { sum += cfg.terms(n, x, center) } catch {} }
    return isFinite(sum) ? sum : null
  }

  const xRange = [-5, 5]
  const xs = useMemo(() => {
    const pts = []
    for (let x = xRange[0]; x <= xRange[1]; x += 0.05) pts.push(x)
    return pts
  }, [])

  const exactYs = useMemo(() => xs.map(x => {
    try { const v = cfg.expr(x); return isFinite(v) ? v : null } catch { return null }
  }), [xs, cfg])

  const approxYs = useMemo(() => xs.map(x => taylorApprox(x, degree)), [xs, degree, cfg, center])

  const steps = [
    { title: 'Taylor Series Definition', formula: 'f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n', note: 'Represents f as an infinite polynomial!' },
    { title: 'For selected function', formula: cfg.latex },
    { title: `Degree ${degree} approximation`, text: `Using the first ${degree+1} terms to approximate.` },
    { title: 'Radius of Convergence', text: 'The Taylor series converges within some interval |x - a| < R.' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Taylor Series Approximation</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {Object.keys(funcConfigs).map(f => (
                <button key={f} className={`${styles.exBtn} ${func===f?styles.exBtnActive:''}`}
                  onClick={() => setFunc(f)} style={{'--btn-color': color}}>
                  {f === 'exp' ? 'eˣ' : f === 'ln' ? 'ln x' : f}
                </button>
              ))}
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>Degree {degree}</span>
              <input type="range" min={1} max={cfg.maxN*2} step={1} value={degree}
                onChange={e => setDegree(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div style={{overflowX:'auto', padding:'8px 0'}}>
              <BlockMath math={cfg.latex} />
            </div>
          </div>
        </div>
        <GraphPanel
          title="Function vs Taylor Approximation"
          data={[
            { x: xs, y: exactYs, type: 'scatter', mode: 'lines', line: { color: '#fff', width: 2, dash: 'dot' }, name: 'Exact', connectgaps: false },
            { x: xs, y: approxYs, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: `T_${degree}(x)`, connectgaps: false },
          ]}
          layout={{ yaxis: { range: [-3, 3] } }}
          footer={`Degree ${degree} polynomial approximation`}
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Taylor Series" />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Common Taylor Series</div>
          <div className={styles.conceptBody}>
            <ul>
              <li><InlineMath math="e^x = \sum \frac{x^n}{n!}" />, all x</li>
              <li><InlineMath math="\sin x = \sum \frac{(-1)^n x^{2n+1}}{(2n+1)!}" /></li>
              <li><InlineMath math="\cos x = \sum \frac{(-1)^n x^{2n}}{(2n)!}" /></li>
              <li><InlineMath math="\frac{1}{1-x} = \sum x^n" />, <InlineMath math="|x| < 1" /></li>
              <li><InlineMath math="\ln(1+x) = \sum \frac{(-1)^{n+1}x^n}{n}" />, <InlineMath math="|x| \leq 1" /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function MaclaurinSeries({ color }) {
  const MACLAURIN = [
    { name: 'eˣ', formula: 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots = \\sum_{n=0}^\\infty \\frac{x^n}{n!}', conv: '\\text{all } x' },
    { name: 'sin x', formula: '\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!}', conv: '\\text{all } x' },
    { name: 'cos x', formula: '\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n}}{(2n)!}', conv: '\\text{all } x' },
    { name: '1/(1-x)', formula: '\\frac{1}{1-x} = 1 + x + x^2 + x^3 + \\cdots = \\sum_{n=0}^\\infty x^n', conv: '|x| < 1' },
    { name: 'ln(1+x)', formula: '\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots = \\sum_{n=1}^\\infty \\frac{(-1)^{n+1}x^n}{n}', conv: '-1 < x \\leq 1' },
    { name: 'arctan x', formula: '\\arctan x = x - \\frac{x^3}{3} + \\frac{x^5}{5} - \\cdots = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{2n+1}', conv: '|x| \\leq 1' },
  ]
  const [sel, setSel] = useState(0)

  const steps = [
    { title: 'Maclaurin Series = Taylor at a = 0', formula: 'f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(0)}{n!}x^n' },
    { title: 'Derive from scratch (e.g. sin x)', text: 'Compute f(0), f\'(0), f\'\'(0), ...:', formula: '\\sin(0)=0, \\cos(0)=1, -\\sin(0)=0, -\\cos(0)=-1, \\ldots' },
    { title: 'Write the Series', formula: '\\sin x = 0 + x + 0 - \\frac{x^3}{6} + 0 + \\frac{x^5}{120} - \\cdots' },
    { title: 'Useful Manipulation', text: 'Substitute, multiply, differentiate, or integrate known series to get new ones!', formula: 'e^{x^2} = \\sum_{n=0}^\\infty \\frac{x^{2n}}{n!}' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Maclaurin Series Reference</h4>
          <div className={styles.cardBody}>
            <div className={styles.btnRow}>
              {MACLAURIN.map((m, i) => (
                <button key={i} className={`${styles.exBtn} ${sel===i?styles.exBtnActive:''}`}
                  onClick={() => setSel(i)} style={{'--btn-color': color}}>
                  {m.name}
                </button>
              ))}
            </div>
            <div style={{padding:'12px 0', overflowX:'auto'}}>
              <BlockMath math={MACLAURIN[sel].formula} />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Converges for</div>
              <div className={styles.infoValue}><BlockMath math={MACLAURIN[sel].conv} /></div>
            </div>
          </div>
        </div>
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Manipulation Tricks</div>
          <div className={styles.conceptBody}>
            <ul>
              <li>Substitute <InlineMath math="x \to x^2" />: e.g., <InlineMath math="e^{x^2}" /></li>
              <li>Multiply by x: e.g., <InlineMath math="x\sin x" /></li>
              <li>Differentiate term-by-term</li>
              <li>Integrate term-by-term</li>
              <li>Add/subtract series</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Maclaurin Series" />
      </div>
    </div>
  )
}

function ErrorBounds({ color }) {
  const [degree, setDegree] = useState(3)
  const [x, setX] = useState(1)

  function fact(n) { let r=1; for(let i=1;i<=n;i++) r*=i; return r }

  // Taylor remainder for sin x centered at 0
  const taylorSinApprox = useMemo(() => {
    let sum = 0
    for (let n = 0; n <= degree; n++) {
      sum += Math.pow(-1, n) * Math.pow(x, 2*n+1) / fact(2*n+1)
    }
    return sum
  }, [degree, x])

  const exactSin = Math.sin(x)
  const error = Math.abs(exactSin - taylorSinApprox)
  const lagrangeError = Math.pow(Math.abs(x), 2*degree+3) / fact(2*degree+3)

  const steps = [
    { title: 'Lagrange Error Bound', formula: '|R_n(x)| \\leq \\frac{M|x-a|^{n+1}}{(n+1)!}', note: 'M = max |f⁽ⁿ⁺¹⁾| on interval, guarantees the error is at most this.' },
    { title: 'For sin x at x = ' + x, text: 'Since all derivatives of sin are bounded by 1 (M=1):', formula: `|R_{${2*degree+1}}(${x})| \\leq \\frac{|${x}|^{${2*degree+3}}}{${2*degree+3}!} \\approx ${formatNumber(lagrangeError, 8)}` },
    { title: 'Actual Error', formula: `|\\sin(${x}) - T_{${2*degree+1}}(${x})| = ${formatNumber(error, 8)}` },
    { title: 'Alternating Series Error Bound', formula: '|\\text{error}| \\leq |a_{n+1}| \\text{ (for alternating series)}', note: 'Easier to use when applicable!' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.cardBar} style={{ background: color }} />
          <h4 className={styles.cardTitle}>Taylor Series Error Analysis</h4>
          <div className={styles.cardBody}>
            <p style={{fontSize:'0.85rem',color:'rgba(240,240,255,0.6)', marginBottom:8}}>Approximating sin(x) with Taylor polynomial</p>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>Degree {2*degree+1}</span>
              <input type="range" min={0} max={6} step={1} value={degree}
                onChange={e => setDegree(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.sliderRow}>
              <span className={styles.sliderLabel}>x = {x.toFixed(1)}</span>
              <input type="range" min={-3} max={3} step={0.1} value={x}
                onChange={e => setX(+e.target.value)} style={{'--slider-color': color}} />
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}><div className={styles.infoLabel}>Exact sin({x.toFixed(1)})</div><div className={styles.infoValue}>{formatNumber(exactSin, 6)}</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>T_{2*degree+1}(x)</div><div className={styles.infoValue} style={{color}}>{formatNumber(taylorSinApprox, 6)}</div></div>
            </div>
            <div className={styles.grid2}>
              <div className={styles.infoBox}><div className={styles.infoLabel}>Actual Error</div><div className={styles.infoValue} style={{color: error<1e-4?'#10b981':'#ef4444'}}>{formatNumber(error, 8)}</div></div>
              <div className={styles.infoBox}><div className={styles.infoLabel}>Error Bound</div><div className={styles.infoValue}>{formatNumber(lagrangeError, 8)}</div></div>
            </div>
          </div>
        </div>
        <GraphPanel
          title="sin(x) vs Taylor Approximations"
          data={[
            { x: Array.from({length:200},(_,i)=>-5+i*0.05), y: Array.from({length:200},(_,i)=>Math.sin(-5+i*0.05)), type:'scatter', mode:'lines', line:{color:'#fff',dash:'dot',width:1.5}, name:'sin x' },
            ...Array.from({length:Math.min(degree+1,3)},(_,d)=>({
              x: Array.from({length:200},(_,i)=>-5+i*0.05),
              y: Array.from({length:200},(_,i)=>{
                const xi=-5+i*0.05; let s=0
                for(let n=0;n<=d;n++) s+=Math.pow(-1,n)*Math.pow(xi,2*n+1)/fact(2*n+1)
                return Math.abs(s)<10?s:null
              }),
              type:'scatter',mode:'lines',
              line:{color:['#ef4444','#f59e0b',color][d],width:2},
              name:`T${2*d+1}(x)`,connectgaps:false
            }))
          ]}
          layout={{ yaxis: { range: [-2, 2] } }}
          footer="Higher degree = better approximation near x=0"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Error Bounds"
          answer={`|R_n| \\leq \\frac{M|x-a|^{n+1}}{(n+1)!} \\approx ${formatNumber(lagrangeError, 8)}`} />
        <div className={styles.conceptCard} style={{ borderColor: color + '30' }}>
          <div className={styles.conceptTitle} style={{ color }}>Two Error Bounds</div>
          <div className={styles.conceptBody}>
            <p><strong>Lagrange (Taylor's Remainder):</strong></p>
            <BlockMath math="|R_n| \leq \frac{M|x-a|^{n+1}}{(n+1)!}" />
            <p style={{marginTop:10}}><strong>Alternating Series:</strong></p>
            <BlockMath math="|S - S_n| \leq |a_{n+1}|" />
            <p style={{marginTop:8,fontSize:'0.82rem',color:'rgba(240,240,255,0.4)'}}>Use whichever applies and gives a tighter bound.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
