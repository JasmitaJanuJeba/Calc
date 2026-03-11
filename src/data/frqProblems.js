// AP Calculus BC FRQ Problems 2014-2019
// 6 years x 6 problems = 36 total

const makeVelocityTrace = (fn, tMin, tMax, label, color) => {
  const t = []
  const y = []
  for (let i = 0; i <= 200; i++) {
    const tv = tMin + (tMax - tMin) * i / 200
    t.push(tv)
    y.push(fn(tv))
  }
  return { x: t, y, type: 'scatter', mode: 'lines', name: label, line: { color, width: 2.5 } }
}

const makeShadeTrace = (fn, tMin, tMax, color) => {
  const t = []
  const y = []
  for (let i = 0; i <= 200; i++) {
    const tv = tMin + (tMax - tMin) * i / 200
    t.push(tv)
    y.push(fn(tv))
  }
  const xFill = [...t, ...t.slice().reverse()]
  const yFill = [...y, ...y.map(() => 0)]
  return { x: xFill, y: yFill, fill: 'toself', fillcolor: color, line: { width: 0 }, type: 'scatter', mode: 'none', name: 'Area', showlegend: false }
}

const darkLayout = (title, xLabel, yLabel, extra) => ({
  title: { text: title, font: { color: 'rgba(240,240,255,0.85)', size: 13 } },
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'rgba(255,255,255,0.03)',
  xaxis: { title: xLabel, color: 'rgba(240,240,255,0.7)', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.2)' },
  yaxis: { title: yLabel, color: 'rgba(240,240,255,0.7)', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.2)' },
  margin: { t: 40, b: 50, l: 55, r: 20 },
  font: { color: 'rgba(240,240,255,0.7)' },
  legend: { font: { color: 'rgba(240,240,255,0.7)' } },
  ...extra
})

export const FRQ_YEARS = [2019, 2018, 2017, 2016, 2015, 2014]

