import * as math from 'mathjs'

const nc = (expected) => (input) => {
  try {
    const val = +math.evaluate(String(input).trim())
    if (!isFinite(val)) return false
    return Math.abs(val - expected) <= Math.max(0.01, Math.abs(expected) * 0.01)
  } catch { return false }
}

const rng = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = arr => arr[Math.floor(Math.random() * arr.length)]
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
const simplify = (n, d) => { const g = gcd(Math.abs(n), Math.abs(d)); return [n / g, d / g] }
const frac = (n, d) => {
  const [sn, sd] = simplify(n, d)
  return sd === 1 ? `${sn}` : `\\dfrac{${sn}}{${sd}}`
}
const fracVal = (n, d) => n / d

// ─── LIMITS ─────────────────────────────────────────────────────────────────

const limGens = [
  // H1. lim(x→0) (e^(ax) - e^(bx))/x = a - b  [L'Hôpital once]
  () => {
    const a = rng(2, 6)
    const b = rng(1, a - 1)
    const ans = a - b
    return {
      id: `lim_expab_${a}_${b}`,
      question: "Evaluate the limit (exact value)",
      latex: `\\lim_{x \\to 0} \\frac{e^{${a}x} - e^{${b}x}}{x}`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: "0/0 form — apply L'Hôpital's Rule", formula: `\\lim_{x\\to 0}\\frac{${a}e^{${a}x} - ${b}e^{${b}x}}{1}` },
        { title: "Evaluate at x = 0", formula: `${a}\\cdot e^0 - ${b}\\cdot e^0 = ${a} - ${b} = ${ans}` },
      ],
    }
  },

  // H2. lim(x→0) (tan(ax) - sin(ax))/x³ = a³/2
  () => {
    const a = rng(1, 4)
    const ans = (a ** 3) / 2
    return {
      id: `lim_tansin_${a}`,
      question: "Factor and apply known limits to evaluate",
      latex: `\\lim_{x \\to 0} \\frac{\\tan(${a}x) - \\sin(${a}x)}{x^3}`,
      answerLatex: frac(a ** 3, 2),
      check: nc(ans),
      hints: [
        { title: "Factor sin(ax) from the numerator", formula: `\\frac{\\sin(${a}x)(1 - \\cos(${a}x))}{x^3 \\cos(${a}x)}` },
        { title: "Split into three known limits", formula: `\\frac{\\sin(${a}x)}{${a}x} \\cdot \\frac{1-\\cos(${a}x)}{(${a}x)^2} \\cdot \\frac{${a}^3}{\\cos(${a}x)}` },
        { title: "Apply the limits (sinc→1, (1-cos)/u²→½, cos→1)", formula: `1 \\cdot \\frac{1}{2} \\cdot ${a ** 3} = ${frac(a ** 3, 2)}` },
      ],
    }
  },

  // H3. lim(x→∞) x(√(1 + a/x) - 1) = a/2  [binomial / conjugate]
  () => {
    const a = pick([2, 4, 6, 8, 10])
    const ans = a / 2
    return {
      id: `lim_sqrtinf_${a}`,
      question: "Evaluate using the conjugate or binomial approximation",
      latex: `\\lim_{x \\to \\infty} x\\!\\left(\\sqrt{1 + \\frac{${a}}{x}} - 1\\right)`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: "Multiply by the conjugate", formula: `x \\cdot \\frac{(${a}/x)}{\\sqrt{1+${a}/x}+1}` },
        { title: "As x → ∞, the radical → 1", formula: `\\frac{${a}}{\\sqrt{1+0}+1} = \\frac{${a}}{2} = ${ans}` },
      ],
    }
  },

  // 1. Difference quotient definition of derivative: lim(x→a) (x^n - a^n)/(x-a) = n·a^(n-1)
  () => {
    const a = pick([-3, -2, -1, 1, 2, 3])
    const n = rng(2, 5)
    const ans = n * Math.pow(a, n - 1)
    const aStr = a < 0 ? `(${a})` : `${a}`
    return {
      id: `lim_poly_${a}_${n}`,
      question: 'Evaluate the limit (exact value)',
      latex: `\\lim_{x \\to ${a}} \\frac{x^{${n}} - ${aStr}^{${n}}}{x - ${a}}`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Recognize the derivative definition', body: `This matches f'(a) where f(x) = x^${n}. The limit \\(\\lim_{x\\to a}\\frac{f(x)-f(a)}{x-a}\\) equals f'(a).` },
        { title: 'Apply the power rule', formula: `\\frac{d}{dx}x^{${n}}\\bigg|_{x=${a}} = ${n} \\cdot ${aStr}^{${n-1}}` },
        { title: 'Compute the answer', formula: `${n} \\cdot ${aStr}^{${n-1}} = ${ans}` },
      ],
    }
  },

  // 2. Standard sinc limit: lim(x→0) sin(ax)/(bx) = a/b
  () => {
    const a = rng(2, 7)
    const b = rng(1, 6)
    const ans = a / b
    return {
      id: `lim_sinc_${a}_${b}`,
      question: 'Evaluate the limit',
      latex: `\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${b}x}`,
      answerLatex: frac(a, b),
      check: nc(ans),
      hints: [
        { title: 'Use the fundamental trigonometric limit', formula: `\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1` },
        { title: 'Rewrite to expose that pattern', formula: `\\frac{\\sin(${a}x)}{${b}x} = \\frac{${a}}{${b}} \\cdot \\frac{\\sin(${a}x)}{${a}x}` },
        { title: 'Apply the limit', formula: `\\frac{${a}}{${b}} \\cdot 1 = ${frac(a, b)}` },
      ],
    }
  },

  // 3. Exponential: lim(x→0) (e^(ax) - 1)/(bx) = a/b
  () => {
    const a = rng(1, 6)
    const b = rng(1, 5)
    const ans = a / b
    return {
      id: `lim_exp_${a}_${b}`,
      question: 'Evaluate the limit',
      latex: `\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{${b}x}`,
      answerLatex: frac(a, b),
      check: nc(ans),
      hints: [
        { title: "Indeterminate form 0/0 — use L'Hôpital's Rule", body: 'Both numerator and denominator → 0.' },
        { title: "Differentiate top and bottom", formula: `\\lim_{x\\to 0} \\frac{${a}e^{${a}x}}{${b}}` },
        { title: 'Evaluate at x = 0', formula: `\\frac{${a} \\cdot e^0}{${b}} = ${frac(a, b)}` },
      ],
    }
  },

  // 4. Limit at infinity (rational): lim(x→∞) (ax²+bx)/(cx²+d) = a/c
  () => {
    const a = rng(1, 6)
    const b = rng(1, 9)
    const c = rng(1, 6)
    const d = rng(1, 9)
    const ans = a / c
    return {
      id: `lim_inf_${a}_${b}_${c}_${d}`,
      question: 'Evaluate the limit as x → ∞',
      latex: `\\lim_{x \\to \\infty} \\frac{${a}x^2 + ${b}x}{${c}x^2 + ${d}}`,
      answerLatex: frac(a, c),
      check: nc(ans),
      hints: [
        { title: 'Divide every term by the highest power x²', formula: `\\frac{${a} + ${b}/x}{${c} + ${d}/x^2}` },
        { title: 'All terms with x in the denominator → 0', formula: `\\frac{${a} + 0}{${c} + 0} = ${frac(a, c)}` },
      ],
    }
  },

  // 5. Taylor: lim(x→0) (1 - cos(ax))/(bx²) = a²/(2b)
  () => {
    const a = rng(1, 5)
    const b = rng(1, 4)
    const ans = (a * a) / (2 * b)
    return {
      id: `lim_cos_${a}_${b}`,
      question: 'Evaluate the limit using Taylor series',
      latex: `\\lim_{x \\to 0} \\frac{1 - \\cos(${a}x)}{${b}x^2}`,
      answerLatex: frac(a * a, 2 * b),
      check: nc(ans),
      hints: [
        { title: 'Expand cosine with its Maclaurin series', formula: `\\cos(${a}x) = 1 - \\frac{${a*a}x^2}{2} + \\frac{${a**4}x^4}{24} - \\cdots` },
        { title: 'Substitute into the limit', formula: `\\frac{1 - \\left(1 - \\dfrac{${a*a}x^2}{2} + \\cdots\\right)}{${b}x^2} = \\frac{${a*a}x^2/2 + \\cdots}{${b}x^2}` },
        { title: 'Cancel x² and take the limit', formula: `\\frac{${a*a}/2}{${b}} = ${frac(a * a, 2 * b)}` },
      ],
    }
  },

  // 6. Squeeze / growth: lim(x→∞) (ln x)/x^a = 0 (for a>0) — ask for the value
  () => {
    const a = rng(1, 3)
    const aLabel = a === 1 ? 'x' : `x^{${a}}`
    return {
      id: `lim_logpow_${a}`,
      question: 'Evaluate the limit (exact value)',
      latex: `\\lim_{x \\to \\infty} \\frac{\\ln x}{${aLabel}}`,
      answerLatex: '0',
      check: nc(0),
      hints: [
        { title: 'Indeterminate form ∞/∞', body: `Both numerator and denominator → ∞.` },
        { title: "Apply L'Hôpital's Rule", formula: `\\lim_{x\\to\\infty} \\frac{1/x}{${a}x^{${a-1}}} = \\lim_{x\\to\\infty} \\frac{1}{${a}x^{${a}}}` },
        { title: 'As x → ∞ the fraction → 0', formula: `\\lim_{x\\to\\infty} \\frac{1}{${a}x^{${a}}} = 0` },
      ],
    }
  },
]

// ─── DERIVATIVES ─────────────────────────────────────────────────────────────

