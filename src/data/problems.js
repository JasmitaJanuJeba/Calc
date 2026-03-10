import * as math from 'mathjs'

// Numeric answer checker — evaluates input as a mathjs expression
const nc = (expected) => (input) => {
  try {
    const val = +math.evaluate(String(input).trim())
    if (!isFinite(val)) return false
    return Math.abs(val - expected) <= Math.max(0.01, Math.abs(expected) * 0.01)
  } catch { return false }
}

export const PROBLEMS = {
  limits: [
    {
      id: 'lim-1',
      question: 'Evaluate the limit:',
      latex: '\\lim_{x \\to 2} \\dfrac{x^2-4}{x-2}',
      answerLatex: '4',
      check: nc(4),
      hints: [
        { title: 'Check for indeterminate form', body: 'Substitute x = 2 directly:', formula: '\\frac{2^2-4}{2-2} = \\frac{0}{0}' },
        { title: 'Factor the numerator', body: 'Use difference of squares:', formula: 'x^2-4 = (x+2)(x-2)' },
        { title: 'Cancel and evaluate', formula: '\\lim_{x\\to 2}\\frac{(x+2)\\cancel{(x-2)}}{\\cancel{(x-2)}} = \\lim_{x\\to 2}(x+2) = 4' },
      ],
    },
    {
      id: 'lim-2',
      question: 'Evaluate the famous limit:',
      latex: '\\lim_{x \\to 0} \\dfrac{\\sin x}{x}',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Recognize the form', body: 'Direct substitution gives 0/0. This is one of the most important limits in calculus.' },
        { title: "Apply L'Hôpital's Rule", body: 'Differentiate numerator and denominator:', formula: '\\lim_{x\\to 0}\\frac{\\cos x}{1} = \\cos 0 = 1' },
      ],
    },
    {
      id: 'lim-3',
      question: 'Find the limit at infinity:',
      latex: '\\lim_{x \\to \\infty} \\dfrac{3x^2 + 2x}{x^2 - 1}',
      answerLatex: '3',
      check: nc(3),
      hints: [
        { title: 'Divide by the highest power', body: 'Divide numerator and denominator by x²:', formula: '\\frac{3 + 2/x}{1 - 1/x^2}' },
        { title: 'Take the limit', body: 'As x → ∞, all 1/x terms → 0:', formula: '\\frac{3 + 0}{1 - 0} = 3' },
      ],
    },
    {
      id: 'lim-4',
      question: 'Evaluate:',
      latex: '\\lim_{x \\to 3} \\dfrac{x^2-9}{x-3}',
      answerLatex: '6',
      check: nc(6),
      hints: [
        { title: 'Factor the numerator', formula: 'x^2-9 = (x+3)(x-3)' },
        { title: 'Cancel and substitute', formula: '\\lim_{x\\to3}\\frac{(x+3)\\cancel{(x-3)}}{\\cancel{(x-3)}} = \\lim_{x\\to3}(x+3) = 6' },
      ],
    },
    {
      id: 'lim-5',
      question: "Apply L'Hôpital's Rule:",
      latex: '\\lim_{x \\to 0} \\dfrac{e^x - 1}{x}',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Identify 0/0 form', body: "Substituting x = 0 gives (1−1)/0 = 0/0. L'Hôpital's Rule applies." },
        { title: 'Differentiate top and bottom', formula: '\\lim_{x\\to 0}\\frac{e^x}{1} = e^0 = 1' },
      ],
    },
    {
      id: 'lim-6',
      question: 'Evaluate:',
      latex: '\\lim_{x \\to 1} \\dfrac{x^3-1}{x^2-1}',
      answerLatex: '3/2',
      check: nc(1.5),
      hints: [
        { title: 'Factor both', formula: 'x^3-1=(x-1)(x^2+x+1), \\quad x^2-1=(x-1)(x+1)' },
        { title: 'Cancel (x−1) and substitute', formula: '\\frac{x^2+x+1}{x+1}\\bigg|_{x=1} = \\frac{3}{2}' },
      ],
    },
    {
      id: 'lim-7',
      question: 'Evaluate using the squeeze theorem or two applications of L\'Hôpital\'s:',
      latex: '\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2}',
      answerLatex: '1/2',
      check: nc(0.5),
      hints: [
        { title: "First L'Hôpital application", formula: '\\lim_{x\\to 0}\\frac{\\sin x}{2x}' },
        { title: "Second L'Hôpital application", formula: '\\lim_{x\\to 0}\\frac{\\cos x}{2} = \\frac{1}{2}' },
      ],
    },
    {
      id: 'lim-8',
      question: 'Find the one-sided limit:',
      latex: '\\lim_{x \\to 0^+} x \\ln x',
      answerLatex: '0',
      check: nc(0),
      hints: [
        { title: 'Rewrite as a fraction', body: '0·(−∞) form. Rewrite:', formula: 'x\\ln x = \\frac{\\ln x}{1/x} \\quad (-\\infty / \\infty)' },
        { title: "Apply L'Hôpital's Rule", formula: '\\lim_{x\\to 0^+}\\frac{1/x}{-1/x^2} = \\lim_{x\\to 0^+}(-x) = 0' },
      ],
    },
    {
      id: 'lim-9',
      question: 'Evaluate:',
      latex: '\\lim_{x \\to \\pi} \\dfrac{\\sin x}{x - \\pi}',
      answerLatex: '-1',
      check: nc(-1),
      hints: [
        { title: 'Substitute u = x − π', body: 'As x → π, u → 0. Use sin(u + π) = −sin(u):', formula: '\\lim_{u\\to 0}\\frac{-\\sin u}{u} = -1' },
      ],
    },
    {
      id: 'lim-10',
      question: 'Find the value (enter exact form like e^2 or decimal):',
      latex: '\\lim_{x \\to \\infty} \\left(1 + \\dfrac{2}{x}\\right)^x',
      answerLatex: 'e^2 \\approx 7.389',
      check: nc(Math.E ** 2),
      hints: [
        { title: 'Recall the fundamental limit', formula: '\\lim_{x\\to\\infty}\\left(1+\\frac{1}{x}\\right)^x = e' },
        { title: 'Let t = x/2, so x = 2t', formula: '\\left(1+\\frac{2}{x}\\right)^x = \\left[\\left(1+\\frac{1}{t}\\right)^t\\right]^2 \\to e^2' },
      ],
    },
  ],

  derivatives: [
    {
      id: 'der-1',
      question: "Find f'(2) if:",
      latex: 'f(x) = 3x^4 - 2x^2 + 5',
      answerLatex: '88',
      check: nc(88),
      hints: [
        { title: 'Apply the Power Rule', formula: "f'(x) = 12x^3 - 4x" },
        { title: 'Substitute x = 2', formula: "f'(2) = 12(8) - 4(2) = 96 - 8 = 88" },
      ],
    },
    {
      id: 'der-2',
      question: "Find f'(π/6) if:",
      latex: 'f(x) = \\sin(3x)',
      answerLatex: '0',
      check: nc(0),
      hints: [
        { title: 'Chain Rule: d/dx[sin(u)] = cos(u)·u\'', formula: "f'(x) = 3\\cos(3x)" },
        { title: 'Substitute x = π/6', formula: "f'(\\pi/6) = 3\\cos(\\pi/2) = 3 \\cdot 0 = 0" },
      ],
    },
    {
      id: 'der-3',
      question: "Find f'(0) if:",
      latex: 'f(x) = xe^x',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Product Rule: (uv)\' = u\'v + uv\'', formula: "f'(x) = e^x + xe^x = e^x(1+x)" },
        { title: 'Substitute x = 0', formula: "f'(0) = e^0(1) = 1" },
      ],
    },
    {
      id: 'der-4',
      question: "Find f'(0) if:",
      latex: 'f(x) = \\ln(2x+1)',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Chain Rule: d/dx[ln u] = u\'/u', formula: "f'(x) = \\frac{2}{2x+1}" },
        { title: 'Substitute x = 0', formula: "f'(0) = \\frac{2}{1} = 2" },
      ],
    },
    {
      id: 'der-5',
      question: "Find f'(1) if:",
      latex: 'f(x) = (x^2+1)^5',
      answerLatex: '160',
      check: nc(160),
      hints: [
        { title: 'Chain Rule: d/dx[u^n] = n·u^(n−1)·u\'', formula: "f'(x) = 5(x^2+1)^4 \\cdot 2x = 10x(x^2+1)^4" },
        { title: 'Substitute x = 1', formula: "f'(1) = 10(1)(2)^4 = 10 \\cdot 16 = 160" },
      ],
    },
    {
      id: 'der-6',
      question: "Find f'(1) if:",
      latex: 'f(x) = \\arctan(x^2)',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'd/dx[arctan u] = u\'/(1+u²)', formula: "f'(x) = \\frac{2x}{1+x^4}" },
        { title: 'Substitute x = 1', formula: "f'(1) = \\frac{2}{1+1} = 1" },
      ],
    },
    {
      id: 'der-7',
      question: "Find f'(e) if:",
      latex: 'f(x) = x^2 \\ln x',
      answerLatex: '3e \\approx 8.155',
      check: nc(3 * Math.E),
      hints: [
        { title: 'Product Rule', formula: "f'(x) = 2x\\ln x + x^2 \\cdot \\frac{1}{x} = 2x\\ln x + x" },
        { title: 'Substitute x = e (ln e = 1)', formula: "f'(e) = 2e(1) + e = 3e" },
      ],
    },
    {
      id: 'der-8',
      question: "Find f'(1) if:",
      latex: 'f(x) = \\dfrac{x}{x+1}',
      answerLatex: '1/4',
      check: nc(0.25),
      hints: [
        { title: 'Quotient Rule: (u/v)\' = (u\'v − uv\')/v²', formula: "f'(x) = \\frac{(x+1)-x}{(x+1)^2} = \\frac{1}{(x+1)^2}" },
        { title: 'Substitute x = 1', formula: "f'(1) = \\frac{1}{4}" },
      ],
    },
    {
      id: 'der-9',
      question: "Find f'(4) if:",
      latex: 'f(x) = \\sqrt{x^2+9}',
      answerLatex: '4/5',
      check: nc(0.8),
      hints: [
        { title: 'Rewrite and apply Chain Rule', formula: "f'(x) = \\frac{x}{\\sqrt{x^2+9}}" },
        { title: 'Substitute x = 4', formula: "f'(4) = \\frac{4}{\\sqrt{25}} = \\frac{4}{5}" },
      ],
    },
    {
      id: 'der-10',
      question: "Find f'(π) if (enter exact form like -pi or decimal):",
      latex: 'f(x) = x\\sin x',
      answerLatex: '-\\pi \\approx -3.14',
      check: nc(-Math.PI),
      hints: [
        { title: 'Product Rule', formula: "f'(x) = \\sin x + x\\cos x" },
        { title: 'Substitute x = π (sin π = 0, cos π = −1)', formula: "f'(\\pi) = 0 + \\pi(-1) = -\\pi" },
      ],
    },
  ],

  appDerivatives: [
    {
      id: 'adr-1',
      question: "Find f''(−1) if:",
      latex: 'f(x) = x^3 - 3x',
      answerLatex: '-6',
      check: nc(-6),
      hints: [
        { title: "Find f'(x)", formula: "f'(x) = 3x^2 - 3" },
        { title: "Find f''(x)", formula: "f''(x) = 6x" },
        { title: 'Substitute x = −1', formula: "f''(-1) = -6" },
      ],
    },
    {
      id: 'adr-2',
      question: 'A rectangle has perimeter 20 m. What is the maximum possible area (m²)?',
      latex: 'P = 2l + 2w = 20',
      answerLatex: '25',
      check: nc(25),
      hints: [
        { title: 'Express area in one variable', formula: 'A = l(10-l) = 10l - l^2' },
        { title: 'Find the critical point', formula: "A'(l) = 10 - 2l = 0 \\implies l = 5" },
        { title: 'Maximum area', formula: 'A(5) = 5 \\times 5 = 25 \\text{ m}^2' },
      ],
    },
    {
      id: 'adr-3',
      question: 'Find the local maximum value of:',
      latex: 'f(x) = 2x^3 - 9x^2 + 12x - 4',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Find critical points', formula: "f'(x) = 6(x-1)(x-2) = 0 \\implies x = 1, 2" },
        { title: 'Second derivative test at x = 1', formula: "f''(1) = 12(1)-18 = -6 < 0 \\implies \\text{local max}" },
        { title: 'Evaluate', formula: 'f(1) = 2 - 9 + 12 - 4 = 1' },
      ],
    },
    {
      id: 'adr-4',
      question: 'Find the value c guaranteed by the Mean Value Theorem for f(x) = x² on [0, 4]:',
      latex: 'f(x) = x^2, \\quad [0,\\,4]',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'MVT equation', formula: "f'(c) = \\frac{f(4)-f(0)}{4-0} = \\frac{16}{4} = 4" },
        { title: 'Solve for c', formula: "2c = 4 \\implies c = 2" },
      ],
    },
    {
      id: 'adr-5',
      question: 'Find the maximum value of:',
      latex: 'f(x) = -x^2 + 4x - 1',
      answerLatex: '3',
      check: nc(3),
      hints: [
        { title: 'Find critical point', formula: "f'(x) = -2x+4 = 0 \\implies x = 2" },
        { title: 'Concave down (f\'\'= −2), so x=2 is a maximum', formula: 'f(2) = -4+8-1 = 3' },
      ],
    },
    {
      id: 'adr-6',
      question: 'Find the x-coordinate of the maximum of:',
      latex: 'f(x) = x^2 e^{-x}',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Product Rule', formula: "f'(x) = xe^{-x}(2-x)" },
        { title: 'Critical points: x=0 and x=2. Sign chart confirms x=2 is the local max.', formula: 'x_{\\max} = 2' },
      ],
    },
    {
      id: 'adr-7',
      question: 'Find the minimum value of:',
      latex: 'f(x) = x^2 - 4x + 3',
      answerLatex: '-1',
      check: nc(-1),
      hints: [
        { title: 'Find critical point', formula: "f'(x) = 2x-4 = 0 \\implies x = 2" },
        { title: 'Concave up (f\'\'= 2 > 0), minimum at x = 2', formula: 'f(2) = 4-8+3 = -1' },
      ],
    },
    {
      id: 'adr-8',
      question: "A particle's position is s(t) = t³ − 6t² + 12t − 8. Find t when acceleration = 0:",
      latex: 's(t) = t^3 - 6t^2 + 12t - 8',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Velocity and acceleration', formula: "v(t) = 3t^2-12t+12 \\implies a(t) = 6t-12" },
        { title: 'Solve a(t) = 0', formula: '6t-12=0 \\implies t=2' },
      ],
    },
    {
      id: 'adr-9',
      question: 'How many inflection points does the following function have?',
      latex: 'f(x) = x^4 - 6x^2',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: "Find f''(x)", formula: "f'(x)=4x^3-12x \\implies f''(x)=12x^2-12" },
        { title: "Solve f''(x) = 0 and verify sign change", formula: "12(x^2-1)=0 \\implies x=\\pm1 \\text{ (both are inflection points)}" },
      ],
    },
    {
      id: 'adr-10',
      question: 'Use linear approximation to estimate √8.9 (give 4 decimal places):',
      latex: '\\sqrt{8.9} \\approx ?',
      answerLatex: '2.9833',
      check: nc(3 - 1 / 60),
      hints: [
        { title: 'Use f(x) = √x near x = 9', formula: 'f(9)=3, \\quad f\'(9)=\\frac{1}{6}' },
        { title: 'Linear approximation', formula: 'L(8.9) = 3 + \\frac{1}{6}(8.9-9) = 3 - \\frac{1}{60} \\approx 2.9833' },
      ],
    },
  ],

  integrals: [
    {
      id: 'int-1',
      question: 'Evaluate:',
      latex: '\\int_0^2 x^3 \\, dx',
      answerLatex: '4',
      check: nc(4),
      hints: [
        { title: 'Power Rule for integrals', formula: '\\int x^3\\,dx = \\frac{x^4}{4} + C' },
        { title: 'Apply the FTC', formula: '\\left[\\frac{x^4}{4}\\right]_0^2 = \\frac{16}{4} - 0 = 4' },
      ],
    },
    {
      id: 'int-2',
      question: 'Evaluate:',
      latex: '\\int_0^\\pi \\sin x \\, dx',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Antiderivative', formula: '\\int\\sin x\\,dx = -\\cos x + C' },
        { title: 'Evaluate', formula: '[-\\cos x]_0^\\pi = 1+1 = 2' },
      ],
    },
    {
      id: 'int-3',
      question: 'Evaluate:',
      latex: '\\int_1^3 (2x+1)\\,dx',
      answerLatex: '10',
      check: nc(10),
      hints: [
        { title: 'Antiderivative', formula: '\\int(2x+1)\\,dx = x^2+x+C' },
        { title: 'Evaluate', formula: '[x^2+x]_1^3 = 12-2 = 10' },
      ],
    },
    {
      id: 'int-4',
      question: 'Evaluate (enter exact or decimal):',
      latex: '\\int_0^1 e^x \\, dx',
      answerLatex: 'e-1 \\approx 1.718',
      check: nc(Math.E - 1),
      hints: [
        { title: 'Antiderivative of eˣ is eˣ', formula: '[e^x]_0^1 = e-1' },
      ],
    },
    {
      id: 'int-5',
      question: 'Evaluate:',
      latex: '\\int_1^e \\dfrac{1}{x} \\, dx',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Antiderivative of 1/x is ln|x|', formula: '[\\ln x]_1^e = 1 - 0 = 1' },
      ],
    },
    {
      id: 'int-6',
      question: 'Evaluate using u-substitution (enter exact or decimal):',
      latex: '\\int_0^1 x\\,e^{x^2}\\,dx',
      answerLatex: '(e-1)/2 \\approx 0.859',
      check: nc((Math.E - 1) / 2),
      hints: [
        { title: 'Let u = x², du = 2x dx', formula: 'x\\,dx = \\tfrac{du}{2}' },
        { title: 'Integrate and substitute back limits', formula: '\\tfrac{1}{2}\\int_0^1 e^u\\,du = \\tfrac{e-1}{2}' },
      ],
    },
    {
      id: 'int-7',
      question: 'Evaluate (enter exact or decimal):',
      latex: '\\int_0^{\\pi/2} \\cos^2 x \\, dx',
      answerLatex: 'pi/4 \\approx 0.785',
      check: nc(Math.PI / 4),
      hints: [
        { title: 'Half-angle identity', formula: '\\cos^2 x = \\frac{1+\\cos 2x}{2}' },
        { title: 'Integrate', formula: '\\frac{1}{2}\\left[x+\\frac{\\sin 2x}{2}\\right]_0^{\\pi/2} = \\frac{\\pi}{4}' },
      ],
    },
    {
      id: 'int-8',
      question: 'Evaluate (enter exact or decimal):',
      latex: '\\int_0^1 \\dfrac{1}{1+x^2}\\,dx',
      answerLatex: 'pi/4 \\approx 0.785',
      check: nc(Math.PI / 4),
      hints: [
        { title: 'Standard arctan integral', formula: '\\int\\frac{1}{1+x^2}\\,dx = \\arctan x + C' },
        { title: 'Evaluate', formula: '[\\arctan x]_0^1 = \\frac{\\pi}{4}' },
      ],
    },
    {
      id: 'int-9',
      question: 'Evaluate by parts (enter exact or decimal):',
      latex: '\\int_0^1 x^2 e^x \\, dx',
      answerLatex: 'e-2 \\approx 0.718',
      check: nc(Math.E - 2),
      hints: [
        { title: 'IBP with u = x², dv = eˣ dx', formula: '[x^2 e^x]_0^1 - 2\\int_0^1 xe^x\\,dx' },
        { title: 'Apply IBP again: ∫xeˣ dx = xeˣ − eˣ', formula: '[x^2e^x - 2xe^x + 2e^x]_0^1 = (e-2e+2e)-(2) = e-2' },
      ],
    },
    {
      id: 'int-10',
      question: 'Evaluate (enter exact or decimal):',
      latex: '\\int_1^4 \\sqrt{x}\\,dx',
      answerLatex: '14/3 \\approx 4.667',
      check: nc(14 / 3),
      hints: [
        { title: 'Rewrite as x^(1/2), then apply Power Rule', formula: '\\frac{2x^{3/2}}{3}\\bigg|_1^4 = \\frac{16}{3}-\\frac{2}{3} = \\frac{14}{3}' },
      ],
    },
  ],

  appIntegrals: [
    {
      id: 'apint-1',
      question: 'Find the area between y = x and y = x² from x = 0 to 1 (enter exact or decimal):',
      latex: 'A = \\int_0^1 (x - x^2)\\,dx',
      answerLatex: '1/6 \\approx 0.167',
      check: nc(1 / 6),
      hints: [
        { title: 'Since x ≥ x² on [0,1], integrate the difference', formula: '\\int_0^1(x-x^2)\\,dx' },
        { title: 'Evaluate', formula: '\\left[\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{2}-\\frac{1}{3} = \\frac{1}{6}' },
      ],
    },
    {
      id: 'apint-2',
      question: 'Volume when y = x is revolved around the x-axis from 0 to 2 (Disk). Enter exact or decimal:',
      latex: 'V = \\pi\\int_0^2 x^2\\,dx',
      answerLatex: '8pi/3 \\approx 8.378',
      check: nc(8 * Math.PI / 3),
      hints: [
        { title: 'Disk Method: V = π∫[f(x)]² dx', formula: '\\pi\\int_0^2 x^2\\,dx = \\pi\\left[\\frac{x^3}{3}\\right]_0^2 = \\frac{8\\pi}{3}' },
      ],
    },
    {
      id: 'apint-3',
      question: 'Volume when y = x² is revolved around the y-axis from 0 to 2 (Shell Method). Enter exact or decimal:',
      latex: 'V = 2\\pi\\int_0^2 x \\cdot x^2\\,dx',
      answerLatex: '8pi \\approx 25.133',
      check: nc(8 * Math.PI),
      hints: [
        { title: 'Shell Method: V = 2π∫x·f(x) dx', formula: '2\\pi\\int_0^2 x^3\\,dx = 2\\pi\\cdot 4 = 8\\pi' },
      ],
    },
    {
      id: 'apint-4',
      question: 'Find the average value of f(x) = x² on [0, 3]:',
      latex: '\\bar{f} = \\frac{1}{3}\\int_0^3 x^2\\,dx',
      answerLatex: '3',
      check: nc(3),
      hints: [
        { title: 'Average value formula', formula: '\\bar{f} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx = \\frac{1}{3}\\cdot 9 = 3' },
      ],
    },
    {
      id: 'apint-5',
      question: 'Area between y = eˣ and y = 1 from x = 0 to 2. Enter exact or decimal:',
      latex: 'A = \\int_0^2 (e^x-1)\\,dx',
      answerLatex: 'e^2-3 \\approx 4.389',
      check: nc(Math.E ** 2 - 3),
      hints: [
        { title: 'Integrate the difference', formula: '[e^x-x]_0^2 = (e^2-2)-(1) = e^2-3' },
      ],
    },
    {
      id: 'apint-6',
      question: 'Washer volume: y = x and y = x² revolved around x-axis, 0 to 1. Enter exact or decimal:',
      latex: 'V = \\pi\\int_0^1(x^2-x^4)\\,dx',
      answerLatex: '2pi/15 \\approx 0.419',
      check: nc(2 * Math.PI / 15),
      hints: [
        { title: 'Washer Method: V = π∫(R²−r²) dx', formula: '\\pi\\int_0^1(x^2-x^4)\\,dx = \\pi\\left(\\frac{1}{3}-\\frac{1}{5}\\right) = \\frac{2\\pi}{15}' },
      ],
    },
    {
      id: 'apint-7',
      question: 'Find the area enclosed by y = sin(x) and the x-axis from 0 to π:',
      latex: '\\int_0^\\pi \\sin x\\,dx',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Antiderivative of sin(x)', formula: '[-\\cos x]_0^\\pi = 1+1 = 2' },
      ],
    },
    {
      id: 'apint-8',
      question: 'Volume when y = sin(x) on [0,π] is revolved around the x-axis. Enter exact or decimal:',
      latex: 'V = \\pi\\int_0^\\pi \\sin^2 x\\,dx',
      answerLatex: 'pi^2/2 \\approx 4.935',
      check: nc(Math.PI ** 2 / 2),
      hints: [
        { title: 'Use sin²x = (1−cos2x)/2', formula: 'V = \\frac{\\pi}{2}\\left[x-\\frac{\\sin 2x}{2}\\right]_0^\\pi = \\frac{\\pi^2}{2}' },
      ],
    },
    {
      id: 'apint-9',
      question: 'Find the net displacement of a particle with v(t) = t² − 2t on [0, 3]:',
      latex: '\\int_0^3 (t^2-2t)\\,dt',
      answerLatex: '0',
      check: nc(0),
      hints: [
        { title: 'Integrate v(t)', formula: '\\left[\\frac{t^3}{3}-t^2\\right]_0^3 = (9-9) - 0 = 0' },
        { title: 'Interpretation', body: 'The particle ends where it started. Net displacement = 0.' },
      ],
    },
    {
      id: 'apint-10',
      question: 'Find the arc length of y = x from x = 0 to 1 (enter exact or decimal):',
      latex: 'L = \\int_0^1\\sqrt{1+(y\')^2}\\,dx',
      answerLatex: 'sqrt(2) \\approx 1.414',
      check: nc(Math.SQRT2),
      hints: [
        { title: "Since y' = 1:", formula: 'L = \\int_0^1\\sqrt{2}\\,dx = \\sqrt{2}' },
      ],
    },
  ],

  diffEq: [
    {
      id: 'deq-1',
      question: 'Solve dy/dx = 2x with y(0) = 3. Find y(2):',
      latex: '\\dfrac{dy}{dx} = 2x, \\quad y(0) = 3',
      answerLatex: '7',
      check: nc(7),
      hints: [
        { title: 'Integrate both sides', formula: 'y = x^2 + C' },
        { title: 'Apply IC: y(0) = 3 → C = 3', formula: 'y = x^2+3 \\implies y(2) = 4+3 = 7' },
      ],
    },
    {
      id: 'deq-2',
      question: 'dP/dt = 0.2P, P(0) = 500. Find P(5) (enter exact or decimal):',
      latex: '\\dfrac{dP}{dt} = 0.2P, \\quad P(0) = 500',
      answerLatex: '500e \\approx 1359',
      check: nc(500 * Math.E),
      hints: [
        { title: 'Exponential growth solution', formula: 'P(t) = 500e^{0.2t}' },
        { title: 'At t = 5', formula: 'P(5) = 500e^1 = 500e \\approx 1359' },
      ],
    },
    {
      id: 'deq-3',
      question: "One step of Euler's Method (h = 0.5). Approximate y(0.5) for:",
      latex: '\\dfrac{dy}{dx} = x + y, \\quad y(0) = 1',
      answerLatex: '1.5',
      check: nc(1.5),
      hints: [
        { title: "Euler's formula: y₁ = y₀ + h·f(x₀, y₀)", formula: 'y_1 = 1 + 0.5(0+1) = 1.5' },
      ],
    },
    {
      id: 'deq-4',
      question: 'Logistic model with carrying capacity K = 200. As t → ∞, the population approaches:',
      latex: '\\dfrac{dP}{dt} = rP\\!\\left(1-\\dfrac{P}{200}\\right)',
      answerLatex: '200',
      check: nc(200),
      hints: [
        { title: 'Logistic equilibrium', body: 'The logistic equation has a stable equilibrium at P = K (the carrying capacity).' },
        { title: 'Long-term value', formula: '\\lim_{t\\to\\infty} P(t) = K = 200' },
      ],
    },
    {
      id: 'deq-5',
      question: 'Carbon-14 has half-life 5730 years. What fraction remains after 11,460 years?',
      latex: 'A(t) = A_0 \\cdot 2^{-t/5730}',
      answerLatex: '0.25',
      check: nc(0.25),
      hints: [
        { title: '11,460 ÷ 5,730 = 2 half-lives', formula: '\\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4} = 0.25' },
      ],
    },
    {
      id: 'deq-6',
      question: 'Solve dy/dx = −y, y(0) = 1. Find y(ln 2):',
      latex: '\\dfrac{dy}{dx} = -y, \\quad y(0) = 1',
      answerLatex: '0.5',
      check: nc(0.5),
      hints: [
        { title: 'Solution', formula: 'y = e^{-x}' },
        { title: 'Evaluate at x = ln 2', formula: 'y(\\ln 2) = e^{-\\ln 2} = \\frac{1}{2}' },
      ],
    },
    {
      id: 'deq-7',
      question: 'Solve dy/dx = x/y with y(0) = 3. Find y(4):',
      latex: '\\dfrac{dy}{dx} = \\dfrac{x}{y}, \\quad y(0) = 3',
      answerLatex: '5',
      check: nc(5),
      hints: [
        { title: 'Separate: y dy = x dx, then integrate', formula: '\\frac{y^2}{2} = \\frac{x^2}{2} + C' },
        { title: 'IC gives C = 9/2, so y² = x² + 9', formula: 'y(4) = \\sqrt{16+9} = 5' },
      ],
    },
    {
      id: 'deq-8',
      question: "One step of Euler's Method (h = 0.25). Approximate y(0.25) for:",
      latex: "\\dfrac{dy}{dx} = y, \\quad y(0) = 1",
      answerLatex: '1.25',
      check: nc(1.25),
      hints: [
        { title: "Euler's formula", formula: 'y_1 = 1 + 0.25 \\cdot 1 = 1.25' },
      ],
    },
    {
      id: 'deq-9',
      question: 'A population doubles every 10 years. Starting at 1000, find the population after 30 years:',
      latex: 'P(t) = 1000 \\cdot 2^{t/10}',
      answerLatex: '8000',
      check: nc(8000),
      hints: [
        { title: '30 years = 3 doubling periods', formula: 'P(30) = 1000 \\cdot 2^3 = 8000' },
      ],
    },
    {
      id: 'deq-10',
      question: 'Solve dy/dx = cos(x), y(0) = 0. Find y(π/2):',
      latex: '\\dfrac{dy}{dx} = \\cos x, \\quad y(0) = 0',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Integrate: y = sin(x) + C, IC gives C = 0', formula: 'y(\\pi/2) = \\sin(\\pi/2) = 1' },
      ],
    },
  ],

  parametric: [
    {
      id: 'par-1',
      question: 'For x = t², y = t³, find dy/dx at t = 2:',
      latex: 'x = t^2, \\quad y = t^3',
      answerLatex: '3',
      check: nc(3),
      hints: [
        { title: 'Parametric derivative', formula: '\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{3t^2}{2t} = \\frac{3t}{2}' },
        { title: 'At t = 2', formula: '\\frac{3(2)}{2} = 3' },
      ],
    },
    {
      id: 'par-2',
      question: 'For the ellipse x = 2cos(t), y = 3sin(t), find dy/dx at t = π/4:',
      latex: 'x = 2\\cos t, \\quad y = 3\\sin t',
      answerLatex: '-3/2',
      check: nc(-1.5),
      hints: [
        { title: 'Compute derivatives', formula: '\\frac{dy}{dx} = \\frac{3\\cos t}{-2\\sin t}' },
        { title: 'At t = π/4 (tan π/4 = 1)', formula: '-\\frac{3}{2(1)} = -\\frac{3}{2}' },
      ],
    },
    {
      id: 'par-3',
      question: 'Find the area enclosed by the polar circle r = 3. Enter exact or decimal:',
      latex: 'r = 3',
      answerLatex: '9pi \\approx 28.27',
      check: nc(9 * Math.PI),
      hints: [
        { title: 'Polar area formula', formula: 'A = \\frac{1}{2}\\int_0^{2\\pi} r^2\\,d\\theta = \\frac{1}{2}\\cdot 9 \\cdot 2\\pi = 9\\pi' },
      ],
    },
    {
      id: 'par-4',
      question: 'Find the arc length of x = cos(t), y = sin(t) from t = 0 to 2π. Enter exact or decimal:',
      latex: 'L = \\int_0^{2\\pi}\\sqrt{\\dot{x}^2+\\dot{y}^2}\\,dt',
      answerLatex: '2pi \\approx 6.283',
      check: nc(2 * Math.PI),
      hints: [
        { title: 'dx/dt = −sin t, dy/dt = cos t', formula: '\\sqrt{\\sin^2 t + \\cos^2 t} = 1 \\implies L = 2\\pi' },
      ],
    },
    {
      id: 'par-5',
      question: 'Find the area enclosed by the cardioid r = 1 + cos(θ). Enter exact or decimal:',
      latex: 'r = 1 + \\cos\\theta',
      answerLatex: '3pi/2 \\approx 4.712',
      check: nc(3 * Math.PI / 2),
      hints: [
        { title: 'Polar area', formula: 'A = \\frac{1}{2}\\int_0^{2\\pi}(1+\\cos\\theta)^2\\,d\\theta' },
        { title: 'Expand and use cos²θ = (1+cos2θ)/2', formula: 'A = \\frac{1}{2}\\left[2\\pi + 0 + \\pi\\right] = \\frac{3\\pi}{2}' },
      ],
    },
    {
      id: 'par-6',
      question: 'For the cycloid x = t − sin(t), y = 1 − cos(t), find dy/dx at t = π/2:',
      latex: 'x = t-\\sin t, \\quad y = 1-\\cos t',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Derivatives', formula: 'dx/dt = 1-\\cos t, \\quad dy/dt = \\sin t' },
        { title: 'At t = π/2: cos(π/2)=0, sin(π/2)=1', formula: '\\frac{dy}{dx} = \\frac{1}{1-0} = 1' },
      ],
    },
    {
      id: 'par-7',
      question: 'For x = t², y = t⁴ − t, find d²y/dx² at t = 1:',
      latex: 'x = t^2, \\quad y = t^4-t',
      answerLatex: '9/4',
      check: nc(2.25),
      hints: [
        { title: 'First derivative dy/dx = (4t³−1)/(2t). At t=1: dy/dx = 3/2.' },
        { title: 'Second parametric derivative = d(dy/dx)/dt ÷ dx/dt', formula: '\\text{At } t=1: \\frac{d}{dt}\\left(\\frac{3t}{2}-\\frac{1}{2t}\\right)\\div 2t = \\frac{18/4}{2} = \\frac{9}{4}' },
      ],
    },
    {
      id: 'par-8',
      question: 'Find the area enclosed by r = 2sin(θ). Enter exact or decimal:',
      latex: 'r = 2\\sin\\theta',
      answerLatex: 'pi \\approx 3.14159',
      check: nc(Math.PI),
      hints: [
        { title: 'Integrate from 0 to π', formula: 'A = \\frac{1}{2}\\int_0^{\\pi}4\\sin^2\\theta\\,d\\theta' },
        { title: 'Use sin²θ = (1−cos2θ)/2', formula: '= \\left[\\theta - \\frac{\\sin2\\theta}{2}\\right]_0^{\\pi} = \\pi' },
      ],
    },
    {
      id: 'par-9',
      question: 'For r(t) = ⟨eᵗ, e⁻ᵗ⟩, find dy/dx at t = 0:',
      latex: '\\mathbf{r}(t) = \\langle e^t,\\, e^{-t}\\rangle',
      answerLatex: '-1',
      check: nc(-1),
      hints: [
        { title: 'dy/dx = (dy/dt)/(dx/dt) = −e^{−t}/e^t = −e^{−2t}', formula: '\\text{At } t=0: -e^0 = -1' },
      ],
    },
    {
      id: 'par-10',
      question: 'Find the speed |v(t)| for r(t) = ⟨t², 2t⟩ at t = 3. Enter exact or decimal:',
      latex: '\\mathbf{r}(t) = \\langle t^2,\\, 2t\\rangle',
      answerLatex: '2sqrt(10) \\approx 6.325',
      check: nc(2 * Math.sqrt(10)),
      hints: [
        { title: 'v(t) = r\'(t) = ⟨2t, 2⟩', formula: '|\\mathbf{v}(t)| = \\sqrt{4t^2+4} = 2\\sqrt{t^2+1}' },
        { title: 'At t = 3', formula: '2\\sqrt{10} \\approx 6.325' },
      ],
    },
  ],

  series: [
    {
      id: 'ser-1',
      question: 'Find the sum of the infinite geometric series:',
      latex: '\\sum_{n=0}^{\\infty} \\left(\\dfrac{1}{2}\\right)^n',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Geometric series formula for |r| < 1', formula: '\\sum_{n=0}^{\\infty}r^n = \\frac{1}{1-r}' },
        { title: 'With r = 1/2', formula: '\\frac{1}{1-1/2} = 2' },
      ],
    },
    {
      id: 'ser-2',
      question: 'Find the sum:',
      latex: '\\sum_{n=0}^{\\infty} 3\\left(\\dfrac{2}{3}\\right)^n',
      answerLatex: '9',
      check: nc(9),
      hints: [
        { title: 'Factor out 3 and apply geometric formula', formula: '3 \\cdot \\frac{1}{1-2/3} = 3 \\cdot 3 = 9' },
      ],
    },
    {
      id: 'ser-3',
      question: 'Find the sum (series starts at n = 1):',
      latex: '\\sum_{n=1}^{\\infty} \\left(\\dfrac{1}{3}\\right)^n',
      answerLatex: '1/2',
      check: nc(0.5),
      hints: [
        { title: 'Starting at n=1: Σr^n = r/(1−r)', formula: '\\frac{1/3}{1-1/3} = \\frac{1/3}{2/3} = \\frac{1}{2}' },
      ],
    },
    {
      id: 'ser-4',
      question: 'Evaluate the 4th-degree Taylor polynomial for eˣ at x = 0, plugging in x = 1:',
      latex: 'T_4(1) = 1 + 1 + \\dfrac{1}{2!} + \\dfrac{1}{3!} + \\dfrac{1}{4!}',
      answerLatex: '65/24 \\approx 2.708',
      check: nc(65 / 24),
      hints: [
        { title: 'Taylor series: eˣ = Σxⁿ/n!', formula: '1+1+\\frac{1}{2}+\\frac{1}{6}+\\frac{1}{24} = \\frac{65}{24}' },
      ],
    },
    {
      id: 'ser-5',
      question: 'What is the coefficient of x⁵ in the Maclaurin series of sin(x)?',
      latex: '\\sin x = x - \\dfrac{x^3}{3!} + \\dfrac{x^5}{5!} - \\cdots',
      answerLatex: '1/120 \\approx 0.00833',
      check: nc(1 / 120),
      hints: [
        { title: 'The x⁵ term is x⁵/5!', formula: '\\frac{1}{5!} = \\frac{1}{120}' },
      ],
    },
    {
      id: 'ser-6',
      question: 'Find the sum using Σn·rⁿ = r/(1−r)²:',
      latex: '\\sum_{n=1}^{\\infty} n\\left(\\dfrac{1}{2}\\right)^n',
      answerLatex: '2',
      check: nc(2),
      hints: [
        { title: 'Formula for Σn·rⁿ', formula: '\\frac{r}{(1-r)^2}\\bigg|_{r=1/2} = \\frac{1/2}{1/4} = 2' },
      ],
    },
    {
      id: 'ser-7',
      question: 'Find the radius of convergence of:',
      latex: '\\sum_{n=0}^{\\infty} \\left(\\dfrac{x}{3}\\right)^n',
      answerLatex: '3',
      check: nc(3),
      hints: [
        { title: 'Geometric series converges when |x/3| < 1, i.e., |x| < 3', formula: 'R = 3' },
      ],
    },
    {
      id: 'ser-8',
      question: 'What is the coefficient of x⁴ in the Maclaurin series of cos(x)?',
      latex: '\\cos x = 1 - \\dfrac{x^2}{2!} + \\dfrac{x^4}{4!} - \\cdots',
      answerLatex: '1/24 \\approx 0.04167',
      check: nc(1 / 24),
      hints: [
        { title: 'The x⁴ term is x⁴/4!', formula: '\\frac{1}{4!} = \\frac{1}{24}' },
      ],
    },
    {
      id: 'ser-9',
      question: 'Find the sum of the telescoping series:',
      latex: '\\sum_{n=1}^{\\infty} \\dfrac{1}{n(n+1)}',
      answerLatex: '1',
      check: nc(1),
      hints: [
        { title: 'Partial fractions', formula: '\\frac{1}{n(n+1)} = \\frac{1}{n}-\\frac{1}{n+1}' },
        { title: 'Telescoping: most terms cancel', formula: 'S_N = 1 - \\frac{1}{N+1} \\to 1' },
      ],
    },
    {
      id: 'ser-10',
      question: 'Use the geometric series formula. Find the sum at x = 1/4:',
      latex: '\\sum_{n=0}^{\\infty} \\left(\\dfrac{1}{4}\\right)^n',
      answerLatex: '4/3 \\approx 1.333',
      check: nc(4 / 3),
      hints: [
        { title: 'Geometric series with r = 1/4', formula: '\\frac{1}{1-1/4} = \\frac{4}{3}' },
      ],
    },
  ],
}
