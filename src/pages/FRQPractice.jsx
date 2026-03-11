import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Plot from 'react-plotly.js'
import { InlineMath, BlockMath } from 'react-katex'
import { FRQ_PROBLEMS, FRQ_YEARS } from '../data/frqProblems'
import styles from './FRQPractice.module.css'

const VIEWED_KEY = 'frq-viewed'

function getViewed() {
  try {
    return JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]')
  } catch {
    return []
  }
}

function markViewed(id) {
  try {
    const viewed = getViewed()
    if (!viewed.includes(id)) {
      localStorage.setItem(VIEWED_KEY, JSON.stringify([...viewed, id]))
    }
  } catch {}
}

function DifficultyDots({ level }) {
  return (
    <div className={styles.diffDots}>
      {[1, 2, 3].map(d => (
        <div key={d} className={`${styles.dot} ${d <= level ? styles.dotFilled : ''}`} />
      ))}
    </div>
  )
}

function SafeMath({ latex, block }) {
  if (!latex) return null
  try {
    if (block) return <BlockMath math={latex} />
    return <InlineMath math={latex} />
  } catch {
    return <span className={styles.mathFallback}>{latex}</span>
  }
}

function GraphView({ graph }) {
  if (!graph || !graph.traces || graph.traces.length === 0) return null
  return (
    <div className={styles.graphContainer}>
      <Plot
        data={graph.traces}
        layout={{
          ...graph.layout,
          autosize: true,
          height: 280,
          margin: { t: 40, b: 50, l: 55, r: 20 },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  )
}

function SolutionStep({ step, index }) {
  return (
    <motion.div
      className={styles.solutionStep}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className={styles.stepNum}>{index + 1}</div>
      <div className={styles.stepContent}>
        <div className={styles.stepTitle}>{step.title}</div>
        {step.body && <p className={styles.stepBody}>{step.body}</p>}
        {step.latex && (
          <div className={styles.stepLatex}>
            <SafeMath latex={step.latex} block />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ProblemView({ problem, onBack }) {
  const [activePart, setActivePart] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  const part = problem.parts[activePart]

  useEffect(() => {
    setShowSolution(false)
  }, [activePart])

  useEffect(() => {
    markViewed(problem.id)
  }, [problem.id])

  return (
    <div className={styles.problemView}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← All FRQs
        </button>
        <div className={styles.headerMeta}>
          <span className={styles.yearBadge}>{problem.year}</span>
          <span className={styles.numberTag}>
            FRQ #{problem.number} · {problem.calculator ? '📱 Calculator' : '🚫 No Calculator'}
          </span>
        </div>
        <h1 className={styles.problemTitle}>{problem.title}</h1>
      </div>

      {/* Two-column layout */}
      <div className={styles.twoCol}>
        {/* LEFT: context + graph */}
        <div className={styles.leftCol}>
          <div className={styles.contextCard}>
            <div className={styles.contextLabel}>Problem Context</div>
            <p className={styles.contextText}>{problem.context}</p>
          </div>

          {part?.graph && (
            <motion.div
              key={`graph-${problem.id}-${activePart}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GraphView graph={part.graph} />
            </motion.div>
          )}

          <div className={styles.topicConnection}>
            <span className={styles.connLabel}>Topics covered:</span>
            {problem.topics.map(t => (
              <span key={t} className={styles.topicTag}>{t}</span>
            ))}
          </div>
        </div>

        {/* RIGHT: parts + solution */}
        <div className={styles.rightCol}>
          {/* Part tabs */}
          <div className={styles.partTabs}>
            {problem.parts.map((p, i) => (
              <button
                key={p.label}
                className={`${styles.partTab} ${i === activePart ? styles.partTabActive : ''}`}
                onClick={() => setActivePart(i)}
              >
                Part {p.label.toUpperCase()}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${problem.id}-${activePart}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={styles.partContent}
            >
              {/* Question */}
              <div className={styles.questionBox}>
                <div className={styles.questionLabel}>Question (Part {part.label.toUpperCase()})</div>
                <div className={styles.questionText}>
                  {part.question}
                </div>
                {part.answer && (
                  <div className={styles.answerPreview}>
                    <span className={styles.answerLabel}>Answer:</span>
                    <SafeMath latex={part.answer} block />
                  </div>
                )}
              </div>

              {/* Show/Hide Solution */}
              <button
                className={styles.solutionToggle}
                onClick={() => setShowSolution(s => !s)}
              >
                {showSolution ? 'Hide Solution ↑' : 'Show Solution ↓'}
              </button>

              <AnimatePresence>
                {showSolution && (
                  <motion.div
                    className={styles.solutionSteps}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.solutionHeader}>Step-by-step Solution</div>
                    {part.explanation?.map((step, i) => (
                      <SolutionStep key={i} step={step} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Part navigation */}
              <div className={styles.partNav}>
                {activePart > 0 && (
                  <button
                    className={styles.partNavBtn}
                    onClick={() => setActivePart(activePart - 1)}
                  >
                    ← Part {problem.parts[activePart - 1].label.toUpperCase()}
                  </button>
                )}
                {activePart < problem.parts.length - 1 && (
                  <button
                    className={`${styles.partNavBtn} ${styles.partNavBtnRight}`}
                    onClick={() => { setActivePart(activePart + 1); setShowSolution(false) }}
                  >
                    Part {problem.parts[activePart + 1].label.toUpperCase()} →
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function ProblemCard({ problem, onClick, viewed }) {
  return (
    <motion.button
      className={`${styles.card} ${viewed ? styles.cardViewed : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.cardTop}>
        <span className={styles.cardYear}>{problem.year}</span>
        <span className={styles.cardCalc}>
          {problem.calculator ? '📱 Calc' : '🚫 No Calc'}
        </span>
        {viewed && <span className={styles.viewedBadge}>✓ Viewed</span>}
      </div>
      <div className={styles.cardNum}>FRQ #{problem.number}</div>
      <div className={styles.cardTitle}>{problem.title}</div>
      <div className={styles.cardTopics}>
        {problem.topics.slice(0, 3).map(t => (
          <span key={t} className={styles.topicChip}>{t}</span>
        ))}
      </div>
      <div className={styles.cardBottom}>
        <DifficultyDots level={problem.difficulty} />
        <span className={styles.viewSolution}>View Solution →</span>
      </div>
    </motion.button>
  )
}

export default function FRQPractice({ onBack }) {
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [yearFilter, setYearFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewed, setViewed] = useState(getViewed())

  const filtered = FRQ_PROBLEMS.filter(p => {
    if (yearFilter !== 'all' && p.year !== Number(yearFilter)) return false
    if (typeFilter === 'calculator' && !p.calculator) return false
    if (typeFilter === 'nocalc' && p.calculator) return false
    return true
  })

  function handleSelectProblem(problem) {
    setSelectedProblem(problem)
    markViewed(problem.id)
    setViewed(getViewed())
  }

  if (selectedProblem) {
    return (
      <motion.div
        key="problem"
        className={styles.page}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.35 }}
      >
        <ProblemView
          problem={selectedProblem}
          onBack={() => setSelectedProblem(null)}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Home
        </button>
        <div>
          <h1 className={styles.pageTitle}>AP Calculus BC · Free Response</h1>
          <p className={styles.pageSubtitle}>
            Past AP exam questions with full worked solutions and interactive visualizations
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}><strong>6</strong> Years</div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}><strong>36</strong> Problems</div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}><strong>Calculator</strong> & No-Calculator</div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}><strong>{viewed.length}</strong> Viewed</div>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Year:</span>
          {['all', ...FRQ_YEARS.map(String)].map(y => (
            <button
              key={y}
              className={`${styles.filterBtn} ${yearFilter === y ? styles.filterBtnActive : ''}`}
              onClick={() => setYearFilter(y)}
            >
              {y === 'all' ? 'All' : y}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Type:</span>
          {[
            { value: 'all', label: 'All' },
            { value: 'calculator', label: 'Calculator' },
            { value: 'nocalc', label: 'No Calculator' },
          ].map(opt => (
            <button
              key={opt.value}
              className={`${styles.filterBtn} ${typeFilter === opt.value ? styles.filterBtnActive : ''}`}
              onClick={() => setTypeFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        className={styles.grid}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {filtered.map(problem => (
          <motion.div
            key={problem.id}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              show: { opacity: 1, y: 0, scale: 1 }
            }}
          >
            <ProblemCard
              problem={problem}
              onClick={() => handleSelectProblem(problem)}
              viewed={viewed.includes(problem.id)}
            />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.emptyState}>No problems match the current filters.</div>
        )}
      </motion.div>
    </motion.div>
  )
}