const derivGens = [
  // H1. arctan chain rule: f(x) = arctan(ax), f'(1/a) = a/2
  () => {
    const a = rng(1, 5)
    const ans = a / 2
    return {
      id: `deriv_arctan_${a}`,
      question: `Find f'(1/${a})`,
      latex: `f(x) = \\arctan(${a}x)`,
      answerLatex: frac(a, 2),
      check: nc(ans),
      hints: [
        { title: "Chain rule: d/dx[arctan(u)] = u'/(1+u²)", formula: `f'(x) = \\frac{${a}}{1 + ${a ** 2}x^2}` },
        { title: `Substitute x = 1/${a}`, formula: `f'\\!\\left(\\tfrac{1}{${a}}\\right) = \\frac{${a}}{1 + ${a ** 2}\\cdot\\frac{1}{${a ** 2}}} = \\frac{${a}}{2}` },
      ],
    }
  },

  // H2. Product + chain: f(x) = e^(ax)sin(bx), f'(0) = b
  () => {
    const a = rng(1, 4)
    const b = rng(1, 5)
    const ans = b
    return {
      id: `deriv_expsin_${a}_${b}`,
      question: `Find f'(0)`,
      latex: `f(x) = e^{${a}x}\\sin(${b}x)`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: "Product rule + chain rule", formula: `f'(x) = ${a}e^{${a}x}\\sin(${b}x) + ${b}e^{${a}x}\\cos(${b}x)` },
        { title: "Evaluate at x = 0 (sin 0 = 0, cos 0 = 1, e⁰ = 1)", formula: `f'(0) = ${a}\\cdot 0 + ${b}\\cdot 1 = ${b}` },
      ],
    }
  },

  // H3. Logarithmic chain: f(x) = ln(x² + a²), f'(k) = 2k/(k²+a²)
  () => {
    const a = rng(1, 4)
    const k = rng(1, 4)
    const num = 2 * k
    const den = k * k + a * a
    const [sn, sd] = simplify(num, den)
    const ans = num / den
    return {
      id: `deriv_lnchain_${a}_${k}`,
      question: `Find f'(${k})`,
      latex: `f(x) = \\ln(x^2 + ${a * a})`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: "Chain rule: d/dx[ln u] = u'/u", formula: `f'(x) = \\frac{2x}{x^2 + ${a * a}}` },
        { title: `Substitute x = ${k}`, formula: `f'(${k}) = \\frac{${num}}{${k * k} + ${a * a}} = ${frac(sn, sd)}` },
      ],
    }
  },

  // 1. Polynomial derivative at a point
  () => {
    const a = rng(1, 4)
    const n = rng(3, 6)
    const b = rng(1, 4)
    const m = rng(1, 2)
    const k = pick([-2, -1, 1, 2])
    const ans = a * n * Math.pow(k, n - 1) + b * m * Math.pow(k, m - 1)
    const kStr = k < 0 ? `(${k})` : `${k}`
    return {
      id: `deriv_poly_${a}_${n}_${b}_${m}_${k}`,
      question: `Find f'(${k}) for the function below`,
      latex: `f(x) = ${a}x^{${n}} + ${b}x^{${m}}`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Differentiate term by term (power rule)', formula: `f'(x) = ${a*n}x^{${n-1}} + ${b*m}x^{${m-1}}` },
        { title: `Substitute x = ${k}`, formula: `f'(${k}) = ${a*n}\\cdot ${kStr}^{${n-1}} + ${b*m}\\cdot ${kStr}^{${m-1}} = ${ans}` },
      ],
    }
  },

  // 2. Chain rule: f(x) = (ax+b)^n, find f'(k)
  () => {
    const a = rng(1, 3)
    const b = rng(0, 4)
    const n = rng(3, 6)
    const k = rng(0, 2)
    const inner = a * k + b
    const ans = n * a * Math.pow(inner, n - 1)
    return {
      id: `deriv_chain_${a}_${b}_${n}_${k}`,
      question: `Find f'(${k})`,
      latex: `f(x) = (${a}x + ${b})^{${n}}`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Apply the chain rule', formula: `f'(x) = ${n}(${a}x+${b})^{${n-1}} \\cdot ${a} = ${n*a}(${a}x+${b})^{${n-1}}` },
        { title: `Substitute x = ${k}`, formula: `f'(${k}) = ${n*a} \\cdot (${inner})^{${n-1}} = ${ans}` },
      ],
    }
  },

  // 3. Exponential derivative at a point: f(x) = e^(ax+b), f'(k) = a·e^(ak+b)
  () => {
    const a = rng(1, 3)
    const b = rng(0, 2)
    const k = rng(0, 1)
    const exp = a * k + b
    const ans = a * Math.exp(exp)
    return {
      id: `deriv_exp_${a}_${b}_${k}`,
      question: `Find f'(${k})`,
      latex: `f(x) = e^{${a}x + ${b}}`,
      answerLatex: exp === 1 ? `${a}e` : exp === 0 ? `${a}` : `${a}e^{${exp}}`,
      check: nc(ans),
      hints: [
        { title: 'Differentiate using the chain rule', formula: `f'(x) = ${a}e^{${a}x+${b}}` },
        { title: `Evaluate at x = ${k}`, formula: `f'(${k}) = ${a}e^{${exp}}` },
      ],
    }
  },

  // 4. Implicit differentiation: x² + y² = r², find dy/dx at (x₀,y₀) = -x₀/y₀
  () => {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]]
    const [x0, y0, r] = pick(triples)
    const [sn, sd] = simplify(-x0, y0)
    const ans = -x0 / y0
    return {
      id: `deriv_implicit_${x0}_${y0}`,
      question: `Given the circle x² + y² = ${r*r}, find dy/dx at the point (${x0}, ${y0})`,
      latex: `x^2 + y^2 = ${r*r}`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Differentiate both sides implicitly', formula: `2x + 2y\\,\\frac{dy}{dx} = 0` },
        { title: 'Solve for dy/dx', formula: `\\frac{dy}{dx} = -\\frac{x}{y}` },
        { title: `Substitute the point (${x0}, ${y0})`, formula: `\\frac{dy}{dx} = -\\frac{${x0}}{${y0}} = ${frac(sn, sd)}` },
      ],
    }
  },

  // 5. Product + log: f(x) = x^n · ln(x), find f'(e) = e^(n-1)·(n+1)
  () => {
    const n = rng(2, 5)
    const ans = Math.pow(Math.E, n - 1) * (n + 1)
    return {
      id: `deriv_xnlnx_${n}`,
      question: `Find f'(e)`,
      latex: `f(x) = x^{${n}} \\ln x`,
      answerLatex: n === 2 ? `3e` : `${n+1}e^{${n-1}}`,
      check: nc(ans),
      hints: [
        { title: 'Apply the product rule', formula: `f'(x) = ${n}x^{${n-1}} \\ln x + x^{${n}} \\cdot \\frac{1}{x} = ${n}x^{${n-1}}\\ln x + x^{${n-1}}` },
        { title: 'Factor out x^(n−1)', formula: `f'(x) = x^{${n-1}}(${n}\\ln x + 1)` },
        { title: 'Substitute x = e (recall ln e = 1)', formula: `f'(e) = e^{${n-1}}(${n} \\cdot 1 + 1) = ${n+1}e^{${n-1}}` },
      ],
    }
  },

  // 6. Quotient rule: f(x) = (ax+b)/(cx+d), find f'(k)
  () => {
    const a = rng(1, 4), b = rng(1, 4), c = rng(1, 3), d = rng(1, 4)
    const k = rng(0, 2)
    // f'(x) = (a(cx+d) - c(ax+b))/(cx+d)² = (ad-bc)/(cx+d)²
    const num = a * d - b * c
    const den = Math.pow(c * k + d, 2)
    const ans = num / den
    return {
      id: `deriv_quot_${a}_${b}_${c}_${d}_${k}`,
      question: `Find f'(${k})`,
      latex: `f(x) = \\frac{${a}x + ${b}}{${c}x + ${d}}`,
      answerLatex: frac(num, den),
      check: nc(ans),
      hints: [
        { title: 'Apply the quotient rule', formula: `f'(x) = \\frac{${a}(${c}x+${d}) - ${c}(${a}x+${b})}{(${c}x+${d})^2}` },
        { title: 'Simplify the numerator', formula: `\\text{Numerator} = ${a*d} - ${b*c} = ${num}` },
        { title: `Evaluate at x = ${k}`, formula: `f'(${k}) = \\frac{${num}}{(${c*k+d})^2} = ${frac(num, den)}` },
      ],
    }
  },
]

// ─── APPLIED DERIVATIVES ─────────────────────────────────────────────────────