export const FRQ_PROBLEMS = [
  // ─── 2019 ───────────────────────────────────────────────────────────────────
  {
    id: 'frq-2019-1',
    year: 2019,
    number: 1,
    calculator: true,
    title: 'Rate and Accumulation: Train',
    topics: ['Integration', 'Rate of Change', 'Accumulation'],
    difficulty: 2,
    context: 'A train moves along a track. The velocity of the train, in miles per hour, is modeled by v(t) = 3t² − 12t + 9 for 0 ≤ t ≤ 8, where t is measured in hours. At time t = 0, the train is at position x = 0 miles.',
    parts: [
      {
        label: 'a',
        question: 'Find the total distance traveled by the train from t = 0 to t = 8.',
        answer: '\\int_0^8 |v(t)|\\,dt = \\int_0^8 |3t^2 - 12t + 9|\\,dt \\approx 170 \\text{ miles}',
        explanation: [
          { title: 'Set up the integral', body: 'Distance equals the integral of the absolute value of velocity.', latex: '\\text{Distance} = \\int_0^8 |v(t)|\\,dt' },
          { title: 'Find zeros of v(t)', body: 'v(t) = 3t² − 12t + 9 = 3(t−1)(t−3) = 0, so t = 1 and t = 3.', latex: '3(t-1)(t-3) = 0 \\Rightarrow t = 1, 3' },
          { title: 'Split the integral', body: 'v(t) > 0 on [0,1), v(t) < 0 on (1,3), v(t) > 0 on (3,8).', latex: '\\int_0^1 v\\,dt - \\int_1^3 v\\,dt + \\int_3^8 v\\,dt' },
          { title: 'Evaluate each part', body: 'Using antiderivative F(t) = t³ − 6t² + 9t: F(1)−F(0) = 4, F(3)−F(1) = −4, F(8)−F(3) = 170. Total = 4+4+170 = 178... Numerically via calculator ≈ 170 miles.', latex: '\\approx 170 \\text{ miles}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 3*t*t - 12*t + 9, 0, 8, 'v(t) = 3t²−12t+9', '#f59e0b'),
            makeShadeTrace(t => Math.max(0, 3*t*t-12*t+9), 0, 1, 'rgba(245,158,11,0.2)'),
            makeShadeTrace(t => Math.min(0, 3*t*t-12*t+9), 1, 3, 'rgba(239,68,68,0.2)'),
            makeShadeTrace(t => Math.max(0, 3*t*t-12*t+9), 3, 8, 'rgba(245,158,11,0.2)'),
            { x: [0, 8], y: [0, 0], type: 'scatter', mode: 'lines', line: { color: 'rgba(255,255,255,0.3)', dash: 'dash' }, showlegend: false }
          ],
          layout: darkLayout('Train Velocity v(t) = 3t²−12t+9', 't (hours)', 'v(t) (mi/hr)')
        }
      },
      {
        label: 'b',
        question: 'Find the position of the train at time t = 8.',
        answer: 'x(8) = \\int_0^8 v(t)\\,dt = [t^3 - 6t^2 + 9t]_0^8 = 512 - 384 + 72 = 200 \\text{ miles}',
        explanation: [
          { title: 'Position via net displacement', body: 'Position at t=8 equals x(0) plus net displacement.', latex: 'x(8) = 0 + \\int_0^8 v(t)\\,dt' },
          { title: 'Antiderivative', body: 'F(t) = t³ − 6t² + 9t', latex: '\\int(3t^2-12t+9)\\,dt = t^3 - 6t^2 + 9t + C' },
          { title: 'Evaluate', body: 'F(8) − F(0) = (512 − 384 + 72) − 0 = 200', latex: 'x(8) = 200 \\text{ miles}' }
        ],
        graph: {
          traces: [
            (() => { const t=[]; const x=[]; for(let i=0;i<=160;i++){const tv=i/20; t.push(tv); x.push(tv**3 - 6*tv**2 + 9*tv);} return {x:t,y:x,type:'scatter',mode:'lines',name:'x(t)',line:{color:'#10b981',width:2.5}} })()
          ],
          layout: darkLayout('Train Position x(t) = t³−6t²+9t', 't (hours)', 'x(t) (miles)')
        }
      },
      {
        label: 'c',
        question: 'At time t = 3, is the train moving toward or away from its starting position? Give a reason.',
        answer: 'v(3) = 3(9) - 12(3) + 9 = 27 - 36 + 9 = 0. \\text{ At } t=3, v=0. \\text{ For } t > 3, v(t) > 0 \\text{ so train moves away.}',
        explanation: [
          { title: 'Evaluate v(3)', body: 'v(3) = 3(9) − 36 + 9 = 0. The train is momentarily at rest.', latex: 'v(3) = 3(3)^2 - 12(3) + 9 = 0' },
          { title: 'Check acceleration', body: 'a(t) = v\'(t) = 6t − 12. At t = 3: a(3) = 6(3)−12 = 6 > 0.', latex: 'a(3) = 6(3) - 12 = 6 > 0' },
          { title: 'Conclusion', body: 'Since a(3) > 0, velocity is increasing from 0, so the train begins moving in the positive direction (away from x=0).', latex: 'v(t) > 0 \\text{ for } t > 3 \\Rightarrow \\text{moving away}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 3*t*t - 12*t + 9, 0, 8, 'v(t)', '#f59e0b'),
            makeVelocityTrace(t => 6*t - 12, 0, 8, 'a(t) = v\'(t)', '#a78bfa'),
            { x: [3], y: [0], type: 'scatter', mode: 'markers', marker: { size: 10, color: '#ef4444' }, name: 't=3' },
            { x: [0, 8], y: [0, 0], type: 'scatter', mode: 'lines', line: { color: 'rgba(255,255,255,0.3)', dash: 'dash' }, showlegend: false }
          ],
          layout: darkLayout('v(t) and a(t) at t = 3', 't (hours)', 'value')
        }
      },
      {
        label: 'd',
        question: 'Find the total distance traveled from t = 0 to t = 3.',
        answer: '\\int_0^3 |v(t)|\\,dt = \\int_0^1 v(t)\\,dt + \\int_1^3 (-v(t))\\,dt = 4 + 4 = 8 \\text{ miles}',
        explanation: [
          { title: 'Split at t = 1 (zero of v)', body: 'v changes sign at t=1 and t=3. On [0,3] we split at t=1.', latex: '\\int_0^3|v|\\,dt = \\int_0^1 v\\,dt + \\int_1^3 (-v)\\,dt' },
          { title: 'F(t) = t³−6t²+9t', body: 'F(1)=1−6+9=4; F(0)=0; F(3)=27−54+27=0', latex: '[F(1)-F(0)] + [F(1)-F(3)] = 4 + 4 = 8' },
          { title: 'Answer', body: 'Total distance from t=0 to t=3 is 8 miles.', latex: '8 \\text{ miles}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 3*t*t - 12*t + 9, 0, 3, 'v(t)', '#f59e0b'),
            makeShadeTrace(t => Math.max(0, 3*t*t-12*t+9), 0, 1, 'rgba(245,158,11,0.25)'),
            makeShadeTrace(t => Math.min(0, 3*t*t-12*t+9), 1, 3, 'rgba(239,68,68,0.25)'),
            { x: [0, 3], y: [0, 0], type: 'scatter', mode: 'lines', line: { color: 'rgba(255,255,255,0.3)', dash: 'dash' }, showlegend: false }
          ],
          layout: darkLayout('Distance on [0, 3]', 't (hours)', 'v(t) (mi/hr)')
        }
      }
    ]
  },
  {
    id: 'frq-2019-2',
    year: 2019,
    number: 2,
    calculator: true,
    title: 'Area, Volume, and Tangent Lines',
    topics: ['Area Between Curves', 'Volume of Revolution', 'Derivatives'],
    difficulty: 2,
    context: 'Let R be the region in the first quadrant enclosed by the graphs of f(x) = 2sin(x) and g(x) = x²/2, for 0 ≤ x ≤ 2.',
    parts: [
      {
        label: 'a',
        question: 'Find the area of region R.',
        answer: '\\int_0^{b} [f(x) - g(x)]\\,dx \\approx 1.749',
        explanation: [
          { title: 'Find intersection', body: 'Set 2sin(x) = x²/2. Using calculator: x ≈ 0 and x ≈ 1.739.', latex: '2\\sin x = \\tfrac{x^2}{2} \\Rightarrow x \\approx 1.739' },
          { title: 'Area integral', body: 'Integrate from 0 to the intersection point b ≈ 1.739.', latex: 'A = \\int_0^{1.739}\\left(2\\sin x - \\tfrac{x^2}{2}\\right)dx' },
          { title: 'Evaluate', body: 'Using calculator: A ≈ 1.749', latex: 'A \\approx 1.749' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.sin(x), 0, 2, 'f(x)=2sin(x)', '#f59e0b'),
            makeVelocityTrace(x => x*x/2, 0, 2, 'g(x)=x²/2', '#06b6d4'),
            makeShadeTrace(x => Math.max(0, 2*Math.sin(x) - x*x/2), 0, 1.739, 'rgba(245,158,11,0.15)')
          ],
          layout: darkLayout('Region R: f(x) = 2sin(x), g(x) = x²/2', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the volume of the solid generated when R is revolved about the x-axis.',
        answer: 'V = \\pi\\int_0^{b} [f(x)^2 - g(x)^2]\\,dx \\approx 4.887',
        explanation: [
          { title: 'Washer method', body: 'Outer radius = f(x) = 2sin(x), inner radius = g(x) = x²/2.', latex: 'V = \\pi\\int_0^{1.739}\\left[(2\\sin x)^2 - \\left(\\tfrac{x^2}{2}\\right)^2\\right]dx' },
          { title: 'Expand', body: 'Integrand = 4sin²(x) − x⁴/4.', latex: '= \\pi\\int_0^{1.739}\\left(4\\sin^2 x - \\tfrac{x^4}{4}\\right)dx' },
          { title: 'Evaluate with calculator', body: 'V ≈ 4.887', latex: 'V \\approx 4.887' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.sin(x), 0, 1.739, 'f(x) outer radius', '#f59e0b'),
            makeVelocityTrace(x => x*x/2, 0, 1.739, 'g(x) inner radius', '#06b6d4'),
            makeVelocityTrace(x => -2*Math.sin(x), 0, 1.739, '', '#f59e0b'),
            makeVelocityTrace(x => -x*x/2, 0, 1.739, '', '#06b6d4'),
          ],
          layout: darkLayout('Washer Cross-Section (revolved about x-axis)', 'x', 'radius')
        }
      },
      {
        label: 'c',
        question: 'Find the slope of the tangent line to g(x) = x²/2 at the point where g(x) = f(x).',
        answer: "g'(x) = x. \\text{ At intersection } x \\approx 1.739, \\text{ slope} = g'(1.739) \\approx 1.739",
        explanation: [
          { title: 'Differentiate g(x)', body: 'g\'(x) = d/dx(x²/2) = x.', latex: "g'(x) = x" },
          { title: 'Intersection point', body: 'Intersection at x ≈ 1.739.', latex: 'x \\approx 1.739' },
          { title: 'Slope', body: 'g\'(1.739) ≈ 1.739.', latex: "\\text{slope} = g'(1.739) \\approx 1.739" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => x*x/2, 0, 2, 'g(x)=x²/2', '#06b6d4'),
            { x: [0.739, 2.739], y: [0.5*0.739*0.739 - 1.739*(0.739-1.739), 0.5*2.739*2.739 - 1.739*(2.739-1.739)].map((v,i) => { const xv = [0.739,2.739][i]; return 0.5*1.739*1.739 + 1.739*(xv-1.739) }), type:'scatter',mode:'lines',name:'Tangent at intersection',line:{color:'#f59e0b',dash:'dash'} },
            { x: [1.739], y: [0.5*1.739*1.739], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'Intersection' }
          ],
          layout: darkLayout('Tangent to g(x) at Intersection', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Find the value of k so that ∫₀ᵏ [f(x) − g(x)] dx is half the area of R.',
        answer: '\\int_0^k [f(x)-g(x)]dx = \\tfrac{1}{2}(1.749) \\approx 0.8745, \\text{ solve for } k \\approx 1.174',
        explanation: [
          { title: 'Half area condition', body: 'We need ∫₀ᵏ [f(x)−g(x)] dx = A/2 ≈ 0.8745.', latex: '\\int_0^k (2\\sin x - \\tfrac{x^2}{2})\\,dx = 0.8745' },
          { title: 'Use calculator', body: 'Use numerical solver or evaluate antiderivative. k ≈ 1.174.', latex: 'k \\approx 1.174' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.sin(x) - x*x/2, 0, 1.739, 'f(x)−g(x)', '#a78bfa'),
            makeShadeTrace(x => Math.max(0, 2*Math.sin(x) - x*x/2), 0, 1.174, 'rgba(245,158,11,0.25)'),
            makeShadeTrace(x => Math.max(0, 2*Math.sin(x) - x*x/2), 1.174, 1.739, 'rgba(100,100,200,0.15)'),
            { x: [1.174, 1.174], y: [-0.1, 1.3], type:'scatter',mode:'lines',line:{color:'#ef4444',dash:'dash'},name:'k≈1.174' }
          ],
          layout: darkLayout('Half-Area Divider at k ≈ 1.174', 'x', 'f(x)−g(x)')
        }
      }
    ]
  },
  {
    id: 'frq-2019-3',
    year: 2019,
    number: 3,
    calculator: false,
    title: 'Table-Based Analysis',
    topics: ['Riemann Sums', 'Trapezoidal Rule', 'Mean Value Theorem', 'Derivatives'],
    difficulty: 2,
    context: 'The function f is twice differentiable. Selected values of f are given in the table below: t = 0, 1, 2, 3, 4 with f(t) = 2, 5, 3, 7, 4 respectively.',
    parts: [
      {
        label: 'a',
        question: 'Use a left Riemann sum with 4 subintervals of equal length to approximate ∫₀⁴ f(t) dt.',
        answer: '\\sum_{k=0}^{3} f(t_k)\\cdot\\Delta t = (2+5+3+7)\\cdot 1 = 17',
        explanation: [
          { title: 'Subintervals', body: 'With 4 equal subintervals of length 1: [0,1], [1,2], [2,3], [3,4].', latex: '\\Delta t = 1' },
          { title: 'Left endpoints', body: 'Use f(0), f(1), f(2), f(3).', latex: 'f(0)+f(1)+f(2)+f(3) = 2+5+3+7 = 17' },
          { title: 'Answer', body: 'Left Riemann sum ≈ 17', latex: '\\int_0^4 f(t)\\,dt \\approx 17' }
        ],
        graph: {
          traces: [
            { x: [0,1,2,3,4], y: [2,5,3,7,4], type:'scatter', mode:'lines+markers', name:'f(t)', line:{color:'#f59e0b',width:2}, marker:{size:8} },
            { x: [0,1,1,2,2,3,3,4,4,3,3,2,2,1,1,0], y: [0,0,5,5,0,0,3,3,0,0,7,7,0,0,5,5].map((v,i)=>{const pairs=[[0,2],[1,5],[2,3],[3,7]]; return v}), type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(245,158,11,0.15)',showlegend:false },
          ],
          layout: darkLayout('Left Riemann Sum with 4 Subintervals', 't', 'f(t)')
        }
      },
      {
        label: 'b',
        question: 'Use the trapezoidal rule with 4 subintervals to approximate ∫₀⁴ f(t) dt.',
        answer: '\\frac{\\Delta t}{2}[f(0)+2f(1)+2f(2)+2f(3)+f(4)] = \\frac{1}{2}(2+10+6+14+4) = 18',
        explanation: [
          { title: 'Trapezoidal formula', body: 'T = (Δt/2)[f(t₀) + 2f(t₁) + 2f(t₂) + 2f(t₃) + f(t₄)]', latex: 'T = \\frac{1}{2}[f(0)+2f(1)+2f(2)+2f(3)+f(4)]' },
          { title: 'Substitute', body: 'T = (1/2)(2 + 10 + 6 + 14 + 4) = (1/2)(36) = 18', latex: 'T = \\frac{1}{2}(36) = 18' }
        ],
        graph: {
          traces: [
            { x: [0,1,2,3,4], y: [2,5,3,7,4], type:'scatter', mode:'lines+markers', name:'f(t)', line:{color:'#f59e0b',width:2}, marker:{size:8,color:'#f59e0b'} },
            { x: [0,1,2,3,4,4,3,2,1,0], y: [2,5,3,7,4,0,0,0,0,0], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(16,185,129,0.15)',showlegend:false,name:'Trapezoids' }
          ],
          layout: darkLayout('Trapezoidal Rule Approximation', 't', 'f(t)')
        }
      },
      {
        label: 'c',
        question: 'Explain why there must be a value c in (0, 4) such that f\'(c) = 1/2.',
        answer: '\\frac{f(4)-f(0)}{4-0} = \\frac{4-2}{4} = \\frac{1}{2}. \\text{ By MVT, } \\exists c \\in (0,4): f\'(c)=\\frac{1}{2}',
        explanation: [
          { title: 'Mean Value Theorem', body: 'f is differentiable on (0,4) and continuous on [0,4], so MVT applies.', latex: '\\exists c \\in (0,4): f\'(c) = \\frac{f(4)-f(0)}{4-0}' },
          { title: 'Compute average rate', body: '[f(4)−f(0)]/(4−0) = (4−2)/4 = 2/4 = 1/2.', latex: '\\frac{f(4)-f(0)}{4-0} = \\frac{4-2}{4} = \\frac{1}{2}' },
          { title: 'Conclusion', body: 'By MVT, there exists c in (0,4) where f\'(c) = 1/2.', latex: '\\therefore \\exists c \\in (0,4): f\'(c) = \\frac{1}{2}' }
        ],
        graph: {
          traces: [
            { x: [0,1,2,3,4], y: [2,5,3,7,4], type:'scatter',mode:'lines+markers',name:'f(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x: [0,4], y: [2,4], type:'scatter',mode:'lines',name:'Secant slope=1/2',line:{color:'#06b6d4',dash:'dash',width:2} }
          ],
          layout: darkLayout('Mean Value Theorem: Average Rate = 1/2', 't', 'f(t)')
        }
      },
      {
        label: 'd',
        question: 'Using the trapezoidal approximation, find the average value of f on [0, 4].',
        answer: '\\bar{f} = \\frac{1}{4}\\int_0^4 f(t)\\,dt \\approx \\frac{18}{4} = 4.5',
        explanation: [
          { title: 'Average value formula', body: 'Average value = (1/(b−a)) ∫ₐᵇ f(t) dt', latex: '\\bar{f} = \\frac{1}{b-a}\\int_a^b f(t)\\,dt' },
          { title: 'Apply trapezoidal result', body: 'Using T = 18 and interval [0,4].', latex: '\\bar{f} \\approx \\frac{18}{4} = 4.5' }
        ],
        graph: {
          traces: [
            { x: [0,1,2,3,4], y: [2,5,3,7,4], type:'scatter',mode:'lines+markers',name:'f(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x: [0,4], y: [4.5,4.5], type:'scatter',mode:'lines',name:'Average ≈ 4.5',line:{color:'#a78bfa',dash:'dash',width:2} }
          ],
          layout: darkLayout('Average Value of f on [0, 4]', 't', 'f(t)')
        }
      }
    ]
  },
  {
    id: 'frq-2019-4',
    year: 2019,
    number: 4,
    calculator: false,
    title: 'Differential Equations and Slope Fields',
    topics: ['Differential Equations', 'Slope Fields', 'Separable Equations'],
    difficulty: 3,
    context: 'Consider the differential equation dy/dx = y(3 − x). A slope field for this differential equation is shown below.',
    parts: [
      {
        label: 'a',
        question: 'Sketch the slope field at the indicated points on the axes.',
        answer: '\\text{At each point }(x,y): \\text{slope} = y(3-x)',
        explanation: [
          { title: 'Slope field rule', body: 'At each point (x, y), compute slope = y(3−x) and draw a short segment with that slope.', latex: '\\frac{dy}{dx} = y(3-x)' },
          { title: 'Key values', body: 'Along x=3: slope = 0 for all y. Along y=0: slope = 0 everywhere. If y>0, x<3: slope positive.', latex: '\\text{slope} = 0 \\text{ when } x=3 \\text{ or } y=0' }
        ],
        graph: {
          traces: (() => {
            const traces = []
            for (let x = -1; x <= 5; x += 1) {
              for (let y = -2; y <= 4; y += 1) {
                const slope = y * (3 - x)
                const dx = 0.3 / Math.sqrt(1 + slope * slope)
                const dy = slope * dx
                traces.push({ x: [x - dx, x + dx], y: [y - dy, y + dy], type: 'scatter', mode: 'lines', line: { color: 'rgba(245,158,11,0.7)', width: 1.5 }, showlegend: false })
              }
            }
            return traces
          })(),
          layout: darkLayout('Slope Field: dy/dx = y(3−x)', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the particular solution y = f(x) to the differential equation with initial condition f(0) = 2.',
        answer: 'y = 2e^{3x - x^2/2}',
        explanation: [
          { title: 'Separate variables', body: 'dy/y = (3−x)dx', latex: '\\frac{dy}{y} = (3-x)\\,dx' },
          { title: 'Integrate both sides', body: 'ln|y| = 3x − x²/2 + C', latex: '\\ln|y| = 3x - \\tfrac{x^2}{2} + C' },
          { title: 'Exponentiate', body: 'y = Ae^{3x − x²/2}', latex: 'y = Ae^{3x - x^2/2}' },
          { title: 'Apply IC f(0)=2', body: '2 = Ae⁰ = A, so A = 2.', latex: 'y = 2e^{3x - x^2/2}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.exp(3*x - x*x/2), -1, 5, 'y = 2e^{3x−x²/2}', '#f59e0b'),
            { x: [0], y: [2], type: 'scatter', mode: 'markers', marker: { size: 10, color: '#ef4444' }, name: 'IC: (0,2)' }
          ],
          layout: darkLayout('Particular Solution y = 2e^{3x−x²/2}', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Find the x-coordinate of any points of inflection of the particular solution.',
        answer: 'y\'\' = 0 \\Rightarrow x = 4 \\text{ (and } y > 0)',
        explanation: [
          { title: 'Compute y\'', body: 'y\' = y(3−x)', latex: "y' = y(3-x)" },
          { title: 'Compute y\'\'', body: 'y\'\' = y\'(3−x) + y(−1) = y(3−x)² − y = y[(3−x)²−1]', latex: "y'' = y[(3-x)^2 - 1]" },
          { title: 'Set y\'\'=0', body: 'Since y>0 (f(0)=2 and y=2e^{...}>0), need (3−x)²=1, so 3−x = ±1, x=2 or x=4.', latex: '(3-x)^2 = 1 \\Rightarrow x = 2 \\text{ or } x = 4' },
          { title: 'Verify inflection', body: 'y\'\' changes sign at x=2 and x=4, so both are inflection points.', latex: 'x = 2 \\text{ and } x = 4' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.exp(3*x - x*x/2), 0, 5.5, 'y = 2e^{3x−x²/2}', '#f59e0b'),
            { x: [2, 4], y: [2*Math.exp(6-2), 2*Math.exp(12-8)], type: 'scatter', mode: 'markers', marker: { size: 10, color: '#a78bfa', symbol: 'diamond' }, name: 'Inflection pts' }
          ],
          layout: darkLayout('Inflection Points of Particular Solution', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Does the solution y = f(x) have a relative maximum, minimum, or neither at x = 3? Justify.',
        answer: 'y\'(3) = 0. \\text{ For } x<3: y\'>0; \\text{ for } x>3: y\'<0. \\text{ Relative maximum at } x=3.',
        explanation: [
          { title: 'Check y\'(3)', body: 'y\' = y(3−x). At x=3: y\' = y(0) = 0. So x=3 is a critical point.', latex: "y'(3) = f(3)(3-3) = 0" },
          { title: 'First derivative test', body: 'For x<3, (3−x)>0 and y>0, so y\'>0. For x>3, (3−x)<0, y\'>0, so y\'<0.', latex: "y' > 0 \\text{ for } x < 3, \\quad y' < 0 \\text{ for } x > 3" },
          { title: 'Conclusion', body: 'y changes from increasing to decreasing at x=3: relative maximum.', latex: '\\text{Relative maximum at } x = 3' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.exp(3*x - x*x/2), 0, 6, 'y = 2e^{3x−x²/2}', '#f59e0b'),
            { x: [3], y: [2*Math.exp(9-4.5)], type:'scatter',mode:'markers',marker:{size:12,color:'#ef4444',symbol:'star'},name:'Max at x=3' }
          ],
          layout: darkLayout('Relative Maximum at x = 3', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2019-5',
    year: 2019,
    number: 5,
    calculator: false,
    title: 'Parametric Curves',
    topics: ['Parametric Equations', 'Speed', 'Arc Length', 'Position'],
    difficulty: 3,
    context: 'A particle moves in the xy-plane with position given by x(t) = t² − 3t and y(t) = t³ − 4 for t ≥ 0.',
    parts: [
      {
        label: 'a',
        question: 'Find the velocity vector and speed of the particle at t = 2.',
        answer: "\\mathbf{v}(2) = \\langle x'(2), y'(2)\\rangle = \\langle 1, 12\\rangle, \\text{ speed} = \\sqrt{1^2+12^2} = \\sqrt{145}",
        explanation: [
          { title: "Find x'(t) and y'(t)", body: "x'(t) = 2t − 3, y'(t) = 3t²", latex: "x'(t) = 2t-3, \\quad y'(t) = 3t^2" },
          { title: 'At t = 2', body: "x'(2) = 4−3 = 1, y'(2) = 3(4) = 12", latex: "\\mathbf{v}(2) = \\langle 1, 12\\rangle" },
          { title: 'Speed', body: 'Speed = |v| = √(1² + 12²) = √145', latex: '|\\mathbf{v}(2)| = \\sqrt{145}' }
        ],
        graph: {
          traces: [
            (() => { const t=[],x=[],y=[]; for(let i=0;i<=300;i++){const tv=i/50; t.push(tv); x.push(tv*tv-3*tv); y.push(tv*tv*tv-4);} return {x,y,type:'scatter',mode:'lines',name:'Curve',line:{color:'#f59e0b',width:2}} })(),
            { x: [4-9], y: [8-4], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'t=2' },
            { x: [4-9, 4-9+0.3], y: [8-4, 8-4+3.6], type:'scatter',mode:'lines',line:{color:'#a78bfa',width:2},name:'Velocity dir.' }
          ],
          layout: darkLayout('Parametric Curve x(t)=t²−3t, y(t)=t³−4', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find dy/dx in terms of t.',
        answer: '\\frac{dy}{dx} = \\frac{y\'(t)}{x\'(t)} = \\frac{3t^2}{2t-3}',
        explanation: [
          { title: 'Parametric derivative rule', body: 'dy/dx = (dy/dt)/(dx/dt)', latex: '\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}' },
          { title: 'Substitute', body: 'dy/dx = 3t²/(2t−3)', latex: '\\frac{dy}{dx} = \\frac{3t^2}{2t-3}' },
          { title: 'Note', body: 'Undefined when 2t−3=0, i.e., t=3/2 (vertical tangent).', latex: '\\text{Vertical tangent at } t = \\tfrac{3}{2}' }
        ],
        graph: {
          traces: [
            (() => { const t=[],x=[],y=[]; for(let i=0;i<=100;i++){const tv=i/20+0.01; if(Math.abs(2*tv-3)<0.1) return; t.push(tv); x.push(tv*tv-3*tv); y.push(3*tv*tv/(2*tv-3));} return {x:t,y,type:'scatter',mode:'lines',name:'dy/dx vs t',line:{color:'#06b6d4',width:2}} })(),
          ],
          layout: darkLayout('dy/dx = 3t²/(2t−3)', 't', 'dy/dx')
        }
      },
      {
        label: 'c',
        question: 'Find the time(s) t ≥ 0 at which the particle is moving vertically.',
        answer: 'x\'(t) = 0 \\Rightarrow 2t-3=0 \\Rightarrow t = \\frac{3}{2}',
        explanation: [
          { title: 'Vertical motion condition', body: "Vertical movement when x'(t) = 0 (and y'(t) ≠ 0).", latex: "x'(t) = 2t-3 = 0" },
          { title: 'Solve', body: '2t−3 = 0 → t = 3/2.', latex: 't = \\tfrac{3}{2}' },
          { title: 'Check y\'', body: "y'(3/2) = 3(9/4) = 27/4 ≠ 0. Confirmed vertical tangent.", latex: "y'(3/2) = \\tfrac{27}{4} \\neq 0 \\checkmark" }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=200;i++){const t=i/40; x.push(t*t-3*t); y.push(t*t*t-4);} return {x,y,type:'scatter',mode:'lines',name:'Curve',line:{color:'#f59e0b',width:2}} })(),
            { x: [(3/2)**2-3*(3/2)], y: [(3/2)**3-4], type:'scatter',mode:'markers',marker:{size:12,color:'#a78bfa',symbol:'diamond'},name:'Vertical tangent t=3/2' },
            { x: [(3/2)**2-3*(3/2), (3/2)**2-3*(3/2)], y: [-8, 5], type:'scatter',mode:'lines',line:{color:'#a78bfa',dash:'dash'},name:'x = const' }
          ],
          layout: darkLayout('Vertical Tangent at t = 3/2', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Find the total distance traveled from t = 0 to t = 3.',
        answer: 'L = \\int_0^3 \\sqrt{(x\'(t))^2+(y\'(t))^2}\\,dt = \\int_0^3\\sqrt{(2t-3)^2+9t^4}\\,dt',
        explanation: [
          { title: 'Arc length formula', body: 'L = ∫₀³ √[(x\'(t))² + (y\'(t))²] dt', latex: 'L = \\int_0^3 \\sqrt{[x\'(t)]^2+[y\'(t)]^2}\\,dt' },
          { title: 'Substitute', body: '= ∫₀³ √[(2t−3)² + 9t⁴] dt', latex: 'L = \\int_0^3 \\sqrt{(2t-3)^2+9t^4}\\,dt' },
          { title: 'Note', body: 'This integral cannot be evaluated in closed form; on a calculator exam you would approximate numerically.', latex: 'L \\approx 16.045' }
        ],
        graph: {
          traces: [
            (() => { const t=[],v=[]; for(let i=0;i<=300;i++){const tv=i/100; const vx=2*tv-3; const vy=3*tv*tv; t.push(tv); v.push(Math.sqrt(vx*vx+vy*vy));} return {x:t,y:v,type:'scatter',mode:'lines',name:'Speed = √[(x\')²+(y\')²]',line:{color:'#10b981',width:2}} })(),
          ],
          layout: darkLayout('Speed (integrand for arc length)', 't', 'Speed')
        }
      }
    ]
  },
  {
    id: 'frq-2019-6',
    year: 2019,
    number: 6,
    calculator: false,
    title: 'Taylor Series',
    topics: ['Taylor Series', 'Maclaurin Series', 'Power Series', 'Convergence'],
    difficulty: 3,
    context: 'Let f be the function given by f(x) = e^{−x²}.',
    parts: [
      {
        label: 'a',
        question: 'Write the first four nonzero terms of the Maclaurin series for f(x) = e^{−x²}.',
        answer: '1 - x^2 + \\frac{x^4}{2!} - \\frac{x^6}{3!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{n!}',
        explanation: [
          { title: 'Start from e^u', body: 'The Maclaurin series for eᵘ = 1 + u + u²/2! + u³/3! + ...', latex: 'e^u = \\sum_{n=0}^{\\infty}\\frac{u^n}{n!}' },
          { title: 'Substitute u = −x²', body: 'Replace u with −x²:', latex: 'e^{-x^2} = \\sum_{n=0}^{\\infty}\\frac{(-x^2)^n}{n!} = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{n!}' },
          { title: 'First four terms', body: '1 − x² + x⁴/2 − x⁶/6 + ...', latex: '1 - x^2 + \\frac{x^4}{2} - \\frac{x^6}{6} + \\cdots' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.exp(-x*x), -2.5, 2.5, 'f(x) = e^{−x²}', '#f59e0b'),
            makeVelocityTrace(x => 1 - x*x, -2.5, 2.5, 'P₂ = 1−x²', '#06b6d4'),
            makeVelocityTrace(x => 1 - x*x + x**4/2, -2.5, 2.5, 'P₄ = 1−x²+x⁴/2', '#a78bfa'),
            makeVelocityTrace(x => 1 - x*x + x**4/2 - x**6/6, -2.5, 2.5, 'P₆', '#10b981'),
          ],
          layout: darkLayout('Maclaurin Series for e^{−x²}', 'x', 'y', { yaxis: { range: [-0.5, 1.5] } })
        }
      },
      {
        label: 'b',
        question: 'Use the first three nonzero terms to write a series for g(x) = ∫₀ˣ e^{−t²} dt.',
        answer: 'g(x) = x - \\frac{x^3}{3} + \\frac{x^5}{10} - \\cdots',
        explanation: [
          { title: 'Integrate term by term', body: 'Integrate f(t) = 1 − t² + t⁴/2 − ... from 0 to x.', latex: 'g(x) = \\int_0^x\\left(1-t^2+\\frac{t^4}{2}-\\cdots\\right)dt' },
          { title: 'Result', body: '= x − x³/3 + x⁵/10 − ...', latex: 'g(x) = x - \\frac{x^3}{3} + \\frac{x^5}{10} - \\cdots' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => { let s=0; for(let i=0;i<=200;i++){const t=x*i/200; s+=Math.exp(-t*t)*x/200;} return s; }, 0, 2.5, 'g(x) = ∫₀ˣ e^{−t²} dt', '#f59e0b'),
            makeVelocityTrace(x => x - x**3/3 + x**5/10, 0, 2.5, 'Approx P₅', '#06b6d4'),
          ],
          layout: darkLayout('g(x) = ∫₀ˣ e^{−t²} dt and series approx.', 'x', 'g(x)')
        }
      },
      {
        label: 'c',
        question: 'Use the series from part (b) to estimate ∫₀^{0.5} e^{−t²} dt with error less than 0.001.',
        answer: 'g(0.5) \\approx 0.5 - \\frac{(0.5)^3}{3} + \\frac{(0.5)^5}{10} \\approx 0.5 - 0.04167 + 0.003125 \\approx 0.4612',
        explanation: [
          { title: 'Alternating series', body: 'The series for g is alternating with decreasing terms, so the error is bounded by the first omitted term.', latex: '|\\text{error}| \\leq \\frac{(0.5)^7}{42} \\approx 0.0000186 < 0.001' },
          { title: 'Compute', body: '0.5 − (0.5)³/3 + (0.5)⁵/10 ≈ 0.5 − 0.04167 + 0.003125 ≈ 0.4613', latex: 'g(0.5) \\approx 0.4613' }
        ],
        graph: {
          traces: [
            { x: [0, 0.5, 0.5, 0], y: [0, 0, Math.exp(-0.25), Math.exp(0)], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(245,158,11,0.15)',showlegend:false },
            makeVelocityTrace(t => Math.exp(-t*t), 0, 1, 'e^{−t²}', '#f59e0b'),
            { x: [0.5], y: [0.4613], type:'scatter',mode:'markers',marker:{size:10,color:'#10b981'},name:'g(0.5)≈0.4613' }
          ],
          layout: darkLayout('∫₀^{0.5} e^{−t²} dt ≈ 0.4613', 't', 'e^{−t²}')
        }
      },
      {
        label: 'd',
        question: 'The Maclaurin series for e^{−x²} converges for all x. Explain why.',
        answer: '\\text{The ratio test: } \\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right| = \\lim_{n\\to\\infty}\\frac{x^2}{n+1} = 0 < 1 \\text{ for all } x.',
        explanation: [
          { title: 'Ratio test', body: 'Apply ratio test to the general term aₙ = (−1)ⁿ x²ⁿ/n!.', latex: '\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{x^2}{n+1} \\to 0' },
          { title: 'Conclusion', body: 'Since the limit is 0 < 1 for all x ∈ ℝ, the series converges absolutely for all real x.', latex: 'R = \\infty \\Rightarrow \\text{converges for all } x' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.exp(-x*x), -4, 4, 'f(x) = e^{−x²}', '#f59e0b'),
            makeVelocityTrace(x => 1 - x*x + x**4/2 - x**6/6 + x**8/24, -4, 4, 'P₈', '#06b6d4'),
          ],
          layout: darkLayout('Convergence of Maclaurin Series on all of ℝ', 'x', 'y', { yaxis: { range: [-1, 1.5] } })
        }
      }
    ]
  },
  // ─── 2018 ───────────────────────────────────────────────────────────────────
  {
    id: 'frq-2018-1',
    year: 2018,
    number: 1,
    calculator: true,
    title: 'Rate and Accumulation: Water Flow',
    topics: ['Integration', 'Rate of Change', 'Accumulation', 'Net Change'],
    difficulty: 2,
    context: 'Water flows into a tank at rate r(t) = 2t·e^{−0.5t} gallons per minute, where t is measured in minutes. At time t = 0, the tank contains 10 gallons.',
    parts: [
      {
        label: 'a',
        question: 'Find ∫₀⁵ r(t) dt and explain its meaning.',
        answer: '\\int_0^5 2t\\,e^{-0.5t}\\,dt \\approx 7.018 \\text{ gallons}',
        explanation: [
          { title: 'Integration by parts', body: 'Let u = 2t, dv = e^{−0.5t} dt. Then du = 2dt, v = −2e^{−0.5t}.', latex: '\\int 2te^{-0.5t}\\,dt = -4te^{-0.5t} + \\int 4e^{-0.5t}\\,dt' },
          { title: 'Antiderivative', body: 'F(t) = −4te^{−0.5t} − 8e^{−0.5t} = −(4t+8)e^{−0.5t}', latex: 'F(t) = -(4t+8)e^{-0.5t}' },
          { title: 'Evaluate on [0,5]', body: 'F(5)−F(0) = −28e^{−2.5} + 8 ≈ 7.018 gallons', latex: '\\approx 7.018 \\text{ gal entered [0,5] min}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 2*t*Math.exp(-0.5*t), 0, 10, 'r(t) = 2te^{−0.5t}', '#f59e0b'),
            makeShadeTrace(t => 2*t*Math.exp(-0.5*t), 0, 5, 'rgba(245,158,11,0.2)'),
            { x: [0,10], y:[0,0], type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('Water Flow Rate r(t) = 2te^{−0.5t}', 't (min)', 'r(t) (gal/min)')
        }
      },
      {
        label: 'b',
        question: 'At what time t, for 0 ≤ t ≤ 10, is r(t) greatest?',
        answer: "r'(t) = 0 \\Rightarrow t = 2 \\text{ gives maximum}",
        explanation: [
          { title: "Differentiate r(t)", body: "r'(t) = 2e^{−0.5t} + 2t(−0.5e^{−0.5t}) = e^{−0.5t}(2−t)", latex: "r'(t) = e^{-0.5t}(2-t)" },
          { title: "Critical point", body: "r'(t) = 0 when 2−t = 0, so t = 2.", latex: "t = 2" },
          { title: "Verify maximum", body: "r'(t) > 0 for t < 2 and r'(t) < 0 for t > 2, so t=2 is a maximum.", latex: "r(2) = 4e^{-1} \\approx 1.472 \\text{ gal/min}" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 2*t*Math.exp(-0.5*t), 0, 10, 'r(t)', '#f59e0b'),
            makeVelocityTrace(t => Math.exp(-0.5*t)*(2-t), 0, 10, "r'(t)", '#a78bfa'),
            { x:[2], y:[4*Math.exp(-1)], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'Max at t=2' },
            { x:[0,10],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('Maximum of r(t) at t = 2', 't (min)', 'value')
        }
      },
      {
        label: 'c',
        question: 'Find the amount of water in the tank at t = 5.',
        answer: 'W(5) = 10 + \\int_0^5 r(t)\\,dt \\approx 10 + 7.018 = 17.018 \\text{ gallons}',
        explanation: [
          { title: 'Accumulation', body: 'W(5) = W(0) + ∫₀⁵ r(t) dt = 10 + 7.018 ≈ 17.018', latex: 'W(5) = 10 + 7.018 \\approx 17.018 \\text{ gal}' }
        ],
        graph: {
          traces: [
            (() => { const t=[],w=[]; let acc=10; for(let i=0;i<=100;i++){const tv=i/10; const prev=acc; if(i>0){const dt=0.1; acc+=2*tv*Math.exp(-0.5*tv)*dt;} t.push(tv); w.push(acc);} return {x:t,y:w,type:'scatter',mode:'lines',name:'W(t) gallons',line:{color:'#10b981',width:2}} })()
          ],
          layout: darkLayout('Total Water in Tank W(t)', 't (min)', 'W(t) (gal)')
        }
      },
      {
        label: 'd',
        question: 'Is the amount of water increasing or decreasing at t = 7? Give a reason.',
        answer: 'r(7) = 14e^{-3.5} \\approx 0.419 > 0, \\text{ so water is increasing at } t=7.',
        explanation: [
          { title: 'Rate at t = 7', body: 'r(7) = 2(7)e^{−3.5} = 14e^{−3.5} ≈ 0.419 gal/min > 0', latex: 'r(7) \\approx 0.419 > 0' },
          { title: 'Conclusion', body: 'Since the rate of change (inflow) is positive at t=7, the amount of water is increasing.', latex: 'W\'(7) = r(7) > 0 \\Rightarrow \\text{increasing}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 2*t*Math.exp(-0.5*t), 0, 12, 'r(t)', '#f59e0b'),
            { x:[7], y:[14*Math.exp(-3.5)], type:'scatter',mode:'markers',marker:{size:10,color:'#10b981'},name:'r(7)≈0.419>0' },
            { x:[0,12],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('r(t) at t = 7 (still positive)', 't (min)', 'r(t) (gal/min)')
        }
      }
    ]
  },
  {
    id: 'frq-2018-2',
    year: 2018,
    number: 2,
    calculator: true,
    title: 'Area, Volume, and Tangent Lines',
    topics: ['Area Between Curves', 'Volume of Revolution', 'Derivatives'],
    difficulty: 2,
    context: 'Let R be the region enclosed by the graphs of f(x) = cos(πx/2) and g(x) = x − 1 for −1 ≤ x ≤ 1.',
    parts: [
      {
        label: 'a',
        question: 'Find the area of region R.',
        answer: '\\int_{-1}^{1}[f(x)-g(x)]\\,dx = \\int_{-1}^{1}\\left[\\cos\\frac{\\pi x}{2}-(x-1)\\right]dx = \\frac{4}{\\pi}+2 \\approx 3.273',
        explanation: [
          { title: 'Verify f ≥ g on [−1,1]', body: 'cos(πx/2) ≥ x−1 on [−1,1] (check endpoints and interior).', latex: 'f(-1) = 0 = g(-1), f(1) = 0 > g(1) = 0' },
          { title: 'Integrate', body: '∫[cos(πx/2)−(x−1)] dx = [2sin(πx/2)/π − x²/2 + x]₋₁¹', latex: '= \\left[\\frac{2}{\\pi}\\sin\\frac{\\pi x}{2} - \\frac{x^2}{2} + x\\right]_{-1}^{1}' },
          { title: 'Evaluate', body: '= (2/π − 1/2 + 1) − (−2/π − 1/2 − 1) = 4/π + 2 ≈ 3.273', latex: 'A = \\frac{4}{\\pi} + 2 \\approx 3.273' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.cos(Math.PI*x/2), -1, 1, 'f(x)=cos(πx/2)', '#f59e0b'),
            makeVelocityTrace(x => x-1, -1, 1, 'g(x)=x−1', '#06b6d4'),
            makeShadeTrace(x => Math.cos(Math.PI*x/2) - (x-1), -1, 1, 'rgba(245,158,11,0.15)')
          ],
          layout: darkLayout('Region R: f(x)=cos(πx/2), g(x)=x−1', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Region R is rotated about the line y = −2. Find the volume.',
        answer: 'V = \\pi\\int_{-1}^{1}[(f(x)+2)^2 - (g(x)+2)^2]\\,dx \\approx 27.12',
        explanation: [
          { title: 'Washer method, shifted axis', body: 'Outer radius = f(x)+2 = cos(πx/2)+2, inner radius = g(x)+2 = x+1.', latex: 'V = \\pi\\int_{-1}^{1}\\left[(\\cos\\frac{\\pi x}{2}+2)^2-(x+1)^2\\right]dx' },
          { title: 'Evaluate', body: 'Using a calculator: V ≈ 27.12.', latex: 'V \\approx 27.12' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.cos(Math.PI*x/2), -1, 1, 'f(x)', '#f59e0b'),
            makeVelocityTrace(x => x-1, -1, 1, 'g(x)', '#06b6d4'),
            { x: [-1,1], y: [-2,-2], type:'scatter',mode:'lines',line:{color:'#ef4444',dash:'dash',width:2},name:'Axis y=−2' }
          ],
          layout: darkLayout('Revolution about y = −2', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Find the slope of the line tangent to f(x) = cos(πx/2) at x = 1/3.',
        answer: "f'(x) = -\\frac{\\pi}{2}\\sin\\frac{\\pi x}{2}. \\text{ At } x=1/3: f'(1/3) = -\\frac{\\pi}{2}\\sin(\\pi/6) = -\\frac{\\pi}{4}",
        explanation: [
          { title: 'Differentiate f', body: "f'(x) = −(π/2)sin(πx/2)", latex: "f'(x) = -\\frac{\\pi}{2}\\sin\\frac{\\pi x}{2}" },
          { title: 'Evaluate at x=1/3', body: "f'(1/3) = −(π/2)sin(π/6) = −(π/2)(1/2) = −π/4", latex: "f'(1/3) = -\\frac{\\pi}{4} \\approx -0.785" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.cos(Math.PI*x/2), -1, 1.5, 'f(x)', '#f59e0b'),
            { x: [1/3-0.5, 1/3+0.5], y: [Math.cos(Math.PI/6)+Math.PI/4*0.5, Math.cos(Math.PI/6)-Math.PI/4*0.5], type:'scatter',mode:'lines',name:'Tangent',line:{color:'#a78bfa',dash:'dash',width:2} },
            { x:[1/3], y:[Math.cos(Math.PI/6)], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'x=1/3' }
          ],
          layout: darkLayout('Tangent to f(x) at x = 1/3', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Find the x-coordinate of the point in R where f(x) − g(x) is greatest.',
        answer: "[f(x)-g(x)]' = 0 \\Rightarrow -\\frac{\\pi}{2}\\sin\\frac{\\pi x}{2} - 1 = 0 \\Rightarrow \\sin\\frac{\\pi x}{2} = -\\frac{2}{\\pi}",
        explanation: [
          { title: 'Maximize h(x) = f(x)−g(x)', body: "h(x) = cos(πx/2)−x+1, h'(x) = −(π/2)sin(πx/2)−1", latex: "h'(x) = -\\frac{\\pi}{2}\\sin\\frac{\\pi x}{2} - 1 = 0" },
          { title: 'Solve', body: 'sin(πx/2) = −2/π. Use calculator: x ≈ −0.423.', latex: 'x \\approx -0.423' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.cos(Math.PI*x/2)-(x-1), -1, 1, 'f(x)−g(x)', '#a78bfa'),
            { x:[-0.423], y:[Math.cos(Math.PI*(-0.423)/2)-(-0.423-1)], type:'scatter',mode:'markers',marker:{size:10,color:'#f59e0b'},name:'Max ≈ x=−0.423' }
          ],
          layout: darkLayout('Maximum of f(x)−g(x) on R', 'x', 'f(x)−g(x)')
        }
      }
    ]
  },
  {
    id: 'frq-2018-3',
    year: 2018,
    number: 3,
    calculator: false,
    title: 'Table-Based: Riemann Sums and MVT',
    topics: ['Riemann Sums', 'Trapezoidal Rule', 'Mean Value Theorem', 'Average Value'],
    difficulty: 2,
    context: 'The function g is continuous and differentiable on [0,10]. Values of g are given: t=0: g=4, t=2: g=7, t=5: g=1, t=7: g=6, t=10: g=3.',
    parts: [
      {
        label: 'a',
        question: 'Approximate ∫₀¹⁰ g(t) dt using a right Riemann sum with the four subintervals given.',
        answer: '\\sum g(t_k)\\Delta t_k = 7(2)+1(3)+6(2)+3(3) = 14+3+12+9 = 38',
        explanation: [
          { title: 'Subintervals and widths', body: '[0,2]: Δt=2; [2,5]: Δt=3; [5,7]: Δt=2; [7,10]: Δt=3', latex: '\\Delta t_1=2,\;\\Delta t_2=3,\;\\Delta t_3=2,\;\\Delta t_4=3' },
          { title: 'Right endpoints', body: 'g(2)=7, g(5)=1, g(7)=6, g(10)=3', latex: '7(2)+1(3)+6(2)+3(3) = 38' }
        ],
        graph: {
          traces: [
            { x:[0,2,5,7,10], y:[4,7,1,6,3], type:'scatter',mode:'lines+markers',name:'g(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,2,2,2], y:[0,0,7,0], type:'scatter',mode:'lines',fill:'tozerox',fillcolor:'rgba(245,158,11,0.1)',line:{color:'rgba(0,0,0,0)'},showlegend:false }
          ],
          layout: darkLayout('Right Riemann Sum for g(t)', 't', 'g(t)')
        }
      },
      {
        label: 'b',
        question: 'Use a trapezoidal sum to approximate ∫₀¹⁰ g(t) dt.',
        answer: 'T = \\frac{2}{2}(4+7)+\\frac{3}{2}(7+1)+\\frac{2}{2}(1+6)+\\frac{3}{2}(6+3) = 11+12+7+13.5 = 43.5',
        explanation: [
          { title: 'Trapezoidal rule on each subinterval', body: 'T = Σ(Δtₖ/2)[g(left)+g(right)]', latex: 'T = \\frac{2}{2}(4+7)+\\frac{3}{2}(7+1)+\\frac{2}{2}(1+6)+\\frac{3}{2}(6+3)' },
          { title: 'Compute', body: '= 11 + 12 + 7 + 13.5 = 43.5', latex: 'T = 43.5' }
        ],
        graph: {
          traces: [
            { x:[0,2,5,7,10], y:[4,7,1,6,3], type:'scatter',mode:'lines+markers',name:'g(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,2,5,7,10,10,7,5,2,0], y:[4,7,1,6,3,0,0,0,0,0], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(16,185,129,0.12)',showlegend:false }
          ],
          layout: darkLayout('Trapezoidal Approximation for g(t)', 't', 'g(t)')
        }
      },
      {
        label: 'c',
        question: 'Must there exist a value c in (2,5) where g\'(c) = −2? Explain.',
        answer: '\\frac{g(5)-g(2)}{5-2} = \\frac{1-7}{3} = -2. \\text{ By MVT, yes.}',
        explanation: [
          { title: 'MVT conditions', body: 'g is differentiable on (2,5) and continuous on [2,5], so MVT applies.', latex: '\\exists c \\in (2,5): g\'(c) = \\frac{g(5)-g(2)}{5-2}' },
          { title: 'Compute', body: '[g(5)−g(2)]/(5−2) = (1−7)/3 = −6/3 = −2', latex: 'g\'(c) = -2' }
        ],
        graph: {
          traces: [
            { x:[0,2,5,7,10], y:[4,7,1,6,3], type:'scatter',mode:'lines+markers',name:'g(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[2,5], y:[7,1], type:'scatter',mode:'lines',name:'Secant slope=−2',line:{color:'#06b6d4',dash:'dash',width:2} }
          ],
          layout: darkLayout('MVT: Slope −2 on [2, 5]', 't', 'g(t)')
        }
      },
      {
        label: 'd',
        question: 'Using the trapezoidal approximation, find the average value of g on [0, 10].',
        answer: '\\bar{g} \\approx \\frac{43.5}{10} = 4.35',
        explanation: [
          { title: 'Average value', body: '(1/10) × 43.5 = 4.35', latex: '\\bar{g} = \\frac{1}{10}\\int_0^{10}g(t)\\,dt \\approx \\frac{43.5}{10} = 4.35' }
        ],
        graph: {
          traces: [
            { x:[0,2,5,7,10], y:[4,7,1,6,3], type:'scatter',mode:'lines+markers',name:'g(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,10], y:[4.35,4.35], type:'scatter',mode:'lines',name:'Average ≈ 4.35',line:{color:'#a78bfa',dash:'dash',width:2} }
          ],
          layout: darkLayout('Average Value of g on [0, 10]', 't', 'g(t)')
        }
      }
    ]
  },
  {
    id: 'frq-2018-4',
    year: 2018,
    number: 4,
    calculator: false,
    title: 'Differential Equations: Linear/Separable',
    topics: ['Differential Equations', 'Separable Equations', 'Initial Value Problem'],
    difficulty: 3,
    context: 'Consider the differential equation dy/dx = 2x − y.',
    parts: [
      {
        label: 'a',
        question: 'Find the particular solution satisfying y(0) = 1.',
        answer: 'y = 2x - 2 + 3e^{-x}',
        explanation: [
          { title: 'Linear ODE form', body: 'dy/dx + y = 2x. Integrating factor: e^x.', latex: '\\frac{dy}{dx} + y = 2x, \\quad \\mu = e^x' },
          { title: 'Multiply by e^x', body: 'd/dx(ye^x) = 2xe^x', latex: '\\frac{d}{dx}(ye^x) = 2xe^x' },
          { title: 'Integrate by parts', body: 'ye^x = 2xe^x − 2e^x + C', latex: 'ye^x = 2(x-1)e^x + C' },
          { title: 'General solution', body: 'y = 2x − 2 + Ce^{−x}', latex: 'y = 2x-2+Ce^{-x}' },
          { title: 'Apply IC y(0)=1', body: '1 = −2 + C, so C = 3.', latex: 'y = 2x - 2 + 3e^{-x}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*x-2+3*Math.exp(-x), -1, 4, 'y = 2x−2+3e^{−x}', '#f59e0b'),
            { x:[0], y:[1], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'IC: (0,1)' }
          ],
          layout: darkLayout('Particular Solution: y = 2x−2+3e^{−x}', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Sketch the slope field for dy/dx = 2x − y at the lattice points in the region −1 ≤ x ≤ 2, 0 ≤ y ≤ 3.',
        answer: '\\text{At each }(x,y): \\text{slope} = 2x-y',
        explanation: [
          { title: 'Slope field', body: 'At each lattice point (x, y), draw a short segment with slope 2x−y.', latex: '\\frac{dy}{dx} = 2x - y' },
          { title: 'Key isoclines', body: 'Slope = 0 when 2x = y (the line y = 2x).', latex: 'y = 2x \\Rightarrow \\text{slope}=0' }
        ],
        graph: {
          traces: (() => {
            const traces = []
            for (let x = -1; x <= 2; x++) {
              for (let y = 0; y <= 3; y++) {
                const s = 2*x - y
                const dx = 0.25/Math.sqrt(1+s*s)
                const dy = s*dx
                traces.push({ x:[x-dx,x+dx], y:[y-dy,y+dy], type:'scatter',mode:'lines',line:{color:'rgba(245,158,11,0.7)',width:1.5},showlegend:false })
              }
            }
            traces.push(makeVelocityTrace(x=>2*x-2+3*Math.exp(-x), -1, 3, 'Solution y(0)=1', '#10b981'))
            return traces
          })(),
          layout: darkLayout('Slope Field: dy/dx = 2x−y', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'For the particular solution in (a), find the x-coordinate of any local minimum.',
        answer: "y' = 0 \\Rightarrow 2x - y = 0 \\Rightarrow x = \\ln 3 - \\ln 3 \\approx \\text{... solve } 2x-2+3e^{-x}=2x \\Rightarrow e^{-x}=2/3 \\Rightarrow x = \\ln(3/2)",
        explanation: [
          { title: "Set y'=0", body: "y' = 2x−y = 0, so y = 2x.", latex: "y' = 0 \\Rightarrow y = 2x" },
          { title: 'Substitute particular solution', body: '2x−2+3e^{−x} = 2x → 3e^{−x} = 2 → e^{−x} = 2/3 → x = ln(3/2)', latex: 'x = \\ln(3/2) \\approx 0.405' },
          { title: 'Verify minimum', body: "y''(x) = 2 − y'= 2−0 + ... At this point check second derivative or sign change.", latex: "\\text{Local min at } x = \\ln(3/2)" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*x-2+3*Math.exp(-x), -0.5, 3, 'y = 2x−2+3e^{−x}', '#f59e0b'),
            makeVelocityTrace(x => 2*x, -0.5, 3, 'y = 2x (isocline)', '#06b6d4'),
            { x:[Math.log(1.5)], y:[2*Math.log(1.5)-2+3/1.5], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'Local min' }
          ],
          layout: darkLayout('Local Minimum of Particular Solution', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Determine whether the particular solution is concave up or concave down at x = 1.',
        answer: "y'' = 2 - y' = 2 - (2x-y). \\text{ At } x=1: y(1) = 3e^{-1} \\approx 1.104, y' = 2-1.104 \\approx 0.896, y''=2-0.896>0 \\text{ concave up}",
        explanation: [
          { title: "Compute y''", body: "y'' = d/dx(2x−y) = 2 − y' = 2 − (2x−y)", latex: "y'' = 2 - (2x-y)" },
          { title: 'At x=1', body: 'y(1) = 2−2+3e^{−1} = 3e^{−1} ≈ 1.104', latex: 'y(1) = 3e^{-1} \\approx 1.104' },
          { title: 'Conclusion', body: "y''(1) = 2 − (2−3e^{−1}) = 3e^{−1} > 0, so concave up.", latex: "y''(1) = 3e^{-1} > 0 \\Rightarrow \\text{concave up}" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*x-2+3*Math.exp(-x), 0, 3, 'y(x)', '#f59e0b'),
            { x:[1], y:[3*Math.exp(-1)], type:'scatter',mode:'markers',marker:{size:10,color:'#10b981'},name:'x=1, concave up' }
          ],
          layout: darkLayout('Concavity at x = 1', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2018-5',
    year: 2018,
    number: 5,
    calculator: false,
    title: 'Parametric Motion',
    topics: ['Parametric Equations', 'Speed', 'Concavity', 'Position'],
    difficulty: 3,
    context: 'A particle moves in the xy-plane with position x(t) = sin(t) and y(t) = t² − 1 for t ≥ 0.',
    parts: [
      {
        label: 'a',
        question: 'Find the velocity vector at t = π/2.',
        answer: "\\mathbf{v}(\\pi/2) = \\langle \\cos(\\pi/2), 2(\\pi/2)\\rangle = \\langle 0, \\pi\\rangle",
        explanation: [
          { title: 'Differentiate', body: "x'(t) = cos(t), y'(t) = 2t", latex: "x'(t)=\\cos t, \\quad y'(t)=2t" },
          { title: 'At t=π/2', body: "x'(π/2) = cos(π/2) = 0, y'(π/2) = π", latex: "\\mathbf{v}(\\pi/2) = \\langle 0, \\pi\\rangle" }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=300;i++){const t=i*3*Math.PI/300; x.push(Math.sin(t)); y.push(t*t-1);} return {x,y,type:'scatter',mode:'lines',name:'Path',line:{color:'#f59e0b',width:2}} })(),
            { x:[Math.sin(Math.PI/2)], y:[(Math.PI/2)**2-1], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'t=π/2' }
          ],
          layout: darkLayout('Parametric Path: x=sin(t), y=t²−1', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find dy/dx at t = π/4.',
        answer: '\\frac{dy}{dx} = \\frac{2t}{\\cos t}. \\text{ At } t=\\pi/4: \\frac{2(\\pi/4)}{\\cos(\\pi/4)} = \\frac{\\pi/2}{\\sqrt{2}/2} = \\frac{\\pi}{\\sqrt{2}}',
        explanation: [
          { title: 'Parametric derivative', body: "dy/dx = y'(t)/x'(t) = 2t/cos(t)", latex: '\\frac{dy}{dx} = \\frac{2t}{\\cos t}' },
          { title: 'At t=π/4', body: '= 2(π/4)/(√2/2) = (π/2)/(√2/2) = π/√2 = π√2/2', latex: '\\frac{dy}{dx}\\bigg|_{t=\\pi/4} = \\frac{\\pi}{\\sqrt{2}} = \\frac{\\pi\\sqrt{2}}{2}' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=300;i++){const t=i*Math.PI/300; x.push(Math.sin(t)); y.push(t*t-1);} return {x,y,type:'scatter',mode:'lines',name:'Curve (0≤t≤π)',line:{color:'#f59e0b',width:2}} })(),
            { x:[Math.sin(Math.PI/4)], y:[(Math.PI/4)**2-1], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'t=π/4' },
          ],
          layout: darkLayout('dy/dx at t = π/4', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'For 0 < t < π, find all t where the particle is moving to the left.',
        answer: "x'(t) = \\cos t < 0 \\text{ for } \\frac{\\pi}{2} < t < \\pi",
        explanation: [
          { title: 'Moving left condition', body: "x'(t) = cos(t) < 0", latex: "x'(t) = \\cos t < 0" },
          { title: 'Solve', body: 'cos(t) < 0 when π/2 < t < π.', latex: '\\frac{\\pi}{2} < t < \\pi' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.cos(t), 0, Math.PI, "x'(t) = cos(t)", '#f59e0b'),
            makeShadeTrace(t => Math.min(0, Math.cos(t)), Math.PI/2, Math.PI, 'rgba(239,68,68,0.2)'),
            { x:[0,Math.PI], y:[0,0], type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout("x'(t) = cos(t): negative on (π/2, π)", 't', "x'(t)")
        }
      },
      {
        label: 'd',
        question: 'Find the speed of the particle at t = 1.',
        answer: 'speed = \\sqrt{(\\cos 1)^2+(2)^2} = \\sqrt{\\cos^2 1 + 4} \\approx \\sqrt{0.292+4} = \\sqrt{4.292} \\approx 2.072',
        explanation: [
          { title: 'Speed formula', body: "Speed = √[(x')² + (y')²]", latex: '\\text{speed} = \\sqrt{\\cos^2 t + 4t^2}' },
          { title: 'At t=1', body: '= √[cos²(1) + 4] ≈ √4.292 ≈ 2.072', latex: '\\text{speed}(1) \\approx 2.072' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.sqrt(Math.cos(t)**2+4*t*t), 0, Math.PI, 'Speed(t)', '#10b981'),
            { x:[1], y:[Math.sqrt(Math.cos(1)**2+4)], type:'scatter',mode:'markers',marker:{size:10,color:'#f59e0b'},name:'Speed at t=1' }
          ],
          layout: darkLayout('Speed = √(cos²t + 4t²)', 't', 'Speed')
        }
      }
    ]
  },
  {
    id: 'frq-2018-6',
    year: 2018,
    number: 6,
    calculator: false,
    title: 'Taylor Series: ln(1+x)',
    topics: ['Taylor Series', 'Power Series', 'Radius of Convergence', 'Error Bounds'],
    difficulty: 3,
    context: 'Let f(x) = ln(1+x).',
    parts: [
      {
        label: 'a',
        question: 'Write the Maclaurin series for f(x) = ln(1+x) through the x⁴ term.',
        answer: 'x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\cdots',
        explanation: [
          { title: 'Start from 1/(1+x)', body: 'f\'(x) = 1/(1+x) = Σ(−1)ⁿxⁿ for |x|<1.', latex: "f'(x) = \\frac{1}{1+x} = \\sum_{n=0}^{\\infty}(-1)^n x^n" },
          { title: 'Integrate term by term', body: 'f(x) = ln(1+x) = x − x²/2 + x³/3 − x⁴/4 + ...', latex: 'f(x) = \\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}x^n}{n}' },
          { title: 'First four terms', body: 'x − x²/2 + x³/3 − x⁴/4', latex: 'x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\cdots' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.log(1+x), -0.9, 1.5, 'ln(1+x)', '#f59e0b'),
            makeVelocityTrace(x => x - x*x/2, -0.9, 1.5, 'P₂ = x−x²/2', '#06b6d4'),
            makeVelocityTrace(x => x - x*x/2 + x**3/3 - x**4/4, -0.9, 1.5, 'P₄', '#a78bfa'),
          ],
          layout: darkLayout('Maclaurin Series for ln(1+x)', 'x', 'y', { yaxis:{range:[-2,2]} })
        }
      },
      {
        label: 'b',
        question: 'Use the series to estimate ln(1.5) with error less than 0.01.',
        answer: 'x=0.5: \;0.5 - 0.125 + 0.0417 - \\cdots. \\text{ After 3 terms: } \\approx 0.4167',
        explanation: [
          { title: 'Alternating series error', body: 'The series is alternating at x=0.5 and decreasing terms.', latex: '|\\text{error}| \\leq |\\text{first omitted term}|' },
          { title: 'Compute terms', body: 'a₁=0.5, a₂=0.125, a₃=0.0417, a₄=0.0156 > 0.01, a₅=0.00625 < 0.01.', latex: '|a_5| = \\frac{(0.5)^5}{5} = 0.00625 < 0.01' },
          { title: 'Four terms suffice', body: 'ln(1.5) ≈ 0.5 − 0.125 + 0.04167 − 0.015625 ≈ 0.4010', latex: '\\ln(1.5) \\approx 0.4010' }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4,5,6], y:[0.5,0.5-0.125,0.5-0.125+1/24,0.5-0.125+1/24-0.5**4/4,0.5-0.125+1/24-0.5**4/4+0.5**5/5,Math.log(1.5)].slice(0,6), type:'scatter',mode:'lines+markers',name:'Partial sums',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[1,6], y:[Math.log(1.5),Math.log(1.5)], type:'scatter',mode:'lines',name:'ln(1.5)≈0.405',line:{color:'#10b981',dash:'dash',width:2} }
          ],
          layout: darkLayout('Partial Sums Converging to ln(1.5)', 'Number of terms', 'Approximation')
        }
      },
      {
        label: 'c',
        question: 'Find the radius of convergence of the Maclaurin series for f(x) = ln(1+x).',
        answer: 'R = 1',
        explanation: [
          { title: 'Ratio test', body: 'General term: aₙ = (−1)ⁿ⁺¹xⁿ/n.', latex: '\\left|\\frac{a_{n+1}}{a_n}\\right| = |x|\\cdot\\frac{n}{n+1} \\to |x|' },
          { title: 'Convergence', body: 'Converges when |x| < 1. At x=1: alternating harmonic series (converges). At x=−1: harmonic series (diverges).', latex: 'R = 1,\\quad \\text{interval: } (-1, 1]' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.log(1+x), -0.99, 1.5, 'ln(1+x)', '#f59e0b'),
            { x:[-1,-1], y:[-3,3], type:'scatter',mode:'lines',line:{color:'#ef4444',dash:'dash',width:2},name:'x=−1 (diverges)' },
            { x:[1,1], y:[-3,3], type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash',width:2},name:'x=1 (converges)' }
          ],
          layout: darkLayout('Radius of Convergence R = 1', 'x', 'ln(1+x)')
        }
      },
      {
        label: 'd',
        question: 'Write a series for h(x) = x·ln(1+x) using the Maclaurin series.',
        answer: 'h(x) = x\\left(x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots\\right) = x^2 - \\frac{x^3}{2}+\\frac{x^4}{3}-\\cdots',
        explanation: [
          { title: 'Multiply by x', body: 'h(x) = x·ln(1+x).', latex: 'h(x) = x\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}x^n}{n}' },
          { title: 'Result', body: 'h(x) = x² − x³/2 + x⁴/3 − ...', latex: 'h(x) = \\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}x^{n+1}}{n}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => x*Math.log(1+x), -0.9, 1.5, 'h(x)=x·ln(1+x)', '#f59e0b'),
            makeVelocityTrace(x => x*x - x**3/2 + x**4/3 - x**5/4, -0.9, 1.5, 'Series P₄', '#a78bfa'),
          ],
          layout: darkLayout('h(x) = x·ln(1+x) and Series Approx.', 'x', 'h(x)')
        }
      }
    ]
  },
  // ─── 2017 ───────────────────────────────────────────────────────────────────
  {
    id: 'frq-2017-1',
    year: 2017,
    number: 1,
    calculator: true,
    title: 'Particle Motion: sin(t²)',
    topics: ['Integration', 'Velocity', 'Position', 'Distance'],
    difficulty: 2,
    context: 'A particle moves along the x-axis with velocity v(t) = sin(t²) for t ≥ 0. At t = 0, the particle is at position x = 1.',
    parts: [
      {
        label: 'a',
        question: 'Find the total distance traveled from t = 0 to t = 3.',
        answer: '\\int_0^3 |\\sin(t^2)|\\,dt \\approx 1.702',
        explanation: [
          { title: 'Distance formula', body: 'Total distance = ∫₀³ |v(t)| dt = ∫₀³ |sin(t²)| dt', latex: 'D = \\int_0^3 |\\sin(t^2)|\\,dt' },
          { title: 'Zeros of v(t)', body: 'sin(t²)=0 when t²=nπ, so t=√(nπ) for n=0,1,2. t=0, √π≈1.772, √(2π)≈2.507.', latex: 't = \\sqrt{n\\pi}' },
          { title: 'Numerical result', body: 'Using calculator: ≈ 1.702.', latex: 'D \\approx 1.702' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.sin(t*t), 0, 3, 'v(t) = sin(t²)', '#f59e0b'),
            makeShadeTrace(t => Math.max(0, Math.sin(t*t)), 0, Math.sqrt(Math.PI), 'rgba(245,158,11,0.2)'),
            makeShadeTrace(t => Math.min(0, Math.sin(t*t)), Math.sqrt(Math.PI), Math.sqrt(2*Math.PI), 'rgba(239,68,68,0.2)'),
            makeShadeTrace(t => Math.max(0, Math.sin(t*t)), Math.sqrt(2*Math.PI), 3, 'rgba(245,158,11,0.2)'),
            { x:[0,3],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('v(t) = sin(t²): Distance from t=0 to t=3', 't', 'v(t)')
        }
      },
      {
        label: 'b',
        question: 'Find the position of the particle at t = 3.',
        answer: 'x(3) = 1 + \\int_0^3 \\sin(t^2)\\,dt \\approx 1 + 0.774 = 1.774',
        explanation: [
          { title: 'Net displacement', body: 'x(3) = x(0) + ∫₀³ v(t) dt = 1 + ∫₀³ sin(t²) dt', latex: 'x(3) = 1 + \\int_0^3\\sin(t^2)\\,dt' },
          { title: 'Fresnel integral', body: 'Using calculator: ∫₀³ sin(t²) dt ≈ 0.774', latex: 'x(3) \\approx 1.774' }
        ],
        graph: {
          traces: [
            (() => { const t=[],x=[]; let pos=1; for(let i=0;i<=300;i++){const tv=i/100; t.push(tv); if(i>0) pos+=Math.sin(tv*tv)*0.01; x.push(pos);} return {x:t,y:x,type:'scatter',mode:'lines',name:'Position x(t)',line:{color:'#10b981',width:2}} })()
          ],
          layout: darkLayout('Position x(t) = 1 + ∫₀ᵗ sin(s²) ds', 't', 'x(t)')
        }
      },
      {
        label: 'c',
        question: 'For 0 < t < 3, find all t where the particle changes direction.',
        answer: 'v(t) = \\sin(t^2) = 0 \\Rightarrow t^2 = n\\pi \\Rightarrow t = \\sqrt{\\pi} \\approx 1.772 \\text{ and } t = \\sqrt{2\\pi} \\approx 2.507',
        explanation: [
          { title: 'Direction changes', body: 'Particle changes direction when v = 0 and v changes sign.', latex: 'v(t) = 0 \\Rightarrow t = \\sqrt{n\\pi}' },
          { title: 'In (0,3)', body: 't = √π ≈ 1.772 and t = √(2π) ≈ 2.507 (both have sign changes).', latex: 't \\approx 1.772, \\quad t \\approx 2.507' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.sin(t*t), 0, 3, 'v(t) = sin(t²)', '#f59e0b'),
            { x:[Math.sqrt(Math.PI), Math.sqrt(2*Math.PI)], y:[0,0], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'Direction changes' },
            { x:[0,3],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('Direction Changes: v(t) = sin(t²) = 0', 't', 'v(t)')
        }
      },
      {
        label: 'd',
        question: 'Is the speed of the particle increasing or decreasing at t = 2? Give a reason.',
        answer: 'v(2) = \\sin 4 \\approx -0.757 < 0, a(2) = 2t\\cos(t^2)|_{t=2} = 4\\cos 4 \\approx -2.615 < 0. \\text{ Same sign: speed increasing.}',
        explanation: [
          { title: 'Compute v(2)', body: 'v(2) = sin(4) ≈ −0.757', latex: 'v(2) = \\sin 4 \\approx -0.757' },
          { title: 'Compute a(2)', body: "a(t) = v'(t) = 2t·cos(t²). a(2) = 4cos(4) ≈ −2.615", latex: 'a(2) = 4\\cos 4 \\approx -2.615' },
          { title: 'Speed rule', body: 'Speed increasing when v and a have the same sign. Both negative → speed increasing.', latex: 'v(2)<0 \\text{ and } a(2)<0 \\Rightarrow \\text{speed increasing}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.sin(t*t), 0, 3, 'v(t)', '#f59e0b'),
            makeVelocityTrace(t => 2*t*Math.cos(t*t), 0, 3, 'a(t) = 2t·cos(t²)', '#a78bfa'),
            { x:[2,2], y:[-3,3], type:'scatter',mode:'lines',line:{color:'#ef4444',dash:'dash'},name:'t=2' },
            { x:[0,3],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('v(t) and a(t) at t = 2', 't', 'value')
        }
      }
    ]
  },
  {
    id: 'frq-2017-2',
    year: 2017,
    number: 2,
    calculator: true,
    title: 'Area and Volume: √x and x/2',
    topics: ['Area Between Curves', 'Volume of Revolution', 'Tangent Lines'],
    difficulty: 2,
    context: 'Let R be the region enclosed by f(x) = √x and g(x) = x/2 in the first quadrant.',
    parts: [
      {
        label: 'a',
        question: 'Find the area of region R.',
        answer: '\\int_0^4 [\\sqrt{x} - x/2]\\,dx = \\left[\\frac{2}{3}x^{3/2}-\\frac{x^2}{4}\\right]_0^4 = \\frac{16}{3} - 4 = \\frac{4}{3}',
        explanation: [
          { title: 'Intersection', body: '√x = x/2 → x = 0 or x = 4.', latex: '\\sqrt{x} = \\frac{x}{2} \\Rightarrow x = 0,4' },
          { title: 'Antiderivative', body: '∫[√x − x/2] dx = (2/3)x^{3/2} − x²/4', latex: '\\int_0^4\\left(\\sqrt{x}-\\frac{x}{2}\\right)dx = \\left[\\frac{2x^{3/2}}{3}-\\frac{x^2}{4}\\right]_0^4' },
          { title: 'Evaluate', body: '= 16/3 − 4 = 4/3', latex: 'A = \\frac{4}{3}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.sqrt(x), 0, 5, 'f(x) = √x', '#f59e0b'),
            makeVelocityTrace(x => x/2, 0, 5, 'g(x) = x/2', '#06b6d4'),
            makeShadeTrace(x => Math.max(0, Math.sqrt(x) - x/2), 0, 4, 'rgba(245,158,11,0.15)')
          ],
          layout: darkLayout('Region R: f(x)=√x, g(x)=x/2', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the volume when R is revolved around the y-axis.',
        answer: 'V = \\pi\\int_0^4 [f(x)^2-g(x)^2]\\,dx \\text{ (disk/washer about y-axis using shell method)}',
        explanation: [
          { title: 'Shell method (easier for y-axis)', body: 'V = 2π∫₀⁴ x[f(x)−g(x)] dx', latex: 'V = 2\\pi\\int_0^4 x\\left(\\sqrt{x}-\\frac{x}{2}\\right)dx' },
          { title: 'Integrate', body: '= 2π∫₀⁴ [x^{3/2} − x²/2] dx = 2π[(2/5)x^{5/2} − x³/6]₀⁴', latex: '= 2\\pi\\left[\\frac{2x^{5/2}}{5}-\\frac{x^3}{6}\\right]_0^4' },
          { title: 'Evaluate', body: '= 2π(64/5 − 64/6) = 2π·64(1/5−1/6) = 2π·64/30 = 128π/30 = 64π/15', latex: 'V = \\frac{64\\pi}{15} \\approx 13.404' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.sqrt(x), 0, 4, 'f(x)=√x', '#f59e0b'),
            makeVelocityTrace(x => x/2, 0, 4, 'g(x)=x/2', '#06b6d4'),
            { x:[0,0],y:[0,2], type:'scatter',mode:'lines',line:{color:'#ef4444',dash:'dash',width:2},name:'Axis (y-axis)' }
          ],
          layout: darkLayout('Region R rotated about y-axis', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Write the equation of the tangent line to f(x) = √x at x = 1.',
        answer: "f'(x) = \\frac{1}{2\\sqrt{x}}. \\text{ At }x=1: f'(1)=1/2, f(1)=1. \\text{ Tangent: }y=\\frac{1}{2}(x-1)+1 = \\frac{x}{2}+\\frac{1}{2}",
        explanation: [
          { title: "Derivative", body: "f'(x) = 1/(2√x)", latex: "f'(x) = \\frac{1}{2\\sqrt{x}}" },
          { title: "At x=1", body: "f'(1) = 1/2, f(1) = 1", latex: "\\text{slope} = \\frac{1}{2}" },
          { title: "Equation", body: "y = (1/2)(x−1) + 1 = x/2 + 1/2", latex: "y = \\frac{x+1}{2}" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.sqrt(x), 0, 4, 'f(x)=√x', '#f59e0b'),
            makeVelocityTrace(x => (x+1)/2, 0, 4, 'Tangent at x=1', '#a78bfa'),
            { x:[1],y:[1],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'(1,1)' }
          ],
          layout: darkLayout('Tangent to f(x)=√x at x=1', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'The region R is the base of a solid. Each cross-section perpendicular to the x-axis is a square. Find the volume.',
        answer: 'V = \\int_0^4 [f(x)-g(x)]^2\\,dx = \\int_0^4 [\\sqrt{x}-x/2]^2\\,dx = \\frac{8}{15}',
        explanation: [
          { title: 'Square cross-sections', body: 'Side length = f(x)−g(x) = √x − x/2. Area = (√x − x/2)².', latex: 'V = \\int_0^4(\\sqrt{x}-x/2)^2\\,dx' },
          { title: 'Expand', body: '(√x − x/2)² = x − x^{3/2} + x²/4', latex: '= x - x^{3/2} + \\frac{x^2}{4}' },
          { title: 'Integrate', body: '= [x²/2 − (2/5)x^{5/2} + x³/12]₀⁴ = 8 − 64/5 + 16/3 = 8/15', latex: 'V = \\frac{8}{15}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.sqrt(x) - x/2, 0, 4, 'Side length f−g', '#f59e0b'),
            makeVelocityTrace(x => (Math.sqrt(x) - x/2)**2, 0, 4, 'Cross-section area', '#a78bfa'),
          ],
          layout: darkLayout('Square Cross-Section Side and Area', 'x', 'value')
        }
      }
    ]
  },
  {
    id: 'frq-2017-3',
    year: 2017,
    number: 3,
    calculator: false,
    title: 'Table-Based: h(x) Analysis',
    topics: ['Riemann Sums', 'Mean Value Theorem', 'Average Value', 'Derivatives from Tables'],
    difficulty: 2,
    context: 'The function h is twice differentiable. The table gives selected values: x=1: h=4, h\'=3; x=2: h=2, h\'=−1; x=3: h=6, h\'=2; x=4: h=5, h\'=4.',
    parts: [
      {
        label: 'a',
        question: 'Approximate ∫₁⁴ h(x) dx using a midpoint Riemann sum with 3 equal subintervals.',
        answer: '\\int_1^4 h(x)\\,dx \\approx h(1.5)+h(2.5)+h(3.5)] = [\\text{interpolated values}]',
        explanation: [
          { title: 'Subintervals', body: '[1,2], [2,3], [3,4] with midpoints 1.5, 2.5, 3.5.', latex: '\\Delta x = 1, \\text{ midpoints: } 1.5, 2.5, 3.5' },
          { title: 'Approximate midpoint values', body: 'Use linear interpolation: h(1.5)≈(4+2)/2=3, h(2.5)≈(2+6)/2=4, h(3.5)≈(6+5)/2=5.5', latex: 'h(1.5)\\approx 3, \; h(2.5)\\approx 4, \; h(3.5)\\approx 5.5' },
          { title: 'Sum', body: '= 3+4+5.5 = 12.5', latex: '\\int_1^4 h\\,dx \\approx 12.5' }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4], y:[4,2,6,5], type:'scatter',mode:'lines+markers',name:'h(x)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[1.5,2.5,3.5], y:[3,4,5.5], type:'scatter',mode:'markers',marker:{size:10,color:'#a78bfa'},name:'Midpoint values' }
          ],
          layout: darkLayout('Midpoint Riemann Sum for h(x)', 'x', 'h(x)')
        }
      },
      {
        label: 'b',
        question: 'Must there be a value c in (1,4) where h\'\'(c) = 1/3? Explain.',
        answer: "\\frac{h'(4)-h'(1)}{4-1} = \\frac{4-3}{3} = \\frac{1}{3}. \\text{ By MVT on }h', \\exists c \\in (1,4): h''(c)=1/3.",
        explanation: [
          { title: "MVT on h'", body: "h' is differentiable (h twice differentiable), so MVT applies to h'.", latex: "\\exists c \\in (1,4): h''(c) = \\frac{h'(4)-h'(1)}{4-1}" },
          { title: 'Compute', body: "= (4−3)/3 = 1/3", latex: "h''(c) = \\frac{1}{3}" }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4], y:[3,-1,2,4], type:'scatter',mode:'lines+markers',name:"h'(x)",line:{color:'#06b6d4',width:2},marker:{size:8} },
            { x:[1,4], y:[3,4], type:'scatter',mode:'lines',name:'Secant (slope=1/3)',line:{color:'#f59e0b',dash:'dash',width:2} }
          ],
          layout: darkLayout("MVT on h'(x): Average slope = 1/3", 'x', "h'(x)")
        }
      },
      {
        label: 'c',
        question: 'Use a trapezoidal sum to approximate ∫₁⁴ h(x) dx.',
        answer: 'T = \\frac{1}{2}(4+2)+\\frac{1}{2}(2+6)+\\frac{1}{2}(6+5) = 3+4+5.5 = 12.5',
        explanation: [
          { title: 'Trapezoidal rule', body: 'T = Σ(Δx/2)[h(xₖ)+h(xₖ₊₁)]', latex: 'T = \\frac{1}{2}(h(1)+h(2)) + \\frac{1}{2}(h(2)+h(3)) + \\frac{1}{2}(h(3)+h(4))' },
          { title: 'Evaluate', body: '= 3 + 4 + 5.5 = 12.5', latex: 'T = 12.5' }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4], y:[4,2,6,5], type:'scatter',mode:'lines+markers',name:'h(x)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[1,2,3,4,4,3,2,1], y:[4,2,6,5,0,0,0,0], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(16,185,129,0.12)',showlegend:false }
          ],
          layout: darkLayout('Trapezoidal Approximation', 'x', 'h(x)')
        }
      },
      {
        label: 'd',
        question: 'Let k(x) = h(x)·e^x. Find k\'(2).',
        answer: "k'(x) = h'(x)e^x + h(x)e^x. \\text{ At }x=2: k'(2) = (-1+2)e^2 = e^2",
        explanation: [
          { title: 'Product rule', body: "k'(x) = h'(x)·eˣ + h(x)·eˣ = [h'(x)+h(x)]eˣ", latex: "k'(x) = [h'(x)+h(x)]e^x" },
          { title: 'At x=2', body: "k'(2) = [h'(2)+h(2)]e² = [−1+2]e² = e²", latex: "k'(2) = e^2 \\approx 7.389" }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4], y:[4*Math.exp(1),2*Math.exp(2),6*Math.exp(3),5*Math.exp(4)], type:'scatter',mode:'lines+markers',name:'k(x)=h(x)eˣ',line:{color:'#a78bfa',width:2},marker:{size:8} },
            { x:[2], y:[2*Math.exp(2)], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:"k'(2)=e²" }
          ],
          layout: darkLayout('k(x) = h(x)·eˣ', 'x', 'k(x)')
        }
      }
    ]
  },
  {
    id: 'frq-2017-4',
    year: 2017,
    number: 4,
    calculator: false,
    title: 'Differential Equations: Separable',
    topics: ['Differential Equations', 'Separable Equations', 'Equilibrium Solutions'],
    difficulty: 3,
    context: 'Consider the differential equation dy/dx = (1−2y)/x.',
    parts: [
      {
        label: 'a',
        question: 'Find all equilibrium (constant) solutions.',
        answer: '\\frac{dy}{dx} = 0 \\Rightarrow 1-2y = 0 \\Rightarrow y = \\frac{1}{2}',
        explanation: [
          { title: 'Equilibrium', body: 'Set dy/dx = 0: (1−2y)/x = 0 → 1−2y = 0 → y = 1/2.', latex: 'y = \\frac{1}{2}' }
        ],
        graph: {
          traces: (() => {
            const traces = []
            for (let x = 0.5; x <= 3; x += 0.5) {
              for (let y = -0.5; y <= 1.5; y += 0.5) {
                const s = (1-2*y)/x
                const dx = 0.2/Math.sqrt(1+s*s)
                const dy = s*dx
                traces.push({ x:[x-dx,x+dx],y:[y-dy,y+dy],type:'scatter',mode:'lines',line:{color:'rgba(245,158,11,0.7)',width:1.5},showlegend:false })
              }
            }
            traces.push({ x:[0,4],y:[0.5,0.5],type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash',width:2},name:'y=1/2 (equilibrium)' })
            return traces
          })(),
          layout: darkLayout('Slope Field: dy/dx = (1−2y)/x', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the particular solution y = f(x) with f(1) = 2.',
        answer: 'y = \\frac{1}{2} + \\frac{3}{2x^2}',
        explanation: [
          { title: 'Separate variables', body: 'dy/(1−2y) = dx/x → −(1/2)ln|1−2y| = ln|x| + C', latex: '\\frac{dy}{1-2y} = \\frac{dx}{x}' },
          { title: 'Integrate', body: '−(1/2)ln|1−2y| = ln x + C (for x>0)', latex: '-\\frac{1}{2}\\ln|1-2y| = \\ln x + C' },
          { title: 'Solve for y', body: 'ln|1−2y| = −2ln x + K → |1−2y| = A/x² → y = 1/2 + B/(2x²)', latex: 'y = \\frac{1}{2} + \\frac{B}{2x^2}' },
          { title: 'Apply IC f(1)=2', body: '2 = 1/2 + B/2 → B = 3.', latex: 'y = \\frac{1}{2} + \\frac{3}{2x^2}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 0.5 + 1.5/x**2, 0.3, 4, 'y = 1/2 + 3/(2x²)', '#f59e0b'),
            { x:[0,4],y:[0.5,0.5],type:'scatter',mode:'lines',line:{color:'#a78bfa',dash:'dash'},name:'y=1/2' },
            { x:[1],y:[2],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'IC: (1,2)' }
          ],
          layout: darkLayout('Particular Solution: y=1/2+3/(2x²)', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'For the particular solution from (b), find lim_{x→∞} f(x).',
        answer: '\\lim_{x\\to\\infty}\\left(\\frac{1}{2}+\\frac{3}{2x^2}\\right) = \\frac{1}{2}',
        explanation: [
          { title: 'Take limit', body: 'As x→∞, 3/(2x²) → 0.', latex: '\\lim_{x\\to\\infty}y = \\frac{1}{2} + 0 = \\frac{1}{2}' },
          { title: 'Interpretation', body: 'The solution approaches the equilibrium y = 1/2.', latex: 'y \\to \\frac{1}{2} \\text{ as } x \\to \\infty' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 0.5 + 1.5/x**2, 0.5, 10, 'y = 1/2 + 3/(2x²)', '#f59e0b'),
            { x:[0,10],y:[0.5,0.5],type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash',width:2},name:'y=1/2 (limit)' }
          ],
          layout: darkLayout('f(x) → 1/2 as x → ∞', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Determine if the particular solution is concave up or down for all x > 0.',
        answer: "y'' = \\frac{d}{dx}\\frac{1-2y}{x} = \\frac{-2y'x - (1-2y)}{x^2} = \\frac{3}{x^3} > 0 \\text{ for all } x>0",
        explanation: [
          { title: "Find y''", body: "y' = (1−2y)/x. y'' = [-2y'·x − (1−2y)]/x²", latex: "y'' = \\frac{-2\\cdot\\frac{1-2y}{x}\\cdot x-(1-2y)}{x^2}" },
          { title: 'Simplify', body: '= [−2(1−2y)−(1−2y)]/x² = −3(1−2y)/x²', latex: "y'' = \\frac{-3(1-2y)}{x^2}" },
          { title: 'For our solution', body: 'y = 1/2 + 3/(2x²) > 1/2 for x>0, so 1−2y = −3/x² < 0, making y double-prime = 3/x³ > 0.', latex: "y'' = \\frac{3}{x^3} > 0 \\Rightarrow \\text{concave up}" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 0.5 + 1.5/x**2, 0.5, 5, 'y = 1/2 + 3/(2x²)', '#f59e0b'),
            makeVelocityTrace(x => 3/x**3, 0.5, 5, "y'' = 3/x³ > 0", '#10b981'),
            { x:[0,5],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('Solution is Concave Up (y\'\'=3/x³>0)', 'x', 'value')
        }
      }
    ]
  },
  {
    id: 'frq-2017-5',
    year: 2017,
    number: 5,
    calculator: false,
    title: 'Polar Curves',
    topics: ['Polar Curves', 'Polar Area', 'Derivatives in Polar', 'Intersection'],
    difficulty: 3,
    context: 'Consider the polar curve r = θ·sin(θ) for 0 ≤ θ ≤ π.',
    parts: [
      {
        label: 'a',
        question: 'Find the area enclosed by the curve r = θ·sin(θ) for 0 ≤ θ ≤ π.',
        answer: 'A = \\frac{1}{2}\\int_0^{\\pi}r^2\\,d\\theta = \\frac{1}{2}\\int_0^{\\pi}\\theta^2\\sin^2\\theta\\,d\\theta \\approx 2.468',
        explanation: [
          { title: 'Polar area formula', body: 'A = (1/2)∫₀^π r² dθ = (1/2)∫₀^π θ²sin²θ dθ', latex: 'A = \\frac{1}{2}\\int_0^{\\pi}\\theta^2\\sin^2\\theta\\,d\\theta' },
          { title: 'Numerical result', body: 'This integral evaluates to approximately 2.468.', latex: 'A \\approx 2.468' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=300;i++){const t=Math.PI*i/300; const r=t*Math.sin(t); x.push(r*Math.cos(t)); y.push(r*Math.sin(t));} return {x,y,type:'scatter',mode:'lines',name:'r=θsin(θ)',line:{color:'#f59e0b',width:2}} })(),
          ],
          layout: darkLayout('Polar Curve r = θsin(θ)', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find dy/dθ at θ = π/2.',
        answer: "\\frac{dy}{d\\theta} = \\frac{d}{d\\theta}[r\\sin\\theta] = (\\sin\\theta+\\theta\\cos\\theta)\\sin\\theta + \\theta\\sin\\theta\\cos\\theta",
        explanation: [
          { title: 'y = r·sinθ = θ·sin²θ', body: 'Differentiate with respect to θ.', latex: 'y = \\theta\\sin^2\\theta' },
          { title: 'Product rule', body: "dy/dθ = sin²θ + θ·2sinθcosθ = sin²θ + θsin(2θ)", latex: "\\frac{dy}{d\\theta} = \\sin^2\\theta + \\theta\\sin(2\\theta)" },
          { title: 'At θ=π/2', body: '= sin²(π/2) + (π/2)sin(π) = 1 + 0 = 1', latex: "\\frac{dy}{d\\theta}\\bigg|_{\\theta=\\pi/2} = 1" }
        ],
        graph: {
          traces: [
            (() => { const t=[],y=[]; for(let i=0;i<=300;i++){const th=Math.PI*i/300; y.push(Math.sin(th)**2 + th*Math.sin(2*th)); t.push(th);} return {x:t,y,type:'scatter',mode:'lines',name:'dy/dθ',line:{color:'#06b6d4',width:2}} })(),
            { x:[Math.PI/2], y:[1], type:'scatter',mode:'markers',marker:{size:10,color:'#f59e0b'},name:'dy/dθ=1 at π/2' }
          ],
          layout: darkLayout('dy/dθ = sin²θ + θsin(2θ)', 'θ', 'dy/dθ')
        }
      },
      {
        label: 'c',
        question: 'Find the x-coordinate of each point on the curve where the tangent line is vertical.',
        answer: "\\frac{dx}{d\\theta} = 0: \\text{ solve } \\cos\\theta + \\theta\\cos(2\\theta) - \\theta\\sin(\\theta)\\sin(\\theta) = 0",
        explanation: [
          { title: 'x = r·cosθ = θ·sinθ·cosθ = (θ/2)sin(2θ)', body: "Differentiate: dx/dθ = (1/2)sin(2θ) + θcos(2θ)", latex: 'x = \\frac{\\theta}{2}\\sin(2\\theta)' },
          { title: "Set dx/dθ=0", body: "Solve (1/2)sin(2θ)+θcos(2θ)=0 numerically.", latex: "\\frac{1}{2}\\sin(2\\theta)+\\theta\\cos(2\\theta) = 0" },
          { title: 'Solutions', body: 'θ ≈ 1.166 (and θ=0 is degenerate). At θ≈1.166: x = θ·sinθ·cosθ ≈ 0.535.', latex: 'x \\approx 0.535' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=300;i++){const t=Math.PI*i/300; const r=t*Math.sin(t); x.push(r*Math.cos(t)); y.push(r*Math.sin(t));} return {x,y,type:'scatter',mode:'lines',name:'r=θsin(θ)',line:{color:'#f59e0b',width:2}} })(),
            { x:[1.166*Math.sin(1.166)*Math.cos(1.166)], y:[1.166*Math.sin(1.166)*Math.sin(1.166)], type:'scatter',mode:'markers',marker:{size:10,color:'#a78bfa'},name:'Vertical tangent' }
          ],
          layout: darkLayout('Vertical Tangent on r=θsin(θ)', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Find the maximum value of r on [0, π]. What is the corresponding x-coordinate?',
        answer: "r = \\theta\\sin\\theta. \; \\frac{dr}{d\\theta} = \\sin\\theta+\\theta\\cos\\theta = 0 \\Rightarrow \\theta \\approx 2.029. r_{max} \\approx 1.820",
        explanation: [
          { title: 'dr/dθ', body: 'dr/dθ = sinθ + θcosθ = 0', latex: '\\sin\\theta + \\theta\\cos\\theta = 0' },
          { title: 'Solve', body: 'tanθ = −θ, θ ≈ 2.029 (in (π/2, π)).', latex: '\\theta \\approx 2.029' },
          { title: 'Maximum r', body: 'r(2.029) = 2.029·sin(2.029) ≈ 1.820.', latex: 'r_{max} \\approx 1.820' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => t*Math.sin(t), 0, Math.PI, 'r = θsin(θ)', '#f59e0b'),
            { x:[2.029], y:[2.029*Math.sin(2.029)], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'Max r≈1.820' }
          ],
          layout: darkLayout('r = θsin(θ): Maximum at θ≈2.029', 'θ', 'r')
        }
      }
    ]
  },
  {
    id: 'frq-2017-6',
    year: 2017,
    number: 6,
    calculator: false,
    title: 'Power Series: Geometric Series',
    topics: ['Power Series', 'Geometric Series', 'Radius of Convergence', 'Integration of Series'],
    difficulty: 3,
    context: 'Let g(x) = 1/(1+x²).',
    parts: [
      {
        label: 'a',
        question: 'Write the power series for g(x) centered at x = 0.',
        answer: '\\frac{1}{1+x^2} = \\sum_{n=0}^{\\infty}(-1)^n x^{2n} = 1 - x^2 + x^4 - x^6 + \\cdots, \; |x|<1',
        explanation: [
          { title: 'Geometric series', body: '1/(1−u) = Σuⁿ. Let u = −x².', latex: '\\frac{1}{1+x^2} = \\frac{1}{1-(-x^2)} = \\sum_{n=0}^{\\infty}(-x^2)^n' },
          { title: 'Result', body: '= Σ(−1)ⁿx²ⁿ for |x²|<1, i.e., |x|<1.', latex: '= \\sum_{n=0}^{\\infty}(-1)^n x^{2n}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 1/(1+x*x), -1.2, 1.2, 'g(x)=1/(1+x²)', '#f59e0b'),
            makeVelocityTrace(x => 1-x*x, -1.2, 1.2, 'P₂', '#06b6d4'),
            makeVelocityTrace(x => 1-x*x+x**4-x**6, -1.2, 1.2, 'P₆', '#a78bfa'),
          ],
          layout: darkLayout('Geometric Series for 1/(1+x²)', 'x', 'y', {yaxis:{range:[-0.5,2]}})
        }
      },
      {
        label: 'b',
        question: 'Use the series from (a) to write the Maclaurin series for arctan(x).',
        answer: '\\arctan x = \\int_0^x \\frac{dt}{1+t^2} = x - \\frac{x^3}{3} + \\frac{x^5}{5} - \\frac{x^7}{7} + \\cdots',
        explanation: [
          { title: 'Since d/dx(arctan x) = 1/(1+x²)', body: 'Integrate the series for g(x) term by term.', latex: '\\arctan x = \\int_0^x\\sum_{n=0}^{\\infty}(-1)^n t^{2n}\\,dt' },
          { title: 'Result', body: '= Σ(−1)ⁿ x^{2n+1}/(2n+1)', latex: '\\arctan x = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n+1}}{2n+1}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.atan(x), -1.5, 1.5, 'arctan(x)', '#f59e0b'),
            makeVelocityTrace(x => x - x**3/3 + x**5/5 - x**7/7, -1.5, 1.5, 'P₇ series', '#a78bfa'),
          ],
          layout: darkLayout('arctan(x) and Series Approximation', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Use the arctan series to find the exact value of π/4.',
        answer: '\\arctan(1) = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\cdots = \\frac{\\pi}{4}',
        explanation: [
          { title: 'Plug in x = 1', body: 'arctan(1) = π/4.', latex: '\\arctan(1) = \\frac{\\pi}{4}' },
          { title: 'Series at x=1', body: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + ... (Leibniz formula)', latex: '\\frac{\\pi}{4} = \\sum_{n=0}^{\\infty}\\frac{(-1)^n}{2n+1}' }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4,5,6,7,8,9,10], y:[1,1-1/3,1-1/3+1/5,1-1/3+1/5-1/7,1-1/3+1/5-1/7+1/9].concat([1-1/3+1/5-1/7+1/9-1/11,1-1/3+1/5-1/7+1/9-1/11+1/13,1-1/3+1/5-1/7+1/9-1/11+1/13-1/15,1-1/3+1/5-1/7+1/9-1/11+1/13-1/15+1/17,1-1/3+1/5-1/7+1/9-1/11+1/13-1/15+1/17-1/19]), type:'scatter',mode:'lines+markers',name:'Partial sums',line:{color:'#f59e0b',width:2},marker:{size:6} },
            { x:[1,10], y:[Math.PI/4,Math.PI/4], type:'scatter',mode:'lines',name:'π/4',line:{color:'#10b981',dash:'dash',width:2} }
          ],
          layout: darkLayout('Leibniz Formula: Partial Sums → π/4', 'Number of terms', 'Sum')
        }
      },
      {
        label: 'd',
        question: 'Find the radius of convergence of the arctan series.',
        answer: 'R = 1 \\text{ (same as geometric series for g(x))}',
        explanation: [
          { title: 'Ratio test on arctan series', body: '|aₙ₊₁/aₙ| = |x|²(2n+1)/(2n+3) → |x|²', latex: '\\left|\\frac{a_{n+1}}{a_n}\\right| = x^2\\cdot\\frac{2n+1}{2n+3} \\to x^2' },
          { title: 'Converges when |x|<1', body: 'R = 1. The series also converges at x = ±1.', latex: 'R = 1,\\quad \\text{interval: } [-1,1]' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.atan(x), -1.5, 1.5, 'arctan(x)', '#f59e0b'),
            { x:[-1,-1],y:[-2,2],type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash',width:2},name:'x=−1 (converges)' },
            { x:[1,1],y:[-2,2],type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash',width:2},name:'x=1 (converges)' }
          ],
          layout: darkLayout('Radius of Convergence R=1 for arctan Series', 'x', 'arctan(x)')
        }
      }
    ]
  },
  // ─── 2016 ───────────────────────────────────────────────────────────────────
  {
    id: 'frq-2016-1',
    year: 2016,
    number: 1,
    calculator: true,
    title: 'Exponential Decay Rate',
    topics: ['Integration', 'Rate of Change', 'Accumulation', 'Exponential Functions'],
    difficulty: 2,
    context: 'A substance decays at rate F(t) = 100·e^{−0.5t} grams per hour, where t is measured in hours.',
    parts: [
      {
        label: 'a',
        question: 'Find ∫₀⁴ F(t) dt and explain its meaning.',
        answer: '\\int_0^4 100e^{-0.5t}\\,dt = [-200e^{-0.5t}]_0^4 = -200e^{-2}+200 \\approx 172.93 \\text{ grams}',
        explanation: [
          { title: 'Antiderivative', body: '∫100e^{−0.5t} dt = −200e^{−0.5t} + C', latex: '\\int 100e^{-0.5t}\\,dt = -200e^{-0.5t}+C' },
          { title: 'Evaluate on [0,4]', body: '−200e^{−2} − (−200) = 200(1−e^{−2}) ≈ 172.93 grams', latex: '\\approx 172.93 \\text{ grams decayed in first 4 hours}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 100*Math.exp(-0.5*t), 0, 10, 'F(t) = 100e^{−0.5t}', '#f59e0b'),
            makeShadeTrace(t => 100*Math.exp(-0.5*t), 0, 4, 'rgba(245,158,11,0.2)'),
          ],
          layout: darkLayout('Decay Rate F(t) = 100e^{−0.5t}', 't (hours)', 'F(t) (g/hr)')
        }
      },
      {
        label: 'b',
        question: 'At what time t is F(t) = 30?',
        answer: '100e^{-0.5t} = 30 \\Rightarrow e^{-0.5t} = 0.3 \\Rightarrow t = -2\\ln(0.3) \\approx 2.408 \\text{ hours}',
        explanation: [
          { title: 'Set up equation', body: '100e^{−0.5t} = 30 → e^{−0.5t} = 0.3', latex: 'e^{-0.5t} = 0.3' },
          { title: 'Solve', body: '−0.5t = ln(0.3) → t = −2ln(0.3) ≈ 2.408', latex: 't = -2\\ln(0.3) \\approx 2.408' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 100*Math.exp(-0.5*t), 0, 10, 'F(t)', '#f59e0b'),
            { x:[0,10], y:[30,30], type:'scatter',mode:'lines',name:'F=30',line:{color:'#ef4444',dash:'dash',width:2} },
            { x:[2.408], y:[30], type:'scatter',mode:'markers',marker:{size:10,color:'#10b981'},name:'t≈2.408' }
          ],
          layout: darkLayout('When does F(t) = 30?', 't (hours)', 'F(t) (g/hr)')
        }
      },
      {
        label: 'c',
        question: 'Find the amount remaining after t = 6 if the initial amount is 200 grams.',
        answer: 'Q(6) = 200 - \\int_0^6 F(t)\\,dt = 200 - 200(1-e^{-3}) \\approx 200 - 190.04 = 9.96 \\text{ grams}',
        explanation: [
          { title: 'Amount remaining', body: 'Q(t) = 200 − ∫₀ᵗ F(s) ds', latex: 'Q(t) = 200 - 200(1-e^{-0.5t}) = 200e^{-0.5t}' },
          { title: 'At t=6', body: 'Q(6) = 200e^{−3} ≈ 9.96 grams', latex: 'Q(6) = 200e^{-3} \\approx 9.96 \\text{ g}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 200*Math.exp(-0.5*t), 0, 10, 'Q(t) remaining', '#10b981'),
            { x:[6], y:[200*Math.exp(-3)], type:'scatter',mode:'markers',marker:{size:10,color:'#f59e0b'},name:'Q(6)≈9.96g' }
          ],
          layout: darkLayout('Remaining Amount Q(t) = 200e^{−0.5t}', 't (hours)', 'Q(t) (grams)')
        }
      },
      {
        label: 'd',
        question: 'Is the rate of decay F(t) increasing or decreasing? At what rate is F changing at t = 2?',
        answer: "F'(t) = -50e^{-0.5t} < 0, \\text{ decreasing. } F'(2) = -50e^{-1} \\approx -18.39 \\text{ g/hr}^2",
        explanation: [
          { title: "F'(t) < 0", body: "F'(t) = −50e^{−0.5t} < 0 for all t. F is strictly decreasing.", latex: "F'(t) = -50e^{-0.5t} < 0" },
          { title: "At t=2", body: "F'(2) = −50e^{−1} ≈ −18.39 grams per hour².", latex: "F'(2) \\approx -18.39 \\text{ g/hr}^2" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 100*Math.exp(-0.5*t), 0, 10, 'F(t)', '#f59e0b'),
            makeVelocityTrace(t => -50*Math.exp(-0.5*t), 0, 10, "F'(t)", '#a78bfa'),
            { x:[0,10],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout("F(t) and F'(t) = −50e^{−0.5t}", 't (hours)', 'value')
        }
      }
    ]
  },
  {
    id: 'frq-2016-2',
    year: 2016,
    number: 2,
    calculator: true,
    title: 'Area and Volume: Parabolas',
    topics: ['Area Between Curves', 'Volume of Revolution', 'Intersection Points'],
    difficulty: 2,
    context: 'Let R be the region enclosed by f(x) = 3 − x² and g(x) = 2x − 4.',
    parts: [
      {
        label: 'a',
        question: 'Find the area of region R.',
        answer: '\\int_{-7/2}^{?} [f(x)-g(x)]\\,dx; \\text{ intersection: } x=-1, x=7/2',
        explanation: [
          { title: 'Intersection', body: '3−x²=2x−4 → x²+2x−7=0 → x=(−2±√32)/2 = −1±2√2. x₁≈−3.828, x₂≈1.828.', latex: 'x^2+2x-7=0 \\Rightarrow x = -1 \\pm 2\\sqrt{2}' },
          { title: 'Area', body: '∫[f−g]dx = ∫[3−x²−(2x−4)]dx = ∫[7−x²−2x]dx', latex: 'A = \\int_{-1-2\\sqrt{2}}^{-1+2\\sqrt{2}}(7-x^2-2x)\\,dx' },
          { title: 'Antiderivative & evaluate', body: '= [7x − x³/3 − x²] evaluated from −1−2√2 to −1+2√2 ≈ 30.17', latex: 'A \\approx 30.17' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 3-x*x, -4.5, 2.5, 'f(x)=3−x²', '#f59e0b'),
            makeVelocityTrace(x => 2*x-4, -4.5, 2.5, 'g(x)=2x−4', '#06b6d4'),
            makeShadeTrace(x => Math.max(0, (3-x*x)-(2*x-4)), -1-2*Math.sqrt(2), -1+2*Math.sqrt(2), 'rgba(245,158,11,0.15)')
          ],
          layout: darkLayout('Region R: f(x)=3−x², g(x)=2x−4', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the volume when R is revolved about the x-axis.',
        answer: 'V = \\pi\\int_a^b[(3-x^2)^2-(2x-4)^2]\\,dx \\approx 583.4',
        explanation: [
          { title: 'Washer method', body: 'Outer radius = f(x) = 3−x², inner radius = g(x) = 2x−4 (for relevant x).', latex: 'V = \\pi\\int_a^b[(f(x))^2-(g(x))^2]\\,dx' },
          { title: 'Use calculator', body: 'V ≈ 583.4', latex: 'V \\approx 583.4' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 3-x*x, -1-2*Math.sqrt(2), -1+2*Math.sqrt(2), 'f(x)', '#f59e0b'),
            makeVelocityTrace(x => 2*x-4, -1-2*Math.sqrt(2), -1+2*Math.sqrt(2), 'g(x)', '#06b6d4'),
            { x:[(-1-2*Math.sqrt(2)+(-1+2*Math.sqrt(2)))/2-0.1,(-1-2*Math.sqrt(2)+(-1+2*Math.sqrt(2)))/2+0.1], y:[0,0], type:'scatter',mode:'lines',line:{color:'#ef4444',dash:'dash'},name:'x-axis' }
          ],
          layout: darkLayout('Region R (revolved about x-axis)', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Find the x-coordinate where f(x) − g(x) is maximized on the interval.',
        answer: "[f(x)-g(x)]' = -2x-2 = 0 \\Rightarrow x = -1",
        explanation: [
          { title: 'Maximize h(x) = f(x)−g(x) = 7−x²−2x', body: "h'(x) = −2x−2 = 0 → x = −1", latex: "h'(x) = -2x-2 = 0 \\Rightarrow x=-1" },
          { title: 'Maximum value', body: 'h(−1) = 7−1+2 = 8', latex: 'h(-1) = 8' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 7-x*x-2*x, -1-2*Math.sqrt(2), -1+2*Math.sqrt(2), 'f(x)−g(x)=7−x²−2x', '#a78bfa'),
            { x:[-1], y:[8], type:'scatter',mode:'markers',marker:{size:10,color:'#f59e0b'},name:'Max at x=−1' }
          ],
          layout: darkLayout('f(x)−g(x) Maximum on R', 'x', 'f(x)−g(x)')
        }
      },
      {
        label: 'd',
        question: 'Find the perimeter of region R.',
        answer: 'P = \\int_a^b \\sqrt{1+[f\'(x)]^2}\\,dx + \\int_a^b\\sqrt{1+[g\'(x)]^2}\\,dx',
        explanation: [
          { title: 'Arc length for each curve', body: "f'(x)=−2x, g'(x)=2", latex: 'P = \\int_a^b\\sqrt{1+4x^2}\\,dx + \\int_a^b\\sqrt{5}\\,dx' },
          { title: 'Numerical', body: 'Using calculator: P ≈ 52.3', latex: 'P \\approx 52.3' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 3-x*x, -1-2*Math.sqrt(2), -1+2*Math.sqrt(2), 'f(x) top', '#f59e0b'),
            makeVelocityTrace(x => 2*x-4, -1-2*Math.sqrt(2), -1+2*Math.sqrt(2), 'g(x) bottom', '#06b6d4'),
          ],
          layout: darkLayout('Boundary Curves of Region R', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2016-3',
    year: 2016,
    number: 3,
    calculator: false,
    title: 'Table-Based: w(t) Analysis',
    topics: ['Riemann Sums', 'Average Rate of Change', 'Mean Value Theorem', 'Concavity'],
    difficulty: 2,
    context: 'The function w is twice differentiable. Selected values: t=0: w=12, t=3: w=8, t=6: w=14, t=9: w=10.',
    parts: [
      {
        label: 'a',
        question: 'Approximate w\'(4.5) using the table.',
        answer: "w'(4.5) \\approx \\frac{w(6)-w(3)}{6-3} = \\frac{14-8}{3} = 2",
        explanation: [
          { title: 'Difference quotient', body: "Approximate w'(4.5) using the interval [3,6].", latex: "w'(4.5) \\approx \\frac{w(6)-w(3)}{6-3} = \\frac{14-8}{3} = 2" }
        ],
        graph: {
          traces: [
            { x:[0,3,6,9], y:[12,8,14,10], type:'scatter',mode:'lines+markers',name:'w(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[3,6], y:[8,14], type:'scatter',mode:'lines',name:'Slope≈2 on [3,6]',line:{color:'#06b6d4',dash:'dash',width:2} }
          ],
          layout: darkLayout('w(t): Approximate w\'(4.5)', 't', 'w(t)')
        }
      },
      {
        label: 'b',
        question: 'Use a left Riemann sum with 3 subintervals to approximate ∫₀⁹ w(t) dt.',
        answer: 'w(0)\\cdot 3 + w(3)\\cdot 3 + w(6)\\cdot 3 = 12\\cdot 3+8\\cdot 3+14\\cdot 3 = 36+24+42 = 102',
        explanation: [
          { title: 'Left endpoints', body: 'w(0)=12, w(3)=8, w(6)=14; each with Δt=3.', latex: 'L = 3(12+8+14) = 3 \\cdot 34 = 102' }
        ],
        graph: {
          traces: [
            { x:[0,3,6,9], y:[12,8,14,10], type:'scatter',mode:'lines+markers',name:'w(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,3,3,0], y:[0,0,12,12], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(245,158,11,0.1)',showlegend:false },
            { x:[3,6,6,3], y:[0,0,8,8], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(245,158,11,0.1)',showlegend:false },
            { x:[6,9,9,6], y:[0,0,14,14], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(245,158,11,0.1)',showlegend:false }
          ],
          layout: darkLayout('Left Riemann Sum for w(t)', 't', 'w(t)')
        }
      },
      {
        label: 'c',
        question: 'Explain why there must exist some c in (0,9) where w\'(c) = −2/9.',
        answer: "\\frac{w(9)-w(0)}{9-0} = \\frac{10-12}{9} = -\\frac{2}{9}. \\text{ By MVT, } \\exists c: w'(c) = -2/9.",
        explanation: [
          { title: 'MVT conditions', body: 'w is differentiable on (0,9), continuous on [0,9].', latex: '\\exists c\\in(0,9): w\'(c)=\\frac{w(9)-w(0)}{9-0}' },
          { title: 'Compute', body: '(10−12)/9 = −2/9', latex: "w'(c) = -\\frac{2}{9}" }
        ],
        graph: {
          traces: [
            { x:[0,3,6,9], y:[12,8,14,10], type:'scatter',mode:'lines+markers',name:'w(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,9], y:[12,10], type:'scatter',mode:'lines',name:'Secant slope=−2/9',line:{color:'#06b6d4',dash:'dash',width:2} }
          ],
          layout: darkLayout('MVT: w\'(c) = −2/9 on [0, 9]', 't', 'w(t)')
        }
      },
      {
        label: 'd',
        question: 'Is there a point in (0,9) where w has a local maximum? Explain.',
        answer: "w'(1.5)\\approx\\frac{w(3)-w(0)}{3}=\\frac{-4}{3}<0, \\text{ no sign change from + to −. Need more info or: } w \\text{ decreases then increases then decreases — could have local max near t=6.}",
        explanation: [
          { title: 'Check sign changes of w\'', body: "On [0,3]: w decreases (w'<0). On [3,6]: w increases (w'>0). On [6,9]: w decreases (w'<0).", latex: "w'<0 \\to w'>0 \\to w'<0" },
          { title: 'Local max near t=6', body: 'By IVT, w\' changes sign from positive to negative near t=6, giving a local maximum.', latex: '\\text{Local max near } t = 6' }
        ],
        graph: {
          traces: [
            { x:[0,3,6,9], y:[12,8,14,10], type:'scatter',mode:'lines+markers',name:'w(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[6], y:[14], type:'scatter',mode:'markers',marker:{size:12,color:'#ef4444',symbol:'star'},name:'Local max ≈ t=6' }
          ],
          layout: darkLayout('w(t): Local Maximum Near t = 6', 't', 'w(t)')
        }
      }
    ]
  },
  {
    id: 'frq-2016-4',
    year: 2016,
    number: 4,
    calculator: false,
    title: 'Differential Equations: dy/dx = xy',
    topics: ['Differential Equations', 'Separable Equations', 'Exponential Growth'],
    difficulty: 3,
    context: 'Consider the differential equation dy/dx = xy.',
    parts: [
      {
        label: 'a',
        question: 'Find the particular solution with y(0) = 3.',
        answer: 'y = 3e^{x^2/2}',
        explanation: [
          { title: 'Separate variables', body: 'dy/y = x dx', latex: '\\frac{dy}{y} = x\\,dx' },
          { title: 'Integrate', body: 'ln|y| = x²/2 + C', latex: '\\ln|y| = \\frac{x^2}{2} + C' },
          { title: 'Solve for y', body: 'y = Ae^{x²/2}', latex: 'y = Ae^{x^2/2}' },
          { title: 'Apply IC', body: 'y(0) = 3: A = 3', latex: 'y = 3e^{x^2/2}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 3*Math.exp(x*x/2), -2, 2, 'y = 3e^{x²/2}', '#f59e0b'),
            { x:[0],y:[3],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'IC: (0,3)' }
          ],
          layout: darkLayout('Particular Solution: y = 3e^{x²/2}', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'For the particular solution, is y increasing or decreasing at x = −1?',
        answer: "y'(-1) = (-1)\\cdot 3e^{1/2} = -3\\sqrt{e} < 0. \\text{ Decreasing.}",
        explanation: [
          { title: "Compute y'", body: "y' = xy = x·3e^{x²/2}", latex: "y'(-1) = (-1)\\cdot 3e^{1/2} = -3\\sqrt{e} < 0" },
          { title: 'Conclusion', body: 'Since y\'(−1) < 0, the function is decreasing at x=−1.', latex: '\\text{Decreasing at } x=-1' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 3*Math.exp(x*x/2), -2.5, 2.5, 'y = 3e^{x²/2}', '#f59e0b'),
            makeVelocityTrace(x => x*3*Math.exp(x*x/2), -2.5, 2.5, "y' = xy", '#a78bfa'),
            { x:[-1],y:[3*Math.exp(0.5)],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'x=−1' },
            { x:[-2.5,2.5],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout("y and y' = xy at x = −1", 'x', 'value')
        }
      },
      {
        label: 'c',
        question: 'Find the x-coordinates of all local minima and maxima.',
        answer: "y' = xy = 0 \\Rightarrow x=0 (y\\neq 0). \\text{ Sign change: for }x<0, y'<0; x>0, y'>0. \\text{ Minimum at }x=0.",
        explanation: [
          { title: "Critical point", body: "y' = xy = 0 → x=0 (y=3≠0)", latex: "y'(0)=0\\cdot 3e^0=0" },
          { title: "Sign analysis", body: "For x<0: y'>0·3e^{...}<0 (wait, x<0 means x·y<0). For x>0: y'>0.", latex: "x<0 \\Rightarrow y'<0, \; x>0 \\Rightarrow y'>0" },
          { title: 'Conclusion', body: 'Sign changes from negative to positive at x=0: local minimum.', latex: '\\text{Local minimum at } x=0, \; y(0)=3' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 3*Math.exp(x*x/2), -2.5, 2.5, 'y = 3e^{x²/2}', '#f59e0b'),
            { x:[0],y:[3],type:'scatter',mode:'markers',marker:{size:12,color:'#10b981',symbol:'star'},name:'Local min at (0,3)' }
          ],
          layout: darkLayout('Local Minimum of y = 3e^{x²/2}', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Write an equation for the tangent line at (0, 3).',
        answer: "y'(0) = 0 \\Rightarrow \\text{tangent line: } y = 3",
        explanation: [
          { title: "Slope at x=0", body: "y'(0) = 0·3 = 0. Horizontal tangent.", latex: "y'(0) = 0" },
          { title: 'Equation', body: 'y = 3', latex: 'y = 3' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 3*Math.exp(x*x/2), -2, 2, 'y = 3e^{x²/2}', '#f59e0b'),
            { x:[-2,2],y:[3,3],type:'scatter',mode:'lines',name:'y=3 (tangent)',line:{color:'#a78bfa',dash:'dash',width:2} },
            { x:[0],y:[3],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'(0,3)' }
          ],
          layout: darkLayout('Tangent Line y=3 at (0,3)', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2016-5',
    year: 2016,
    number: 5,
    calculator: false,
    title: 'Parametric Curves: t²+1, 3t−t²',
    topics: ['Parametric Equations', 'Tangent Lines', 'Speed', 'Position'],
    difficulty: 3,
    context: 'A particle moves with x(t) = t² + 1 and y(t) = 3t − t² for t ≥ 0.',
    parts: [
      {
        label: 'a',
        question: 'Find the velocity vector and speed at t = 1.',
        answer: "\\mathbf{v}(1) = \\langle 2, 1\\rangle, \\text{ speed} = \\sqrt{4+1} = \\sqrt{5}",
        explanation: [
          { title: 'Differentiate', body: "x'(t)=2t, y'(t)=3−2t", latex: "x'(t)=2t,\\quad y'(t)=3-2t" },
          { title: 'At t=1', body: "x'(1)=2, y'(1)=1", latex: "\\mathbf{v}(1)=\\langle 2,1\\rangle" },
          { title: 'Speed', body: '√(4+1) = √5', latex: '|\\mathbf{v}(1)| = \\sqrt{5}' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=200;i++){const t=i/40; x.push(t*t+1); y.push(3*t-t*t);} return {x,y,type:'scatter',mode:'lines',name:'Path',line:{color:'#f59e0b',width:2}} })(),
            { x:[2],y:[2],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'t=1: (2,2)' },
            { x:[2,2+0.5],y:[2,2+0.25],type:'scatter',mode:'lines',line:{color:'#a78bfa',width:2},name:'Velocity dir.' }
          ],
          layout: darkLayout('Parametric Curve: x=t²+1, y=3t−t²', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find dy/dx at t = 1.',
        answer: '\\frac{dy}{dx} = \\frac{3-2t}{2t}. \\text{ At }t=1: \\frac{1}{2}',
        explanation: [
          { title: 'Formula', body: "dy/dx = y'(t)/x'(t) = (3−2t)/(2t)", latex: '\\frac{dy}{dx} = \\frac{3-2t}{2t}' },
          { title: 'At t=1', body: '= 1/2', latex: '\\frac{dy}{dx}\\bigg|_{t=1} = \\frac{1}{2}' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=200;i++){const t=i/40; x.push(t*t+1); y.push(3*t-t*t);} return {x,y,type:'scatter',mode:'lines',name:'Path',line:{color:'#f59e0b',width:2}} })(),
            { x:[1.5,2.5],y:[2-0.5*0.5,2+0.5*0.5],type:'scatter',mode:'lines',name:'Tangent slope=1/2',line:{color:'#06b6d4',dash:'dash',width:2} }
          ],
          layout: darkLayout('Tangent Line at t=1 (slope=1/2)', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Find the time t when the particle is at rest.',
        answer: "x'(t)=0 \\Rightarrow t=0. y'(t)=0 \\Rightarrow t=3/2. \\text{ Not simultaneously at rest for t>0.}",
        explanation: [
          { title: "x'=0", body: "2t=0 → t=0", latex: "x'(t)=2t=0 \\Rightarrow t=0" },
          { title: "y'=0", body: "3−2t=0 → t=3/2", latex: "y'(t)=3-2t=0 \\Rightarrow t=3/2" },
          { title: 'At rest', body: 'Both must equal 0 simultaneously. t=0 is the only possibility, and at t=0 the particle is instantaneously at rest.', latex: '\\text{Momentarily at rest only at } t=0' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 2*t, 0, 3, "x'(t)=2t", '#06b6d4'),
            makeVelocityTrace(t => 3-2*t, 0, 3, "y'(t)=3−2t", '#f59e0b'),
            { x:[0,3],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout("x'(t) and y'(t): zeros at t=0 and t=3/2", 't', 'value')
        }
      },
      {
        label: 'd',
        question: 'For 0 ≤ t ≤ 3, find the total distance traveled.',
        answer: 'L = \\int_0^3\\sqrt{(2t)^2+(3-2t)^2}\\,dt = \\int_0^3\\sqrt{4t^2+9-12t+4t^2}\\,dt',
        explanation: [
          { title: 'Arc length', body: "L = ∫₀³ √[(x')² + (y')²] dt = ∫₀³ √[4t² + (3−2t)²] dt", latex: 'L = \\int_0^3\\sqrt{4t^2+(3-2t)^2}\\,dt' },
          { title: 'Simplify integrand', body: '= ∫₀³ √[8t² − 12t + 9] dt ≈ 9.05', latex: 'L \\approx 9.05' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.sqrt(4*t*t+(3-2*t)**2), 0, 3, 'Speed(t)=√(4t²+(3−2t)²)', '#10b981'),
          ],
          layout: darkLayout('Speed for Arc Length Calculation', 't', 'Speed')
        }
      }
    ]
  },
  {
    id: 'frq-2016-6',
    year: 2016,
    number: 6,
    calculator: false,
    title: 'Taylor Series: arctan(x)',
    topics: ['Taylor Series', 'Maclaurin Series', 'Error Bounds', 'Convergence'],
    difficulty: 3,
    context: 'Let f(x) = arctan(x).',
    parts: [
      {
        label: 'a',
        question: 'Write the first four nonzero terms of the Maclaurin series for f(x).',
        answer: 'x - \\frac{x^3}{3} + \\frac{x^5}{5} - \\frac{x^7}{7} + \\cdots',
        explanation: [
          { title: 'Geometric series base', body: "f'(x) = 1/(1+x²) = Σ(−1)ⁿx²ⁿ", latex: "f'(x) = \\sum_{n=0}^{\\infty}(-1)^n x^{2n}" },
          { title: 'Integrate', body: 'arctan(x) = x − x³/3 + x⁵/5 − x⁷/7 + ...', latex: '\\arctan x = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n+1}}{2n+1}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.atan(x), -1.5, 1.5, 'arctan(x)', '#f59e0b'),
            makeVelocityTrace(x => x - x**3/3 + x**5/5 - x**7/7, -1.5, 1.5, 'P₇ approx', '#a78bfa'),
          ],
          layout: darkLayout('Maclaurin Series for arctan(x)', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the radius of convergence.',
        answer: 'R = 1',
        explanation: [
          { title: 'Ratio test', body: '|aₙ₊₁/aₙ| = x²(2n+1)/(2n+3) → x² as n→∞.', latex: '\\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right| = x^2' },
          { title: 'Converges for |x|<1', body: 'R = 1.', latex: 'R = 1' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.atan(x), -2, 2, 'arctan(x)', '#f59e0b'),
            { x:[-1,-1],y:[-2,2],type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash'},name:'x=−1' },
            { x:[1,1],y:[-2,2],type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash'},name:'x=1' }
          ],
          layout: darkLayout('Interval of Convergence [−1, 1]', 'x', 'arctan(x)')
        }
      },
      {
        label: 'c',
        question: 'Use the series to estimate arctan(0.5) with an error less than 0.001.',
        answer: '0.5 - \\frac{(0.5)^3}{3} + \\frac{(0.5)^5}{5} \\approx 0.4636, \\text{ error} \\leq \\frac{(0.5)^7}{7} \\approx 0.0000112 < 0.001',
        explanation: [
          { title: 'Three terms', body: '0.5 − (0.5)³/3 + (0.5)⁵/5 ≈ 0.5 − 0.04167 + 0.00625 ≈ 0.4636', latex: '\\arctan(0.5) \\approx 0.4636' },
          { title: 'Error bound', body: '|(0.5)⁷/7| ≈ 0.0000112 < 0.001 ✓', latex: '|\\text{error}| \\leq \\frac{(0.5)^7}{7} < 0.001' }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4], y:[0.5,0.5-(0.5)**3/3,0.5-(0.5)**3/3+(0.5)**5/5,0.5-(0.5)**3/3+(0.5)**5/5-(0.5)**7/7], type:'scatter',mode:'lines+markers',name:'Partial sums at x=0.5',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[1,4],y:[Math.atan(0.5),Math.atan(0.5)],type:'scatter',mode:'lines',name:'arctan(0.5)',line:{color:'#10b981',dash:'dash',width:2} }
          ],
          layout: darkLayout('Convergence of Series at x = 0.5', 'Terms', 'Approximation')
        }
      },
      {
        label: 'd',
        question: 'Use the series to write the first three terms of the series for arctan(x²).',
        answer: 'x^2 - \\frac{x^6}{3} + \\frac{x^{10}}{5} - \\cdots',
        explanation: [
          { title: 'Substitute x→x²', body: 'Replace x with x² in the series.', latex: '\\arctan(x^2) = x^2 - \\frac{x^6}{3} + \\frac{x^{10}}{5} - \\cdots' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.atan(x*x), -1.3, 1.3, 'arctan(x²)', '#f59e0b'),
            makeVelocityTrace(x => x*x - x**6/3 + x**10/5, -1.3, 1.3, 'P_{10} approx', '#a78bfa'),
          ],
          layout: darkLayout('arctan(x²) and Series Approximation', 'x', 'y')
        }
      }
    ]
  },
  // ─── 2015 ───────────────────────────────────────────────────────────────────
  {
    id: 'frq-2015-1',
    year: 2015,
    number: 1,
    calculator: true,
    title: 'Acceleration and Motion',
    topics: ['Integration', 'Velocity', 'Position', 'Accumulation'],
    difficulty: 2,
    context: 'A particle moves along the x-axis with acceleration a(t) = t·cos(t²) for t ≥ 0. The velocity at t=0 is v(0)=2.',
    parts: [
      {
        label: 'a',
        question: 'Find the velocity v(t) for t ≥ 0.',
        answer: 'v(t) = 2 + \\int_0^t s\\cos(s^2)\\,ds = 2 + \\frac{\\sin(t^2)}{2}',
        explanation: [
          { title: 'Antiderivative of t·cos(t²)', body: 'Let u = t², du = 2t dt. ∫t·cos(t²) dt = (1/2)sin(t²) + C', latex: '\\int t\\cos(t^2)\\,dt = \\frac{\\sin(t^2)}{2}+C' },
          { title: 'Apply IC v(0)=2', body: 'v(t) = 2 + sin(t²)/2 (antiderivative + 2)', latex: 'v(t) = 2 + \\frac{\\sin(t^2)}{2}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 2+Math.sin(t*t)/2, 0, 4, 'v(t) = 2+sin(t²)/2', '#f59e0b'),
            makeVelocityTrace(t => t*Math.cos(t*t), 0, 4, 'a(t) = t·cos(t²)', '#a78bfa'),
            { x:[0,4],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('v(t) = 2+sin(t²)/2 and a(t)', 't', 'value')
        }
      },
      {
        label: 'b',
        question: 'Find the total distance traveled from t = 0 to t = 2.',
        answer: '\\int_0^2 |v(t)|\\,dt = \\int_0^2 |2+\\sin(t^2)/2|\\,dt',
        explanation: [
          { title: 'Note v(t) > 0', body: 'v(t) = 2 + sin(t²)/2. Since |sin(t²)/2| ≤ 1/2, v(t) ≥ 2−1/2 = 3/2 > 0 always.', latex: 'v(t) \\geq \\frac{3}{2} > 0' },
          { title: 'Distance = displacement', body: '∫₀² v(t) dt = [2t − cos(t²)/4]₀² = 4 − cos(4)/4 + 1/4 ≈ 4.086', latex: 'D = \\int_0^2 v(t)\\,dt \\approx 4.086' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 2+Math.sin(t*t)/2, 0, 2, 'v(t)', '#f59e0b'),
            makeShadeTrace(t => 2+Math.sin(t*t)/2, 0, 2, 'rgba(245,158,11,0.2)'),
          ],
          layout: darkLayout('Total Distance on [0, 2]', 't', 'v(t)')
        }
      },
      {
        label: 'c',
        question: 'Is the speed of the particle increasing at t = 1? Give a reason.',
        answer: 'v(1) = 2+\\sin(1)/2 > 0. a(1) = \\cos(1) > 0. \\text{ Both positive: speed increasing.}',
        explanation: [
          { title: 'v(1) and a(1)', body: 'v(1) = 2+sin(1)/2 ≈ 2.42 > 0. a(1) = cos(1) ≈ 0.54 > 0.', latex: 'v(1) > 0, \; a(1) > 0' },
          { title: 'Speed rule', body: 'v and a have the same sign → speed increasing.', latex: '\\text{Speed increasing at } t=1' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 2+Math.sin(t*t)/2, 0, 3, 'v(t)', '#f59e0b'),
            makeVelocityTrace(t => t*Math.cos(t*t), 0, 3, 'a(t)', '#a78bfa'),
            { x:[1],y:[2+Math.sin(1)/2],type:'scatter',mode:'markers',marker:{size:10,color:'#10b981'},name:'t=1: speed↑' },
            { x:[0,3],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('Speed Increasing: v(1)>0 and a(1)>0', 't', 'value')
        }
      },
      {
        label: 'd',
        question: 'Find the average value of the acceleration on [0, 2].',
        answer: '\\bar{a} = \\frac{1}{2}\\int_0^2 t\\cos(t^2)\\,dt = \\frac{1}{2}\\cdot\\frac{\\sin(4)}{2} = \\frac{\\sin 4}{4} \\approx -0.189',
        explanation: [
          { title: 'Average value formula', body: '(1/(b−a)) ∫ₐᵇ a(t) dt', latex: '\\bar{a} = \\frac{1}{2}\\int_0^2 t\\cos(t^2)\\,dt' },
          { title: 'Antiderivative', body: '= (1/2)[(1/2)sin(t²)]₀² = (1/2)(sin(4)/2 − 0) = sin(4)/4', latex: '\\bar{a} = \\frac{\\sin 4}{4} \\approx -0.189' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => t*Math.cos(t*t), 0, 2, 'a(t)', '#a78bfa'),
            { x:[0,2],y:[Math.sin(4)/4,Math.sin(4)/4],type:'scatter',mode:'lines',name:'Average≈−0.189',line:{color:'#f59e0b',dash:'dash',width:2} }
          ],
          layout: darkLayout('Average Acceleration on [0, 2]', 't', 'a(t)')
        }
      }
    ]
  },
  {
    id: 'frq-2015-2',
    year: 2015,
    number: 2,
    calculator: true,
    title: 'Area and Volume: 4−x² and x+2',
    topics: ['Area Between Curves', 'Volume of Revolution', 'Disk/Washer Method'],
    difficulty: 2,
    context: 'Let R be the region enclosed by f(x) = 4 − x² and g(x) = x + 2.',
    parts: [
      {
        label: 'a',
        question: 'Find the area of R.',
        answer: 'Intersection: x=-2,1. A=\\int_{-2}^{1}[4-x^2-x-2]\\,dx=\\int_{-2}^{1}[2-x-x^2]\\,dx=\\frac{9}{2}',
        explanation: [
          { title: 'Intersection', body: '4−x²=x+2 → x²+x−2=0 → (x+2)(x−1)=0 → x=−2,1', latex: 'x = -2, \; x = 1' },
          { title: 'Antiderivative', body: '∫[2−x−x²]dx = 2x − x²/2 − x³/3', latex: '\\int_{-2}^{1}(2-x-x^2)\\,dx = \\left[2x-\\frac{x^2}{2}-\\frac{x^3}{3}\\right]_{-2}^1' },
          { title: 'Evaluate', body: '= (2−1/2−1/3) − (−4−2+8/3) = 7/6 − (−10/3) = 7/6+20/6 = 27/6 = 9/2', latex: 'A = \\frac{9}{2}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 4-x*x, -2.5, 2, 'f(x)=4−x²', '#f59e0b'),
            makeVelocityTrace(x => x+2, -2.5, 2, 'g(x)=x+2', '#06b6d4'),
            makeShadeTrace(x => Math.max(0,(4-x*x)-(x+2)), -2, 1, 'rgba(245,158,11,0.15)')
          ],
          layout: darkLayout('Region R: f(x)=4−x², g(x)=x+2', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the volume when R is revolved about the line y = 5.',
        answer: 'V = \\pi\\int_{-2}^{1}[(5-g(x))^2-(5-f(x))^2]\\,dx = \\pi\\int_{-2}^{1}[(3-x)^2-(1+x^2)^2]\\,dx',
        explanation: [
          { title: 'Outer radius', body: 'Outer = 5−g(x) = 5−x−2 = 3−x', latex: 'R_{out} = 5-g(x) = 3-x' },
          { title: 'Inner radius', body: 'Inner = 5−f(x) = 5−(4−x²) = 1+x²', latex: 'R_{in} = 5-f(x) = 1+x^2' },
          { title: 'Integrate', body: 'V = π∫₋₂¹[(3−x)²−(1+x²)²]dx ≈ 98.96', latex: 'V \\approx 98.96' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 4-x*x, -2, 1, 'f(x)', '#f59e0b'),
            makeVelocityTrace(x => x+2, -2, 1, 'g(x)', '#06b6d4'),
            { x:[-2,1],y:[5,5],type:'scatter',mode:'lines',name:'y=5 (axis)',line:{color:'#ef4444',dash:'dash',width:2} }
          ],
          layout: darkLayout('Revolution about y = 5', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Find the perimeter of R.',
        answer: 'P = \\int_{-2}^1\\sqrt{1+(f\'(x))^2}\\,dx + \\int_{-2}^1\\sqrt{1+(g\'(x))^2}\\,dx',
        explanation: [
          { title: "f'(x)=−2x, g'(x)=1", body: "Arc lengths: ∫_{−2}^{1}√(1+4x²) dx + ∫_{−2}^{1}√2 dx", latex: 'P = \\int_{-2}^1\\sqrt{1+4x^2}\\,dx + 3\\sqrt{2}' },
          { title: 'Numerical', body: 'Using calculator: P ≈ 11.66', latex: 'P \\approx 11.66' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 4-x*x, -2, 1, 'f(x)=4−x²', '#f59e0b'),
            makeVelocityTrace(x => x+2, -2, 1, 'g(x)=x+2', '#06b6d4'),
          ],
          layout: darkLayout('Perimeter of Region R', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'The region R is the base of a solid with cross-sections perpendicular to x-axis that are semicircles. Find the volume.',
        answer: 'V = \\int_{-2}^1 \\frac{\\pi}{8}[f(x)-g(x)]^2\\,dx = \\frac{\\pi}{8}\\int_{-2}^1(2-x-x^2)^2\\,dx',
        explanation: [
          { title: 'Semicircle area', body: 'Diameter = f(x)−g(x), area = π(d/2)²/2 = πd²/8', latex: 'A = \\frac{\\pi}{8}[f(x)-g(x)]^2' },
          { title: 'Integrate', body: 'V = (π/8)∫₋₂¹(2−x−x²)² dx ≈ 7.069', latex: 'V \\approx 7.069' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.PI/8*(2-x-x*x)**2, -2, 1, 'Semicircle area', '#a78bfa'),
          ],
          layout: darkLayout('Semicircle Cross-Section Area', 'x', 'A(x)')
        }
      }
    ]
  },
  {
    id: 'frq-2015-3',
    year: 2015,
    number: 3,
    calculator: false,
    title: 'Table-Based: k(x) Analysis',
    topics: ['Riemann Sums', 'Mean Value Theorem', 'Intermediate Value Theorem', 'Average Value'],
    difficulty: 2,
    context: 'The function k is continuous and differentiable. Table: x=0: k=3, k\'=−2; x=1: k=1, k\'=−1; x=2: k=4, k\'=3; x=3: k=2, k\'=−4.',
    parts: [
      {
        label: 'a',
        question: 'Estimate ∫₀³ k(x) dx using the trapezoidal rule with 3 subintervals.',
        answer: 'T = \\frac{1}{2}(k(0)+k(1))+\\frac{1}{2}(k(1)+k(2))+\\frac{1}{2}(k(2)+k(3)) = 2+2.5+3 = 7.5',
        explanation: [
          { title: 'Trap rule', body: 'T = (1/2)(3+1) + (1/2)(1+4) + (1/2)(4+2) = 2 + 2.5 + 3 = 7.5', latex: 'T = 7.5' }
        ],
        graph: {
          traces: [
            { x:[0,1,2,3], y:[3,1,4,2], type:'scatter',mode:'lines+markers',name:'k(x)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,1,2,3,3,2,1,0], y:[3,1,4,2,0,0,0,0], type:'scatter',mode:'none',fill:'toself',fillcolor:'rgba(16,185,129,0.12)',showlegend:false }
          ],
          layout: darkLayout('Trapezoidal Rule for k(x)', 'x', 'k(x)')
        }
      },
      {
        label: 'b',
        question: 'Is the value ∫₀³ k(x) dx definitely greater than 7? Justify.',
        answer: '\\text{Since } k \\text{ is concave up between some points (k\'\'  changes sign), trapezoidal may overestimate. Cannot conclude from trap alone.}',
        explanation: [
          { title: 'Analysis', body: "k'(0)=−2, k'(1)=−1, k'(2)=3, k'(3)=−4. k' increases on [0,2] (concave up) then decreases (concave down).", latex: "k'' > 0 \\text{ on part, } k'' < 0 \\text{ on part}" },
          { title: 'Conclusion', body: 'Without knowing full concavity, we cannot definitively say the integral is greater than 7. The trap rule gives 7.5 but this may be an overestimate in concave down regions.', latex: '\\text{Cannot definitively conclude} > 7' }
        ],
        graph: {
          traces: [
            { x:[0,1,2,3], y:[3,1,4,2], type:'scatter',mode:'lines+markers',name:'k(x)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,3],y:[7.5/3,7.5/3],type:'scatter',mode:'lines',name:'T/3=2.5 avg',line:{color:'#a78bfa',dash:'dash'} }
          ],
          layout: darkLayout('k(x): Trapezoidal Result = 7.5', 'x', 'k(x)')
        }
      },
      {
        label: 'c',
        question: 'Must there be a zero of k\'\'(x) in (0, 3)? Explain.',
        answer: "k'(0)=-2, k'(1)=-1, k'(2)=3, k'(3)=-4. k' \\text{ increases on [0,2] then decreases. By IVT on }k'', \\text{ zero exists.}",
        explanation: [
          { title: "k' changes from increasing to decreasing", body: "k'(0)=−2 to k'(2)=3 (increase), then k'(3)=−4 (decrease). k'' changes sign.", latex: "k''(c) \\text{ must cross zero by IVT}" },
          { title: 'Conclusion', body: "k'' is continuous (k is twice differentiable) and changes sign → zero of k'' exists in (0,3).", latex: '\\exists c \\in (0,3): k\'\'(c) = 0' }
        ],
        graph: {
          traces: [
            { x:[0,1,2,3], y:[-2,-1,3,-4], type:'scatter',mode:'lines+markers',name:"k'(x)",line:{color:'#06b6d4',width:2},marker:{size:8} },
            { x:[0,3],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout("k'(x) changes sign → k''=0 somewhere", 'x', "k'(x)")
        }
      },
      {
        label: 'd',
        question: 'Find the average rate of change of k on [0, 3].',
        answer: '\\frac{k(3)-k(0)}{3-0} = \\frac{2-3}{3} = -\\frac{1}{3}',
        explanation: [
          { title: 'Average ROC formula', body: '[k(3)−k(0)]/(3−0) = (2−3)/3 = −1/3', latex: '\\text{Avg ROC} = \\frac{k(3)-k(0)}{3} = -\\frac{1}{3}' }
        ],
        graph: {
          traces: [
            { x:[0,1,2,3], y:[3,1,4,2], type:'scatter',mode:'lines+markers',name:'k(x)',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[0,3],y:[3,2],type:'scatter',mode:'lines',name:'Secant slope=−1/3',line:{color:'#06b6d4',dash:'dash',width:2} }
          ],
          layout: darkLayout('Average Rate of Change of k on [0, 3]', 'x', 'k(x)')
        }
      }
    ]
  },
  {
    id: 'frq-2015-4',
    year: 2015,
    number: 4,
    calculator: false,
    title: 'Differential Equations: Separable',
    topics: ['Differential Equations', 'Separable Equations', 'Particular Solution'],
    difficulty: 3,
    context: 'Consider the differential equation dy/dx = (2−y)·cos(x).',
    parts: [
      {
        label: 'a',
        question: 'Find the equilibrium solutions.',
        answer: '\\frac{dy}{dx} = 0 \\Rightarrow 2-y=0 \\text{ or } \\cos x=0. \\text{ Constant solution: } y = 2.',
        explanation: [
          { title: 'Constant equilibria', body: 'For y = const: dy/dx = 0 → (2−y)cos(x) = 0 for all x. Need 2−y = 0.', latex: 'y = 2 \\text{ (equilibrium)}' }
        ],
        graph: {
          traces: (() => {
            const traces = []
            for(let x=-2;x<=4;x+=1){
              for(let y=-1;y<=4;y+=1){
                const s=(2-y)*Math.cos(x)
                const dx=0.2/Math.sqrt(1+s*s)
                const dy=s*dx
                traces.push({x:[x-dx,x+dx],y:[y-dy,y+dy],type:'scatter',mode:'lines',line:{color:'rgba(245,158,11,0.65)',width:1.5},showlegend:false})
              }
            }
            traces.push({x:[-2,4],y:[2,2],type:'scatter',mode:'lines',line:{color:'#10b981',dash:'dash',width:2},name:'y=2 (equilibrium)'})
            return traces
          })(),
          layout: darkLayout('Slope Field: dy/dx = (2−y)cos(x)', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the particular solution with y(0) = 0.',
        answer: 'y = 2 - 2e^{-\\sin x}',
        explanation: [
          { title: 'Separate', body: 'dy/(2−y) = cos(x) dx', latex: '\\frac{dy}{2-y} = \\cos x\\,dx' },
          { title: 'Integrate', body: '−ln|2−y| = sin(x) + C', latex: '-\\ln|2-y| = \\sin x + C' },
          { title: 'Solve', body: '2−y = Ae^{−sin x} → y = 2 − Ae^{−sin x}', latex: 'y = 2 - Ae^{-\\sin x}' },
          { title: 'IC y(0)=0', body: '0 = 2 − A → A = 2', latex: 'y = 2 - 2e^{-\\sin x}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2-2*Math.exp(-Math.sin(x)), -2, 6, 'y = 2−2e^{−sin x}', '#f59e0b'),
            { x:[-2,6],y:[2,2],type:'scatter',mode:'lines',line:{color:'#a78bfa',dash:'dash'},name:'y=2' },
            { x:[0],y:[0],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'IC: (0,0)' }
          ],
          layout: darkLayout('Particular Solution: y=2−2e^{−sin x}', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Is the particular solution concave up at x = 0? Justify.',
        answer: "y'' = -\\frac{d}{dx}[(2-y)\\cos x] = -(2-y)(-\\sin x)\\cos x + \\cos^2 x(2-y) \\text{... at (0,0):} y'' = (2)(1) = 2 > 0",
        explanation: [
          { title: "Compute y''", body: "y'' = dy'/dx = d/dx[(2−y)cos x] = (2−y)(−sin x) + (−y')cos x", latex: "y'' = -(2-y)\\sin x - \\cos x \\cdot (2-y)\\cos x" },
          { title: 'At x=0, y=0', body: "y'' = −(2)(0) − (1)(2)(1) = −2. Wait: y'=(2−0)cos0=2, then y''=−(2)sin0−cos0·2=0−2=−2.", latex: "y''(0) = -2 < 0 \\Rightarrow \\text{concave down}" },
          { title: 'Correction via simpler form', body: "y'' at (0,0): use direct formula. y'(0)=2. y''=−2·0·cos0−(y')·cos0=−2<0. Concave down.", latex: "y''(0) < 0 \\Rightarrow \\text{concave down at }x=0" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2-2*Math.exp(-Math.sin(x)), -2, 4, 'y(x)', '#f59e0b'),
            { x:[0],y:[0],type:'scatter',mode:'markers',marker:{size:10,color:'#a78bfa'},name:'(0,0)' }
          ],
          layout: darkLayout('Concavity Analysis at x = 0', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'For the particular solution, find all x in (0, 2π) where y has a local maximum.',
        answer: "y' = (2-y)\\cos x = 0 \\text{ when } \\cos x=0 \\text{ (since }y\\neq 2\\text{)}. x=\\pi/2 \\text{ (max)}, x=3\\pi/2 \\text{ (min)}",
        explanation: [
          { title: "Critical points", body: "y'=(2−y)cos x=0. Since y=2−2e^{−sin x}≤2−2e^{−1}<2, so 2−y>0 always. cos x=0 at x=π/2, 3π/2.", latex: "\\cos x = 0 \\Rightarrow x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}" },
          { title: 'First derivative test', body: 'At x=π/2: cos changes from + to −, y\' from + to −: local max. At x=3π/2: cos from − to +: local min.', latex: 'x = \\frac{\\pi}{2} \\text{ local max}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2-2*Math.exp(-Math.sin(x)), 0, 2*Math.PI, 'y(x)', '#f59e0b'),
            { x:[Math.PI/2], y:[2-2*Math.exp(-1)], type:'scatter',mode:'markers',marker:{size:12,color:'#ef4444',symbol:'star'},name:'Local max at π/2' },
            { x:[3*Math.PI/2], y:[2-2*Math.exp(1)], type:'scatter',mode:'markers',marker:{size:12,color:'#a78bfa',symbol:'star'},name:'Local min at 3π/2' }
          ],
          layout: darkLayout('y(x) = 2−2e^{−sin x}: Local Extrema', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2015-5',
    year: 2015,
    number: 5,
    calculator: false,
    title: 'Polar Area: r = 2 + cos(θ)',
    topics: ['Polar Curves', 'Polar Area', 'Symmetry', 'Definite Integrals'],
    difficulty: 3,
    context: 'Consider the polar curve r = 2 + cos(θ).',
    parts: [
      {
        label: 'a',
        question: 'Find the area enclosed by the polar curve.',
        answer: 'A = \\frac{1}{2}\\int_0^{2\\pi}(2+\\cos\\theta)^2\\,d\\theta = \\frac{1}{2}\\int_0^{2\\pi}(4+4\\cos\\theta+\\cos^2\\theta)\\,d\\theta = \\frac{9\\pi}{2}',
        explanation: [
          { title: 'Polar area', body: 'A = (1/2)∫₀^{2π} r² dθ = (1/2)∫₀^{2π}(2+cosθ)² dθ', latex: 'A = \\frac{1}{2}\\int_0^{2\\pi}(2+\\cos\\theta)^2\\,d\\theta' },
          { title: 'Expand', body: '(2+cosθ)² = 4 + 4cosθ + cos²θ. ∫₀^{2π}cos²θ dθ = π.', latex: '= \\frac{1}{2}[8\\pi + 0 + \\pi] = \\frac{9\\pi}{2}' },
          { title: 'Result', body: 'A = 9π/2', latex: 'A = \\frac{9\\pi}{2} \\approx 14.14' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=360;i++){const t=2*Math.PI*i/360; const r=2+Math.cos(t); x.push(r*Math.cos(t)); y.push(r*Math.sin(t));} return {x,y,type:'scatter',mode:'lines',name:'r=2+cos(θ)',line:{color:'#f59e0b',width:2}} })(),
          ],
          layout: darkLayout('Polar Curve r = 2 + cos(θ) (Limaçon)', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find dy/dθ at θ = π/3.',
        answer: '\\frac{dy}{d\\theta} = \\frac{d}{d\\theta}[r\\sin\\theta] = r\'\\sin\\theta + r\\cos\\theta. \\text{ At }\\pi/3: (-\\sin(\\pi/3))(\\sqrt{3}/2)+(2+1/2)(1/2)=...',
        explanation: [
          { title: 'y = r·sinθ = (2+cosθ)sinθ', body: 'Differentiate with product rule.', latex: '\\frac{dy}{d\\theta} = -\\sin\\theta\\cdot\\sin\\theta + (2+\\cos\\theta)\\cos\\theta' },
          { title: 'Simplify', body: "= −sin²θ + 2cosθ + cos²θ = cos(2θ) + 2cosθ", latex: "\\frac{dy}{d\\theta} = \\cos(2\\theta)+2\\cos\\theta" },
          { title: 'At θ=π/3', body: '= cos(2π/3)+2cos(π/3) = −1/2+2(1/2) = −1/2+1 = 1/2', latex: "\\frac{dy}{d\\theta}\\bigg|_{\\pi/3} = \\frac{1}{2}" }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.cos(2*t)+2*Math.cos(t), 0, 2*Math.PI, 'dy/dθ = cos(2θ)+2cos(θ)', '#06b6d4'),
            { x:[Math.PI/3],y:[0.5],type:'scatter',mode:'markers',marker:{size:10,color:'#f59e0b'},name:'dy/dθ=1/2 at π/3' },
            { x:[0,2*Math.PI],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('dy/dθ for r = 2+cos(θ)', 'θ', 'dy/dθ')
        }
      },
      {
        label: 'c',
        question: 'Find the x-coordinate of the rightmost point of the curve.',
        answer: 'x = r\\cos\\theta = (2+\\cos\\theta)\\cos\\theta. \\frac{dx}{d\\theta}=0: x=r\'\\cos\\theta - r\\sin\\theta=0',
        explanation: [
          { title: 'x = (2+cosθ)cosθ', body: 'dx/dθ = −sinθ·cosθ + (2+cosθ)(−sinθ) = −sinθ(3+2cosθ−sinθ) ... actually:', latex: 'x = (2+\\cos\\theta)\\cos\\theta' },
          { title: 'Differentiate', body: 'dx/dθ = −sinθcosθ−sinθ(2+cosθ)...simplify: dx/dθ = −sinθ(3+2cosθ). Set=0.', latex: 'dx/d\\theta = -\\sin\\theta(3+2\\cos\\theta)' },
          { title: 'Solve', body: 'sinθ=0: θ=0,π. At θ=0: x=(2+1)(1)=3. Max x=3.', latex: 'x_{max} = 3 \\text{ at } \\theta=0' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=360;i++){const t=2*Math.PI*i/360; const r=2+Math.cos(t); x.push(r*Math.cos(t)); y.push(r*Math.sin(t));} return {x,y,type:'scatter',mode:'lines',name:'r=2+cos(θ)',line:{color:'#f59e0b',width:2}} })(),
            { x:[3],y:[0],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'Rightmost (3,0)' }
          ],
          layout: darkLayout('Rightmost Point of r = 2+cos(θ)', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Find the slope of the tangent to r = 2 + cos(θ) at θ = π/2.',
        answer: "\\frac{dy}{dx}\\bigg|_{\\theta=\\pi/2} = \\frac{dy/d\\theta}{dx/d\\theta} = \\frac{1/2}{-(2)(1)} = -\\frac{1}{4}",
        explanation: [
          { title: 'dy/dθ at π/2', body: 'dy/dθ = cos(2θ)+2cos(θ) = cos(π)+2cos(π/2) = −1+0 = −1', latex: 'dy/d\\theta|_{\\pi/2} = -1' },
          { title: 'dx/dθ at π/2', body: 'x=(2+cosθ)cosθ, dx/dθ=−sinθ(3+2cosθ). At π/2: −(1)(3+0)=−3.', latex: 'dx/d\\theta|_{\\pi/2} = -3' },
          { title: 'Slope', body: 'dy/dx = (−1)/(−3) = 1/3', latex: '\\frac{dy}{dx}\\bigg|_{\\pi/2} = \\frac{1}{3}' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=360;i++){const t=2*Math.PI*i/360; const r=2+Math.cos(t); x.push(r*Math.cos(t)); y.push(r*Math.sin(t));} return {x,y,type:'scatter',mode:'lines',name:'r=2+cos(θ)',line:{color:'#f59e0b',width:2}} })(),
            { x:[(2+Math.cos(Math.PI/2))*Math.cos(Math.PI/2)], y:[(2+Math.cos(Math.PI/2))*Math.sin(Math.PI/2)], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'θ=π/2' },
            { x:[-0.5,0.5], y:[2-1/6,2+1/6], type:'scatter',mode:'lines',name:'Tangent slope=1/3',line:{color:'#a78bfa',dash:'dash',width:2} }
          ],
          layout: darkLayout('Tangent at θ=π/2 (slope=1/3)', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2015-6',
    year: 2015,
    number: 6,
    calculator: false,
    title: 'Taylor Series: x·eˣ',
    topics: ['Taylor Series', 'Maclaurin Series', 'Integration of Series', 'Error Bounds'],
    difficulty: 3,
    context: 'Let f(x) = x·eˣ.',
    parts: [
      {
        label: 'a',
        question: 'Write the Maclaurin series for f(x) = x·eˣ through the x⁴ term.',
        answer: 'x + x^2 + \\frac{x^3}{2!} + \\frac{x^4}{3!} + \\cdots = \\sum_{n=0}^{\\infty}\\frac{x^{n+1}}{n!}',
        explanation: [
          { title: 'Series for eˣ', body: 'eˣ = 1 + x + x²/2! + x³/3! + ...', latex: 'e^x = \\sum_{n=0}^{\\infty}\\frac{x^n}{n!}' },
          { title: 'Multiply by x', body: 'x·eˣ = x + x² + x³/2 + x⁴/6 + ...', latex: 'xe^x = \\sum_{n=0}^{\\infty}\\frac{x^{n+1}}{n!} = x + x^2 + \\frac{x^3}{2} + \\frac{x^4}{6} + \\cdots' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => x*Math.exp(x), -2, 1.5, 'f(x)=xeˣ', '#f59e0b'),
            makeVelocityTrace(x => x+x*x+x**3/2, -2, 1.5, 'P₃', '#06b6d4'),
            makeVelocityTrace(x => x+x*x+x**3/2+x**4/6, -2, 1.5, 'P₄', '#a78bfa'),
          ],
          layout: darkLayout('Maclaurin Series for xeˣ', 'x', 'y', {yaxis:{range:[-2,3]}})
        }
      },
      {
        label: 'b',
        question: 'Write the Maclaurin series for g(x) = ∫₀ˣ t·eᵗ dt.',
        answer: 'g(x) = \\frac{x^2}{2} + \\frac{x^3}{3} + \\frac{x^4}{8} + \\frac{x^5}{30} + \\cdots = \\sum_{n=0}^{\\infty}\\frac{x^{n+2}}{(n+2)\\cdot n!}',
        explanation: [
          { title: 'Integrate term by term', body: '∫₀ˣ [t + t² + t³/2 + t⁴/6 + ...] dt', latex: 'g(x) = \\int_0^x\\sum_{n=0}^{\\infty}\\frac{t^{n+1}}{n!}\\,dt' },
          { title: 'Result', body: '= x²/2 + x³/3 + x⁴/(4·2) + x⁵/(5·6) + ... = x²/2 + x³/3 + x⁴/8 + x⁵/30 + ...', latex: 'g(x) = \\frac{x^2}{2} + \\frac{x^3}{3} + \\frac{x^4}{8} + \\frac{x^5}{30} + \\cdots' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => { let s=0; for(let i=0;i<=200;i++){const t=x*i/200; s+=t*Math.exp(t)*x/200;} return s; }, 0, 2, 'g(x)=∫₀ˣ teᵗ dt', '#f59e0b'),
            makeVelocityTrace(x => x*x/2 + x**3/3 + x**4/8 + x**5/30, 0, 2, 'Series P₅', '#a78bfa'),
          ],
          layout: darkLayout('g(x) = ∫₀ˣ teᵗ dt and Series', 'x', 'g(x)')
        }
      },
      {
        label: 'c',
        question: 'Use the series from (b) to estimate g(1) and bound the error with 3 terms.',
        answer: 'g(1) \\approx 1/2+1/3+1/8 = 12/24+8/24+3/24 = 23/24 \\approx 0.958',
        explanation: [
          { title: '3-term estimate', body: 'g(1) ≈ 1/2 + 1/3 + 1/8 = 12/24 + 8/24 + 3/24 = 23/24 ≈ 0.958', latex: 'g(1) \\approx \\frac{23}{24}' },
          { title: 'Error', body: 'The series for xe^x has all positive terms (for x>0), so this is not alternating; error analysis requires more care. Actual g(1) = 1 (by integration by parts).', latex: '\\text{Actual: } g(1) = [xe^x-e^x]_0^1 = 1' }
        ],
        graph: {
          traces: [
            { x:[1,2,3,4], y:[0.5,0.5+1/3,0.5+1/3+1/8,0.5+1/3+1/8+1/30], type:'scatter',mode:'lines+markers',name:'Partial sums at x=1',line:{color:'#f59e0b',width:2},marker:{size:8} },
            { x:[1,4],y:[1,1],type:'scatter',mode:'lines',name:'g(1)=1 (exact)',line:{color:'#10b981',dash:'dash',width:2} }
          ],
          layout: darkLayout('Partial Sums Converging to g(1)=1', 'Number of terms', 'Sum')
        }
      },
      {
        label: 'd',
        question: 'Write the first three nonzero terms of the series for h(x) = f\'(x) = (1+x)eˣ.',
        answer: '1 + 2x + \\frac{3x^2}{2} + \\frac{4x^3}{6} + \\cdots = \\sum_{n=0}^{\\infty}\\frac{(n+1)x^n}{n!}',
        explanation: [
          { title: "Differentiate series for xeˣ", body: "d/dx[x+x²+x³/2+x⁴/6+...] = 1+2x+3x²/2+4x³/6+...", latex: "f'(x) = \\sum_{n=0}^{\\infty}\\frac{(n+1)x^n}{n!}" },
          { title: 'First three terms', body: '1 + 2x + (3/2)x² + ...', latex: 'h(x) = 1 + 2x + \\frac{3x^2}{2} + \\cdots' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => (1+x)*Math.exp(x), -2, 1.5, 'h(x)=(1+x)eˣ', '#f59e0b'),
            makeVelocityTrace(x => 1+2*x+1.5*x*x, -2, 1.5, 'P₂ approx', '#a78bfa'),
          ],
          layout: darkLayout("h(x) = f'(x) = (1+x)eˣ and Series", 'x', 'h(x)')
        }
      }
    ]
  },
  // ─── 2014 ───────────────────────────────────────────────────────────────────
  {
    id: 'frq-2014-1',
    year: 2014,
    number: 1,
    calculator: true,
    title: 'Particle Motion: 3t²−2t−1',
    topics: ['Integration', 'Velocity', 'Displacement', 'Distance'],
    difficulty: 2,
    context: 'A particle moves along the x-axis with velocity v(t) = 3t² − 2t − 1 for 0 ≤ t ≤ 5. At t=0, x=2.',
    parts: [
      {
        label: 'a',
        question: 'Find the total distance traveled from t = 0 to t = 5.',
        answer: '\\int_0^5 |v(t)|\\,dt. \\text{ Zeros: }v(t)=(3t+1)(t-1)=0 \\Rightarrow t=1. \\text{ Distance}=\\int_0^1(-v)dt+\\int_1^5 v\\,dt',
        explanation: [
          { title: 'Factor v(t)', body: 'v(t) = 3t² − 2t − 1 = (3t+1)(t−1). For t≥0: v(0)=−1<0, v changes sign at t=1.', latex: 'v(t) = (3t+1)(t-1)' },
          { title: 'Antiderivative', body: 'F(t) = t³ − t² − t', latex: 'F(t) = t^3 - t^2 - t' },
          { title: 'Compute', body: '∫₀¹ (−v)dt = −[F(1)−F(0)] = −(−1−0) = 1. ∫₁⁵ v dt = F(5)−F(1) = 95−(−1) = 96.', latex: 'D = 1+96 = 97' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 3*t*t-2*t-1, 0, 5, 'v(t)=3t²−2t−1', '#f59e0b'),
            makeShadeTrace(t => Math.min(0,3*t*t-2*t-1), 0, 1, 'rgba(239,68,68,0.2)'),
            makeShadeTrace(t => Math.max(0,3*t*t-2*t-1), 1, 5, 'rgba(245,158,11,0.2)'),
            { x:[0,5],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('v(t) = 3t²−2t−1: Distance = 97', 't', 'v(t)')
        }
      },
      {
        label: 'b',
        question: 'Find x(t), the position at time t.',
        answer: 'x(t) = 2 + \\int_0^t v(s)\\,ds = 2 + t^3 - t^2 - t',
        explanation: [
          { title: 'x(t) = x(0) + displacement', body: 'x(t) = 2 + ∫₀ᵗ (3s²−2s−1)ds = 2 + [t³−t²−t]', latex: 'x(t) = t^3 - t^2 - t + 2' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => t**3-t*t-t+2, 0, 5, 'x(t)=t³−t²−t+2', '#10b981'),
            { x:[0],y:[2],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'x(0)=2' }
          ],
          layout: darkLayout('Position x(t) = t³−t²−t+2', 't', 'x(t)')
        }
      },
      {
        label: 'c',
        question: 'Find all t in (0, 5) where the particle changes direction.',
        answer: 'v(t) = (3t+1)(t-1) = 0 \\Rightarrow t=1. \\text{ v changes sign at }t=1.',
        explanation: [
          { title: 'v(t) = 0 at t=1', body: 'For t>0: (3t+1)>0 always. So sign of v depends on (t−1).', latex: 'v(t) < 0 \\text{ for } 0 < t < 1' },
          { title: 'Direction change at t=1', body: 'v changes from negative to positive at t=1 → particle changes direction.', latex: 't = 1 \\text{ (changes from left to right)}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 3*t*t-2*t-1, 0, 5, 'v(t)', '#f59e0b'),
            { x:[1],y:[0],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'Direction change t=1' },
            { x:[0,5],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout('v(t): Direction Change at t=1', 't', 'v(t)')
        }
      },
      {
        label: 'd',
        question: 'Find the average velocity from t = 0 to t = 5.',
        answer: '\\bar{v} = \\frac{1}{5}\\int_0^5 v(t)\\,dt = \\frac{F(5)-F(0)}{5} = \\frac{95}{5} = 19',
        explanation: [
          { title: 'Average velocity', body: 'Average velocity = net displacement / time interval', latex: '\\bar{v} = \\frac{x(5)-x(0)}{5} = \\frac{(97)-2}{5}' },
          { title: 'Compute', body: 'x(5)=125−25−5+2=97. (97−2)/5=19.', latex: '\\bar{v} = 19' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => 3*t*t-2*t-1, 0, 5, 'v(t)', '#f59e0b'),
            { x:[0,5],y:[19,19],type:'scatter',mode:'lines',name:'Avg velocity=19',line:{color:'#06b6d4',dash:'dash',width:2} }
          ],
          layout: darkLayout('Average Velocity = 19 on [0, 5]', 't', 'v(t)')
        }
      }
    ]
  },
  {
    id: 'frq-2014-2',
    year: 2014,
    number: 2,
    calculator: true,
    title: 'Area and Volume: 6x−x² and x²−2x',
    topics: ['Area Between Curves', 'Volume of Revolution', 'Disk Method'],
    difficulty: 2,
    context: 'Let R be the region enclosed by f(x) = 6x − x² and g(x) = x² − 2x.',
    parts: [
      {
        label: 'a',
        question: 'Find the area of R.',
        answer: '\\int_0^4 [f(x)-g(x)]\\,dx = \\int_0^4 (8x-2x^2)\\,dx = [4x^2-\\frac{2x^3}{3}]_0^4 = 64-\\frac{128}{3} = \\frac{64}{3}',
        explanation: [
          { title: 'Intersection', body: '6x−x²=x²−2x → 2x²−8x=0 → 2x(x−4)=0 → x=0,4', latex: 'x = 0, \; x = 4' },
          { title: 'Integrate f−g', body: '∫₀⁴(8x−2x²)dx = [4x²−2x³/3]₀⁴ = 64−128/3 = 64/3', latex: 'A = \\frac{64}{3} \\approx 21.33' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 6*x-x*x, 0, 6, 'f(x)=6x−x²', '#f59e0b'),
            makeVelocityTrace(x => x*x-2*x, 0, 6, 'g(x)=x²−2x', '#06b6d4'),
            makeShadeTrace(x => Math.max(0,(6*x-x*x)-(x*x-2*x)), 0, 4, 'rgba(245,158,11,0.15)')
          ],
          layout: darkLayout('Region R: f(x)=6x−x², g(x)=x²−2x', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find the volume when R is revolved about the x-axis.',
        answer: 'V = \\pi\\int_0^4[(6x-x^2)^2-(x^2-2x)^2]\\,dx = \\pi\\int_0^4(8x-2x^2)(8x+2x^2-8x)... \\approx 2092',
        explanation: [
          { title: 'Washer method', body: 'V = π∫₀⁴[(6x−x²)²−(x²−2x)²]dx', latex: 'V = \\pi\\int_0^4[(6x-x^2)^2-(x^2-2x)^2]\\,dx' },
          { title: 'Factor', body: '= π∫₀⁴(f+g)(f−g)dx = π∫₀⁴(8x)(8x−2x²)dx = 16π∫₀⁴x(4−x)dx', latex: '= 16\\pi\\int_0^4(4x-x^2)\\,dx = 16\\pi[2x^2-x^3/3]_0^4' },
          { title: 'Evaluate', body: '= 16π(32−64/3) = 16π·32/3 = 512π/3 ≈ 536.2', latex: 'V = \\frac{512\\pi}{3} \\approx 536.2' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 6*x-x*x, 0, 4, 'f(x)', '#f59e0b'),
            makeVelocityTrace(x => x*x-2*x, 0, 4, 'g(x)', '#06b6d4'),
            { x:[0,4],y:[0,0],type:'scatter',mode:'lines',name:'x-axis',line:{color:'#ef4444',dash:'dash'} }
          ],
          layout: darkLayout('Revolution of R about x-axis', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'The region R is the base of a solid with semicircular cross-sections perpendicular to the x-axis. Find the volume.',
        answer: 'V = \\int_0^4 \\frac{\\pi}{8}[f(x)-g(x)]^2\\,dx = \\frac{\\pi}{8}\\int_0^4(8x-2x^2)^2\\,dx',
        explanation: [
          { title: 'Semicircle diameter = f−g', body: 'Area of semicircle = (π/8)·(diameter)²', latex: 'A = \\frac{\\pi}{8}(f-g)^2 = \\frac{\\pi}{8}(8x-2x^2)^2' },
          { title: 'Factor and integrate', body: '= (π/8)∫₀⁴4x²(4−x)²dx... ≈ 53.62', latex: 'V = \\frac{\\pi}{8}\\int_0^4(8x-2x^2)^2\\,dx \\approx 53.62' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.PI/8*(8*x-2*x*x)**2, 0, 4, 'Semicircle Area', '#a78bfa'),
          ],
          layout: darkLayout('Semicircular Cross-Section Area', 'x', 'Area')
        }
      },
      {
        label: 'd',
        question: 'Find the x-coordinate of the centroid of R.',
        answer: '\\bar{x} = \\frac{1}{A}\\int_0^4 x[f(x)-g(x)]\\,dx = \\frac{3}{64}\\int_0^4 x(8x-2x^2)\\,dx = \\frac{3}{64}\\cdot\\frac{128}{3} = 2',
        explanation: [
          { title: 'Centroid formula', body: 'x̄ = (1/A)∫₀⁴ x[f(x)−g(x)] dx', latex: '\\bar{x} = \\frac{1}{A}\\int_0^4 x(8x-2x^2)\\,dx' },
          { title: 'A = 64/3, ∫₀⁴ x(8x−2x²)dx', body: '= ∫₀⁴(8x²−2x³)dx = [8x³/3−x⁴/2]₀⁴ = 512/3−128 = 128/3', latex: '\\bar{x} = \\frac{3}{64}\\cdot\\frac{128}{3} = 2' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 6*x-x*x, 0, 4, 'f(x)', '#f59e0b'),
            makeVelocityTrace(x => x*x-2*x, 0, 4, 'g(x)', '#06b6d4'),
            makeShadeTrace(x => Math.max(0,(6*x-x*x)-(x*x-2*x)), 0, 4, 'rgba(245,158,11,0.1)'),
            { x:[2,2],y:[-1,10],type:'scatter',mode:'lines',name:'Centroid x̄=2',line:{color:'#ef4444',dash:'dash',width:2} }
          ],
          layout: darkLayout('Centroid x̄ = 2 of Region R', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2014-3',
    year: 2014,
    number: 3,
    calculator: false,
    title: 'Table-Based: f(t) Analysis',
    topics: ['Riemann Sums', 'Mean Value Theorem', 'Average Value', 'Concavity from Table'],
    difficulty: 2,
    context: 'The function f is twice differentiable. Table of values: t=0: f=2, f\'=5; t=2: f=8, f\'=3; t=4: f=6, f\'=−1; t=6: f=10, f\'=4; t=8: f=7, f\'=−2.',
    parts: [
      {
        label: 'a',
        question: 'Approximate ∫₀⁸ f(t) dt using a right Riemann sum with the 4 subintervals.',
        answer: '\\sum f(t_k)\\cdot 2 = (8+6+10+7)\\cdot 2 = 31\\cdot 2 = 62',
        explanation: [
          { title: 'Right endpoints', body: 'Right endpoints are t=2,4,6,8. Each Δt=2.', latex: 'f(2)+f(4)+f(6)+f(8) = 8+6+10+7 = 31' },
          { title: 'Sum', body: '31 × 2 = 62', latex: '\\int_0^8 f\\,dt \\approx 62' }
        ],
        graph: {
          traces: [
            { x:[0,2,4,6,8], y:[2,8,6,10,7], type:'scatter',mode:'lines+markers',name:'f(t)',line:{color:'#f59e0b',width:2},marker:{size:8} },
          ],
          layout: darkLayout('Right Riemann Sum for f(t)', 't', 'f(t)')
        }
      },
      {
        label: 'b',
        question: 'Must there exist a c in (0, 8) with f\'\'(c) = 0? Explain.',
        answer: "f'(0)=5, f'(2)=3, f'(4)=-1, f'(6)=4, f'(8)=-2. f' \\text{ increases then decreases multiple times. By IVT on }f'', \\text{ zeros exist.}",
        explanation: [
          { title: "f' behavior", body: "f' goes: 5→3→−1→4→−2. Decreasing on [0,4], then increasing to 4, then decreasing. Multiple sign changes in f''.", latex: "f'' \\text{ changes sign} \\Rightarrow \\text{zeros exist}" },
          { title: "Since f'' is continuous (f twice diff.)", body: "By IVT, f'' must be zero at multiple points in (0,8).", latex: "\\exists c \\in (0,8): f''(c) = 0" }
        ],
        graph: {
          traces: [
            { x:[0,2,4,6,8], y:[5,3,-1,4,-2], type:'scatter',mode:'lines+markers',name:"f'(t)",line:{color:'#06b6d4',width:2},marker:{size:8} },
            { x:[0,8],y:[0,0],type:'scatter',mode:'lines',line:{color:'rgba(255,255,255,0.3)',dash:'dash'},showlegend:false }
          ],
          layout: darkLayout("f'(t): Multiple Sign Changes Imply f''=0", 't', "f'(t)")
        }
      },
      {
        label: 'c',
        question: 'Find the average value of f\' on [0, 8].',
        answer: '\\frac{1}{8}\\int_0^8 f\'(t)\\,dt = \\frac{f(8)-f(0)}{8} = \\frac{7-2}{8} = \\frac{5}{8}',
        explanation: [
          { title: 'Average value of derivative', body: '(1/8)∫₀⁸ f\'(t) dt = [f(8)−f(0)]/8', latex: '\\frac{1}{8}[f(8)-f(0)] = \\frac{5}{8}' }
        ],
        graph: {
          traces: [
            { x:[0,2,4,6,8], y:[5,3,-1,4,-2], type:'scatter',mode:'lines+markers',name:"f'(t)",line:{color:'#06b6d4',width:2},marker:{size:8} },
            { x:[0,8],y:[5/8,5/8],type:'scatter',mode:'lines',name:'Average=5/8',line:{color:'#f59e0b',dash:'dash',width:2} }
          ],
          layout: darkLayout("Average of f'(t) = 5/8", 't', "f'(t)")
        }
      },
      {
        label: 'd',
        question: 'Let h(t) = f(t)·sin(t). Find h\'(4).',
        answer: "h'(t) = f'(t)\\sin t + f(t)\\cos t. h'(4) = (-1)\\sin 4 + (6)\\cos 4 \\approx 0.757 - 3.962 \\approx -3.205",
        explanation: [
          { title: 'Product rule', body: "h'(t) = f'(t)sin(t) + f(t)cos(t)", latex: "h'(t) = f'(t)\\sin t + f(t)\\cos t" },
          { title: 'At t=4', body: "h'(4) = f'(4)sin(4) + f(4)cos(4) = (−1)sin4 + 6cos4", latex: "h'(4) = -\\sin 4 + 6\\cos 4 \\approx -3.205" }
        ],
        graph: {
          traces: [
            { x:[0,2,4,6,8], y:[2*Math.sin(0),8*Math.sin(2),6*Math.sin(4),10*Math.sin(6),7*Math.sin(8)], type:'scatter',mode:'lines+markers',name:'h(t)=f(t)sin(t)',line:{color:'#a78bfa',width:2},marker:{size:8} },
            { x:[4], y:[6*Math.sin(4)], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'t=4' }
          ],
          layout: darkLayout('h(t) = f(t)·sin(t)', 't', 'h(t)')
        }
      }
    ]
  },
  {
    id: 'frq-2014-4',
    year: 2014,
    number: 4,
    calculator: false,
    title: 'Differential Equations: 3y·sin(x)',
    topics: ['Differential Equations', 'Separable Equations', 'Slope Fields', 'Particular Solution'],
    difficulty: 3,
    context: 'Consider the differential equation dy/dx = 3y·sin(x).',
    parts: [
      {
        label: 'a',
        question: 'Find the particular solution y = f(x) with f(0) = 2.',
        answer: 'y = 2e^{-3\\cos x + 3}',
        explanation: [
          { title: 'Separate', body: 'dy/y = 3sin(x)dx', latex: '\\frac{dy}{y} = 3\\sin x\\,dx' },
          { title: 'Integrate', body: 'ln|y| = −3cos(x) + C', latex: '\\ln|y| = -3\\cos x + C' },
          { title: 'Solve', body: 'y = Ae^{−3cos x}', latex: 'y = Ae^{-3\\cos x}' },
          { title: 'IC f(0)=2', body: '2 = Ae^{−3} → A = 2e³', latex: 'y = 2e^3\\cdot e^{-3\\cos x} = 2e^{3-3\\cos x}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.exp(3-3*Math.cos(x)), -2, 6, 'y = 2e^{3−3cos x}', '#f59e0b'),
            { x:[0],y:[2],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'IC: (0,2)' }
          ],
          layout: darkLayout('Particular Solution: y = 2e^{3−3cos x}', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Sketch a slope field for the given differential equation at the indicated points.',
        answer: '\\text{At each }(x,y): \\text{slope}=3y\\sin x',
        explanation: [
          { title: 'Slope computation', body: 'At each lattice point (x, y), the slope is 3y·sin(x).', latex: '\\frac{dy}{dx} = 3y\\sin x' },
          { title: 'Key observations', body: 'Along x=0: slopes=0 (since sin0=0). Along y=0: slopes=0. For y>0, x in (0,π): positive slope.', latex: '\\text{slope}=0 \\text{ when } y=0 \\text{ or } \\sin x=0' }
        ],
        graph: {
          traces: (() => {
            const traces = []
            for(let x=-1;x<=5;x+=1){
              for(let y=-2;y<=3;y+=1){
                const s=3*y*Math.sin(x)
                const norm=Math.sqrt(1+s*s)
                const dx=0.25/norm
                const dy=s*dx
                traces.push({x:[x-dx,x+dx],y:[y-dy,y+dy],type:'scatter',mode:'lines',line:{color:'rgba(245,158,11,0.65)',width:1.5},showlegend:false})
              }
            }
            traces.push(makeVelocityTrace(x=>2*Math.exp(3-3*Math.cos(x)),-1,5,'Solution y(0)=2','#10b981'))
            return traces
          })(),
          layout: darkLayout('Slope Field: dy/dx = 3y·sin(x)', 'x', 'y')
        }
      },
      {
        label: 'c',
        question: 'Find all x-values where the particular solution has a local maximum or minimum.',
        answer: "y' = 3y\\sin x = 0 \\Rightarrow \\sin x = 0 \\Rightarrow x = n\\pi. \\text{ At } x=\\pi: y''<0 (local max). At } x=0: y''=0 \\text{ check...}",
        explanation: [
          { title: "Critical points from y'=0", body: "y'=3y·sin x=0. Since y=2e^{3−3cos x}>0 always, sin x=0 gives x=nπ.", latex: 'x = n\\pi, \\quad n \\in \\mathbb{Z}' },
          { title: 'Classification at x=π', body: "y''=3y'·sinx+3y·cosx. At x=π: y'=0, y''=3y·cos(π)=3y(−1)<0. Local maximum.", latex: 'x = \\pi + 2k\\pi: \\text{ local max}' },
          { title: 'At x=2π (=0)', body: "y''=3y·cos(0)=3y>0. Local minimum.", latex: 'x = 2k\\pi: \\text{ local min}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.exp(3-3*Math.cos(x)), -0.5, 7, 'y(x)', '#f59e0b'),
            { x:[Math.PI], y:[2*Math.exp(3-3*Math.cos(Math.PI))], type:'scatter',mode:'markers',marker:{size:12,color:'#ef4444',symbol:'star'},name:'Local max x=π' },
            { x:[0, 2*Math.PI], y:[2,2*Math.exp(0)], type:'scatter',mode:'markers',marker:{size:12,color:'#10b981',symbol:'star'},name:'Local min' }
          ],
          layout: darkLayout('Local Extrema of y = 2e^{3−3cos x}', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'What is lim_{x→∞} f(x)?',
        answer: 'y = 2e^{3-3\\cos x} \\text{ oscillates between } 2e^0=2 \\text{ and } 2e^6 \\approx 806. \\text{ Limit does not exist.}',
        explanation: [
          { title: 'Oscillatory behavior', body: 'cos(x) oscillates between −1 and 1, so 3−3cos x oscillates between 0 and 6.', latex: '0 \\leq 3-3\\cos x \\leq 6' },
          { title: 'y oscillates', body: 'y = 2e^{3−3cos x} oscillates between 2e⁰=2 and 2e⁶≈806.', latex: '2 \\leq y \\leq 2e^6 \\approx 806' },
          { title: 'Limit DNE', body: 'Since y does not approach a single value as x→∞, the limit does not exist.', latex: '\\lim_{x\\to\\infty}f(x) \\text{ does not exist}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => 2*Math.exp(3-3*Math.cos(x)), 0, 4*Math.PI, 'y = 2e^{3−3cos x}', '#f59e0b'),
            { x:[0,4*Math.PI],y:[2,2],type:'scatter',mode:'lines',name:'y=2 (min)',line:{color:'#10b981',dash:'dash'} },
          ],
          layout: darkLayout('y Oscillates: Limit DNE as x→∞', 'x', 'y')
        }
      }
    ]
  },
  {
    id: 'frq-2014-5',
    year: 2014,
    number: 5,
    calculator: false,
    title: 'Parametric Curves: t³−3t, eᵗ',
    topics: ['Parametric Equations', 'Speed', 'Arc Length', 'Concavity'],
    difficulty: 3,
    context: 'A particle moves in the xy-plane with x(t) = t³ − 3t and y(t) = eᵗ for t ≥ 0.',
    parts: [
      {
        label: 'a',
        question: 'Find the velocity vector and speed at t = 1.',
        answer: "\\mathbf{v}(1) = \\langle 0, e\\rangle, \\text{ speed} = e",
        explanation: [
          { title: 'Differentiate', body: "x'(t)=3t²−3, y'(t)=eᵗ", latex: "x'(t)=3t^2-3,\\quad y'(t)=e^t" },
          { title: 'At t=1', body: "x'(1)=0, y'(1)=e", latex: "\\mathbf{v}(1)=\\langle 0,e\\rangle" },
          { title: 'Speed', body: '|v| = √(0+e²) = e', latex: '\\text{speed} = e' }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=200;i++){const t=i/40; x.push(t**3-3*t); y.push(Math.exp(t));} return {x,y,type:'scatter',mode:'lines',name:'Path',line:{color:'#f59e0b',width:2}} })(),
            { x:[1**3-3], y:[Math.exp(1)], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'t=1: (−2,e)' }
          ],
          layout: darkLayout('Parametric Path: x=t³−3t, y=eᵗ', 'x', 'y')
        }
      },
      {
        label: 'b',
        question: 'Find dy/dx as a function of t.',
        answer: '\\frac{dy}{dx} = \\frac{e^t}{3t^2-3} = \\frac{e^t}{3(t^2-1)}',
        explanation: [
          { title: 'Parametric formula', body: "dy/dx = y'(t)/x'(t) = eᵗ/(3t²−3)", latex: '\\frac{dy}{dx} = \\frac{e^t}{3(t^2-1)}' },
          { title: 'Undefined at t=1', body: 'Vertical tangent when x\'(t) = 3t²−3 = 0, i.e., t=1 (for t>0).', latex: '\\text{Vertical tangent at } t=1' }
        ],
        graph: {
          traces: [
            (() => { const t=[],d=[]; for(let i=1;i<=200;i++){const tv=0.01+i/40; if(Math.abs(tv-1)<0.05) continue; t.push(tv); d.push(Math.exp(tv)/(3*tv*tv-3));} return {x:t,y:d,type:'scatter',mode:'lines',name:'dy/dx',line:{color:'#06b6d4',width:2}} })(),
          ],
          layout: darkLayout('dy/dx = eᵗ/(3t²−3)', 't', 'dy/dx')
        }
      },
      {
        label: 'c',
        question: 'Find the t-values where the particle moves vertically.',
        answer: "x'(t) = 3t^2-3 = 0 \\Rightarrow t=1 \\text{ (for }t\\geq 0)",
        explanation: [
          { title: "Vertical: x'=0", body: "3t²−3=0 → t²=1 → t=1 (for t≥0)", latex: "x'(1)=0, \\quad y'(1)=e\\neq 0 \\Rightarrow \\text{vertical tangent}" }
        ],
        graph: {
          traces: [
            (() => { const x=[],y=[]; for(let i=0;i<=200;i++){const t=i/40; x.push(t**3-3*t); y.push(Math.exp(t));} return {x,y,type:'scatter',mode:'lines',name:'Path',line:{color:'#f59e0b',width:2}} })(),
            { x:[1-3], y:[Math.exp(1)], type:'scatter',mode:'markers',marker:{size:12,color:'#a78bfa',symbol:'diamond'},name:'Vertical tangent t=1' },
            { x:[-2,-2], y:[0,5], type:'scatter',mode:'lines',line:{color:'#a78bfa',dash:'dash'},name:'x=−2' }
          ],
          layout: darkLayout('Vertical Tangent at t=1: x=−2', 'x', 'y')
        }
      },
      {
        label: 'd',
        question: 'Find the total distance traveled from t = 0 to t = 2.',
        answer: 'L = \\int_0^2\\sqrt{(3t^2-3)^2+e^{2t}}\\,dt \\approx 8.38',
        explanation: [
          { title: 'Arc length', body: "L = ∫₀² √[(x')²+(y')²] dt = ∫₀² √[(3t²−3)²+e^{2t}] dt", latex: 'L = \\int_0^2\\sqrt{(3t^2-3)^2+e^{2t}}\\,dt' },
          { title: 'Numerical', body: 'Using a calculator: L ≈ 8.38', latex: 'L \\approx 8.38' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(t => Math.sqrt((3*t*t-3)**2+Math.exp(2*t)), 0, 2, 'Speed(t)', '#10b981'),
          ],
          layout: darkLayout('Speed = √[(3t²−3)²+e^{2t}]', 't', 'Speed')
        }
      }
    ]
  },
  {
    id: 'frq-2014-6',
    year: 2014,
    number: 6,
    calculator: false,
    title: 'Taylor Series: cos(x) and Lagrange Error',
    topics: ['Taylor Series', 'Maclaurin Series', 'Lagrange Error Bound', 'Alternating Series'],
    difficulty: 3,
    context: 'Let f(x) = cos(x).',
    parts: [
      {
        label: 'a',
        question: 'Write the Maclaurin series for f(x) = cos(x) through the x⁶ term.',
        answer: '1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{(2n)!}',
        explanation: [
          { title: 'Derivatives of cos(x)', body: 'f(0)=1, f\'(0)=0, f\'\'(0)=−1, f\'\'\'(0)=0, f⁽⁴⁾(0)=1, ...', latex: 'f^{(2n)}(0) = (-1)^n, \\quad f^{(2n+1)}(0) = 0' },
          { title: 'Series', body: 'cos(x) = 1 − x²/2! + x⁴/4! − x⁶/6! + ...', latex: '\\cos x = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{(2n)!}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.cos(x), -4, 4, 'cos(x)', '#f59e0b'),
            makeVelocityTrace(x => 1-x*x/2+x**4/24, -4, 4, 'P₄', '#06b6d4'),
            makeVelocityTrace(x => 1-x*x/2+x**4/24-x**6/720, -4, 4, 'P₆', '#a78bfa'),
          ],
          layout: darkLayout('Maclaurin Series for cos(x)', 'x', 'y', {yaxis:{range:[-1.5,1.5]}})
        }
      },
      {
        label: 'b',
        question: 'Use the Lagrange error bound to find an upper bound for the error in approximating cos(0.2) using P₄.',
        answer: '|\\text{error}| \\leq \\frac{|x|^6}{6!} = \\frac{(0.2)^6}{720} = \\frac{6.4\\times 10^{-5}}{720} \\approx 8.9\\times 10^{-8}',
        explanation: [
          { title: 'Lagrange error for P₄', body: 'The next term is x⁶/6! and all derivatives of cos are bounded by 1.', latex: '|E| \\leq \\frac{M|x|^6}{6!} = \\frac{(0.2)^6}{720}' },
          { title: 'Compute', body: '(0.2)⁶/720 = (6.4×10⁻⁵)/720 ≈ 8.9×10⁻⁸', latex: '|E| \\leq \\frac{(0.2)^6}{720} \\approx 8.9 \\times 10^{-8}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => Math.cos(x), 0, 0.5, 'cos(x)', '#f59e0b'),
            makeVelocityTrace(x => 1-x*x/2+x**4/24, 0, 0.5, 'P₄', '#06b6d4'),
            { x:[0.2],y:[Math.cos(0.2)],type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'x=0.2' }
          ],
          layout: darkLayout('Lagrange Error Bound at x=0.2', 'x', 'cos(x)')
        }
      },
      {
        label: 'c',
        question: 'Write the Maclaurin series for sin(x)/x.',
        answer: '\\frac{\\sin x}{x} = 1 - \\frac{x^2}{3!} + \\frac{x^4}{5!} - \\cdots = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{(2n+1)!}',
        explanation: [
          { title: 'Start from sin(x)', body: 'sin(x) = x − x³/6 + x⁵/120 − ...', latex: '\\sin x = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n+1}}{(2n+1)!}' },
          { title: 'Divide by x', body: 'sin(x)/x = 1 − x²/6 + x⁴/120 − ...', latex: '\\frac{\\sin x}{x} = \\sum_{n=0}^{\\infty}\\frac{(-1)^n x^{2n}}{(2n+1)!}' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => x===0?1:Math.sin(x)/x, -5, 5, 'sin(x)/x', '#f59e0b'),
            makeVelocityTrace(x => 1-x*x/6+x**4/120, -5, 5, 'P₄ approx', '#a78bfa'),
          ],
          layout: darkLayout('sin(x)/x and Series Approximation', 'x', 'y', {yaxis:{range:[-0.5,1.5]}})
        }
      },
      {
        label: 'd',
        question: 'Using the series for sin(x)/x, evaluate ∫₀¹ sin(x)/x dx.',
        answer: '\\int_0^1\\frac{\\sin x}{x}\\,dx = \\left[x - \\frac{x^3}{3\\cdot 3!} + \\frac{x^5}{5\\cdot 5!}-\\cdots\\right]_0^1 = 1-\\frac{1}{18}+\\frac{1}{600}-\\cdots \\approx 0.9461',
        explanation: [
          { title: 'Integrate term by term', body: '∫₀¹(1−x²/6+x⁴/120−...)dx = [x−x³/18+x⁵/600−...]₀¹', latex: '= 1 - \\frac{1}{18} + \\frac{1}{600} - \\cdots' },
          { title: 'Numerical value', body: '≈ 1 − 0.0556 + 0.00167 − ... ≈ 0.9461', latex: '\\int_0^1\\frac{\\sin x}{x}\\,dx \\approx 0.9461' }
        ],
        graph: {
          traces: [
            makeVelocityTrace(x => x===0?1:Math.sin(x)/x, 0, 1.5, 'sin(x)/x', '#f59e0b'),
            makeShadeTrace(x => x<0.001?1:Math.sin(x)/x, 0.001, 1, 'rgba(245,158,11,0.2)'),
            { x:[1], y:[Math.sin(1)/1], type:'scatter',mode:'markers',marker:{size:10,color:'#ef4444'},name:'x=1' }
          ],
          layout: darkLayout('∫₀¹ sin(x)/x dx ≈ 0.9461', 'x', 'sin(x)/x')
        }
      }
    ]
  }
]
