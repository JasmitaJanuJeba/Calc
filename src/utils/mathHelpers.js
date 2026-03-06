import * as math from 'mathjs'

export function evaluateExpression(expr, xVal) {
  try {
    const scope = { x: xVal }
    return math.evaluate(expr, scope)
  } catch {
    return null
  }
}

export function generatePoints(expr, xMin, xMax, steps = 300) {
  const xs = []
  const ys = []
  const step = (xMax - xMin) / steps
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step
    const y = evaluateExpression(expr, x)
    if (y !== null && isFinite(y) && !isNaN(y) && Math.abs(y) < 1e6) {
      xs.push(x)
      ys.push(y)
    } else {
      xs.push(x)
      ys.push(null)
    }
  }
  return { xs, ys }
}

export function numericalDerivative(expr, x, h = 1e-6) {
  const f1 = evaluateExpression(expr, x + h)
  const f2 = evaluateExpression(expr, x - h)
  if (f1 === null || f2 === null) return null
  return (f1 - f2) / (2 * h)
}

export function numericalIntegral(expr, a, b, n = 1000) {
  const h = (b - a) / n
  let sum = 0
  for (let i = 0; i <= n; i++) {
    const x = a + i * h
    const y = evaluateExpression(expr, x)
    if (y === null || !isFinite(y)) continue
    const coeff = (i === 0 || i === n) ? 1 : (i % 2 === 0 ? 2 : 4)
    sum += coeff * y
  }
  return (h / 3) * sum
}

export function riemannSum(expr, a, b, n, method = 'midpoint') {
  const h = (b - a) / n
  let sum = 0
  for (let i = 0; i < n; i++) {
    let x
    if (method === 'left') x = a + i * h
    else if (method === 'right') x = a + (i + 1) * h
    else x = a + (i + 0.5) * h
    const y = evaluateExpression(expr, x)
    if (y !== null && isFinite(y)) sum += y * h
  }
  return sum
}

export function taylorCoefficients(expr, center, degree) {
  const coeffs = []
  let factorial = 1
  for (let n = 0; n <= degree; n++) {
    if (n > 0) factorial *= n
    const val = evaluateExpression(expr, center)
    // Numerical nth derivative
    let deriv = nthDerivative(expr, center, n)
    coeffs.push({ n, coeff: deriv / factorial, factorial })
    expr = numericalNthDerivExpr(expr, n)
  }
  return coeffs
}

function nthDerivative(expr, x, n, h = 1e-4) {
  if (n === 0) return evaluateExpression(expr, x)
  if (n === 1) return numericalDerivative(expr, x, h)
  // Use recursive central differences
  const f_plus = nthDerivative(expr, x + h, n - 1, h)
  const f_minus = nthDerivative(expr, x - h, n - 1, h)
  if (f_plus === null || f_minus === null) return null
  return (f_plus - f_minus) / (2 * h)
}

function numericalNthDerivExpr(expr) { return expr } // placeholder, we use nthDerivative directly

export function solveNewton(expr, x0, iterations = 50) {
  let x = x0
  for (let i = 0; i < iterations; i++) {
    const fx = evaluateExpression(expr, x)
    const fpx = numericalDerivative(expr, x)
    if (!fpx || Math.abs(fpx) < 1e-10) break
    const xNew = x - fx / fpx
    if (Math.abs(xNew - x) < 1e-10) { x = xNew; break }
    x = xNew
  }
  return x
}

export function criticalPoints(expr, xMin, xMax, steps = 500) {
  const points = []
  const h = (xMax - xMin) / steps
  let prevSign = null
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * h
    const d = numericalDerivative(expr, x)
    if (d === null) continue
    const sign = Math.sign(d)
    if (prevSign !== null && prevSign !== sign) {
      const xCrit = x - h / 2
      const y = evaluateExpression(expr, xCrit)
      if (y !== null && isFinite(y)) {
        points.push({ x: xCrit, y, type: prevSign > 0 ? 'max' : 'min' })
      }
    }
    prevSign = sign
  }
  return points
}

export function inflectionPoints(expr, xMin, xMax, steps = 500) {
  const points = []
  const h = (xMax - xMin) / steps
  let prevSign = null
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * h
    const d2 = nthDerivative(expr, x, 2)
    if (d2 === null) continue
    const sign = Math.sign(d2)
    if (prevSign !== null && prevSign !== sign) {
      const xInfl = x - h / 2
      const y = evaluateExpression(expr, xInfl)
      if (y !== null && isFinite(y)) {
        points.push({ x: xInfl, y })
      }
    }
    prevSign = sign
  }
  return points
}

export function formatNumber(n, digits = 4) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toFixed(digits)).toString()
}