const appDerivGens = [
  // H1. Second derivative at a point: f(x) = ax⁴ + bx³, f''(k)
  () => {
    const a = rng(1, 3)
    const b = rng(1, 4)
    const k = pick([-1, 0, 1, 2])
    const ans = 12 * a * k * k + 6 * b * k
    return {
      id: `appd_second_${a}_${b}_${k}`,
      question: `Find f''(${k})`,
      latex: `f(x) = ${a}x^4 + ${b}x^3`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: "Differentiate twice using the power rule", formula: `f'(x) = ${4 * a}x^3 + ${3 * b}x^2, \\quad f''(x) = ${12 * a}x^2 + ${6 * b}x` },
        { title: `Substitute x = ${k}`, formula: `f''(${k}) = ${12 * a}(${k})^2 + ${6 * b}(${k}) = ${ans}` },
      ],
    }
  },

  // H2. Optimization — closed box with square base: minimize SA given volume V
  () => {
    const cases = [[8, 2], [27, 3], [64, 4], [125, 5]]
    const [V, side] = pick(cases)
    return {
      id: `appd_box_${V}`,
      question: `A closed box with a square base has volume ${V} cm³. Find the side length of the base that minimizes total surface area`,
      latex: `V = l^2 h = ${V},\\quad S = 2l^2 + 4lh`,
      answerLatex: `${side}`,
      check: nc(side),
      hints: [
        { title: "Express h in terms of l using the volume constraint", formula: `h = \\frac{${V}}{l^2}` },
        { title: "Substitute into S and differentiate", formula: `S(l) = 2l^2 + \\frac{${4 * V}}{l}, \\quad S'(l) = 4l - \\frac{${4 * V}}{l^2}` },
        { title: "Set S'(l) = 0 and solve", formula: `l^3 = ${V} \\implies l = ${side}` },
      ],
    }
  },

  // H3. Related rates — ladder sliding down wall
  () => {
    const scenarios = [
      { L: 5, x: 3, y: 4 }, { L: 5, x: 4, y: 3 },
      { L: 13, x: 5, y: 12 }, { L: 13, x: 12, y: 5 },
      { L: 17, x: 8, y: 15 },
    ]
    const { L, x, y } = pick(scenarios)
    const k = rng(1, 3)
    const [sn, sd] = simplify(-x * k, y)
    const ans = (-x * k) / y
    return {
      id: `appd_ladder_${L}_${x}_${k}`,
      question: `A ${L} ft ladder leans against a wall. Its base slides away at ${k} ft/s. Find the rate at which the top is sliding when the base is ${x} ft from the wall (negative = sliding down)`,
      latex: `x^2 + y^2 = ${L * L},\\quad \\frac{dx}{dt} = ${k}\\text{ ft/s}`,
      answerLatex: `${frac(sn, sd)}\\text{ ft/s}`,
      check: nc(ans),
      hints: [
        { title: "Differentiate x² + y² = L² implicitly with respect to t", formula: `2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0` },
        { title: "Solve for dy/dt", formula: `\\frac{dy}{dt} = -\\frac{x}{y}\\cdot\\frac{dx}{dt}` },
        { title: `Substitute x = ${x}, y = ${y}, dx/dt = ${k}`, formula: `\\frac{dy}{dt} = -\\frac{${x}}{${y}}\\cdot ${k} = ${frac(sn, sd)}\\text{ ft/s}` },
      ],
    }
  },

  // 1. Local max/min: f(x) = x³ - 3a²x, local max at x = -a
  () => {
    const a = rng(1, 5)
    const ans = -a
    return {
      id: `appd_critpts_${a}`,
      question: `Find the x-coordinate of the local maximum of the function`,
      latex: `f(x) = x^3 - ${3*a*a}x`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Set the derivative equal to zero', formula: `f'(x) = 3x^2 - ${3*a*a} = 0` },
        { title: 'Solve for x', formula: `x^2 = ${a*a} \\implies x = \\pm ${a}` },
        { title: 'Classify using the second derivative test', body: `f''(x) = 6x. At x = -${a}: f''(-${a}) = -${6*a} < 0 → local maximum.`, formula: `x = -${a}` },
      ],
    }
  },

  // 2. Optimization: max area of rectangle with perimeter 4a → a²
  () => {
    const a = pick([3, 4, 5, 6, 8, 10])
    const ans = a * a
    return {
      id: `appd_rect_${a}`,
      question: `A rectangle has perimeter ${4*a} cm. Find the maximum possible area (in cm²)`,
      latex: `P = ${4*a}\\text{ cm}`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Set up variables', body: `Let the dimensions be x and y, with 2x + 2y = ${4*a}, so y = ${2*a} - x.` },
        { title: 'Write area as a function of one variable', formula: `A(x) = x(${2*a} - x) = ${2*a}x - x^2` },
        { title: "Maximize: set A'(x) = 0", formula: `A'(x) = ${2*a} - 2x = 0 \\implies x = ${a}` },
        { title: 'Compute the maximum area', formula: `A(${a}) = ${a} \\times ${a} = ${ans}` },
      ],
    }
  },

  // 3. Mean Value Theorem: f(x) = x² on [0,a], find c → a/2
  () => {
    const a = pick([2, 4, 6, 8])
    const ans = a / 2
    return {
      id: `appd_mvt_${a}`,
      question: `By the Mean Value Theorem, find c ∈ (0, ${a}) such that f'(c) equals the average rate of change`,
      latex: `f(x) = x^2 \\quad \\text{on } [0,\\, ${a}]`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Compute the average rate of change', formula: `\\frac{f(${a}) - f(0)}{${a} - 0} = \\frac{${a*a}}{${a}} = ${a}` },
        { title: "Set f'(c) equal to that value", formula: `f'(c) = 2c = ${a}` },
        { title: 'Solve for c', formula: `c = ${ans}` },
      ],
    }
  },

  // 4. Related rates: circle expanding — rate of area increase
  () => {
    const R = rng(2, 8)
    const k = rng(1, 4)
    const ans = 2 * Math.PI * R * k
    return {
      id: `appd_rr_circle_${R}_${k}`,
      question: `A circle's radius expands at ${k} cm/s. Find the rate of change of area (in cm²/s) when r = ${R} cm`,
      latex: `A = \\pi r^2,\\quad \\frac{dr}{dt} = ${k}`,
      answerLatex: `${2*R*k}\\pi`,
      check: nc(ans),
      hints: [
        { title: 'Differentiate A = πr² with respect to time', formula: `\\frac{dA}{dt} = 2\\pi r \\frac{dr}{dt}` },
        { title: `Substitute r = ${R} and dr/dt = ${k}`, formula: `\\frac{dA}{dt} = 2\\pi (${R})(${k}) = ${2*R*k}\\pi` },
      ],
    }
  },

  // 5. Tangent line: slope of y = √x at x = a
  () => {
    const a = pick([1, 4, 9, 16, 25])
    const ans = 1 / (2 * Math.sqrt(a))
    const [sn, sd] = simplify(1, 2 * Math.sqrt(a))
    return {
      id: `appd_sqrt_slope_${a}`,
      question: `Find the slope of the tangent line to y = √x at the point (${a}, ${Math.sqrt(a)})`,
      latex: `y = \\sqrt{x}`,
      answerLatex: frac(1, 2 * Math.sqrt(a)),
      check: nc(ans),
      hints: [
        { title: 'Differentiate using the power rule', formula: `y' = \\frac{1}{2\\sqrt{x}}` },
        { title: `Substitute x = ${a}`, formula: `y'(${a}) = \\frac{1}{2\\sqrt{${a}}} = \\frac{1}{${2*Math.sqrt(a)}}` },
      ],
    }
  },

  // 6. Linear approximation: f(x)=√x near x=a, approximate f(a+h)
  () => {
    const pairs = [[4, 0.4], [9, 0.9], [16, 0.8], [25, 0.5], [4, 1], [9, 3]]
    const [a, h] = pick(pairs)
    const ans = Math.sqrt(a) + h / (2 * Math.sqrt(a))
    return {
      id: `appd_linapp_${a}_${h}`,
      question: `Use a linear approximation to estimate √${a + h}`,
      latex: `f(x) = \\sqrt{x}\\quad\\text{near }x=${a}`,
      answerLatex: `${Math.sqrt(a)} + \\dfrac{${h}}{${2*Math.sqrt(a)}} = ${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Write the linearization L(x) = f(a) + f\'(a)(x-a)', formula: `f(${a}) = ${Math.sqrt(a)},\\quad f'(${a}) = \\frac{1}{${2*Math.sqrt(a)}}` },
        { title: `Evaluate L(${a + h})`, formula: `L(${a+h}) = ${Math.sqrt(a)} + \\frac{1}{${2*Math.sqrt(a)}} \\cdot ${h} = ${ans}` },
      ],
    }
  },
]

// ─── INTEGRALS ───────────────────────────────────────────────────────────────

