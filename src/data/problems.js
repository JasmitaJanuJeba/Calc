import * as math from 'mathjs'

// Numeric answer checker — user input evaluated as a mathjs expression
const nc = (expected) => (input) => {
  try {
    const val = +math.evaluate(String(input).trim())
    if (!isFinite(val)) return false
    // 1% relative tolerance or 0.01 absolute, whichever is larger
    return Math.abs(val - expected) <= Math.max(0.01, Math.abs(expected) * 0.01)
  } catch { return false }
}

export const PROBLEMS = {
  // ─────────────────────────────────────────────
  // LIMITS  (all require L'Hôpital or Taylor-series reasoning)
  // ─────────────────────────────────────────────
  limits: [
    {
      id: 'lim-1',
      question: 'Evaluate using Taylor series or L\'Hôpital\'s Rule (three applications):',
      latex: '\\lim_{x \\to 0} \\dfrac{x - \\sin x}{x^3}',
      answerLatex: '1/6',
      check: nc(1 / 6),
      hints: [
        { title: 'Recognize the 0/0 form', body: 'Direct substitution gives 0/0. Three applications of L\'Hôpital\'s give a pattern, but Taylor series is faster.' },
        { title: 'Expand sin x', formula: '\\sin x = x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\cdots' },
        { title: 'Subtract and divide', formula: '\\frac{x - \\sin x}{x^3} = \\frac{x^3/6 - \\cdots}{x^3} \\to \\frac{1}{6}' },
      ],
    },
    {
      id: 'lim-2',
      question: 'Evaluate:',
      latex: '\\lim_{x \\to 0} \\dfrac{\\tan x - \\sin x}{x^3}',
      answerLatex: '1/2',
      check: nc(0.5),
      hints: [
        { title: 'Factor the numerator', formula: '\\tan x - \\sin x = \\sin x\\left(\\frac{1}{\\cos x}-1\\right) = \\sin x \\cdot \\frac{1-\\cos x}{\\cos x}' },
        { title: 'Use known limits', formula: '\\lim_{x\\to0}\\frac{\\sin x}{x} = 1, \\quad \\lim_{x\\to0}\\frac{1-\\cos x}{x^2} = \\frac{1}{2}' },
        { title: 'Combine', formula: '\\lim_{x\\to0}\\frac{\\sin x}{x}\\cdot\\frac{1-\\cos x}{x^2}\\cdot\\frac{1}{\\cos x} = 1\\cdot\\frac{1}{2}\\cdot 1 = \\frac{1}{2}' },
      ],
    },
    {
      id: 'lim-3',
      question: 'Evaluate using the identity sin 3x = 3 sin x − 4 sin³x:',
      latex: '\\lim_{x \\to 0} \\dfrac{3\\sin x - \\sin 3x}{x^3}',
      answerLatex: '4',
      check: nc(4),
      hints: [
        { title: 'Apply the triple-angle identity', formula: '3\\sin x - \\sin 3x = 3\\sin x - (3\\sin x - 4\\sin^3 x) = 4\\sin^3 x' },
        { title: 'Simplify', formula: '\\lim_{x\\to0}\\frac{4\\sin^3 x}{x^3} = 4\\left(\\lim_{x\\to0}\\frac{\\sin x}{x}\\right)^3 = 4 \\cdot 1 = 4' },
      ],
    },
    {
      id: 'lim-4',
      question: 'Apply L\'Hôpital\'s Rule appropriately:',
      latex: '\\lim_{x \\to 0} \\dfrac{e^{3x}-1}{\\sin 2x}',
      answerLatex: '3/2',
      check: nc(1.5),
      hints: [
        { title: '0/0 form — apply L\'Hôpital\'s', formula: '\\lim_{x\\to0}\\frac{3e^{3x}}{2\\cos 2x} = \\frac{3 \\cdot 1}{2 \\cdot 1} = \\frac{3}{2}' },
        { title: 'Or use Taylor series', formula: 'e^{3x}-1 \\approx 3x,\\quad \\sin 2x \\approx 2x \\implies \\frac{3x}{2x} = \\frac{3}{2}' },
      ],
    },
    {
      id: 'lim-5',
      question: 'Evaluate this 0⁰ indeterminate form (enter exact value):',
      latex: '\\lim_{x \\to 0^+} x^x',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Take the logarithm', body: 'Let L = lim x^x. Then ln L = lim x ln x.', formula: '\\lim_{x\\to0^+} x\\ln x = \\lim_{x\\to0^+}\\frac{\\ln x}{1/x}' },
        { title: 'Apply L\'Hôpital\'s (−∞/∞ form)', formula: '\\lim_{x\\to0^+}\\frac{1/x}{-1/x^2} = \\lim_{x\\to0^+}(-x) = 0' },
        { title: 'Exponentiate', formula: '\\ln L = 0 \\implies L = e^0 = 1' },
      ],
    },
    {
      id: 'lim-6',
      question: 'A classic L\'Hôpital form at a finite point:',
      latex: '\\lim_{x \\to 1} \\dfrac{\\ln x}{x - 1}',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: '0/0 form — L\'Hôpital\'s', formula: '\\lim_{x\\to1}\\frac{1/x}{1} = \\frac{1}{1} = 1' },
      ],
    },
    {
      id: 'lim-7',
      question: 'Evaluate this ∞ · 0 form at infinity:',
      latex: '\\lim_{x \\to \\infty} x\\!\\left(e^{1/x} - 1\\right)',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Substitute t = 1/x', body: 'As x → ∞, t → 0⁺:', formula: '\\lim_{t\\to0^+}\\frac{e^t-1}{t} = 1' },
      ],
    },
    {
      id: 'lim-8',
      question: 'Requires four Taylor terms — identify the leading term:',
      latex: '\\lim_{x \\to 0} \\dfrac{\\cos x - 1 + \\tfrac{x^2}{2}}{x^4}',
      answerLatex: '1/24',
      check: nc(1 / 24),
      hints: [
        { title: 'Expand cos x', formula: '\\cos x = 1 - \\frac{x^2}{2} + \\frac{x^4}{24} - \\cdots' },
        { title: 'Subtract and simplify', formula: '\\cos x - 1 + \\frac{x^2}{2} = \\frac{x^4}{24} + O(x^6)' },
        { title: 'Divide by x⁴', formula: '\\lim_{x\\to0}\\frac{x^4/24 + \\cdots}{x^4} = \\frac{1}{24}' },
      ],
    },
    {
      id: 'lim-9',
      question: 'Evaluate this 1^∞ indeterminate form (enter exact value like e^6):',
      latex: '\\lim_{x \\to \\infty} \\left(1 + \\dfrac{3}{x}\\right)^{\\!2x}',
      answerLatex: 'e^6 \\approx 403.4',
      check: nc(Math.E ** 6),
      hints: [
        { title: 'Write as e raised to a limit', formula: '\\exp\\!\\left(2x\\ln\\!\\left(1+\\tfrac{3}{x}\\right)\\right)' },
        { title: 'Use ln(1+u) ≈ u as u → 0', formula: '2x \\cdot \\frac{3}{x} = 6 \\implies \\lim = e^6' },
      ],
    },
    {
      id: 'lim-10',
      question: 'Combine two known limits to evaluate:',
      latex: '\\lim_{x \\to 0} \\dfrac{\\sin x - x\\cos x}{x^3}',
      answerLatex: '1/3',
      check: nc(1 / 3),
      hints: [
        { title: 'Taylor-expand each term', formula: '\\sin x = x - \\frac{x^3}{6} + \\cdots,\\quad x\\cos x = x - \\frac{x^3}{2} + \\cdots' },
        { title: 'Subtract', formula: '\\sin x - x\\cos x = \\frac{x^3}{3} + O(x^5)' },
        { title: 'Divide by x³', formula: '\\lim = \\frac{1}{3}' },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // DERIVATIVES
  // ─────────────────────────────────────────────
  derivatives: [
    {
      id: 'der-1',
      question: 'Implicit differentiation — find dy/dx at (1, 2):',
      latex: 'x^2 + xy + y^2 = 7',
      answerLatex: '-4/5',
      check: nc(-4 / 5),
      hints: [
        { title: 'Differentiate both sides implicitly', formula: '2x + y + x\\,y\' + 2y\\,y\' = 0' },
        { title: 'Solve for y\'', formula: "y'(x+2y) = -(2x+y) \\implies y' = -\\frac{2x+y}{x+2y}" },
        { title: 'Substitute (1, 2)', formula: "y' = -\\frac{2+2}{1+4} = -\\frac{4}{5}" },
      ],
    },
    {
      id: 'der-2',
      question: 'Logarithmic differentiation — find y\'(1):',
      latex: 'y = x^x',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Take ln of both sides', formula: '\\ln y = x\\ln x' },
        { title: 'Differentiate implicitly', formula: "\\frac{y'}{y} = \\ln x + 1 \\implies y' = x^x(1+\\ln x)" },
        { title: 'At x = 1 (ln 1 = 0)', formula: "y'(1) = 1^1(1+0) = 1" },
      ],
    },
    {
      id: 'der-3',
      question: 'Implicit differentiation — find dy/dx at (3, 3) on the folium of Descartes:',
      latex: 'x^3 + y^3 = 6xy',
      answerLatex: '-1',
      check: nc(-1),
      hints: [
        { title: 'Differentiate both sides', formula: "3x^2 + 3y^2\\,y' = 6y + 6x\\,y'" },
        { title: 'Rearrange', formula: "y'(3y^2-6x) = 6y-3x^2 \\implies y' = \\frac{2y-x^2}{y^2-2x}" },
        { title: 'At (3, 3)', formula: "y' = \\frac{6-9}{9-6} = \\frac{-3}{3} = -1" },
      ],
    },
    {
      id: 'der-4',
      question: 'Chain rule — find f\'(1/4) for (enter exact or decimal):',
      latex: 'f(x) = \\arcsin\\!\\sqrt{x}',
      answerLatex: '2/sqrt(3) \\approx 1.155',
      check: nc(2 / Math.sqrt(3)),
      hints: [
        { title: 'Chain rule: d/dx[arcsin u] = u\'/√(1−u²)', formula: "f'(x) = \\frac{1}{\\sqrt{1-x}} \\cdot \\frac{1}{2\\sqrt{x}}" },
        { title: 'At x = 1/4', formula: "f'\\!\\left(\\tfrac{1}{4}\\right) = \\frac{1}{\\sqrt{3/4}}\\cdot\\frac{1}{2\\cdot(1/2)} = \\frac{2}{\\sqrt{3}}" },
      ],
    },
    {
      id: 'der-5',
      question: 'Find f\'(0) — product rule + chain rule combined:',
      latex: 'f(x) = e^{\\sin x}\\cos x',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Product rule: (uv)\' = u\'v + uv\'', formula: "f'(x) = e^{\\sin x}\\cos x\\cdot\\cos x + e^{\\sin x}(-\\sin x)" },
        { title: 'Factor', formula: "f'(x) = e^{\\sin x}(\\cos^2 x - \\sin x)" },
        { title: 'At x = 0', formula: "f'(0) = e^0(1-0) = 1" },
      ],
    },
    {
      id: 'der-6',
      question: 'Recognize this derivative — find f\'(π/3):',
      latex: 'f(x) = \\ln(\\sec x + \\tan x)',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Standard result', formula: '\\frac{d}{dx}\\ln(\\sec x+\\tan x) = \\sec x' },
        { title: 'Evaluate at x = π/3', formula: '\\sec(\\pi/3) = \\frac{1}{\\cos(\\pi/3)} = \\frac{1}{1/2} = 2' },
      ],
    },
    {
      id: 'der-7',
      question: 'Logarithmic diff — find f\'(e) (enter exact value):',
      latex: 'f(x) = x^{1/x}',
      answerLatex: '0',
      check: nc(0),
      hints: [
        { title: 'ln y = (1/x) ln x, differentiate', formula: "\\frac{y'}{y} = \\frac{1-\\ln x}{x^2} \\implies y' = x^{1/x}\\frac{1-\\ln x}{x^2}" },
        { title: 'At x = e (ln e = 1)', formula: "y'(e) = e^{1/e}\\cdot\\frac{1-1}{e^2} = 0" },
      ],
    },
    {
      id: 'der-8',
      question: 'Related rates — spherical balloon, radius increasing at 2 cm/s. Find dV/dt when r = 5 cm. Enter exact or decimal:',
      latex: 'V = \\tfrac{4}{3}\\pi r^3, \\quad \\tfrac{dr}{dt} = 2 \\text{ cm/s},\\; r = 5',
      answerLatex: '200pi \\approx 628.3',
      check: nc(200 * Math.PI),
      hints: [
        { title: 'Differentiate V = (4/3)πr³ with respect to t', formula: '\\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt}' },
        { title: 'Substitute r = 5, dr/dt = 2', formula: '\\frac{dV}{dt} = 4\\pi(25)(2) = 200\\pi' },
      ],
    },
    {
      id: 'der-9',
      question: 'Simplify first, then differentiate — find f\'(√3/2):',
      latex: 'f(x) = \\tan(\\arcsin x)',
      answerLatex: '8',
      check: nc(8),
      hints: [
        { title: 'Draw a right triangle: if arcsin x = θ, then sin θ = x', body: 'The adjacent side is √(1−x²), so tan θ = x/√(1−x²).' },
        { title: 'Differentiate x/√(1−x²)', formula: "f'(x) = \\frac{\\sqrt{1-x^2}+x^2/\\sqrt{1-x^2}}{1-x^2} = \\frac{1}{(1-x^2)^{3/2}}" },
        { title: 'At x = √3/2: 1−x² = 1/4', formula: "f'\\!\\left(\\tfrac{\\sqrt{3}}{2}\\right) = \\frac{1}{(1/4)^{3/2}} = \\frac{1}{1/8} = 8" },
      ],
    },
    {
      id: 'der-10',
      question: 'Implicit — find dy/dx at (π/6, π/3):',
      latex: '\\sin x + \\cos y = \\dfrac{1}{2}',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Differentiate both sides', formula: "\\cos x - \\sin y\\,y' = 0 \\implies y' = \\frac{\\cos x}{\\sin y}" },
        { title: 'At (π/6, π/3)', formula: "y' = \\frac{\\cos(\\pi/6)}{\\sin(\\pi/3)} = \\frac{\\sqrt{3}/2}{\\sqrt{3}/2} = 1" },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // APPLICATIONS OF DERIVATIVES
  // ─────────────────────────────────────────────
  appDerivatives: [
    {
      id: 'adr-1',
      question: 'Find the exact maximum value of f on [0, 1]:',
      latex: 'f(x) = x^3(1-x)',
      answerLatex: '27/256 \\approx 0.1055',
      check: nc(27 / 256),
      hints: [
        { title: 'Find critical points', formula: "f'(x) = x^2(3-4x) = 0 \\implies x = 0,\\,\\frac{3}{4}" },
        { title: 'Evaluate at x = 3/4', formula: 'f\\!\\left(\\tfrac{3}{4}\\right) = \\left(\\tfrac{3}{4}\\right)^3\\!\\left(\\tfrac{1}{4}\\right) = \\frac{27}{64}\\cdot\\frac{1}{4} = \\frac{27}{256}' },
      ],
    },
    {
      id: 'adr-2',
      question: 'Newton\'s Method — one step. Starting at x₀ = 1, find x₁ for the equation x² = 2:',
      latex: 'x_1 = x_0 - \\dfrac{f(x_0)}{f\'(x_0)}, \\quad f(x)=x^2-2',
      answerLatex: '3/2',
      check: nc(1.5),
      hints: [
        { title: 'Compute f(x₀) and f\'(x₀)', formula: 'f(1) = -1,\\quad f\'(1) = 2' },
        { title: 'Apply Newton\'s step', formula: 'x_1 = 1 - \\frac{-1}{2} = \\frac{3}{2}' },
      ],
    },
    {
      id: 'adr-3',
      question: 'Find the maximum value of f on [0, 2π] (enter exact or decimal):',
      latex: 'f(x) = 2\\sin x + \\sin 2x',
      answerLatex: '3sqrt(3)/2 \\approx 2.598',
      check: nc(3 * Math.sqrt(3) / 2),
      hints: [
        { title: 'Find critical points', formula: "f'(x) = 2\\cos x+2\\cos 2x = 2(\\cos x + 2\\cos^2x-1) = 2(2\\cos x-1)(\\cos x+1) = 0" },
        { title: 'Critical point at x = π/3 in (0, 2π)', formula: 'f(\\pi/3) = 2\\sin(\\pi/3)+\\sin(2\\pi/3) = \\sqrt{3}+\\frac{\\sqrt{3}}{2} = \\frac{3\\sqrt{3}}{2}' },
      ],
    },
    {
      id: 'adr-4',
      question: 'Mean Value Theorem — find c ∈ (0, π):',
      latex: 'f(x) = \\sin x, \\quad [0,\\,\\pi]',
      answerLatex: 'pi/2 \\approx 1.5708',
      check: nc(Math.PI / 2),
      hints: [
        { title: 'MVT requires f\'(c) = [f(π)−f(0)]/(π−0)', formula: '\\cos c = \\frac{0-0}{\\pi} = 0' },
        { title: 'Solve cos c = 0 in (0, π)', formula: 'c = \\frac{\\pi}{2}' },
      ],
    },
    {
      id: 'adr-5',
      question: 'Conical tank (r = h always) is filled at 3 cm³/s. Find dh/dt when h = 4 cm. Enter exact or decimal:',
      latex: 'V = \\tfrac{1}{3}\\pi h^3,\\quad \\tfrac{dV}{dt}=3,\\;h=4',
      answerLatex: '3/(16pi) \\approx 0.0597',
      check: nc(3 / (16 * Math.PI)),
      hints: [
        { title: 'Differentiate V = (1/3)πh³', formula: '\\frac{dV}{dt} = \\pi h^2 \\frac{dh}{dt}' },
        { title: 'Solve for dh/dt at h = 4', formula: '\\frac{dh}{dt} = \\frac{3}{\\pi\\cdot 16} = \\frac{3}{16\\pi}' },
      ],
    },
    {
      id: 'adr-6',
      question: 'Find the x-coordinate of the absolute maximum of:',
      latex: 'f(x) = x\\,e^{-x^2}',
      answerLatex: '1/sqrt(2) \\approx 0.707',
      check: nc(1 / Math.sqrt(2)),
      hints: [
        { title: 'Product rule + chain rule', formula: "f'(x) = e^{-x^2}(1-2x^2) = 0" },
        { title: 'Solve', formula: "x = \\frac{1}{\\sqrt{2}} \\quad (x>0 \\text{ gives maximum})" },
      ],
    },
    {
      id: 'adr-7',
      question: 'Second parametric derivative — find d²y/dx² at t = π/4 for:',
      latex: 'x = \\sin t, \\quad y = \\cos t',
      answerLatex: '-2sqrt(2) \\approx -2.828',
      check: nc(-2 * Math.sqrt(2)),
      hints: [
        { title: 'First derivative dy/dx', formula: "\\frac{dy}{dx} = \\frac{-\\sin t}{\\cos t} = -\\tan t" },
        { title: 'Second derivative', formula: "\\frac{d^2y}{dx^2} = \\frac{d(-\\tan t)/dt}{dx/dt} = \\frac{-\\sec^2 t}{\\cos t} = -\\sec^3 t" },
        { title: 'At t = π/4: sec(π/4) = √2', formula: '-\\left(\\sqrt{2}\\right)^3 = -2\\sqrt{2}' },
      ],
    },
    {
      id: 'adr-8',
      question: 'Use linear approximation to estimate (1.02)¹⁰:',
      latex: '(1+x)^{10}\\bigg|_{x=0.02}',
      answerLatex: '1.2',
      check: nc(1.2),
      hints: [
        { title: 'Linear approximation of (1+x)^n near x = 0', formula: '(1+x)^{10} \\approx 1 + 10x' },
        { title: 'Plug in x = 0.02', formula: '1 + 10(0.02) = 1.2' },
      ],
    },
    {
      id: 'adr-9',
      question: 'Optimization — cylindrical can holds volume 16π cm³. Find the radius that minimizes total surface area:',
      latex: 'V = \\pi r^2 h = 16\\pi,\\quad S = 2\\pi r^2 + 2\\pi r h',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Express h in terms of r', formula: 'h = 16/r^2' },
        { title: 'Substitute into S', formula: 'S(r) = 2\\pi r^2 + 32\\pi/r' },
        { title: 'Minimize', formula: "S'(r) = 4\\pi r - 32\\pi/r^2 = 0 \\implies r^3 = 8 \\implies r = 2" },
      ],
    },
    {
      id: 'adr-10',
      question: 'Find the positive x-value of the inflection point of:',
      latex: 'f(x) = x^4 - 6x^2',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Find f\'\'(x)', formula: "f'(x)=4x^3-12x,\\quad f''(x)=12x^2-12" },
        { title: 'Set f\'\'= 0 and solve', formula: "12(x^2-1)=0 \\implies x=\\pm 1" },
        { title: 'Confirm sign change at x = 1 (inflection point)', formula: 'x = 1 \\text{ is the positive inflection point}' },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // INTEGRATION  (u-sub, IBP, trig, partial fractions)
  // ─────────────────────────────────────────────
  integrals: [
    {
      id: 'int-1',
      question: 'Evaluate using u-substitution (enter exact or decimal):',
      latex: '\\int_0^1 \\dfrac{x^2}{x^3+1}\\,dx',
      answerLatex: 'log(2)/3 \\approx 0.231',
      check: nc(Math.log(2) / 3),
      hints: [
        { title: 'Let u = x³ + 1, du = 3x² dx', formula: '\\frac{1}{3}\\int_1^2 \\frac{du}{u} = \\frac{\\ln 2}{3}' },
      ],
    },
    {
      id: 'int-2',
      question: 'Evaluate using trig identity and u-substitution:',
      latex: '\\int_0^{\\pi/2} \\sin^2 x\\cos^3 x\\,dx',
      answerLatex: '2/15',
      check: nc(2 / 15),
      hints: [
        { title: 'Write cos³x = (1−sin²x)cosx, then u = sin x', formula: '\\int_0^1 u^2(1-u^2)\\,du = \\left[\\frac{u^3}{3}-\\frac{u^5}{5}\\right]_0^1' },
        { title: 'Evaluate', formula: '\\frac{1}{3}-\\frac{1}{5} = \\frac{2}{15}' },
      ],
    },
    {
      id: 'int-3',
      question: 'Evaluate using integration by parts (enter exact or decimal):',
      latex: '\\int_0^1 x\\arctan x\\,dx',
      answerLatex: 'pi/4 - 1/2 \\approx 0.285',
      check: nc(Math.PI / 4 - 0.5),
      hints: [
        { title: 'IBP: u = arctan x, dv = x dx', formula: '\\left[\\frac{x^2}{2}\\arctan x\\right]_0^1 - \\int_0^1\\frac{x^2}{2(1+x^2)}\\,dx' },
        { title: 'Simplify the remaining integral', formula: '\\frac{\\pi}{8} - \\frac{1}{2}\\int_0^1\\!\\left(1-\\frac{1}{1+x^2}\\right)dx = \\frac{\\pi}{8} - \\frac{1}{2}\\left[1-\\frac{\\pi}{4}\\right] = \\frac{\\pi}{4}-\\frac{1}{2}' },
      ],
    },
    {
      id: 'int-4',
      question: 'Two rounds of integration by parts — evaluate (enter exact or decimal):',
      latex: '\\int_0^\\pi e^x \\sin x\\,dx',
      answerLatex: '(e^pi+1)/2 \\approx 12.07',
      check: nc((Math.E ** Math.PI + 1) / 2),
      hints: [
        { title: 'Standard result for ∫eˣsin x dx', formula: '\\int e^x\\sin x\\,dx = \\frac{e^x(\\sin x-\\cos x)}{2}+C' },
        { title: 'Apply FTC', formula: '\\left[\\frac{e^x(\\sin x-\\cos x)}{2}\\right]_0^\\pi = \\frac{e^\\pi(0+1)}{2} - \\frac{1(0-1)}{2} = \\frac{e^\\pi+1}{2}' },
      ],
    },
    {
      id: 'int-5',
      question: 'Improper integral — u-substitution then gamma-like form (enter exact or decimal):',
      latex: '\\int_0^{\\infty} x^3 e^{-x^2}\\,dx',
      answerLatex: '1/2',
      check: nc(0.5),
      hints: [
        { title: 'Let u = x², du = 2x dx; also x² = u', formula: '\\int_0^\\infty x^3 e^{-x^2}\\,dx = \\frac{1}{2}\\int_0^\\infty u\\,e^{-u}\\,du' },
        { title: 'Recall ∫₀^∞ u·e⁻ᵘ du = Γ(2) = 1', formula: '\\frac{1}{2}\\cdot 1 = \\frac{1}{2}' },
      ],
    },
    {
      id: 'int-6',
      question: 'Geometric interpretation / trig substitution — evaluate (enter exact or decimal):',
      latex: '\\int_0^2 \\sqrt{4-x^2}\\,dx',
      answerLatex: 'pi \\approx 3.14159',
      check: nc(Math.PI),
      hints: [
        { title: 'Recognize the geometry', body: 'y = √(4−x²) is the upper half of a circle of radius 2. The integral from 0 to 2 is one quarter of the circle\'s area.' },
        { title: 'Quarter-circle area', formula: '\\frac{1}{4}\\pi r^2 = \\frac{\\pi(4)}{4} = \\pi' },
      ],
    },
    {
      id: 'int-7',
      question: 'Partial fractions — evaluate (enter exact or decimal):',
      latex: '\\int_3^4 \\dfrac{2x-1}{(x+1)(x-2)}\\,dx',
      answerLatex: 'log(5/2) \\approx 0.916',
      check: nc(Math.log(2.5)),
      hints: [
        { title: 'Partial fractions', formula: '\\frac{2x-1}{(x+1)(x-2)} = \\frac{A}{x+1}+\\frac{B}{x-2}' },
        { title: 'Solve: A = 1, B = 1', formula: '\\int_3^4\\left(\\frac{1}{x+1}+\\frac{1}{x-2}\\right)dx = [\\ln|x+1|+\\ln|x-2|]_3^4' },
        { title: 'Evaluate', formula: '(\\ln 5+\\ln 2)-(\\ln 4+\\ln 1) = \\ln 10 - \\ln 4 = \\ln\\frac{5}{2}' },
      ],
    },
    {
      id: 'int-8',
      question: 'Two rounds of IBP — evaluate:',
      latex: '\\int_0^1 (\\ln x)^2\\,dx',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'IBP: u = (ln x)², dv = dx', formula: '\\left[x(\\ln x)^2\\right]_0^1 - 2\\int_0^1 \\ln x\\,dx' },
        { title: 'The boundary term = 0 (lim_{x→0⁺} x ln²x = 0); ∫₀¹ ln x dx = −1', formula: '0 - 2(-1) = 2' },
      ],
    },
    {
      id: 'int-9',
      question: 'Trig identity — evaluate (enter exact or decimal):',
      latex: '\\int_0^{\\pi/4} \\tan^2 x\\,dx',
      answerLatex: '1 - pi/4 \\approx 0.2146',
      check: nc(1 - Math.PI / 4),
      hints: [
        { title: 'Use tan²x = sec²x − 1', formula: '\\int_0^{\\pi/4}(\\sec^2 x-1)\\,dx = [\\tan x - x]_0^{\\pi/4}' },
        { title: 'Evaluate', formula: '(1-\\pi/4)-(0) = 1-\\frac{\\pi}{4}' },
      ],
    },
    {
      id: 'int-10',
      question: 'Complete the square, then split the integral — evaluate (enter exact or decimal):',
      latex: '\\int_1^2 \\dfrac{x}{x^2-4x+5}\\,dx',
      answerLatex: 'pi/2 - log(2)/2 \\approx 1.224',
      check: nc(Math.PI / 2 - Math.log(2) / 2),
      hints: [
        { title: 'Complete the square: x²−4x+5 = (x−2)²+1. Let u = x−2.', formula: '\\int_{-1}^{0}\\frac{u+2}{u^2+1}\\,du = \\int\\frac{u}{u^2+1}\\,du + 2\\int\\frac{1}{u^2+1}\\,du' },
        { title: 'Evaluate each part', formula: '\\left[\\frac{\\ln(u^2+1)}{2}+2\\arctan u\\right]_{-1}^{0}' },
        { title: 'Plug in limits', formula: '(0+0)-\\left(\\frac{\\ln 2}{2}-\\frac{\\pi}{2}\\right) = \\frac{\\pi}{2}-\\frac{\\ln 2}{2}' },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // APPLICATIONS OF INTEGRATION
  // ─────────────────────────────────────────────
  appIntegrals: [
    {
      id: 'apint-1',
      question: 'Area between y = x−1 and y = ln x from x=1 to x=e — enter exact or decimal:',
      latex: 'A = \\int_1^e \\bigl[(x-1) - \\ln x\\bigr]\\,dx',
      answerLatex: '(e^2-2e-1)/2 \\approx 0.477',
      check: nc((Math.E ** 2 - 2 * Math.E - 1) / 2),
      hints: [
        { title: 'x−1 ≥ ln x on [1,e] — integrate the difference', formula: '\\int_1^e(x-1-\\ln x)\\,dx = \\left[\\frac{x^2}{2}-x-x\\ln x+x\\right]_1^e = \\left[\\frac{x^2}{2}-x\\ln x\\right]_1^e' },
        { title: 'Evaluate', formula: '\\left(\\frac{e^2}{2}-e\\right)-\\left(\\frac{1}{2}\\right) = \\frac{e^2-2e-1}{2}' },
      ],
    },
    {
      id: 'apint-2',
      question: 'Disk method — volume when y = eˣ on [0,1] is revolved around the x-axis. Enter exact or decimal:',
      latex: 'V = \\pi\\int_0^1 e^{2x}\\,dx',
      answerLatex: 'pi*(e^2-1)/2 \\approx 10.036',
      check: nc(Math.PI * (Math.E ** 2 - 1) / 2),
      hints: [
        { title: 'Disk formula: V = π∫[f(x)]² dx', formula: 'V = \\pi\\int_0^1 e^{2x}\\,dx = \\pi\\left[\\frac{e^{2x}}{2}\\right]_0^1 = \\frac{\\pi(e^2-1)}{2}' },
      ],
    },
    {
      id: 'apint-3',
      question: 'Shell method — volume when y = cos x on [0, π/2] is revolved around the y-axis. Enter exact or decimal:',
      latex: 'V = 2\\pi\\int_0^{\\pi/2} x\\cos x\\,dx',
      answerLatex: 'pi*(pi-2) \\approx 3.586',
      check: nc(Math.PI * (Math.PI - 2)),
      hints: [
        { title: 'IBP: u = x, dv = cos x dx', formula: '[x\\sin x + \\cos x]_0^{\\pi/2}' },
        { title: 'Evaluate', formula: '2\\pi\\left(\\frac{\\pi}{2}-1\\right) = \\pi(\\pi-2)' },
      ],
    },
    {
      id: 'apint-4',
      question: '"Perfect square" arc length — evaluate (enter exact or decimal):',
      latex: 'L = \\int_1^2\\!\\sqrt{1+\\left(\\frac{x^2}{2}-\\frac{1}{2x^2}\\right)^{\\!2}}\\;dx \\quad\\bigl(y = \\tfrac{x^3}{6}+\\tfrac{1}{2x}\\bigr)',
      answerLatex: '17/12 \\approx 1.417',
      check: nc(17 / 12),
      hints: [
        { title: 'Compute y\' and 1+(y\')²', formula: "y' = \\frac{x^2}{2}-\\frac{1}{2x^2},\\quad 1+(y')^2 = \\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)^2" },
        { title: 'Integrate the perfect square', formula: '\\int_1^2\\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)dx = \\left[\\frac{x^3}{6}-\\frac{1}{2x}\\right]_1^2' },
        { title: 'Evaluate', formula: '\\left(\\frac{4}{3}-\\frac{1}{4}\\right)-\\left(\\frac{1}{6}-\\frac{1}{2}\\right) = \\frac{13}{12}+\\frac{4}{12} = \\frac{17}{12}' },
      ],
    },
    {
      id: 'apint-5',
      question: 'Washer method — volume when y=√x and y=x² are revolved around x-axis on [0,1]. Enter exact or decimal:',
      latex: 'V = \\pi\\int_0^1\\!\\left(x-x^4\\right)dx',
      answerLatex: '3*pi/10 \\approx 0.942',
      check: nc(3 * Math.PI / 10),
      hints: [
        { title: 'Outer radius R=√x, inner r=x². Washer formula:', formula: 'V = \\pi\\int_0^1(x-x^4)\\,dx = \\pi\\left[\\frac{x^2}{2}-\\frac{x^5}{5}\\right]_0^1 = \\pi\\left(\\frac{1}{2}-\\frac{1}{5}\\right) = \\frac{3\\pi}{10}' },
      ],
    },
    {
      id: 'apint-6',
      question: 'Polar area — find the total area enclosed by the cardioid (enter exact or decimal):',
      latex: 'r = 2 + 2\\cos\\theta',
      answerLatex: '6*pi \\approx 18.85',
      check: nc(6 * Math.PI),
      hints: [
        { title: 'Polar area formula', formula: 'A = \\frac{1}{2}\\int_0^{2\\pi}(2+2\\cos\\theta)^2\\,d\\theta = \\frac{1}{2}\\int_0^{2\\pi}(4+8\\cos\\theta+4\\cos^2\\theta)\\,d\\theta' },
        { title: 'Only constant and cos² terms survive over [0,2π]', formula: '\\frac{1}{2}(8\\pi + 4\\pi) = 6\\pi' },
      ],
    },
    {
      id: 'apint-7',
      question: 'Spring work — spring constant k = 4 N/m compressed from 0 to 2 m beyond natural length. Find the work (J):',
      latex: 'W = \\int_0^2 4x\\,dx',
      answerLatex: '8',
      check: nc(8),
      hints: [
        { title: 'Hooke\'s Law: F = kx, W = ∫₀² kx dx', formula: '[2x^2]_0^2 = 8\\text{ J}' },
      ],
    },
    {
      id: 'apint-8',
      question: 'Volume by cross-sections — the base is bounded by y=√x and y=0 for 0≤x≤4. Cross-sections perpendicular to x-axis are squares. Find the volume:',
      latex: 'V = \\int_0^4 (\\sqrt{x})^2\\,dx',
      answerLatex: '8',
      check: nc(8),
      hints: [
        { title: 'Side length of each square = √x, area = x', formula: 'V = \\int_0^4 x\\,dx = \\left[\\frac{x^2}{2}\\right]_0^4 = 8' },
      ],
    },
    {
      id: 'apint-9',
      question: 'Evaluate the improper integral:',
      latex: '\\int_1^{\\infty} \\dfrac{1}{x^2}\\,dx',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Evaluate as a limit', formula: '\\lim_{b\\to\\infty}\\left[-\\frac{1}{x}\\right]_1^b = \\lim_{b\\to\\infty}\\left(-\\frac{1}{b}+1\\right) = 1' },
      ],
    },
    {
      id: 'apint-10',
      question: 'Find the average value of f(x) = sin x on [0, π] (enter exact or decimal):',
      latex: '\\bar{f} = \\dfrac{1}{\\pi}\\int_0^{\\pi}\\sin x\\,dx',
      answerLatex: '2/pi \\approx 0.637',
      check: nc(2 / Math.PI),
      hints: [
        { title: 'Integrate and divide by interval length', formula: '\\frac{1}{\\pi}[-\\cos x]_0^\\pi = \\frac{1}{\\pi}(1+1) = \\frac{2}{\\pi}' },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // DIFFERENTIAL EQUATIONS
  // ─────────────────────────────────────────────
  diffEq: [
    {
      id: 'deq-1',
      question: 'Separable ODE with tricky integration. Find y(1) — enter exact or decimal:',
      latex: '(1+x^2)\\,dy = y\\arctan(x)\\,dx, \\quad y(0)=1',
      answerLatex: 'e^(pi^2/32) \\approx 1.361',
      check: nc(Math.E ** (Math.PI ** 2 / 32)),
      hints: [
        { title: 'Separate variables', formula: '\\frac{dy}{y} = \\frac{\\arctan x}{1+x^2}\\,dx' },
        { title: 'Integrate both sides (u = arctan x)', formula: '\\ln y = \\frac{(\\arctan x)^2}{2}+C \\xrightarrow{y(0)=1} C=0' },
        { title: 'At x = 1: arctan(1) = π/4', formula: 'y(1) = e^{\\pi^2/32}' },
      ],
    },
    {
      id: 'deq-2',
      question: 'First-order linear ODE — find y(1) (enter exact or decimal):',
      latex: '\\dfrac{dy}{dx} + 2y = 4x, \\quad y(0)=1',
      answerLatex: '1 + 2*e^(-2) \\approx 1.271',
      check: nc(1 + 2 / Math.E ** 2),
      hints: [
        { title: 'Integrating factor μ = e^{2x}', formula: '\\frac{d}{dx}[e^{2x}y] = 4xe^{2x}' },
        { title: 'Integrate right side by parts, then solve', formula: 'y = 2x - 1 + Ce^{-2x}' },
        { title: 'IC y(0)=1 → C = 2; evaluate y(1)', formula: 'y(1) = 1 + 2e^{-2}' },
      ],
    },
    {
      id: 'deq-3',
      question: 'Stable equilibrium of the autonomous ODE (enter the value):',
      latex: '\\dfrac{dP}{dt} = P(4-P)',
      answerLatex: '4',
      check: nc(4),
      hints: [
        { title: 'Equilibria: P = 0 and P = 4', body: 'Check stability via sign of dP/dt near each equilibrium.' },
        { title: 'Near P = 4: dP/dt < 0 for P > 4 and > 0 for P < 4 → P = 4 is stable.', formula: '\\text{Stable equilibrium: } P = 4' },
      ],
    },
    {
      id: 'deq-4',
      question: 'Newton\'s Cooling — T(t) = 20 + 80e^{−0.1t}. Find T when it is cooling at exactly 4°C/min:',
      latex: "T'(t) = -4",
      answerLatex: '60',
      check: nc(60),
      hints: [
        { title: 'Differentiate T(t)', formula: "T'(t) = -8e^{-0.1t}" },
        { title: 'Set T\'= −4 and solve for t', formula: '-8e^{-0.1t} = -4 \\implies e^{-0.1t} = \\tfrac{1}{2} \\implies t = 10\\ln 2' },
        { title: 'Find T at that time', formula: 'T(10\\ln 2) = 20 + 80\\cdot\\tfrac{1}{2} = 60' },
      ],
    },
    {
      id: 'deq-5',
      question: 'Logistic ODE — find y(ln 2) (enter exact or decimal):',
      latex: '\\dfrac{dy}{dx} = y(1-y), \\quad y(0) = 2',
      answerLatex: '4/3 \\approx 1.333',
      check: nc(4 / 3),
      hints: [
        { title: 'Logistic solution with K=1, r=1', formula: 'y(t) = \\frac{1}{1+(1/y_0-1)e^{-t}} = \\frac{2}{2-e^{-t}}' },
        { title: 'At t = ln 2: e^{−ln 2} = 1/2', formula: 'y(\\ln 2) = \\frac{2}{2-1/2} = \\frac{4}{3}' },
      ],
    },
    {
      id: 'deq-6',
      question: 'Separable — find y(2) (enter exact or decimal):',
      latex: '\\dfrac{dy}{dx} = \\dfrac{2x+1}{2y}, \\quad y(0) = 2',
      answerLatex: 'sqrt(10) \\approx 3.162',
      check: nc(Math.sqrt(10)),
      hints: [
        { title: 'Separate: 2y dy = (2x+1) dx', formula: 'y^2 = x^2+x+C' },
        { title: 'IC y(0)=2 → C = 4', formula: 'y^2 = x^2+x+4 \\implies y(2)=\\sqrt{4+2+4}=\\sqrt{10}' },
      ],
    },
    {
      id: 'deq-7',
      question: 'Second-order ODE with ICs — find y(π/2):',
      latex: 'y\'\' + y = 0, \\quad y(0)=1,\\; y\'(0)=0',
      answerLatex: '0',
      check: nc(0),
      hints: [
        { title: 'General solution: y = A cos x + B sin x', formula: 'y(0)=1 \\implies A=1,\\quad y\'(0)=0 \\implies B=0' },
        { title: 'So y = cos x', formula: 'y(\\pi/2) = \\cos(\\pi/2) = 0' },
      ],
    },
    {
      id: 'deq-8',
      question: 'Logistic model: K = 1000, r = 0.5, P₀ = 100. At what population is the growth rate maximum?',
      latex: '\\dfrac{dP}{dt} = 0.5P\\!\\left(1-\\dfrac{P}{1000}\\right)',
      answerLatex: '500',
      check: nc(500),
      hints: [
        { title: 'Growth rate G(P) = rP(1−P/K) is a downward parabola in P', formula: "G'(P) = r(1-2P/K) = 0 \\implies P = K/2" },
        { title: 'Maximum growth rate at P = K/2 = 500', formula: 'P = 500' },
      ],
    },
    {
      id: 'deq-9',
      question: "Two steps of Euler's Method (h = 0.5). Approximate y(1) for:",
      latex: "\\dfrac{dy}{dx} = y^2, \\quad y(0) = 1",
      answerLatex: '2.625',
      check: nc(2.625),
      hints: [
        { title: 'Step 1: y₁ = y₀ + h·f(x₀,y₀)', formula: 'y_1 = 1 + 0.5(1)^2 = 1.5' },
        { title: 'Step 2: y₂ = y₁ + h·f(x₁,y₁)', formula: 'y_2 = 1.5 + 0.5(1.5)^2 = 1.5+1.125 = 2.625' },
      ],
    },
    {
      id: 'deq-10',
      question: 'Exponential model — y = Ce^{kt} passes through (0, 3) and (2, 12). Find k (enter exact or decimal):',
      latex: 'Ce^{2k} = 12, \\quad C = 3',
      answerLatex: 'log(2) \\approx 0.693',
      check: nc(Math.log(2)),
      hints: [
        { title: 'At (0,3): C = 3. At (2,12): 3e^{2k} = 12', formula: 'e^{2k} = 4 \\implies 2k = \\ln 4 \\implies k = \\ln 2' },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // PARAMETRIC & POLAR
  // ─────────────────────────────────────────────
  parametric: [
    {
      id: 'par-1',
      question: 'Area under one arch of the cycloid (enter exact or decimal):',
      latex: 'x = t - \\sin t,\\quad y = 1-\\cos t,\\quad 0\\le t\\le 2\\pi',
      answerLatex: '3*pi \\approx 9.425',
      check: nc(3 * Math.PI),
      hints: [
        { title: 'Area = ∫y dx = ∫₀^{2π} y(dx/dt) dt', formula: '\\int_0^{2\\pi}(1-\\cos t)^2\\,dt' },
        { title: 'Expand: ∫(1−2cos t + cos²t) dt over [0,2π]', formula: '2\\pi - 0 + \\pi = 3\\pi' },
      ],
    },
    {
      id: 'par-2',
      question: 'Archimedean spiral — area swept from θ=0 to 2π (enter exact or decimal):',
      latex: 'r = \\theta',
      answerLatex: '4*pi^3/3 \\approx 41.34',
      check: nc(4 * Math.PI ** 3 / 3),
      hints: [
        { title: 'Polar area formula', formula: 'A = \\frac{1}{2}\\int_0^{2\\pi}\\theta^2\\,d\\theta = \\frac{1}{2}\\cdot\\frac{(2\\pi)^3}{3} = \\frac{4\\pi^3}{3}' },
      ],
    },
    {
      id: 'par-3',
      question: 'Speed of the curve r(t) = ⟨eᵗcos t, eᵗsin t⟩ at t = 0 (enter exact or decimal):',
      latex: '\\mathbf{r}(t) = \\langle e^t\\!\\cos t,\\, e^t\\!\\sin t\\rangle',
      answerLatex: 'sqrt(2) \\approx 1.414',
      check: nc(Math.SQRT2),
      hints: [
        { title: 'Differentiate each component', formula: "x' = e^t(\\cos t-\\sin t),\\quad y' = e^t(\\sin t+\\cos t)" },
        { title: '|v|² = e^{2t}[(cos t−sin t)²+(sin t+cos t)²] = 2e^{2t}', formula: '|\\mathbf{v}(t)| = e^t\\sqrt{2} \\implies |\\mathbf{v}(0)| = \\sqrt{2}' },
      ],
    },
    {
      id: 'par-4',
      question: 'Total area of the 3-petal rose (enter exact or decimal):',
      latex: 'r = \\sin(3\\theta)',
      answerLatex: 'pi/4 \\approx 0.785',
      check: nc(Math.PI / 4),
      hints: [
        { title: 'Area of one petal (θ from 0 to π/3)', formula: 'A_1 = \\frac{1}{2}\\int_0^{\\pi/3}\\sin^2(3\\theta)\\,d\\theta = \\frac{\\pi}{12}' },
        { title: 'Total = 3 × area of one petal', formula: '3\\cdot\\frac{\\pi}{12} = \\frac{\\pi}{4}' },
      ],
    },
    {
      id: 'par-5',
      question: 'Area inside r = 2cos θ and outside r = 1 (enter exact or decimal):',
      latex: '\\text{Inside } r=2\\cos\\theta,\\text{ outside }r=1',
      answerLatex: 'pi/3 + sqrt(3)/2 \\approx 1.913',
      check: nc(Math.PI / 3 + Math.sqrt(3) / 2),
      hints: [
        { title: 'Find intersection: 2cosθ = 1 → θ = ±π/3', formula: 'A = \\int_0^{\\pi/3}\\left[(2\\cos\\theta)^2 - 1^2\\right]d\\theta' },
        { title: 'Simplify', formula: '\\int_0^{\\pi/3}(1+2\\cos 2\\theta)\\,d\\theta = \\left[\\theta+\\sin 2\\theta\\right]_0^{\\pi/3} = \\frac{\\pi}{3}+\\frac{\\sqrt{3}}{2}' },
      ],
    },
    {
      id: 'par-6',
      question: 'Find dy/dx for the astroid at t = π/6 (enter exact or decimal):',
      latex: 'x = \\cos^3 t,\\quad y = \\sin^3 t',
      answerLatex: '-1/sqrt(3) \\approx -0.577',
      check: nc(-1 / Math.sqrt(3)),
      hints: [
        { title: 'Compute derivatives', formula: "x' = -3\\cos^2 t\\sin t,\\quad y' = 3\\sin^2 t\\cos t" },
        { title: 'Ratio', formula: "\\frac{dy}{dx} = \\frac{3\\sin^2 t\\cos t}{-3\\cos^2 t\\sin t} = -\\tan t" },
        { title: 'At t = π/6: −tan(π/6) = −1/√3', formula: '-\\frac{1}{\\sqrt{3}}' },
      ],
    },
    {
      id: 'par-7',
      question: 'Arc length of r = eᶿ from θ = 0 to π (enter exact or decimal):',
      latex: 'r = e^\\theta, \\quad 0 \\le \\theta \\le \\pi',
      answerLatex: 'sqrt(2)*(e^pi-1) \\approx 18.46',
      check: nc(Math.SQRT2 * (Math.E ** Math.PI - 1)),
      hints: [
        { title: 'Polar arc length', formula: 'L = \\int_0^\\pi\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta = \\int_0^\\pi\\sqrt{2}\\,e^\\theta\\,d\\theta' },
        { title: 'Integrate', formula: '\\sqrt{2}[e^\\theta]_0^\\pi = \\sqrt{2}(e^\\pi-1)' },
      ],
    },
    {
      id: 'par-8',
      question: 'Curvature of y = x² at the origin:',
      latex: '\\kappa = \\dfrac{|f\'\'|}{\\left(1+(f\')^2\\right)^{3/2}}',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: "f'(0) = 0, f''(0) = 2", formula: '\\kappa(0) = \\frac{|2|}{(1+0)^{3/2}} = 2' },
      ],
    },
    {
      id: 'par-9',
      question: 'Find d²y/dx² at t = 0 for r(t) = ⟨t²−1, 2t⟩:',
      latex: '\\mathbf{r}(t) = \\langle t^2-1,\\,2t\\rangle',
      answerLatex: '1/2',
      check: nc(0.5),
      hints: [
        { title: "x'=2t, y'=2; dy/dx = 2/(2t) = 1/t at t≠0. Near t=0 use the limit approach.", body: "Actually dy/dx = 1/t for t≠0. d(1/t)/dt = −1/t². Divide by dx/dt = 2t." },
        { title: 'd²y/dx² = (d(dy/dx)/dt)/(dx/dt)', formula: '\\frac{-1/t^2}{2t}\\bigg|_{t\\to0^+}\\text{ — use } \\kappa \\text{ formula instead:}' },
        { title: 'Curvature method: |x\'y\'\'−x\'\'y\'|/|v|³ = |2·0−2·2|/(|2t,2|)³; at t=0: 4/8 = 1/2', formula: '\\kappa = \\frac{1}{2}' },
      ],
    },
    {
      id: 'par-10',
      question: 'Find dy/dx for r = sin(2θ) at θ = π/4 (enter exact or decimal):',
      latex: 'r = \\sin 2\\theta',
      answerLatex: '-1',
      check: nc(-1),
      hints: [
        { title: 'Convert: x = r cosθ, y = r sinθ. At θ=π/4: r = sin(π/2)=1, point is (cos(π/4), sin(π/4))=(...)', formula: 'y = r\\sin\\theta = \\sin 2\\theta\\sin\\theta,\\quad x = \\sin 2\\theta\\cos\\theta' },
        { title: 'Differentiate numerator and denominator with respect to θ and form dy/dx', body: 'At θ=π/4: dr/dθ = 2cos(π/2)=0, r=1. So dy/dx = (r cosθ)/(−r sinθ) = cosθ/(−sinθ) = −1.' },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // SEQUENCES & SERIES
  // ─────────────────────────────────────────────
  series: [
    {
      id: 'ser-1',
      question: 'Evaluate using differentiation of the geometric series:',
      latex: '\\sum_{n=0}^{\\infty} \\dfrac{n+1}{2^n}',
      answerLatex: '4',
      check: nc(4),
      hints: [
        { title: 'Use Σ(n+1)rⁿ = 1/(1−r)²', formula: '\\sum_{n=0}^\\infty(n+1)r^n = \\frac{1}{(1-r)^2}' },
        { title: 'At r = 1/2', formula: '\\frac{1}{(1/2)^2} = 4' },
      ],
    },
    {
      id: 'ser-2',
      question: 'Telescoping series — evaluate:',
      latex: '\\sum_{n=2}^{\\infty} \\dfrac{1}{n^2-1}',
      answerLatex: '3/4',
      check: nc(0.75),
      hints: [
        { title: 'Partial fractions', formula: '\\frac{1}{n^2-1} = \\frac{1}{2}\\left(\\frac{1}{n-1}-\\frac{1}{n+1}\\right)' },
        { title: 'Telescoping sum (first two terms survive)', formula: 'S = \\frac{1}{2}\\left(1+\\frac{1}{2}\\right) = \\frac{3}{4}' },
      ],
    },
    {
      id: 'ser-3',
      question: 'Differentiation of a power series — evaluate:',
      latex: '\\sum_{n=0}^{\\infty} \\dfrac{n+1}{3^n}',
      answerLatex: '9/4',
      check: nc(9 / 4),
      hints: [
        { title: 'Same formula: Σ(n+1)rⁿ = 1/(1−r)²', formula: '\\frac{1}{(1-1/3)^2} = \\frac{1}{(2/3)^2} = \\frac{9}{4}' },
      ],
    },
    {
      id: 'ser-4',
      question: 'Radius of convergence of the factorial series (enter the value):',
      latex: '\\sum_{n=1}^{\\infty} n!\\,x^n',
      answerLatex: '0',
      check: nc(0),
      hints: [
        { title: 'Ratio Test', formula: '\\lim_{n\\to\\infty}\\frac{(n+1)!|x|^{n+1}}{n!|x|^n} = (n+1)|x| \\to \\infty \\text{ for any }x\\ne0' },
        { title: 'Series diverges for all x ≠ 0', formula: 'R = 0' },
      ],
    },
    {
      id: 'ser-5',
      question: 'Combine two geometric series and find the sum:',
      latex: '\\sum_{n=1}^{\\infty} \\dfrac{2^n + 3^n}{6^n}',
      answerLatex: '3/2',
      check: nc(1.5),
      hints: [
        { title: 'Split into two geometric series', formula: '\\sum_{n=1}^\\infty\\left(\\frac{1}{3}\\right)^n + \\sum_{n=1}^\\infty\\left(\\frac{1}{2}\\right)^n = \\frac{1/3}{2/3}+\\frac{1/2}{1/2}' },
        { title: 'Evaluate', formula: '\\frac{1}{2}+1 = \\frac{3}{2}' },
      ],
    },
    {
      id: 'ser-6',
      question: 'Evaluate using the Maclaurin series of cos x:',
      latex: '\\sum_{n=0}^{\\infty} \\dfrac{(-1)^n \\pi^{2n}}{(2n)!}',
      answerLatex: '-1',
      check: nc(-1),
      hints: [
        { title: 'Recognize the cos series evaluated at x = π', formula: '\\cos x = \\sum_{n=0}^\\infty\\frac{(-1)^n x^{2n}}{(2n)!} \\implies \\cos\\pi = -1' },
      ],
    },
    {
      id: 'ser-7',
      question: 'Find the length of the interval of convergence of:',
      latex: '\\sum_{n=1}^{\\infty} \\dfrac{(x-2)^n}{n}',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Ratio test gives |x−2| < 1 → radius R = 1, center x = 2', formula: '\\text{Convergence: } 1 < x < 3 \\text{ (check endpoints)}' },
        { title: 'At x=1: alternating harmonic (converges). At x=3: harmonic (diverges). Interval = [1,3).', formula: '\\text{Length} = 3 - 1 = 2' },
      ],
    },
    {
      id: 'ser-8',
      question: 'Find f⁽⁶⁾(0) using the Maclaurin series for sin(x²):',
      latex: 'f(x) = \\sin(x^2)',
      answerLatex: '-120',
      check: nc(-120),
      hints: [
        { title: 'Substitute u = x² into sin u series', formula: '\\sin(x^2) = x^2 - \\frac{x^6}{6} + \\frac{x^{10}}{120} - \\cdots' },
        { title: 'Coefficient of x⁶ is −1/6 = f⁽⁶⁾(0)/6!', formula: 'f^{(6)}(0) = -\\frac{6!}{6} = -\\frac{720}{6} = -120' },
      ],
    },
    {
      id: 'ser-9',
      question: 'Use the power series for 1/(1−x)² to evaluate (enter exact or decimal):',
      latex: '\\sum_{n=0}^{\\infty} \\dfrac{n+1}{(-2)^n}',
      answerLatex: '4/9 \\approx 0.444',
      check: nc(4 / 9),
      hints: [
        { title: 'Σ(n+1)rⁿ = 1/(1−r)² at r = −1/2', formula: '\\frac{1}{(1-(-1/2))^2} = \\frac{1}{(3/2)^2} = \\frac{4}{9}' },
      ],
    },
    {
      id: 'ser-10',
      question: 'Find the sum using the integral of a geometric series (enter exact or decimal):',
      latex: '\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n \\cdot 2^n}',
      answerLatex: 'log(3/2) \\approx 0.405',
      check: nc(Math.log(1.5)),
      hints: [
        { title: 'Recall ln(1+x) = Σ(−1)^{n+1}xⁿ/n for |x|≤1, x≠−1', formula: '\\sum_{n=1}^\\infty\\frac{(-1)^{n+1}}{n\\cdot 2^n} = \\ln\\!\\left(1+\\frac{1}{2}\\right) = \\ln\\frac{3}{2}' },
      ],
    },
  ],
}
