import { useState, useMemo } from 'react'
import GraphPanel from '../components/GraphPanel'
import StepByStep from '../components/StepByStep'
import CalcInput from '../components/CalcInput'
import { ConceptCard } from '../components/MathList'
import { generatePoints, evaluateExpression, formatNumber } from '../utils/mathHelpers'
import { BlockMath } from 'react-katex'
import styles from './Topic.module.css'

const SUBTOPICS = [LimitDefinition, OneSidedLimits, InfiniteLimits, LHopital, Continuity, SqueezeTheorem]

export default function LimitsTopic({ subtopicIndex, color }) {
  const Component = SUBTOPICS[subtopicIndex] || SUBTOPICS[0]
  return <Component color={color} />
}

// ─── 1. Limit Definition ─────────────────────────────────────────────────────
function LimitDefinition({ color }) {
  const [expr, setExpr] = useState('(x^2 - 1)/(x - 1)')
  const [approach, setApproach] = useState('1')

  const { xs, ys } = useMemo(() => generatePoints(expr, -5, 5), [expr])
  const a = parseFloat(approach)
  const xVals = useMemo(() => {
    if (isNaN(a)) return []
    return [a - 0.1, a - 0.01, a - 0.001, a + 0.001, a + 0.01, a + 0.1].map(x => ({
      x, y: evaluateExpression(expr, x)
    }))
  }, [expr, approach])

  const limitVal = useMemo(() => {
    if (isNaN(a)) return null
    const vals = [0.0001, 0.00001].map(h => evaluateExpression(expr, a + h)).filter(v => v !== null && isFinite(v))
    return vals.length > 0 ? vals[vals.length - 1] : null
  }, [expr, a])

  const steps = [
    {
      title: 'Understand the Problem',
      text: `We want to find the limit as x approaches ${approach}.`,
      note: 'A limit asks: "What value does f(x) approach as x gets close to some value a?"'
    },
    {
      title: 'Try Direct Substitution',
      text: `Plug in x = ${approach} directly:`,
      formula: `f(${approach}) = ${formatNumber(evaluateExpression(expr, parseFloat(approach)))}`,
    },
    {
      title: 'Numerical Approach',
      text: 'Check values on both sides:',
      formula: xVals.slice(0, 3).map(({ x, y }) => `f(${formatNumber(x, 3)}) = ${formatNumber(y, 4)}`).join(', \\quad '),
    },
    {
      title: 'Algebraic Simplification',
      text: 'If 0/0 form, factor and cancel common terms.',
      formula: '\\frac{x^2-1}{x-1} = \\frac{(x+1)(x-1)}{x-1} = x+1 \\quad (x \\neq 1)',
    },
    {
      title: 'Conclude',
      formula: `\\lim_{x \\to ${approach}} f(x) = ${limitVal !== null ? formatNumber(limitVal) : '\\text{DNE}'}`,
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <SectionCard title="Try It Yourself" color={color}>
          <CalcInput label="Function f(x)" value={expr} onChange={setExpr} placeholder="e.g. (x^2-1)/(x-1)" hint="Use ^ for powers" />
          <CalcInput label="Approach value (a)" value={approach} onChange={setApproach} placeholder="e.g. 1" />
          {limitVal !== null && (
            <div className={styles.resultBox} style={{ borderColor: color, background: color + '14' }}>
              <span style={{ color }}>lim</span> as x → {approach} ={' '}
              <strong style={{ color }}>{formatNumber(limitVal, 5)}</strong>
            </div>
          )}
        </SectionCard>
        <GraphPanel
          title="Graph of f(x)"
          data={[
            { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)', connectgaps: false },
            { x: [a], y: [limitVal], type: 'scatter', mode: 'markers',
              marker: { color: '#f59e0b', size: 10, symbol: 'circle-open', line: { width: 2, color: '#f59e0b' } }, name: `x -> ${approach}` }
          ]}
          footer="Open circle shows the limit point (may differ from f(a))"
        />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Evaluating Limits"
          answer={limitVal !== null ? `\\lim_{x \\to ${approach}} f(x) = ${formatNumber(limitVal, 4)}` : '\\text{Limit DNE}'} />
        <ConceptCard color={color} title="Key Limit Laws" items={[
          'Sum: $\\lim [f + g] = L + M$',
          'Product: $\\lim [f \\cdot g] = L \\cdot M$',
          'Quotient: $\\lim f/g = L/M$ (if $M \\neq 0$)',
          'Power: $\\lim [f]^n = L^n$',
        ]} />
      </div>
    </div>
  )
}

// ─── 2. One-Sided Limits ──────────────────────────────────────────────────────
function OneSidedLimits({ color }) {
  const [expr, setExpr] = useState('abs(x)/x')
  const { xs: xs1, ys: ys1 } = useMemo(() => generatePoints(expr, -3, -0.01), [expr])
  const { xs: xs2, ys: ys2 } = useMemo(() => generatePoints(expr, 0.01, 3), [expr])
  const leftLimit = useMemo(() => evaluateExpression(expr, -0.0001), [expr])
  const rightLimit = useMemo(() => evaluateExpression(expr, 0.0001), [expr])
  const limitExists = leftLimit !== null && rightLimit !== null && Math.abs(leftLimit - rightLimit) < 0.01

  const steps = [
    { title: 'Left-Hand Limit (LHL)', text: 'Approach from the left: x → 0⁻', formula: `\\lim_{x \\to 0^-} f(x) = ${formatNumber(leftLimit)}` },
    { title: 'Right-Hand Limit (RHL)', text: 'Approach from the right: x → 0⁺', formula: `\\lim_{x \\to 0^+} f(x) = ${formatNumber(rightLimit)}` },
    {
      title: 'Two-Sided Limit Check', text: 'The two-sided limit exists only if LHL = RHL.',
      formula: limitExists
        ? `${formatNumber(leftLimit)} = ${formatNumber(rightLimit)} \\Rightarrow \\text{Limit exists} = ${formatNumber(leftLimit)}`
        : `${formatNumber(leftLimit)} \\neq ${formatNumber(rightLimit)} \\Rightarrow \\text{Limit DNE}`,
      note: limitExists ? 'The limit exists!' : 'LHL ≠ RHL → limit does NOT exist.'
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <SectionCard title="One-Sided Limit Explorer" color={color}>
          <CalcInput label="f(x)" value={expr} onChange={setExpr} hint="Try: abs(x)/x, sqrt(x), floor(x)" />
          <div className={styles.limitRow}>
            <div className={styles.limitBox} style={{ borderColor: '#06b6d4' }}>
              <span className={styles.limitLabel} style={{ color: '#06b6d4' }}>LHL (x → 0⁻)</span>
              <strong>{formatNumber(leftLimit)}</strong>
            </div>
            <div className={styles.limitBox} style={{ borderColor: '#ec4899' }}>
              <span className={styles.limitLabel} style={{ color: '#ec4899' }}>RHL (x → 0⁺)</span>
              <strong>{formatNumber(rightLimit)}</strong>
            </div>
          </div>
          <div className={styles.resultBox} style={{ borderColor: limitExists ? '#10b981' : '#ef4444', background: (limitExists ? '#10b981' : '#ef4444') + '14' }}>
            {limitExists ? `✓ Limit exists = ${formatNumber(leftLimit)}` : '✗ Limit DNE'}
          </div>
        </SectionCard>
        <GraphPanel title="One-Sided Approach" data={[
          { x: xs1, y: ys1, type: 'scatter', mode: 'lines', line: { color: '#06b6d4', width: 2.5 }, name: 'x → 0⁻' },
          { x: xs2, y: ys2, type: 'scatter', mode: 'lines', line: { color: '#ec4899', width: 2.5 }, name: 'x → 0⁺' },
        ]} footer="Blue = left approach, Pink = right approach" />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="One-Sided Limits" />
        <ConceptCard color={color} title="Existence Theorem" items={[
          'LHL: $\\lim_{x \\to a^-} f(x) = L$',
          'RHL: $\\lim_{x \\to a^+} f(x) = L$',
          'Two-sided limit exists iff LHL = RHL',
        ]} />
      </div>
    </div>
  )
}

// ─── 3. Infinite Limits ────────────────────────────────────────────────────────
function InfiniteLimits({ color }) {
  const [expr, setExpr] = useState('1/x^2')
  const { xs, ys } = useMemo(() => generatePoints(expr, -4, 4), [expr])
  const atZeroRight = useMemo(() => evaluateExpression(expr, 0.001), [expr])
  const asXInfinity = useMemo(() => evaluateExpression(expr, 1000), [expr])

  const steps = [
    { title: 'Vertical Asymptotes', text: 'Where the denominator = 0.', formula: '\\lim_{x \\to 0} \\frac{1}{x^2} = +\\infty', note: 'Denominator → 0 makes fraction blow up.' },
    { title: 'Horizontal Asymptotes', text: 'Limit as x → ±∞.', formula: '\\lim_{x \\to \\infty} \\frac{1}{x^2} = 0' },
    { title: 'End Behavior', formula: '\\frac{P(x)}{Q(x)}: \\text{ if } \\deg P < \\deg Q \\Rightarrow \\lim = 0' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <SectionCard title="Infinite Limits" color={color}>
          <CalcInput label="f(x)" value={expr} onChange={setExpr} />
          <div className={styles.limitRow}>
            <div className={styles.limitBox} style={{ borderColor: color }}>
              <span className={styles.limitLabel} style={{ color }}>f(x) as x→0⁺</span>
              <strong>{atZeroRight > 1e5 ? '+∞' : atZeroRight < -1e5 ? '-∞' : formatNumber(atZeroRight)}</strong>
            </div>
            <div className={styles.limitBox} style={{ borderColor: '#f59e0b' }}>
              <span className={styles.limitLabel} style={{ color: '#f59e0b' }}>f(x) as x→+∞</span>
              <strong>{Math.abs(asXInfinity) < 1e-3 ? '≈ 0' : formatNumber(asXInfinity)}</strong>
            </div>
          </div>
        </SectionCard>
        <GraphPanel title="Function with Asymptotes" data={[
          { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2 }, connectgaps: false, name: 'f(x)' },
        ]} layout={{ yaxis: { range: [-10, 10] } }} footer="Notice vertical and horizontal asymptotes" />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Limits at Infinity" />
        <ConceptCard color={color} title="Asymptote Rules" items={[
          'Vertical: denominator = 0',
          'Horizontal: $\\lim_{x\\to\\pm\\infty} f(x) = L$',
          'Oblique: when deg(P) = deg(Q) + 1',
        ]} />
      </div>
    </div>
  )
}

// ─── 4. L'Hôpital's Rule ─────────────────────────────────────────────────────
function LHopital({ color }) {
  const examples = [
    {
      label: 'sin(x)/x',
      num: 'sin(x)', den: 'x', a: 0,
      numDeriv: 'cos(x)', denDeriv: '1',
      formula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = \\lim_{x \\to 0} \\frac{\\cos x}{1} = 1',
    },
    {
      label: '(eˣ-1)/x',
      num: 'e^x - 1', den: 'x', a: 0,
      numDeriv: 'e^x', denDeriv: '1',
      formula: '\\lim_{x \\to 0} \\frac{e^x-1}{x} = \\lim_{x \\to 0} \\frac{e^x}{1} = 1',
    },
    {
      label: 'ln(x)/(x-1)',
      num: 'ln(x)', den: 'x - 1', a: 1,
      numDeriv: '1/x', denDeriv: '1',
      formula: '\\lim_{x \\to 1} \\frac{\\ln x}{x-1} = \\lim_{x \\to 1} \\frac{1/x}{1} = 1',
    }
  ]
  const [selected, setSelected] = useState(0)
  const ex = examples[selected]
  const { xs: xsN, ys: ysN } = useMemo(() => generatePoints(ex.num, -3, 5), [ex])
  const { xs: xsD, ys: ysD } = useMemo(() => generatePoints(ex.den, -3, 5), [ex])
  const composed = `(${ex.num})/(${ex.den})`
  const { xs: xsR, ys: ysR } = useMemo(() => generatePoints(composed, -3, 5), [composed])

  const steps = [
    { title: 'Verify Indeterminate Form', text: `At x = ${ex.a}: check that substitution gives 0/0 or ∞/∞.`, formula: `\\text{Direct substitution: } \\frac{0}{0}` },
    { title: "Apply L'Hôpital's Rule", text: "Differentiate numerator and denominator separately (NOT quotient rule).", formula: `\\lim_{x \\to ${ex.a}} \\frac{${ex.num}}{${ex.den}} = \\lim_{x \\to ${ex.a}} \\frac{(${ex.num})'}{(${ex.den})'}` },
    { title: 'Differentiate', formula: `= \\lim_{x \\to ${ex.a}} \\frac{${ex.numDeriv}}{${ex.denDeriv}}` },
    { title: 'Evaluate', formula: ex.formula }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <SectionCard title="Pick an Example" color={color}>
          <div className={styles.btnRow}>
            {examples.map((e, i) => (
              <button key={i} className={`${styles.exBtn} ${selected === i ? styles.exBtnActive : ''}`}
                onClick={() => setSelected(i)} style={{ '--btn-color': color }}>{e.label}</button>
            ))}
          </div>
          <div style={{ padding: '10px 0' }}><BlockMath math={ex.formula} /></div>
        </SectionCard>
        <GraphPanel title="Numerator, Denominator, Quotient" data={[
          { x: xsN, y: ysN, type: 'scatter', mode: 'lines', line: { color: '#06b6d4', width: 2 }, name: 'Numerator' },
          { x: xsD, y: ysD, type: 'scatter', mode: 'lines', line: { color: '#ec4899', width: 2 }, name: 'Denominator' },
          { x: xsR, y: ysR, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x)', connectgaps: false },
        ]} layout={{ yaxis: { range: [-5, 5] } }} footer={`Both num & denom → 0 as x → ${ex.a}`} />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="L'Hôpital's Rule" answer={ex.formula} />
        <ConceptCard color={color} title="L'Hôpital's Rule">
          <p>If substitution gives 0/0 or ∞/∞:</p>
          <div style={{ margin: '8px 0' }}>
            <BlockMath math="\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(240,240,255,0.5)' }}>Works only for 0/0, ∞/∞. Apply repeatedly if still indeterminate.</p>
        </ConceptCard>
      </div>
    </div>
  )
}

// ─── 5. Continuity ───────────────────────────────────────────────────────────
function Continuity({ color }) {
  const examples = [
    { label: 'Continuous', expr: 'x^2 - 2*x + 1', a: 2, continuous: true, type: 'continuous' },
    { label: 'Removable', expr: '(x^2-1)/(x-1)', a: 1, continuous: false, type: 'removable' },
    { label: 'Jump', expr: 'abs(x)/x', a: 0, continuous: false, type: 'jump' },
  ]
  const [sel, setSel] = useState(0)
  const ex = examples[sel]
  const { xs, ys } = useMemo(() => generatePoints(ex.expr, -3, 3), [ex])

  const steps = [
    { title: 'Check: f(a) is defined', formula: `f(${ex.a}) = ${formatNumber(evaluateExpression(ex.expr, ex.a))}` },
    {
      title: 'Check: Limit exists',
      formula: ex.type === 'removable'
        ? `\\lim_{x \\to ${ex.a}} \\frac{x^2-1}{x-1} = \\lim_{x \\to ${ex.a}} (x+1) = 2`
        : ex.type === 'jump'
        ? `\\lim_{x \\to 0^-} = -1 \\neq 1 = \\lim_{x \\to 0^+}`
        : `\\lim_{x \\to ${ex.a}} f(x) = ${formatNumber(evaluateExpression(ex.expr, ex.a))}`
    },
    {
      title: 'Check: f(a) = Limit',
      formula: ex.continuous
        ? `\\text{All conditions met} \\Rightarrow \\text{Continuous at } x = ${ex.a}`
        : `\\text{Condition failed} \\Rightarrow \\text{DISCONTINUOUS: ${ex.type}}`,
      note: ex.continuous ? 'Function is continuous!' : `This is a ${ex.type} discontinuity.`
    }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <SectionCard title="Continuity Types" color={color}>
          <div className={styles.btnRow}>
            {examples.map((e, i) => (
              <button key={i} className={`${styles.exBtn} ${sel === i ? styles.exBtnActive : ''}`}
                onClick={() => setSel(i)} style={{ '--btn-color': color }}>{e.label}</button>
            ))}
          </div>
          <div className={styles.resultBox} style={{
            borderColor: ex.continuous ? '#10b981' : '#ef4444',
            background: (ex.continuous ? '#10b981' : '#ef4444') + '14'
          }}>
            {ex.continuous ? `✓ Continuous at x = ${ex.a}` : `✗ ${ex.type} discontinuity at x = ${ex.a}`}
          </div>
        </SectionCard>
        <GraphPanel title="Function Graph" data={[
          { x: xs, y: ys, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, connectgaps: false }
        ]} footer="Observe where the function breaks continuity" />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Continuity Test" />
        <ConceptCard color={color} title="3 Conditions for Continuity" items={[
          '$f(a)$ is defined',
          '$\\lim_{x \\to a} f(x)$ exists',
          '$\\lim_{x \\to a} f(x) = f(a)$',
        ]}>
          <p style={{ marginTop: 10, fontSize: '0.85rem', color: 'rgba(240,240,255,0.5)' }}>
            IVT: If f is continuous on [a,b] and N is between f(a) and f(b), some c in (a,b) has f(c) = N.
          </p>
        </ConceptCard>
      </div>
    </div>
  )
}

// ─── 6. Squeeze Theorem ───────────────────────────────────────────────────────
function SqueezeTheorem({ color }) {
  const t = useMemo(() => {
    const xs = [], ys_low = [], ys_f = [], ys_high = []
    for (let x = -2; x <= 2; x += 0.02) {
      xs.push(x)
      ys_low.push(-x * x)
      ys_f.push(x === 0 ? 0 : x * x * Math.sin(1 / x))
      ys_high.push(x * x)
    }
    return { xs, ys_low, ys_f, ys_high }
  }, [])

  const steps = [
    { title: 'Set Up the Inequality', text: 'Find g(x) ≤ f(x) ≤ h(x) near x = 0.',
      formula: '-x^2 \\leq x^2\\sin\\left(\\frac{1}{x}\\right) \\leq x^2', note: 'Since |sin(θ)| ≤ 1.' },
    { title: 'Limits of Bounds', formula: '\\lim_{x \\to 0} (-x^2) = 0 \\quad \\text{and} \\quad \\lim_{x \\to 0} x^2 = 0' },
    { title: 'Apply Squeeze Theorem', formula: '\\lim_{x \\to 0} x^2\\sin\\left(\\frac{1}{x}\\right) = 0' }
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <GraphPanel title="Squeeze Theorem Visualized" data={[
          { x: t.xs, y: t.ys_low, type: 'scatter', mode: 'lines', line: { color: '#06b6d4', width: 2, dash: 'dash' }, name: 'g(x) = -x²' },
          { x: t.xs, y: t.ys_high, type: 'scatter', mode: 'lines', line: { color: '#ec4899', width: 2, dash: 'dash' }, name: 'h(x) = x²' },
          { x: t.xs, y: t.ys_f, type: 'scatter', mode: 'lines', line: { color, width: 2.5 }, name: 'f(x) = x²sin(1/x)' },
        ]} layout={{ yaxis: { range: [-1, 1] } }} height={380} footer="f(x) is squeezed between -x² and x², both → 0" />
      </div>
      <div className={styles.right}>
        <StepByStep steps={steps} color={color} title="Squeeze Theorem"
          answer="\\lim_{x \\to 0} x^2\\sin\\left(\\frac{1}{x}\\right) = 0" />
        <ConceptCard color={color} title="Squeeze Theorem">
          <p>If <strong>g(x) ≤ f(x) ≤ h(x)</strong> near x = a, and</p>
          <div style={{ margin: '8px 0' }}>
            <BlockMath math="\lim_{x\to a} g(x) = \lim_{x\to a} h(x) = L" />
          </div>
          <p>then</p>
          <BlockMath math="\lim_{x\to a} f(x) = L" />
          <p style={{ marginTop: 8, fontSize: '0.85rem', color: 'rgba(240,240,255,0.5)' }}>
            Classic: lim sin(x)/x = 1 as x→0
          </p>
        </ConceptCard>
      </div>
    </div>
  )
}

// ─── Shared Card Component ────────────────────────────────────────────────────
function SectionCard({ title, children, color }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBar} style={{ background: color }} />
      <h4 className={styles.cardTitle}>{title}</h4>
      <div className={styles.cardBody}>{children}</div>
    </div>
  )
}