const integralGens = [
  // H1. Odd-power sine: ∫₀^(π/2) sin^(2k+1)(x) dx  [reduction via sin²=1-cos²]
  () => {
    const cases = [
      { n: 3, num: 2, den: 3 },
      { n: 5, num: 8, den: 15 },
    ]
    const { n, num, den } = pick(cases)
    const ans = num / den
    const kSteps = n === 3
      ? `\\int_0^1(1-u^2)\\,du = \\left[u-\\tfrac{u^3}{3}\\right]_0^1 = \\tfrac{2}{3}`
      : `\\int_0^1(1-2u^2+u^4)\\,du = 1-\\tfrac{2}{3}+\\tfrac{1}{5} = \\tfrac{8}{15}`
    return {
      id: `int_sinpow_${n}`,
      question: `Evaluate using the identity sin²x = 1 − cos²x`,
      latex: `\\int_0^{\\pi/2} \\sin^{${n}} x\\,dx`,
      answerLatex: frac(num, den),
      check: nc(ans),
      hints: [
        { title: `Factor out sin x: sin^${n}x = sin^${n - 2}x · sin x`, formula: `\\int_0^{\\pi/2}(1-\\cos^2 x)^{${(n - 1) / 2}}\\sin x\\,dx` },
        { title: "Substitute u = cos x, bounds [0,1] → [1,0], flip sign", formula: `\\int_0^1(1-u^2)^{${(n - 1) / 2}}\\,du` },
        { title: "Expand and integrate", formula: kSteps },
      ],
    }
  },

  // H2. IBP twice: ∫₀^1 x² e^x dx = e − 2
  () => {
    const ans = Math.E - 2
    return {
      id: `int_x2ex`,
      question: "Evaluate using integration by parts twice",
      latex: `\\int_0^1 x^2 e^x\\,dx`,
      answerLatex: `e - 2`,
      check: nc(ans),
      hints: [
        { title: "First IBP: u = x², dv = eˣ dx", formula: `\\left[x^2 e^x\\right]_0^1 - 2\\int_0^1 x e^x\\,dx = e - 2\\int_0^1 xe^x\\,dx` },
        { title: "Second IBP: u = x, dv = eˣ dx", formula: `\\int_0^1 xe^x\\,dx = \\left[xe^x - e^x\\right]_0^1 = (e-e)-(-1) = 1` },
        { title: "Combine", formula: `e - 2(1) = e - 2` },
      ],
    }
  },

  // H3. IBP with logarithm: ∫₀^1 x ln(x) dx = −1/4
  () => {
    return {
      id: `int_xlnx`,
      question: "Evaluate using integration by parts (handle the boundary carefully)",
      latex: `\\int_0^1 x \\ln x\\,dx`,
      answerLatex: `-\\dfrac{1}{4}`,
      check: nc(-0.25),
      hints: [
        { title: "IBP: u = ln x, dv = x dx  →  du = dx/x, v = x²/2", formula: `\\left[\\frac{x^2}{2}\\ln x\\right]_0^1 - \\int_0^1\\frac{x}{2}\\,dx` },
        { title: "Boundary: lim_{x→0⁺} x² ln x = 0 (L'Hôpital); upper limit = 0", formula: `0 - 0 - \\frac{1}{2}\\left[\\frac{x^2}{2}\\right]_0^1 = -\\frac{1}{4}` },
      ],
    }
  },

  // 1. Power rule definite integral
  () => {
    const n = rng(1, 5)
    const a = rng(0, 1)
    const b = rng(2, 5)
    const ans = (Math.pow(b, n + 1) - Math.pow(a, n + 1)) / (n + 1)
    return {
      id: `int_power_${n}_${a}_${b}`,
      question: 'Evaluate the definite integral',
      latex: `\\int_{${a}}^{${b}} x^{${n}}\\,dx`,
      answerLatex: frac(Math.pow(b, n+1) - Math.pow(a, n+1), n+1),
      check: nc(ans),
      hints: [
        { title: 'Apply the power rule for integrals', formula: `\\int x^{${n}}\\,dx = \\frac{x^{${n+1}}}{${n+1}} + C` },
        { title: 'Evaluate at the bounds', formula: `\\left[\\frac{x^{${n+1}}}{${n+1}}\\right]_{${a}}^{${b}} = \\frac{${Math.pow(b,n+1)}}{${n+1}} - \\frac{${Math.pow(a,n+1)}}{${n+1}}` },
        { title: 'Simplify', formula: `= ${frac(Math.pow(b,n+1)-Math.pow(a,n+1), n+1)}` },
      ],
    }
  },

  // 2. Exponential integral: ∫₀^a e^(cx) dx = (e^(ca)-1)/c
  () => {
    const c = rng(1, 3)
    const a = rng(1, 2)
    const ans = (Math.exp(c * a) - 1) / c
    const expLabel = c * a === 1 ? 'e' : `e^{${c*a}}`
    return {
      id: `int_exp_${c}_${a}`,
      question: 'Evaluate the definite integral',
      latex: `\\int_{0}^{${a}} e^{${c}x}\\,dx`,
      answerLatex: c === 1 ? `${expLabel} - 1` : `\\dfrac{${expLabel} - 1}{${c}}`,
      check: nc(ans),
      hints: [
        { title: 'Integrate: ∫e^(cx) dx = e^(cx)/c', formula: `\\left[\\frac{e^{${c}x}}{${c}}\\right]_0^{${a}}` },
        { title: 'Evaluate at bounds', formula: `\\frac{e^{${c*a}}}{${c}} - \\frac{1}{${c}} = \\frac{${expLabel}-1}{${c}}` },
      ],
    }
  },

  // 3. Trig integral: ∫₀^(π/a) sin(ax) dx = 2/a
  () => {
    const a = rng(1, 4)
    const ans = 2 / a
    return {
      id: `int_sin_${a}`,
      question: 'Evaluate the definite integral',
      latex: `\\int_{0}^{\\pi/${a}} \\sin(${a}x)\\,dx`,
      answerLatex: frac(2, a),
      check: nc(ans),
      hints: [
        { title: 'Integrate: ∫sin(ax) dx = -cos(ax)/a', formula: `\\left[-\\frac{\\cos(${a}x)}{${a}}\\right]_0^{\\pi/${a}}` },
        { title: 'Apply bounds (cos(π) = -1, cos(0) = 1)', formula: `\\frac{-\\cos(\\pi)}{${a}} - \\frac{-\\cos(0)}{${a}} = \\frac{1}{${a}} + \\frac{1}{${a}} = ${frac(2,a)}` },
      ],
    }
  },

  // 4. u-substitution: ∫₀^1 2ax·e^(ax²) dx = e^a - 1
  () => {
    const a = rng(1, 4)
    const ans = Math.exp(a) - 1
    const expLabel = a === 1 ? 'e' : `e^{${a}}`
    return {
      id: `int_usub_${a}`,
      question: 'Evaluate using substitution',
      latex: `\\int_{0}^{1} ${2*a}x\\, e^{${a}x^2}\\,dx`,
      answerLatex: `${expLabel} - 1`,
      check: nc(ans),
      hints: [
        { title: 'Choose u = ax²', formula: `u = ${a}x^2,\\quad du = ${2*a}x\\,dx` },
        { title: 'Transform the integral and bounds', body: `When x=0, u=0; when x=1, u=${a}.`, formula: `\\int_0^{${a}} e^u\\,du` },
        { title: 'Evaluate', formula: `\\left[e^u\\right]_0^{${a}} = ${expLabel} - 1` },
      ],
    }
  },

  // 5. IBP: ∫₀^1 x·e^(ax) dx = ((a-1)e^a + 1)/a²
  () => {
    const a = rng(1, 3)
    const ans = ((a - 1) * Math.exp(a) + 1) / (a * a)
    const eaLabel = a === 1 ? 'e' : `e^{${a}}`
    const numLatex = a === 1 ? '1' : `(${a-1})${eaLabel} + 1`
    return {
      id: `int_ibp_${a}`,
      question: 'Evaluate using integration by parts',
      latex: `\\int_{0}^{1} x\\, e^{${a}x}\\,dx`,
      answerLatex: a === 1 ? '1' : `\\dfrac{${numLatex}}{${a*a}}`,
      check: nc(ans),
      hints: [
        { title: 'Set u = x, dv = e^(ax) dx', formula: `du = dx,\\quad v = \\frac{e^{${a}x}}{${a}}` },
        { title: 'Apply IBP formula: [uv]₀¹ − ∫v du', formula: `\\left[\\frac{xe^{${a}x}}{${a}}\\right]_0^1 - \\int_0^1 \\frac{e^{${a}x}}{${a}}\\,dx` },
        { title: 'Evaluate the remaining integral and simplify', formula: `\\frac{${eaLabel}}{${a}} - \\frac{${eaLabel}-1}{${a*a}} = \\frac{(${a}-1)${eaLabel}+1}{${a*a}}` },
      ],
    }
  },

  // 6. Partial fractions: ∫₁^(a+1) 1/((x)(x+1)) dx = ln((a+1)/(a+2)) + ln(2) = ln(2(a+1)/(a+2))
  () => {
    const a = rng(1, 5)
    const ans = Math.log(2) + Math.log((a + 1) / (a + 2))
    // = ln(2(a+1)/(a+2))
    const num = 2 * (a + 1)
    const den = a + 2
    return {
      id: `int_pf_${a}`,
      question: 'Evaluate using partial fractions',
      latex: `\\int_{1}^{${a+1}} \\frac{1}{x(x+1)}\\,dx`,
      answerLatex: `\\ln\\!\\left(\\dfrac{${num}}{${den}}\\right)`,
      check: nc(ans),
      hints: [
        { title: 'Decompose with partial fractions', formula: `\\frac{1}{x(x+1)} = \\frac{1}{x} - \\frac{1}{x+1}` },
        { title: 'Integrate', formula: `\\left[\\ln|x| - \\ln|x+1|\\right]_1^{${a+1}}` },
        { title: 'Evaluate at bounds', formula: `(\\ln(${a+1}) - \\ln(${a+2})) - (\\ln 1 - \\ln 2) = \\ln\\!\\frac{${num}}{${den}}` },
      ],
    }
  },
]

// ─── APPLIED INTEGRALS ───────────────────────────────────────────────────────

const appIntGens = [
  // H1. Volume of cone by disk method: V = (π/3)r²h
  () => {
    const cases = [
      { r: 3, h: 4, V: 12 }, { r: 2, h: 6, V: 8 },
      { r: 6, h: 1, V: 12 }, { r: 3, h: 3, V: 9 },
    ]
    const { r, h, V } = pick(cases)
    const ans = Math.PI * V
    return {
      id: `appint_cone_${r}_${h}`,
      question: `Use the disk method to find the volume of a cone with radius ${r} cm and height ${h} cm`,
      latex: `y = \\frac{${r}}{${h}}x,\\quad V = \\pi\\int_0^{${h}}\\left(\\frac{${r}}{${h}}x\\right)^2\\!dx`,
      answerLatex: `${V}\\pi`,
      check: nc(ans),
      hints: [
        { title: "The cone is formed by y = (r/h)x revolved around the x-axis", formula: `V = \\pi\\int_0^{${h}}\\frac{${r * r}}{${h * h}}x^2\\,dx = \\frac{${r * r}\\pi}{${h * h}}\\cdot\\frac{${h * h * h}}{3}` },
        { title: "Simplify", formula: `\\frac{\\pi r^2 h}{3} = \\frac{\\pi \\cdot ${r * r} \\cdot ${h}}{3} = ${V}\\pi` },
      ],
    }
  },

  // H2. Washer volume: y=x^(1/n) and y=x on [0,1]
  () => {
    const cases = [
      { n: 2, numV: 1, denV: 6 },   // π(1/2 - 1/3) = π/6
      { n: 3, numV: 4, denV: 15 },  // π(3/5 - 1/3) = 4π/15
    ]
    const { n, numV, denV } = pick(cases)
    const ans = Math.PI * numV / denV
    const nLabel = n === 2 ? '\\sqrt{x}' : `x^{1/${n}}`
    return {
      id: `appint_washer_${n}`,
      question: `Find the volume when the region between y = ${nLabel} and y = x on [0,1] is revolved about the x-axis`,
      latex: `V = \\pi\\int_0^1\\!\\left(${nLabel}^{\\,2} - x^2\\right)dx`,
      answerLatex: numV === 1 ? `\\dfrac{\\pi}{${denV}}` : `\\dfrac{${numV}\\pi}{${denV}}`,
      check: nc(ans),
      hints: [
        { title: "Washer: outer R = x^(1/n), inner r = x", formula: `V = \\pi\\int_0^1\\left(x^{2/${n}} - x^2\\right)dx` },
        { title: "Integrate each term", formula: `\\pi\\left[\\frac{x^{1+2/${n}}}{1+2/${n}} - \\frac{x^3}{3}\\right]_0^1 = \\pi\\!\\left(\\frac{${n}}{${n + 2}} - \\frac{1}{3}\\right)` },
        { title: "Simplify", formula: `\\frac{${numV}\\pi}{${denV}}` },
      ],
    }
  },

  // H3. Spring work: stretch from a to b, W = k(b²-a²)/2
  () => {
    const k = pick([2, 4, 6, 8])
    const a = rng(1, 2)
    const b = a + rng(1, 3)
    const ans = k * (b * b - a * a) / 2
    return {
      id: `appint_spring_${k}_${a}_${b}`,
      question: `A spring with constant k = ${k} N/m is stretched from x = ${a} m to x = ${b} m beyond natural length. Find the work done (J)`,
      latex: `W = \\int_{${a}}^{${b}} ${k}x\\,dx`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: "Hooke's Law: F = kx, work = ∫F dx", formula: `W = \\int_{${a}}^{${b}} ${k}x\\,dx = ${k}\\left[\\frac{x^2}{2}\\right]_{${a}}^{${b}}` },
        { title: "Evaluate", formula: `\\frac{${k}}{2}\\left(${b * b} - ${a * a}\\right) = ${ans}\\text{ J}` },
      ],
    }
  },

  // 1. Area between y=mx and y=x²: m³/6
  () => {
    const m = pick([2, 3, 4, 6])
    const ans = Math.pow(m, 3) / 6
    const [sn, sd] = simplify(Math.pow(m, 3), 6)
    return {
      id: `appint_area_${m}`,
      question: `Find the area enclosed between y = ${m}x and y = x²`,
      latex: `A = \\int_0^{${m}}(${m}x - x^2)\\,dx`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Find intersection points', formula: `${m}x = x^2 \\implies x = 0,\\; ${m}` },
        { title: 'Set up the area integral', formula: `A = \\int_0^{${m}}(${m}x - x^2)\\,dx` },
        { title: 'Integrate and evaluate', formula: `\\left[\\frac{${m}x^2}{2} - \\frac{x^3}{3}\\right]_0^{${m}} = \\frac{${m**3}}{2} - \\frac{${m**3}}{3} = ${frac(sn,sd)}` },
      ],
    }
  },

  // 2. Volume by disk: y=√x around x-axis on [0,a] → πa²/2
  () => {
    const a = rng(1, 5)
    const ans = Math.PI * a * a / 2
    return {
      id: `appint_vol_${a}`,
      question: `Find the volume when y = √x on [0, ${a}] is revolved about the x-axis`,
      latex: `V = \\pi\\int_0^{${a}} x\\,dx`,
      answerLatex: `\\dfrac{${a*a}\\pi}{2}`,
      check: nc(ans),
      hints: [
        { title: 'Disk method: V = π∫[f(x)]² dx', formula: `V = \\pi\\int_0^{${a}}(\\sqrt{x})^2\\,dx = \\pi\\int_0^{${a}} x\\,dx` },
        { title: 'Integrate and evaluate', formula: `\\pi\\left[\\frac{x^2}{2}\\right]_0^{${a}} = \\frac{${a*a}\\pi}{2}` },
      ],
    }
  },

  // 3. Average value of x^n on [0,a]: a^n/(n+1)
  () => {
    const n = rng(1, 4)
    const a = rng(2, 5)
    const ans = Math.pow(a, n) / (n + 1)
    const [sn, sd] = simplify(Math.pow(a, n), n + 1)
    return {
      id: `appint_avg_${n}_${a}`,
      question: `Find the average value of f(x) = x^${n} on [0, ${a}]`,
      latex: `\\bar{f} = \\frac{1}{${a}}\\int_0^{${a}} x^{${n}}\\,dx`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Average value formula: (1/(b-a))∫f dx', formula: `\\bar{f} = \\frac{1}{${a}}\\int_0^{${a}} x^{${n}}\\,dx` },
        { title: 'Integrate', formula: `= \\frac{1}{${a}} \\cdot \\frac{${a}^{${n+1}}}{${n+1}} = \\frac{${Math.pow(a,n+1)}}{${a*(n+1)}}` },
        { title: 'Simplify', formula: `= ${frac(sn, sd)}` },
      ],
    }
  },

  // 4. Arc length of y=(2/3)x^(3/2) on [0,a]: (2/3)((1+a)^(3/2)-1)
  () => {
    const a = pick([3, 8, 15, 24])
    const ans = (2 / 3) * (Math.pow(1 + a, 1.5) - 1)
    const top = Math.pow(1 + a, 1.5) // (1+a)^(3/2)
    const topLabel = `${Math.round(top)}`
    return {
      id: `appint_arc_${a}`,
      question: `Find the arc length of the curve on [0, ${a}]`,
      latex: `y = \\tfrac{2}{3}x^{3/2}`,
      answerLatex: `\\tfrac{2}{3}\\!\\left(${topLabel} - 1\\right)`,
      check: nc(ans),
      hints: [
        { title: "Compute y'", formula: `y' = \\sqrt{x}\\implies 1+(y')^2 = 1+x` },
        { title: 'Set up arc length integral', formula: `L = \\int_0^{${a}}\\sqrt{1+x}\\,dx` },
        { title: 'Integrate with u = 1+x', formula: `\\left[\\tfrac{2}{3}(1+x)^{3/2}\\right]_0^{${a}} = \\tfrac{2}{3}\\bigl(${topLabel}-1\\bigr)` },
      ],
    }
  },

  // 5. Volume by shell: y=x² around y-axis on [0,a] → πa⁴/2
  () => {
    const a = rng(1, 4)
    const ans = Math.PI * Math.pow(a, 4) / 2
    return {
      id: `appint_shell_${a}`,
      question: `Use the shell method to find the volume when y = x² on [0, ${a}] is revolved about the y-axis`,
      latex: `V = 2\\pi\\int_0^{${a}} x \\cdot x^2\\,dx`,
      answerLatex: `\\dfrac{${Math.pow(a,4)}\\pi}{2}`,
      check: nc(ans),
      hints: [
        { title: 'Shell method: V = 2π∫ x·f(x) dx', formula: `V = 2\\pi\\int_0^{${a}} x \\cdot x^2\\,dx = 2\\pi\\int_0^{${a}} x^3\\,dx` },
        { title: 'Integrate and evaluate', formula: `2\\pi\\left[\\frac{x^4}{4}\\right]_0^{${a}} = 2\\pi \\cdot \\frac{${Math.pow(a,4)}}{4} = \\frac{${Math.pow(a,4)}\\pi}{2}` },
      ],
    }
  },
]

// ─── DIFFERENTIAL EQUATIONS ──────────────────────────────────────────────────

const diffEqGens = [
  // H1. Second-order ODE: y'' + n²y = 0, IVP → y = A cos(nx) + B sin(nx)
  () => {
    const n = rng(1, 4)
    const A = rng(1, 4)
    const B = rng(1, 4)
    // y(0) = A, y'(0) = nB → ask for y(π/(2n)) = B
    const ans = B
    return {
      id: `de_2nd_${n}_${A}_${B}`,
      question: `Solve the IVP and find y(π/${2 * n})`,
      latex: `y'' + ${n * n}y = 0,\\quad y(0) = ${A},\\; y'(0) = ${n * B}`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: "General solution: y = A cos(nx) + B sin(nx)", formula: `y = A\\cos(${n}x) + B\\sin(${n}x)` },
        { title: "Apply ICs: y(0)=A gives first constant, y'(0)=nB gives second", formula: `y(0) = A = ${A},\\quad y'(0) = ${n}B = ${n * B} \\implies B = ${B}` },
        { title: `Evaluate at x = π/${2 * n}: cos(π/2) = 0, sin(π/2) = 1`, formula: `y\\!\\left(\\frac{\\pi}{${2 * n}}\\right) = ${A}\\cdot 0 + ${B}\\cdot 1 = ${B}` },
      ],
    }
  },

  // H2. Linear first-order via integrating factor: y' + (n/x)y = x^m
  () => {
    const n = rng(1, 3)
    const m = rng(1, 3)
    const y0 = rng(1, 4)
    // IF: x^n, solution: x^n·y = x^(n+m+1)/(n+m+1) + C
    // y(1) = y0 → C = y0 - 1/(n+m+1)
    // y(2) = (2^(n+m+1)/(n+m+1) + C) / 2^n
    const denom = n + m + 1
    const C = y0 - 1 / denom
    const ans = (Math.pow(2, n + m + 1) / denom + C) / Math.pow(2, n)
    const [sn, sd] = simplify(Math.round(C * denom), denom) // C as fraction
    return {
      id: `de_linear_${n}_${m}_${y0}`,
      question: `Solve the IVP and find y(2) (enter exact or decimal)`,
      latex: `y' + \\frac{${n}}{x}y = x^{${m}},\\quad y(1) = ${y0}`,
      answerLatex: `\\approx ${ans.toFixed(3)}`,
      check: nc(ans),
      hints: [
        { title: `Integrating factor: μ = e^{∫(${n}/x)dx} = x^${n}`, formula: `\\frac{d}{dx}\\left[x^{${n}}y\\right] = x^{${n + m}}` },
        { title: "Integrate both sides", formula: `x^{${n}}y = \\frac{x^{${denom}}}{${denom}} + C` },
        { title: `Apply y(1) = ${y0} to find C, then evaluate y(2)`, formula: `C = ${y0} - \\frac{1}{${denom}},\\quad y(2) \\approx ${ans.toFixed(3)}` },
      ],
    }
  },

  // H3. Euler's method 3 steps on y'=f(x,y)
  () => {
    // y' = x + y, y(0) = 1, h = 0.1, find y(0.3)
    // y1 = 1 + 0.1(0+1) = 1.1
    // y2 = 1.1 + 0.1(0.1+1.1) = 1.1 + 0.12 = 1.22
    // y3 = 1.22 + 0.1(0.2+1.22) = 1.22 + 0.142 = 1.362
    const h = 0.1
    const cases = [
      { f: (x,y)=>x+y, y0:1, label:"y' = x + y,\\; y(0)=1", ans: 1.362, desc:"x+y" },
      { f: (x,y)=>x*x+y, y0:1, label:"y' = x^2 + y,\\; y(0)=1", ans: 1 + h*(0+1) + h*(h*h+1+h*(0+1))+ h*((2*h)**2 + (1 + h*(0+1) + h*(h*h+1+h*(0+1)))), desc:"x^2+y" },
    ]
    // Use the simpler first case
    const { label, ans, desc } = cases[0]
    const y1 = 1 + h*(0 + 1)
    const y2 = y1 + h*(h + y1)
    const y3 = Math.round((y2 + h*(2*h + y2)) * 1000) / 1000
    return {
      id: `de_euler3_xy`,
      question: `Three steps of Euler's method (h = 0.1). Approximate y(0.3) for:`,
      latex: `y' = x + y,\\quad y(0) = 1`,
      answerLatex: `${y3}`,
      check: nc(y3),
      hints: [
        { title: "Step 1: y₁ = y₀ + h·f(x₀, y₀)", formula: `y_1 = 1 + 0.1(0+1) = ${y1}` },
        { title: "Step 2: y₂ = y₁ + h·f(x₁, y₁)", formula: `y_2 = ${y1} + 0.1(0.1+${y1}) = ${y2}` },
        { title: "Step 3: y₃ = y₂ + h·f(x₂, y₂)", formula: `y_3 = ${y2} + 0.1(0.2+${y2}) = ${y3}` },
      ],
    }
  },

  // 1. Exponential growth/decay: dy/dt = ky, y(0)=y0, find y(t0)
  () => {
    const k = pick([1, 2])
    const y0 = rng(1, 5)
    const t0 = rng(1, 2)
    const ans = y0 * Math.exp(k * t0)
    const expLabel = k * t0 === 1 ? 'e' : `e^{${k*t0}}`
    return {
      id: `de_expgrow_${k}_${y0}_${t0}`,
      question: `Solve the IVP and find y(${t0})`,
      latex: `\\frac{dy}{dt} = ${k}y,\\quad y(0) = ${y0}`,
      answerLatex: y0 === 1 ? expLabel : `${y0}${expLabel}`,
      check: nc(ans),
      hints: [
        { title: 'Recognize as exponential growth ODE', formula: `y = Ce^{${k}t}` },
        { title: 'Apply initial condition y(0) = ${y0}', formula: `C = ${y0}\\implies y = ${y0}e^{${k}t}` },
        { title: `Evaluate at t = ${t0}`, formula: `y(${t0}) = ${y0}e^{${k*t0}}` },
      ],
    }
  },

  // 2. Separable: dy/dx = x/y, y(0)=a → y = √(x²+a²), find y(b)
  () => {
    const pythagorean = [[3, 4, 5], [5, 12, 13], [8, 15, 17]]
    const [a, b, hyp] = pick(pythagorean)
    const ans = hyp
    return {
      id: `de_sep_${a}_${b}`,
      question: `Solve the IVP and find y(${b})`,
      latex: `\\frac{dy}{dx} = \\frac{x}{y},\\quad y(0) = ${a}`,
      answerLatex: `${hyp}`,
      check: nc(ans),
      hints: [
        { title: 'Separate variables: y dy = x dx', formula: `\\int y\\,dy = \\int x\\,dx \\implies \\frac{y^2}{2} = \\frac{x^2}{2} + C` },
        { title: 'Apply IC y(0) = ${a}: C = a²/2', formula: `y^2 = x^2 + ${a*a}` },
        { title: `Evaluate at x = ${b}`, formula: `y(${b}) = \\sqrt{${b*b}+${a*a}} = \\sqrt{${hyp*hyp}} = ${hyp}` },
      ],
    }
  },

  // 3. Newton's cooling with k = ln(2): y(t) = M + (y0-M)·2^(-t), find y(1) = (y0+M)/2
  () => {
    const M = pick([0, 20, 30])
    const y0 = pick([60, 80, 100])
    const ans = (y0 + M) / 2
    return {
      id: `de_newton_${M}_${y0}`,
      question: `A substance cools according to Newton's law with k = ln 2. Find the temperature at t = 1`,
      latex: `\\frac{dT}{dt} = -\\ln(2)\\,(T - ${M}),\\quad T(0) = ${y0}`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: 'Solution form', formula: `T(t) = ${M} + (${y0}-${M})e^{-\\ln(2)\\,t} = ${M} + ${y0-M}\\cdot 2^{-t}` },
        { title: 'Evaluate at t = 1', formula: `T(1) = ${M} + \\frac{${y0-M}}{2} = ${ans}` },
      ],
    }
  },

  // 4. Separable: dy/dx = ay², y(0)=1 → y = 1/(1-ax), find y at specific point
  () => {
    const a = rng(1, 3)
    const x0 = pick([1 / (2 * a), 1 / (3 * a)].filter(Number.isFinite))
    // Ensure x0 gives a clean integer answer
    // y(x0) = 1/(1-a·x0) — choose x0 = 1/(2a) → y = 2; x0 = -1/a → y = 1/2
    const safeX0 = 1 / (2 * a)  // gives y = 2
    const ans = 2
    return {
      id: `de_sep2_${a}`,
      question: `Solve the IVP and find y at x = 1/${2*a}`,
      latex: `\\frac{dy}{dx} = ${a}y^2,\\quad y(0) = 1`,
      answerLatex: `2`,
      check: nc(ans),
      hints: [
        { title: 'Separate: dy/y² = a dx', formula: `\\int y^{-2}\\,dy = \\int ${a}\\,dx \\implies -\\frac{1}{y} = ${a}x + C` },
        { title: 'Apply IC y(0) = 1: C = -1', formula: `y = \\frac{1}{1 - ${a}x}` },
        { title: `Evaluate at x = 1/${2*a}`, formula: `y = \\frac{1}{1 - ${a}\\cdot\\frac{1}{${2*a}}} = \\frac{1}{1/2} = 2` },
      ],
    }
  },

  // 5. Linear first-order: dy/dx + y = 0, logistic style — actually: y' = ry(1-y), r=ln2, y(0)=1/2 → y(t)=1/(1+e^(-rt))
  //    At t=1: 1/(1+e^{-ln2}) = 1/(1+1/2) = 2/3
  () => {
    const r = 1 // use r=1 for simplicity, y' = y(1-y), y(0) = 1/(1+e^a) for various a
    const a = rng(1, 3)
    // y(0) = 1/(1+e^a), general solution y = 1/(1+e^(a-t))
    // at t = a: y = 1/(1+1) = 1/2
    const ans = 0.5
    return {
      id: `de_logistic_${a}`,
      question: `A logistic ODE has the solution y = 1/(1 + e^{${a} − t}). Find y(${a})`,
      latex: `y = \\frac{1}{1 + e^{${a}-t}}`,
      answerLatex: `\\dfrac{1}{2}`,
      check: nc(ans),
      hints: [
        { title: `Substitute t = ${a} directly`, formula: `y(${a}) = \\frac{1}{1 + e^{${a}-${a}}} = \\frac{1}{1+e^0}` },
        { title: 'Simplify (e⁰ = 1)', formula: `\\frac{1}{1+1} = \\frac{1}{2}` },
      ],
    }
  },
]

// ─── PARAMETRIC / POLAR ───────────────────────────────────────────────────────

const parametricGens = [
  // H1. Second parametric derivative: x=t², y=t³ → d²y/dx² = 3/(4t)
  () => {
    const k = pick([1, 2, 3, -1, -2])
    const ans = 3 / (4 * k)
    // Use 3k/(4k²) to keep negative in numerator
    const [sn, sd] = simplify(3 * k, 4 * k * k)
    return {
      id: `para_d2y_${k}`,
      question: `Find d²y/dx² at t = ${k} for the parametric curve`,
      latex: `x = t^2,\\quad y = t^3`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: "First derivative: dy/dx = (dy/dt)/(dx/dt)", formula: `\\frac{dy}{dx} = \\frac{3t^2}{2t} = \\frac{3t}{2}` },
        { title: "Second derivative: d²y/dx² = d(dy/dx)/dt ÷ dx/dt", formula: `\\frac{d^2y}{dx^2} = \\frac{3/2}{2t} = \\frac{3}{4t}` },
        { title: `Substitute t = ${k}`, formula: `\\frac{3}{4\\cdot${k}} = ${frac(sn, sd)}` },
      ],
    }
  },

  // H2. Speed of parametric curve: |v| = √((dx/dt)²+(dy/dt)²) at t=a
  () => {
    const a = rng(1, 4)
    const b = rng(1, 4)
    // x=a·cos(t), y=b·sin(t): speed = √(a²sin²t + b²cos²t)
    // At t=0: speed = b.  At t=π/2: speed = a.
    const tChoice = pick([0, 1])
    const ans = tChoice === 0 ? b : a
    const tLabel = tChoice === 0 ? '0' : '\\pi/2'
    return {
      id: `para_speed_${a}_${b}_${tChoice}`,
      question: `Find the speed |v(t)| at t = ${tChoice === 0 ? '0' : 'π/2'}`,
      latex: `x = ${a}\\cos t,\\quad y = ${b}\\sin t`,
      answerLatex: `${ans}`,
      check: nc(ans),
      hints: [
        { title: "Compute the component velocities", formula: `\\frac{dx}{dt} = -${a}\\sin t,\\quad \\frac{dy}{dt} = ${b}\\cos t` },
        { title: `Evaluate at t = ${tLabel}`, formula: tChoice === 0 ? `\\frac{dx}{dt} = 0,\\; \\frac{dy}{dt} = ${b}` : `\\frac{dx}{dt} = -${a},\\; \\frac{dy}{dt} = 0` },
        { title: "Compute speed", formula: tChoice === 0 ? `|v| = \\sqrt{0^2+${b}^2} = ${b}` : `|v| = \\sqrt{${a}^2+0^2} = ${a}` },
      ],
    }
  },

  // H3. Polar tangent: dy/dx for r = a at θ = π/4 (circle: dy/dx = cot(θ))
  //     For r = a·sin(θ): x = a·sin(θ)cos(θ), y = a·sin²(θ)
  //     dy/dx at θ=π/4: = cot(π/4) = 1? Let's use r=a+a·cos(θ) cardioid at θ=π/2.
  //     dr/dθ = -a·sin(θ). At θ=π/2: r=a, dr/dθ=-a.
  //     dy/dx = (dr/dθ·sin θ + r·cos θ)/(dr/dθ·cos θ - r·sin θ) = (-a·1+0)/(-a·0-a·1) = -a/(-a) = 1 ✓
  () => {
    const a = rng(1, 4)
    const ans = 1
    return {
      id: `para_polar_cardioid_${a}`,
      question: `Find dy/dx for the cardioid at θ = π/2`,
      latex: `r = ${a}(1 + \\cos\\theta)`,
      answerLatex: `1`,
      check: nc(ans),
      hints: [
        { title: "At θ = π/2: r = a, dr/dθ = −a·sin(π/2) = −a", formula: `r = ${a}(1+0) = ${a},\\quad \\frac{dr}{d\\theta} = -${a}\\sin\\theta\\big|_{\\pi/2} = -${a}` },
        { title: "Polar slope formula", formula: `\\frac{dy}{dx} = \\frac{(dr/d\\theta)\\sin\\theta + r\\cos\\theta}{(dr/d\\theta)\\cos\\theta - r\\sin\\theta}` },
        { title: "Substitute and simplify (cos(π/2) = 0, sin(π/2) = 1)", formula: `\\frac{-${a}\\cdot 1 + ${a}\\cdot 0}{-${a}\\cdot 0 - ${a}\\cdot 1} = \\frac{-${a}}{-${a}} = 1` },
      ],
    }
  },

  // 1. x=t², y=t³: dy/dx at t=k → 3k/2
  () => {
    const k = pick([1, 2, 3, 4, -1, -2])
    const ans = 3 * k / 2
    const [sn, sd] = simplify(3 * k, 2)
    return {
      id: `para_t2t3_${k}`,
      question: `Find dy/dx at t = ${k} for the parametric curve`,
      latex: `x = t^2,\\quad y = t^3`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Use the parametric slope formula', formula: `\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{3t^2}{2t} = \\frac{3t}{2}` },
        { title: `Substitute t = ${k}`, formula: `\\frac{3 \\cdot ${k}}{2} = ${frac(sn,sd)}` },
      ],
    }
  },

  // 2. Ellipse x=a·cos(t), y=b·sin(t): dy/dx = -b·cos(t)/(a·sin(t)); at t=π/4: -b/a
  () => {
    const a = rng(1, 5)
    const b = rng(1, 5)
    const ans = -b / a
    const [sn, sd] = simplify(-b, a)
    return {
      id: `para_ellipse_${a}_${b}`,
      question: `Find dy/dx at t = π/4`,
      latex: `x = ${a}\\cos t,\\quad y = ${b}\\sin t`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Compute the derivatives', formula: `\\frac{dx}{dt} = -${a}\\sin t,\\quad \\frac{dy}{dt} = ${b}\\cos t` },
        { title: 'Form dy/dx', formula: `\\frac{dy}{dx} = \\frac{${b}\\cos t}{-${a}\\sin t}` },
        { title: 'Evaluate at t = π/4 (cos = sin = √2/2)', formula: `\\frac{${b}(\\sqrt{2}/2)}{-${a}(\\sqrt{2}/2)} = -\\frac{${b}}{${a}} = ${frac(sn,sd)}` },
      ],
    }
  },

  // 3. Arc length of circle x=r·cos(t), y=r·sin(t) on [0,π] = πr
  () => {
    const r = rng(1, 6)
    const ans = Math.PI * r
    return {
      id: `para_arclength_${r}`,
      question: `Find the arc length of the parametric curve on [0, π]`,
      latex: `x = ${r}\\cos t,\\quad y = ${r}\\sin t`,
      answerLatex: r === 1 ? `\\pi` : `${r}\\pi`,
      check: nc(ans),
      hints: [
        { title: 'Arc length formula for parametric curves', formula: `L = \\int_0^\\pi \\sqrt{\\left(\\frac{dx}{dt}\\right)^2+\\left(\\frac{dy}{dt}\\right)^2}\\,dt` },
        { title: 'Compute the integrand', formula: `\\sqrt{${r*r}\\sin^2 t + ${r*r}\\cos^2 t} = ${r}` },
        { title: 'Integrate the constant', formula: `\\int_0^\\pi ${r}\\,dt = ${r}\\pi` },
      ],
    }
  },

  // 4. Cycloid area: x=r(t-sin t), y=r(1-cos t) on [0,2π] → 3πr²
  () => {
    const r = rng(1, 4)
    const ans = 3 * Math.PI * r * r
    return {
      id: `para_cycloid_${r}`,
      question: `Find the area under one arch of the cycloid (one period, t ∈ [0, 2π])`,
      latex: `x = ${r}(t - \\sin t),\\quad y = ${r}(1-\\cos t)`,
      answerLatex: `${3*r*r}\\pi`,
      check: nc(ans),
      hints: [
        { title: 'Use A = ∫y dx = ∫y (dx/dt) dt', formula: `A = \\int_0^{2\\pi} ${r}(1-\\cos t)\\cdot ${r}(1-\\cos t)\\,dt = ${r*r}\\int_0^{2\\pi}(1-\\cos t)^2\\,dt` },
        { title: 'Expand (1-cos t)² = 1 - 2cos t + cos²t', formula: `\\int_0^{2\\pi}(1-2\\cos t+\\cos^2 t)\\,dt = 2\\pi + 0 + \\pi = 3\\pi` },
        { title: 'Multiply by r²', formula: `A = ${r*r} \\cdot 3\\pi = ${3*r*r}\\pi` },
      ],
    }
  },

  // 5. Polar area: r = a·cos(θ) full circle area = πa²/4
  () => {
    const a = rng(2, 6)
    const ans = Math.PI * a * a / 4
    return {
      id: `para_polar_${a}`,
      question: `Find the area enclosed by the polar curve`,
      latex: `r = ${a}\\cos\\theta`,
      answerLatex: `\\dfrac{${a*a}\\pi}{4}`,
      check: nc(ans),
      hints: [
        { title: 'Polar area formula: A = ½∫r² dθ over one loop [−π/2, π/2]', formula: `A = \\tfrac{1}{2}\\int_{-\\pi/2}^{\\pi/2} ${a*a}\\cos^2\\theta\\,d\\theta` },
        { title: 'Use cos²θ = (1+cos 2θ)/2', formula: `= \\frac{${a*a}}{2} \\cdot \\frac{\\pi}{2} = \\frac{${a*a}\\pi}{4}` },
      ],
    }
  },
]

// ─── SERIES ──────────────────────────────────────────────────────────────────

const seriesGens = [
  // H1. Telescoping: Σ_{n=1}^∞ 1/((2n-1)(2n+1)) = 1/2
  () => {
    return {
      id: `ser_tele_odd`,
      question: 'Find the exact sum of the telescoping series',
      latex: `\\sum_{n=1}^{\\infty} \\frac{1}{(2n-1)(2n+1)}`,
      answerLatex: `\\dfrac{1}{2}`,
      check: nc(0.5),
      hints: [
        { title: "Partial fractions", formula: `\\frac{1}{(2n-1)(2n+1)} = \\frac{1}{2}\\!\\left(\\frac{1}{2n-1}-\\frac{1}{2n+1}\\right)` },
        { title: "Partial sums telescope — all interior terms cancel", formula: `S_N = \\frac{1}{2}\\left(1 - \\frac{1}{2N+1}\\right)\\to \\frac{1}{2}` },
      ],
    }
  },

  // H2. nth derivative from Taylor series: f^(k)(0) for sin(ax²)
  () => {
    const a = rng(1, 3)
    // sin(ax²) = ax² - (ax²)³/6 + ... coefficient of x^6 is -a³/6
    // f^(6)(0)/6! = -a³/6  →  f^(6)(0) = -a³·6!/6 = -a³·120 = -120a³
    const deriv = -120 * a ** 3
    return {
      id: `ser_nthderiv_sin_${a}`,
      question: `Find f⁽⁶⁾(0) using the Maclaurin series`,
      latex: `f(x) = \\sin(${a === 1 ? '' : a}x^2)`,
      answerLatex: `${deriv}`,
      check: nc(deriv),
      hints: [
        { title: "Substitute u = ax² into the Maclaurin series for sin u", formula: `\\sin(${a === 1 ? '' : a}x^2) = ${a === 1 ? '' : a + '\\cdot'}x^2 - \\frac{${a ** 3}x^6}{6} + \\cdots` },
        { title: "The x⁶ coefficient equals f⁽⁶⁾(0) / 6!", formula: `\\frac{f^{(6)}(0)}{720} = -\\frac{${a ** 3}}{6}` },
        { title: "Solve for f⁽⁶⁾(0)", formula: `f^{(6)}(0) = -\\frac{${a ** 3} \\cdot 720}{6} = ${deriv}` },
      ],
    }
  },

  // H3. Alternating series remainder: |error| ≤ first omitted term
  //     ln(1+x) = x - x²/2 + x³/3 - ...  Approximate ln(1.5) using first 3 terms.
  //     Error ≤ (1/2)^4 / 4 = 1/64 ≈ 0.015625
  () => {
    // Use fixed x=1/2: first omitted term (4th term) = (1/2)^4/4 = 1/64
    const ans = 1 / 64
    return {
      id: `ser_altrem_ln`,
      question: "For ln(1.5) approximated by the first 3 terms of its alternating series, find the maximum error bound",
      latex: `\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots,\\quad x = \\tfrac{1}{2}`,
      answerLatex: `\\dfrac{1}{64}`,
      check: nc(ans),
      hints: [
        { title: "Alternating Series Estimation Theorem: |error| ≤ |first omitted term|", body: "The 4th term is the first omitted term." },
        { title: "Compute the 4th term", formula: `\\frac{(1/2)^4}{4} = \\frac{1/16}{4} = \\frac{1}{64}` },
      ],
    }
  },

  // 1. Geometric series: ∑ar^n = a/(1-r), r=1/p
  () => {
    const a = rng(1, 5)
    const p = rng(2, 5)
    const ans = a * p / (p - 1)
    const [sn, sd] = simplify(a * p, p - 1)
    return {
      id: `ser_geo_${a}_${p}`,
      question: 'Find the sum of the infinite geometric series',
      latex: `\\sum_{n=0}^{\\infty} ${a}\\left(\\frac{1}{${p}}\\right)^n`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Identify a and r', body: `First term a = ${a}, common ratio r = 1/${p}.` },
        { title: 'Since |r| = 1/${p} < 1, use the geometric series formula', formula: `S = \\frac{a}{1-r} = \\frac{${a}}{1-\\frac{1}{${p}}} = \\frac{${a}}{\\frac{${p-1}}{${p}}}` },
        { title: 'Simplify', formula: `= ${frac(sn, sd)}` },
      ],
    }
  },

  // 2. Power series ∑(n+1)x^n = 1/(1-x)²; evaluate at x=1/p → p²/(p-1)²
  () => {
    const p = rng(2, 5)
    const ans = (p * p) / ((p - 1) * (p - 1))
    const [sn, sd] = simplify(p * p, (p - 1) * (p - 1))
    return {
      id: `ser_power_${p}`,
      question: `Evaluate the power series at x = 1/${p}`,
      latex: `\\sum_{n=0}^{\\infty} (n+1)\\left(\\frac{1}{${p}}\\right)^n`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Recognize the series ∑(n+1)x^n', formula: `\\sum_{n=0}^{\\infty}(n+1)x^n = \\frac{1}{(1-x)^2}\\quad|x|<1` },
        { title: 'This follows by differentiating ∑x^n = 1/(1-x)', formula: `\\frac{d}{dx}\\frac{1}{1-x} = \\frac{1}{(1-x)^2}` },
        { title: `Substitute x = 1/${p}`, formula: `\\frac{1}{(1-\\frac{1}{${p}})^2} = \\frac{1}{(\\frac{${p-1}}{${p}})^2} = \\frac{${p*p}}{${(p-1)**2}} = ${frac(sn,sd)}` },
      ],
    }
  },

  // 3. Maclaurin coefficient of e^(ax): coeff of x^k is a^k/k!
  () => {
    const a = rng(1, 3)
    const k = rng(2, 5)
    const ans = Math.pow(a, k) / math.factorial(k)
    const [sn, sd] = simplify(Math.pow(a, k), math.factorial(k))
    return {
      id: `ser_maclaurin_${a}_${k}`,
      question: `Find the coefficient of x^${k} in the Maclaurin series`,
      latex: `f(x) = e^{${a}x}`,
      answerLatex: frac(sn, sd),
      check: nc(ans),
      hints: [
        { title: 'Write the Maclaurin series for e^(ax)', formula: `e^{${a}x} = \\sum_{n=0}^{\\infty} \\frac{(${a}x)^n}{n!} = \\sum_{n=0}^{\\infty} \\frac{${a}^n}{n!}x^n` },
        { title: `Extract the x^${k} coefficient`, formula: `c_{${k}} = \\frac{${a}^{${k}}}{${k}!} = \\frac{${Math.pow(a,k)}}{${math.factorial(k)}} = ${frac(sn,sd)}` },
      ],
    }
  },

  // 4. Radius of convergence of ∑a^n·x^n = R=1/a
  () => {
    const a = rng(2, 6)
    const ans = 1 / a
    return {
      id: `ser_radius_${a}`,
      question: `Find the radius of convergence`,
      latex: `\\sum_{n=0}^{\\infty} ${a}^n x^n`,
      answerLatex: frac(1, a),
      check: nc(ans),
      hints: [
        { title: 'Apply the Ratio Test', formula: `\\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right| = \\lim_{n\\to\\infty}\\frac{${a}^{n+1}|x|^{n+1}}{${a}^n|x|^n} = ${a}|x|` },
        { title: 'Converges when ${a}|x| < 1', formula: `|x| < \\frac{1}{${a}}\\implies R = \\frac{1}{${a}}` },
      ],
    }
  },

  // 5. Telescoping: ∑_{n=1}^∞ a/(n(n+a)) = H_a (for a=1: 1, a=2: 3/2)
  () => {
    const a = pick([1, 2])
    // sum = H_a = 1 + 1/2 + ... + 1/a
    const ans = a === 1 ? 1 : 1.5
    const ansLatex = a === 1 ? '1' : '\\dfrac{3}{2}'
    return {
      id: `ser_telescope_${a}`,
      question: 'Find the exact sum of the series',
      latex: `\\sum_{n=1}^{\\infty} \\frac{${a}}{n(n+${a})}`,
      answerLatex: ansLatex,
      check: nc(ans),
      hints: [
        { title: 'Partial fraction decomposition', formula: `\\frac{${a}}{n(n+${a})} = \\frac{1}{n} - \\frac{1}{n+${a}}` },
        { title: 'Write out partial sums — terms telescope', body: `Most terms cancel.` },
        { title: 'The surviving terms sum to', formula: a === 1 ? `1 - \\lim_{N\\to\\infty}\\frac{1}{N+1} = 1` : `1 + \\frac{1}{2} - \\lim_{N\\to\\infty}\\left(\\frac{1}{N+1}+\\frac{1}{N+2}\\right) = \\frac{3}{2}` },
      ],
    }
  },

  // 6. nth-term Taylor: find value of sin series at a point
  // ∑_{n=0}^∞ (-1)^n x^(2n+1)/(2n+1)! at x=π/6 → 1/2
  () => {
    const targets = [
      { x: 'π/6', ans: 0.5, ansLatex: '\\dfrac{1}{2}', desc: 'x = \\pi/6' },
      { x: 'π/2', ans: 1,   ansLatex: '1',              desc: 'x = \\pi/2' },
      { x: 'π/3', ans: Math.sqrt(3)/2, ansLatex: '\\dfrac{\\sqrt{3}}{2}', desc: 'x = \\pi/3' },
    ]
    const t = pick(targets)
    return {
      id: `ser_sineval_${t.x.replace('/','_')}`,
      question: `The Maclaurin series for sin(x) converges to sin(x). Evaluate the series at ${t.desc}`,
      latex: `\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}\\bigg|_{x=${t.x}}`,
      answerLatex: t.ansLatex,
      check: nc(t.ans),
      hints: [
        { title: 'The series equals sin(x) for all x', body: 'The Maclaurin series for sin(x) converges for all real x.' },
        { title: `Therefore evaluate sin(${t.x})`, formula: `\\sin\\left(${t.desc.split(' = ')[1]}\\right) = ${t.ansLatex}` },
      ],
    }
  },
]

export const GENERATORS = {
  limits:        limGens,
  derivatives:   derivGens,
  appDerivatives: appDerivGens,
  integrals:     integralGens,
  appIntegrals:  appIntGens,
  diffEq:        diffEqGens,
  parametric:    parametricGens,
  series:        seriesGens,
}
